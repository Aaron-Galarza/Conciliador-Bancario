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
exports.ReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const reconciliation_engine_1 = require("./reconciliation.engine");
const client_1 = require("@prisma/client");
let ReconciliationService = class ReconciliationService {
    prisma;
    engine;
    constructor(prisma, engine) {
        this.prisma = prisma;
        this.engine = engine;
    }
    async runAutoReconciliation() {
        return this.engine.runAutoReconciliation();
    }
    async reconcileSale(saleId) {
        return this.engine.reconcileSale(saleId);
    }
    async findAll(status) {
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
    async findOne(id) {
        const recon = await this.prisma.reconciliation.findUnique({
            where: { id },
            include: {
                sale: true,
                settlement: true,
                bankMovement: true,
            },
        });
        if (!recon)
            throw new common_1.NotFoundException(`Conciliación ${id} no encontrada`);
        return recon;
    }
    async manualReconcile(id, notes, resolvedBy) {
        return this.engine.manualReconcile(id, notes, resolvedBy);
    }
    async getDashboardSummary() {
        const [total, auto, manual, difference, pending] = await Promise.all([
            this.prisma.reconciliation.count(),
            this.prisma.reconciliation.count({ where: { status: client_1.ReconciliationStatus.AUTO_RECONCILED } }),
            this.prisma.reconciliation.count({ where: { status: client_1.ReconciliationStatus.MANUALLY_RECONCILED } }),
            this.prisma.reconciliation.count({ where: { status: client_1.ReconciliationStatus.DIFFERENCE_DETECTED } }),
            this.prisma.reconciliation.count({ where: { status: client_1.ReconciliationStatus.PENDING } }),
        ]);
        const differenceTotal = await this.prisma.reconciliation.aggregate({
            where: { status: client_1.ReconciliationStatus.DIFFERENCE_DETECTED },
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
};
exports.ReconciliationService = ReconciliationService;
exports.ReconciliationService = ReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        reconciliation_engine_1.ReconciliationEngine])
], ReconciliationService);
//# sourceMappingURL=reconciliation.service.js.map