ALTER TABLE "Product" ADD COLUMN "originalPrice" DECIMAL(10,2);
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotion_price_check"
CHECK ("originalPrice" IS NULL OR ("price" > 0 AND "originalPrice" > "price"));
