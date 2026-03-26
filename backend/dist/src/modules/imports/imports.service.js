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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ImportsService = class ImportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importFromJson(data) {
        const results = {
            sales: { imported: 0, skipped: 0, errors: [] },
            settlements: { imported: 0, skipped: 0, errors: [] },
            bankMovements: { imported: 0, skipped: 0, errors: [] },
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
                            paymentMethod: raw.paymentMethod,
                            source: raw.source,
                            externalId: raw.externalId,
                            notes: raw.notes,
                        },
                    });
                    results.sales.imported++;
                }
                catch (e) {
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
                }
                catch (e) {
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
                }
                catch (e) {
                    results.bankMovements.skipped++;
                    results.bankMovements.errors.push(`${raw.description}: ${e.message}`);
                }
            }
        }
        return results;
    }
};
exports.ImportsService = ImportsService;
exports.ImportsService = ImportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportsService);
//# sourceMappingURL=imports.service.js.map