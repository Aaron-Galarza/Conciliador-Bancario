import { PrismaService } from '../../prisma/prisma.service';
interface RawSale {
    invoiceNumber: string;
    date: string;
    amount: number;
    currency?: string;
    paymentMethod: string;
    source: string;
    externalId?: string;
    notes?: string;
}
interface RawSettlement {
    date: string;
    processor: string;
    reference?: string;
    grossAmount: number;
    commission?: number;
    taxRetention?: number;
    financingCost?: number;
    otherDeductions?: number;
    netAmount: number;
    currency?: string;
    notes?: string;
}
interface RawBankMovement {
    date: string;
    amount: number;
    description: string;
    reference?: string;
    bankAccount: string;
    currency?: string;
    notes?: string;
}
interface ImportData {
    sales?: RawSale[];
    settlements?: RawSettlement[];
    bankMovements?: RawBankMovement[];
}
export declare class ImportsService {
    private prisma;
    constructor(prisma: PrismaService);
    importFromJson(data: ImportData): Promise<{
        sales: {
            imported: number;
            skipped: number;
            errors: string[];
        };
        settlements: {
            imported: number;
            skipped: number;
            errors: string[];
        };
        bankMovements: {
            imported: number;
            skipped: number;
            errors: string[];
        };
    }>;
}
export {};
