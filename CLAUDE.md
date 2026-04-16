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
