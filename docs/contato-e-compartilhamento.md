# Contato e prévia de compartilhamento

Atualização de 21/10/2026.

Os contatos comerciais da home, planos de fibra, rede móvel, combos e Access TV usam links diretos para o WhatsApp público **0800 449 1021**, inclusive o botão flutuante, redes sociais do rodapé e números de telefone. A mensagem é **“Olá, vim pelo site, quero mais informações.”**. O visitante confirma o envio no próprio WhatsApp.

`config/contact.ts` centraliza o número e a mensagem; `components/lead/WhatsAppCTA.tsx` renderiza links com `href`, acessíveis também sem JavaScript. A aparência dos CTAs foi preservada. O Analytics mantém o evento de intenção por origem, condicionado às configurações existentes. Clique não dispara a conversão de formulário nem comprova conversa ou venda.

O layout deixou de montar `LeadModalProvider`. Os componentes antigos de formulário e as rotas de integração OPA permanecem no repositório para preservar o histórico e os contratos existentes; nenhum CTA público chama o formulário ou `POST /api/lead`. O cron e os webhooks de leads anteriores não foram alterados.

Open Graph e Twitter usam `/og-home-2026-10-21.png`, PNG público de **1200 × 630**, capturado da home renderizada com a logo, o Speed e a chamada principal. Há dimensões, tipo e texto alternativo explícitos. `/og.png` também recebe a imagem atual por compatibilidade. O nome versionado permite que os serviços busquem uma imagem nova; previews já armazenados pelos aplicativos podem continuar usando seu próprio cache.

Validação local:

```powershell
pnpm exec next build
pnpm exec tsc --noEmit
pnpm exec playwright test --config playwright.content.config.ts
```

A configuração de conteúdo executa somente `site-content.spec.ts`, sem carregar credenciais de testes de integração. Intercepta Analytics e o destino WhatsApp; os testes de clique verificam navegação, ausência de modal/formulário e ausência de requisições de cadastro, sem enviar mensagens. Usa o Chrome instalado e a build local na porta 3000. Para testar somente o conteúdo de outro ambiente, defina `PLAYWRIGHT_BASE_URL`.

Publicação: commit/push na branch `main` de `theplayzzz/portal_accessnet` aciona a integração Git do projeto Vercel `portal-accessnet`, responsável por `accessnet.com.br` e `www.accessnet.com.br`. Conferir o estado Ready e o commit no painel após o push.
