-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('delivery', 'pickup');

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "fulfillmentType" "FulfillmentType" NOT NULL DEFAULT 'delivery',
ALTER COLUMN "customerAddress" DROP NOT NULL;
