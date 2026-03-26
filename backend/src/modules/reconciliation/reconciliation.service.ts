import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReconciliationEngine } from './reconciliation.engine';
import { ReconciliationStatus } from '@prisma/client';

@Injectable()
export class ReconciliationService {
  constructor(
    private prisma: PrismaService,
    private engine: ReconciliationEngine,
  ) {}

  async runAutoReconciliation() {
    return this.engine.runAutoReconciliation();
  }

  async reconcileSale(saleId: string) {
    return this.engine.reconcileSale(saleId);
  }

  async findAll(status?: ReconciliationStatus) {
    return this.prisma.reconciliation.findMany({
      where: status ? { status } : undefined,
      include: {
        sale: true,
        settlement: true,
        bankMovement: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const recon = await this.prisma.reconciliation.findUnique({
      where: { id },
      include: {
        sale: true,
        settlement: true,
        bankMovement: true,
      },
    });
    if (!recon) throw new NotFoundException(`Conciliación ${id} no encontrada`);
    return recon;
  }

  async manualReconcile(id: string, notes: string, resolvedBy: string) {
    return this.engine.manualReconcile(id, notes, resolvedBy);
  }

  async getDashboardSummary() {
    const [total, auto, manual, difference, pending] = await Promise.all([
      this.prisma.reconciliation.count(),
      this.prisma.reconciliation.count({ where: { status: ReconciliationStatus.AUTO_RECONCILED } }),
      this.prisma.reconciliation.count({ where: { status: ReconciliationStatus.MANUALLY_RECONCILED } }),
      this.prisma.reconciliation.count({ where: { status: ReconciliationStatus.DIFFERENCE_DETECTED } }),
      this.prisma.reconciliation.count({ where: { status: ReconciliationStatus.PENDING } }),
    ]);

    const differenceTotal = await this.prisma.reconciliation.aggregate({
      where: { status: ReconciliationStatus.DIFFERENCE_DETECTED },
      _sum: { differenceAmount: true },
    });

    return {
      total,
      auto,
      manual,
      difference,
      pending,
      totalDifferenceAmount: differenceTotal._sum.differenceAmount ?? 0,
    };
  }
}
