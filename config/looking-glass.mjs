/**
 * Looking Glass da GSolutions (ManagerPro) embutido no site.
 *
 * O fornecedor pediu "proxy reverso no Linux da hospedagem" — o equivalente no
 * nosso stack (Next.js na Vercel) são os rewrites de `next.config.mjs`, que
 * repassam as requisições pro ManagerPro sem expor o domínio dele no navegador.
 *
 * O HTML do LG é servido em /lg.html e carrega assets e API em caminhos
 * absolutos (/js/*, /api/looking-glass/*) — por isso o proxy espelha esses
 * mesmos caminhos na nossa origem em vez de usar um prefixo tipo /lg/.
 *
 * Detalhe que motiva o proxy: o ManagerPro responde
 * `Content-Security-Policy: frame-ancestors 'self' https://accessnet.com.br`.
 * Servindo o LG pela nossa própria origem, o `'self'` passa a ser o nosso
 * domínio e o iframe funciona também em localhost e nos previews da Vercel.
 *
 * Arquivo .mjs (e não .ts) porque `next.config.mjs` e o middleware precisam
 * importar as mesmas constantes.
 */
export const lookingGlass = {
  /** Origem real do Looking Glass — aparece só no proxy, nunca no navegador. */
  origin: "https://managerpro.gsolutions.tec.br",
  /** Chave pública do embed, fornecida pela GSolutions. */
  key: "c80cf37a1418e8a4",
  /** Subdomínio dedicado (CNAME -> Vercel): serve o LG na raiz via rewrite. */
  subdomain: "lg.accessnet.com.br",
  /** Documento HTML do LG, espelhado na nossa origem. */
  document: "/lg.html",
  /** Página do site que embute a ferramenta. */
  page: "/looking-glass",
};

/** Caminho do embed na nossa origem — usado no iframe e no rewrite do subdomínio. */
export const lookingGlassEmbedPath = `${lookingGlass.document}?key=${lookingGlass.key}&embed=1`;

/**
 * URL do iframe. Por padrão usa a mesma origem (funciona em dev, preview e
 * produção sem depender de DNS). Depois que `lg.accessnet.com.br` estiver
 * apontado pra Vercel, dá pra trocar via env:
 * NEXT_PUBLIC_LOOKING_GLASS_URL=https://lg.accessnet.com.br/
 */
export const lookingGlassEmbedUrl =
  process.env.NEXT_PUBLIC_LOOKING_GLASS_URL || lookingGlassEmbedPath;
