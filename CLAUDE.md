# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AccessNet ISP landing page — a marketing site for a fiber optic internet provider in Maranhão, Brazil. Built on Next.js 16 (App Router) with React 19, TypeScript, and TailwindCSS.

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build (runs next-sitemap post-build)
pnpm start        # Serve production build
pnpm lint         # ESLint (next lint)
```

Package manager is **pnpm** — do not use npm or yarn.

## Architecture

### Routing

App Router with a single dynamic route: `app/[lang]/page.tsx`. The middleware (`middleware.ts`) redirects any unrecognized path to `/`. Currently only Portuguese (`pt`) is active — `lib/i18n.ts` always loads `locales/pt.json` regardless of the locale parameter.

### Layout

`app/layout.tsx` defines the shell: Header → main content → Footer → WhatsAppFloating button. Wrapped in `next-themes` ThemeProvider (default: light). Google Analytics loads only in production; Vercel Analytics is always present.

### Page Composition

`HomeIndex` (`components/home/HomeIndex.tsx`) composes all landing page sections in order:
Hero → SocialProof → Pricing → Feature → Coverage → StoreCarousel → Testimonials → FAQ → CTA

Each section component receives its copy from the dictionary (`locales/pt.json`) via the `locale` prop. Section anchors use Portuguese IDs (`#Planos`, `#Beneficios`, `#Cobertura`, `#Depoimentos`, `#Duvidas`).

### Content Configuration

All content that isn't in the locale JSON lives in `config/` files:
- `site.ts` — global config (URLs, SEO metadata, social links, contact info, WhatsApp number)
- `tiers.ts` — pricing plans (400–800 Mbps)
- `feature.ts` — feature cards with icons
- `coverage.ts` — list of 13 service cities
- `stores.ts` — physical store locations
- `testimonials.ts` — customer reviews
- `faqs.ts` — FAQ entries

To update copy or add plans/cities/stores, edit these config files — components render from them dynamically.

### Styling

- TailwindCSS 3.4 with `tailwindcss-animate` and NextUI plugin
- Brand colors defined in `tailwind.config.ts`: primary navy (`#1E3A5F`), accent orange (`#FFA500`), WhatsApp green (`#25D366`)
- Fonts: Inter (body, `--font-sans`) and Montserrat (headings, `--font-heading`)
- Shadcn/ui components in `components/ui/` configured via `components.json`

### Path Aliases

`@/*` maps to the project root (tsconfig paths).

## Key Conventions

- All user-facing text is in Portuguese (pt-BR)
- WhatsApp is the primary CTA channel — the floating button and plan CTAs link to `wa.me/5508004491021`
- Pricing section is placed before features intentionally (high-intent ad traffic)
- Animations use Framer Motion

## OPA! Suite API (integration in `lib/opa/`)

Docs: **https://api.opasuite.com.br/** is a Postman documenter site (custom subdomain pointing at `documenter.gw.postman.com` infra). The HTML page often 403s to scrapers, but the **raw collection JSON** is reachable at `https://api.opasuite.com.br/api/collections/21046266/UyxnEkBh?segregateAuth=true&versionTag=latest` — that's where every endpoint, body schema, and example response lives. Always consult that JSON before guessing parameter names; the API conventions aren't intuitive. (General pattern: when any vendor's docs are hosted on Postman, grab `ownerId` and `publishedId` from the page's `<meta>` tags and hit `/api/collections/{ownerId}/{publishedId}` on the same host to get the full collection.)

Things to know that aren't in the docs:

- **Auth requires a custom "Grupo de permissões da API" with "Grupo exclusivo para API" enabled.** The default `ixc_opa` profile is too narrow for analytics. Even with a broad API role, some endpoints (`/atendente`, `/motivo-atendimento`, `/relatorio`, `/dashboard`) are panel-only and respond `302 → /auth/login` — the API does not expose them. Use `/usuario` instead of `/atendente` for agent names.
- **`GET /atendimento` requires a JSON body for filters** (per the docs) — pass `-X GET` to curl explicitly, otherwise curl converts to POST and gets 302'd. Node's native `fetch` rejects GET-with-body too; `lib/opa/client.ts` uses `undici` to work around this.
- **No body = the *oldest* 1000 tickets**, not the latest. Always send at least a date filter. `options.limit` caps at 1000/page; paginate via `options.skip`.
- **For sales/outcome metrics, use the `ADESÃO` tag, not the `setor`.** Setor is just where the bot's flow routed the ticket, and routing is unreliable (~80% of sales close in Suporte/Financeiro, not Comercial). The OPA tag taxonomy has multiple co-existing generations — when measuring conversion, match against both `ADESÃO` (uppercase, current, ID `69d7efea75adc269f9874849`) and `Adesão` (lowercase, older, ID `670d5ffb2afcb606af05580e`). Resolve tag names via `GET /etiqueta/`.
- **Don't use `id_cliente` presence as a sale proxy** — contacts get linked to ERP customers for many reasons unrelated to this specific ticket.
- **ObjectId timestamp trick**: the first 4 bytes of any Mongo `_id` are a Unix timestamp (`new Date(parseInt(id.slice(0,8), 16) * 1000)`) — useful when records lack a `createdAt` field.
