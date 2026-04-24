import { z } from "zod";

// Normaliza telefone pra E.164 (+55DDNNNNNNNNN).
// Aceita formatos brasileiros comuns: "21999998888", "(21) 99999-8888",
// "+5521999998888", "5521999998888".
export function normalizePhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // Já tem DDI 55?
  if (digits.startsWith("55") && digits.length >= 12) {
    return `+${digits}`;
  }
  // Sem DDI, assume Brasil
  return `+55${digits}`;
}

export const leadSubmitSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo")
    .max(120, "Nome muito longo"),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .refine((v) => {
      const d = v.replace(/\D/g, "");
      return d.length >= 10 && d.length <= 13;
    }, "Telefone inválido"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  endereco: z
    .string()
    .trim()
    .min(5, "Endereço muito curto")
    .max(500, "Endereço muito longo"),
  // Honeypot: aceita qualquer valor. O handler checa se está vazio — se
  // tiver preenchido, finge sucesso (200) sem persistir (não rejeita com 400
  // pra não dar pistas ao bot).
  website: z.string().optional(),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  sourcePage: z.string().optional(),
  sourceCta: z.string().min(1, "sourceCta obrigatório"),
  referrer: z.string().optional(),
});

export type LeadSubmitInput = z.infer<typeof leadSubmitSchema>;
