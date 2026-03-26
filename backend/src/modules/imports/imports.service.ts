import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DataSource, PaymentMethod } from '@prisma/client';

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

@Injectable()
export class ImportsService {
  constructor(private prisma: PrismaService) {}

  async importFromJson(data: ImportData) {
    const results = {
      sales: { imported: 0, skipped: 0, errors: [] as string[] },
      settlements: { imported: 0, skipped: 0, errors: [] as string[] },
      bankMovements: { imported: 0, skipped: 0, errors: [] as string[] },
    };

    if (data.sales) {
      for (const raw of data.sales) {
        try {
          await this.prisma.sale.upsert({
            where: { invoiceNumber: raw.invoiceNumber },
            update: {},
            create: {
              invoiceNumber: raw.invoiceNumber,
              date: new Date(raw.date),
              amount: raw.amount,
              currency: raw.currency ?? 'ARS',
              paymentMethod: raw.paymentMethod as PaymentMethod,
              source: raw.source as DataSource,
              externalId: raw.externalId,
              notes: raw.notes,
            },
          });
          results.sales.imported++;
        } catch (e) {
          results.sales.skipped++;
          results.sales.errors.push(`${raw.invoiceNumber}: ${e.message}`);
        }
      }
    }

    if (data.settlements) {
      for (const raw of data.settlements) {
        try {
          await this.prisma.settlement.create({
            data: {
              date: new Date(raw.date),
              processor: raw.processor,
              reference: raw.reference,
              grossAmount: raw.grossAmount,
              commission: raw.commission ?? 0,
              taxRetention: raw.taxRetention ?? 0,
              financingCost: raw.financingCost ?? 0,
              otherDeductions: raw.otherDeductions ?? 0,
              netAmount: raw.netAmount,
              currency: raw.currency ?? 'ARS',
              notes: raw.notes,
            },
          });
          results.settlements.imported++;
        } catch (e) {
          results.settlements.skipped++;
          results.settlements.errors.push(`${raw.processor} ${raw.date}: ${e.message}`);
        }
      }
    }

    if (data.bankMovements) {
      for (const raw of data.bankMovements) {
        try {
          await this.prisma.bankMovement.create({
            data: {
              date: new Date(raw.date),
              amount: raw.amount,
              description: raw.description,
              reference: raw.reference,
              bankAccount: raw.bankAccount,
              currency: raw.currency ?? 'ARS',
              notes: raw.notes,
            },
          });
          results.bankMovements.imported++;
        } catch (e) {
          results.bankMovements.skipped++;
          results.bankMovements.errors.push(`${raw.description}: ${e.message}`);
        }
      }
    }

    return results;
  }
}
