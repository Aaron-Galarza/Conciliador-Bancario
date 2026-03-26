import { PaymentMethod, DataSource } from '@prisma/client';
export declare class CreateSaleDto {
    invoiceNumber: string;
    date: string;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    source: DataSource;
    externalId?: string;
    notes?: string;
}
