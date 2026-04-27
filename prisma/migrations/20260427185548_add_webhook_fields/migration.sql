-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "opa_delivered_at" TIMESTAMPTZ(6),
ADD COLUMN     "opa_last_webhook_at" TIMESTAMPTZ(6),
ADD COLUMN     "opa_read_at" TIMESTAMPTZ(6),
ADD COLUMN     "opa_replied_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "leads_opa_template_sent_id_idx" ON "leads"("opa_template_sent_id");
