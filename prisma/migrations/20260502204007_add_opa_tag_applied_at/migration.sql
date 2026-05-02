-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "opa_tag_applied_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "leads_opa_tag_applied_at_idx" ON "leads"("opa_tag_applied_at");
