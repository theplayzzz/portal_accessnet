import { supportWebchat } from "@/config/support-webchat";

// Documento isolado: o script oficial injeta seus próprios estilos e elementos.
// Não usa o layout React nem compartilha os globais do widget com a landing page.
export function GET() {
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
  <meta name="robots" content="noindex, nofollow">
  <title>Chat de suporte | AccessNet</title>
  <link rel="stylesheet" href="/webchat-support.css">
</head>
<body data-opa-origin="${supportWebchat.origin}" data-opa-channel="${supportWebchat.channelId}">
  <div id="chat-status" role="status">Preparando seu chat…</div>
  <noscript>Ative o JavaScript para conversar pelo chat. Você também pode ligar para 0800 449 1021.</noscript>
  <script id="opa-login" type="application/json">${JSON.stringify(supportWebchat.login)}</script>
  <script src="/webchat-support.js" defer></script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Frame-Options": "SAMEORIGIN",
    },
  });
}
