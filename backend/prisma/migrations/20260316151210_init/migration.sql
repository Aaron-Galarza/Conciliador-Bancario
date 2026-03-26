-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'QR', 'MARKETPLACE', 'ACCOUNT_RECEIVABLE');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'SETTLED', 'RECONCILED');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('PENDING', 'AUTO_RECONCILED', 'MANUALLY_RECONCILED', 'DIFFERENCE_DETECTED');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('ARGESTION', 'POSBERRY', 'MANUAL', 'IMPORT');

-- CreateTable
CREATE TABLE "sales" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "source" "DataSource" NOT NULL,
    "status" "SaleStatus" NOT NULL DEFAULT 'PENDING',
    "externalId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settlements" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "processor" TEXT NOT NULL,
    "reference" TEXT,
    "grossAmount" DECIMAL(15,2) NOT NULL,
    "commission" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "taxRetention" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "financingCost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settlements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_movements" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "bankAccount" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliations" (
    "id" TEXT NOT NULL,
    "status" "ReconciliationStatus" NOT NULL DEFAULT 'PENDING',
    "saleId" TEXT,
    "settlementId" TEXT,
    "bankMovementId" TEXT,
    "expectedNet" DECIMAL(15,2),
    "actualNet" DECIMAL(15,2),
    "differenceAmount" DECIMAL(15,2),
    "differencePercent" DECIMAL(8,4),
    "notes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reconciliation_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "processor" TEXT,
    "commissionPercent" DECIMAL(8,4) NOT NULL,
    "taxRetentionPercent" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "financingCostPercent" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "toleranceDays" INTEGER NOT NULL DEFAULT 7,
    "toleranceAmountPercent" DECIMAL(8,4) NOT NULL DEFAULT 0.5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reconciliation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoiceNumber_key" ON "sales"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliations_saleId_key" ON "reconciliations"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliations_settlementId_key" ON "reconciliations"("settlementId");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliations_bankMovementId_key" ON "reconciliations"("bankMovementId");

-- CreateIndex
CREATE UNIQUE INDEX "reconciliation_rules_paymentMethod_processor_key" ON "reconciliation_rules"("paymentMethod", "processor");

-- AddForeignKey
ALTER TABLE "reconciliations" ADD CONSTRAINT "reconciliations_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliations" ADD CONSTRAINT "reconciliations_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "settlements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconciliations" ADD CONSTRAINT "reconciliations_bankMovementId_fkey" FOREIGN KEY ("bankMovementId") REFERENCES "bank_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;
