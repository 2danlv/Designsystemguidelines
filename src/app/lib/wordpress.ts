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
