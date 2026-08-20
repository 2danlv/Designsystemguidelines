import { useEffect } from "react";
import { Navigate, useLocation, useOutletContext } from "react-router";
import { useSiteSettings } from "../context/SiteSettingsContext";
import type { CmsRouteMatch } from "../lib/wordpress";
import { About } from "../pages/About";
import { GenericContentPage } from "../pages/ContentPage";
import { CSR } from "../pages/CSR";
import { Culture } from "../pages/Culture";
import { Home } from "../pages/Home";
import { Jobs } from "../pages/Jobs";
import { Members } from "../pages/Members";
import { News } from "../pages/News";
import { NewsDetail } from "../pages/NewsDetail";
import { ProjectDetail } from "../pages/ProjectDetail";
import { Projects } from "../pages/Projects";
import { Services } from "../pages/Services";
import { CmsLoading } from "./CmsLoading";

function updateMetaTag(attribute: "name" | "property", key: string, content?: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!content) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.content = content;
}

function updateCanonicalLink(url?: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!url) {
    link?.remove();
    return;
  }

  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }

  link.href = url;
}

function renderPageByTemplate({ template, routeKey }: { template?: string; routeKey: string }) {
  switch (template) {
    case "tona-home":
      return <Home key={routeKey} />;
    case "tona-about":
      return <About key={routeKey} />;
    case "tona-members":
      return <Members key={routeKey} />;
    case "tona-culture":
      return <Culture key={routeKey} />;
    case "tona-csr":
      return <CSR key={routeKey} />;
    case "tona-services":
      return <Services key={routeKey} />;
    case "tona-jobs":
      return <Jobs key={routeKey} />;
    case "tona-projects":
      return <Projects key={routeKey} />;
    case "tona-news":
      return <News key={routeKey} />;
    default:
      return null;
  }
}

export function CmsRoute() {
  const location = useLocation();
  const settings = useSiteSettings();
  const language = location.pathname.startsWith("/en") ? "en" : "vi";
  const routeKey = `${location.pathname}${location.search}`;
  const { routeMatch, routeLoaded: loaded } = useOutletContext<{
    routeMatch: CmsRouteMatch | null;
    routeLoaded: boolean;
  }>();
  const legacyVietnameseMatch = location.pathname.match(/^\/vi(?=\/|$)(.*)$/);

  useEffect(() => {
    if (!loaded) return;

    const siteTitle = settings?.site?.title?.trim() || "";
    const seo = routeMatch?.seo;
    const pageTitle = (seo?.title || routeMatch?.title || routeMatch?.page?.title || "").trim();
    const isHomePage = routeMatch?.template === "tona-home";
    const fullTitle = isHomePage || !pageTitle || pageTitle === siteTitle
      ? siteTitle
      : siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle;
    const canonicalSource = seo?.canonicalCustom
      ? seo.canonical?.trim()
      : `${window.location.origin}${location.pathname}`;
    const canonical = canonicalSource ? new URL(canonicalSource, window.location.origin).href : "";
    const robots = [seo?.noindex ? "noindex" : "", seo?.nofollow ? "nofollow" : ""]
      .filter(Boolean)
      .join(", ");

    if (fullTitle) document.title = fullTitle;

    updateMetaTag("name", "description", seo?.description?.trim());
    updateMetaTag("name", "keywords", seo?.keywords?.trim());
    updateMetaTag("name", "robots", robots);
    updateCanonicalLink(canonical);

    updateMetaTag("property", "og:title", fullTitle);
    updateMetaTag("property", "og:description", seo?.description?.trim());
    updateMetaTag("property", "og:type", seo?.type || (isHomePage ? "website" : "article"));
    updateMetaTag("property", "og:url", canonical);
    updateMetaTag("property", "og:image", seo?.image?.trim());
    updateMetaTag("property", "og:site_name", siteTitle);

    updateMetaTag("name", "twitter:card", seo?.image ? "summary_large_image" : "summary");
    updateMetaTag("name", "twitter:title", fullTitle);
    updateMetaTag("name", "twitter:description", seo?.description?.trim());
    updateMetaTag("name", "twitter:image", seo?.image?.trim());
  }, [loaded, location.pathname, routeMatch, settings?.site?.title]);

  if (legacyVietnameseMatch) {
    const nextPath = legacyVietnameseMatch[1] || "/";
    return <Navigate to={`${nextPath}${location.search}${location.hash}`} replace />;
  }

  if (!loaded) {
    return <CmsLoading />;
  }

  if (routeMatch?.type === "project" && routeMatch.slug) {
    return <ProjectDetail key={routeKey} slugOverride={routeMatch.slug} />;
  }

  if (routeMatch?.type === "news" && routeMatch.slug) {
    return <NewsDetail key={routeKey} slugOverride={routeMatch.slug} />;
  }

  if (routeMatch?.type === "page") {
    const page = renderPageByTemplate({ routeKey, template: routeMatch.template });

    if (page) {
      return page;
    }

    if (routeMatch.slug) {
      return <GenericContentPage key={routeKey} slug={routeMatch.slug} initialPage={routeMatch.page} />;
    }
  }

  return <Navigate to={language === "en" ? "/en" : "/"} replace />;
}
