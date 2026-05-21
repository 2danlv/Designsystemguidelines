import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  CheckCircle2,
  GraduationCap,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { fetchCmsJobs, fetchCmsPage, type JobPost, type JobsCmsData } from "../lib/wordpress";

export type PerkItem = {
  icon: LucideIcon;
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

export const allDepartmentsLabel = "Tất Cả";

const perkIconMap = {
  TrendingUp,
  Star,
  Users,
  CheckCircle2,
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
    subtitle: job.type || "Internship",
    department: job.department,
    duration: job.level || job.date || "",
    location: job.location,
    slots: job.slots || 1,
    icon: GraduationCap,
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    desc: job.description,
  };
}

type UseJobsPageOptions = {
  fallbackJobs: JobPost[];
  fallbackPerks: PerkItem[];
  fallbackInternPositions: InternPosition[];
};

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
};

export function useJobsPage({
  fallbackJobs,
  fallbackPerks,
  fallbackInternPositions,
}: UseJobsPageOptions): JobsPageViewModel {
  const [activeDept, setActiveDept] = useState(allDepartmentsLabel);
  const [cmsPage, setCmsPage] = useState<JobsCmsData | null>(null);
  const [cmsJobs, setCmsJobs] = useState<JobPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCmsPage<JobsCmsData>("nghe-nghiep", controller.signal),
      fetchCmsJobs(controller.signal),
    ]).then(([page, jobPosts]) => {
      setCmsPage(page);
      setCmsJobs(jobPosts);
    });

    return () => controller.abort();
  }, []);

  const jobItems = useMemo<JobPost[]>(() => (
    cmsJobs.length ? cmsJobs : fallbackJobs
  ), [cmsJobs, fallbackJobs]);

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
      return fallbackPerks;
    }

    return cmsPage.perks.map((perk) => ({
      icon: perkIconMap[perk.icon || "TrendingUp"] || TrendingUp,
      iconImage: perk.iconImage || "",
      title: perk.title || "",
      desc: perk.desc || "",
    }));
  }, [cmsPage, fallbackPerks]);

  const internPositions = useMemo<InternPosition[]>(() => {
    if (internshipJobs.length) {
      return internshipJobs.map(internPositionFromJob);
    }

    if (!cmsJobs.length) {
      return fallbackInternPositions;
    }

    return [];
  }, [cmsJobs.length, fallbackInternPositions, internshipJobs]);

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
    breadcrumbLabel: cmsPage?.hero?.breadcrumbLabel || "Tuyển Dụng",
    heroTitle: cmsPage?.hero?.title || "Gia Nhập\nĐội Ngũ Tona",
    heroDescription: cmsPage?.hero?.description || "Môi trường làm việc chuyên nghiệp, dự án đỉnh cao, cơ hội thăng tiến rõ ràng - Tona đang tìm kiếm những tài năng cùng chúng tôi kiến tạo công trình thế kỷ.",
    heroDecorativeText: cmsPage?.hero?.decorativeText || "JOIN",
    perksEyebrow: cmsPage?.perksEyebrow || "Tại Sao Chọn Tona?",
    jobsTitle: cmsPage?.jobsTitle || "Vị Trí Đang Tuyển",
    emptyJobsText: cmsPage?.emptyJobsText || "Không có vị trí nào trong bộ phận này.",
    spontaneous: cmsPage?.spontaneous,
    interns: cmsPage?.interns,
    cultureTeaser: cmsPage?.cultureTeaser,
  };
}
