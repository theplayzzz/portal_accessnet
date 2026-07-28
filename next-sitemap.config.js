/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://accessnet.com.br",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // /looking-glass e /lg.html sao proxy do Looking Glass (noindex na origem)
  exclude: ["/api/*", "/api", "/looking-glass", "/lg.html"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  },
};
