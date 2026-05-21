export type MembersCmsData = {
  hero?: {
    breadcrumbLabel?: string;
    title?: string;
    description?: string;
  };
  leadership?: Array<{
    id?: string;
    name?: string;
    role?: string;
    roleEn?: string;
    image?: string;
    bio?: string;
    linkedin?: string;
  }>;
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
  cta?: {
    title?: string;
    description?: string;
    linkLabel?: string;
    linkUrl?: string;
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
  readTime?: string;
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

const wordpressApiBase = (import.meta.env.VITE_WP_API_BASE || "/wp-json").replace(/\/$/, "");

export async function fetchCmsPage<T>(slug: string, signal?: AbortSignal): Promise<T | null> {
  try {
    const response = await fetch(`${wordpressApiBase}/tona/v1/pages/${slug}`, { signal });

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
    const response = await fetch(`${wordpressApiBase}/tona/v1/page-template/${template}`, { signal });

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

export async function fetchCmsJobs(signal?: AbortSignal): Promise<JobPost[]> {
  try {
    const response = await fetch(`${wordpressApiBase}/tona/v1/jobs`, { signal });

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
    const response = await fetch(`${wordpressApiBase}/tona/v1/projects`, { signal });

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
    const response = await fetch(`${wordpressApiBase}/tona/v1/projects/${slug}`, { signal });

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
    const response = await fetch(`${wordpressApiBase}/tona/v1/news`, { signal });

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
    const response = await fetch(`${wordpressApiBase}/tona/v1/news/${slug}`, { signal });

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
