import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "../components/LocalizedLink";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Award,
  ChevronRight,
  Linkedin,
  Shield,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  fetchCmsMembers,
  fetchCmsPageByTemplate,
  type MemberPost,
  type MembersCmsData,
} from "../lib/wordpress";

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

const fallbackMembers: MemberPost[] = [
  {
    id: "chairman",
    name: "Nguyễn Trọng Khải",
    role: "Chủ Tịch HĐQT",
    roleEn: "Chairman of the Board",
    image: "https://images.unsplash.com/photo-1720501828093-c792c10e3f0b?w=800&q=80",
    bio: "Hơn 25 năm kinh nghiệm trong lĩnh vực xây dựng công nghiệp và thương mại. Người sáng lập Tona Corporation với tầm nhìn kiến tạo chuẩn mực mới trong ngành xây dựng Việt Nam.",
    linkedin: "#",
    since: "2009",
    education: "Đại học Xây dựng Hà Nội - Kỹ sư Xây dựng dân dụng & công nghiệp",
    expertise: ["Quản trị chiến lược", "Phát triển thị trường", "Tài chính doanh nghiệp", "Xây dựng công nghiệp"],
    achievements: [
      "Sáng lập Tona Corporation từ đội ngũ 15 kỹ sư ban đầu năm 2009",
      "Xây dựng mạng lưới đối tác quốc tế tại Việt Nam",
      "Dẫn dắt Tona vào nhóm nhà thầu MEP uy tín tại miền Nam",
    ],
    quote: "Tona được xây dựng trên nền tảng tin tưởng từ khách hàng, đội ngũ và chính mỗi người trong hành trình này.",
  },
  {
    id: "ceo",
    name: "Trần Minh Đức",
    role: "Tổng Giám Đốc",
    roleEn: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1774599730788-a74cd9253b56?w=800&q=80",
    bio: "18 năm kinh nghiệm quản lý dự án EPC quy mô lớn cho các tập đoàn đa quốc gia. Chuyên gia về quản trị rủi ro và tối ưu chuỗi cung ứng xây dựng.",
    linkedin: "#",
    since: "2012",
    education: "MBA - Singapore Management University; Kỹ sư Xây dựng - ĐH Bách Khoa TP.HCM",
    expertise: ["Quản lý EPC", "Quản trị rủi ro", "Tối ưu chuỗi cung ứng", "Phát triển tổ chức"],
    achievements: [
      "Triển khai thành công hơn 200 dự án EPC",
      "Xây dựng hệ thống quản lý dự án đạt chuẩn ISO",
      "Mở rộng năng lực MEP vào phân khúc cleanroom và high-tech factory",
    ],
    quote: "Mỗi dự án là một cam kết về chất lượng, tiến độ và sự an toàn tuyệt đối.",
  },
  {
    id: "coo",
    name: "Lê Thị Hương",
    role: "Giám Đốc Vận Hành",
    roleEn: "Chief Operating Officer",
    image: "https://images.unsplash.com/photo-1758691737605-69a0e78bd193?w=800&q=80",
    bio: "15 năm kinh nghiệm điều hành vận hành đa dự án đồng thời. Chuyên gia triển khai hệ thống quản lý chất lượng ISO và an toàn lao động.",
    linkedin: "#",
    since: "2014",
    education: "Kỹ sư Cơ khí - ĐH Bách Khoa TP.HCM; Chứng chỉ ISO 45001 Lead Auditor",
    expertise: ["Quản lý vận hành", "QHSE", "Tối ưu quy trình", "HSE Management"],
    achievements: [
      "Triển khai hệ thống HSE hướng đến Zero Accident",
      "Đạt chứng nhận ISO 45001 cho toàn hệ thống",
      "Đưa TONA Academy phục vụ đào tạo nội bộ thường niên",
    ],
    quote: "An toàn không phải là chi phí, an toàn là đầu tư.",
  },
  {
    id: "cdo",
    name: "Phạm Văn Hải",
    role: "Giám Đốc Dự Án",
    roleEn: "Chief Project Director",
    image: "https://images.unsplash.com/photo-1758518726775-70e538b0d46e?w=800&q=80",
    bio: "20 năm chỉ huy các dự án nhà máy công nghệ cao. Người dẫn dắt thành công nhiều dự án công nghiệp trên khắp cả nước.",
    linkedin: "#",
    since: "2010",
    education: "Kỹ sư Xây dựng - ĐH Bách Khoa TP.HCM; PMP Certified",
    expertise: ["Quản lý dự án", "Kết cấu thép", "Cleanroom Construction", "BIM Technology"],
    achievements: [
      "Chỉ huy hơn 200 dự án nhà máy công nghệ cao",
      "Dẫn dắt dự án cleanroom ISO 6 tại miền Nam",
      "Triển khai BIM trong các dự án công nghiệp trọng điểm",
    ],
    quote: "Kỹ thuật giỏi cần đi cùng kỷ luật, phối hợp tốt và hiểu sâu về khách hàng.",
  },
];

const fallbackCoreValues: CoreValue[] = [
  { icon: Shield, title: "An Toàn Trên Hết", desc: "Zero accident là kim chỉ nam trong mọi quyết định và hành động tại Tona." },
  { icon: Award, title: "Chất Lượng Không Thỏa Hiệp", desc: "Từng chi tiết đều được kiểm soát theo tiêu chuẩn ISO quốc tế." },
  { icon: TrendingUp, title: "Hiệu Quả & Tiến Độ", desc: "Cam kết bàn giao đúng hạn, hạn chế phát sinh và kiểm soát chặt chẽ chi phí." },
  { icon: Users, title: "Con Người Là Nền Tảng", desc: "Đội ngũ được đào tạo bài bản và gắn kết trong một văn hóa doanh nghiệp mạnh mẽ." },
];

function renderLines(text: string) {
  return text.replace(/\r\n/g, "\n").split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function OptionalBlock({ children, show }: { children: ReactNode; show: boolean }) {
  return show ? <>{children}</> : null;
}

function LeaderModal({ member, onClose }: { member: MemberPost; onClose: () => void }) {
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
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-48 bg-[#002d17] overflow-hidden">
          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002d17]/90 to-[#002d17]/40" />
          <div className="absolute inset-0 flex items-end px-8 pb-6 gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#f4aa1f] shrink-0 bg-[#d5ede5]">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <div className="w-8 h-0.5 bg-[#f4aa1f] mb-2" />
              <h2 className="font-extrabold text-white text-2xl uppercase tracking-tight leading-tight">{member.name}</h2>
              <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">{member.role}</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">
                {member.roleEn}{member.since ? ` · Tại Tona từ ${member.since}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-[#002d17]/70 hover:bg-[#f4aa1f] flex items-center justify-center text-white hover:text-[#002d17] transition-colors rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <OptionalBlock show={Boolean(member.education)}>
            <div className="bg-[#f9f9f7] rounded-xl px-5 py-4">
              <p className="text-[#f4aa1f] font-bold text-[10px] uppercase tracking-widest mb-1">Học Vấn & Chứng Chỉ</p>
              <p className="text-[#002d17] font-semibold text-sm">{member.education}</p>
            </div>
          </OptionalBlock>

          <p className="text-[#002d17]/70 text-sm leading-relaxed font-medium">{member.bio}</p>

          <OptionalBlock show={Boolean(member.expertise?.length)}>
            <div>
              <p className="text-[#002d17] font-bold text-xs uppercase tracking-widest mb-3">Chuyên Môn</p>
              <div className="flex flex-wrap gap-2">
                {member.expertise?.map((item) => (
                  <span key={item} className="bg-[#f0faf6] text-[#1a6645] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </OptionalBlock>

          <OptionalBlock show={Boolean(member.achievements?.length)}>
            <div>
              <p className="text-[#002d17] font-bold text-xs uppercase tracking-widest mb-3">Thành Tựu Nổi Bật</p>
              <ul className="flex flex-col gap-2.5">
                {member.achievements?.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-start gap-3 text-[#002d17]/70 text-sm font-medium">
                    <ArrowRight size={13} className="text-[#f4aa1f] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </OptionalBlock>

          <OptionalBlock show={Boolean(member.quote)}>
            <blockquote className="border-l-4 border-[#f4aa1f] pl-5 py-2 bg-[#fffdf5] rounded-r-xl">
              <p className="text-[#002d17] font-semibold italic text-sm leading-relaxed">"{member.quote}"</p>
              <cite className="block mt-2 text-[#f4aa1f] font-bold text-xs uppercase tracking-widest not-italic">
                - {member.name}
              </cite>
            </blockquote>
          </OptionalBlock>

          <div className="flex justify-end pt-2">
            <a
              href={member.linkedin || "#"}
              onClick={(event) => {
                if (!member.linkedin || member.linkedin === "#") {
                  event.preventDefault();
                }
              }}
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
  const [cmsMembers, setCmsMembers] = useState<MemberPost[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<MemberPost | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchCmsPageByTemplate<MembersCmsData>("tona-members", controller.signal),
      fetchCmsMembers(controller.signal),
    ]).then(([page, members]) => {
      setCmsPage(page);
      setCmsMembers(members);
    });

    return () => controller.abort();
  }, []);

  const members = useMemo<MemberPost[]>(() => (
    cmsMembers.length ? cmsMembers : fallbackMembers
  ), [cmsMembers]);

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
  const teaserDescription = cmsPage?.teaser?.description || "Phía sau Ban lãnh đạo là đội ngũ kỹ sư, chuyên gia và công nhân lành nghề, những người trực tiếp kiến tạo nên mỗi công trình của Tona.";
  const teaserLinkLabel = cmsPage?.teaser?.linkLabel || "Khám Phá Cuộc Sống Tona";
  const teaserLinkUrl = cmsPage?.teaser?.linkUrl || "/vi/cuoc-song-tona";

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="bg-[#002d17] pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi/" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
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

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col cursor-pointer"
              onClick={() => setSelectedLeader(member)}
            >
              <div className="relative overflow-hidden bg-[#002d17] rounded-t-2xl">
                <div className="aspect-[3/4] overflow-hidden bg-[#d5ede5]">
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
                <div className="absolute inset-0 bg-[#002d17]/0 group-hover:bg-[#002d17]/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#f4aa1f] text-[#002d17] px-4 py-2 font-bold text-xs uppercase tracking-widest rounded-lg">
                    Xem Hồ Sơ
                  </div>
                </div>
                <a
                  href={member.linkedin || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-4 right-4 w-9 h-9 bg-[#002d17]/70 hover:bg-[#f4aa1f] flex items-center justify-center text-white hover:text-[#002d17] transition-colors opacity-0 group-hover:opacity-100 rounded-lg z-10"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (!member.linkedin || member.linkedin === "#") {
                      event.preventDefault();
                    }
                  }}
                >
                  <Linkedin size={15} />
                </a>
              </div>

              <div className="bg-[#f9f9f7] px-5 py-5 flex-1 border-b-2 border-transparent group-hover:border-[#f4aa1f] transition-colors rounded-b-2xl">
                <p className="text-[#002d17]/70 text-sm leading-relaxed font-medium line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal member={selectedLeader} onClose={() => setSelectedLeader(null)} />
        )}
      </AnimatePresence>

      <div className="bg-[#002d17] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
              {valuesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={`${value.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 hover:bg-[#46aa85] transition-colors p-8 flex flex-col gap-4 group rounded-2xl border border-white/5"
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors rounded-xl">
                    {value.iconImage ? (
                      <img src={value.iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden />
                    ) : (
                      <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-white text-base uppercase tracking-tight">{value.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

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
