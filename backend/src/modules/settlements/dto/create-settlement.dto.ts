import { IsString, IsDateString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettlementDto {
  @ApiProperty({ example: '2024-04-19T00:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'VISA' })
  @IsString()
  processor: string;

  @ApiPropertyOptional({ example: 'LIQ-2024-0419-001' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @IsPositive()
  grossAmount: number;

  @ApiPropertyOptional({ example: 3600 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;

  @ApiPropertyOptional({ example: 1800 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRetention?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  financingCost?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  otherDeductions?: number;

  @ApiProperty({ example: 114600 })
  @IsNumber()
  @IsPositive()
  netAmount: number;

  @ApiPropertyOptional({ example: 'ARS' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
