-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_updated_at_id_idx" ON "Product"("updated_at" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Product_category_updated_at_id_idx" ON "Product"("category", "updated_at" DESC, "id" DESC);
