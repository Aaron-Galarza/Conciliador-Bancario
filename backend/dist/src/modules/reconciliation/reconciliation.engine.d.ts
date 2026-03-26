import { PrismaService } from '../../prisma/prisma.service';
import { RulesService } from '../rules/rules.service';
import { Prisma } from '@prisma/client';
export declare class ReconciliationEngine {
    private prisma;
    private rulesService;
    private readonly logger;
    constructor(prisma: PrismaService, rulesService: RulesService);
    runAutoReconciliation(): Promise<{
        processed: number;
        reconciled: number;
        pending: number;
        differences: number;
    }>;
    reconcileSale(saleId: string): Promise<{
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReconciliationStatus;
        saleId: string | null;
        settlementId: string | null;
        bankMovementId: string | null;
        expectedNet: Prisma.Decimal | null;
        actualNet: Prisma.Decimal | null;
        differenceAmount: Prisma.Decimal | null;
        differencePercent: Prisma.Decimal | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
    }>;
    manualReconcile(reconciliationId: string, notes: string, resolvedBy: string): Promise<{
        sale: {
            id: string;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            invoiceNumber: string;
            date: Date;
            amount: Prisma.Decimal;
            currency: string;
            source: import("@prisma/client").$Enums.DataSource;
            status: import("@prisma/client").$Enums.SaleStatus;
            externalId: string | null;
        } | null;
        settlement: {
            id: string;
            processor: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            currency: string;
            reference: string | null;
            grossAmount: Prisma.Decimal;
            commission: Prisma.Decimal;
            taxRetention: Prisma.Decimal;
            financingCost: Prisma.Decimal;
            otherDeductions: Prisma.Decimal;
            netAmount: Prisma.Decimal;
        } | null;
        bankMovement: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            amount: Prisma.Decimal;
            currency: string;
            reference: string | null;
            description: string;
            bankAccount: string;
        } | null;
    } & {
        id: string;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ReconciliationStatus;
        saleId: string | null;
        settlementId: string | null;
        bankMovementId: string | null;
        expectedNet: Prisma.Decimal | null;
        actualNet: Prisma.Decimal | null;
        differenceAmount: Prisma.Decimal | null;
        differencePercent: Prisma.Decimal | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
    }>;
}
