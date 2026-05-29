import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import {
  ChevronRight,
  ArrowRight,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsPageByTemplate, type AboutCmsData } from "../lib/wordpress";
import { getCmsIcon } from "../lib/cmsIcons";
import { sitePath } from "../lib/siteLinks";

type StatItem = {
  value: string;
  label: string;
};

type CoreValue = {
  icon: LucideIcon;
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

export function About() {
  const [cmsPage, setCmsPage] = useState<AboutCmsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsPageByTemplate<AboutCmsData>("tona-about", controller.signal).then(setCmsPage);

    return () => controller.abort();
  }, []);

  const stats = useMemo<StatItem[]>(() => {
    return (cmsPage?.stats || []).map((stat) => ({
      value: stat.value || "",
      label: stat.label || "",
    }));
  }, [cmsPage]);

  const coreValues = useMemo<CoreValue[]>(() => {
    return (cmsPage?.values || []).map((value) => ({
      icon: getCmsIcon(value.icon, Shield),
      iconImage: value.iconImage || "",
      title: value.title || "",
      desc: value.desc || "",
    }));
  }, [cmsPage]);

  const timeline = useMemo<TimelineItem[]>(() => {
    return (cmsPage?.timeline || []).map((item) => ({
      year: item.year || "",
      title: item.title || "",
      desc: item.desc || "",
    }));
  }, [cmsPage]);

  const certifications = useMemo<CertificationItem[]>(() => {
    return (cmsPage?.certifications || []).map((cert) => ({
      code: cert.code || "",
      title: cert.title || "",
      org: cert.org || "",
    }));
  }, [cmsPage]);

  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "Gioi Thieu";
  const heroTitle = cmsPage?.hero?.title || "Ve Tona\nCorporation";
  const heroDescription = cmsPage?.hero?.description || "Hon 15 nam kien tao nhung cong trinh vuot chuan. Tona Corporation la lua chon hang dau cua cac tap doan da quoc gia khi phat trien du an tai Viet Nam.";
  const missionEyebrow = cmsPage?.missionVision?.missionEyebrow || "Su Menh";
  const missionText = cmsPage?.missionVision?.missionText || "Mang den giai phap xay dung chat luong cao nhat, toi uu hoa chi phi va thoi gian, gop phan phat trien ben vung cho doi tac va cong dong.";
  const visionEyebrow = cmsPage?.missionVision?.visionEyebrow || "Tam Nhin";
  const visionText = cmsPage?.missionVision?.visionText || "Tro thanh tong thau xay dung cong nghiep va thuong mai hang dau khu vuc, la su lua chon uu tien cua cac tap doan da quoc gia tai Dong Nam A.";
  const valuesTitle = cmsPage?.valuesTitle || "Gia Tri Cot Loi";
  const timelineTitle = cmsPage?.timelineTitle || "Hanh Trinh Phat Trien";
  const certificationsTitle = cmsPage?.certificationsTitle || "Chung Nhan Quoc Te";
  const ctaTitle = cmsPage?.cta?.title || "Cung Tona kien tao cong trinh tiep theo";
  const ctaDescription = cmsPage?.cta?.description || "Tu nha may cong nghe cao den resort 5 sao, chung toi san sang dong hanh.";
  const primaryLabel = cmsPage?.cta?.primaryLabel || "Xem Du An";
  const primaryUrl = cmsPage?.cta?.primaryUrl || sitePath("projects");
  const secondaryLabel = cmsPage?.cta?.secondaryLabel || "Doi Ngu Lanh Dao";
  const secondaryUrl = cmsPage?.cta?.secondaryUrl || "/doi-ngu";
  const colors = cmsPage?.colors;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden" style={backgroundStyle(colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
              <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6">
                {renderLines(heroTitle)}
              </h1>
              <p className="text-white/60 text-base font-medium leading-relaxed max-w-lg">
                {heroDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {stats.map((stat, index) => (
                <div key={`${stat.label}-${index}`} className="bg-[#002d17] px-6 py-6" style={backgroundStyle(colors?.heroBackground)}>
                  <span className="font-extrabold text-[#f4aa1f] text-3xl">{stat.value}</span>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#46aa85]/10 pointer-events-none hidden lg:block" />
      </div>

      {/* MISSION & VISION */}
      <section className="relative w-full bg-[#002d17] py-20 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#46aa85]/8 to-transparent pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-[#f4aa1f]/4 to-transparent pointer-events-none" />
        <div className="absolute right-8 top-8 text-[120px] font-extrabold text-white/[0.03] uppercase leading-none select-none pointer-events-none">
          TONA
        </div>
        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 p-8 border-l-4 border-[#f4aa1f] rounded-r-2xl"
          >
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">Sứ Mệnh</p>
            <p className="text-white font-extrabold text-xl md:text-2xl leading-snug uppercase">
              Mang đến giải pháp xây dựng chất lượng cao nhất, tối ưu hóa chi phí và thời gian — góp phần phát triển bền vững cho đối tác và cộng đồng.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-white/5 p-8 border-l-4 border-[#46aa85] rounded-r-2xl"
          >
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">Tầm Nhìn</p>
            <p className="text-white font-extrabold text-xl md:text-2xl leading-snug uppercase">
              Trở thành tổng thầu xây dựng công nghiệp và thương mại hàng đầu khu vực — là sự lựa chọn ưu tiên của mọi tập đoàn đa quốc gia tại Đông Nam Á.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-white" style={backgroundStyle(colors?.valuesBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">{valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#002d17]/10">
            {coreValues.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={`${value.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group p-8 hover:bg-[#f0faf6] transition-colors cursor-pointer ${index > 0 ? "border-l border-[#002d17]/10" : ""}`}
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center mb-5 group-hover:bg-[#f4aa1f] transition-colors">
                    {value.iconImage ? (
                      <img src={value.iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden />
                    ) : (
                      <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-[#002d17] group-hover:text-[#46aa85] uppercase text-base tracking-tight mb-3 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-[#002d17]/55 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-[#f9f9f7]" style={backgroundStyle(colors?.timelineBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">{timelineTitle}</h2>
          </div>
          <div className="relative flex flex-col gap-0">
            <div className="absolute left-16 md:left-37 top-0 bottom-0 w-px bg-[#002d17]/10" />
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.year}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-8 md:gap-12 items-start group py-6 first:pt-0"
              >
                <div className="shrink-0 w-16 md:w-24 flex flex-col items-end">
                  <span className="font-extrabold text-[#002d17]/30 group-hover:text-[#f4aa1f] text-lg md:text-2xl tracking-tight transition-colors">
                    {item.year}
                  </span>
                </div>
                <div className="shrink-0 w-3 h-3 rounded-full bg-white border-2 border-[#002d17]/30 group-hover:border-[#f4aa1f] group-hover:bg-[#f4aa1f] mt-1.5 transition-colors relative z-10" />
                <div className="flex-1 pb-6 border-b border-[#002d17]/10 last:border-0">
                  <h3 className="font-extrabold text-[#002d17] uppercase tracking-tight text-lg mb-2">{item.title}</h3>
                  <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 bg-[#002d17]" style={backgroundStyle(colors?.certificationsBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">{certificationsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <div key={`${cert.code}-${index}`} className="bg-white/5 hover:bg-[#46aa85] transition-colors p-10 flex flex-col gap-4 group rounded-2xl border border-white/10">
                <span className="text-[#f4aa1f] font-extrabold text-3xl tracking-tight">{cert.code}</span>
                <div>
                  <h4 className="text-white font-extrabold uppercase tracking-tight text-base">{cert.title}</h4>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Cap boi {cert.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-white py-16 border-t border-[#002d17]/10" style={backgroundStyle(colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              {ctaTitle}
            </h3>
            <p className="text-[#002d17]/50 mt-2 text-sm font-medium">{ctaDescription}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={primaryUrl} className="flex items-center justify-center gap-2 border-2 border-[#002d17] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-white transition-colors rounded-lg">
              {primaryLabel} <ArrowRight size={14} />
            </Link>
            <Link to={secondaryUrl} className="flex items-center justify-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors rounded-lg">
              {secondaryLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
