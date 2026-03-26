import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BankMovementsService } from './bank-movements.service';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';

@ApiTags('Movimientos Bancarios')
@Controller('bank-movements')
export class BankMovementsController {
  constructor(private readonly bankMovementsService: BankMovementsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar movimiento bancario' })
  create(@Body() dto: CreateBankMovementDto) {
    return this.bankMovementsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar movimientos bancarios' })
  findAll() {
    return this.bankMovementsService.findAll();
  }

  @Get('unmatched')
  @ApiOperation({ summary: 'Movimientos sin liquidación asociada' })
  findUnmatched() {
    return this.bankMovementsService.findUnmatched();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver movimiento con trazabilidad' })
  findOne(@Param('id') id: string) {
    return this.bankMovementsService.findOne(id);
  }
}
