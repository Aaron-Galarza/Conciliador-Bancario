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
exports.SettlementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settlements_service_1 = require("./settlements.service");
const create_settlement_dto_1 = require("./dto/create-settlement.dto");
let SettlementsController = class SettlementsController {
    settlementsService;
    constructor(settlementsService) {
        this.settlementsService = settlementsService;
    }
    create(dto) {
        return this.settlementsService.create(dto);
    }
    findAll() {
        return this.settlementsService.findAll();
    }
    findUnmatched() {
        return this.settlementsService.findUnmatched();
    }
    findOne(id) {
        return this.settlementsService.findOne(id);
    }
};
exports.SettlementsController = SettlementsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una liquidación' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_settlement_dto_1.CreateSettlementDto]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar liquidaciones' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unmatched'),
    (0, swagger_1.ApiOperation)({ summary: 'Liquidaciones sin venta asociada' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findUnmatched", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver liquidación con trazabilidad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettlementsController.prototype, "findOne", null);
exports.SettlementsController = SettlementsController = __decorate([
    (0, swagger_1.ApiTags)('Liquidaciones'),
    (0, common_1.Controller)('settlements'),
    __metadata("design:paramtypes", [settlements_service_1.SettlementsService])
], SettlementsController);
//# sourceMappingURL=settlements.controller.js.map