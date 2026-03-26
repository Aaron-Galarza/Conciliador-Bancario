import { IsString, IsDateString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBankMovementDto {
  @ApiProperty({ example: '2024-04-19T00:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 114600 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'liquidación adquirente tarjetas' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'VISA-0419-001' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty({ example: 'CA 0000-123456789' })
  @IsString()
  bankAccount: string;

  @ApiPropertyOptional({ example: 'ARS' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
