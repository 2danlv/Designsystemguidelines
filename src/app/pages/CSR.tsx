import { useEffect, useMemo, useState } from "react";
import { Link } from "../components/LocalizedLink";
import { ArrowRight, ChevronRight, GraduationCap, Handshake, Heart, Leaf, Sun, Users, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { fetchCmsPage, fetchCmsPageByTemplate, type CsrCmsData } from "../lib/wordpress";

type CsrProgram = {
  id: string;
  icon: LucideIcon;
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
  icon: LucideIcon;
  val: string;
  label: string;
};

const iconMap = {
  GraduationCap,
  Handshake,
  Heart,
  Leaf,
  Sun,
  Users,
};

const fallbackPrograms: CsrProgram[] = [
  {
    id: "uom-tet",
    icon: Heart,
    color: "#f4aa1f",
    bgColor: "#fffdf5",
    tag: "Tết Nguyên Đán",
    title: "Ươm Tết Đón Nắng Xuân",
    subtitle: "Spreading Warmth This Tết",
    desc: "Chương trình trao quà Tết thường niên dành cho gia đình công nhân có hoàn cảnh khó khăn tại các tỉnh miền Đông Nam Bộ, nơi Tona đang triển khai dự án. Mỗi năm, hàng trăm phần quà bao gồm lương thực, tiền mặt và đồ dùng sinh hoạt được trao tận tay trước kỳ nghỉ Tết.",
    stats: [
      { val: "300+", label: "Gia đình được hỗ trợ" },
      { val: "4", label: "Tỉnh thành" },
      { val: "2019", label: "Năm bắt đầu" },
    ],
    highlights: [
      "Tặng 300+ phần quà Tết gồm gạo, dầu ăn, mì tôm và tiền mặt",
      "Thăm hỏi và trao học bổng cho con em công nhân học giỏi",
      "Tổ chức bếp ăn miễn phí trong 3 ngày giáp Tết tại công trường",
      "Phối hợp với Hội Chữ Thập Đỏ địa phương để xác định đối tượng",
    ],
    image: "https://images.unsplash.com/photo-1674574124340-c00cc2dae99c?w=800&q=80",
  },
  {
    id: "solarlab",
    icon: Sun,
    color: "#46aa85",
    bgColor: "#f0faf6",
    tag: "Giáo Dục & Năng Lượng Xanh",
    title: "SolarLab - Phòng Thí Nghiệm Năng Lượng",
    subtitle: "SolarLab Education Initiative",
    desc: "SolarLab là sáng kiến giáo dục của Tona nhằm đưa kiến thức về năng lượng tái tạo đến với học sinh THPT và sinh viên kỹ thuật. Thông qua workshop thực hành, tham quan dự án solar và cuộc thi thiết kế, Tona góp phần ươm mầm thế hệ kỹ sư xanh cho tương lai.",
    stats: [
      { val: "500+", label: "Học sinh/sinh viên tham gia" },
      { val: "8", label: "Trường đối tác" },
      { val: "12", label: "Workshop / năm" },
    ],
    highlights: [
      "Workshop lắp ráp và vận hành tấm pin mặt trời thực tế",
      "Tham quan dự án Solar Rooftop 15 MWp tại SV Group",
      "Cuộc thi thiết kế hệ thống năng lượng mặt trời cho trường học",
      "Tài trợ học bổng Kỹ Sư Xanh cho sinh viên xuất sắc",
    ],
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  },
  {
    id: "internship",
    icon: GraduationCap,
    color: "#002d17",
    bgColor: "#f9f9f7",
    tag: "Phát Triển Nhân Tài",
    title: "Student Internship Program",
    subtitle: "Nurturing Tomorrow's Engineers",
    desc: "Chương trình thực tập sinh của Tona không chỉ là nơi để sinh viên tích lũy giờ thực tập, mà là cơ hội thực sự để học hỏi, đóng góp và phát triển bản thân trong môi trường kỹ thuật chuyên nghiệp đẳng cấp quốc tế.",
    stats: [
      { val: "120+", label: "Thực tập sinh / năm" },
      { val: "60%", label: "Nhận offer full-time" },
      { val: "10+", label: "Trường đại học đối tác" },
    ],
    highlights: [
      "Thực tập trực tiếp tại công trường và văn phòng kỹ thuật",
      "Mentor 1-on-1 với kỹ sư senior có kinh nghiệm 5+ năm",
      "Tham gia đầy đủ vào quá trình QA/QC và nghiệm thu thực tế",
      "Chứng nhận thực tập và thư giới thiệu từ Tona Corporation",
      "Cơ hội trình bày dự án thực tập trước Hội đồng Kỹ thuật",
    ],
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  },
];

const fallbackCommunityImpact: CsrImpact[] = [
  { icon: Handshake, val: "15+", label: "Năm hoạt động CSR" },
  { icon: Users, val: "5,000+", label: "Người được hưởng lợi" },
  { icon: Leaf, val: "3", label: "Chương trình trọng điểm" },
  { icon: Heart, val: "100%", label: "Tự nguyện từ nhân viên" },
];

const fallbackCommitmentItems = [
  { title: "Minh Bạch", desc: "Báo cáo CSR hàng năm công bố công khai, kiểm toán độc lập." },
  { title: "Bền Vững", desc: "Ưu tiên chương trình dài hạn, tạo tác động thực sự thay vì hoạt động bề mặt." },
  { title: "Địa Phương", desc: "Tập trung hỗ trợ cộng đồng tại các địa bàn Tona đang triển khai dự án." },
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

export function CSR() {
  const [cmsPage, setCmsPage] = useState<CsrCmsData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchCmsPageByTemplate<CsrCmsData>("tona-csr", controller.signal)
      .then((page) => page || fetchCmsPage<CsrCmsData>("cuoc-song-tona/trach-nhiem-cong-dong", controller.signal))
      .then(setCmsPage);
    return () => controller.abort();
  }, []);

  const communityImpact = useMemo<CsrImpact[]>(() => {
    if (!cmsPage?.impact?.length) {
      return fallbackCommunityImpact;
    }

    return cmsPage.impact.map((item) => ({
      icon: iconMap[item.icon || "Handshake"] || Handshake,
      val: item.value || "",
      label: item.label || "",
    }));
  }, [cmsPage]);

  const programs = useMemo<CsrProgram[]>(() => {
    if (!cmsPage?.programs?.length) {
      return fallbackPrograms;
    }

    return cmsPage.programs.map((program, index) => ({
      id: program.id || `csr-program-${index}`,
      icon: iconMap[program.icon || "Heart"] || Heart,
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

  const commitmentItems = cmsPage?.commitment?.items?.length ? cmsPage.commitment.items : fallbackCommitmentItems;
  const heroTitle = cmsPage?.hero?.title || "Tona &\nCộng Đồng";
  const heroDescription = cmsPage?.hero?.description || "Tona Corporation tin rằng doanh nghiệp phát triển bền vững phải song hành với trách nhiệm xã hội. Mỗi công trình chúng tôi xây dựng không chỉ là kết cấu thép và bê tông, mà còn là cam kết với con người và cộng đồng.";

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden" style={backgroundStyle(cmsPage?.colors?.heroBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8 flex-wrap">
            <Link to="/" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/cuoc-song-tona" className="hover:text-[#f4aa1f] transition-colors">Cuộc Sống Tona</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{cmsPage?.hero?.breadcrumbLabel || "Trách Nhiệm Cộng Đồng"}</span>
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
              {communityImpact.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-[#002d17] px-6 py-6 flex flex-col gap-2">
                    <Icon size={18} className="text-[#f4aa1f]" />
                    <span className="font-extrabold text-[#f4aa1f] text-3xl">{item.val}</span>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-bold">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#46aa85]/10 pointer-events-none hidden lg:block" />
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-extrabold text-white/[0.03] uppercase leading-none select-none pointer-events-none">
          {cmsPage?.hero?.decorativeText || "CSR"}
        </div>
      </div>

      {/* PROGRAMS */}
      <section className="py-20 bg-white" style={backgroundStyle(cmsPage?.colors?.programsBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              {cmsPage?.programsSection?.title || "Các Chương Trình Trọng Điểm"}
            </h2>
            <p className="text-[#002d17]/50 text-sm font-medium mt-3 max-w-xl">
              {cmsPage?.programsSection?.description || "Ba sáng kiến cốt lõi phản ánh cam kết dài hạn của Tona với cộng đồng, từ chia sẻ ấm áp mỗi dịp Tết đến ươm mầm tri thức cho thế hệ kỹ sư tương lai."}
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
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${isEven ? "" : "lg:[direction:rtl]"}`}
                >
                  <div className={`relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#bcd8cb] ${isEven ? "" : "lg:[direction:ltr]"}`}>
                    <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002d17]/50 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#002d17]/80 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Icon size={16} style={{ color: prog.color }} />
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{prog.tag}</span>
                    </div>
                  </div>

                  <div className={`flex flex-col gap-5 ${isEven ? "" : "lg:[direction:ltr]"}`}>
                    <div>
                      <div className="w-10 h-0.5 mb-4" style={{ backgroundColor: prog.color }} />
                      <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight leading-snug mb-1">
                        {prog.title}
                      </h3>
                      <p className="font-bold text-xs uppercase tracking-widest" style={{ color: prog.color }}>
                        {prog.subtitle}
                      </p>
                    </div>

                    <p className="text-[#002d17]/65 text-sm leading-relaxed font-medium">
                      {prog.desc}
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {prog.stats.map((s) => (
                        <div key={s.label} className="rounded-xl px-4 py-3 border border-[#002d17]/10" style={{ backgroundColor: prog.bgColor }}>
                          <span className="font-extrabold text-[#002d17] text-xl">{s.val}</span>
                          <p className="text-[#002d17]/50 text-[10px] uppercase tracking-widest font-bold mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-[#002d17]/40 font-bold text-xs uppercase tracking-widest mb-3">Điểm Nổi Bật</p>
                      <ul className="flex flex-col gap-2.5">
                        {prog.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-3 text-[#002d17]/70 text-sm font-medium">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: prog.color }} />
                            {h}
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
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight mb-4">
                {renderLines(cmsPage?.commitment?.title || "Cam Kết Lâu Dài\nVới Cộng Đồng")}
              </h3>
              <p className="text-[#002d17]/60 text-sm leading-relaxed font-medium max-w-lg">
                {cmsPage?.commitment?.description || "Tona dành ít nhất 1% doanh thu hàng năm cho các hoạt động CSR. Các chương trình được điều hành bởi Ủy ban CSR nội bộ gồm đại diện từ mọi phòng ban, đảm bảo tiếng nói và sự tham gia của toàn bộ nhân viên."}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {commitmentItems.map((item) => (
                <div key={item.title} className="flex gap-4 items-start bg-white rounded-xl p-5 border border-[#002d17]/8">
                  <div className="w-2 h-2 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-[#002d17] text-sm uppercase tracking-tight">{item.title}</h4>
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
            <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              {cmsPage?.cta?.title || "Cùng Tona Tạo Ra Sự Khác Biệt"}
            </h3>
            <p className="text-white/50 mt-2 text-sm font-medium">
              {cmsPage?.cta?.description || "Gia nhập Tona, nơi công việc của bạn không chỉ xây nên công trình mà còn xây dựng cộng đồng."}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to={cmsPage?.cta?.secondaryUrl || "/cuoc-song-tona"}
              className="flex items-center gap-2 border-2 border-white/20 text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:border-[#f4aa1f] hover:text-[#f4aa1f] transition-colors rounded-lg"
            >
              {cmsPage?.cta?.secondaryLabel || "Cuộc Sống Tona"}
            </Link>
            <Link
              to={cmsPage?.cta?.primaryUrl || "/nghe-nghiep"}
              className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
            >
              {cmsPage?.cta?.primaryLabel || "Gia Nhập Tona"} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
