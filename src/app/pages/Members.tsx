import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "../components/LocalizedLink";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,  ChevronRight,
  Linkedin,
  Shield,  X,
  type LucideIcon,
} from "lucide-react";
import {
  fetchCmsMembers,
  fetchCmsPageByTemplate,
  type MemberPost,
  type MembersCmsData,
} from "../lib/wordpress";
import { getCmsIcon } from "../lib/cmsIcons";
import { sitePath } from "../lib/siteLinks";

type CoreValue = {
  icon: LucideIcon;
  iconImage?: string;
  title: string;
  desc: string;
};

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
              <h2 className="font-bold text-white text-2xl uppercase tracking-tight leading-tight">{member.name}</h2>
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
    cmsMembers
  ), [cmsMembers]);

  const coreValues = useMemo<CoreValue[]>(() => {
    return (cmsPage?.values || []).map((value) => ({
      icon: getCmsIcon(value.icon, Shield),
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
  const teaserLinkUrl = cmsPage?.teaser?.linkUrl || sitePath("culture");

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="pt-8 pb-14 bg-[#f9f9f7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-[#002d17]/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to={sitePath("home")} className="text-[#002d17]/50 hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-[#002d17] uppercase tracking-tight leading-tight mb-4">
            {renderLines(heroTitle)}
          </h1>
          <p className="text-base font-medium max-w-xl text-[#002d17]/70">
            {heroDescription}
          </p>
        </div>
      </div>

      {/* BOD CARDS */}
      <div className="pb-14 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-0">
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
                  <h3 className="font-bold text-white text-xl uppercase tracking-tight leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                  <p className="text-white/50 text-xs uppercase tracking-widest">
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
      </div>

      {/* Leader Modal */}
      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal member={selectedLeader} onClose={() => setSelectedLeader(null)} />
        )}
      </AnimatePresence>

      {/* CORE VALUES */}
      <div className="bg-[#002d17] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
              {valuesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 hover:bg-[#46aa85] transition-colors p-8 flex flex-col gap-4 group rounded-2xl border border-white/5"
                >
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center group-hover:bg-[#f4aa1f] transition-colors rounded-xl">
                    {val.iconImage ? (
                      <img src={val.iconImage} alt="" className="h-6 w-6 object-contain" />
                    ) : (
                      <Icon size={20} className="text-[#f4aa1f] group-hover:text-[#002d17] transition-colors" />
                    )}
                  </div>
                  <h3 className="font-bold text-white text-base uppercase tracking-tight">{val.title}</h3>
                  <p className="text-white/50 text-[16px] leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MANAGEMENT TEAM TEASER */}
      <div className="py-12 bg-white border-t border-[#002d17]/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
            <h2 className="text-3xl font-bold text-[#002d17] uppercase tracking-tight">
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

