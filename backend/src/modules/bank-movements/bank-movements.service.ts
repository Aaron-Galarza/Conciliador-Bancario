import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBankMovementDto } from './dto/create-bank-movement.dto';

@Injectable()
export class BankMovementsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBankMovementDto) {
    return this.prisma.bankMovement.create({
      data: {
        ...dto,
        date: new Date(dto.date),
      },
    });
  }

  async findAll() {
    return this.prisma.bankMovement.findMany({
      include: {
        reconciliation: {
          include: {
            sale: true,
            settlement: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const movement = await this.prisma.bankMovement.findUnique({
      where: { id },
      include: {
        reconciliation: {
          include: {
            sale: true,
            settlement: true,
          },
        },
      },
    });
    if (!movement) throw new NotFoundException(`Movimiento bancario ${id} no encontrado`);
    return movement;
  }

  async findUnmatched() {
    return this.prisma.bankMovement.findMany({
      where: { reconciliation: null },
      orderBy: { date: 'desc' },
    });
  }
}
