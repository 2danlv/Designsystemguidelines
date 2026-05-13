import { useState } from "react";
import { Link } from "react-router";
import { projects } from "../data";
import { MapPin, Maximize2, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const categories = ["Tất Cả", "Industrial", "Commercial", "Solar Rooftop", "Hotels", "Apartments"];
const categoryMap: Record<string, string> = {
  "Tất Cả": "All",
  Industrial: "Industrial",
  Commercial: "Commercial",
  "Solar Rooftop": "Solar Rooftop",
  Hotels: "Hotels",
  Apartments: "Apartments",
};

const stats = [
  { value: "500+", label: "Dự Án Hoàn Thành" },
  { value: "50+", label: "Khách Hàng Quốc Tế" },
  { value: "15+", label: "Năm Kinh Nghiệm" },
  { value: "1M+", label: "m² Đã Thi Công" },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("Tất Cả");

  const filteredProjects =
    activeFilter === "Tất Cả"
      ? projects
      : projects.filter((p) => p.category === categoryMap[activeFilter]);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* PAGE HERO */}
      <div className="relative bg-[#002d17] pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Dự Án</span>
          </div>
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight">
              Dự Án<br />Nổi Bật
            </h1>
            <p className="text-white/50 font-medium text-base mt-4 max-w-xl">
              Tổng hợp các công trình tiêu biểu Tona Corporation đã thực hiện — từ nhà máy công nghiệp, trung tâm thương mại đến khu nghỉ dưỡng hạng sang.
            </p>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="bg-[#f4aa1f]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#002d17]/20">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-2">
              <span className="font-extrabold text-[#002d17] text-3xl tracking-tight">{s.value}</span>
              <span className="text-[#002d17]/70 font-bold text-xs uppercase tracking-widest mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="border-b border-[#002d17]/10 bg-white sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 font-bold uppercase tracking-widest text-xs transition-colors ${
                activeFilter === cat
                  ? "bg-[#002d17] text-white"
                  : "bg-transparent border border-[#002d17]/20 text-[#002d17]/70 hover:border-[#002d17] hover:text-[#002d17]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              <Link to={`/vi/project/${project.slug}`} className="group flex flex-col">
                {/* Image - multi-layer with thumbnail strip */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#bcd8cb] rounded-xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-[#f4aa1f] text-[#002d17] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">
                    {project.category}
                  </div>
                  {/* Status badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                    project.status === "Hoàn thành" ? "bg-[#d5ede5] text-[#1a6645]" : "bg-[#002d17] text-[#f4aa1f]"
                  }`}>
                    {project.status}
                  </div>
                  {/* LEED Gold badge */}
                  {(project as any).leedGold && (
                    <div className="absolute bottom-3 right-3 bg-[#b8860b] text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                      ★ LEED Gold
                    </div>
                  )}
                  {/* Thumbnail strip on hover */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex gap-1 p-2 bg-[#002d17]/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.images.slice(1, 4).map((img, i) => (
                        <div key={i} className="w-12 h-9 overflow-hidden shrink-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {project.images.length > 4 && (
                        <div className="w-12 h-9 bg-[#002d17] flex items-center justify-center text-white text-xs font-bold">
                          +{project.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card info */}
                <div className="flex flex-col gap-3 pt-5 pb-3 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors">
                  <h3 className="font-extrabold text-[#002d17] text-lg uppercase tracking-tight leading-snug group-hover:text-[#46aa85] transition-colors">
                    {project.title}
                  </h3>

                  {/* Location + area */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-[#002d17]/60 text-xs font-bold uppercase tracking-wider">
                      <MapPin size={11} className="text-[#f4aa1f]" /> {project.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-[#002d17]/60 text-xs font-bold uppercase tracking-wider">
                      <Maximize2 size={11} className="text-[#f4aa1f]" /> {project.area}
                    </span>
                  </div>

                  {/* Renovation items */}
                  {project.renovationItems && (
                    <ul className="flex flex-col gap-1 mt-1">
                      {project.renovationItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[#002d17]/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">
                    Xem chi tiết <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="bg-[#002d17] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
              Bạn có dự án tương tự?
            </h3>
            <p className="text-white/50 mt-2 text-sm">Hãy để Tona Corporation đồng hành cùng bạn từ bản vẽ đến hoàn thiện.</p>
          </div>
          <Link
            to="/vi/nghe-nghiep"
            className="shrink-0 bg-[#f4aa1f] text-[#002d17] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Liên Hệ Tư Vấn
          </Link>
        </div>
      </div>
    </div>
  );
}
