import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import { ArrowRight, ChevronRight, Handshake, Heart, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsPage, fetchCmsPageByTemplate, type CsrCmsData } from "../lib/wordpress";
import { CmsLoading } from "../components/CmsLoading";
import { useSiteText } from "../context/SiteSettingsContext";
import { getCmsIcon } from "../lib/cmsIcons";
import { sitePath } from "../lib/siteLinks";

type CsrProgram = {
  id: string;
  icon: LucideIcon | null;
  color: string;
  bgColor: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  stats: Array<{ val: string; label: string }>;
  highlights: string[];
  image: string;
};

type CsrImpact = {
  icon: LucideIcon | null;
  val: string;
  label: string;
};


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

export function CSR() {
  const text = useSiteText();
  const [cmsPage, setCmsPage] = useState<CsrCmsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchCmsPageByTemplate<CsrCmsData>("tona-csr", controller.signal)
      .then((page) => page || fetchCmsPage<CsrCmsData>("cuoc-song-tona/trach-nhiem-cong-dong", controller.signal))
      .then((page) => {
        if (!controller.signal.aborted) {
          setCmsPage(page);
          setLoaded(true);
        }
      });
    return () => controller.abort();
  }, []);

  const communityImpact = useMemo<CsrImpact[]>(() => {
    return (cmsPage?.impact || []).map((item) => ({
      icon: getCmsIcon(item.icon),
      val: item.value || "",
      label: item.label || "",
    }));
  }, [cmsPage]);

  const programs = useMemo<CsrProgram[]>(() => {
    return (cmsPage?.programs || []).map((program, index) => ({
      id: program.id || `csr-program-${index}`,
      icon: getCmsIcon(program.icon),
      color: program.color || "#f4aa1f",
      bgColor: program.bgColor || "#fffdf5",
      tag: program.tag || "",
      title: program.title || "",
      subtitle: program.subtitle || "",
      desc: program.description || "",
      stats: program.stats?.map((stat) => ({
        val: stat.value || "",
        label: stat.label || "",
      })) || [],
      highlights: program.highlights || [],
      image: program.image || "",
    }));
  }, [cmsPage]);

  const commitmentItems = cmsPage?.commitment?.items || [];
  const heroTitle = cmsPage?.hero?.title || "";
  const heroDescription = cmsPage?.hero?.description || "";

  if (!loaded) {
    return <CmsLoading />;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden" style={backgroundStyle(cmsPage?.colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8 flex-wrap">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">{text("common.home")}</Link>
            <ChevronRight size={12} />
            <Link to={sitePath("culture")} className="hover:text-[#f4aa1f] transition-colors">{text("common.culture")}</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{cmsPage?.hero?.breadcrumbLabel || ""}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
              <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight mb-6">
                {renderLines(heroTitle)}
              </h1>
              <p className="text-white/60 text-base font-medium leading-relaxed max-w-lg">
                {heroDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {communityImpact.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-[#002d17] px-6 py-6 flex flex-col gap-2">
                    {Icon && <Icon size={18} className="text-[#f4aa1f]" />}
                    <span className="font-bold text-[#f4aa1f] text-3xl">{item.val}</span>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-bold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#46aa85]/10 pointer-events-none hidden lg:block" />
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-bold text-white/[0.03] uppercase leading-none select-none pointer-events-none">
          {cmsPage?.hero?.decorativeText || ""}
        </div>
      </div>

      {/* PROGRAMS */}
      <section className="py-20 bg-white" style={backgroundStyle(cmsPage?.colors?.programsBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#002d17] uppercase tracking-tight">
              {cmsPage?.programsSection?.title || ""}
            </h2>
            <p className="text-[#002d17]/50 text-[16px] font-medium mt-3 max-w-xl">
              {cmsPage?.programsSection?.description || ""}
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {programs.map((prog, idx) => {
              const Icon = prog.icon;
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={prog.id}
                  id={prog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10 items-stretch ${isEven ? "" : "lg:[direction:rtl]"}`}
                >
                  <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#bcd8cb] ${isEven ? "" : "lg:[direction:ltr]"}`}>
                    <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002d17]/50 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#002d17]/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                      {Icon && <Icon size={16} style={{ color: prog.color }} />}
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{prog.tag}</span>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-3 lg:aspect-[4/3] lg:min-h-0 lg:overflow-hidden lg:justify-between ${isEven ? "" : "lg:[direction:ltr]"}`}>
                    <div>
                      <div className="w-10 h-0.5 mb-3" style={{ backgroundColor: prog.color }} />
                      <h3 className="text-2xl md:text-3xl font-bold text-[#002d17] uppercase tracking-tight leading-snug mb-1">
                        {prog.title}
                      </h3>
                      <p className="font-bold text-xs uppercase tracking-widest" style={{ color: prog.color }}>
                        {prog.subtitle}
                      </p>
                    </div>

                    <p
                      className="text-[#002d17]/65 text-[16px] leading-6 font-medium lg:line-clamp-3"
                      title={prog.desc}
                    >
                      {prog.desc}
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {prog.stats.map((s) => (
                        <div key={s.label} className="rounded-xl px-3 py-2.5 border border-[#002d17]/10" style={{ backgroundColor: prog.bgColor }}>
                          <span className="font-bold text-[#002d17] text-xl">{s.val}</span>
                          <p className="text-[#002d17]/50 text-[10px] leading-4 uppercase tracking-widest font-bold mt-0.5 line-clamp-2">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="min-h-0">
                      <p className="text-[#002d17]/40 font-bold text-xs uppercase tracking-widest mb-2">{text("common.highlights")}</p>
                      <ul className="flex flex-col gap-2">
                        {prog.highlights.map((h, i) => (
                          <li
                            key={i}
                            className={`items-start gap-3 text-[#002d17]/70 text-[16px] leading-5 font-medium ${i >= 4 ? "flex lg:hidden" : "flex"}`}
                            title={h}
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: prog.color }} />
                            <span className="lg:line-clamp-1">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMITMENT STRIP */}
      <section className="bg-[#f9f9f7] py-16 border-y border-[#002d17]/10" style={backgroundStyle(cmsPage?.colors?.commitmentBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold text-[#002d17] uppercase tracking-tight mb-4">
                {renderLines(cmsPage?.commitment?.title || "")}
              </h3>
              <p className="text-[#002d17]/60 text-sm leading-relaxed font-medium max-w-lg">
                {cmsPage?.commitment?.description || ""}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {commitmentItems.map((item) => (
                <div key={item.title} className="flex gap-4 items-start bg-white rounded-xl p-5 border border-[#002d17]/8">
                  <div className="w-2 h-2 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#002d17] text-sm uppercase tracking-tight">{item.title}</h4>
                    <p className="text-[#002d17]/55 text-sm font-medium mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#002d17] py-14" style={backgroundStyle(cmsPage?.colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
              {cmsPage?.cta?.title || ""}
            </h3>
            <p className="text-white/50 mt-2 text-sm font-medium">
              {cmsPage?.cta?.description || ""}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to={cmsPage?.cta?.secondaryUrl || sitePath("culture")}
              className="flex items-center gap-2 border-2 border-white/20 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:border-[#f4aa1f] hover:text-[#f4aa1f] transition-colors rounded-lg"
            >
              {cmsPage?.cta?.secondaryLabel || ""}
            </Link>
            <Link
              to={cmsPage?.cta?.primaryUrl || sitePath("jobs")}
              className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
            >
              {cmsPage?.cta?.primaryLabel || ""} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


