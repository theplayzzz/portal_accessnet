-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "fbc" TEXT,
ADD COLUMN     "fbclid" TEXT,
ADD COLUMN     "fbp" TEXT,
ADD COLUMN     "gad_campaign_id" TEXT,
ADD COLUMN     "gad_source" TEXT,
ADD COLUMN     "gbraid" TEXT,
ADD COLUMN     "gclid" TEXT,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "landing_url" TEXT,
ADD COLUMN     "wbraid" TEXT;

-- CreateIndex
CREATE INDEX "leads_gclid_idx" ON "leads"("gclid");

-- CreateIndex
CREATE INDEX "leads_fbclid_idx" ON "leads"("fbclid");
