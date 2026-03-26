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
exports.CreateSaleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateSaleDto {
    invoiceNumber;
    date;
    amount;
    currency;
    paymentMethod;
    source;
    externalId;
    notes;
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'FAC-45821' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-04-12T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ARS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentMethod, example: client_1.PaymentMethod.CREDIT_CARD }),
    (0, class_validator_1.IsEnum)(client_1.PaymentMethod),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DataSource, example: client_1.DataSource.ARGESTION }),
    (0, class_validator_1.IsEnum)(client_1.DataSource),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "externalId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "notes", void 0);
//# sourceMappingURL=create-sale.dto.js.map