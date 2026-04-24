-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "source_page" TEXT,
    "source_cta" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "opa_contato_id" TEXT,
    "opa_template_sent_id" TEXT,
    "opa_status" TEXT,
    "opa_error" TEXT,
    "opa_attempts" INTEGER NOT NULL DEFAULT 0,
    "opa_last_attempt_at" TIMESTAMPTZ(6),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_transfer_logs" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lead_id" UUID,
    "correlation_id" TEXT,
    "request_payload" JSONB,
    "response_payload" JSONB,
    "http_status" INTEGER,
    "duration_ms" INTEGER,
    "error_message" TEXT,

    CONSTRAINT "data_transfer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_telefone_idx" ON "leads"("telefone");

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_opa_status_idx" ON "leads"("opa_status");

-- CreateIndex
CREATE INDEX "data_transfer_logs_created_at_idx" ON "data_transfer_logs"("created_at");

-- CreateIndex
CREATE INDEX "data_transfer_logs_lead_id_idx" ON "data_transfer_logs"("lead_id");

-- CreateIndex
CREATE INDEX "data_transfer_logs_event_type_idx" ON "data_transfer_logs"("event_type");

-- CreateIndex
CREATE INDEX "data_transfer_logs_correlation_id_idx" ON "data_transfer_logs"("correlation_id");

-- AddForeignKey
ALTER TABLE "data_transfer_logs" ADD CONSTRAINT "data_transfer_logs_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
