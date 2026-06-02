# Análise de Leads e Vendas pelo Chat — OpaSuite (GA Service)

Procedimento reutilizável para, a partir da API do OpaSuite, **classificar a origem de cada lead**,
**identificar quais viraram venda** lendo o chat, e **datar criação e fechamento** de cada venda.
Serve para qualquer mês e pode ser reaplicado em qualquer instância OpaSuite do cliente.

> Validado em maio/2026: 207 leads das 4 fontes rastreadas → **18 vendas confirmadas**.

---

## 1. Conexão com a API

- **Base URL**: `https://opa.suite.gastietelecom.com.br/api/v1` (cada instância tem seu domínio).
- **Auth**: header `Authorization: Bearer <TOKEN>` + `Content-Type: application/json`.
- Credenciais ficam no `.env`: `OPASUITE_API_URL`, `OPASUITE_API_TOKEN`.

**Quirks importantes da API:**
1. **Filtros e paginação vão no CORPO JSON, mesmo em requisições GET**: `{"filter":{...},"options":{"limit":N,"skip":M}}`.
2. **`limit` satura em 1000 por página** → é obrigatório paginar com `skip` (0, 1000, 2000…) até a página voltar < 1000.
3. **As mensagens voltam em ordem cronológica (mais antiga primeiro)** → `limit:6` já traz a 1ª mensagem do cliente.
4. Datas dos filtros são `YYYY-MM-DD` (dia, sem hora). Os timestamps dos registros (`date`, `data`) são **UTC** (sufixo `Z`) — converter para `-03` (America/São_Paulo) ao exibir.

---

## 2. As 4 fontes de lead (e como identificar)

Cada fonte deixa uma **assinatura na 1ª mensagem do cliente** (ou na tag `origem`):

| Fonte | Como identificar | Campanha |
|---|---|---|
| **Anúncio Meta — CTWA** | `origem.tipo == "anuncioWhatsapp"` no atendimento (clique no anúncio de WhatsApp; chega como imagem do criativo + referral) | Meta Ads |
| **Anúncio Meta — texto** | 1ª msg = `"vim pelo anúncio e quero mais informações"` | Meta Ads (CTA com link `wa.me`) |
| **Instagram** | 1ª msg = `"vim pelo Instagram, quero mais informações"` | bio / TruePlay → Instagram |
| **Site (Google)** | 1ª msg = `"vim pelo site, gostaria de saber mais sobre os planos da GA Service"` | Google Ads |
| **Consulta de cobertura** (outro site, baixo volume) | 1ª msg = `"gostaria de consultar a disponibilidade do serviço na minha região"` | site/landing de cobertura |

**Regras de classificação (texto da 1ª msg inbound):**
- Sempre **URL-decode** primeiro (`%20`, `%C3%A1`…): links `wa.me/?text=` chegam codificados.
- Normalizar: minúsculas, sem acento, espaços colapsados.
- Regex/contains:
  - Instagram → `vim pelo instagram` (ou `instagram` + `informac`)
  - Anúncio (texto) → `vim pelo anuncio` (ou `anuncio` + `informac`)
  - Site/Google → `vim pelo site` (ou `site` + `planos|informac|saber mais`)
  - Consulta cobertura → `consultar a disponibilidade` / `disponibilidade do servico` / (`disponibilidade` + `regiao`)
- CTWA tem prioridade e vem direto da tag `origem` (não depende do texto).

> ⚠️ A tag `origem=anuncioWhatsapp` **só** marca os cliques nativos de CTWA. Instagram, site e "consulta de cobertura" chegam **sem tag** (`origem` vazio) e só são identificáveis pelo texto da 1ª mensagem. Por isso NUNCA confie só no `origem`.

---

## 3. Clientes já cadastrados / recompra (ponto crítico)

A empresa tem 15 anos. **Muitos leads são ex-clientes que cancelaram e estão voltando** — eles já têm
nome e telefone cadastrados, então o atendimento já vem com **`id_cliente` preenchido**.

- **Continuam sendo leads** e devem ser contados.
- **NÃO filtre por `id_cliente == null`** ao procurar leads. Em maio, 4.151 de 4.439 atendimentos de WhatsApp
  tinham `id_cliente` preenchido — filtrar por "contato novo" **escondeu a maioria das vendas** (foi o erro da 1ª passada).
- Marque cada lead como `novo` (id_cliente nulo) ou `recorrente` (id_cliente preenchido).
  Em maio, **16 das 18 vendas eram `recorrente`** (reativação).

**Achar um lead pelo nome real** (ex.: nome que o comercial passou):
```bash
# Busca de cliente é por nome EXATO (não aceita parcial/regex)
curl -s -X GET "$OPASUITE_API_URL/cliente/" -H "Authorization: Bearer $OPASUITE_API_TOKEN" \
  -H "Content-Type: application/json" --data '{"filter":{"nome":"NOME COMPLETO EXATO"},"options":{"limit":3}}'
# retorna _id, id (código CRM), cpf_cnpj, prospect/cliente
```
De posse do `_id` do cliente, pegue os atendimentos dele (filtro **não documentado**, mas funciona):
```bash
curl -s -X GET "$OPASUITE_API_URL/atendimento" -H "Authorization: Bearer $OPASUITE_API_TOKEN" \
  -H "Content-Type: application/json" --data '{"filter":{"id_cliente":"<_id_do_cliente>"},"options":{"limit":50}}'
```

---

## 4. Detecção de VENDA pelo chat (regra refinada)

Uma venda consolidada = a conversa chega na etapa de cadastro **e o cliente envia os documentos de volta**.

**Assinatura do fechamento de venda:**
1. Existe a mensagem-template **`#Dados para cadastro`** (a atendente pede: Foto do RG/CNH, Selfie com o RG,
   Comprovante de Residência, + campos Nome/CPF/RG/Plano).
2. **DEPOIS** desse template, o cliente envia os documentos.

**Regra (booleana):**
```
VENDA  ⇔  tem_template_cadastro  E  (
              cliente_vinculado (id_cliente populado vira um objeto com nome)
           OU CPF digitado no chat   (regex \d{3}\.\d{3}\.\d{3}-\d{2})
           OU ≥1 IMAGEM enviada pelo cliente APÓS o template
         )
```

### ⚠️ PEGADINHA (não cair de novo) — caso GAS2026250860
Esse lead chegou ao template de cadastro, mas **só mandou ÁUDIO depois** (`gravacao_de_voz.mp3`),
**nunca enviou os documentos** (RG/selfie). A atendente ficou "no aguardo", perguntou "ainda deseja
contratar?" e encerrou sem resposta. **NÃO é venda.**

Por isso a regra conta **apenas IMAGENS** como documento, **nunca áudio/vídeo**:
- ✅ Documento = `tipo == "midia"` **e** nome do arquivo termina em `.jpg/.jpeg/.png/.webp/.heic`.
- ❌ NÃO contar `.mp3`, `.ogg`, `.opus` (áudio) nem vídeo.
- `tipo == "midia"` sozinho **não** distingue foto de áudio — tem que olhar a extensão no campo `mensagem`.

> Direção da mensagem: inbound (do cliente) = `tipoDestinatario == "usuarios"`; outbound (para o cliente) = `clientes_users`.

---

## 5. Datas de criação e fechamento

- **Criação do lead** = `atendimento.date` (abertura do atendimento).
- **Fechamento da venda** = timestamp da **1ª imagem de documento que o cliente envia após o template de cadastro**
  (é o momento real em que ele "fecha" mandando a documentação).
- **Atenção**: criação e fechamento podem cair em **meses diferentes** (lead gerado num mês, venda fechada no
  seguinte). Por isso registre **as duas datas** — não conte venda só pelo mês de criação.
- Campos úteis no atendimento: `fim` (encerramento do atendimento) e `status` (`F`=Finalizado, `EA`=Em atendimento, `AG`=Aguardando). O `fim` é o encerramento administrativo, **não** o fechamento da venda; use a data dos documentos.

---

## 6. Procedimento passo a passo (qualquer mês)

1. **Puxar todos os atendimentos do mês** (paginando):
   ```bash
   curl -s -X GET "$OPASUITE_API_URL/atendimento" -H "Authorization: Bearer $OPASUITE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"filter":{"dataInicialAbertura":"2026-05-01","dataFinalAbertura":"2026-06-01"},"options":{"limit":1000,"skip":0}}'
   # repetir com skip=1000, 2000… até voltar < 1000
   ```
2. **Mapear setores** (`GET /departamento/`) para traduzir `setor` → nome.
3. **Para CADA atendimento de WhatsApp** (`canal=="whatsapp"`), pegar a 1ª mensagem:
   ```bash
   curl -s -X GET "$OPASUITE_API_URL/atendimento/mensagem" -H "Authorization: Bearer $OPASUITE_API_TOKEN" \
     -H "Content-Type: application/json" --data '{"filter":{"id_rota":"<atendimento _id>"},"options":{"limit":6}}'
   ```
   - **`id_rota` = `_id` do atendimento.**
   - Não filtrar por contato novo (ver §3). Rodar em paralelo (~15 threads) para escala.
4. **Classificar a fonte** (CTWA via `origem`; demais via texto da 1ª msg — §2).
5. **Para os leads classificados**, puxar o chat completo (`limit:400`) e aplicar a **regra de venda** (§4).
6. **Para as vendas**, opcionalmente `GET /atendimento/{id}` (populado) para pegar o **nome do cliente vinculado**
   (`id_cliente.nome`) — é o nome real do comprador, usado para cruzar com o CRM/relatório do comercial.
   (O nome digitado no chat geralmente vem como imagem; o nome de perfil do WhatsApp costuma ser apelido.)
7. **Datar** criação e fechamento (§5) e montar o relatório por fonte.

---

## 7. Cruzamento com o relatório do comercial

- O nome vinculado (`id_cliente.nome`) é o que casa com a lista de nomes do time.
- Match por nome: normalizar (sem acento, maiúsculas) e exigir que quase todos os tokens > 2 letras batam
  (tolera 1 token de diferença — sobrenomes longos).
- Vendas detectadas pelo chat que **não** estão na lista do comercial = vendas que o time esqueceu de reportar.
- Cuidado com **leads de meses anteriores** que aparecem na lista do comercial (data de fechamento ≠ data de criação).

---

## 8. Pitfalls / lições aprendidas

- ❌ **Áudio ≠ documento** (caso GAS2026250860) → contar só imagens `.jpg/.png`.
- ❌ **Filtrar `id_cliente==null`** esconde ex-clientes reativando → escaneie todos.
- ❌ **Confiar só na tag `origem`** → só pega CTWA; perde Instagram/site/consulta (que vêm no texto).
- ❌ **Texto codificado** (`%20`) → sempre URL-decode antes de classificar.
- ⚠️ **Meta vs OpaSuite**: o gerenciador da Meta conta conversas atribuídas (clique 7d + visualização 1d),
  então o nº da Meta é sempre **maior** que o de CTWA capturados no OpaSuite — não reconciliar 1:1.
- ⚠️ **Ordem das mensagens** é cronológica (mais antiga primeiro) — confirmado; `limit` pequeno pega a 1ª.

---

## 9. Resultado de maio/2026 (exemplo de saída)

**Leads por fonte:** CTWA 111 · Anúncio-texto 10 · Instagram 21 · Site/Google 60 · Consulta cobertura 5 = **207 leads**.

**Vendas (18)** — criação → fechamento (dia do envio dos documentos):

| Fonte | Protocolo | Cliente | Criado | Fechado | Tipo |
|---|---|---|---|---|---|
| Instagram | GAS2026248144 | MEYRIELE FERREIRA DA SILVA | 02/05 12:25 | 04/05 06:56 | recorrente |
| Anúncio CTWA | GAS2026248698 | NAYANE SANTOS DA SILVA | 04/05 18:42 | 04/05 19:04 | recorrente |
| Anúncio texto | GAS2026248736 | JOSUE DE JESUS SOARES SOBRINHO | 05/05 00:00 | 05/05 13:41 | recorrente |
| Anúncio CTWA | GAS2026249442 | EDVALDO SOUSA SANTOS FILHO | 05/05 21:08 | 07/05 08:20 | recorrente |
| Anúncio CTWA | GAS2026250244 | ZELINDA LINDOSO MENDANHA | 07/05 13:25 | 07/05 13:50 | recorrente |
| Site/Google | GAS2026251788 | PEDRO SOUZA TAVARES | 11/05 10:07 | 11/05 11:11 | recorrente |
| Instagram | GAS2026251990 | DAYANE CRISTINA FERREIRA | 11/05 13:13 | 11/05 13:22 | recorrente |
| Anúncio CTWA | GAS2026253438 | JACKSON MARTINS DA SILVA | 13/05 15:07 | 13/05 15:55 | recorrente |
| Anúncio CTWA | GAS2026253774 | RAFAELLA DOURADO FERREIRA | 14/05 10:42 | 14/05 11:02 | recorrente |
| Anúncio CTWA | GAS2026254538 | LUIS FERNANDO DOS REIS SANTOS | 15/05 13:59 | 15/05 14:11 | recorrente |
| Anúncio CTWA | GAS2026254612 | TACIANE PEREIRA DOS SANTOS | 15/05 15:41 | 15/05 16:15 | recorrente |
| Anúncio CTWA | GAS2026255228 | Jose Ribamar Rosa da Silva | 17/05 12:38 | 18/05 12:09 | novo |
| Anúncio texto | GAS2026255832 | RAFAELLE LEANDRE BEZERRA SANTOS | 18/05 17:03 | 19/05 08:25 | recorrente |
| Site/Google | GAS2026256122 | PAMELA ALANNA MACHADO DE ARAUJO | 19/05 13:39 | 19/05 13:51 | recorrente |
| Consulta cobertura | GAS2026256632 | ANTONIO LUIS NONATO DOS SANTOS | 20/05 12:04 | 20/05 12:20 | recorrente |
| Anúncio CTWA | GAS2026256656 | ODILENE DO SOCORRO RIBEIRO SILVA | 20/05 13:01 | 20/05 13:31 | recorrente |
| Site/Google | GAS2026257130 | LOURDES EUGENIA SEREJO MARQUES | 21/05 12:49 | 21/05 13:00 | recorrente |
| Instagram | GAS2026257574 | Ingrid / Yasmin | 22/05 10:54 | 22/05 12:37 | novo |

**Não-venda confirmada (excluída):** GAS2026250860 — chegou ao cadastro mas só mandou áudio, nunca enviou documentos.

Arquivo bruto lead-a-lead: `leads-maio2026-completo.csv` (207 linhas).
