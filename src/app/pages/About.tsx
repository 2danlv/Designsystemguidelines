import { Link } from "react-router";
import { ChevronRight, ArrowRight, Shield, Award, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import artboard2Img from "../../imports/Artboard_2.png";

const timeline = [
  { year: "2009", title: "Thành Lập", desc: "Tona Corporation ra đời tại TP.HCM với đội ngũ 15 kỹ sư, chuyên về thi công kết cấu công nghiệp." },
  { year: "2013", title: "Mở Rộng MEP", desc: "Ra mắt bộ phận Cơ Điện (MEP) chuyên biệt — bước ngoặt đưa Tona trở thành nhà thầu EPC toàn diện." },
  { year: "2017", title: "ISO 9001", desc: "Nhận chứng nhận ISO 9001:2015 đầu tiên, khẳng định hệ thống quản lý chất lượng đạt tiêu chuẩn quốc tế." },
  { year: "2020", title: "100+ Nhân Sự", desc: "Đội ngũ vượt mốc 100 kỹ sư & chuyên gia, hoàn thành dự án quốc tế đầu tiên cho Phoenix Contact." },
  { year: "2023", title: "800+ Nhân Sự", desc: "Cột mốc 800+ nhân sự, 50+ dự án song song, top 10 nhà thầu MEP uy tín miền Nam." },
  { year: "2025", title: "Beyond Limits", desc: "Bước vào kỷ nguyên mới — Solar & Green Energy, BIM Technology và mục tiêu 1,000 nhân sự." },
];

const coreValues = [
  { icon: Shield, title: "An Toàn Trên Hết", desc: "Zero accident là kim chỉ nam bất di bất dịch. Mỗi nhân sự Tona được đào tạo bài bản về an toàn lao động." },
  { icon: Award, title: "Chất Lượng Không Thỏa Hiệp", desc: "Từng chi tiết nhỏ nhất đều được kiểm soát nghiêm ngặt. ISO 9001 không chỉ là chứng chỉ — đó là văn hóa." },
  { icon: TrendingUp, title: "Hiệu Quả & Tiến Độ", desc: "Bàn giao đúng hạn, thậm chí sớm hơn, không phát sinh chi phí — cam kết với mọi đối tác." },
  { icon: CheckCircle2, title: "Tính Trung Thực", desc: "Minh bạch trong báo cáo, trung thực trong quan hệ — nền tảng của mọi hợp tác lâu dài." },
];

const certifications = [
  { code: "ISO 9001:2015", title: "Quản Lý Chất Lượng", org: "Bureau Veritas" },
  { code: "ISO 45001:2018", title: "An Toàn & Sức Khỏe", org: "Bureau Veritas" },
  { code: "ISO 14001:2015", title: "Quản Lý Môi Trường", org: "Bureau Veritas" },
];

export function About() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Giới Thiệu</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
              <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-6">
                Về Tona<br />Corporation
              </h1>
              <p className="text-white/60 text-base font-medium leading-relaxed max-w-lg">
                Hơn 15 năm kiến tạo những công trình vượt chuẩn — Tona Corporation là lựa chọn hàng đầu của các tập đoàn đa quốc gia khi phát triển dự án tại Việt Nam.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              {[
                { val: "500+", label: "Dự Án Hoàn Thành" },
                { val: "800+", label: "Nhân Sự" },
                { val: "15+", label: "Năm Kinh Nghiệm" },
                { val: "50+", label: "Đối Tác Quốc Tế" },
              ].map((s) => (
                <div key={s.label} className="bg-[#002d17] px-6 py-6">
                  <span className="font-extrabold text-[#f4aa1f] text-3xl">{s.val}</span>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-bold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#46aa85]/10 pointer-events-none hidden lg:block" />
      </div>

      {/* MISSION & VISION — on Artboard_2 background */}
      <section className="relative w-full overflow-hidden">
        <img src={artboard2Img} alt="" className="w-full h-auto block opacity-90" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-center px-6 py-12">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm p-8 border-l-4 border-[#f4aa1f]"
            >
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">Sứ Mệnh</p>
              <p className="text-white font-extrabold text-lg md:text-2xl leading-snug uppercase">
                Mang đến giải pháp xây dựng chất lượng cao nhất, tối ưu hóa chi phí và thời gian — góp phần phát triển bền vững cho đối tác và cộng đồng.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-white/10 backdrop-blur-sm p-8 border-l-4 border-white/50"
            >
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-3">Tầm Nhìn</p>
              <p className="text-white font-extrabold text-lg md:text-2xl leading-snug uppercase">
                Trở thành tổng thầu xây dựng công nghiệp và thương mại hàng đầu khu vực — là sự lựa chọn ưu tiên của mọi tập đoàn đa quốc gia tại Đông Nam Á.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">Giá Trị Cốt Lõi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#002d17]/10">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group p-8 hover:bg-[#f0faf6] transition-colors cursor-pointer ${idx > 0 ? "border-l border-[#002d17]/10" : ""}`}
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center mb-5 group-hover:bg-[#f4aa1f] transition-colors">
                    <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-[#002d17] group-hover:text-[#46aa85] uppercase text-base tracking-tight mb-3 transition-colors">
                    {val.title}
                  </h3>
                  <p className="text-[#002d17]/55 text-sm leading-relaxed">
                    {val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 bg-[#f9f9f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#002d17] uppercase tracking-tight">Hành Trình Phát Triển</h2>
          </div>
          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-16 md:left-24 top-0 bottom-0 w-px bg-[#002d17]/10" />
            {timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-8 md:gap-12 items-start group py-6 first:pt-0"
              >
                {/* Year */}
                <div className="shrink-0 w-16 md:w-24 flex flex-col items-end">
                  <span className="font-extrabold text-[#002d17]/30 group-hover:text-[#f4aa1f] text-lg md:text-2xl tracking-tight transition-colors">
                    {item.year}
                  </span>
                </div>
                {/* Dot */}
                <div className="shrink-0 w-3 h-3 rounded-full bg-white border-2 border-[#002d17]/30 group-hover:border-[#f4aa1f] group-hover:bg-[#f4aa1f] mt-1.5 transition-colors relative z-10" />
                {/* Content */}
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
      <section className="py-20 bg-[#002d17]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Chứng Nhận Quốc Tế</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="bg-white/5 hover:bg-[#46aa85] transition-colors p-10 flex flex-col gap-4 group rounded-2xl border border-white/10">
                <span className="text-[#f4aa1f] font-extrabold text-3xl tracking-tight">{cert.code}</span>
                <div>
                  <h4 className="text-white font-extrabold uppercase tracking-tight text-base">{cert.title}</h4>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Cấp bởi {cert.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-white py-16 border-t border-[#002d17]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Cùng Tona kiến tạo công trình tiếp theo
            </h3>
            <p className="text-[#002d17]/50 mt-2 text-sm font-medium">Từ nhà máy công nghệ cao đến resort 5 sao — chúng tôi sẵn sàng đồng hành.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/vi/du-an-tona" className="flex items-center gap-2 border-2 border-[#002d17] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-white transition-colors rounded-lg">
              Xem Dự Án <ArrowRight size={14} />
            </Link>
            <Link to="/vi/doi-ngu" className="flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors rounded-lg">
              Đội Ngũ Lãnh Đạo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
