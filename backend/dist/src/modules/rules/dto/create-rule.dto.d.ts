import { PaymentMethod } from '@prisma/client';
export declare class CreateRuleDto {
    name: string;
    paymentMethod: PaymentMethod;
    processor?: string;
    commissionPercent: number;
    taxRetentionPercent?: number;
    financingCostPercent?: number;
    toleranceDays?: number;
    toleranceAmountPercent?: number;
    notes?: string;
}
