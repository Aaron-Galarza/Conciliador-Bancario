import { Module } from '@nestjs/common';
import { ReconciliationController } from './reconciliation.controller';
import { ReconciliationService } from './reconciliation.service';
import { ReconciliationEngine } from './reconciliation.engine';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [RulesModule],
  controllers: [ReconciliationController],
  providers: [ReconciliationService, ReconciliationEngine],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
