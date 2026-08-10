import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import { ChevronRight, Heart, ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { fetchCmsPageByTemplate, type CultureCmsData } from "../lib/wordpress";
import { CmsLoading } from "../components/CmsLoading";
import { useSiteText } from "../context/SiteSettingsContext";
import { getCmsIcon } from "../lib/cmsIcons";
import { sitePath } from "../lib/siteLinks";

type StatItem = {
  value: string;
  label: string;
};

type YearlyTheme = {
  year: string;
  theme: string;
  color: string;
  desc: string;
  milestones: string[];
  active: boolean;
};

type CultureActivity = {
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  icon: LucideIcon | null;
  iconImage?: string;
  color: string;
};


function backgroundStyle(color?: string) {
  return color ? { backgroundColor: color } : undefined;
}

function renderLines(text: string) {
  return text.replace(/\r\n/g, "\n").split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export function Culture() {
  const text = useSiteText();
  const [cmsPage, setCmsPage] = useState<CultureCmsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsPageByTemplate<CultureCmsData>("tona-culture", controller.signal).then((page) => {
      if (!controller.signal.aborted) {
        setCmsPage(page);
        setLoaded(true);
      }
    });

    return () => controller.abort();
  }, []);

  const stats = useMemo<StatItem[]>(() => {
    return (cmsPage?.stats || []).map((item) => ({
      value: item.value || "",
      label: item.label || "",
    }));
  }, [cmsPage]);

  const yearlyThemes = useMemo<YearlyTheme[]>(() => {
    return (cmsPage?.yearlyThemes || []).map((item) => ({
      year: item.year || "",
      theme: item.theme || "",
      color: item.color || "#f4aa1f",
      desc: item.description || "",
      milestones: item.milestones?.length ? item.milestones : [],
      active: Boolean(item.active),
    }));
  }, [cmsPage]);

  const activities = useMemo<CultureActivity[]>(() => {
    return (cmsPage?.activities || []).map((item) => ({
      title: item.title || "",
      subtitle: item.subtitle || "",
      desc: item.description || "",
      image: item.image || "",
      icon: getCmsIcon(item.icon),
      iconImage: item.iconImage || "",
      color: item.color || "#f4aa1f",
    }));
  }, [cmsPage]);

  const academyStats = useMemo<StatItem[]>(() => {
    return (cmsPage?.academy?.stats || []).map((item) => ({
      value: item.value || "",
      label: item.label || "",
    }));
  }, [cmsPage]);

  const socialStats = useMemo<StatItem[]>(() => {
    return (cmsPage?.socialResponsibility?.stats || []).map((item) => ({
      value: item.value || "",
      label: item.label || "",
    }));
  }, [cmsPage]);

  const galleryPhotos = cmsPage?.gallery?.photos || [];
  const colors = cmsPage?.colors;
  const heroTitle = cmsPage?.hero?.title || "";
  const heroDescription = cmsPage?.hero?.description || "";
  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "";
  const decorativeText = cmsPage?.hero?.decorativeText || "";
  const themesTitle = cmsPage?.themesTitle || "";
  const themesDescription = cmsPage?.themesDescription || "";
  const activitiesTitle = cmsPage?.activitiesTitle || "";
  const social = cmsPage?.socialResponsibility;
  const socialEyebrow = social?.eyebrow || "";
  const socialTitle = social?.title || "";
  const socialDescription = social?.description || "";
  const socialImage = social?.image || "";
  const socialBadges = social?.badges || [];
  const socialLinkLabel = social?.linkLabel || "";
  const socialLinkUrl = social?.linkUrl || sitePath("csr");
  const academyEyebrow = cmsPage?.academy?.eyebrow || "";
  const academyTitle = cmsPage?.academy?.title || "";
  const academyDescription = cmsPage?.academy?.description || "";
  const academyImage = cmsPage?.academy?.image || "";
  const academyLinkLabel = cmsPage?.academy?.linkLabel || "";
  const academyLinkUrl = cmsPage?.academy?.linkUrl || sitePath("jobs");
  const galleryTitle = cmsPage?.gallery?.title || "";
  const ctaTitle = cmsPage?.cta?.title || "";
  const ctaDescription = cmsPage?.cta?.description || "";
  const ctaLinkLabel = cmsPage?.cta?.linkLabel || "";
  const ctaLinkUrl = cmsPage?.cta?.linkUrl || sitePath("jobs");
  const regularActivities = activities
    .filter((activity) => !`${activity.title} ${activity.subtitle}`.toLowerCase().includes("csr"))
    .slice(0, 3);

  if (!loaded) {
    return <CmsLoading />;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden" style={backgroundStyle(colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">{text("common.home")}</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight mb-4">
            {renderLines(heroTitle)}
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl mt-4">
            {heroDescription}
          </p>
        </div>
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-bold text-white/5 uppercase leading-none select-none pointer-events-none">
          {decorativeText}
        </div>
      </div>

      {/* PEOPLE STATS */}
      <div className="bg-[#f4aa1f]" style={backgroundStyle(colors?.statsBackground)}>
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#002d17]/20">
          {stats.map((item) => (
            <div key={item.label} className="flex flex-col items-center py-2">
              <span className="font-bold text-[#002d17] text-3xl tracking-tight">{item.value}</span>
              <span className="text-[#002d17]/70 font-bold text-xs uppercase tracking-widest mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* YEARLY THEME SECTION */}
      <section className="py-20 md:py-28 bg-white" style={backgroundStyle(colors?.themesBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#002d17] uppercase tracking-tight">
              {themesTitle}
            </h2>
            <p className="text-[#002d17]/50 mt-3 text-[16px] font-medium">
              {themesDescription}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {yearlyThemes.map((theme, index) => (
              <motion.div
                key={`${theme.year}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden transition-all duration-300 rounded-2xl ${
                  theme.active
                    ? "bg-[#002d17] cursor-default"
                    : "bg-white border border-[#002d17]/10 hover:border-[#002d17] cursor-pointer"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 p-8 md:p-10">
                  <div className="shrink-0">
                    <div className="w-16 h-1 mb-3" style={{ backgroundColor: theme.color }} />
                    <span className={`font-bold text-4xl tracking-tight ${theme.active ? "text-white" : "text-[#002d17]/30"}`}>
                      {theme.year}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className={`font-bold text-3xl md:text-4xl uppercase tracking-tight mb-4 ${theme.active ? "text-[#f4aa1f]" : "text-[#002d17]"}`}>
                      {theme.theme}
                    </h3>
                    <p className={`text-[16px] leading-relaxed font-medium mb-6 max-w-xl ${theme.active ? "text-white/70" : "text-[#002d17]/60"}`}>
                      {theme.desc}
                    </p>
                    <ul className="flex flex-col gap-2">
                      {theme.milestones.map((milestone, milestoneIndex) => (
                        <li key={milestoneIndex} className={`flex items-start gap-3 text-[16px] font-medium ${theme.active ? "text-white/60" : "text-[#002d17]/50"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={`absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-[80px] md:text-[120px] font-bold uppercase leading-none select-none pointer-events-none ${
                  theme.active ? "text-white/5" : "text-[#002d17]/5"
                }`}>
                  {theme.theme.split(" ")[0]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE ACTIVITIES */}
      <section className="py-20 bg-[#f9f9f7]" style={backgroundStyle(colors?.activitiesBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#002d17] uppercase tracking-tight">
              {activitiesTitle}
            </h2>
          </div>

          {/* Regular activities grid (3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {regularActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={`${activity.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#002d17]/8 bg-white"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#002d17]/30 group-hover:bg-[#002d17]/10 transition-colors" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#002d17]/70 px-3 py-2 rounded-xl">
                      {activity.iconImage ? (
                        <img src={activity.iconImage} alt="" className="w-4 h-4 object-contain" aria-hidden />
                      ) : Icon ? (
                        <Icon size={16} className="text-[#f4aa1f]" />
                      ) : null}
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{activity.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-5 pb-4 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors px-4">
                    <h3 className="font-bold text-[#002d17] text-lg uppercase tracking-tight">{activity.title}</h3>
                    <p className="text-[#002d17]/60 text-sm leading-relaxed">{activity.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CSR Featured Tile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl bg-[#002d17]"
            style={backgroundStyle(colors?.socialResponsibilityBackground)}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-[#002d17] via-[#002d17]/95 to-transparent z-10" />
              <img
                src={socialImage}
                alt="CSR"
                className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700"
              />
            </div>
            <div className="relative z-20 flex flex-col md:flex-row md:items-center gap-8 p-8 md:p-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#f4aa1f] flex items-center justify-center shrink-0">
                    <Heart size={18} className="text-[#002d17]" />
                  </div>
                  <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{socialEyebrow}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-snug mb-3">
                  {renderLines(socialTitle)}
                </h3>
                <p className="text-white/60 text-[16px] font-medium leading-relaxed max-w-lg mb-5">
                  {socialDescription}
                </p>
                <div className="flex flex-wrap gap-3">
                  {socialBadges.map((badge, index) => (
                    <span
                      key={`${badge}-${index}`}
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        index === 0
                          ? "bg-[#f4aa1f]/15 border border-[#f4aa1f]/30 text-[#f4aa1f]"
                          : index === 1
                          ? "bg-[#46aa85]/15 border border-[#46aa85]/30 text-[#46aa85]"
                          : "bg-white/10 border border-white/20 text-white/70"
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5 shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  {socialStats.map((s) => (
                    <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-center">
                      <span className="font-bold text-[#f4aa1f] text-2xl block">{s.value}</span>
                      <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to={socialLinkUrl}
                  className="flex items-center justify-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3.5 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-xl"
                >
                  {socialLinkLabel} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TONA ACADEMY */}
      <section className="py-20 bg-[#002d17]" style={backgroundStyle(colors?.academyBackground)}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4 block">{academyEyebrow}</span>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight leading-tight mb-6">
              {renderLines(academyTitle)}
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-medium mb-8">
              {academyDescription}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {academyStats.map((item) => (
                <div key={item.label} className="border border-white/10 p-4 rounded-xl">
                  <span className="font-bold text-[#f4aa1f] text-2xl">{item.value}</span>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <Link to={academyLinkUrl} className="rounded-lg inline-flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors">
              {academyLinkLabel} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-xl overflow-hidden">
            <img src={academyImage} alt={text("culture.academy_image_alt")} className="w-full aspect-[4/3] object-cover rounded-xl" />
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="py-20 bg-white" style={backgroundStyle(colors?.galleryBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-[#002d17] uppercase tracking-tight">
              {galleryTitle}
            </h2>
          </div>
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 650: 2, 900: 3 }}>
            <Masonry gutter="12px">
              {galleryPhotos.map((src, index) => (
                <motion.div
                  key={`${src}-${index}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="overflow-hidden group cursor-pointer"
                >
                  <img src={src} alt={text("culture.gallery_image_alt")} className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 ease-out" />
                </motion.div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="bg-[#f4aa1f] py-14" style={backgroundStyle(colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#002d17] uppercase tracking-tight">
              {ctaTitle}
            </h3>
            <p className="text-[#002d17]/60 mt-2 text-sm font-medium">
              {ctaDescription}
            </p>
          </div>
          <Link to={ctaLinkUrl} className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg">
            {ctaLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}


