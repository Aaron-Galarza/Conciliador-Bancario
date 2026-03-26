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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reconciliation_service_1 = require("./reconciliation.service");
const client_1 = require("@prisma/client");
let ReconciliationController = class ReconciliationController {
    reconciliationService;
    constructor(reconciliationService) {
        this.reconciliationService = reconciliationService;
    }
    runAuto() {
        return this.reconciliationService.runAutoReconciliation();
    }
    reconcileSale(saleId) {
        return this.reconciliationService.reconcileSale(saleId);
    }
    findAll(status) {
        return this.reconciliationService.findAll(status);
    }
    getDashboard() {
        return this.reconciliationService.getDashboardSummary();
    }
    findOne(id) {
        return this.reconciliationService.findOne(id);
    }
    manualReconcile(id, body) {
        return this.reconciliationService.manualReconcile(id, body.notes, body.resolvedBy);
    }
};
exports.ReconciliationController = ReconciliationController;
__decorate([
    (0, common_1.Post)('run'),
    (0, swagger_1.ApiOperation)({ summary: 'Ejecutar conciliación automática sobre todos los pendientes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "runAuto", null);
__decorate([
    (0, common_1.Post)('sale/:saleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Conciliar una venta específica' }),
    __param(0, (0, common_1.Param)('saleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "reconcileSale", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar conciliaciones' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.ReconciliationStatus, required: false }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen para dashboard' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver conciliación completa con trazabilidad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/manual'),
    (0, swagger_1.ApiOperation)({ summary: 'Conciliar manualmente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ReconciliationController.prototype, "manualReconcile", null);
exports.ReconciliationController = ReconciliationController = __decorate([
    (0, swagger_1.ApiTags)('Conciliación'),
    (0, common_1.Controller)('reconciliation'),
    __metadata("design:paramtypes", [reconciliation_service_1.ReconciliationService])
], ReconciliationController);
//# sourceMappingURL=reconciliation.controller.js.map