import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SalesModule } from './modules/sales/sales.module';
import { SettlementsModule } from './modules/settlements/settlements.module';
import { BankMovementsModule } from './modules/bank-movements/bank-movements.module';
import { RulesModule } from './modules/rules/rules.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { ImportsModule } from './modules/imports/imports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SalesModule,
    SettlementsModule,
    BankMovementsModule,
    RulesModule,
    ReconciliationModule,
    ImportsModule,
  ],
})
export class AppModule {}
