import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RulesService } from '../rules/rules.service';
import { ReconciliationStatus, SaleStatus, Prisma } from '@prisma/client';

const TOLERANCE_AMOUNT_PERCENT_DEFAULT = 0.5;

@Injectable()
export class ReconciliationEngine {
  private readonly logger = new Logger(ReconciliationEngine.name);

  constructor(
    private prisma: PrismaService,
    private rulesService: RulesService,
  ) {}

  /**
   * Runs the full automatic reconciliation for all pending sales
   */
  async runAutoReconciliation(): Promise<{ processed: number; reconciled: number; pending: number; differences: number }> {
    const pendingSales = await this.prisma.sale.findMany({
      where: {
        status: { in: [SaleStatus.PENDING, SaleStatus.SETTLED] },
        reconciliation: null,
      },
    });

    let reconciled = 0;
    let pending = 0;
    let differences = 0;

    for (const sale of pendingSales) {
      const result = await this.reconcileSale(sale.id);
      if (result.status === ReconciliationStatus.AUTO_RECONCILED) reconciled++;
      else if (result.status === ReconciliationStatus.DIFFERENCE_DETECTED) differences++;
      else pending++;
    }

    return { processed: pendingSales.length, reconciled, pending, differences };
  }

  /**
   * STEP 1: Find a matching settlement for a sale
   * Criteria: same payment method, similar gross amount, compatible date
   */
  async reconcileSale(saleId: string) {
    const sale = await this.prisma.sale.findUnique({ where: { id: saleId } });
    if (!sale) throw new Error(`Venta ${saleId} no encontrada`);

    const rule = await this.rulesService.findByPaymentMethod(sale.paymentMethod);
    const toleranceDays = rule?.toleranceDays ?? 10;
    const toleranceAmountPercent = Number(rule?.toleranceAmountPercent ?? TOLERANCE_AMOUNT_PERCENT_DEFAULT);

    // Date range for settlement matching
    const saleDate = new Date(sale.date);
    const dateFrom = new Date(saleDate);
    dateFrom.setDate(dateFrom.getDate() - 2);
    const dateTo = new Date(saleDate);
    dateTo.setDate(dateTo.getDate() + toleranceDays);

    // Amount tolerance
    const saleAmount = Number(sale.amount);
    const amountMin = saleAmount * (1 - toleranceAmountPercent / 100);
    const amountMax = saleAmount * (1 + toleranceAmountPercent / 100);

    // Find unmatched settlements within range
    const matchingSettlements = await this.prisma.settlement.findMany({
      where: {
        reconciliation: null,
        date: { gte: dateFrom, lte: dateTo },
        grossAmount: {
          gte: amountMin,
          lte: amountMax,
        },
      },
      orderBy: { date: 'asc' },
    });

    if (matchingSettlements.length === 0) {
      // No settlement found: create PENDING reconciliation
      const recon = await this.prisma.reconciliation.create({
        data: {
          saleId: sale.id,
          status: ReconciliationStatus.PENDING,
          notes: 'Sin liquidación encontrada',
        },
      });
      this.logger.log(`Venta ${sale.invoiceNumber} → PENDING (sin liquidación)`);
      return recon;
    }

    // Take the closest settlement by date
    const settlement = matchingSettlements[0];

    // STEP 2: Verify expected deductions
    const grossAmount = Number(settlement.grossAmount);
    const commissionPct = Number(rule?.commissionPercent ?? 0);
    const taxRetentionPct = Number(rule?.taxRetentionPercent ?? 0);
    const financingCostPct = Number(rule?.financingCostPercent ?? 0);

    const expectedCommission = grossAmount * (commissionPct / 100);
    const expectedTax = grossAmount * (taxRetentionPct / 100);
    const expectedFinancing = grossAmount * (financingCostPct / 100);
    const expectedNet = grossAmount - expectedCommission - expectedTax - expectedFinancing;
    const actualNet = Number(settlement.netAmount);

    // STEP 3: Find matching bank movement
    const settlementDate = new Date(settlement.date);
    const bankDateFrom = new Date(settlementDate);
    bankDateFrom.setDate(bankDateFrom.getDate() - 2);
    const bankDateTo = new Date(settlementDate);
    bankDateTo.setDate(bankDateTo.getDate() + 5);

    const netTolerance = actualNet * (toleranceAmountPercent / 100);

    const matchingBankMovements = await this.prisma.bankMovement.findMany({
      where: {
        reconciliation: null,
        date: { gte: bankDateFrom, lte: bankDateTo },
        amount: {
          gte: actualNet - netTolerance,
          lte: actualNet + netTolerance,
        },
      },
      orderBy: { date: 'asc' },
    });

    const bankMovement = matchingBankMovements[0] ?? null;

    // STEP 4: Determine status
    const differenceAmount = actualNet - expectedNet;
    const differencePercent = expectedNet !== 0
      ? Math.abs(differenceAmount / expectedNet) * 100
      : 0;
    const maxTolerancePct = toleranceAmountPercent + commissionPct + taxRetentionPct + financingCostPct + 2;

    let status: ReconciliationStatus;

    if (!bankMovement) {
      status = ReconciliationStatus.PENDING;
    } else if (Math.abs(differencePercent) <= maxTolerancePct) {
      status = ReconciliationStatus.AUTO_RECONCILED;
    } else {
      status = ReconciliationStatus.DIFFERENCE_DETECTED;
    }

    const recon = await this.prisma.reconciliation.create({
      data: {
        saleId: sale.id,
        settlementId: settlement.id,
        bankMovementId: bankMovement?.id ?? null,
        status,
        expectedNet,
        actualNet,
        differenceAmount,
        differencePercent,
        resolvedAt: status === ReconciliationStatus.AUTO_RECONCILED ? new Date() : null,
        resolvedBy: status === ReconciliationStatus.AUTO_RECONCILED ? 'AUTO' : null,
        notes: status === ReconciliationStatus.DIFFERENCE_DETECTED
          ? `Diferencia de ${differencePercent.toFixed(2)}% detectada (${differenceAmount.toFixed(2)} ARS)`
          : null,
      },
      include: {
        sale: true,
        settlement: true,
        bankMovement: true,
      },
    });

    // Update sale status
    await this.prisma.sale.update({
      where: { id: sale.id },
      data: {
        status: status === ReconciliationStatus.AUTO_RECONCILED
          ? SaleStatus.RECONCILED
          : SaleStatus.SETTLED,
      },
    });

    this.logger.log(`Venta ${sale.invoiceNumber} → ${status}`);
    return recon;
  }

  /**
   * Manual reconciliation override
   */
  async manualReconcile(reconciliationId: string, notes: string, resolvedBy: string) {
    const recon = await this.prisma.reconciliation.update({
      where: { id: reconciliationId },
      data: {
        status: ReconciliationStatus.MANUALLY_RECONCILED,
        resolvedAt: new Date(),
        resolvedBy,
        notes,
      },
      include: { sale: true, settlement: true, bankMovement: true },
    });

    if (recon.saleId) {
      await this.prisma.sale.update({
        where: { id: recon.saleId },
        data: { status: SaleStatus.RECONCILED },
      });
    }

    return recon;
  }
}
