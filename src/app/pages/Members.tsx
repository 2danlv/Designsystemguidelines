import { useEffect, useMemo, useState } from "react";
import { leadership } from "../data";
import {
  Linkedin,
  ChevronRight,
  Users,
  Award,
  TrendingUp,
  Shield,
  X,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { fetchCmsPage, type MembersCmsData } from "../lib/wordpress";

type LeadershipMember = (typeof leadership)[number];

type CoreValue = {
  icon: LucideIcon;
  iconImage?: string;
  title: string;
  desc: string;
};

const cmsIconMap: Record<string, LucideIcon> = {
  Shield,
  Award,
  TrendingUp,
  Users,
};

const fallbackCoreValues: CoreValue[] = [
  { icon: Shield, title: "An Toàn Trên Hết", desc: "Zero accident là kim chỉ nam trong mọi quyết định và hành động tại Tona." },
  { icon: Award, title: "Chất Lượng Không Thỏa Hiệp", desc: "Từng chi tiết nhỏ nhất đều được kiểm soát theo tiêu chuẩn ISO quốc tế." },
  { icon: TrendingUp, title: "Hiệu Quả & Tiến Độ", desc: "Cam kết bàn giao đúng hạn, thậm chí sớm hơn, không phát sinh chi phí ngoài hợp đồng." },
  { icon: Users, title: "Con Người Là Nền Tảng", desc: "800+ nhân sự được đào tạo bài bản, gắn kết trong một văn hóa doanh nghiệp mạnh mẽ." },
];

// Extended detail data for the popup
const leaderDetail: Record<string, {
  education: string;
  since: string;
  expertise: string[];
  achievements: string[];
  quote: string;
}> = {
  chairman: {
    education: "Đại học Xây dựng Hà Nội — Kỹ sư Xây dựng dân dụng & công nghiệp",
    since: "2009",
    expertise: ["Quản trị chiến lược", "Phát triển thị trường", "Tài chính doanh nghiệp", "Xây dựng công nghiệp"],
    achievements: [
      "Sáng lập Tona Corporation từ đội ngũ 15 kỹ sư ban đầu năm 2009",
      "Tăng trưởng doanh thu trung bình 20%/năm trong 15 năm liên tiếp",
      "Xây dựng mạng lưới 50+ đối tác quốc tế tại Việt Nam",
      "Dẫn dắt Tona vào Top 10 nhà thầu MEP uy tín miền Nam",
    ],
    quote: "Tona được xây dựng trên nền tảng tin tưởng — tin tưởng từ khách hàng, từ đội ngũ, và từ chính bản thân mỗi người trong hành trình này.",
  },
  ceo: {
    education: "MBA — Singapore Management University; Kỹ sư Xây dựng — ĐH Bách Khoa TP.HCM",
    since: "2012",
    expertise: ["Quản lý EPC", "Quản trị rủi ro", "Tối ưu chuỗi cung ứng", "Phát triển tổ chức"],
    achievements: [
      "Triển khai thành công 200+ dự án EPC cho tập đoàn đa quốc gia",
      "Xây dựng hệ thống quản lý dự án đạt chuẩn ISO 9001:2015",
      "Mở rộng năng lực MEP vào phân khúc cleanroom và high-tech factory",
      "Lãnh đạo đội ngũ từ 100 lên 800+ nhân sự trong 10 năm",
    ],
    quote: "Mỗi dự án là một cam kết — cam kết về chất lượng, tiến độ và sự an toàn tuyệt đối cho từng người lao động trên công trường.",
  },
  coo: {
    education: "Kỹ sư Cơ khí — ĐH Bách Khoa TP.HCM; Chứng chỉ ISO 45001 Lead Auditor",
    since: "2014",
    expertise: ["Quản lý vận hành đa dự án", "Hệ thống quản lý QHSE", "Tối ưu quy trình", "HSE Management"],
    achievements: [
      "Triển khai hệ thống HSE đạt Zero Accident trong 10+ năm liên tiếp",
      "Đạt chứng nhận ISO 45001:2018 cho toàn hệ thống Tona",
      "Xây dựng quy trình kiểm soát chất lượng tinh gọn — giảm 30% phát sinh",
      "Đưa TONA Academy phục vụ 200+ lượt đào tạo/năm",
    ],
    quote: "An toàn không phải là chi phí — an toàn là đầu tư. Văn hóa an toàn tại Tona là nền tảng của mọi dự án chúng tôi xây nên.",
  },
  cdo: {
    education: "Kỹ sư Xây dựng — ĐH Bách Khoa TP.HCM; PMP Certified — Project Management Institute",
    since: "2010",
    expertise: ["Quản lý dự án công nghiệp", "Kết cấu thép tiền chế", "Cleanroom Construction", "BIM Technology"],
    achievements: [
      "Chỉ huy thành công hơn 200 dự án nhà máy công nghệ cao trên toàn quốc",
      "Dẫn dắt dự án đầu tiên đạt tiêu chuẩn Cleanroom ISO 6 tại miền Nam",
      "Triển khai BIM toàn diện lần đầu trong dự án Spartronics VN2",
      "Hoàn thành Phoenix Contact 171 ngày — Zero Downtime, không phát sinh",
    ],
    quote: "Kỹ thuật giỏi không đủ — phải có kỷ luật, phối hợp tốt, và hiểu sâu về khách hàng. Đó là bộ ba tạo nên dự án thành công tại Tona.",
  },
};

// ─── LEADER MODAL ─────────────────────────────────────────────────────────────
function LeaderModal({ member, onClose }: { member: typeof leadership[0]; onClose: () => void }) {
  const detail = leaderDetail[member.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#002d17]/90 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white w-full max-w-2xl my-8 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-48 bg-[#002d17] overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002d17]/90 to-[#002d17]/40" />
          <div className="absolute inset-0 flex items-end px-8 pb-6 gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#f4aa1f] shrink-0">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <div className="w-8 h-0.5 bg-[#f4aa1f] mb-2" />
              <h2 className="font-extrabold text-white text-2xl uppercase tracking-tight leading-tight">{member.name}</h2>
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">{member.role}</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">{member.roleEn} · Tại Tona từ {detail?.since}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-[#002d17]/70 hover:bg-[#f4aa1f] flex items-center justify-center text-white hover:text-[#002d17] transition-colors rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-6">
          {/* Education */}
          {detail && (
            <div className="bg-[#f9f9f7] rounded-xl px-5 py-4">
              <p className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest mb-1">Học Vấn & Chứng Chỉ</p>
              <p className="text-[#002d17] font-semibold text-sm">{detail.education}</p>
            </div>
          )}

          {/* Bio */}
          <div>
            <p className="text-[#002d17]/70 text-sm leading-relaxed font-medium">{member.bio}</p>
          </div>

          {/* Expertise */}
          {detail && (
            <div>
              <p className="text-[#002d17] font-bold text-xs uppercase tracking-widest mb-3">Chuyên Môn</p>
              <div className="flex flex-wrap gap-2">
                {detail.expertise.map((e) => (
                  <span key={e} className="bg-[#f0faf6] text-[#1a6645] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {detail && (
            <div>
              <p className="text-[#002d17] font-bold text-xs uppercase tracking-widest mb-3">Thành Tựu Nổi Bật</p>
              <ul className="flex flex-col gap-2.5">
                {detail.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#002d17]/70 text-sm font-medium">
                    <ArrowRight size={13} className="text-[#f4aa1f] shrink-0 mt-0.5" />
                    {ach}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quote */}
          {detail?.quote && (
            <blockquote className="border-l-4 border-[#f4aa1f] pl-5 py-2 bg-[#fffdf5] rounded-r-xl">
              <p className="text-[#002d17] font-semibold italic text-sm leading-relaxed">"{detail.quote}"</p>
              <cite className="block mt-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest not-italic">
                — {member.name}
              </cite>
            </blockquote>
          )}

          {/* LinkedIn */}
          <div className="flex justify-end pt-2">
            <a
              href={member.linkedin}
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-2 text-[#002d17]/40 hover:text-[#f4aa1f] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Members() {
  const [cmsPage, setCmsPage] = useState<MembersCmsData | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMember | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsPage<MembersCmsData>("doi-ngu", controller.signal).then(setCmsPage);

    return () => controller.abort();
  }, []);

  const members = useMemo<LeadershipMember[]>(() => {
    if (!cmsPage?.leadership?.length) {
      return leadership;
    }

    return cmsPage.leadership.map((member, index) => ({
      id: member.id || `member-${index}`,
      name: member.name || "",
      role: member.role || "",
      roleEn: member.roleEn || "",
      image: member.image || leadership[index]?.image || leadership[0]?.image || "",
      bio: member.bio || "",
      linkedin: member.linkedin || "#",
    }));
  }, [cmsPage]);

  const coreValues = useMemo<CoreValue[]>(() => {
    if (!cmsPage?.values?.length) {
      return fallbackCoreValues;
    }

    return cmsPage.values.map((value) => ({
      icon: cmsIconMap[value.icon || "Shield"] || Shield,
      iconImage: value.iconImage || "",
      title: value.title || "",
      desc: value.desc || "",
    }));
  }, [cmsPage]);

  const heroTitle = cmsPage?.hero?.title || "Hội Đồng\nQuản Trị";
  const heroDescription = cmsPage?.hero?.description || "Những con người dẫn dắt Tona Corporation với kinh nghiệm, tầm nhìn và cam kết kiến tạo chuẩn mực mới trong ngành xây dựng Việt Nam.";
  const breadcrumbLabel = cmsPage?.hero?.breadcrumbLabel || "Đội Ngũ Lãnh Đạo";
  const valuesTitle = cmsPage?.valuesTitle || "Giá Trị Lãnh Đạo";
  const teaserTitle = cmsPage?.teaser?.title || "800+ Chuyên Gia Tại Tona";
  const teaserDescription = cmsPage?.teaser?.description || "Phía sau Ban lãnh đạo là đội ngũ 800+ kỹ sư, chuyên gia và công nhân lành nghề, những người trực tiếp kiến tạo nên mỗi công trình của Tona.";
  const teaserLinkLabel = cmsPage?.teaser?.linkLabel || "Khám Phá Cuộc Sống Tona";
  const teaserLinkUrl = cmsPage?.teaser?.linkUrl || "/vi/cuoc-song-tona";

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            {heroTitle.replace(/\r\n/g, "\n").split("\n").map((line, index, lines) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            {heroDescription}
          </p>
        </div>
      </div>

      {/* BOD CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group flex flex-col cursor-pointer"
              onClick={() => setSelectedLeader(member)}
            >
              {/* Photo card */}
              <div className="relative overflow-hidden bg-[#002d17] rounded-t-2xl">
                {/* Portrait */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[#002d17] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
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
                {/* View profile on hover */}
                <div className="absolute inset-0 bg-[#002d17]/0 group-hover:bg-[#002d17]/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#f4aa1f] text-[#002d17] px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-lg">
                    Xem Hồ Sơ
                  </div>
                </div>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 w-9 h-9 bg-[#002d17]/70 hover:bg-[#f4aa1f] flex items-center justify-center text-white hover:text-[#002d17] transition-colors opacity-0 group-hover:opacity-100 rounded-lg z-10"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <Linkedin size={15} />
                </a>
              </div>

              {/* Bio */}
              <div className="bg-[#f9f9f7] px-5 py-5 flex-1 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors rounded-b-2xl">
                <p className="text-[#002d17]/70 text-sm leading-relaxed font-medium line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leader Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal member={selectedLeader} onClose={() => setSelectedLeader(null)} />
        )}
      </AnimatePresence>

      {/* CORE VALUES */}
      <div className="bg-[#002d17] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              {valuesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={`${val.title}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 hover:bg-[#46aa85] transition-colors p-8 flex flex-col gap-4 group rounded-2xl border border-white/5"
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors rounded-xl">
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
              {teaserTitle}
            </h2>
            <p className="text-[#002d17]/60 mt-3 text-sm font-medium max-w-lg">
              {teaserDescription}
            </p>
          </div>
          <Link
            to={teaserLinkUrl}
            className="shrink-0 bg-[#002d17] text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            {teaserLinkLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
