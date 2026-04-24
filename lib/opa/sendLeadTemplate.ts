import { randomBytes } from "node:crypto";
import { opaGet, opaPost } from "./client";
import {
  OPA_TEMPLATE_LEAD_ID,
  OPA_DEPARTAMENTO_COMERCIAL_ID,
} from "./constants";
import type {
  OpaContato,
  OpaCreateContatoInput,
  OpaTemplateSendInput,
  OpaTemplateSendResponse,
} from "./types";
import { logEvent } from "@/lib/logger";

const OPA_CANAL_WHATSAPP_ID = process.env.OPA_CANAL_WHATSAPP_ID;

export type SendLeadTemplateInput = {
  leadId: string;
  correlationId: string;
  nome: string;
  email: string;
  telefoneE164: string; // já normalizado (+55DDNNNNNNNNN)
  endereco: string;
  sourceCta?: string;
};

export type SendLeadTemplateResult =
  | {
      status: "sent";
      opaContatoId: string;
      opaTemplateSentId: string;
    }
  | {
      status: "failed";
      opaContatoId?: string;
      error: string;
      failedAt: "contato.search" | "contato.create" | "template.send";
    };

function randomPassword() {
  // Senha forte aleatória — o contato nunca faz login com isso.
  // Opa! exige maiúscula, minúscula, número e símbolo + tamanho mínimo.
  const bytes = randomBytes(12).toString("base64");
  return `L${bytes.replace(/[^a-zA-Z0-9]/g, "x")}@7!`;
}

function usernameFor(leadId: string, digits: string) {
  return `lead_${digits}_${leadId.slice(0, 8)}`;
}

export async function sendLeadTemplate(
  input: SendLeadTemplateInput
): Promise<SendLeadTemplateResult> {
  if (!OPA_CANAL_WHATSAPP_ID) {
    return {
      status: "failed",
      error: "OPA_CANAL_WHATSAPP_ID não configurado",
      failedAt: "contato.search",
    };
  }

  // 1. Busca contato existente pelo telefone
  const searchRes = await opaGet<OpaContato[]>("/contato/", {
    filter: { "fones.numero": input.telefoneE164 },
  });
  await logEvent({
    eventType: "opa.contato.search",
    direction: "outbound",
    status: searchRes.ok ? "success" : "error",
    leadId: input.leadId,
    correlationId: input.correlationId,
    httpStatus: searchRes.httpStatus,
    durationMs: searchRes.durationMs,
    requestPayload: { filter: { "fones.numero": input.telefoneE164 } },
    responsePayload: searchRes.body ?? { raw: searchRes.rawText },
    errorMessage: searchRes.error,
  });

  let opaContatoId: string | undefined;

  if (searchRes.ok && Array.isArray(searchRes.body?.data) && searchRes.body.data.length > 0) {
    opaContatoId = searchRes.body.data[0]._id;
  } else if (!searchRes.ok && searchRes.httpStatus !== 200) {
    // Search realmente falhou (não apenas "0 resultados")
    return {
      status: "failed",
      error: searchRes.error ?? `search http=${searchRes.httpStatus}`,
      failedAt: "contato.search",
    };
  }

  // 2. Cria contato se não existe
  if (!opaContatoId) {
    const digits = input.telefoneE164.replace(/\D/g, "");
    const createBody: OpaCreateContatoInput = {
      nome: input.nome,
      email_principal: input.email,
      username: usernameFor(input.leadId, digits),
      celularCompleto: input.telefoneE164,
      WhatsappCompleto: input.telefoneE164,
      requerAutenticacaoSempre: false,
      habilitarAlerta: false,
      lead: "true",
      historico_email: false,
      senha: randomPassword(),
      repetirSenha: "", // preenchido abaixo
    };
    createBody.repetirSenha = createBody.senha;

    const createRes = await opaPost<OpaContato>("/contato/", createBody);
    await logEvent({
      eventType: "opa.contato.create",
      direction: "outbound",
      status: createRes.ok ? "success" : "error",
      leadId: input.leadId,
      correlationId: input.correlationId,
      httpStatus: createRes.httpStatus,
      durationMs: createRes.durationMs,
      requestPayload: {
        // Não logar senha
        ...createBody,
        senha: "[redacted]",
        repetirSenha: "[redacted]",
      },
      responsePayload: createRes.body ?? { raw: createRes.rawText },
      errorMessage: createRes.error,
    });

    if (!createRes.ok || !createRes.body?.data?._id) {
      return {
        status: "failed",
        error:
          createRes.error ??
          createRes.body?.description ??
          `create http=${createRes.httpStatus}`,
        failedAt: "contato.create",
      };
    }
    opaContatoId = createRes.body.data._id;
  }

  // 3. Envia template
  const sendBody: OpaTemplateSendInput = {
    contato: { canalCliente: input.telefoneE164 },
    template: { _id: OPA_TEMPLATE_LEAD_ID },
    canal: OPA_CANAL_WHATSAPP_ID,
    metadata: {
      leadId: input.leadId,
      correlationId: input.correlationId,
      origem: "site",
      sourceCta: input.sourceCta,
      departamento: OPA_DEPARTAMENTO_COMERCIAL_ID,
    },
  };

  const sendRes = await opaPost<OpaTemplateSendResponse>(
    "/template/send",
    sendBody
  );
  await logEvent({
    eventType: "opa.template.send",
    direction: "outbound",
    status: sendRes.ok ? "success" : "error",
    leadId: input.leadId,
    correlationId: input.correlationId,
    httpStatus: sendRes.httpStatus,
    durationMs: sendRes.durationMs,
    requestPayload: sendBody,
    responsePayload: sendRes.body ?? { raw: sendRes.rawText },
    errorMessage: sendRes.error,
  });

  if (!sendRes.ok || !sendRes.body?.data?.messageSentId) {
    return {
      status: "failed",
      opaContatoId,
      error:
        sendRes.error ??
        sendRes.body?.description ??
        `send http=${sendRes.httpStatus}`,
      failedAt: "template.send",
    };
  }

  return {
    status: "sent",
    opaContatoId,
    opaTemplateSentId: sendRes.body.data.messageSentId,
  };
}
