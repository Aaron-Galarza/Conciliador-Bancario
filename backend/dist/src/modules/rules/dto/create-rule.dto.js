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
exports.CreateRuleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateRuleDto {
    name;
    paymentMethod;
    processor;
    commissionPercent;
    taxRetentionPercent;
    financingCostPercent;
    toleranceDays;
    toleranceAmountPercent;
    notes;
}
exports.CreateRuleDto = CreateRuleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Visa crédito - Estándar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRuleDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentMethod }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateRuleDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'VISA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRuleDto.prototype, "processor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3.0, description: 'Comisión en porcentaje (ej: 3 = 3%)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateRuleDto.prototype, "commissionPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuleDto.prototype, "taxRetentionPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuleDto.prototype, "financingCostPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7, description: 'Días de tolerancia para matching' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuleDto.prototype, "toleranceDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.5, description: 'Tolerancia en monto (%)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateRuleDto.prototype, "toleranceAmountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRuleDto.prototype, "notes", void 0);
//# sourceMappingURL=create-rule.dto.js.map