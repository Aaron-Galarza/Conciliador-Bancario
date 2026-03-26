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
exports.BankMovementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bank_movements_service_1 = require("./bank-movements.service");
const create_bank_movement_dto_1 = require("./dto/create-bank-movement.dto");
let BankMovementsController = class BankMovementsController {
    bankMovementsService;
    constructor(bankMovementsService) {
        this.bankMovementsService = bankMovementsService;
    }
    create(dto) {
        return this.bankMovementsService.create(dto);
    }
    findAll() {
        return this.bankMovementsService.findAll();
    }
    findUnmatched() {
        return this.bankMovementsService.findUnmatched();
    }
    findOne(id) {
        return this.bankMovementsService.findOne(id);
    }
};
exports.BankMovementsController = BankMovementsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar movimiento bancario' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bank_movement_dto_1.CreateBankMovementDto]),
    __metadata("design:returntype", void 0)
], BankMovementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar movimientos bancarios' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BankMovementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unmatched'),
    (0, swagger_1.ApiOperation)({ summary: 'Movimientos sin liquidación asociada' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BankMovementsController.prototype, "findUnmatched", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver movimiento con trazabilidad' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BankMovementsController.prototype, "findOne", null);
exports.BankMovementsController = BankMovementsController = __decorate([
    (0, swagger_1.ApiTags)('Movimientos Bancarios'),
    (0, common_1.Controller)('bank-movements'),
    __metadata("design:paramtypes", [bank_movements_service_1.BankMovementsService])
], BankMovementsController);
//# sourceMappingURL=bank-movements.controller.js.map