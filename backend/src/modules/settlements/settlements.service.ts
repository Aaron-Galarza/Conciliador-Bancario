import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';

@Injectable()
export class SettlementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSettlementDto) {
    return this.prisma.settlement.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        commission: dto.commission ?? 0,
        taxRetention: dto.taxRetention ?? 0,
        financingCost: dto.financingCost ?? 0,
        otherDeductions: dto.otherDeductions ?? 0,
      },
    });
  }

  async findAll() {
    return this.prisma.settlement.findMany({
      include: {
        reconciliation: {
          include: {
            sale: true,
            bankMovement: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const settlement = await this.prisma.settlement.findUnique({
      where: { id },
      include: {
        reconciliation: {
          include: {
            sale: true,
            bankMovement: true,
          },
        },
      },
    });
    if (!settlement) throw new NotFoundException(`Liquidación ${id} no encontrada`);
    return settlement;
  }

  async findUnmatched() {
    return this.prisma.settlement.findMany({
      where: { reconciliation: null },
      orderBy: { date: 'desc' },
    });
  }
}
