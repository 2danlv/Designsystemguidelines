import { Link } from "react-router";
import { ChevronRight, Heart, Users, Trophy, Zap, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

// ─── DATA ────────────────────────────────────────────────────────────────────
const yearlyThemes = [
  {
    year: "2025",
    theme: "BEYOND LIMITS",
    color: "#f4aa1f",
    desc: "Vượt qua giới hạn bản thân và tổ chức — chinh phục những dự án lớn hơn, phức tạp hơn, và tạo ra những chuẩn mực mới cho ngành xây dựng Việt Nam.",
    milestones: [
      "Spartronics 2 — Nhà máy cleanroom ISO 6 lớn nhất",
      "Ra mắt bộ phận Solar & Green Energy",
      "Chứng nhận ISO 45001:2018 toàn hệ thống",
    ],
    active: true,
  },
  {
    year: "2024",
    theme: "BUILD FORWARD",
    color: "#46aa85",
    desc: "Tiến về phía trước — tập trung vào đổi mới quy trình, ứng dụng công nghệ BIM và mở rộng năng lực MEP trong lĩnh vực năng lượng sạch.",
    milestones: [
      "Hoàn thành Phoenix Contact 171 ngày zero downtime",
      "15 MWp Solar Rooftop cho SV Group",
      "Vào top 10 nhà thầu MEP uy tín miền Nam",
    ],
    active: false,
  },
  {
    year: "2023",
    theme: "TOGETHER WE RISE",
    color: "#002d17",
    desc: "Cùng nhau vươn cao — phát triển văn hóa đội nhóm, nâng cao phúc lợi nhân viên và mở rộng mạng lưới đối tác chiến lược.",
    milestones: [
      "Hoàn thành GO! Đồng Nai 46,100 m²",
      "Ra mắt chương trình TONA Academy",
      "Đội ngũ tăng từ 500 lên 800+ nhân sự",
    ],
    active: false,
  },
];

const cultureActivities = [
  {
    title: "Tiệc Tất Niên",
    subtitle: "Year-End Gala",
    desc: "Sự kiện hoành tráng cuối năm — vinh danh thành tích, tri ân nhân viên và kết nối cộng đồng Tona trong không khí ấm áp.",
    image: "https://images.unsplash.com/photo-1768508948835-7dbab7ca6d58?w=800&q=80",
    icon: Trophy,
    color: "#f4aa1f",
  },
  {
    title: "Ngày Hội Thể Thao",
    subtitle: "Sports Day",
    desc: "Giải thi đấu thể thao nội bộ hàng năm — nơi tinh thần đồng đội được rèn luyện và mỗi cá nhân tìm thấy năng lượng mới.",
    image: "https://images.unsplash.com/photo-1678893049430-d9087867e775?w=800&q=80",
    icon: Zap,
    color: "#46aa85",
  },
  {
    title: "Team Building",
    subtitle: "Quarterly Retreat",
    desc: "Chuyến du lịch và hoạt động gắn kết đội nhóm định kỳ — tạo dựng niềm tin và tình đồng nghiệp vượt ra ngoài công trường.",
    image: "https://images.unsplash.com/photo-1774599661355-327e322f53c2?w=800&q=80",
    icon: Users,
    color: "#002d17",
  },
  {
    title: "CSR & Thiện Nguyện",
    subtitle: "Community Care",
    desc: "Tona đồng hành cùng cộng đồng — từ xây dựng trường học vùng sâu đến hỗ trợ các gia đình khó khăn tại vùng dự án.",
    image: "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=800&q=80",
    icon: Heart,
    color: "#f4aa1f",
  },
];

const galleryPhotos = [
  "https://images.unsplash.com/photo-1768508948835-7dbab7ca6d58?w=800&q=80",
  "https://images.unsplash.com/photo-1678893049430-d9087867e775?w=800&q=80",
  "https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=800&q=80",
  "https://images.unsplash.com/photo-1774599661355-327e322f53c2?w=800&q=80",
  "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=800&q=80",
  "https://images.unsplash.com/photo-1758691737605-69a0e78bd193?w=800&q=80",
];

const toneOfVoice = [
  { stat: "800+", label: "Nhân Sự" },
  { stat: "15+", label: "Năm Kinh Nghiệm" },
  { stat: "100%", label: "Đóng Bảo Hiểm" },
  { stat: "4.8/5", label: "Đánh Giá Nội Bộ" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function Culture() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Cuộc Sống Tona</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            Tona —<br />Hơn Cả<br />Một Nơi Làm Việc
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl mt-4">
            Tại Tona, mỗi thành viên được tôn trọng, gắn kết và cùng nhau phát triển qua những hoạt động văn hóa nội bộ sôi nổi và ý nghĩa.
          </p>
        </div>
        {/* Large decorative text */}
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[200px] font-extrabold text-white/5 uppercase leading-none select-none pointer-events-none">
          TONA
        </div>
      </div>

      {/* PEOPLE STATS */}
      <div className="bg-[#f4aa1f]">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#002d17]/20">
          {toneOfVoice.map((t) => (
            <div key={t.label} className="flex flex-col items-center py-2">
              <span className="font-extrabold text-[#002d17] text-3xl tracking-tight">{t.stat}</span>
              <span className="text-[#002d17]/70 font-bold text-xs uppercase tracking-widest mt-1">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* YEARLY THEME SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Chủ Đề Năm
            </h2>
            <p className="text-[#002d17]/50 mt-3 text-sm font-medium">
              Mỗi năm Tona lựa chọn một chủ đề chiến lược — định hướng tinh thần và hành động cho toàn bộ tổ chức.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {yearlyThemes.map((theme, idx) => (
              <motion.div
                key={theme.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative overflow-hidden transition-all duration-300 ${
                  theme.active
                    ? "bg-[#002d17] cursor-default"
                    : "bg-white border border-[#002d17]/10 hover:border-[#002d17] cursor-pointer"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6 p-8 md:p-10">
                  {/* Year */}
                  <div className="shrink-0">
                    <div
                      className="w-16 h-1 mb-3"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span
                      className={`font-extrabold text-4xl tracking-tight ${theme.active ? "text-white" : "text-[#002d17]/30"}`}
                    >
                      {theme.year}
                    </span>
                    {theme.active && (
                      <div className="mt-2 bg-[#f4aa1f] text-[#002d17] text-xs font-bold uppercase tracking-widest px-2 py-0.5 w-fit">
                        Hiện Tại
                      </div>
                    )}
                  </div>

                  {/* Theme name */}
                  <div className="flex-1">
                    <h3
                      className={`font-extrabold text-3xl md:text-4xl uppercase tracking-tight mb-4 ${
                        theme.active ? "text-[#f4aa1f]" : "text-[#002d17]"
                      }`}
                    >
                      {theme.theme}
                    </h3>
                    <p className={`text-sm leading-relaxed font-medium mb-6 max-w-xl ${
                      theme.active ? "text-white/70" : "text-[#002d17]/60"
                    }`}>
                      {theme.desc}
                    </p>
                    {/* Milestones */}
                    <ul className="flex flex-col gap-2">
                      {theme.milestones.map((m, i) => (
                        <li key={i} className={`flex items-start gap-3 text-sm font-medium ${
                          theme.active ? "text-white/60" : "text-[#002d17]/50"
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f4aa1f] mt-1.5 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Decorative year bg */}
                <div className={`absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-[80px] md:text-[120px] font-extrabold uppercase leading-none select-none pointer-events-none ${
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
      <section className="py-20 bg-[#f9f9f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Hoạt Động Văn Hóa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cultureActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#002d17]/8"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#bcd8cb] rounded-xl">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-[#002d17]/30 group-hover:bg-[#002d17]/10 transition-colors" />
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#002d17]/70 px-3 py-2 rounded-xl">
                      <Icon size={16} className="text-[#f4aa1f]" />
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{act.subtitle}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-5 pb-4 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors bg-white px-4">
                    <h3 className="font-extrabold text-[#002d17] text-xl uppercase tracking-tight">{act.title}</h3>
                    <p className="text-[#002d17]/60 text-sm leading-relaxed">{act.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TONA ACADEMY */}
      <section className="py-20 bg-[#002d17]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-4 block">Phát Triển Con Người</span>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6">
              TONA Academy —<br />Học Để Vươn Xa
            </h2>
            <p className="text-white/60 text-base leading-relaxed font-medium mb-8">
              TONA Academy là chương trình đào tạo nội bộ toàn diện — từ kỹ năng kỹ thuật chuyên sâu đến năng lực lãnh đạo và quản lý dự án. Mỗi năm, 200+ nhân sự được đào tạo và nâng cấp năng lực.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { val: "200+", label: "Học viên/năm" },
                { val: "50+", label: "Chương trình" },
                { val: "15", label: "Đối tác đào tạo" },
                { val: "98%", label: "Hài lòng" },
              ].map((s) => (
                <div key={s.label} className="border border-white/10 p-4">
                  <span className="font-extrabold text-[#f4aa1f] text-2xl">{s.val}</span>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/vi/nghe-nghiep"
              className="inline-flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
            >
              Gia Nhập Tona <ArrowRight size={14} />
            </Link>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=800&q=80"
              alt="Tona Academy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Khoảnh Khắc Tona
            </h2>
          </div>
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 650: 2, 900: 3 }}>
            <Masonry gutter="12px">
              {galleryPhotos.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="overflow-hidden group cursor-pointer"
                >
                  <img
                    src={src}
                    alt="Tona Culture"
                    className="w-full h-auto block group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </motion.div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <div className="bg-[#f4aa1f] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Muốn trở thành một phần của Tona?
            </h3>
            <p className="text-[#002d17]/60 mt-2 text-sm font-medium">
              Chúng tôi luôn tìm kiếm những tài năng chia sẻ cùng giá trị và đam mê.
            </p>
          </div>
          <Link
            to="/vi/nghe-nghiep"
            className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            Xem Cơ Hội Nghề Nghiệp
          </Link>
        </div>
      </div>
    </div>
  );
}
