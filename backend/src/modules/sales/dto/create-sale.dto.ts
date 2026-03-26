import { IsString, IsDateString, IsNumber, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, DataSource } from '@prisma/client';

export class CreateSaleDto {
  @ApiProperty({ example: 'FAC-45821' })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({ example: '2024-04-12T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({ example: 'ARS' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CREDIT_CARD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: DataSource, example: DataSource.ARGESTION })
  @IsEnum(DataSource)
  source: DataSource;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
