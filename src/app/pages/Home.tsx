import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowRight, ArrowLeft, ChevronRight, ChevronLeft,
  PenTool, Wrench, Building2, Zap,
  MapPin, Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { projects, news } from "../data";
import artboard2Img from "../../imports/Artboard_2.png";

// ─── HERO SLIDES DATA ─────────────────────────────────────────────────────────
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1650656746788-dee910f6b42b?w=1920&q=85",
    tag: "Industrial • Biên Hòa, Đồng Nai",
    title: "Nâng Cấp Cải Tạo\nNhà Máy Phoenix Contact",
    sub: "171 ngày · Zero Downtime · 25,000 m²",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1761333477936-56fbc7851c65?w=1920&q=85",
    tag: "Commercial • Biên Hòa, Đồng Nai",
    title: "Cải Tạo TTTM\nGO! Đồng Nai",
    sub: "8 tháng · Hoạt động liên tục · 46,100 m²",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1772442198624-4fc4d7281e89?w=1920&q=85",
    tag: "Industrial • Bình Dương",
    title: "Nhà Máy Spartronics\nViệt Nam 2",
    sub: "Cleanroom ISO 6 · EPC Toàn diện · 40,000 m²",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1772006807170-5750a2aa3713?w=1920&q=85",
    tag: "Hotels • Phú Quốc",
    title: "Hoa Binh Resort\nPhu Quoc",
    sub: "5 sao · 10 ha · 18 tháng thi công",
  },
];

// ─── PARTNER LOGOS ────────────────────────────────────────────────────────────
const partnerLogos = [
  { name: "SIEMENS", tagline: "Ingenuity for life" },
  { name: "SCHNEIDER\nELECTRIC", tagline: "Life Is On" },
  { name: "HONEYWELL", tagline: "The Future Is What We Make It" },
  { name: "DAIKIN", tagline: "Innovation in HVAC" },
  { name: "MITSUBISHI\nELECTRIC", tagline: "Changes for the Better" },
  { name: "ABB", tagline: "Electrification & Automation" },
  { name: "JOHNSON\nCONTROLS", tagline: "Smart Buildings" },
  { name: "PANASONIC", tagline: "A Better Life, A Better World" },
];

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] bg-[#002d17] overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 80 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002d17]/90 via-[#002d17]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002d17]/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-24 md:pb-28 max-w-7xl mx-auto left-0 right-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-text"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-[0.2em]">
              {slide.tag}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase leading-[1.05] tracking-tight whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-white/70 font-bold text-sm md:text-base tracking-widest uppercase mt-1">
              {slide.sub}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link
                to="/vi/du-an-tona"
                className="bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
              >
                Xem Dự Án
              </Link>
              <Link
                to="/vi/du-an-tona"
                className="text-white/70 hover:text-[#f4aa1f] font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                Portfolio <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 md:right-16 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`transition-all duration-300 ${i === current ? "w-8 h-1 bg-[#f4aa1f]" : "w-4 h-1 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/50 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/50 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors backdrop-blur-sm"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
}

// ─── MARQUEE STRIP ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = [
    "ISO 9001:2015", "Zero Accident", "ISO 45001:2018",
    "500+ Dự Án", "ISO 14001:2015", "15+ Năm Kinh Nghiệm",
    "ISO 9001:2015", "Zero Accident", "ISO 45001:2018",
    "500+ Dự Án", "ISO 14001:2015", "15+ Năm Kinh Nghiệm",
  ];
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

// ─── SLOGAN / BRAND SECTION (on Artboard_2 background) ───────────────────────
function SloganSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Artboard_2 as background */}
      <img
        src={artboard2Img}
        alt=""
        className="w-full h-auto block"
        aria-hidden
      />
      {/* Overlay slogans */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[#f4aa1f] font-bold text-xs md:text-sm uppercase tracking-[0.25em]">
            Tona Corporation — Build It Right
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight max-w-4xl">
            Tiên Phong Kiến Tạo<br />
            Chuẩn Mực Mới
          </h2>
          <p className="text-white/70 font-medium text-base md:text-lg max-w-xl">
            Hơn 15 năm đồng hành cùng các tập đoàn đa quốc gia — mang lại công trình vượt tiêu chuẩn, đúng tiến độ, đúng cam kết.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SERVICES HIGHLIGHT ───────────────────────────────────────────────────────
const services = [
  { id: 1, icon: Wrench, title: "Nâng Cấp Cải Tạo", subtitle: "Renovation & Upgrade", desc: "Thi công cải tạo công trình đang vận hành với zero downtime — tiêu chuẩn an toàn & vệ sinh khắt khe nhất.", highlight: true },
  { id: 2, icon: PenTool, title: "Thiết Kế & Xây Dựng", subtitle: "Design & Build EPC", desc: "Giải pháp tổng thầu EPC toàn diện từ thiết kế đến bàn giao, kiểm soát chất lượng tập trung." },
  { id: 3, icon: Building2, title: "Thi Công Dân Dụng", subtitle: "Civil & Structural", desc: "Kết cấu thép, bê tông cốt thép cho nhà máy, kho xưởng, tòa nhà thương mại quy mô lớn." },
  { id: 4, icon: Zap, title: "Cơ Điện MEP", subtitle: "MEP Systems", desc: "Hệ thống M&E tiên tiến cho phòng sạch, nhà máy điện tử và công trình kỹ thuật cao." },
];

function ServicesSection() {
  return (
    <section className="w-full bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight leading-tight">
            Dịch Vụ Cốt Lõi
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#002d17]/10 rounded-2xl overflow-hidden">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                className={`group relative flex gap-6 p-8 md:p-10 transition-colors duration-300 cursor-pointer border-[#002d17]/10
                  ${idx % 2 === 1 ? "border-l" : ""}
                  ${idx >= 2 ? "border-t" : ""}
                  ${svc.highlight ? "bg-[#002d17]" : "hover:bg-[#f0faf6]"}
                `}
              >
                {svc.highlight && (
                  <div className="absolute top-4 right-4 bg-[#f4aa1f] text-[#002d17] text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                    Thế Mạnh
                  </div>
                )}
                <div className={`shrink-0 w-14 h-14 border-2 flex items-center justify-center transition-colors
                  ${svc.highlight ? "border-[#f4aa1f] bg-[#f4aa1f]" : "border-[#f4aa1f] group-hover:bg-[#f4aa1f]"}`}
                >
                  <Icon size={22} className={`transition-colors ${svc.highlight ? "text-[#002d17]" : "text-[#f4aa1f] group-hover:text-[#002d17]"}`} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{svc.subtitle}</p>
                  <h3 className={`font-extrabold text-xl tracking-tight leading-snug transition-colors ${svc.highlight ? "text-white" : "text-[#002d17] group-hover:text-[#46aa85]"}`}>
                    {svc.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${svc.highlight ? "text-white/70" : "text-[#002d17]/60"}`}>
                    {svc.desc}
                  </p>
                </div>
                <ArrowRight size={16} className={`absolute bottom-8 right-8 transition-colors ${svc.highlight ? "text-[#f4aa1f]" : "text-[#002d17]/20 group-hover:text-[#f4aa1f]"}`} />
              </div>
            );
          })}
        </div>
        <div className="mt-0 flex">
          <Link
            to="/vi/dich-vu"
            className="flex-1 flex items-center justify-center gap-3 py-5 bg-[#f4aa1f] text-[#002d17] font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors border-x border-b border-[#002d17]/10 md:flex-none md:px-16"
          >
            Xem Tất Cả Dịch Vụ <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS CAROUSEL ────────────────────────────────────────────────────────
function ProjectsSection() {
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

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="bg-[#002d17]">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">Dự Án Nổi Bật</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev}
              className="w-12 h-12 border-2 border-white/30 hover:border-[#f4aa1f] text-white hover:text-[#f4aa1f] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} disabled={!canNext}
              className="w-12 h-12 border-2 border-white/30 hover:border-[#f4aa1f] text-white hover:text-[#f4aa1f] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowRight size={18} />
            </button>
            <Link to="/vi/du-an-tona" className="hidden md:flex items-center gap-2 ml-4 text-white/60 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-14 overflow-hidden">
        <div className="pl-6 md:pl-[calc((100vw-80rem)/2+1.5rem)]" ref={emblaRef}>
          <div className="flex gap-6 cursor-grab active:cursor-grabbing">
            {projects.map((project) => (
              <div key={project.id} className="flex-[0_0_88%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_38%] min-w-0">
                <Link to={`/vi/project/${project.slug}`} className="group flex flex-col select-none">
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

// ─── NEWS SECTION ─────────────────────────────────────────────────────────────
function NewsSection() {
  const featured = news[0];
  const rest = news.slice(1, 4);

  return (
    <section className="w-full bg-[#f9f9f7] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Tin Tức &amp; Hoạt Động
            </h2>
          </div>
          <Link to="/vi/news" className="shrink-0 flex items-center gap-2 text-[#002d17] font-bold text-xs uppercase tracking-widest hover:text-[#f4aa1f] transition-colors">
            Xem Tất Cả <ArrowRight size={14} />
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
              <span className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">{featured.date} · {featured.readTime} đọc</span>
              <h3 className="font-extrabold text-[#002d17] text-2xl uppercase leading-snug tracking-tight group-hover:text-[#46aa85] transition-colors">
                {featured.title}
              </h3>
              <p className="text-[#002d17]/60 text-sm leading-relaxed">{featured.excerpt}</p>
              <span className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">Đọc tiếp <ArrowRight size={12} /></span>
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

// ─── PARTNERS AUTO-SCROLL ─────────────────────────────────────────────────────
function PartnersSection() {
  const doubled = [...partnerLogos, ...partnerLogos];

  return (
    <section className="w-full bg-[#002d17] py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
              Partners &amp; Customers
            </h3>
          </div>
          <p className="text-white/40 text-sm max-w-xs">
            Đối tác tin cậy của các tập đoàn đa quốc gia hàng đầu trong lĩnh vực xây dựng và MEP.
          </p>
        </div>
      </div>

      {/* Auto-scroll row */}
      <div className="relative flex w-full">
        <motion.div
          className="flex gap-px min-w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        >
          {doubled.map((partner, idx) => (
            <div
              key={idx}
              className="w-40 md:w-48 h-24 bg-[#0a3d22] hover:bg-[#46aa85] border border-white/5 hover:border-[#f4aa1f]/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 rounded-xl"
            >
              <span className="text-white/50 hover:text-white font-extrabold text-xs md:text-sm uppercase tracking-widest text-center whitespace-pre-line leading-tight px-2 transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row reverse */}
      <div className="relative flex w-full mt-px">
        <motion.div
          className="flex gap-px min-w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 38, ease: "linear" }}
        >
          {[...doubled].reverse().map((partner, idx) => (
            <div
              key={idx}
              className="w-40 md:w-48 h-24 bg-[#0a3d22] hover:bg-[#46aa85] border border-white/5 hover:border-[#f4aa1f]/30 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 rounded-xl"
            >
              <span className="text-white/30 hover:text-white font-extrabold text-xs md:text-sm uppercase tracking-widest text-center whitespace-pre-line leading-tight px-2 transition-colors">
                {partner.name}
              </span>
              <span className="text-white/20 text-[9px] text-center px-3 tracking-wider hidden md:block">
                {partner.tagline}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export function Home() {
  return (
    <div className="flex flex-col w-full bg-white overflow-x-hidden">
      <HeroSection />
      <MarqueeStrip />
      <SloganSection />
      <ServicesSection />
      <ProjectsSection />
      <NewsSection />
      <PartnersSection />
    </div>
  );
}
