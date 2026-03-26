"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: 'postgresql://postgres:admin@localhost:5432/conciliador?schema=public',
});
const prisma = new client_1.PrismaClient({ adapter });
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
                paymentMethod: saleData.paymentMethod,
                source: saleData.source,
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
//# sourceMappingURL=seed.js.map