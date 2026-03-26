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
exports.CreateBankMovementDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBankMovementDto {
    date;
    amount;
    description;
    reference;
    bankAccount;
    currency;
    notes;
}
exports.CreateBankMovementDto = CreateBankMovementDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-04-19T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 114600 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateBankMovementDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'liquidación adquirente tarjetas' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'VISA-0419-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CA 0000-123456789' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "bankAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ARS' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankMovementDto.prototype, "notes", void 0);
//# sourceMappingURL=create-bank-movement.dto.js.map