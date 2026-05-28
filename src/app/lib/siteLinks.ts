import { getCurrentLanguage, type SiteLanguage } from "./wordpress";

type SiteRouteKey =
  | "home"
  | "about"
  | "members"
  | "culture"
  | "csr"
  | "services"
  | "projects"
  | "news"
  | "jobs";

const routePaths: Record<SiteRouteKey, Record<SiteLanguage, string>> = {
  home: {
    vi: "/",
    en: "/en",
  },
  about: {
    vi: "/gioi-thieu-tona",
    en: "/en/about-tona",
  },
  members: {
    vi: "/doi-ngu",
    en: "/en/teams",
  },
  culture: {
    vi: "/cuoc-song-tona",
    en: "/en/tona-life",
  },
  csr: {
    vi: "/trach-nhiem-cong-dong",
    en: "/en/tona-life/csr",
  },
  services: {
    vi: "/dich-vu",
    en: "/en/services",
  },
  projects: {
    vi: "/du-an-tona",
    en: "/en/project-tona",
  },
  news: {
    vi: "/tin-tuc",
    en: "/en/news",
  },
  jobs: {
    vi: "/tuyen-dung",
    en: "/en/careers/",
  },
};

const detailRouteBases: Record<"project" | "news", Record<SiteLanguage, string>> = {
  project: {
    vi: routePaths.projects.vi,
    en: routePaths.projects.en,
  },
  news: {
    vi: routePaths.news.vi,
    en: routePaths.news.en,
  },
};

export function sitePath(route: SiteRouteKey, language: SiteLanguage = getCurrentLanguage()) {
  return routePaths[route][language];
}

export function projectDetailPath(slug: string, language: SiteLanguage = getCurrentLanguage()) {
  return `${detailRouteBases.project[language]}/${slug}`;
}

export function newsDetailPath(slug: string, language: SiteLanguage = getCurrentLanguage()) {
  return `${detailRouteBases.news[language]}/${slug}`;
}
