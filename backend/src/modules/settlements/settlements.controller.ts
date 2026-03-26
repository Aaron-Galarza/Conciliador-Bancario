import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@ApiTags('Liquidaciones')
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una liquidación' })
  create(@Body() dto: CreateSettlementDto) {
    return this.settlementsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar liquidaciones' })
  findAll() {
    return this.settlementsService.findAll();
  }

  @Get('unmatched')
  @ApiOperation({ summary: 'Liquidaciones sin venta asociada' })
  findUnmatched() {
    return this.settlementsService.findUnmatched();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver liquidación con trazabilidad' })
  findOne(@Param('id') id: string) {
    return this.settlementsService.findOne(id);
  }
}
