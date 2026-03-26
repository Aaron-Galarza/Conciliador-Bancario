import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class RulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRuleDto) {
    return this.prisma.reconciliationRule.create({ data: dto });
  }

  async findAll() {
    return this.prisma.reconciliationRule.findMany({
      where: { isActive: true },
      orderBy: { paymentMethod: 'asc' },
    });
  }

  async findByPaymentMethod(paymentMethod: PaymentMethod, processor?: string) {
    return this.prisma.reconciliationRule.findFirst({
      where: {
        paymentMethod,
        processor: processor ?? null,
        isActive: true,
      },
    });
  }

  async update(id: string, dto: Partial<CreateRuleDto>) {
    const rule = await this.prisma.reconciliationRule.findUnique({ where: { id } });
    if (!rule) throw new NotFoundException(`Regla ${id} no encontrada`);
    return this.prisma.reconciliationRule.update({ where: { id }, data: dto });
  }

  async deactivate(id: string) {
    return this.prisma.reconciliationRule.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
