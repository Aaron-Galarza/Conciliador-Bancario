import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';

@ApiTags('Reglas de Conciliación')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear regla de conciliación' })
  create(@Body() dto: CreateRuleDto) {
    return this.rulesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar reglas activas' })
  findAll() {
    return this.rulesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar regla' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateRuleDto>) {
    return this.rulesService.update(id, dto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Desactivar regla' })
  deactivate(@Param('id') id: string) {
    return this.rulesService.deactivate(id);
  }
}
