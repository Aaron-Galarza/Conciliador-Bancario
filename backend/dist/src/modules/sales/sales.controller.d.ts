import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleStatus } from '@prisma/client';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(dto: CreateSaleDto): Promise<{
        id: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        date: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        source: import("@prisma/client").$Enums.DataSource;
        status: import("@prisma/client").$Enums.SaleStatus;
        externalId: string | null;
    }>;
    findAll(status?: SaleStatus): Promise<({
        reconciliation: ({
            settlement: {
                id: string;
                processor: string;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                currency: string;
                reference: string | null;
                grossAmount: import("@prisma/client-runtime-utils").Decimal;
                commission: import("@prisma/client-runtime-utils").Decimal;
                taxRetention: import("@prisma/client-runtime-utils").Decimal;
                financingCost: import("@prisma/client-runtime-utils").Decimal;
                otherDeductions: import("@prisma/client-runtime-utils").Decimal;
                netAmount: import("@prisma/client-runtime-utils").Decimal;
            } | null;
            bankMovement: {
                id: string;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
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
            expectedNet: import("@prisma/client-runtime-utils").Decimal | null;
            actualNet: import("@prisma/client-runtime-utils").Decimal | null;
            differenceAmount: import("@prisma/client-runtime-utils").Decimal | null;
            differencePercent: import("@prisma/client-runtime-utils").Decimal | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
        }) | null;
    } & {
        id: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        date: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        source: import("@prisma/client").$Enums.DataSource;
        status: import("@prisma/client").$Enums.SaleStatus;
        externalId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        reconciliation: ({
            settlement: {
                id: string;
                processor: string;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                currency: string;
                reference: string | null;
                grossAmount: import("@prisma/client-runtime-utils").Decimal;
                commission: import("@prisma/client-runtime-utils").Decimal;
                taxRetention: import("@prisma/client-runtime-utils").Decimal;
                financingCost: import("@prisma/client-runtime-utils").Decimal;
                otherDeductions: import("@prisma/client-runtime-utils").Decimal;
                netAmount: import("@prisma/client-runtime-utils").Decimal;
            } | null;
            bankMovement: {
                id: string;
                notes: string | null;
                createdAt: Date;
                updatedAt: Date;
                date: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
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
            expectedNet: import("@prisma/client-runtime-utils").Decimal | null;
            actualNet: import("@prisma/client-runtime-utils").Decimal | null;
            differenceAmount: import("@prisma/client-runtime-utils").Decimal | null;
            differencePercent: import("@prisma/client-runtime-utils").Decimal | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
        }) | null;
    } & {
        id: string;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        invoiceNumber: string;
        date: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        source: import("@prisma/client").$Enums.DataSource;
        status: import("@prisma/client").$Enums.SaleStatus;
        externalId: string | null;
    }>;
}
