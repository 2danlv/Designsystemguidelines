import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import {
  ArrowRight,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsPageByTemplate, getCurrentLanguage, type AboutCmsData } from "../lib/wordpress";
import { getCmsIcon } from "../lib/cmsIcons";
import { sitePath } from "../lib/siteLinks";
import { VideoBackground } from "../components/VideoBackground";
import { CmsLoading } from "../components/CmsLoading";
import { useSiteText } from "../context/SiteSettingsContext";

type StatItem = {
  value: string;
  label: string;
};

type CoreValue = {
  icon: LucideIcon | null;
  iconImage?: string;
  title: string;
  desc: string;
};

type TimelineItem = {
  year: string;
  title: string;
  desc: string;
};

type CertificationItem = {
  code: string;
  title: string;
  org: string;
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

function splitStatValue(value: string) {
  const trimmed = value.trim();
  const hasPlus = trimmed.endsWith("+");

  return {
    number: hasPlus ? trimmed.slice(0, -1) : trimmed,
    suffix: hasPlus ? "+" : "",
  };
}

function heroVideoUrl(value: string) {
  return value.trim();
}

function quoteWithAccent(quote: string, accent: string) {
  if (!accent || !quote.includes(accent)) {
    return quote;
  }

  const parts = quote.split(accent);

  return (
    <>
      {parts[0]}
      <em className="not-italic" style={{ color: "#f4aa1f", fontWeight: 400 }}>
        {accent}
      </em>
      {parts.slice(1).join(accent)}
    </>
  );
}

export function About() {
  const language = getCurrentLanguage();
  const text = useSiteText();
  const [cmsPage, setCmsPage] = useState<AboutCmsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsPageByTemplate<AboutCmsData>("tona-about", controller.signal).then((page) => {
      if (!controller.signal.aborted) {
        setCmsPage(page);
        setLoaded(true);
      }
    });

    return () => controller.abort();
  }, []);

  const stats = useMemo<StatItem[]>(() => {
    const source = cmsPage?.stats || [];

    return source.map((stat) => ({
      value: stat.value || "",
      label: stat.label || "",
    }));
  }, [cmsPage]);

  const coreValues = useMemo<CoreValue[]>(() => {
    const source = cmsPage?.values || [];

    return source.map((value) => ({
      icon: getCmsIcon(value.icon),
      iconImage: value.iconImage || "",
      title: value.title || "",
      desc: value.desc || "",
    }));
  }, [cmsPage]);

  const timeline = useMemo<TimelineItem[]>(() => {
    const source = cmsPage?.timeline || [];

    return source.map((item) => ({
      year: item.year || "",
      title: item.title || "",
      desc: item.desc || "",
    }));
  }, [cmsPage]);

  const certifications = useMemo<CertificationItem[]>(() => {
    const source = cmsPage?.certifications || [];

    return source.map((cert) => ({
      code: cert.code || "",
      title: cert.title || "",
      org: cert.org || "",
    }));
  }, [cmsPage]);

  const colors = cmsPage?.colors;
  const hero = cmsPage?.hero;
  const ceo = cmsPage?.ceo;
  const heroVideo = heroVideoUrl(hero?.videoId || "");
  const heroEyebrow = hero?.eyebrow || "";
  const heroTitle = hero?.title || "";
  const heroDescription = hero?.description || "";
  const heroBottomLabel = hero?.bottomLabel || "";
  const missionEyebrow = cmsPage?.missionVision?.missionEyebrow || "";
  const missionText = cmsPage?.missionVision?.missionText || "";
  const visionEyebrow = cmsPage?.missionVision?.visionEyebrow || "";
  const visionText = cmsPage?.missionVision?.visionText || "";
  const valuesTitle = cmsPage?.valuesTitle || "";
  const timelineTitle = cmsPage?.timelineTitle || "";
  const certificationsTitle = cmsPage?.certificationsTitle || "";
  const ctaTitle = cmsPage?.cta?.title || "";
  const ctaDescription = cmsPage?.cta?.description || "";
  const primaryLabel = cmsPage?.cta?.primaryLabel || "";
  const primaryUrl = cmsPage?.cta?.primaryUrl || "";
  const secondaryLabel = cmsPage?.cta?.secondaryLabel || "";
  const secondaryUrl = cmsPage?.cta?.secondaryUrl || "";
  const ceoEyebrow = ceo?.eyebrow || "";
  const ceoQuote = ceo?.quote || "";
  const ceoAccent = ceo?.accent || "";
  const ceoName = ceo?.name || "";
  const ceoRole = ceo?.role || "";

  if (!loaded) {
    return <CmsLoading />;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh", ...backgroundStyle(colors?.heroBackground) }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          <VideoBackground
            src={heroVideo}
            title={text("common.video_title")}
            opacity={0.52}
          />
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,20,10,0.72) 0%, rgba(0,35,16,0.55) 45%, rgba(0,25,12,0.78) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 52% 15%, rgba(244,175,50,0.14) 0%, rgba(244,160,30,0.06) 38%, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,25,12,0.55) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(0,25,12,0.50) 0%, transparent 55%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,18,8,0.45) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,25,12,0.72))" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-between" style={{ zIndex: 3, minHeight: "100vh", paddingTop: "7rem", paddingBottom: "4rem" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex items-center gap-3">
            <div className="w-8 h-px bg-[#f4aa1f]/65" />
            <span className="text-[#f4aa1f]/70 text-xs font-bold uppercase tracking-widest">{heroEyebrow}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-1 py-10">
            <div className="flex flex-col gap-8">
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                <h1 className="font-bold text-white uppercase leading-none mb-5" style={{ fontSize: "clamp(46px, 7vw, 96px)", textShadow: "0 2px 40px rgba(0,0,0,0.25)" }}>
                  {renderLines(heroTitle)}
                </h1>
                <p className="text-white/65 text-[18px] leading-[1.8] font-normal max-w-[460px]">{heroDescription}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }} className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => {
                  const { number, suffix } = splitStatValue(stat.value);

                  return (
                    <motion.div
                      key={`${stat.label}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.07 }}
                      className="flex flex-col px-6 py-5"
                      style={{ borderRadius: "20px", background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.11)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.09)" }}
                    >
                      <div className="flex items-baseline gap-0.5 leading-none mb-3">
                        <span className="font-bold" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#f4aa1f", fontVariantNumeric: "tabular-nums" }}>{number}</span>
                        {suffix && <span className="font-light" style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: "rgba(244,170,31,0.55)" }}>{suffix}</span>}
                      </div>
                      <div className="w-6 h-px mb-3" style={{ background: "rgba(255,255,255,0.18)" }} />
                      <p className="font-light uppercase leading-snug" style={{ fontSize: "12px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-px bg-[#f4aa1f]/50" />
                <span className="font-light uppercase" style={{ fontSize: "12px", letterSpacing: "0.18em", color: "rgba(244,170,31,0.6)" }}>{ceoEyebrow}</span>
              </div>
              <div className="select-none pointer-events-none leading-none" style={{ fontSize: "clamp(100px, 12vw, 160px)", color: "rgba(244,170,31,0.13)", fontFamily: "'Times New Roman', serif", lineHeight: 1, marginBottom: "-0.28em" }}>&ldquo;</div>
              <blockquote className="flex flex-col gap-6">
                <p style={{ fontSize: "clamp(17px, 2vw, 26px)", fontFamily: "'Times New Roman', serif", fontStyle: "italic", fontWeight: 300, lineHeight: 1.78, color: "rgba(255,255,255,0.9)" }}>
                  {quoteWithAccent(ceoQuote, ceoAccent)}
                </p>
                <div className="flex flex-col gap-1 pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <span className="font-medium uppercase" style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", letterSpacing: "0.16em" }}>{ceoName}</span>
                  <span style={{ fontSize: "14px", fontFamily: "'Times New Roman', serif", fontStyle: "italic", color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>{ceoRole}</span>
                </div>
              </blockquote>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }} className="flex items-center justify-center gap-4 text-center">
            <div className="hidden sm:flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-[#f4aa1f]/28" /><div className="w-10 h-px bg-[#f4aa1f]/18" /><div className="w-1.5 h-1.5 rotate-45 bg-[#f4aa1f]/22" /></div>
            <span className="text-white/38 text-xs font-bold uppercase tracking-widest">{heroBottomLabel}</span>
            <div className="hidden sm:flex items-center gap-1.5"><div className="w-1.5 h-1.5 rotate-45 bg-[#f4aa1f]/22" /><div className="w-10 h-px bg-[#f4aa1f]/18" /><div className="w-1 h-1 rounded-full bg-[#f4aa1f]/28" /></div>
          </motion.div>
        </div>
      </section>

      {/* <section className="relative w-full bg-[#002d17] py-16 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#46aa85]/8 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { eyebrow: missionEyebrow, text: missionText, color: "#f4aa1f" },
            { eyebrow: visionEyebrow, text: visionText, color: "#46aa85" },
          ].map((item, index) => (
            <motion.div key={item.eyebrow} initial={{ opacity: 0, x: index === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="bg-white/5 p-8 border-l-4 rounded-r-2xl" style={{ borderColor: item.color }}>
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">{item.eyebrow}</p>
              <p className="text-white font-semibold text-xl md:text-2xl leading-snug uppercase">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section> */}

      <section className="bg-gradient-to-b from-[#002d17] to-[#f9f9f7] py-14" style={backgroundStyle(colors?.valuesBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10"><div className="w-16 h-1 bg-[#f4aa1f] mb-6" /><h2 className="text-3xl md:text-4xl font-semibold text-white uppercase tracking-tight">{valuesTitle}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div key={`${value.title}-${index}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group p-8 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer border border-white/60 rounded-2xl">
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center mb-5 group-hover:bg-[#f4aa1f] transition-colors rounded-xl">
                    {value.iconImage ? <img src={value.iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden /> : Icon ? <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" /> : null}
                  </div>
                  <h3 className="font-semibold text-[#002d17] group-hover:text-[#46aa85] uppercase text-base tracking-tight mb-3 transition-colors">{value.title}</h3>
                  <p className="text-[#002d17]/55 text-[16px] leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#f9f9f7]" style={backgroundStyle(colors?.timelineBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10"><div className="w-16 h-1 bg-[#f4aa1f] mb-6" /><h2 className="text-3xl md:text-4xl font-semibold text-[#002d17] uppercase tracking-tight">{timelineTitle}</h2></div>
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-16 md:left-24 top-0 bottom-0 w-px bg-[#002d17]/10 mx-[54px]" />
            {timeline.map((item, index) => (
              <motion.div key={`${item.year}-${index}`} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-8 md:gap-12 items-start group py-6 first:pt-0">
                <div className="shrink-0 w-16 md:w-24 flex flex-col items-end"><span className="font-semibold text-[#002d17]/30 group-hover:text-[#f4aa1f] text-lg md:text-2xl tracking-tight transition-colors">{item.year}</span></div>
                <div className="shrink-0 w-3 h-3 rounded-full bg-white border-2 border-[#002d17]/30 group-hover:border-[#f4aa1f] group-hover:bg-[#f4aa1f] mt-1.5 transition-colors relative z-10" />
                <div className="flex-1 pb-6 border-b border-[#002d17]/10 last:border-0"><h3 className="font-semibold text-[#002d17] uppercase tracking-tight text-lg mb-2">{item.title}</h3><p className="text-[#002d17]/55 text-[16px] leading-relaxed font-medium">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#002d17]" style={backgroundStyle(colors?.certificationsBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10"><div className="w-16 h-1 bg-[#f4aa1f] mb-6" /><h2 className="text-3xl font-semibold text-white uppercase tracking-tight">{certificationsTitle}</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <div key={`${cert.code}-${index}`} className="bg-white/5 hover:bg-[#46aa85] transition-colors p-7 flex flex-col gap-4 group rounded-2xl border border-white/10">
                <span className="text-[#f4aa1f] font-semibold text-3xl tracking-tight">{cert.code}</span>
                <div><h4 className="text-white font-semibold uppercase tracking-tight text-base">{cert.title}</h4><p className="text-white/40 text-[13px] font-bold uppercase tracking-widest mt-1">{language === "en" ? "Issued by" : "Cấp bởi"} {cert.org}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white py-12 border-t border-[#002d17]/10" style={backgroundStyle(colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div><h3 className="text-2xl md:text-3xl font-semibold text-[#002d17] uppercase tracking-tight">{ctaTitle}</h3><p className="text-[#002d17]/50 mt-2 text-sm font-medium">{ctaDescription}</p></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={primaryUrl} className="flex items-center justify-center gap-2 border-2 border-[#002d17] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-white transition-colors rounded-lg">{primaryLabel} <ArrowRight size={14} /></Link>
            <Link to={secondaryUrl} className="flex items-center justify-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors rounded-lg">{secondaryLabel} <ArrowRight size={14} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
