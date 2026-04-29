-- CreateTable
CREATE TABLE "ProductFlavor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductFlavor_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN "flavorId" INTEGER;
ALTER TABLE "OrderItem" ADD COLUMN "flavorName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ProductFlavor_productId_name_key" ON "ProductFlavor"("productId", "name");
CREATE INDEX "ProductFlavor_productId_active_idx" ON "ProductFlavor"("productId", "active");
CREATE INDEX "OrderItem_flavorId_idx" ON "OrderItem"("flavorId");

-- AddForeignKey
ALTER TABLE "ProductFlavor" ADD CONSTRAINT "ProductFlavor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_flavorId_fkey" FOREIGN KEY ("flavorId") REFERENCES "ProductFlavor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
