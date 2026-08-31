# AccessNet - Design System

Documento de referencia para manter consistencia visual em toda a landing page.

---

## Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| **Ink (texto principal)** | `#12131A` | Titulos, precos e informacoes principais em fundos claros |
| **Ink Muted** | `#5F6470` | Descricoes e textos secundarios em fundos claros |
| **Royal Blue (principal)** | `#1510C8` | Fundos de destaque, links, icones e estados ativos |
| **Deep Blue** | `#080494` | Footer, gradientes escuros e texto sobre amarelo |
| **Bright Blue** | `#1847E3` | Gradientes, links e elementos decorativos |
| **Yellow (accent)** | `#F6C304` | Badges, sublinhados, unidade GB e destaques sobre fundos azuis |
| **Cyan** | `#00BEDC` | Apoio visual, contornos e detalhes pontuais |
| **WhatsApp Green** | `#25D366` | Botoes de acao WhatsApp |
| **Branco** | `#FFFFFF` | Texto sobre fundos escuros, cards |
| **Surface Subtle** | `#F7F8FF` | Cards e accordions de baixa enfase |
| **Surface Soft** | `#EEF0FF` | Background azul-claro de secoes alternadas |
| **Surface Strong** | `#1510C8` | Ilhas de marca, card principal e blocos de alta enfase |
| **Border Soft** | `#D9DCFF` | Bordas discretas sobre fundos claros |

Proporcao visual recomendada: 55% branco/neutros, 25% azul-claro, 15% azul forte e 5% acentos amarelos/ciano. O verde fica reservado aos pontos de conversao pelo WhatsApp.

Em fundos claros, titulos e precos usam Ink. Nao dividir titulos entre azul e amarelo: a identidade aparece em pequenos rotulos azuis, sublinhados amarelos, icones e superficies. Em fundos azuis, titulos e precos usam branco, textos secundarios usam branco com 70-80% de opacidade e checks/destaques podem usar amarelo.

Fundos fortes nunca sao uma substituicao isolada. Todo componente preenchido de azul deve usar uma variante completa com cores `on-brand` para titulo, preco, descricao, icones, bordas e estados interativos.

---

## Tipografia

| Elemento | Fonte | Peso | Classe |
|----------|-------|------|--------|
| Headings (h1-h5) | Montserrat | 700-800 | `font-[family-name:var(--font-heading)]` |
| Body text | Inter | 400-500 | `font-sans` (padrao) |
| Botoes | Inter | 700 | `font-bold` |
| Badges/labels | Inter | 600 | `font-semibold` |

Titulos de secoes claras usam `#12131A` e um traco curto `#F6C304`. Precos em cards claros tambem usam `#12131A`.

---

## Arredondamento de Bordas

Usar uma escala curta e hierarquica. Quando houver elementos aninhados, cada nivel interno desce um passo na escala: painel `24px` -> card `16px` -> controle/icone `12px`. Isso evita curvas concorrentes ou desconectadas.

| Papel | Token / Classe | Raio | Exemplos |
|------|----------------|------|----------|
| **Painel de marca ou produto** | `rounded-brand-panel` | `24px` | Cards de plano, promos Access TV/Mobile, ilha de beneficios |
| **Card de conteudo** | `rounded-brand-card` | `16px` | Features internas, lojas, depoimentos, passos e recursos |
| **Controle ou icone** | `rounded-brand-control` | `12px` | Botoes, accordions, blocos de icones e precos compactos |
| **Badge ou status** | `rounded-full` | pill | "Mais Popular", cidades, stats e tags |
| **Acao flutuante** | `rounded-full` | circular | WhatsApp flutuante |

Molduras que representam dispositivos, como o celular do aplicativo e o mockup da TV, podem usar raios personalizados. Nesses casos, as curvas devem ser concentricas e derivadas da espessura da moldura, nao de uma nova escala de cards.

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
<span className="relative inline-flex items-center overflow-hidden bg-[#F6C304]/20 border border-[#F6C304]/30 text-[#F6C304] text-xs sm:text-sm font-semibold px-4 py-2 rounded-full">
  <span className="relative z-10">Texto</span>
  <span className="absolute inset-0 z-0 animate-shimmer">
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
  </span>
</span>
```

### 3. DotsShader (background de secoes escuras)

Componente WebGL: `components/ui/DotsShader.tsx`

Usado em: Hero, CTA final — sobre fundos navy gradient.

Pontos animados com 3 cores da marca (Royal Blue, Bright Blue, Cyan) em baixa opacidade.

```tsx
<div className="absolute inset-0 opacity-30">
  <DotsShader
    colors={[[21, 16, 200], [24, 71, 227], [0, 190, 220]]}
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
| Hero | Gradient azul profundo | `bg-gradient-to-br from-[#1510C8] via-[#0D0E7E] to-[#080494]` |
| SocialProof | Branco | `bg-white` |
| Pricing | Azul claro; card popular azul forte | `bg-brand-surface-soft` |
| Features | Branco; conteudo em ilha de marca | `bg-white` + gradient azul |
| Coverage | Azul claro | `bg-brand-surface-soft` |
| Stores | Branco | `bg-white` |
| App Showcase | Gradient azul-claro para branco | `from-brand-surface-soft` |
| Testimonials | Azul claro com cards brancos | `bg-brand-surface-soft` |
| FAQ | Branco com accordions azul-claro | `bg-white` |
| Mobile Promo | Azul claro com card azul forte | `bg-brand-surface-soft` |
| CTA | Gradient azul profundo | `bg-gradient-to-br from-[#1510C8] to-[#080494]` |
| Footer | Azul profundo | `bg-[#080494]` |

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
