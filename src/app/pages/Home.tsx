import { useState, useEffect, useCallback } from "react";
import { Link } from "../components/LocalizedLink";
import {
  ArrowRight, ArrowLeft, ChevronDown,
  PenTool, Wrench, Building2, Zap,
  MapPin, Maximize2
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import {
  fetchCmsNews,
  fetchCmsPageByTemplate,
  fetchCmsProjects,
  type HomeCmsData,
  type NewsPost,
  type ProjectPost,
  type ServicesCmsData,
} from "../lib/wordpress";
import { getCmsIcon } from "../lib/cmsIcons";
import { useSiteText } from "../context/SiteSettingsContext";
import { projectDetailPath, sitePath } from "../lib/siteLinks";

type HomeService = {
  id: number | string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  desc: string;
  highlight?: boolean;
};

const DEFAULT_HOME_VIDEO_ID = "wDmNBXfd7K8";

function youtubeVideoId(value?: string) {
  const raw = (value || "").trim();
  if (!raw) return DEFAULT_HOME_VIDEO_ID;

  const match = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || raw;
}

// HERO SECTION
function HeroSection({ content }: { content?: HomeCmsData["hero"] }) {
  const text = useSiteText();
  const videoId = youtubeVideoId(content?.videoId);
  const backgroundColor = content?.backgroundColor || "#001810";
  const ticker = content?.ticker || "BUILDING RIGHT - GREEN CONSTRUCTION - ENERGY";
  const title = content?.title || "Build It";
  const titleImage = content?.titleImage;
  const description = content?.description || "Reliable partner in green construction & energy";
  const primaryLabel = content?.primaryLabel || text("home.hero.primary_label", "Xem Dự Án");
  const primaryUrl = content?.primaryUrl || sitePath("projects");
  const secondaryLabel = content?.secondaryLabel || text("home.hero.secondary_label", "Dịch Vụ");
  const secondaryUrl = content?.secondaryUrl || sitePath("services");
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % (ticker.length + 12);
      setDisplayed(ticker.slice(0, Math.min(index, ticker.length)));
    }, 65);

    return () => window.clearInterval(timer);
  }, [ticker]);

  return (
    <section
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-[#001810]"
      style={{ backgroundColor }}
    >
    
          {/* ── YouTube fullscreen background ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&rel=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`}
              title="Tona Timelapse"
              allow="autoplay; encrypted-media"
              style={{
                position: "absolute",
                width: "100vw",
                height: "56.25vw",
                minHeight: "100vh",
                minWidth: "177.78vh",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "none",
              }}
            />
          </div>
    
          {/* ── Overlays ── */}
          {/* Left-heavy vignette for editorial readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001810]/90 via-[#001810]/50 to-[#001810]/10 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001810]/80 via-transparent to-[#001810]/30 z-10" />
    
          {/* ── Typewriter ticker — top right ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute top-[88px] right-8 md:right-16 z-20 hidden md:flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#f4aa1f] animate-pulse" />
            <span className="text-white/50 font-bold text-xs uppercase tracking-[0.2em] min-w-[280px]">
              {displayed}
              <span className="inline-block w-0.5 h-[0.85em] bg-[#f4aa1f]/60 ml-0.5 align-middle animate-pulse" />
            </span>
          </motion.div>
    
          {/* ── Main editorial content — bottom-left anchored ── */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 pb-16 md:pb-24">
            <div className="max-w-7xl mx-auto w-full mx-[92px] my-[0px]">
    
              {/* Logo + meta row */}
              
    
              {/* ── Typography hero block ── */}
              <div className="flex flex-col leading-none mb-6">
    
                {/* "BUILD IT" — Bebas Neue, modern, condensed, no serif */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="block select-none"
                >
                  {titleImage ? (
                    <img
                      src={titleImage}
                      alt={title}
                      className="max-h-[140px] w-auto max-w-[min(80vw,560px)] object-contain object-left"
                    />
                  ) : (
                    <span
                      className="block text-white"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "50px",
                        letterSpacing: "0.06em",
                        lineHeight: 0.9,
                      }}
                    >
                      {title}
                    </span>
                  )}
                </motion.div>
    
                {/* "Right" — Kaushan Script, brush, bold, gold */}
                
              </div>
    
              {/* ── Divider + description ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-5 mb-10"
              >
                
                <p
                  className="font-semibold tracking-wide leading-snug max-w-md uppercase"
                  style={{
                    fontSize: "clamp(17px, 2.2vw, 22px)",
                    color: "rgba(255,255,255,0.82)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {description}
                </p>
              </motion.div>
    
              {/* ── Stats + CTAs ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
              >
                {/* Stats */}
                
    
                {/* Thin vertical separator */}
                
    
                {/* CTAs */}
                <div className="flex items-center gap-3">
                  <Link
                    to={primaryUrl}
                    className="bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors rounded-lg"
                  >
                    {primaryLabel}
                  </Link>
                  <Link
                    to={secondaryUrl}
                    className="border border-white/25 text-white/80 px-6 py-3 font-bold uppercase tracking-widest text-xs hover:border-[#f4aa1f] hover:text-[#f4aa1f] transition-colors rounded-lg"
                  >
                    {secondaryLabel}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
    
          {/* ── Scroll indicator — bottom center ── */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <ChevronDown size={18} className="text-white/30" />
            </motion.div>
          </div>
    </section>
  );
}

// MARQUEE STRIP
function MarqueeStrip({ items: cmsItems }: { items?: string[] }) {
  if (!cmsItems?.length) return null;

  const items = [...cmsItems, ...cmsItems];
  return (
    <div className="w-full bg-[#f4aa1f] overflow-hidden py-2.5 flex">
      <motion.div
        className="flex whitespace-nowrap min-w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
      >
        {items.map((item, idx) => (
          <span key={idx} className="px-6 text-[#002d17] font-bold text-xs uppercase tracking-widest flex items-center gap-6">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[#002d17]/30 inline-block" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ServicesSection({ title, items }: { title?: string; items: HomeService[] }) {
  const text = useSiteText();

  if (!items.length) return null;

  return (
    <section id="home-services" className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="mb-12 md:mb-16">
          <h2 className="text-[34px] font-black uppercase leading-none tracking-[-0.04em] text-[#002d17] md:text-[42px]">
            {title || text("home.services.title", "Dịch Vụ Cốt Lõi")}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-5 md:gap-y-4">
          {items.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className={`group relative flex min-h-[208px] cursor-pointer gap-5 rounded-[18px] border p-6 transition-all duration-300 md:gap-7 md:p-10
                  ${
                    svc.highlight
                      ? "border-[#003f24] bg-[#003f24] hover:bg-[#002d17]"
                      : "border-[#002d17]/15 bg-white hover:border-[#46aa85]/60 hover:bg-[#f7fcfa]"
                  }`}
              >
                {svc.highlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#f4aa1f] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#002d17] md:right-5 md:top-5">
                    Thế Mạnh
                  </div>
                )}
                <div
                  className={`flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl border-2 transition-colors
                    ${
                      svc.highlight
                        ? "border-[#f4aa1f] bg-[#f4aa1f]"
                        : "border-[#f4aa1f] bg-white group-hover:bg-[#f4aa1f]"
                    }`}
                >
                  <Icon
                    size={24}
                    strokeWidth={2.25}
                    className={`transition-colors ${
                      svc.highlight ? "text-[#002d17]" : "text-[#f4aa1f] group-hover:text-[#002d17]"
                    }`}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col pt-0.5 md:pr-8">
                  <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f4aa1f]">
                    {svc.subtitle}
                  </p>
                  <h3
                    className={`mb-3 text-[21px] font-extrabold leading-tight tracking-[-0.035em] transition-colors md:text-[23px] ${
                      svc.highlight ? "text-white" : "text-[#002d17] group-hover:text-[#46aa85]"
                    }`}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className={`max-w-[560px] text-sm leading-6 md:text-[15px] ${
                      svc.highlight ? "text-white/75" : "text-[#002d17]/55"
                    }`}
                  >
                    {svc.desc}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className={`absolute bottom-8 right-7 transition-all duration-300 group-hover:translate-x-1 ${
                    svc.highlight ? "text-[#f4aa1f]" : "text-[#002d17]/20 group-hover:text-[#f4aa1f]"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Link
            to={sitePath("services")}
            className="flex min-h-[60px] w-full items-center justify-center gap-4 rounded-[18px] bg-[#f4aa1f] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-[#002d17] transition-colors hover:bg-[#002d17] hover:text-[#f4aa1f]"
          >
            {text("home.services.view_all", "Xem Tất Cả Dịch Vụ")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
// SLOGAN / BRAND SECTION
function SloganSection({ content }: { content?: HomeCmsData["slogan"] }) {
  if (!content) return null;

  const stats = content.stats || [];

  return (
      <section className="relative w-full bg-[#002d17] overflow-hidden py-16 md:py-20">
        <div className="absolute right-0 top-0 w-[45%] h-full bg-gradient-to-l from-[#46aa85]/8 to-transparent pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-48 h-48 border border-[#f4aa1f]/10 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="absolute right-16 top-8 w-24 h-24 border border-[#46aa85]/20 rounded-full pointer-events-none" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-extrabold text-white/[0.03] uppercase leading-none select-none pointer-events-none tracking-tighter">
          TONA
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start gap-6 max-w-3xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-[#f4aa1f]" />
              <span className="text-[#f4aa1f] font-bold text-xs md:text-sm uppercase tracking-[0.25em]">
                {content.eyebrow}
              </span>
            </div>
            <h2 className="flex flex-col font-extrabold text-white uppercase tracking-tight leading-[1.05] text-[48px] md:text-[64px]">
              <span className="whitespace-pre-line">{content.title}</span>
              <span className="text-[#46aa85]">{content.accentTitle}</span>
            </h2>
            <p className="text-white/60 font-medium text-base md:text-lg max-w-xl leading-relaxed">
              {content.description}
            </p>
            <div className="w-16 h-1 bg-[#f4aa1f]" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 w-full">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="flex flex-col gap-1">
                  <span className="text-[#f4aa1f] font-extrabold text-2xl md:text-3xl tracking-tight">{stat.value}</span>
                  <span className="text-white/40 font-bold text-[13px] uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
}

// SERVICES HIGHLIGHT

function normalizeHomeServices(items?: ServicesCmsData["services"]): HomeService[] {
  if (!items?.length) return [];

  const sortedItems = [...items].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return sortedItems.slice(0, 4).map((item, index) => ({
    id: item.number || item.title || index,
    icon: getCmsIcon(item.icon, Wrench),
    title: item.title || "",
    subtitle: item.subtitle || "",
    desc: item.description || "",
    highlight: Boolean(item.featured),
  }));
}


// PROJECTS CAROUSEL
function ProjectsSection({
  items,
  label,
  title,
}: {
  items: ProjectPost[];
  label?: string;
  title?: string;
}) {
  const text = useSiteText();
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, containScroll: "trimSnaps", align: "start" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateBtns = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateBtns);
    emblaApi.on("reInit", updateBtns);
    updateBtns();
  }, [emblaApi, updateBtns]);

  if (!items.length) {
    return null;
  }

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="bg-[#002d17]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">{label || text("home.projects.label", "Portfolio")}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">{title || text("home.projects.title", "Dự Án Nổi Bật")}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev}
              className="w-12 h-12 border-2 rounded-sm border-white/30 hover:border-[#f4aa1f] text-white hover:text-[#f4aa1f] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} disabled={!canNext}
              className="w-12 h-12 border-2 rounded-sm border-white/30 hover:border-[#f4aa1f] text-white hover:text-[#f4aa1f] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowRight size={18} />
            </button>
          <Link to={sitePath("projects")} className="hidden md:flex items-center gap-2 ml-4 text-white/60 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors">
              {text("home.projects.view_all", "Xem tất cả")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-14 overflow-hidden">
        <div className="pl-6 md:pl-[calc((100vw-80rem)/2+1.5rem)]" ref={emblaRef}>
          <div className="flex gap-6 cursor-grab active:cursor-grabbing">
            {items.map((project) => (
              <div key={project.id} className="flex-[0_0_88%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_38%] min-w-0">
                <Link to={projectDetailPath(project.slug)} className="group flex flex-col select-none">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    <img src={project.image} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" draggable={false} />
                    <div className="absolute top-4 left-4 bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-xs font-bold uppercase tracking-widest">
                      {project.category}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-5 pb-2 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                    <h3 className="font-extrabold text-[#002d17] text-lg uppercase tracking-tight leading-snug group-hover:text-[#46aa85] transition-colors">
                      {project.title}
                    </h3>
                    {/* Key info row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      <span className="flex items-center gap-1 text-[#002d17]/60 text-xs font-bold uppercase tracking-wider">
                        <MapPin size={11} className="text-[#f4aa1f]" /> {project.location}
                      </span>
                      <span className="flex items-center gap-1 text-[#002d17]/60 text-xs font-bold uppercase tracking-wider">
                        <Maximize2 size={11} className="text-[#f4aa1f]" /> {project.area}
                      </span>
                    </div>
                    {/* Renovation items preview */}
                    {project.renovationItems && (
                      <ul className="mt-1 flex flex-col gap-1">
                        {project.renovationItems.slice(0, 2).map((item, i) => (
                          <li key={i} className="text-xs text-[#002d17]/50 flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-2">
                      Chi tiết dự án <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// NEWS SECTION
function NewsSection({ items, title }: { items: NewsPost[]; title?: string }) {
  const text = useSiteText();
  const source = items;
  const featured = source[0];
  const rest = source.slice(1, 4);

  if (!featured) return null;

  return (
    <section className="w-full bg-[#f9f9f7] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              {title || text("home.news.title", "Tin Tức & Hoạt Động")}
            </h2>
          </div>
          <Link to={sitePath("news")} className="shrink-0 flex items-center gap-2 text-[#002d17] font-bold text-xs uppercase tracking-widest hover:text-[#f4aa1f] transition-colors">
            {text("home.news.view_all", "Xem Tất Cả")} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 group cursor-pointer flex flex-col"
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#bcd8cb] rounded-xl">
              <img src={featured.image} alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
              <div className="absolute top-3 left-3 bg-[#f4aa1f] text-[#002d17] px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full">
                {featured.category}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-6 pb-4 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
              <span className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">{featured.date}</span>
              <h3 className="font-extrabold text-[#002d17] text-2xl uppercase leading-snug tracking-tight group-hover:text-[#46aa85] transition-colors">
                {featured.title}
              </h3>
              <p className="text-[#002d17]/60 text-sm leading-relaxed">{featured.excerpt}</p>
              <span className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">{text("home.news.read_more", "Đọc tiếp")} <ArrowRight size={12} /></span>
            </div>
          </motion.article>

          {/* Side list */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {rest.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex gap-4 cursor-pointer"
              >
                <div className="relative shrink-0 w-28 h-20 overflow-hidden bg-[#bcd8cb] rounded-lg">
                  <img src={item.image} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col gap-2 border-b border-[#002d17]/10 pb-4 flex-1 group-hover:border-[#f4aa1f] transition-colors">
                  <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{item.category}</span>
                  <h4 className="font-extrabold text-[#002d17] text-sm uppercase leading-snug group-hover:text-[#46aa85] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <span className="text-[#002d17]/40 text-xs font-medium">{item.date}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// PARTNERS AUTO-SCROLL
function PartnersSection({ content }: { content?: HomeCmsData["partners"] }) {
  const text = useSiteText();
  const logos = content?.logos?.filter(Boolean) || [];
  const doubledLogos = [...logos, ...logos];

  if (!logos.length) return null;

  return (
    <section className="w-full bg-[#002d17] py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
              {content?.title || text("home.partners.title", "Partners & Customers")}
            </h3>
          </div>
          <p className="text-white/40 text-sm max-w-xs">
            {content?.description || "Đối tác tin cậy của các tập đoàn đa quốc gia hàng đầu trong lĩnh vực xây dựng và MEP."}
          </p>
        </div>
      </div>

      {/* Auto-scroll row */}
      <div className="relative flex w-full">
        <motion.div
          className="flex gap-5 min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        >
          {doubledLogos.map((partner, idx) => (
            <div
              key={idx}
              className="w-40 md:w-48 h-24 overflow-hidden bg-[#0a3d22] hover:bg-[#46aa85] border border-white/5 hover:border-[#f4aa1f]/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 rounded-xl"
            >
              {typeof partner === "string" ? (
                <img src={partner} alt="" className="object-contain" />
              ) : (
                <span className="text-white/50 hover:text-white font-extrabold text-xs md:text-sm uppercase tracking-widest text-center whitespace-pre-line leading-tight px-2 transition-colors">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row reverse */}
      <div className="relative flex w-full mt-5">
        <motion.div
          className="flex gap-5 min-w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 38, ease: "linear" }}
        >
          {[...doubledLogos].reverse().map((partner, idx) => (
            <div
              key={idx}
              className="w-40 md:w-48 h-24 bg-[#0a3d22] overflow-hidden hover:bg-[#46aa85] border border-white/5 hover:border-[#f4aa1f]/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 rounded-xl"
            >
              {typeof partner === "string" ? (
                <img src={partner} alt="" className="object-contain opacity-80" />
              ) : (
                <>
                  <span className="text-white/30 hover:text-white font-extrabold text-xs md:text-sm uppercase tracking-widest text-center whitespace-pre-line leading-tight px-2 transition-colors">
                    {partner.name}
                  </span>
                  <span className="text-white/20 text-[9px] text-center px-3 tracking-wider hidden md:block">
                    {partner.tagline}
                  </span>
                </>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ROOT
export function Home() {
  const [cmsPage, setCmsPage] = useState<HomeCmsData | null>(null);
  const [servicesPage, setServicesPage] = useState<ServicesCmsData | null>(null);
  const [cmsProjects, setCmsProjects] = useState<ProjectPost[]>([]);
  const [cmsNews, setCmsNews] = useState<NewsPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCmsPageByTemplate<HomeCmsData>("tona-home", controller.signal),
      fetchCmsPageByTemplate<ServicesCmsData>("tona-services", controller.signal),
      fetchCmsProjects(controller.signal),
      fetchCmsNews(controller.signal),
    ])
      .then(([homeData, servicesData, projectsData, newsData]) => {
        setCmsPage(homeData);
        setServicesPage(servicesData);
        setCmsProjects(projectsData);
        setCmsNews(newsData);
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCmsPage(null);
          setServicesPage(null);
          setCmsProjects([]);
          setCmsNews([]);
        }
      });

    return () => controller.abort();
  }, []);

  const projectItems = cmsProjects;
  const newsItems = cmsNews;
  const homeServices = normalizeHomeServices(servicesPage?.services);

  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      <HeroSection content={cmsPage?.hero} />
      <MarqueeStrip items={cmsPage?.marquee?.items} />
      <ProjectsSection
        items={projectItems}
        label={cmsPage?.sections?.projectsLabel}
        title={cmsPage?.sections?.projectsTitle}
      />
      <ServicesSection title={cmsPage?.sections?.servicesTitle} items={homeServices} />
      <SloganSection content={cmsPage?.slogan} />
      <NewsSection items={newsItems} title={cmsPage?.sections?.newsTitle} />
      <PartnersSection content={cmsPage?.partners} />
    </div>
  );
}


