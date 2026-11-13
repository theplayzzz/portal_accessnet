/* Adapter de apresentação. Mensagens, sessão e anexos usam o widget oficial OPA. */
(function () {
  "use strict";
  const origin = document.body.dataset.opaOrigin;
  const channel = document.body.dataset.opaChannel;
  const status = document.getElementById("chat-status");
  let watchConnection;
  let socket;

  function notify(state) {
    window.parent.postMessage({ type: "accessnet:webchat", state }, window.location.origin);
  }

  function fail() {
    status.hidden = false;
    status.textContent = "Não foi possível conectar. Volte à página de suporte para tentar novamente.";
    notify("error");
  }

  function button(element, label) {
    if (!element || element.dataset.accessnetAccessible) return;
    element.dataset.accessnetAccessible = "true";
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", label);
    element.tabIndex = 0;
    element.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });
  }

  function decorate() {
    const launcher = document.querySelector(".opa_ico");
    button(launcher, "Abrir chat AccessNet");
    // Impede abrir uma segunda instância por teclado atrás do painel aberto.
    if (launcher) launcher.hidden = Boolean(document.querySelector(".opa_chat"));
    button(document.querySelector(".opa_close"), "Encerrar atendimento");
    button(document.querySelector(".opa_rodape_send"), "Enviar mensagem");
    button(document.querySelector(".opa_rodape_menu"), "Anexar arquivo");
    button(document.querySelector(".sem-login"), "Continuar sem efetuar login");
    document.querySelector(".opa_rodape_input")?.setAttribute("aria-label", "Sua mensagem");
    const log = document.querySelector(".opa_corpo");
    if (log && !log.hasAttribute("role")) {
      log.setAttribute("role", "log");
      log.setAttribute("aria-live", "polite");
      log.setAttribute("aria-label", "Mensagens do chat");
    }
  }

  // O script OPA carrega o socket de forma assíncrona. Evita iniciar antes dele.
  document.addEventListener("click", function (event) {
    if (event.target.closest(".sem-login") && (!socket || !socket.connected)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  const script = document.createElement("script");
  script.src = origin + "/js/opa.js";
  script.async = true;
  script.onerror = fail;
  script.onload = async function () {
    try {
      if (typeof opa === "undefined") return fail();
      await opa.init(origin, channel, document.getElementById("opa-login").textContent);
      const observer = new MutationObserver(decorate);
      observer.observe(document.body, { childList: true, subtree: true });
      // Apenas abre o widget; a primeira mensagem depende da ação do visitante.
      document.querySelector(".opa_ico").click();
      decorate();
      watchConnection = window.setInterval(function () {
        if (!opa.socket || socket === opa.socket) return;
        socket = opa.socket;
        const connected = function () {
          status.hidden = true;
          document.body.dataset.connected = "true";
          notify("ready");
        };
        socket.on("connect", connected);
        socket.on("connect_error", fail);
        socket.on("disconnect", function () {
          document.body.dataset.connected = "false";
          notify("loading");
        });
        if (socket.connected) connected();
      }, 200);
    } catch (_) {
      fail();
    }
  };
  document.head.appendChild(script);
  window.addEventListener("pagehide", function () {
    window.clearInterval(watchConnection);
    socket?.disconnect();
  });
}());
