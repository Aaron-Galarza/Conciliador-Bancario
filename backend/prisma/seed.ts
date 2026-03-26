import { PrismaClient, PaymentMethod, DataSource } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaPg({
  connectionString: 'postgresql://postgres:admin@localhost:5432/conciliador?schema=public',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Limpiando base de datos...');
  await prisma.reconciliation.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.bankMovement.deleteMany();
  await prisma.reconciliationRule.deleteMany();

  const dataPath = path.join(__dirname, '../data/data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log('📋 Insertando reglas de conciliación...');
  for (const rule of data.rules) {
    await prisma.reconciliationRule.create({ data: rule });
  }
  console.log(`  ✅ ${data.rules.length} reglas creadas`);

  console.log('🛍️  Insertando ventas...');
  for (const sale of data.sales) {
    const { _scenario, ...saleData } = sale;
    await prisma.sale.create({
      data: {
        ...saleData,
        date: new Date(saleData.date),
        paymentMethod: saleData.paymentMethod as PaymentMethod,
        source: saleData.source as DataSource,
      },
    });
  }
  console.log(`  ✅ ${data.sales.length} ventas creadas`);

  console.log('💳 Insertando liquidaciones...');
  for (const settlement of data.settlements) {
    const { _scenario, ...settlementData } = settlement;
    await prisma.settlement.create({
      data: {
        ...settlementData,
        date: new Date(settlementData.date),
      },
    });
  }
  console.log(`  ✅ ${data.settlements.length} liquidaciones creadas`);

  console.log('🏦 Insertando movimientos bancarios...');
  for (const movement of data.bankMovements) {
    const { _scenario, ...movementData } = movement;
    await prisma.bankMovement.create({
      data: {
        ...movementData,
        date: new Date(movementData.date),
      },
    });
  }
  console.log(`  ✅ ${data.bankMovements.length} movimientos creados`);

  console.log('\n✅ Seed completado. Ahora podés llamar a POST /reconciliation/run para ejecutar la conciliación automática.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
