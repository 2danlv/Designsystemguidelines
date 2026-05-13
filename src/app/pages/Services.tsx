import { Link } from "react-router";
import {
  ChevronRight, Check, ArrowRight,
  PenTool, Wrench, Building2, Zap
} from "lucide-react";
import { motion } from "motion/react";

const servicesList = [
  {
    id: 1,
    icon: Wrench,
    num: "01",
    tag: "Thế Mạnh Hàng Đầu",
    title: "Nâng Cấp Cải Tạo Không Dừng Sản Xuất",
    subtitle: "Renovation & Upgrade",
    desc: "Tona là đơn vị tiên phong tại Việt Nam về cải tạo công trình đang vận hành (running factory renovation). Quy trình thi công được thiết kế để tuyệt đối không gây gián đoạn dây chuyền sản xuất, với hệ thống kiểm soát an toàn và vệ sinh công nghiệp khắt khe nhất.",
    features: [
      "Lập kế hoạch thi công không dừng sản xuất",
      "Kiểm soát bụi & tiếng ồn theo tiêu chuẩn GMP",
      "Phối hợp ca 24/7 theo lịch sản xuất",
      "Hệ thống barrier & vách ngăn tạm thời",
    ],
    img: "https://images.unsplash.com/photo-1748002388689-c62b45d5c28b?w=1080&q=80",
    featured: true,
  },
  {
    id: 2,
    icon: PenTool,
    num: "02",
    tag: "EPC Toàn Diện",
    title: "Thiết Kế & Xây Dựng",
    subtitle: "Design & Build",
    desc: "Tổng thầu EPC chịu trách nhiệm toàn diện từ thiết kế kỹ thuật, lập tiến độ, mua sắm vật tư đến thi công và nghiệm thu bàn giao. Một đầu mối — nhiều giải pháp.",
    features: [
      "Thiết kế kỹ thuật & lập hồ sơ BIM",
      "Quản lý chuỗi cung ứng vật tư",
      "Kiểm soát chi phí & tiến độ tập trung",
      "Bảo hành & hỗ trợ kỹ thuật sau bàn giao",
    ],
    img: "https://images.unsplash.com/photo-1645434897689-af222b85993e?w=1080&q=80",
    featured: false,
  },
  {
    id: 3,
    icon: Building2,
    num: "03",
    tag: "Kết Cấu & Hạ Tầng",
    title: "Thi Công Dân Dụng & Công Nghiệp",
    subtitle: "Civil & Structural",
    desc: "Từ kết cấu thép tiền chế nhà xưởng đến công trình bê tông cốt thép nhiều tầng — Tona có kinh nghiệm thi công đa dạng loại hình công trình với tiêu chuẩn chất lượng quốc tế.",
    features: [
      "Kết cấu thép tiền chế PEB",
      "Bê tông cốt thép B30-B40",
      "Móng cọc khoan nhồi, cọc ép",
      "Hạ tầng: đường nội bộ, thoát nước, kho bãi",
    ],
    img: "https://images.unsplash.com/photo-1774979159518-7706ca7bb2e6?w=1080&q=80",
    featured: false,
  },
  {
    id: 4,
    icon: Zap,
    num: "04",
    tag: "Kỹ Thuật Cao",
    title: "Hệ Thống Cơ Điện MEP",
    subtitle: "Mechanical, Electrical & Plumbing",
    desc: "Bộ phận MEP của Tona chuyên triển khai hệ thống kỹ thuật phức tạp cho nhà máy sản xuất điện tử, phòng sạch cleanroom và công trình đòi hỏi độ chính xác cao.",
    features: [
      "Phòng sạch ISO Class 5–8",
      "Hệ thống HVAC & điều hòa công nghiệp",
      "Điện hạ thế, MCC panel, UPS",
      "Hệ thống khí đặc biệt: N₂, CO₂, Compressed Air",
    ],
    img: "https://images.unsplash.com/photo-1759830337357-29c472b6746c?w=1080&q=80",
    featured: false,
  },
];

const processSteps = [
  { step: "01", title: "Khảo Sát & Tư Vấn", desc: "Tiếp nhận yêu cầu, khảo sát hiện trạng và tư vấn giải pháp phù hợp nhất." },
  { step: "02", title: "Thiết Kế Kỹ Thuật", desc: "Lập hồ sơ thiết kế kỹ thuật, bản vẽ thi công và kế hoạch triển khai." },
  { step: "03", title: "Ký Kết Hợp Đồng", desc: "Minh bạch về phạm vi, tiến độ, chi phí và các cam kết chất lượng." },
  { step: "04", title: "Thi Công", desc: "Triển khai đúng tiến độ, kiểm soát chất lượng theo ISO 9001 mỗi ngày." },
  { step: "05", title: "Nghiệm Thu & Bàn Giao", desc: "Kiểm tra toàn bộ hạng mục, bàn giao hồ sơ hoàn công và hướng dẫn vận hành." },
  { step: "06", title: "Bảo Hành", desc: "Hỗ trợ kỹ thuật sau bàn giao, bảo hành theo hợp đồng." },
];

export function Services() {
  const featured = servicesList[0];
  const rest = servicesList.slice(1);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Dịch Vụ</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            Giải Pháp<br />Xây Dựng Toàn Diện
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            Từ tổng thầu EPC đến cải tạo không dừng sản xuất — Tona Corporation cung cấp giải pháp xây dựng đáp ứng mọi yêu cầu khắt khe nhất của công nghiệp hiện đại.
          </p>
        </div>
      </div>

      {/* FEATURED SERVICE */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-[#002d17] flex flex-col lg:flex-row min-h-[400px]"
        >
          {/* Image */}
          <div className="lg:w-[55%] relative overflow-hidden">
            <img
              src={featured.img}
              alt={featured.title}
              className="w-full h-56 lg:h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#002d17]/70 hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002d17]/80 to-transparent lg:hidden" />
          </div>

          {/* Content */}
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
              {featured.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80 text-sm font-medium">
                  <Check size={14} className="text-[#f4aa1f] shrink-0 mt-0.5" strokeWidth={3} />
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              to="/vi/du-an-tona"
              className="w-fit flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
            >
              Xem Dự Án <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* SERVICE CARDS GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col border border-[#002d17]/10 rounded-2xl overflow-hidden hover:border-[#f4aa1f] hover:shadow-[0_0_0_1px_#f4aa1f] transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full aspect-[16/9] overflow-hidden bg-[#bcd8cb] relative">
                  <img
                    src={srv.img}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#002d17]/15 group-hover:bg-[#002d17]/5 transition-colors" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 p-7 flex-1 bg-white group-hover:bg-[#fdfcf8] transition-colors duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors shrink-0 rounded-xl">
                      <Icon size={18} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                    </div>
                    <span className="text-[#002d17]/8 font-extrabold text-5xl leading-none tracking-tight group-hover:text-[#f4aa1f]/15 transition-colors select-none">
                      {srv.num}
                    </span>
                  </div>

                  <div>
                    <p className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest mb-1.5">{srv.subtitle}</p>
                    <h3 className="font-extrabold text-[#002d17] text-xl uppercase tracking-tight leading-snug">
                      {srv.title}
                    </h3>
                  </div>

                  <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium flex-1">
                    {srv.desc}
                  </p>

                  <ul className="flex flex-col gap-2 border-t border-[#002d17]/8 pt-4">
                    {srv.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#002d17]/65 text-xs font-medium">
                        <Check size={12} className="text-[#46aa85] shrink-0 mt-0.5" strokeWidth={3} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/vi/du-an-tona"
                    className="flex items-center gap-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all mt-1"
                  >
                    Xem Dự Án <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PROCESS */}
      <section className="bg-[#002d17] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Quy Trình Triển Khai
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
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
      <div className="bg-[#f4aa1f] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Sẵn sàng bắt đầu dự án?
            </h3>
            <p className="text-[#002d17]/60 mt-2 text-sm font-medium">Liên hệ để được tư vấn miễn phí về giải pháp phù hợp.</p>
          </div>
          <Link
            to="/vi/nghe-nghiep"
            className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            Liên Hệ Tư Vấn
          </Link>
        </div>
      </div>
    </div>
  );
}
