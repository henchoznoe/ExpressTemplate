-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
