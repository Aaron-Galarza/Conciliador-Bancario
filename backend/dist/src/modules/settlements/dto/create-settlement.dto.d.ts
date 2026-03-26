export declare class CreateSettlementDto {
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
