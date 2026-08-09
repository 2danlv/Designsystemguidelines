import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import { MapPin, Maximize2, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { fetchCmsPageByTemplate, fetchCmsProjects, type ProjectPost, type ProjectsCmsData } from "../lib/wordpress";
import { projectDetailPath, sitePath } from "../lib/siteLinks";
import { CmsLoading } from "../components/CmsLoading";
import { useSiteText } from "../context/SiteSettingsContext";


function renderLines(text: string) {
  return text.replace(/\r\n/g, "\n").split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function backgroundStyle(color?: string) {
  return color ? { backgroundColor: color } : undefined;
}

function normalizeFilterValue(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectCategoryValues(project: ProjectPost) {
  const values = [
    project.categorySlug,
    project.category,
    ...(project.categories || []).flatMap((category) => [category.slug, category.name]),
  ];

  return values.filter(Boolean).map((value) => normalizeFilterValue(value));
}

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cmsPage, setCmsPage] = useState<ProjectsCmsData | null>(null);
  const [cmsProjects, setCmsProjects] = useState<ProjectPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const text = useSiteText();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCmsPageByTemplate<ProjectsCmsData>("tona-projects", controller.signal),
      fetchCmsProjects(controller.signal),
    ]).then(([page, projectPosts]) => {
      if (!controller.signal.aborted) {
        setCmsPage(page);
        setCmsProjects(projectPosts);
        setLoaded(true);
      }
    });

    return () => controller.abort();
  }, []);

  const projectItems = useMemo<ProjectPost[]>(() => cmsProjects, [cmsProjects]);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();

    projectItems.forEach((project) => {
      const projectCategories = project.categories?.length
        ? project.categories
        : [{ slug: project.categorySlug, name: project.category }];

      projectCategories.forEach((category) => {
        const slug = normalizeFilterValue(category.slug || category.name);
        const label = category.name || category.slug || project.category;

        if (slug && label && !seen.has(slug)) {
          seen.set(slug, label);
        }
      });
    });

    return Array.from(seen, ([slug, label]) => ({ slug, label }));
  }, [projectItems]);

  useEffect(() => {
    const hashFilter = normalizeFilterValue(decodeURIComponent(location.hash.replace(/^#/, "")));

    if (!hashFilter) {
      setActiveFilter("all");
      return;
    }

    const matchedCategory = categories.find((cat) => (
      normalizeFilterValue(cat.slug) === hashFilter || normalizeFilterValue(cat.label) === hashFilter
    ));

    if (matchedCategory) {
      setActiveFilter(matchedCategory.slug);
    }
  }, [categories, location.hash]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    navigate(`${location.pathname}${filter === "all" ? "" : `#${encodeURIComponent(filter)}`}`, { replace: true });
  };

  const filteredProjects =
    activeFilter === "all"
      ? projectItems
      : projectItems.filter((project) => projectCategoryValues(project).includes(activeFilter));

  const colors = cmsPage?.colors;
  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "";
  const heroTitle = cmsPage?.hero?.title || "";
  const heroDescription = cmsPage?.hero?.description || "";
  const stats = cmsPage?.stats || [];
  const allFilterLabel = text("projects.all");
  const cta = cmsPage?.cta;

  if (!loaded) {
    return <CmsLoading />;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="relative bg-[#002d17] pt-8 pb-16 overflow-hidden" style={backgroundStyle(colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">{text("common.home")}</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight">
              {renderLines(heroTitle)}
            </h1>
            <p className="text-white/50 font-medium text-base mt-4 max-w-xl">
              {heroDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#f4aa1f]" style={backgroundStyle(colors?.statsBackground)}>
        <div className="max-w-7xl mx-auto px-6 py-2 md:py-2 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#002d17]/20">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-1">
              <span className="font-bold text-[#002d17] text-3xl tracking-tight">{s.value}</span>
              <span className="text-[#002d17]/70 font-bold text-xs uppercase tracking-widest mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#002d17]/10 bg-white sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-5 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-md ${
              activeFilter === "all"
                ? "bg-[#002d17] text-white"
                : "bg-transparent border border-[#002d17]/20 text-[#002d17]/70 hover:border-[#002d17] hover:text-[#002d17]"
            }`}
          >
            {allFilterLabel}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleFilterChange(cat.slug)}
              className={`px-5 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-md ${
                activeFilter === cat.slug
                  ? "bg-[#002d17] text-white"
                  : "bg-transparent border border-[#002d17]/20 text-[#002d17]/70 hover:border-[#002d17] hover:text-[#002d17]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <Link to={projectDetailPath(project.slug)} className="group flex flex-col">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#bcd8cb] rounded-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                    {project.category}
                  </div>
                  <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    project.status === "Hoan thanh" || project.status === "Hoàn thành" ? "bg-[#d5ede5] text-[#1a6645]" : "bg-[#002d17] text-[#f4aa1f]"
                  }`}>
                    {project.status}
                  </div>
                  {project.leedGold && (
                    <div className="absolute bottom-3 right-3 bg-[#b8860b] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                      LEED Gold
                    </div>
                  )}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-[#002d17]/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.images.slice(1, 4).map((img, i) => (
                        <div key={i} className="w-12 h-9 overflow-hidden shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {project.images.length > 4 && (
                        <div className="w-12 h-9 bg-[#002d17] flex items-center justify-center text-white text-xs font-bold">
                          +{project.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 pt-5 pb-3 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                  <h3 className="font-bold text-[#002d17] text-[20px] uppercase tracking-tight leading-snug group-hover:text-[#46aa85] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-[#002d17]/60 text-[16px] font-bold uppercase tracking-wider">
                      <MapPin size={14} className="text-[#f4aa1f]" /> {project.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#002d17]/60 text-[16px] font-bold uppercase tracking-wider">
                      <Maximize2 size={14} className="text-[#f4aa1f]" /> {project.area}
                    </span>
                  </div>
                  {project.renovationItems?.length ? (
                    <ul className="flex flex-col gap-1 mt-1">
                      {project.renovationItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[16px] leading-relaxed text-[#002d17]/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f4aa1f] mt-2.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">
                    {text("projects.detail")} <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#002d17] py-16" style={backgroundStyle(colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
              {cta?.title || ""}
            </h3>
            <p className="text-white/50 mt-2 text-sm">{cta?.description || ""}</p>
          </div>
          <Link
            to={cta?.linkUrl || ""}
            className="shrink-0 bg-[#f4aa1f] text-[#002d17] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            {cta?.linkLabel || ""}
          </Link>
        </div>
      </div>
    </div>
  );
}

