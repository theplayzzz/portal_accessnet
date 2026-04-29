/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://accessnet.com.br",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/api/*", "/api"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
  },
};
