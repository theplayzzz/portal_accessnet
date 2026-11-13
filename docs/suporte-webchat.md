# Piloto de suporte pelo Webchat

Estado em 12/11/2026: **piloto autorizado em produção; revisão para experiência centrada no chat**. A situação efetiva do deploy está no registro operacional indicado ao final.

## Experiência

- `/suporte` é uma página dedicada ao piloto, sem links novos no menu, na home ou nos CTAs comerciais. Informa noindex e tem exclusão configurada no next-sitemap. Isso limita divulgação, não é controle de acesso.
- A página abre diretamente o widget oficial, sem botão intermediário, header, footer ou H1. No celular/tablet abaixo de 1024 px, somente o chat ocupa toda a largura e a altura dinâmica da tela. No computador há um apoio lateral com marca, identificação do titular, telefone e retorno ao site.
- O widget usa o canal público `6ad9fe0aad352e01088e690a`, sem token administrativo. Abrir a página conecta o widget; iniciar/enviar mensagem continua dependendo da ação do visitante.
- `/suporte/chat` serve um documento HTML isolado no iframe. OPA documenta o script e o vínculo com agente/fluxo; isolar o CSS/global em iframe e adaptar as cores/tamanhos é uma escolha desta implementação, não uma recomendação atribuída ao fornecedor.
- O widget conserva mensagens, anexos e sessão do fornecedor. O código local adapta apresentação, teclado e estados de conexão. O iframe não recebe CPF, mensagens ou credenciais por parâmetros; o visitante interage diretamente com o widget OPA.
- O painel se adapta ao celular, com campo a 16 px, foco visível e área segura do dispositivo. O viewport solicita redimensionamento do conteúdo com teclado virtual nos navegadores compatíveis. Não há título/cartão externo ao widget no celular. O flutuante WhatsApp fica oculto somente em `/suporte`.
- Uma falha de carregamento/conexão apresenta tentativa novamente e o WhatsApp público dentro da área do chat. Estado de conexão acessível a leitores de tela; conexão do widget não significa atendente humano disponível.
- `SiteChrome` recebe header/footer do servidor e os omite somente em `/suporte`. As demais páginas conservam a navegação e o rodapé existentes, inclusive ao navegar entre elas pelo cliente.

## Encaminhamento atual

O canal permanece com Speed e `1-Entrada`. O visitante escolhe **2 — Suporte** no menu existente. No teste, recebeu **Atendimento Suporte** e solicitação de CPF/CNPJ para autenticação antes da integração de diagnóstico.

Não foi implementado encaminhamento direto, alterado agente, editado workflow nem redirecionado o WhatsApp. O menu ainda apresenta outros assuntos. Não anunciar como fila exclusiva de suporte sem uma configuração específica no OPA.

O fluxo `4-Suporte` usa diagnóstico, condições de bloqueio/acesso, rotinas financeiras e subfluxos. A possibilidade de migrar apenas pedidos de suporte é inserir futuramente o card Continuar atendimento após a identificação desse assunto e antes do diagnóstico, com alternativa sem repetir o convite. É análise, não alteração autorizada nesta entrega. Validar as dependências e a continuidade do vínculo com IXC antes de aplicar.

## Validação

Build Next, TypeScript e **14 testes de conteúdo** passaram no piloto inicial, localmente e em produção. Para a revisão visual, os três testes do widget bloqueiam OPA e não enviam mensagens: abertura direta sem header/footer/H1, preservação da home, documento isolado, falha/repetição, validação da origem/janela dos eventos e dimensões 320×640, 390×844, 768×1024 e 1440×900. Conferência visual em Chrome real; não substitui aparelho físico/teclado iOS. O registro operacional discrimina as validações e publicações de cada versão.

Foi realizado um teste real, expressamente identificado, a partir do widget local: **OPA2026351020**, de 12/11 às 20h19 UTC-3. Mensagem de teste e opção `2`; resposta do Speed nos dois lados e registro no OPA conferidos. Nenhum CPF/CNPJ fornecido, contrato vinculado, diagnóstico de cliente real, desbloqueio ou cobrança acionados. O teste parou na autenticação; fila/atendimento de suporte após autenticar não foram validados.

A confirmação nativa de encerramento do widget não pôde ser manipulada pela ferramenta de navegador. Para limpar o teste, somente esse protocolo foi assumido na conta Oliveira, recebeu motivo existente **Informações** e foi encerrado pelo painel. API confirmou **F**, com o aviso de atendimento finalizado no OPA. Excluir esse protocolo e a assunção de indicadores de clientes/atendimento real.

## Arquivos

- Página: `app/suporte/page.tsx` e `components/support/SupportChat.tsx`.
- Layout das páginas: `components/layout/SiteChrome.tsx` e `app/layout.tsx`.
- Documento e configuração: `app/suporte/chat/route.ts`, `config/support-webchat.ts`.
- Adaptação do widget: `public/webchat-support.js` e `public/webchat-support.css`.
- Rotas, divulgação e teste: `middleware.ts`, `next-sitemap.config.js`, `playwright.content.config.ts`, `tests/e2e/support-webchat.spec.ts`.

## Publicação

Após revisar a prévia, o usuário autorizou **piloto em produção numa página /suporte, sem divulgar nos demais CTAs**. A publicação não inclui links novos no menu/home nem alterações no OPA/WhatsApp. Deve incluir somente os arquivos desta frente: `.env.example`, `package.json`, `image.png` e `scripts/meta-ads` já tinham alterações locais e não pertencem ao piloto. `next-env.d.ts` foi regenerado pelo build para os tipos de produção. Nenhuma mensagem com o link foi enviada a clientes.

Registro e capturas: `../../../operacao/webchat-piloto-suporte-2026-11-12/registro.json`.
