import { useState, useCallback, useEffect } from "react";
import { useParams, Link } from "react-router";
import { projects } from "../data";
import {
  ArrowLeft, ArrowRight, X, MapPin, Maximize2,
  Calendar, User, CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";

// ─── LIGHTBOX ────────────────────────────────────────────────────────────────
function Lightbox({
  images, startAt, onClose,
}: { images: string[]; startAt: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startAt);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#002d17]/97 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt=""
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full max-h-[80vh] object-contain"
          />
        </AnimatePresence>

        <button onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-[#f4aa1f] transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
          <X size={16} /> Đóng (ESC)
        </button>

        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/80 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors">
          <ChevronLeft size={22} />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/80 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors">
          <ChevronRight size={22} />
        </button>

        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`transition-all ${i === idx ? "w-8 h-1 bg-[#f4aa1f]" : "w-4 h-1 bg-white/30"}`} />
          ))}
        </div>
        <p className="text-center text-white/40 text-xs mt-3 font-bold uppercase tracking-widest">
          {idx + 1} / {images.length}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── IMAGE GALLERY ────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  const updateBtns = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", updateBtns);
    updateBtns();
  }, [emblaApi, updateBtns]);

  const openLightbox = (i: number) => { setLightboxIdx(i); setLightboxOpen(true); };

  return (
    <>
      {/* Main slider */}
      <div className="w-full bg-[#002d17] relative overflow-hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0 relative">
                <div
                  className="w-full h-[55vh] md:h-[65vh] min-h-[380px] cursor-zoom-in group"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#002d17]/0 group-hover:bg-[#002d17]/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#f4aa1f] px-4 py-2 font-bold text-[#002d17] text-xs uppercase tracking-widest flex items-center gap-2">
                      <Maximize2 size={14} /> Phóng to
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Arrows */}
        <button onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/60 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronLeft size={22} />
        </button>
        <button onClick={() => emblaApi?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#002d17]/60 hover:bg-[#f4aa1f] text-white hover:text-[#002d17] flex items-center justify-center transition-colors backdrop-blur-sm">
          <ChevronRight size={22} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)}
              className="w-2 h-2 rounded-full bg-white/40 hover:bg-[#f4aa1f] transition-colors" />
          ))}
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="flex gap-2 px-6 md:px-0 mt-2 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => { emblaApi?.scrollTo(i); openLightbox(i); }}
            className="shrink-0 w-20 h-14 overflow-hidden border-2 border-transparent hover:border-[#f4aa1f] transition-colors group"
          >
            <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox images={images} startAt={lightboxIdx} onClose={() => setLightboxOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const relatedProjects = projects.filter((p) => p.slug !== slug).slice(0, 3);

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-extrabold text-[#002d17] uppercase mb-4">Project Not Found</h2>
        <Link to="/vi/du-an-tona" className="text-[#f4aa1f] font-bold uppercase tracking-widest border-b-2 border-[#f4aa1f] pb-1">
          Back to Projects
        </Link>
      </div>
    );
  }

  const images = project.images || [project.image];

  return (
    <div className="w-full bg-white flex flex-col">
      {/* Image Gallery */}
      <ImageGallery images={images} />

      {/* Breadcrumb + back */}
      <div className="bg-white border-b border-[#002d17]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#002d17]/50">
          <Link to="/vi/du-an-tona" className="hover:text-[#f4aa1f] flex items-center gap-1 transition-colors">
            <ArrowLeft size={13} /> Tất Cả Dự Án
          </Link>
          <span>/</span>
          <span className="text-[#002d17]">{project.category}</span>
        </div>
      </div>

      {/* SPEC STRIP */}
      <div className="w-full bg-[#46aa85]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
          {(project as any).leedGold && (
            <div className="flex items-center gap-3 pb-4 border-b border-white/20">
              <div className="bg-[#b8860b] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                ★ LEED Gold Certified
              </div>
              <span className="text-white/70 text-xs font-medium">Công trình đạt chứng nhận xanh LEED Gold</span>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[
            { label: "Khách Hàng", value: project.client, icon: User },
            { label: "Vị Trí", value: project.location, icon: MapPin },
            { label: "Diện Tích", value: project.area, icon: Maximize2 },
            { label: "Thời Gian", value: project.duration || project.scale, icon: Calendar },
            { label: "Trạng Thái", value: project.status, icon: CheckCircle2 },
          ].map((spec) => {
            const Icon = spec.icon;
            return (
              <div key={spec.label} className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-[#f4aa1f] text-xs font-bold uppercase tracking-widest">
                  <Icon size={11} /> {spec.label}
                </span>
                <span className="text-white font-extrabold text-base">{spec.value}</span>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: description */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div>
            <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3 block">{project.category} · {project.year}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#002d17] uppercase leading-[1.1] mb-6">
              {project.title}
            </h1>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-8" />
            <p className="text-[#002d17]/70 text-base leading-relaxed font-medium mb-6">
              {project.description}
            </p>
            <p className="text-[#002d17]/70 text-base leading-relaxed font-medium">
              Tại dự án {project.title}, Tona Corp đã áp dụng các giải pháp thi công tối ưu nhất, tuân thủ nghiêm ngặt các quy định về an toàn lao động và bảo vệ môi trường. Chúng tôi tự hào khi bàn giao một công trình không chỉ đạt chất lượng cao mà còn mang lại giá trị bền vững lâu dài cho đối tác {project.client}.
            </p>
          </div>

          {/* Highlights */}
          {project.highlights && (
            <div>
              <h3 className="font-extrabold text-[#002d17] uppercase tracking-tight mb-4 text-lg">Điểm Nổi Bật</h3>
              <div className="grid grid-cols-2 gap-3">
                {project.highlights.map((hl, i) => (
                  <div key={i} className="bg-[#002d17] text-white px-4 py-3 font-bold text-sm uppercase tracking-wider text-center rounded-xl">
                    {hl}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: renovation items */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#f9f9f7] p-8 rounded-2xl">
            <h3 className="font-extrabold text-[#002d17] uppercase tracking-tight mb-6 text-lg border-b-2 border-[#f4aa1f] pb-3">
              Hạng Mục Thi Công
            </h3>
            {project.renovationItems && (
              <ul className="flex flex-col gap-4">
                {project.renovationItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#002d17] font-medium text-sm">
                    <CheckCircle2 size={16} className="text-[#f4aa1f] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-[#002d17] p-8 rounded-2xl">
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">Có dự án tương tự?</p>
            <h4 className="text-white font-extrabold text-xl uppercase mb-4">Hãy liên hệ với chúng tôi</h4>
            <Link
              to="/vi/nghe-nghiep"
              className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-5 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors w-full justify-center"
            >
              Liên Hệ Ngay <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Related projects */}
      <div className="bg-[#f9f9f7] border-t border-[#002d17]/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="font-extrabold text-[#002d17] uppercase tracking-tight text-2xl mb-10">
            Dự Án Liên Quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => (
              <Link key={rel.id} to={`/vi/project/${rel.slug}`} className="group flex flex-col">
                <div className="w-full aspect-[4/3] overflow-hidden bg-[#bcd8cb] rounded-xl">
                  <img src={rel.image} alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="pt-4 pb-3 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                  <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest">{rel.category}</span>
                  <h4 className="font-extrabold text-[#002d17] uppercase text-base mt-1 leading-snug group-hover:text-[#46aa85] transition-colors">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
