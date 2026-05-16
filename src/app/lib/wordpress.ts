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
