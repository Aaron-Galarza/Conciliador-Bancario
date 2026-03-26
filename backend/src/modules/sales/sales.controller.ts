import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleStatus } from '@prisma/client';

@ApiTags('Ventas')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una venta' })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ventas' })
  @ApiQuery({ name: 'status', enum: SaleStatus, required: false })
  findAll(@Query('status') status?: SaleStatus) {
    return this.salesService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver venta con toda su trazabilidad' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
}
