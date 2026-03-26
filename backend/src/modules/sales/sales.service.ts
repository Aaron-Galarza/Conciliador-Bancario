import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleStatus } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSaleDto) {
    return this.prisma.sale.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        amount: dto.amount,
      },
    });
  }

  async findAll(status?: SaleStatus) {
    return this.prisma.sale.findMany({
      where: status ? { status } : undefined,
      include: {
        reconciliation: {
          include: {
            settlement: true,
            bankMovement: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        reconciliation: {
          include: {
            settlement: true,
            bankMovement: true,
          },
        },
      },
    });
    if (!sale) throw new NotFoundException(`Venta ${id} no encontrada`);
    return sale;
  }

  async updateStatus(id: string, status: SaleStatus) {
    return this.prisma.sale.update({
      where: { id },
      data: { status },
    });
  }
}
