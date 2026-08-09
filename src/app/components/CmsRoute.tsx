import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { fetchCmsRoute, type CmsRouteMatch } from "../lib/wordpress";
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
  const [routeMatch, setRouteMatch] = useState<CmsRouteMatch | null>(null);
  const [loaded, setLoaded] = useState(false);
  const legacyVietnameseMatch = location.pathname.match(/^\/vi(?=\/|$)(.*)$/);

  useEffect(() => {
    const controller = new AbortController();

    setLoaded(false);
    fetchCmsRoute(`${location.pathname}${location.search}`, controller.signal).then((match) => {
      setRouteMatch(match);
      setLoaded(true);
    });

    return () => controller.abort();
  }, [language, location.pathname, location.search]);

  useEffect(() => {
    if (!loaded) return;

    const siteTitle = settings?.site?.title?.trim() || "";
    const pageTitle = (routeMatch?.title || routeMatch?.page?.title || "").trim();
    const isHomePage = routeMatch?.template === "tona-home";

    if (isHomePage || !pageTitle || pageTitle === siteTitle) {
      document.title = siteTitle;
      return;
    }

    document.title = siteTitle ? `${pageTitle} | ${siteTitle}` : pageTitle;
  }, [loaded, routeMatch, settings?.site?.title]);

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
