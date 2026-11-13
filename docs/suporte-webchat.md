# Piloto de suporte pelo Webchat

Estado em 12/11/2026: **implementado e validado localmente; publicação do piloto autorizada**. A situação efetiva do deploy está no registro operacional indicado ao final.

## Experiência

- `/suporte` é uma página dedicada ao piloto, sem links novos no menu, na home ou nos CTAs comerciais. Não aparece no sitemap e informa noindex. Isso limita divulgação, não é controle de acesso.
- O chat oficial é carregado somente após clicar em **Abrir chat de suporte**. Usa o canal público `6ad9fe0aad352e01088e690a`, sem token administrativo.
- `/suporte/chat` serve um documento HTML isolado no iframe. OPA documenta o script e o vínculo com agente/fluxo; isolar o CSS/global em iframe e adaptar as cores/tamanhos é uma escolha desta implementação, não uma recomendação atribuída ao fornecedor.
- O widget conserva mensagens, anexos e sessão do fornecedor. O código local adapta apresentação, teclado e estados de conexão. O iframe não recebe CPF, mensagens ou credenciais por parâmetros; o visitante interage diretamente com o widget OPA.
- O painel se adapta ao celular, com campo a 16 px e foco visível. Os controles ficam dentro da página, sem sobrepor o botão WhatsApp; o flutuante WhatsApp fica oculto somente em `/suporte`.
- Uma falha de carregamento/conexão apresenta tentativa novamente e o WhatsApp público. **Conectado** significa conexão do widget, não atendente humano disponível.

## Encaminhamento atual

O canal permanece com Speed e `1-Entrada`. O visitante escolhe **2 — Suporte** no menu existente. No teste, recebeu **Atendimento Suporte** e solicitação de CPF/CNPJ para autenticação antes da integração de diagnóstico.

Não foi implementado encaminhamento direto, alterado agente, editado workflow nem redirecionado o WhatsApp. O menu ainda apresenta outros assuntos. Não anunciar como fila exclusiva de suporte sem uma configuração específica no OPA.

O fluxo `4-Suporte` usa diagnóstico, condições de bloqueio/acesso, rotinas financeiras e subfluxos. A possibilidade de migrar apenas pedidos de suporte é inserir futuramente o card Continuar atendimento após a identificação desse assunto e antes do diagnóstico, com alternativa sem repetir o convite. É análise, não alteração autorizada nesta entrega. Validar as dependências e a continuidade do vínculo com IXC antes de aplicar.

## Validação

Build Next, TypeScript e **14 testes de conteúdo** passaram. Os três testes novos bloqueiam OPA e não enviam mensagens: carregamento por ação, preservação da home, documento isolado, falha/repetição, validação da origem/janela dos eventos e larguras 320/390/768/1440. Inspeção visual real no Chrome em desktop e 390×844; não substitui aparelho físico/teclado iOS.

Foi realizado um teste real, expressamente identificado, a partir do widget local: **OPA2026351020**, de 12/11 às 20h19 UTC-3. Mensagem de teste e opção `2`; resposta do Speed nos dois lados e registro no OPA conferidos. Nenhum CPF/CNPJ fornecido, contrato vinculado, diagnóstico de cliente real, desbloqueio ou cobrança acionados. O teste parou na autenticação; fila/atendimento de suporte após autenticar não foram validados.

A confirmação nativa de encerramento do widget não pôde ser manipulada pela ferramenta de navegador. Para limpar o teste, somente esse protocolo foi assumido na conta Oliveira, recebeu motivo existente **Informações** e foi encerrado pelo painel. API confirmou **F**, com o aviso de atendimento finalizado no OPA. Excluir esse protocolo e a assunção de indicadores de clientes/atendimento real.

## Arquivos

- Página: `app/suporte/page.tsx` e `components/support/SupportChat.tsx`.
- Documento e configuração: `app/suporte/chat/route.ts`, `config/support-webchat.ts`.
- Adaptação do widget: `public/webchat-support.js` e `public/webchat-support.css`.
- Rotas, divulgação e teste: `middleware.ts`, `next-sitemap.config.js`, `playwright.content.config.ts`, `tests/e2e/support-webchat.spec.ts`.

## Publicação

Após revisar a prévia, o usuário autorizou **piloto em produção numa página /suporte, sem divulgar nos demais CTAs**. A publicação não inclui links novos no menu/home nem alterações no OPA/WhatsApp. Deve incluir somente os arquivos desta frente: `.env.example`, `package.json`, `image.png` e `scripts/meta-ads` já tinham alterações locais e não pertencem ao piloto. `next-env.d.ts` foi regenerado pelo build para os tipos de produção. Nenhuma mensagem com o link foi enviada a clientes.

Registro e capturas: `../../../operacao/webchat-piloto-suporte-2026-11-12/registro.json`.
