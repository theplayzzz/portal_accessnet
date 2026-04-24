/**
 * IDs de recursos do Opa! Suite usados pela captura de leads.
 *
 * Esses IDs estão hardcoded aqui (em vez de env vars) porque são decisões de
 * domínio estáveis — quando mudam, mudam acompanhados de mudanças de lógica,
 * então vale o diff explícito no git.
 *
 * Para descobrir esses IDs, use o token OPA_TOKEN e faça:
 *   GET /api/v1/template                     → lista templates (atalho + _id)
 *   GET /api/v1/departamento/                → lista departamentos (nome + _id)
 *   GET /api/v1/canal-comunicacao/           → lista canais (nome + _id)  (este fica em env)
 *
 * Se precisar trocar pra Fase 2 (template dedicado `lead_viabilidade_site` com
 * fluxo "Leads Site" amarrado), basta atualizar `TEMPLATE_LEAD_ID` abaixo.
 */

/**
 * ID do template de mensagem enviado ao lead após cadastro.
 *
 * Atual: `pos_venda__` — categoria MARKETING, 0 variáveis, aprovado pela Meta.
 * Texto: "Olá, aqui é da ACCESSNET. Passando para saber como está sendo sua experiência..."
 *
 * PENDÊNCIA (Fase 2): criar template dedicado `lead_viabilidade_site` com 2
 * variáveis (`{{nome}}`, `{{endereço}}`) e fluxo amarrado roteando pro Comercial.
 * Quando aprovado pela Meta, só trocar o ID aqui.
 */
export const OPA_TEMPLATE_LEAD_ID = "69e139ce75adc269f9903c26";

/**
 * ID do departamento "Comercial" no Opa! Suite.
 *
 * Usado apenas para logging/metadata e para associações futuras. Hoje o
 * roteamento pro Comercial depende do fluxo amarrado ao template (Fase 2).
 */
export const OPA_DEPARTAMENTO_COMERCIAL_ID = "5bf73d1d186f7d2b0d647a60";
