import { leadership } from "../data";
import { Linkedin, ChevronRight, Users, Award, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

const coreValues = [
  { icon: Shield, title: "An Toàn Trên Hết", desc: "Zero accident là kim chỉ nam trong mọi quyết định và hành động tại Tona." },
  { icon: Award, title: "Chất Lượng Không Thỏa Hiệp", desc: "Từng chi tiết nhỏ nhất đều được kiểm soát theo tiêu chuẩn ISO quốc tế." },
  { icon: TrendingUp, title: "Hiệu Quả & Tiến Độ", desc: "Cam kết bàn giao đúng hạn — thậm chí sớm hơn — không phát sinh chi phí ngoài hợp đồng." },
  { icon: Users, title: "Con Người Là Nền Tảng", desc: "800+ nhân sự được đào tạo bài bản, gắn kết trong một văn hóa doanh nghiệp mạnh mẽ." },
];

export function Members() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Đội Ngũ Lãnh Đạo</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            Hội Đồng<br />Quản Trị
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            Những con người dẫn dắt Tona Corporation — với kinh nghiệm, tầm nhìn và cam kết kiến tạo chuẩn mực mới trong ngành xây dựng Việt Nam.
          </p>
        </div>
      </div>

      {/* BOD CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col"
            >
              {/* Photo card */}
              <div className="relative overflow-hidden bg-[#002d17] rounded-t-2xl">
                {/* Portrait — tall aspect ratio to emphasize person */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                {/* Dark overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#002d17] to-transparent" />

                {/* Name on photo */}
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                  {/* Golden accent line */}
                  <div className="w-10 h-0.5 bg-[#f4aa1f] mb-3" />
                  <h3 className="font-extrabold text-white text-xl uppercase tracking-tight leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest">
                    {member.roleEn}
                  </p>
                </div>

                {/* LinkedIn hover */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 w-9 h-9 bg-[#002d17]/70 hover:bg-[#f4aa1f] flex items-center justify-center text-white hover:text-[#002d17] transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <Linkedin size={15} />
                </a>
              </div>

              {/* Bio */}
              <div className="bg-[#f9f9f7] px-5 py-5 flex-1 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors rounded-b-2xl">
                <p className="text-[#002d17]/70 text-sm leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="bg-[#002d17] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              Giá Trị Lãnh Đạo
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#002d17] hover:bg-[#46aa85] transition-colors p-8 flex flex-col gap-4 group rounded-2xl"
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors">
                    <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                  </div>
                  <h3 className="font-extrabold text-white text-base uppercase tracking-tight">{val.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MANAGEMENT TEAM TEASER */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              800+ Chuyên Gia Tại Tona
            </h2>
            <p className="text-[#002d17]/60 mt-3 text-sm font-medium max-w-lg">
              Phía sau Ban lãnh đạo là đội ngũ 800+ kỹ sư, chuyên gia và công nhân lành nghề — những người trực tiếp kiến tạo nên mỗi công trình của Tona.
            </p>
          </div>
          <Link
            to="/vi/cuoc-song-tona"
            className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            Khám Phá Cuộc Sống Tona
          </Link>
        </div>
      </div>
    </div>
  );
}
