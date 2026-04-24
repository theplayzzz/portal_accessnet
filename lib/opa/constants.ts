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
 * Atual: `lead_viabilidade_site` — categoria UTILIDADE, 2 variáveis nomeadas
 * (`{{nome_cliente}}`, `{{variavel_vazia}}` = endereço), aprovado pela Meta.
 * Texto: "Oi {{nome_cliente}}! Recebemos seu cadastro... 📍 *{{variavel_vazia}}*..."
 *
 * As variáveis são enviadas via `variaveis: [nome, endereco]` — Opa! substitui
 * por ordem de aparição no texto, não pelo nome do placeholder.
 *
 * PENDÊNCIA (Fase 2, só UI): criar fluxo "Leads Site" e amarrar ao template
 * via "Editar informações → Fluxo de comunicação" pra resposta cair direto no
 * Comercial em vez do 1-Entrada.
 */
export const OPA_TEMPLATE_LEAD_ID = "69ebd1865b824a461b7bc130";

/**
 * ID do departamento "Comercial" no Opa! Suite.
 *
 * Usado apenas para logging/metadata e para associações futuras. Hoje o
 * roteamento pro Comercial depende do fluxo amarrado ao template (Fase 2).
 */
export const OPA_DEPARTAMENTO_COMERCIAL_ID = "5bf73d1d186f7d2b0d647a60";
