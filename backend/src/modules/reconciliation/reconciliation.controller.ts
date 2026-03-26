import { Controller, Get, Post, Param, Body, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReconciliationService } from './reconciliation.service';
import { ReconciliationStatus } from '@prisma/client';

@ApiTags('Conciliación')
@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Post('run')
  @ApiOperation({ summary: 'Ejecutar conciliación automática sobre todos los pendientes' })
  runAuto() {
    return this.reconciliationService.runAutoReconciliation();
  }

  @Post('sale/:saleId')
  @ApiOperation({ summary: 'Conciliar una venta específica' })
  reconcileSale(@Param('saleId') saleId: string) {
    return this.reconciliationService.reconcileSale(saleId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar conciliaciones' })
  @ApiQuery({ name: 'status', enum: ReconciliationStatus, required: false })
  findAll(@Query('status') status?: ReconciliationStatus) {
    return this.reconciliationService.findAll(status);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Resumen para dashboard' })
  getDashboard() {
    return this.reconciliationService.getDashboardSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ver conciliación completa con trazabilidad' })
  findOne(@Param('id') id: string) {
    return this.reconciliationService.findOne(id);
  }

  @Patch(':id/manual')
  @ApiOperation({ summary: 'Conciliar manualmente' })
  manualReconcile(
    @Param('id') id: string,
    @Body() body: { notes: string; resolvedBy: string },
  ) {
    return this.reconciliationService.manualReconcile(id, body.notes, body.resolvedBy);
  }
}
