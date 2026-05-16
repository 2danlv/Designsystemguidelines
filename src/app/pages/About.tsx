import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import artboard2Img from "../../imports/Artboard_2.png";
import { fetchCmsPage, type AboutCmsData } from "../lib/wordpress";

type StatItem = {
  value: string;
  label: string;
};

type CoreValue = {
  icon: LucideIcon;
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

const cmsIconMap: Record<string, LucideIcon> = {
  Shield,
  Award,
  TrendingUp,
  CheckCircle2,
};

const fallbackStats: StatItem[] = [
  { value: "500+", label: "Du An Hoan Thanh" },
  { value: "800+", label: "Nhan Su" },
  { value: "15+", label: "Nam Kinh Nghiem" },
  { value: "50+", label: "Doi Tac Quoc Te" },
];

const fallbackCoreValues: CoreValue[] = [
  { icon: Shield, title: "An Toan Tren Het", desc: "Zero accident la kim chi nam bat di bat dich. Moi nhan su Tona duoc dao tao bai ban ve an toan lao dong." },
  { icon: Award, title: "Chat Luong Khong Thoa Hiep", desc: "Tung chi tiet nho nhat deu duoc kiem soat nghiem ngat. ISO 9001 khong chi la chung chi, do la van hoa." },
  { icon: TrendingUp, title: "Hieu Qua Va Tien Do", desc: "Ban giao dung han, tham chi som hon, khong phat sinh chi phi ngoai hop dong." },
  { icon: CheckCircle2, title: "Tinh Trung Thuc", desc: "Minh bach trong bao cao, trung thuc trong quan he, nen tang cua moi hop tac lau dai." },
];

const fallbackTimeline: TimelineItem[] = [
  { year: "2009", title: "Thanh Lap", desc: "Tona Corporation ra doi tai TP.HCM voi doi ngu 15 ky su, chuyen ve thi cong ket cau cong nghiep." },
  { year: "2013", title: "Mo Rong MEP", desc: "Ra mat bo phan Co Dien (MEP) chuyen biet, dua Tona tro thanh nha thau EPC toan dien." },
  { year: "2017", title: "ISO 9001", desc: "Nhan chung nhan ISO 9001:2015 dau tien, khang dinh he thong quan ly chat luong dat tieu chuan quoc te." },
  { year: "2020", title: "100+ Nhan Su", desc: "Doi ngu vuot moc 100 ky su va chuyen gia, hoan thanh du an quoc te dau tien cho Phoenix Contact." },
  { year: "2023", title: "800+ Nhan Su", desc: "Cot moc 800+ nhan su, 50+ du an song song, top 10 nha thau MEP uy tin mien Nam." },
  { year: "2025", title: "Beyond Limits", desc: "Buoc vao ky nguyen moi voi Solar, Green Energy, BIM Technology va muc tieu 1,000 nhan su." },
];

const fallbackCertifications: CertificationItem[] = [
  { code: "ISO 9001:2015", title: "Quan Ly Chat Luong", org: "Bureau Veritas" },
  { code: "ISO 45001:2018", title: "An Toan Va Suc Khoe", org: "Bureau Veritas" },
  { code: "ISO 14001:2015", title: "Quan Ly Moi Truong", org: "Bureau Veritas" },
];

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

    fetchCmsPage<AboutCmsData>("gioi-thieu-tona", controller.signal).then(setCmsPage);

    return () => controller.abort();
  }, []);

  const stats = useMemo<StatItem[]>(() => {
    if (!cmsPage?.stats?.length) {
      return fallbackStats;
    }

    return cmsPage.stats.map((stat) => ({
      value: stat.value || "",
      label: stat.label || "",
    }));
  }, [cmsPage]);

  const coreValues = useMemo<CoreValue[]>(() => {
    if (!cmsPage?.values?.length) {
      return fallbackCoreValues;
    }

    return cmsPage.values.map((value) => ({
      icon: cmsIconMap[value.icon || "Shield"] || Shield,
      title: value.title || "",
      desc: value.desc || "",
    }));
  }, [cmsPage]);

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!cmsPage?.timeline?.length) {
      return fallbackTimeline;
    }

    return cmsPage.timeline.map((item) => ({
      year: item.year || "",
      title: item.title || "",
      desc: item.desc || "",
    }));
  }, [cmsPage]);

  const certifications = useMemo<CertificationItem[]>(() => {
    if (!cmsPage?.certifications?.length) {
      return fallbackCertifications;
    }

    return cmsPage.certifications.map((cert) => ({
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
  const missionBackgroundImage = cmsPage?.missionVision?.backgroundImage || artboard2Img;
  const valuesTitle = cmsPage?.valuesTitle || "Gia Tri Cot Loi";
  const timelineTitle = cmsPage?.timelineTitle || "Hanh Trinh Phat Trien";
  const certificationsTitle = cmsPage?.certificationsTitle || "Chung Nhan Quoc Te";
  const ctaTitle = cmsPage?.cta?.title || "Cung Tona kien tao cong trinh tiep theo";
  const ctaDescription = cmsPage?.cta?.description || "Tu nha may cong nghe cao den resort 5 sao, chung toi san sang dong hanh.";
  const primaryLabel = cmsPage?.cta?.primaryLabel || "Xem Du An";
  const primaryUrl = cmsPage?.cta?.primaryUrl || "/vi/du-an-tona";
  const secondaryLabel = cmsPage?.cta?.secondaryLabel || "Doi Ngu Lanh Dao";
  const secondaryUrl = cmsPage?.cta?.secondaryUrl || "/vi/doi-ngu";
  const colors = cmsPage?.colors;

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden" style={backgroundStyle(colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
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
      <section className="relative w-full overflow-hidden">
        <img src={missionBackgroundImage} alt="" className="w-full h-auto block opacity-90" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-center px-6 py-12">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 border-l-4 border-[#f4aa1f]"
            >
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">{missionEyebrow}</p>
              <p className="text-white font-extrabold text-lg md:text-2xl leading-snug uppercase">
                {missionText}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white/10 backdrop-blur-sm p-8 border-l-4 border-white/50"
            >
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">{visionEyebrow}</p>
              <p className="text-white font-extrabold text-lg md:text-2xl leading-snug uppercase">
                {visionText}
              </p>
            </motion.div>
          </div>
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
                    <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
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
