import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ImportsService } from './imports.service';

@ApiTags('Importación')
@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('json')
  @ApiOperation({ summary: 'Importar datos desde JSON (ventas, liquidaciones, movimientos)' })
  importJson(@Body() data: any) {
    return this.importsService.importFromJson(data);
  }
}
