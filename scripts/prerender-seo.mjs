import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_DESCRIPTION = "A leading construction and MEP contractor delivering integrated international-standard building solutions from design to operation.";
const DEFAULT_KEYWORDS = "tona corporate";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

async function readEnv(mode) {
  const values = {};
  const candidates = [`.env.${mode}.local`, `.env.${mode}`, ".env.local", ".env"];

  for (const filename of candidates) {
    try {
      const content = await fs.readFile(path.resolve(filename), "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (match && values[match[1]] === undefined) values[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
      }
    } catch {
      // Optional env file.
    }
  }

  return values;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function absoluteUrl(value, origin) {
  if (!value) return "";
  try {
    return new URL(value, origin).href;
  } catch {
    return "";
  }
}

function pageRoute(link, language, wordpressPath) {
  const url = new URL(link);
  let pathname = url.pathname;

  if (wordpressPath && pathname.startsWith(`${wordpressPath}/`)) pathname = pathname.slice(wordpressPath.length);
  pathname = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  pathname = pathname.replace(/^\/vi(?=\/|$)/, "") || "/";

  if (language === "en" && !pathname.startsWith("/en")) pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return pathname;
}

function detailRoute(slug, language) {
  return language === "en" ? `/en/${slug}` : `/${slug}`;
}

function seoMarkup(routeMatch, siteTitle, origin, route) {
  const seo = routeMatch?.seo || {};
  const pageTitle = String(seo.title || routeMatch?.title || "").trim();
  const isHome = routeMatch?.template === "tona-home";
  const title = isHome || !pageTitle || pageTitle === siteTitle
    ? siteTitle
    : siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle;
  const description = String(seo.description || DEFAULT_DESCRIPTION).trim();
  const keywords = String(seo.keywords || DEFAULT_KEYWORDS).trim();
  const canonical = absoluteUrl(seo.canonicalCustom ? seo.canonical : route, origin);
  const image = absoluteUrl(seo.image, origin);
  const robots = [seo.noindex ? "noindex" : "index", seo.nofollow ? "nofollow" : "follow"].join(", ");
  const type = seo.type || (isHome ? "website" : "article");

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="keywords" content="${escapeHtml(keywords)}">`,
    `<meta name="robots" content="${robots}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:type" content="${escapeHtml(type)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    siteTitle ? `<meta property="og:site_name" content="${escapeHtml(siteTitle)}">` : "",
    image ? `<meta property="og:image" content="${escapeHtml(image)}">` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : "",
  ].filter(Boolean).join("\n    ");
}

function injectSeo(template, markup, language) {
  return template
    .replace(/<html\s+lang="[^"]*"/i, `<html lang="${language}"`)
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace("</head>", `    ${markup}\n  </head>`);
}

const mode = option("--mode") || "production";
const env = await readEnv(mode);
const apiBase = (option("--api") || process.env.VITE_WP_API_BASE || env.VITE_WP_API_BASE || "").replace(/\/$/, "");

if (!apiBase) throw new Error("Missing VITE_WP_API_BASE for SEO prerendering.");

const apiUrl = new URL(apiBase);
const origin = option("--origin") || apiUrl.origin;
const wordpressPath = apiUrl.pathname.replace(/\/wp-json\/?$/, "");
const distPath = path.resolve("dist");
const template = await fs.readFile(path.join(distPath, "index.html"), "utf8");

async function request(endpoint, language) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const response = await fetch(`${apiBase}${endpoint}${separator}lang=${language}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${endpoint}`);
  return response.json();
}

const settings = await request("/tona/v1/settings", "vi");
const siteTitle = String(settings?.site?.title || "Tona Corporation").trim();
const routes = new Map([["/", "vi"], ["/en", "en"]]);

for (const language of ["vi", "en"]) {
  const pages = await request("/wp/v2/pages?per_page=100&_fields=link", language);
  for (const page of pages) routes.set(pageRoute(page.link, language, wordpressPath), language);

  for (const postType of ["tona_project", "tona_news"]) {
    const posts = await request(`/wp/v2/${postType}?per_page=100&_fields=slug`, language);
    for (const post of posts) routes.set(detailRoute(post.slug, language), language);
  }
}

let generated = 0;
for (const [route, language] of routes) {
  const routeMatch = await request(`/tona/v1/resolve?path=${encodeURIComponent(route)}`, language);
  if (!routeMatch || routeMatch.type === "not_found") continue;

  const output = injectSeo(template, seoMarkup(routeMatch, siteTitle, origin, route), language);
  const outputPath = route === "/"
    ? path.join(distPath, "index.html")
    : path.join(distPath, route.replace(/^\//, ""), "index.html");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output, "utf8");
  generated += 1;
}

console.log(`Prerendered SEO for ${generated} routes from ${apiBase}.`);
