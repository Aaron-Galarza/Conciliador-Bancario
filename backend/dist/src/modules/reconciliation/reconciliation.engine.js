"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReconciliationEngine_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationEngine = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const rules_service_1 = require("../rules/rules.service");
const client_1 = require("@prisma/client");
const TOLERANCE_AMOUNT_PERCENT_DEFAULT = 0.5;
let ReconciliationEngine = ReconciliationEngine_1 = class ReconciliationEngine {
    prisma;
    rulesService;
    logger = new common_1.Logger(ReconciliationEngine_1.name);
    constructor(prisma, rulesService) {
        this.prisma = prisma;
        this.rulesService = rulesService;
    }
    async runAutoReconciliation() {
        const pendingSales = await this.prisma.sale.findMany({
            where: {
                status: { in: [client_1.SaleStatus.PENDING, client_1.SaleStatus.SETTLED] },
                reconciliation: null,
            },
        });
        let reconciled = 0;
        let pending = 0;
        let differences = 0;
        for (const sale of pendingSales) {
            const result = await this.reconcileSale(sale.id);
            if (result.status === client_1.ReconciliationStatus.AUTO_RECONCILED)
                reconciled++;
            else if (result.status === client_1.ReconciliationStatus.DIFFERENCE_DETECTED)
                differences++;
            else
                pending++;
        }
        return { processed: pendingSales.length, reconciled, pending, differences };
    }
    async reconcileSale(saleId) {
        const sale = await this.prisma.sale.findUnique({ where: { id: saleId } });
        if (!sale)
            throw new Error(`Venta ${saleId} no encontrada`);
        const rule = await this.rulesService.findByPaymentMethod(sale.paymentMethod);
        const toleranceDays = rule?.toleranceDays ?? 10;
        const toleranceAmountPercent = Number(rule?.toleranceAmountPercent ?? TOLERANCE_AMOUNT_PERCENT_DEFAULT);
        const saleDate = new Date(sale.date);
        const dateFrom = new Date(saleDate);
        dateFrom.setDate(dateFrom.getDate() - 2);
        const dateTo = new Date(saleDate);
        dateTo.setDate(dateTo.getDate() + toleranceDays);
        const saleAmount = Number(sale.amount);
        const amountMin = saleAmount * (1 - toleranceAmountPercent / 100);
        const amountMax = saleAmount * (1 + toleranceAmountPercent / 100);
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
            const recon = await this.prisma.reconciliation.create({
                data: {
                    saleId: sale.id,
                    status: client_1.ReconciliationStatus.PENDING,
                    notes: 'Sin liquidación encontrada',
                },
            });
            this.logger.log(`Venta ${sale.invoiceNumber} → PENDING (sin liquidación)`);
            return recon;
        }
        const settlement = matchingSettlements[0];
        const grossAmount = Number(settlement.grossAmount);
        const commissionPct = Number(rule?.commissionPercent ?? 0);
        const taxRetentionPct = Number(rule?.taxRetentionPercent ?? 0);
        const financingCostPct = Number(rule?.financingCostPercent ?? 0);
        const expectedCommission = grossAmount * (commissionPct / 100);
        const expectedTax = grossAmount * (taxRetentionPct / 100);
        const expectedFinancing = grossAmount * (financingCostPct / 100);
        const expectedNet = grossAmount - expectedCommission - expectedTax - expectedFinancing;
        const actualNet = Number(settlement.netAmount);
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
        const differenceAmount = actualNet - expectedNet;
        const differencePercent = expectedNet !== 0
            ? Math.abs(differenceAmount / expectedNet) * 100
            : 0;
        const maxTolerancePct = toleranceAmountPercent + commissionPct + taxRetentionPct + financingCostPct + 2;
        let status;
        if (!bankMovement) {
            status = client_1.ReconciliationStatus.PENDING;
        }
        else if (Math.abs(differencePercent) <= maxTolerancePct) {
            status = client_1.ReconciliationStatus.AUTO_RECONCILED;
        }
        else {
            status = client_1.ReconciliationStatus.DIFFERENCE_DETECTED;
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
                resolvedAt: status === client_1.ReconciliationStatus.AUTO_RECONCILED ? new Date() : null,
                resolvedBy: status === client_1.ReconciliationStatus.AUTO_RECONCILED ? 'AUTO' : null,
                notes: status === client_1.ReconciliationStatus.DIFFERENCE_DETECTED
                    ? `Diferencia de ${differencePercent.toFixed(2)}% detectada (${differenceAmount.toFixed(2)} ARS)`
                    : null,
            },
            include: {
                sale: true,
                settlement: true,
                bankMovement: true,
            },
        });
        await this.prisma.sale.update({
            where: { id: sale.id },
            data: {
                status: status === client_1.ReconciliationStatus.AUTO_RECONCILED
                    ? client_1.SaleStatus.RECONCILED
                    : client_1.SaleStatus.SETTLED,
            },
        });
        this.logger.log(`Venta ${sale.invoiceNumber} → ${status}`);
        return recon;
    }
    async manualReconcile(reconciliationId, notes, resolvedBy) {
        const recon = await this.prisma.reconciliation.update({
            where: { id: reconciliationId },
            data: {
                status: client_1.ReconciliationStatus.MANUALLY_RECONCILED,
                resolvedAt: new Date(),
                resolvedBy,
                notes,
            },
            include: { sale: true, settlement: true, bankMovement: true },
        });
        if (recon.saleId) {
            await this.prisma.sale.update({
                where: { id: recon.saleId },
                data: { status: client_1.SaleStatus.RECONCILED },
            });
        }
        return recon;
    }
};
exports.ReconciliationEngine = ReconciliationEngine;
exports.ReconciliationEngine = ReconciliationEngine = ReconciliationEngine_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rules_service_1.RulesService])
], ReconciliationEngine);
//# sourceMappingURL=reconciliation.engine.js.map