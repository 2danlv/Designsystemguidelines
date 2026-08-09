import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  GraduationCap,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  fetchCmsJobs,
  fetchCmsPage,
  fetchCmsPageByTemplate,
  type JobPost,
  type JobsCmsData,
} from "../lib/wordpress";
import { getCmsIcon } from "../lib/cmsIcons";
import { useSiteText } from "../context/SiteSettingsContext";

export type PerkItem = {
  icon: LucideIcon | null;
  iconImage?: string;
  title: string;
  desc: string;
};

export type InternPosition = {
  id: string;
  title: string;
  subtitle: string;
  department: string;
  duration: string;
  location: string;
  slots: number;
  icon: LucideIcon;
  requirements: string[];
  benefits: string[];
  desc: string;
};

function isInternshipJob(job: JobPost) {
  const categoryText = [
    ...(job.categorySlugs || []),
    ...(job.categories?.map((category) => category.slug || category.name || "") || []),
    job.department,
    job.type,
    job.title,
  ].join(" ").toLowerCase();

  return categoryText.includes("intern")
    || categoryText.includes("thuc-tap")
    || categoryText.includes("thực tập");
}

function internPositionFromJob(job: JobPost): InternPosition {
  return {
    id: String(job.id),
    title: job.title,
    subtitle: job.type || "",
    department: job.department,
    duration: job.level || job.date || "",
    location: job.location,
    slots: job.slots,
    icon: GraduationCap,
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    desc: job.description,
  };
}

type UseJobsPageOptions = Record<string, never>;

export type JobsPageViewModel = {
  activeDept: string;
  setActiveDept: Dispatch<SetStateAction<string>>;
  departments: string[];
  filteredJobs: JobPost[];
  perks: PerkItem[];
  internPositions: InternPosition[];
  colors: JobsCmsData["colors"];
  breadcrumbLabel: string;
  heroTitle: string;
  heroDescription: string;
  heroDecorativeText: string;
  perksEyebrow: string;
  jobsTitle: string;
  emptyJobsText: string;
  spontaneous: JobsCmsData["spontaneous"];
  interns: JobsCmsData["interns"];
  cultureTeaser: JobsCmsData["cultureTeaser"];
  applicationModal: JobsCmsData["applicationModal"];
  loaded: boolean;
};

export function useJobsPage({}: UseJobsPageOptions = {}): JobsPageViewModel {
  const text = useSiteText();
  const allDepartmentsLabel = text("jobs.all_departments");
  const [activeDept, setActiveDept] = useState(allDepartmentsLabel);
  const [cmsPage, setCmsPage] = useState<JobsCmsData | null>(null);
  const [cmsJobs, setCmsJobs] = useState<JobPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const pageRequest = fetchCmsPageByTemplate<JobsCmsData>("tona-jobs", controller.signal)
      .then((page) => page || fetchCmsPage<JobsCmsData>("nghe-nghiep", controller.signal));

    Promise.all([
      pageRequest,
      fetchCmsJobs(controller.signal),
    ]).then(([page, jobPosts]) => {
      if (!controller.signal.aborted) {
        setCmsPage(page);
        setCmsJobs(jobPosts);
        setLoaded(true);
      }
    });

    return () => controller.abort();
  }, []);

  const jobItems = useMemo<JobPost[]>(() => cmsJobs, [cmsJobs]);

  const recruitmentJobs = useMemo(() => (
    cmsJobs.length ? jobItems.filter((job) => !isInternshipJob(job)) : jobItems
  ), [cmsJobs.length, jobItems]);

  const internshipJobs = useMemo(() => (
    cmsJobs.length ? jobItems.filter(isInternshipJob) : []
  ), [cmsJobs.length, jobItems]);

  const departments = useMemo(() => {
    const items = Array.from(new Set(recruitmentJobs.map((job) => job.department).filter(Boolean)));
    return [allDepartmentsLabel, ...items];
  }, [recruitmentJobs]);

  const perks = useMemo<PerkItem[]>(() => {
    if (!cmsPage?.perks?.length) {
      return [];
    }

    return cmsPage.perks
      .filter((perk) => perk.title?.trim() || perk.desc?.trim() || perk.iconImage)
      .map((perk) => ({
        icon: getCmsIcon(perk.icon),
        iconImage: perk.iconImage || "",
        title: perk.title || "",
        desc: perk.desc || "",
      }));
  }, [cmsPage]);

  const internPositions = useMemo<InternPosition[]>(() => {
    if (internshipJobs.length) {
      return internshipJobs.map(internPositionFromJob);
    }

    return [];
  }, [internshipJobs]);

  const filteredJobs = activeDept === allDepartmentsLabel
    ? recruitmentJobs
    : recruitmentJobs.filter((job) => job.department === activeDept);

  return {
    activeDept,
    setActiveDept,
    departments,
    filteredJobs,
    perks,
    internPositions,
    colors: cmsPage?.colors,
    breadcrumbLabel: cmsPage?.hero?.breadcrumbLabel || "",
    heroTitle: cmsPage?.hero?.title || "",
    heroDescription: cmsPage?.hero?.description || "",
    heroDecorativeText: cmsPage?.hero?.decorativeText || "",
    perksEyebrow: cmsPage?.perksEyebrow || "",
    jobsTitle: cmsPage?.jobsTitle || "",
    emptyJobsText: cmsPage?.emptyJobsText || "",
    spontaneous: cmsPage?.spontaneous,
    interns: cmsPage?.interns,
    cultureTeaser: cmsPage?.cultureTeaser,
    applicationModal: cmsPage?.applicationModal,
    loaded,
  };
}


