import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Check,
  ArrowRight,
  PenTool,
  Wrench,
  Building2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsPage, type ServicesCmsData } from "../lib/wordpress";

type ServiceItem = {
  id: number;
  icon: LucideIcon;
  iconImage?: string;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  img: string;
  featured: boolean;
  linkLabel: string;
  linkUrl: string;
};

type ProcessStep = {
  step: string;
  title: string;
  desc: string;
};

const iconMap: Record<string, LucideIcon> = {
  PenTool,
  Wrench,
  Building2,
  Zap,
};

const fallbackServices: ServiceItem[] = [
  {
    id: 1,
    icon: Wrench,
    num: "01",
    tag: "The Manh Hang Dau",
    title: "Nang Cap Cai Tao Khong Dung San Xuat",
    subtitle: "Renovation & Upgrade",
    desc: "Tona la don vi tien phong tai Viet Nam ve cai tao cong trinh dang van hanh. Quy trinh thi cong duoc thiet ke de khong gay gian doan day chuyen san xuat.",
    features: [
      "Lap ke hoach thi cong khong dung san xuat",
      "Kiem soat bui va tieng on theo tieu chuan GMP",
      "Phoi hop ca 24/7 theo lich san xuat",
      "He thong barrier va vach ngan tam thoi",
    ],
    img: "https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=1080&q=80",
    featured: true,
    linkLabel: "Xem Du An",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 2,
    icon: PenTool,
    num: "02",
    tag: "EPC Toan Dien",
    title: "Thiet Ke Va Xay Dung",
    subtitle: "Design & Build",
    desc: "Tong thau EPC chiu trach nhiem toan dien tu thiet ke ky thuat, lap tien do, mua sam vat tu den thi cong va nghiem thu ban giao.",
    features: [
      "Thiet ke ky thuat va ho so BIM",
      "Quan ly chuoi cung ung vat tu",
      "Kiem soat chi phi va tien do tap trung",
      "Bao hanh va ho tro ky thuat sau ban giao",
    ],
    img: "https://images.unsplash.com/photo-1645434897689-af222b85993e?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Du An",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 3,
    icon: Building2,
    num: "03",
    tag: "Ket Cau Va Ha Tang",
    title: "Thi Cong Dan Dung Va Cong Nghiep",
    subtitle: "Civil & Structural",
    desc: "Tu ket cau thep tien che nha xuong den cong trinh be tong cot thep nhieu tang, Tona co kinh nghiem thi cong da dang loai hinh cong trinh.",
    features: [
      "Ket cau thep tien che PEB",
      "Be tong cot thep B30-B40",
      "Mong coc khoan nhoi, coc ep",
      "Ha tang duong noi bo, thoat nuoc, kho bai",
    ],
    img: "https://images.unsplash.com/photo-1774979159518-7706ca7bb2e6?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Du An",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 4,
    icon: Zap,
    num: "04",
    tag: "Ky Thuat Cao",
    title: "He Thong Co Dien MEP",
    subtitle: "Mechanical, Electrical & Plumbing",
    desc: "Bo phan MEP cua Tona trien khai he thong ky thuat phuc tap cho nha may dien tu, phong sach cleanroom va cong trinh do chinh xac cao.",
    features: [
      "Phong sach ISO Class 5-8",
      "He thong HVAC va dieu hoa cong nghiep",
      "Dien ha the, MCC panel, UPS",
      "He thong khi dac biet",
    ],
    img: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Du An",
    linkUrl: "/vi/du-an-tona",
  },
];

const fallbackProcess: ProcessStep[] = [
  { step: "01", title: "Khao Sat Va Tu Van", desc: "Tiep nhan yeu cau, khao sat hien trang va tu van giai phap phu hop nhat." },
  { step: "02", title: "Thiet Ke Ky Thuat", desc: "Lap ho so thiet ke ky thuat, ban ve thi cong va ke hoach trien khai." },
  { step: "03", title: "Ky Ket Hop Dong", desc: "Minh bach ve pham vi, tien do, chi phi va cac cam ket chat luong." },
  { step: "04", title: "Thi Cong", desc: "Trien khai dung tien do, kiem soat chat luong theo ISO 9001 moi ngay." },
  { step: "05", title: "Nghiem Thu Va Ban Giao", desc: "Kiem tra toan bo hang muc, ban giao ho so hoan cong va huong dan van hanh." },
  { step: "06", title: "Bao Hanh", desc: "Ho tro ky thuat sau ban giao, bao hanh theo hop dong." },
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

function serviceFromCms(item: NonNullable<ServicesCmsData["services"]>[number], index: number): ServiceItem {
  return {
    id: index + 1,
    icon: iconMap[item.icon || "Wrench"] || Wrench,
    iconImage: item.iconImage || "",
    num: item.number || String(index + 1).padStart(2, "0"),
    tag: item.tag || "",
    title: item.title || "",
    subtitle: item.subtitle || "",
    desc: item.description || "",
    features: item.features?.length ? item.features : [],
    img: item.image || "",
    featured: Boolean(item.featured),
    linkLabel: item.linkLabel || "Xem Du An",
    linkUrl: item.linkUrl || "/vi/du-an-tona",
  };
}

export function Services() {
  const [cmsPage, setCmsPage] = useState<ServicesCmsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsPage<ServicesCmsData>("dich-vu", controller.signal).then(setCmsPage);

    return () => controller.abort();
  }, []);

  const services = useMemo<ServiceItem[]>(() => {
    if (!cmsPage?.services?.length) {
      return fallbackServices;
    }

    return cmsPage.services.map(serviceFromCms);
  }, [cmsPage]);

  const processSteps = useMemo<ProcessStep[]>(() => {
    if (!cmsPage?.process?.steps?.length) {
      return fallbackProcess;
    }

    return cmsPage.process.steps.map((step) => ({
      step: step.step || "",
      title: step.title || "",
      desc: step.description || "",
    }));
  }, [cmsPage]);

  const featured = services.find((service) => service.featured) || services[0] || fallbackServices[0];
  const rest = services.filter((service) => service !== featured);
  const colors = cmsPage?.colors;
  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "Dich Vu";
  const heroTitle = cmsPage?.hero?.title || "Giai Phap\nXay Dung Toan Dien";
  const heroDescription = cmsPage?.hero?.description || "Tu tong thau EPC den cai tao khong dung san xuat, Tona Corporation cung cap giai phap xay dung dap ung moi yeu cau khat khe nhat cua cong nghiep hien dai.";
  const processTitle = cmsPage?.process?.title || "Quy Trinh Trien Khai";
  const ctaTitle = cmsPage?.cta?.title || "San sang bat dau du an?";
  const ctaDescription = cmsPage?.cta?.description || "Lien he de duoc tu van mien phi ve giai phap phu hop.";
  const ctaLinkLabel = cmsPage?.cta?.linkLabel || "Lien He Tu Van";
  const ctaLinkUrl = cmsPage?.cta?.linkUrl || "/vi/nghe-nghiep";

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
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            {renderLines(heroTitle)}
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            {heroDescription}
          </p>
        </div>
      </div>

      {/* FEATURED SERVICE */}
      <div className="max-w-7xl mx-auto px-6 py-16" style={backgroundStyle(colors?.servicesBackground)}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-[#002d17] flex flex-col lg:flex-row min-h-[400px]"
        >
          <div className="lg:w-[55%] relative overflow-hidden">
            <img src={featured.img} alt={featured.title} className="w-full h-56 lg:h-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002d17]/70 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002d17]/80 to-transparent lg:hidden" />
          </div>

          <div className="lg:w-[45%] flex flex-col justify-center px-8 md:px-12 py-10 lg:py-14 relative z-10">
            <div className="absolute top-6 right-6">
              <span className="bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {featured.tag}
              </span>
            </div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">{featured.subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight leading-tight mb-5">
              {featured.title}
            </h2>
            <p className="text-white/55 text-sm leading-relaxed font-medium mb-7">
              {featured.desc}
            </p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {featured.features.map((feature, index) => (
                <li key={`${feature}-${index}`} className="flex items-start gap-3 text-white/80 text-sm font-medium">
                  <Check size={14} className="text-[#f4aa1f] shrink-0 mt-0.5" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to={featured.linkUrl} className="w-fit flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg">
              {featured.linkLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* SERVICE CARDS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={`${service.num}-${service.title}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col border border-[#002d17]/10 rounded-2xl overflow-hidden hover:border-[#f4aa1f] hover:shadow-[0_0_0_1px_#f4aa1f] transition-all duration-300"
              >
                <div className="w-full aspect-[16/9] overflow-hidden bg-[#bcd8cb] relative">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-[#002d17]/15 group-hover:bg-[#002d17]/5 transition-colors" />
                </div>

                <div className="flex flex-col gap-4 p-7 flex-1 bg-white group-hover:bg-[#fdfcf8] transition-colors duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors shrink-0 rounded-xl">
                      {service.iconImage ? (
                        <img src={service.iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden />
                      ) : (
                        <Icon size={18} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                      )}
                    </div>
                    <span className="text-[#002d17]/8 font-extrabold text-5xl leading-none tracking-tight group-hover:text-[#f4aa1f]/15 transition-colors select-none">
                      {service.num}
                    </span>
                  </div>

                  <div>
                    <p className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest mb-1.5">{service.subtitle}</p>
                    <h3 className="font-extrabold text-[#002d17] text-xl uppercase tracking-tight leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium flex-1">
                    {service.desc}
                  </p>

                  <ul className="flex flex-col gap-2 border-t border-[#002d17]/8 pt-4">
                    {service.features.map((feature, featureIndex) => (
                      <li key={`${feature}-${featureIndex}`} className="flex items-start gap-2.5 text-[#002d17]/65 text-xs font-medium">
                        <Check size={12} className="text-[#46aa85] shrink-0 mt-0.5" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={service.linkUrl} className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all mt-1">
                    {service.linkLabel} <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROCESS */}
      <section className="bg-[#002d17] py-20" style={backgroundStyle(colors?.processBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              {processTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={`${step.step}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white/5 hover:bg-[#46aa85] transition-colors p-8 flex flex-col gap-3 group rounded-2xl border border-white/5"
              >
                <span className="text-[#f4aa1f] font-extrabold text-4xl tracking-tight opacity-40 group-hover:opacity-100 transition-opacity">
                  {step.step}
                </span>
                <h3 className="font-extrabold text-white uppercase tracking-tight text-base">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#f4aa1f] py-14" style={backgroundStyle(colors?.ctaBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              {ctaTitle}
            </h3>
            <p className="text-[#002d17]/60 mt-2 text-sm font-medium">{ctaDescription}</p>
          </div>
          <Link to={ctaLinkUrl} className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg">
            {ctaLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
