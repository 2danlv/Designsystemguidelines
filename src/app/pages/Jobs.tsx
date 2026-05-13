import { useState } from "react";
import { jobs } from "../data";
import { Link } from "react-router";
import {
  MapPin, Clock, Briefcase, ChevronRight, ArrowRight,
  CheckCircle2, Star, Users, TrendingUp, ChevronDown, ChevronUp, X,
  GraduationCap, BookOpen, Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const departments = ["Tất Cả", "Kỹ Thuật Công Trường", "Kỹ Thuật MEP", "Kiểm Soát Chất Lượng", "Quản Lý Dự Án"];

const perks = [
  { icon: TrendingUp, title: "Lộ trình thăng tiến rõ ràng", desc: "Xét thăng tiến 6 tháng/lần theo năng lực thực tế, không phụ thuộc thâm niên." },
  { icon: Star, title: "Lương & thưởng hấp dẫn", desc: "Gói lương cạnh tranh thị trường, thưởng hoàn thành dự án và thưởng cuối năm." },
  { icon: Users, title: "Môi trường quốc tế", desc: "Làm việc cùng các chuyên gia và đối tác từ Singapore, Nhật Bản, Đức, Mỹ." },
  { icon: CheckCircle2, title: "Đào tạo chuyên sâu", desc: "TONA Academy: 50+ chương trình đào tạo kỹ thuật, quản lý và lãnh đạo." },
];

// ─── INTERN DATA ─────────────────────────────────────────────────────────────
const internPositions = [
  {
    id: "intern-civil",
    title: "Thực Tập Sinh Kỹ Thuật Xây Dựng",
    subtitle: "Civil Engineering Intern",
    department: "Kỹ Thuật Công Trường",
    duration: "3 — 6 tháng",
    slots: 5,
    icon: BookOpen,
    requirements: [
      "Sinh viên năm 3 — 4 chuyên ngành Xây dựng, Kỹ thuật Công trình hoặc tương đương",
      "GPA ≥ 2.5 (thang 4.0) hoặc học lực Khá trở lên",
      "Sẵn sàng đến công trường (Bình Dương / Đồng Nai)",
      "Có kiến thức cơ bản về AutoCAD là lợi thế",
    ],
    benefits: [
      "Phụ cấp thực tập hàng tháng",
      "Được hướng dẫn bởi kỹ sư senior",
      "Cơ hội nhận offer full-time sau tốt nghiệp",
      "Chứng nhận thực tập từ Tona Corporation",
      "Tham quan dự án thực tế hàng tuần",
    ],
    desc: "Tham gia trực tiếp vào các dự án thi công thực tế — từ đọc bản vẽ, theo dõi tiến độ đến lập báo cáo nghiệm thu dưới sự hướng dẫn của kỹ sư giàu kinh nghiệm.",
  },
  {
    id: "intern-mep",
    title: "Thực Tập Sinh Cơ Điện MEP",
    subtitle: "MEP Engineering Intern",
    department: "Kỹ Thuật MEP",
    duration: "3 — 6 tháng",
    slots: 4,
    icon: Lightbulb,
    requirements: [
      "Sinh viên năm 3 — 4 ngành Điện, Điện lạnh, Cơ khí, Kỹ thuật Môi trường",
      "Quan tâm đến hệ thống HVAC, điện, PCCC trong công trình công nghiệp",
      "Có khả năng đọc bản vẽ sơ đồ điện hoặc cơ bản về AutoCAD",
      "Tiếng Anh đọc hiểu tài liệu kỹ thuật là lợi thế",
    ],
    benefits: [
      "Phụ cấp thực tập hàng tháng",
      "Tiếp cận hệ thống MEP dự án thực tế",
      "Đào tạo về tiêu chuẩn ISO và quy trình QA/QC",
      "Chứng nhận thực tập từ Tona Corporation",
      "Mentor 1-on-1 với kỹ sư MEP senior",
    ],
    desc: "Hỗ trợ đội kỹ thuật MEP trong thiết kế, thi công và kiểm tra hệ thống điện, HVAC và PCCC tại các dự án nhà máy công nghệ cao và công trình thương mại.",
  },
  {
    id: "intern-pm",
    title: "Thực Tập Sinh Quản Lý Dự Án",
    subtitle: "Project Management Intern",
    department: "Quản Lý Dự Án",
    duration: "3 — 4 tháng",
    slots: 3,
    icon: GraduationCap,
    requirements: [
      "Sinh viên năm 3 — 4 ngành Quản lý Xây dựng, Kinh tế Xây dựng, Kỹ thuật Công trình",
      "Kỹ năng phân tích, tổng hợp thông tin tốt",
      "Thành thạo Microsoft Office (Word, Excel, PowerPoint)",
      "Giao tiếp tiếng Anh cơ bản là lợi thế",
    ],
    benefits: [
      "Phụ cấp thực tập hàng tháng",
      "Tham gia họp dự án thực tế cùng PM",
      "Cơ hội nhận offer junior PM sau tốt nghiệp",
      "Chứng nhận và thư giới thiệu từ Tona",
      "Học công cụ MS Project & quản lý tiến độ",
    ],
    desc: "Hỗ trợ đội quản lý dự án theo dõi tiến độ, lập báo cáo, điều phối thông tin giữa các bên và tham gia học hỏi quy trình quản lý EPC tại các công trình thực tế.",
  },
];

// ─── APPLY MODAL ─────────────────────────────────────────────────────────────
function ApplyModal({ job, onClose }: { job: typeof jobs[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#002d17]/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-[#002d17] px-6 py-5 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <p className="text-[#f4aa1f] text-xs font-bold uppercase tracking-widest mb-1">{job.department}</p>
            <h3 className="text-white font-extrabold text-lg uppercase tracking-tight">{job.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-[#f4aa1f] mt-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <p className="text-[#002d17]/60 text-sm font-medium leading-relaxed">
            Điền thông tin của bạn để ứng tuyển vị trí <strong className="text-[#002d17]">{job.title}</strong>. Chúng tôi sẽ liên hệ trong vòng 3 ngày làm việc.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { label: "Họ và Tên *", type: "text", placeholder: "Nguyễn Văn A" },
              { label: "Email *", type: "email", placeholder: "email@example.com" },
              { label: "Số Điện Thoại *", type: "tel", placeholder: "+84 9xx xxx xxx" },
              { label: "Năm Kinh Nghiệm", type: "text", placeholder: "VD: 3 năm" },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#f4aa1f] placeholder:text-[#002d17]/30 rounded-lg"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">Thư Tự Giới Thiệu</label>
              <textarea
                rows={3}
                placeholder="Giới thiệu ngắn về bản thân và lý do muốn gia nhập Tona..."
                className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#f4aa1f] placeholder:text-[#002d17]/30 resize-none rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">CV (PDF/DOCX)</label>
              <div className="border-2 border-dashed border-[#002d17]/20 hover:border-[#f4aa1f] transition-colors p-6 flex items-center justify-center cursor-pointer rounded-xl">
                <span className="text-[#002d17]/40 text-sm font-medium">Kéo thả file hoặc click để chọn</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#f4aa1f] text-[#002d17] py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors rounded-xl">
            Nộp Hồ Sơ Ứng Tuyển
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── INTERN APPLY MODAL ───────────────────────────────────────────────────────
function InternApplyModal({ pos, onClose }: { pos: typeof internPositions[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#002d17]/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#46aa85] px-6 py-5 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{pos.department} · Thực Tập Sinh</p>
            <h3 className="text-white font-extrabold text-lg uppercase tracking-tight">{pos.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white mt-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <p className="text-[#002d17]/60 text-sm font-medium leading-relaxed">
            Gửi thông tin để đăng ký thực tập tại Tona Corporation. Chúng tôi sẽ liên hệ trong vòng 5 ngày làm việc.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { label: "Họ và Tên *", type: "text", placeholder: "Nguyễn Văn A" },
              { label: "Email *", type: "email", placeholder: "email@example.com" },
              { label: "Số Điện Thoại *", type: "tel", placeholder: "+84 9xx xxx xxx" },
              { label: "Trường Đại Học *", type: "text", placeholder: "ĐH Bách Khoa TP.HCM" },
              { label: "Chuyên Ngành", type: "text", placeholder: "Kỹ thuật Xây dựng" },
              { label: "Năm Học", type: "text", placeholder: "Năm 3" },
            ].map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#46aa85] placeholder:text-[#002d17]/30 rounded-lg"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">Thời Gian Có Thể Bắt Đầu</label>
              <input
                type="text"
                placeholder="VD: Tháng 7/2026"
                className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#46aa85] placeholder:text-[#002d17]/30 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">CV / Transcript (PDF)</label>
              <div className="border-2 border-dashed border-[#002d17]/20 hover:border-[#46aa85] transition-colors p-6 flex items-center justify-center cursor-pointer rounded-xl">
                <span className="text-[#002d17]/40 text-sm font-medium">Kéo thả file hoặc click để chọn</span>
              </div>
            </div>
          </div>
          <button className="w-full bg-[#46aa85] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] transition-colors rounded-xl">
            Đăng Ký Thực Tập
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── JOB CARD ────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: typeof jobs[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);

  const levelColor = job.level.includes("Senior") || job.level.includes("Manager")
    ? "bg-[#002d17] text-[#f4aa1f]"
    : job.level.includes("Mid")
    ? "bg-[#d5ede5] text-[#1a6645]"
    : "bg-[#f4aa1f] text-[#002d17]";

  return (
    <>
      <AnimatePresence>
        {applying && <ApplyModal job={job} onClose={() => setApplying(false)} />}
      </AnimatePresence>

      <div className="border border-[#002d17]/10 bg-white hover:border-[#002d17]/30 transition-colors rounded-2xl overflow-hidden">
        {/* Card header — always visible */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex flex-col gap-3 flex-1">
              {/* Dept + level */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#f9f9f7] border border-[#002d17]/10 text-[#002d17]/60 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {job.department}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${levelColor}`}>
                  {job.level}
                </span>
                <span className="bg-white border border-[#f4aa1f] text-[#f4aa1f] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {job.slots} vị trí
                </span>
              </div>

              {/* Title */}
              <h3 className="font-extrabold text-[#002d17] text-xl md:text-2xl uppercase tracking-tight leading-snug">
                {job.title}
              </h3>

              {/* Meta row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                  <MapPin size={12} className="text-[#f4aa1f]" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                  <Briefcase size={12} className="text-[#f4aa1f]" /> {job.type}
                </span>
                <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                  <Clock size={12} className="text-[#f4aa1f]" /> {job.date}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5 text-[#46aa85] text-xs font-bold uppercase tracking-wider">
                    💰 {job.salary}
                  </span>
                )}
              </div>

              <p className="text-[#002d17]/60 text-sm leading-relaxed font-medium max-w-2xl">
                {job.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setApplying(true)}
                className="bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors whitespace-nowrap rounded-lg"
              >
                Ứng Tuyển Ngay
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="border border-[#002d17]/20 text-[#002d17] px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:border-[#002d17] transition-colors flex items-center gap-2 justify-center rounded-lg"
              >
                Chi tiết {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-[#002d17]/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Requirements */}
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#002d17]/10">
                  <h4 className="font-extrabold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> Yêu Cầu
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#002d17]/70 text-sm font-medium">
                        <CheckCircle2 size={14} className="text-[#46aa85] shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#002d17]/10">
                  <h4 className="font-extrabold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> Kỹ Năng
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-[#002d17] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="p-6 md:p-8">
                  <h4 className="font-extrabold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> Phúc Lợi
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {job.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#002d17]/70 text-sm font-medium">
                        <Star size={13} className="text-[#f4aa1f] shrink-0 mt-0.5" />
                        {ben}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── INTERN CARD ─────────────────────────────────────────────────────────────
function InternCard({ pos }: { pos: typeof internPositions[0] }) {
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const Icon = pos.icon;

  return (
    <>
      <AnimatePresence>
        {applying && <InternApplyModal pos={pos} onClose={() => setApplying(false)} />}
      </AnimatePresence>

      <div className="border border-[#46aa85]/20 bg-white hover:border-[#46aa85]/50 transition-colors rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#f0faf6] flex items-center justify-center">
                <Icon size={20} className="text-[#46aa85]" />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#f0faf6] text-[#46aa85] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {pos.department}
                  </span>
                  <span className="bg-[#d5ede5] text-[#1a6645] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {pos.slots} chỉ tiêu
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[#002d17] text-lg uppercase tracking-tight leading-snug">
                    {pos.title}
                  </h3>
                  <p className="text-[#46aa85] text-xs font-bold uppercase tracking-widest mt-0.5">{pos.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                    <Clock size={11} className="text-[#f4aa1f]" /> {pos.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={11} className="text-[#f4aa1f]" /> TP.HCM / Bình Dương
                  </span>
                </div>
                <p className="text-[#002d17]/60 text-sm leading-relaxed font-medium">
                  {pos.desc}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setApplying(true)}
                className="bg-[#46aa85] text-white px-5 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-[#002d17] transition-colors whitespace-nowrap rounded-lg"
              >
                Đăng Ký Thực Tập
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="border border-[#46aa85]/30 text-[#46aa85] px-5 py-2 font-bold uppercase tracking-widest text-xs hover:border-[#46aa85] transition-colors flex items-center gap-2 justify-center rounded-lg"
              >
                Chi tiết {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-[#46aa85]/15"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-6 border-b md:border-b-0 md:border-r border-[#46aa85]/15">
                  <h4 className="font-extrabold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#46aa85]" /> Yêu Cầu
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {pos.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#002d17]/70 text-sm font-medium">
                        <CheckCircle2 size={14} className="text-[#46aa85] shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6">
                  <h4 className="font-extrabold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#46aa85]" /> Quyền Lợi Thực Tập Sinh
                  </h4>
                  <ul className="flex flex-col gap-3">
                    {pos.benefits.map((ben, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#002d17]/70 text-sm font-medium">
                        <Star size={13} className="text-[#46aa85] shrink-0 mt-0.5" />
                        {ben}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export function Jobs() {
  const [activeDept, setActiveDept] = useState("Tất Cả");

  const filteredJobs = activeDept === "Tất Cả"
    ? jobs
    : jobs.filter((j) => j.department === activeDept);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HERO */}
      <div className="bg-[#002d17] pt-8 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to="/vi" className="hover:text-[#f4aa1f] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">Tuyển Dụng</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight mb-4">
            Gia Nhập<br />Đội Ngũ Tona
          </h1>
          <p className="text-white/50 text-base font-medium max-w-xl">
            Môi trường làm việc chuyên nghiệp, dự án đỉnh cao, cơ hội thăng tiến rõ ràng — Tona đang tìm kiếm những tài năng cùng chúng tôi kiến tạo công trình thế kỷ.
          </p>
        </div>
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-extrabold text-white/5 uppercase leading-none select-none">
          JOIN
        </div>
      </div>

      {/* WHY TONA */}
      <div className="bg-[#f9f9f7] border-b border-[#002d17]/10">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">Tại Sao Chọn Tona?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="flex flex-col gap-3 group bg-white rounded-2xl p-6 border border-[#002d17]/8">
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center rounded-xl">
                    <Icon size={20} className="text-[#f4aa1f]" />
                  </div>
                  <h3 className="font-extrabold text-[#002d17] uppercase text-sm tracking-tight">{perk.title}</h3>
                  <p className="text-[#002d17]/55 text-sm leading-relaxed font-medium">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* JOBS LIST */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header + filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h2 className="text-3xl font-extrabold text-[#002d17] uppercase tracking-tight">
              Vị Trí Đang Tuyển ({filteredJobs.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 font-bold uppercase tracking-widest text-xs transition-colors rounded-full ${
                  activeDept === dept
                    ? "bg-[#002d17] text-white"
                    : "border border-[#002d17]/20 text-[#002d17]/60 hover:border-[#002d17] hover:text-[#002d17]"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {filteredJobs.map((job, idx) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[#002d17]/40 font-bold uppercase tracking-widest text-sm">
                Không có vị trí nào trong bộ phận này.
              </p>
            </div>
          )}
        </div>

        {/* Spontaneous */}
        <div className="mt-12 bg-[#f9f9f7] border border-[#002d17]/10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">Không thấy vị trí phù hợp?</p>
            <h4 className="font-extrabold text-[#002d17] text-xl uppercase tracking-tight">Ứng Tuyển Tự Do</h4>
            <p className="text-[#002d17]/55 text-sm mt-2 font-medium max-w-md">
              Gửi hồ sơ của bạn cho chúng tôi — chúng tôi luôn tìm kiếm tài năng phù hợp với văn hóa Tona.
            </p>
          </div>
          <a
            href="mailto:hr@tonacorp.vn"
            className="shrink-0 flex items-center gap-2 bg-[#002d17] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            Gửi CV <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* ─── INTERN SECTION ──────────────────────────────────────────────────── */}
      <div className="bg-[#f0faf6] border-y border-[#46aa85]/20 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#46aa85] flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">Chương Trình Thực Tập</span>
              </div>
              <div className="w-12 h-0.5 bg-[#46aa85] mb-4" />
              <h2 className="text-3xl font-extrabold text-[#002d17] uppercase tracking-tight leading-tight">
                Sinh Viên Thực Tập<br />
                <span className="text-[#46aa85]">Tona Internship Program</span>
              </h2>
              <p className="text-[#002d17]/60 text-sm font-medium mt-3 max-w-lg leading-relaxed">
                Tona Corporation chào đón sinh viên năm 3 — 4 các ngành kỹ thuật tham gia chương trình thực tập thực tế tại công trường và văn phòng — nền tảng cho sự nghiệp xây dựng vững chắc.
              </p>
            </div>
            <div className="shrink-0 bg-white rounded-2xl px-6 py-5 border border-[#46aa85]/20 flex flex-col gap-3 min-w-[200px]">
              <p className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">Tuyển dụng 2025 — 2026</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[#002d17] font-extrabold text-2xl">12</span>
                  <span className="text-[#002d17]/50 text-xs font-bold uppercase tracking-widest">chỉ tiêu</span>
                </div>
                <div className="w-px bg-[#002d17]/10" />
                <div className="flex flex-col">
                  <span className="text-[#002d17] font-extrabold text-2xl">3</span>
                  <span className="text-[#002d17]/50 text-xs font-bold uppercase tracking-widest">chuyên ngành</span>
                </div>
              </div>
              <div className="text-[#002d17]/50 text-xs font-medium leading-relaxed">
                Nhận hồ sơ liên tục. Phỏng vấn rolling.
              </div>
            </div>
          </div>

          {/* Intern cards */}
          <div className="flex flex-col gap-4">
            {internPositions.map((pos, idx) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <InternCard pos={pos} />
              </motion.div>
            ))}
          </div>

          {/* Intern CTA note */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-[#46aa85]/20 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f0faf6] flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-[#46aa85]" />
              </div>
              <div>
                <p className="font-extrabold text-[#002d17] text-sm uppercase tracking-tight">Ký Kết Hợp Tác Với Trường Đại Học</p>
                <p className="text-[#002d17]/55 text-sm font-medium mt-1 max-w-md">
                  Tona Corporation hợp tác với ĐH Bách Khoa TP.HCM, ĐH Xây dựng Hà Nội và nhiều trường kỹ thuật. Sinh viên có thể đăng ký qua Phòng Quan hệ Doanh nghiệp của trường hoặc liên hệ trực tiếp Tona.
                </p>
              </div>
            </div>
            <a
              href="mailto:internship@tonacorp.vn"
              className="shrink-0 flex items-center gap-2 bg-[#46aa85] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] transition-colors rounded-lg"
            >
              Email Thực Tập <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* CULTURE TEASER */}
      <div className="bg-[#002d17] py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">
              Trải Nghiệm Văn Hóa Tona
            </h3>
            <p className="text-white/50 mt-2 text-sm">Khám phá những gì làm nên sự khác biệt khi làm việc tại Tona.</p>
          </div>
          <Link
            to="/vi/cuoc-song-tona"
            className="shrink-0 flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
          >
            Cuộc Sống Tona <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
