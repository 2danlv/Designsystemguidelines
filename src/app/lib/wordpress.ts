export type MembersCmsData = {
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  valuesTitle?: string;
  values?: Array<{
    icon?: "Shield" | "Award" | "TrendingUp" | "Users";
    iconImage?: string;
    title?: string;
    desc?: string;
  }>;
  teaser?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};

export type MemberPost = {
  id: number | string;
  slug?: string;
  name: string;
  role: string;
  roleEn: string;
  image: string;
  bio: string;
  linkedin?: string;
  education?: string;
  since?: string;
  expertise?: string[];
  achievements?: string[];
  quote?: string;
};

export type AboutCmsData = {
  colors?: {
    heroBackground?: string;
    valuesBackground?: string;
    timelineBackground?: string;
    certificationsBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
  missionVision?: {
    backgroundImage?: string;
    missionEyebrow?: string;
    missionText?: string;
    visionEyebrow?: string;
    visionText?: string;
  };
  valuesTitle?: string;
  values?: Array<{
    icon?: "Shield" | "Award" | "TrendingUp" | "CheckCircle2";
    iconImage?: string;
    title?: string;
    desc?: string;
  }>;
  timelineTitle?: string;
  timeline?: Array<{
    year?: string;
    title?: string;
    desc?: string;
  }>;
  certificationsTitle?: string;
  certifications?: Array<{
    code?: string;
    title?: string;
    org?: string;
  }>;
  cta?: {
    title?: string;
    description?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
};

export type CultureCmsData = {
  colors?: {
    heroBackground?: string;
    statsBackground?: string;
    themesBackground?: string;
    activitiesBackground?: string;
    academyBackground?: string;
    socialResponsibilityBackground?: string;
    galleryBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
    decorativeText?: string;
  };
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
  themesTitle?: string;
  themesDescription?: string;
  yearlyThemes?: Array<{
    year?: string;
    theme?: string;
    color?: string;
    description?: string;
    milestones?: string[];
    active?: boolean;
  }>;
  activitiesTitle?: string;
  activities?: Array<{
    icon?: "Heart" | "Users" | "Trophy" | "Zap";
    iconImage?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    color?: string;
  }>;
  socialResponsibility?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    linkLabel?: string;
    linkUrl?: string;
    badges?: string[];
    stats?: Array<{
      value?: string;
      label?: string;
    }>;
  };
  academy?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    image?: string;
    linkLabel?: string;
    linkUrl?: string;
    stats?: Array<{
      value?: string;
      label?: string;
    }>;
  };
  gallery?: {
    title?: string;
    photos?: string[];
  };
  cta?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};

export type CsrCmsData = {
  colors?: {
    heroBackground?: string;
    programsBackground?: string;
    commitmentBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
    decorativeText?: string;
  };
  impact?: Array<{
    icon?: "Handshake" | "Users" | "Leaf" | "Heart" | "Sun" | "GraduationCap";
    value?: string;
    label?: string;
  }>;
  programsSection?: {
    title?: string;
    description?: string;
  };
  programs?: Array<{
    id?: string;
    icon?: "Handshake" | "Users" | "Leaf" | "Heart" | "Sun" | "GraduationCap";
    color?: string;
    bgColor?: string;
    tag?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    stats?: Array<{
      value?: string;
      label?: string;
    }>;
    highlights?: string[];
  }>;
  commitment?: {
    title?: string;
    description?: string;
    items?: Array<{
      title?: string;
      desc?: string;
    }>;
  };
  cta?: {
    title?: string;
    description?: string;
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
};

export type ServicesCmsData = {
  colors?: {
    heroBackground?: string;
    servicesBackground?: string;
    processBackground?: string;
    timelapseBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  services?: Array<{
    icon?: "PenTool" | "Wrench" | "Building2" | "Zap";
    iconImage?: string;
    number?: string;
    tag?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    features?: string[];
    image?: string;
    featured?: boolean;
    linkLabel?: string;
    linkUrl?: string;
  }>;
  process?: {
    title?: string;
    steps?: Array<{
      step?: string;
      title?: string;
      description?: string;
    }>;
  };
  timelapse?: {
    title?: string;
    description?: string;
    slides?: Array<{
      title?: string;
      subtitle?: string;
      duration?: string;
      image?: string;
    }>;
  };
  cta?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};

export type HomeCmsData = {
  hero?: {
    primaryLabel?: string;
    primaryUrl?: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
  };
  marquee?: {
    items?: string[];
  };
  slogan?: {
    eyebrow?: string;
    title?: string;
    accentTitle?: string;
    description?: string;
    stats?: Array<{
      value?: string;
      label?: string;
    }>;
  };
  sections?: {
    servicesTitle?: string;
    projectsLabel?: string;
    projectsTitle?: string;
    newsTitle?: string;
  };
  partners?: {
    title?: string;
    description?: string;
    logos?: string[];
  };
};

export type JobPost = {
  id: number | string;
  slug?: string;
  categories?: Array<{
    id?: number;
    name?: string;
    slug?: string;
  }>;
  categorySlugs?: string[];
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  date: string;
  salary?: string;
  slots: number;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
};

export type JobsCmsData = {
  colors?: {
    heroBackground?: string;
    perksBackground?: string;
    internsBackground?: string;
    cultureBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
    decorativeText?: string;
  };
  perksEyebrow?: string;
  perks?: Array<{
    icon?: "TrendingUp" | "Star" | "Users" | "CheckCircle2";
    iconImage?: string;
    title?: string;
    desc?: string;
  }>;
  jobsTitle?: string;
  emptyJobsText?: string;
  spontaneous?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
  interns?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    seasonLabel?: string;
    slotsValue?: string;
    slotsLabel?: string;
    majorsValue?: string;
    majorsLabel?: string;
    note?: string;
    ctaTitle?: string;
    ctaDescription?: string;
    ctaLinkLabel?: string;
    ctaLinkUrl?: string;
  };
  cultureTeaser?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};

export type ProjectPost = {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  categorySlug?: string;
  categories?: Array<{
    id?: number;
    name?: string;
    slug?: string;
  }>;
  image: string;
  images?: string[];
  description: string;
  location: string;
  area: string;
  client: string;
  status: string;
  year: string;
  duration?: string;
  renovationItems?: string[];
  highlights?: string[];
  leedGold?: boolean;
};

export type ProjectsCmsData = {
  colors?: {
    heroBackground?: string;
    statsBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  stats?: Array<{
    value?: string;
    label?: string;
  }>;
  cta?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
};

export type NewsPost = {
  id: number | string;
  slug: string;
  title: string;
  date: string;
  category: string;
  categorySlug?: string;
  categories?: Array<{
    id?: number;
    name?: string;
    slug?: string;
  }>;
  tags?: string[];
  image: string;
  excerpt: string;
  content?: string;
  author?: string;
  related?: NewsPost[];
};

export type NewsCmsData = {
  colors?: {
    heroBackground?: string;
    ctaBackground?: string;
  };
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  listing?: {
    featuredLabel?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    loadMoreLabel?: string;
  };
  cta?: {
    title?: string;
    description?: string;
    emailPlaceholder?: string;
    buttonLabel?: string;
  };
};

export type SiteLink = {
  label?: string;
  url?: string;
};

export type SiteMenuItem = SiteLink & {
  children?: SiteLink[];
};

export type SiteSettings = {
  header?: {
    logo?: string;
    logoAlt?: string;
    homeUrl?: string;
    nav?: SiteMenuItem[];
    languages?: SiteLink[];
  };
  footer?: {
    cta?: {
      eyebrow?: string;
      title?: string;
      button?: string;
      buttonUrl?: string;
    };
    logo?: string;
    logoAlt?: string;
    description?: string;
    certifications?: string[];
    aboutTitle?: string;
    aboutLinks?: SiteLink[];
    projectsTitle?: string;
    projectLinks?: SiteLink[];
    contactTitle?: string;
    address?: string;
    phone?: string;
    email?: string;
    socials?: Array<{
      platform?: "Facebook" | "LinkedIn" | "YouTube";
      url?: string;
    }>;
    copyright?: string;
    legalLinks?: SiteLink[];
  };
};

export type CmsRouteMatch = {
  type: "page" | "project" | "news" | "not_found";
  template?: string;
  slug?: string;
  translations?: Partial<Record<SiteLanguage, string>>;
};

const wordpressApiBase = (import.meta.env.VITE_WP_API_BASE || "/wp-json").replace(/\/$/, "");

export type SiteLanguage = "vi" | "en";

export function getCurrentLanguage(): SiteLanguage {
  if (typeof window === "undefined") {
    return "vi";
  }

  const match = window.location.pathname.match(/^\/en(?=\/|$)/);

  return match ? "en" : "vi";
}

export function localizeUrl(url: string, targetLanguage: SiteLanguage = getCurrentLanguage()) {
  if (
    !url ||
    url === "#" ||
    /^https?:\/\//i.test(url) ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:")
  ) {
    return url;
  }

  const [pathWithQuery, hash = ""] = url.split("#");
  const [pathOnly, query = ""] = pathWithQuery.split("?");
  const parts = pathOnly.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  const segments = parts.slice(parts[0] === "en" || parts[0] === "vi" ? 1 : 0);

  const nextPath = targetLanguage === "en"
    ? `/en${segments.length ? `/${segments.join("/")}` : ""}`
    : `/${segments.join("/")}`;
  const nextQuery = query ? `?${query}` : "";
  const nextHash = hash ? `#${hash}` : "";

  return `${nextPath || "/"}${nextQuery}${nextHash}`;
}

function cmsEndpoint(path: string) {
  const separator = path.includes("?") ? "&" : "?";

  return `${wordpressApiBase}${path}${separator}lang=${getCurrentLanguage()}`;
}

export async function fetchCmsSettings(signal?: AbortSignal): Promise<SiteSettings | null> {
  try {
    const response = await fetch(cmsEndpoint("/tona/v1/settings"), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as SiteSettings;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function fetchCmsRoute(path: string, signal?: AbortSignal): Promise<CmsRouteMatch | null> {
  try {
    const response = await fetch(cmsEndpoint(`/tona/v1/resolve?path=${encodeURIComponent(path)}`), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CmsRouteMatch;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function fetchCmsPage<T>(slug: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(cmsEndpoint(`/tona/v1/pages/${slug}`), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function fetchCmsPageByTemplate<T>(template: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(cmsEndpoint(`/tona/v1/page-template/${template}`), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function fetchCmsMembers(signal?: AbortSignal): Promise<MemberPost[]> {
  try {
    const response = await fetch(cmsEndpoint("/tona/v1/members"), { signal });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as MemberPost[];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return [];
  }
}

export async function fetchCmsJobs(signal?: AbortSignal): Promise<JobPost[]> {
  try {
    const response = await fetch(cmsEndpoint("/tona/v1/jobs"), { signal });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as JobPost[];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return [];
  }
}

export async function fetchCmsProjects(signal?: AbortSignal): Promise<ProjectPost[]> {
  try {
    const response = await fetch(cmsEndpoint("/tona/v1/projects"), { signal });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as ProjectPost[];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return [];
  }
}

export async function fetchCmsProject(slug: string, signal?: AbortSignal): Promise<ProjectPost | null> {
  try {
    const response = await fetch(cmsEndpoint(`/tona/v1/projects/${slug}`), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ProjectPost;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}

export async function fetchCmsNews(signal?: AbortSignal): Promise<NewsPost[]> {
  try {
    const response = await fetch(cmsEndpoint("/tona/v1/news"), { signal });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as NewsPost[];
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return [];
  }
}

export async function fetchCmsNewsPost(slug: string, signal?: AbortSignal): Promise<NewsPost | null> {
  try {
    const response = await fetch(cmsEndpoint(`/tona/v1/news/${slug}`), { signal });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as NewsPost;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    return null;
  }
}
