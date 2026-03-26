import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreateRuleDto {
  @ApiProperty({ example: 'Visa crédito - Estándar' })
  @IsString()
  name: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'VISA' })
  @IsOptional()
  @IsString()
  processor?: string;

  @ApiProperty({ example: 3.0, description: 'Comisión en porcentaje (ej: 3 = 3%)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercent: number;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRetentionPercent?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  financingCostPercent?: number;

  @ApiPropertyOptional({ example: 7, description: 'Días de tolerancia para matching' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  toleranceDays?: number;

  @ApiPropertyOptional({ example: 0.5, description: 'Tolerancia en monto (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  toleranceAmountPercent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
