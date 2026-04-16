# AccessNet - Design System

Documento de referencia para manter consistencia visual em toda a landing page.

---

## Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| **Navy (principal)** | `#1E3A5F` | Headings, backgrounds hero/CTA, header |
| **Navy Dark** | `#0B1828` | Footer, gradients escuros |
| **Orange (accent)** | `#FFA500` | Destaques, precos, icones, highlights |
| **Gold** | `#FFD700` | Texto badge, gradients premium |
| **WhatsApp Green** | `#25D366` | Botoes de acao WhatsApp |
| **Bright Blue** | `#0066FF` | Mascote, elementos decorativos |
| **Turquoise** | `#00BCD4` | Fachadas, DotsShader |
| **Branco** | `#FFFFFF` | Texto sobre fundos escuros, cards |
| **Slate-50** | `#F8FAFC` | Background de secoes alternadas |

---

## Tipografia

| Elemento | Fonte | Peso | Classe |
|----------|-------|------|--------|
| Headings (h1-h5) | Montserrat | 700-800 | `font-[family-name:var(--font-heading)]` |
| Body text | Inter | 400-500 | `font-sans` (padrao) |
| Botoes | Inter | 700 | `font-bold` |
| Badges/labels | Inter | 600 | `font-semibold` |

---

## Arredondamento de Bordas

Regra geral: **botoes de acao** usam arredondamento moderado. **Elementos informativos** usam arredondamento alto (pill).

| Tipo de Elemento | Classe | Exemplo |
|-----------------|--------|---------|
| **Botoes de acao** (CTA, WhatsApp, "Ver Planos") | `rounded-xl` | Todos os botoes clicaveis de conversao |
| **Elementos informativos** (badges, stats, tags) | `rounded-full` | "12 anos conectando", "+10.000 clientes", "Suporte 24h" |
| **Pills de cidades** (cobertura) | `rounded-full` | "Pinheiro", "Sao Bento", etc. |
| **Cards** (planos, features, testimonials) | `rounded-2xl` | Cards de preco, depoimentos |
| **Header WhatsApp** (desktop e mobile) | `rounded-xl` | Botao "Assine Ja" no header |
| **WhatsApp flutuante** | `rounded-full` | Botao fixo no canto inferior direito |

---

## Efeitos Visuais e Animacoes

### 1. ShinyButton (botoes WhatsApp de conversao)

Componente: `components/ui/ShinyBadge.tsx` (exporta `ShinyButton`)

Usado em: Hero CTA, CTA final, botoes dos cards de planos.
**NAO** usado em: header, floating WhatsApp.

4 camadas de efeito:
- **Glow pulsante** — `box-shadow` verde que respira a cada 3s (`shiny-btn-glow`)
- **Borda rotativa** — linha branca 2px girando 360 graus a cada 3s (`shiny-btn-rotate`)
- **Shimmer sweep** — faixa branca diagonal 30% percorrendo a cada 2.5s (`animate-shimmer`)
- **Top highlight** — gradiente branco 15% no topo para sensacao de profundidade

```tsx
<ShinyButton href="https://wa.me/5508004491021?text=..." className="text-lg px-8 py-4">
  <FaWhatsapp size={22} />
  Texto do botao
</ShinyButton>
```

### 2. Shimmer (badges informativos)

Efeito simples de brilho diagonal percorrendo o elemento.

Usado em: badge "12 anos conectando o Maranhao".

```tsx
<span className="relative inline-flex items-center overflow-hidden bg-[#FFA500]/20 border border-[#FFA500]/30 text-[#FFD700] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
  <span className="relative z-10">Texto</span>
  <span className="absolute inset-0 z-0 animate-shimmer">
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
  </span>
</span>
```

### 3. DotsShader (background de secoes escuras)

Componente WebGL: `components/ui/DotsShader.tsx`

Usado em: Hero, CTA final — sobre fundos navy gradient.

Pontos animados com 3 cores da marca (Navy, Bright Blue, Turquoise) em baixa opacidade.

```tsx
<div className="absolute inset-0 opacity-30">
  <DotsShader
    colors={[[30, 58, 95], [0, 102, 255], [0, 188, 212]]}
    opacities={[0.3, 0.3, 0.4, 0.4, 0.5, 0.5, 0.6, 0.6, 0.7, 0.8]}
    totalSize={4}
    dotSize={2}
    maxFps={24}
  />
</div>
```

### 4. Framer Motion (animacoes de entrada)

Padrao para elementos que entram na viewport:

```tsx
// Fade-up individual
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
>

// Fade-in lateral (hero)
<motion.div
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
>
```

---

## Estrutura de Secoes

Padrao de alternancia de fundos para ritmo visual:

| Secao | Background | Classe |
|-------|-----------|--------|
| Hero | Gradient navy | `bg-gradient-to-br from-[#1E3A5F] via-[#162d4a] to-[#0B1828]` |
| SocialProof | Branco | `bg-white` |
| Pricing | Cinza claro | `bg-slate-50` |
| Features | Branco | `bg-white` |
| Coverage | Cinza claro | `bg-slate-50` |
| Stores | Branco | `bg-white` |
| Testimonials | Branco | `bg-white` |
| FAQ | Cinza claro | `bg-slate-50` |
| CTA | Gradient navy | `bg-gradient-to-br from-[#1E3A5F] to-[#0B1828]` |
| Footer | Navy escuro | `bg-[#0B1828]` |

---

## Espacamento

- Secoes: `py-20 md:py-24`
- Container: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Entre heading e conteudo: `mb-12` ou `mb-14`
- Entre cards em grid: `gap-6` ou `gap-8`

---

## Componentes Reutilizaveis

| Componente | Arquivo | Descricao |
|-----------|---------|-----------|
| `ShinyButton` | `components/ui/ShinyBadge.tsx` | Botao WhatsApp com efeito premium (glow + borda rotativa + shimmer) |
| `DotsShader` | `components/ui/DotsShader.tsx` | Background animado WebGL com pontos |

---

## Links e CTAs

Todos os botoes WhatsApp apontam para `https://wa.me/5508004491021` com mensagem pre-preenchida.

| Contexto | Mensagem |
|----------|----------|
| Hero / CTA geral | `?text=Quero%20contratar%20internet%20fibra%20AccessNet` |
| Plano START | `?text=Quero%20contratar%20o%20plano%20START%20400Mbps` |
| Plano ULTRA | `?text=Quero%20contratar%20o%20plano%20ULTRA%20600Mbps` |
| Plano STREAMING | `?text=Quero%20contratar%20o%20plano%20STREAMING%20700Mbps` |
| Plano GAME | `?text=Quero%20contratar%20o%20plano%20GAME%20800Mbps` |
| Cobertura | `?text=Quero%20saber%20se%20a%20AccessNet%20atende%20minha%20cidade` |
| Floating | `?text=Ola!%20Quero%20saber%20mais%20sobre%20os%20planos%20AccessNet` |

---

## Tema

- Apenas tema **claro** (sem dark mode)
- Idioma: **PT-BR** exclusivo
- `scroll-behavior: smooth` habilitado globalmente
