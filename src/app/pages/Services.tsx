import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Check,
  ArrowRight,
  ChevronLeft,
  Play,
  PenTool,
  Wrench,
  Building2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projects } from "../data";
import {
  fetchCmsPage,
  fetchCmsPageByTemplate,
  fetchCmsProjects,
  type ProjectPost,
  type ServicesCmsData,
} from "../lib/wordpress";

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

type TimelapseSlide = {
  title: string;
  subtitle: string;
  duration: string;
  image: string;
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
    tag: "Thế Mạnh Hàng Đầu",
    title: "Nâng Cấp Cải Tạo Không Dừng Sản Xuất",
    subtitle: "Renovation & Upgrade",
    desc: "Tona là đơn vị tiên phong tại Việt Nam về cải tạo công trình đang vận hành. Quy trình thi công được thiết kế để không gây gián đoạn dây chuyền sản xuất.",
    features: [
      "Lập kế hoạch thi công không dừng sản xuất",
      "Kiểm soát bụi và tiếng ồn theo tiêu chuẩn GMP",
      "Phối hợp cả 24/7 theo lịch sản xuất",
      "Hệ thống barrier và vách ngăn tạm thời",
    ],
    img: "https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=1080&q=80",
    featured: true,
    linkLabel: "Xem Dự Án",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 2,
    icon: PenTool,
    num: "02",
    tag: "EPC Toàn Diện",
    title: "Thiết Kế Và Xây Dựng",
    subtitle: "Design & Build",
    desc: "Tổng thầu EPC chịu trách nhiệm toàn diện từ thiết kế kỹ thuật, lập tiến độ, mua sắm vật tư đến thi công và nghiệm thu bàn giao.",
    features: [
      "Thiết kế kỹ thuật và hồ sơ BIM",
      "Quản lý chuỗi cung ứng vật tư",
      "Kiểm soát chi phí và tiến độ tập trung",
      "Bảo hành và hỗ trợ kỹ thuật sau bàn giao",
    ],
    img: "https://images.unsplash.com/photo-1645434897689-af222b85993e?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Dự Án",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 3,
    icon: Building2,
    num: "03",
    tag: "Kết Cấu Và Hạ Tầng",
    title: "Thi Công Dân Dụng Và Công Nghiệp",
    subtitle: "Civil & Structural",
    desc: "Từ kết cấu thép tiền chế nhà xưởng đến công trình bê tông cốt thép nhiều tầng, Tona có kinh nghiệm thi công đa dạng loại hình công trình.",
    features: [
      "Kết cấu thép tiền chế PEB",
      "Bê tông cốt thép B30-B40",
      "Móng cọc khoan nhồi, cọc ép",
      "Hạ tầng đường nội bộ, thoát nước, kho bãi",
    ],
    img: "https://images.unsplash.com/photo-1774979159518-7706ca7bb2e6?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Dự Án",
    linkUrl: "/vi/du-an-tona",
  },
  {
    id: 4,
    icon: Zap,
    num: "04",
    tag: "Kỹ Thuật Cao",
    title: "Hệ Thống Cơ Điện MEP",
    subtitle: "Mechanical, Electrical & Plumbing",
    desc: "Bộ phận MEP của Tona triển khai hệ thống kỹ thuật phức tạp cho nhà máy điện tử, phòng sạch cleanroom và công trình độ chính xác cao.",
    features: [
      "Phòng sạch ISO Class 5-8",
      "Hệ thống HVAC và điều hòa công nghiệp",
      "Điện hạ thế, MCC panel, UPS",
      "Hệ thống khí đặc biệt",
    ],
    img: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?w=1080&q=80",
    featured: false,
    linkLabel: "Xem Dự Án",
    linkUrl: "/vi/du-an-tona",
  },
];

const fallbackTimelapseSlides: TimelapseSlide[] = [
  {
    title: "Spartronics Cleanroom — Hậu Giang",
    subtitle: "Timelapse 45 ngày thi công liên tục",
    duration: "45 ngày",
    image: "https://images.unsplash.com/photo-1645434897689-af222b85993e?w=1200&q=80",
  },
  {
    title: "Phoenix Contact — Bình Dương",
    subtitle: "Timelapse toàn bộ quá trình xây dựng EPC",
    duration: "171 ngày",
    image: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?w=1200&q=80",
  },
  {
    title: "GO! Đồng Nai Commercial Center",
    subtitle: "Timelapse thi công phần thô & hoàn thiện",
    duration: "90 ngày",
    image: "https://images.unsplash.com/photo-1774979159518-7706ca7bb2e6?w=1200&q=80",
  },
];

const fallbackProcessSteps = [
  { step: "01", title: "Khảo Sát & Tư Vấn", desc: "Tiếp nhận yêu cầu, khảo sát hiện trạng và tư vấn giải pháp phù hợp nhất." },
  { step: "02", title: "Thiết Kế Kỹ Thuật", desc: "Lập hồ sơ thiết kế kỹ thuật, bản vẽ thi công và kế hoạch triển khai." },
  { step: "03", title: "Ký Kết Hợp Đồng", desc: "Minh bạch về phạm vi, tiến độ, chi phí và các cam kết chất lượng." },
  { step: "04", title: "Thi Công", desc: "Triển khai đúng tiến độ, kiểm soát chất lượng theo ISO 9001 mỗi ngày." },
  { step: "05", title: "Nghiệm Thu & Bàn Giao", desc: "Kiểm tra toàn bộ hạng mục, bàn giao hồ sơ hoàn công và hướng dẫn vận hành." },
  { step: "06", title: "Bảo Hành", desc: "Hỗ trợ kỹ thuật sau bàn giao, bảo hành theo hợp đồng." },
];

function TimelapseSlider({ slides }: { slides: TimelapseSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const items = slides.length ? slides : fallbackTimelapseSlides;

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrent((c) => (c + 1) % items.length);
          return 0;
        }
        return p + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current, items.length]);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);

  const slide = items[current] || items[0];

  return (
    <div className="relative w-full aspect-video bg-[#001a0e] rounded-2xl overflow-hidden group">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001a0e]/80 via-[#001a0e]/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-[#f4aa1f] rounded-full transition-none"
              style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%" }}
            />
          </button>
        ))}
      </div>

      {/* Slide info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-1">{slide.subtitle}</p>
            <h3 className="text-white font-extrabold text-xl uppercase tracking-tight leading-snug">{slide.title}</h3>
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest mt-1 block">{slide.duration} thi công</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <button
        onClick={prev}
        className="absolute left-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#002d17]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#002d17]/80 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 cursor-pointer top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#002d17]/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#002d17]/80 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={18} />
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 right-6 z-20 bg-[#002d17]/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
        <span className="text-white font-bold text-xs">{current + 1} / {items.length}</span>
      </div>
    </div>
  );
}

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

export function Services() {
  const [cmsPage, setCmsPage] = useState<ServicesCmsData | null>(null);
  const [cmsProjects, setCmsProjects] = useState<ProjectPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCmsPageByTemplate<ServicesCmsData>("tona-services", controller.signal)
        .then((page) => page || fetchCmsPage<ServicesCmsData>("dich-vu", controller.signal)),
      fetchCmsProjects(controller.signal),
    ])
      .then(([page, projectItems]) => {
        setCmsPage(page);
        setCmsProjects(projectItems);
      })
      .catch((error) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setCmsPage(null);
          setCmsProjects([]);
        }
      });

    return () => controller.abort();
  }, []);

  const servicesList = useMemo<ServiceItem[]>(() => {
    const source = cmsPage?.services?.length ? cmsPage.services : null;

    if (!source) {
      return fallbackServices;
    }

    const sortedSource = [...source].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

    return sortedSource.map((service, index) => ({
      id: index + 1,
      icon: iconMap[service.icon || "Wrench"] || Wrench,
      iconImage: service.iconImage || "",
      num: service.number || String(index + 1).padStart(2, "0"),
      tag: service.featured ? "Thế Mạnh Hàng Đầu" : "",
      title: service.title || "",
      subtitle: service.subtitle || "",
      desc: service.description || "",
      features: service.features || [],
      img: service.image || fallbackServices[index]?.img || fallbackServices[0]?.img || "",
      featured: Boolean(service.featured),
      linkLabel: service.linkLabel || "Xem Dự Án",
      linkUrl: service.linkUrl || "/vi/du-an-tona",
    }));
  }, [cmsPage]);

  const processSteps = useMemo<ProcessStep[]>(() => {
    const steps = cmsPage?.process?.steps;

    if (!steps?.length) {
      return fallbackProcessSteps;
    }

    return steps.map((step, index) => ({
      step: step.step || String(index + 1).padStart(2, "0"),
      title: step.title || "",
      desc: step.description || "",
    }));
  }, [cmsPage]);

  const timelapseSlides = useMemo<TimelapseSlide[]>(() => {
    const slides = cmsPage?.timelapse?.slides;

    if (!slides?.length) {
      return fallbackTimelapseSlides;
    }

    return slides.map((slide, index) => ({
      title: slide.title || fallbackTimelapseSlides[index]?.title || "",
      subtitle: slide.subtitle || fallbackTimelapseSlides[index]?.subtitle || "",
      duration: slide.duration || fallbackTimelapseSlides[index]?.duration || "",
      image: slide.image || fallbackTimelapseSlides[index]?.image || fallbackTimelapseSlides[0]?.image || "",
    }));
  }, [cmsPage]);

  const featured = servicesList.find((service) => service.featured) || servicesList[0];
  const rest = servicesList.filter((service) => service.id !== featured.id);
  const projectItems = cmsProjects.length ? cmsProjects : (projects as ProjectPost[]);
  const featuredProject = projectItems.find((p) => p.slug === "nha-may-spartronics-viet-nam-2") || projectItems[0];
  const colors = cmsPage?.colors;
  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "Dịch Vụ";
  const heroTitle = cmsPage?.hero?.title || "Dịch Vụ\nCốt Lõi";
  const heroDescription = cmsPage?.hero?.description || "Tona Corporation cung cấp các giải pháp xây dựng công nghiệp, thương mại và kỹ thuật cao.";
  const processTitle = cmsPage?.process?.title || "Quy Trình Làm Việc";
  const timelapseTitle = cmsPage?.timelapse?.title || "Nhìn Lại\nHành Trình\nThi Công";
  const timelapseDescription = cmsPage?.timelapse?.description || "Những khoảnh khắc đặc biệt được nén lại - từ mảnh đất trống đến công trình hoàn chỉnh. Mỗi timelapse là bằng chứng cho sự chuyên nghiệp và tốc độ triển khai của Tona.";
  const ctaTitle = cmsPage?.cta?.title || "Sẵn Sàng Bắt Đầu Dự Án?";
  const ctaDescription = cmsPage?.cta?.description || "Kết nối với Tona để nhận tư vấn giải pháp phù hợp cho công trình của bạn.";
  const ctaLinkLabel = cmsPage?.cta?.linkLabel || "Liên Hệ Ngay";
  const ctaLinkUrl = cmsPage?.cta?.linkUrl || "/vi/lien-he";

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

      {/* TIMELAPSE SLIDER */}
      <section className="bg-[#f9f9f7] py-20" style={backgroundStyle(colors?.timelapseBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-4">
              <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight leading-tight mb-4">
                {renderLines(timelapseTitle)}
              </h2>
              <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium mb-6">
                {timelapseDescription}
              </p>
              <div className="flex flex-col gap-3">
                {timelapseSlides.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#002d17]/50 text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-[#f4aa1f] shrink-0" />
                    {s.title}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8">
              <TimelapseSlider slides={timelapseSlides} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      <section className="py-20 bg-white border-t border-[#002d17]/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Dự Án Tiêu Biểu
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#002d17]/10 group"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-[#bcd8cb] min-h-[280px]">
              <img
                src={featuredProject.image}
                alt={featuredProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002d17]/30 hidden lg:block" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="bg-[#002d17] text-[#f4aa1f] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {featuredProject.category}
                </span>
                {(featuredProject as any).leedGold && (
                  <span className="bg-[#b8860b] text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                    ★ LEED Gold
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center px-8 md:px-12 py-10 bg-[#002d17]">
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4">{featuredProject.location}</p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight leading-snug mb-4">
                {featuredProject.title}
              </h3>
              <p className="text-white/55 text-sm leading-relaxed font-medium mb-7">
                {featuredProject.description}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Diện tích", val: featuredProject.area },
                  { label: "Khách hàng", val: featuredProject.client },
                  { label: "Năm", val: featuredProject.year },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <p className="text-[#f4aa1f] text-[10px] font-bold uppercase tracking-widest mb-1">{s.label}</p>
                    <span className="text-white font-extrabold text-sm">{s.val}</span>
                  </div>
                ))}
              </div>
              <Link
                to={`/vi/project/${featuredProject.slug}`}
                className="w-fit flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
              >
                Xem Chi Tiết <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/vi/du-an-tona"
              className="flex items-center gap-2 text-[#002d17]/50 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Xem Tất Cả Dự Án <ArrowRight size={12} />
            </Link>
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
