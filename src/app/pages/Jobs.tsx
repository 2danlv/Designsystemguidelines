import { useState, type FormEvent } from "react";
import { Link } from "../components/LocalizedLink";
import {
  MapPin, Clock, Briefcase, ChevronRight, ArrowRight, CheckCircle2, Star, ChevronDown, ChevronUp, X,
  GraduationCap, BookOpen, FileText, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { submitCmsApplication, type JobPost, type JobsCmsData } from "../lib/wordpress";
import { useJobsPage, type InternPosition } from "../cms/useJobsPage";
import { useSiteText } from "../context/SiteSettingsContext";
import { sitePath } from "../lib/siteLinks";
import { CmsLoading } from "../components/CmsLoading";

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

function isBrokenCmsText(value?: string) {
  return !!value && (/[\uFFFD\u00EF\u00BF]/.test(value) || /\w\?\w/.test(value) || /\?\?/.test(value));
}

function cmsText(value: string | undefined) {
  return value && !isBrokenCmsText(value) ? value : "";
}


// APPLY MODAL
function ApplyModal({ job, onClose, content }: { job: JobPost; onClose: () => void; content?: JobsCmsData["applicationModal"] }) {
  const text = useSiteText();
  const initialFormData = { name: "", email: "", phone: "", experience: "", message: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const fields = [
    { name: "name" as const, label: cmsText(content?.nameLabel), type: "text", placeholder: cmsText(content?.namePlaceholder), required: true },
    { name: "email" as const, label: cmsText(content?.emailLabel), type: "email", placeholder: cmsText(content?.emailPlaceholder), required: true },
    { name: "phone" as const, label: cmsText(content?.phoneLabel), type: "tel", placeholder: cmsText(content?.phonePlaceholder), required: true },
    { name: "experience" as const, label: cmsText(content?.experienceLabel), type: "text", placeholder: cmsText(content?.experiencePlaceholder), required: false },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    const ok = await submitCmsApplication({
      type: "Job",
      position: job.title,
      ...formData,
      cvFile,
    });

    setStatus(ok ? "success" : "error");
    if (ok) {
      setFormData(initialFormData);
      setCvFile(null);
      form.reset();
    }
  };

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
        <div className="bg-[#002d17] px-6 py-5 flex items-start justify-between gap-4 rounded-t-2xl">
          <div>
            <p className="text-[#f4aa1f] text-xs font-bold uppercase tracking-widest mb-1">{job.department}</p>
            <h3 className="text-white font-bold text-lg uppercase tracking-tight">{job.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-[#f4aa1f] mt-1 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form className="p-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <p className="text-[#002d17]/60 text-sm font-medium leading-relaxed">
            {cmsText(content?.description)}
          </p>

          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={(event) => setFormData((current) => ({ ...current, [field.name]: event.target.value }))}
                  className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#f4aa1f] placeholder:text-[#002d17]/30 rounded-lg"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{cmsText(content?.coverLetterLabel)}</label>
              <textarea
                rows={3}
                placeholder={cmsText(content?.coverLetterPlaceholder)}
                value={formData.message}
                onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#f4aa1f] placeholder:text-[#002d17]/30 resize-none rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{cmsText(content?.cvLabel)}</label>
              <div className="border-2 border-dashed border-[#002d17]/20 hover:border-[#f4aa1f] transition-colors p-4 flex flex-col gap-2 rounded-xl">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-[#002d17]/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#f4aa1f] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-[#002d17] hover:file:bg-[#002d17] hover:file:text-[#f4aa1f]"
                  onChange={(event) => setCvFile(event.target.files?.[0] || null)}
                />
                <span className="text-[#002d17]/40 text-sm font-medium">
                  {cvFile?.name || cmsText(content?.cvHelpText)}
                </span>
              </div>
            </div>
          </div>

          {status === "success" && <p className="text-[#1a6645] text-sm font-bold">{text("jobs.form.success")}</p>}
          {status === "error" && <p className="text-red-600 text-sm font-bold">{text("jobs.form.error")}</p>}
          <button disabled={status === "submitting"} className="w-full bg-[#f4aa1f] text-[#002d17] py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors rounded-xl disabled:opacity-60">
            {status === "submitting" ? text("jobs.form.submitting") : cmsText(content?.submitLabel)}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// INTERN APPLY MODAL
function InternApplyModal({ pos, onClose, content }: { pos: InternPosition; onClose: () => void; content?: JobsCmsData["applicationModal"] }) {
  const text = useSiteText();
  const initialFormData = { name: "", email: "", phone: "", university: "", major: "", schoolYear: "", startDate: "" };
  const [formData, setFormData] = useState(initialFormData);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const fields = [
    { name: "name" as const, label: cmsText(content?.nameLabel), type: "text", placeholder: cmsText(content?.namePlaceholder), required: true },
    { name: "email" as const, label: cmsText(content?.emailLabel), type: "email", placeholder: cmsText(content?.emailPlaceholder), required: true },
    { name: "phone" as const, label: cmsText(content?.phoneLabel), type: "tel", placeholder: cmsText(content?.phonePlaceholder), required: true },
    { name: "university" as const, label: cmsText(content?.universityLabel), type: "text", placeholder: cmsText(content?.universityPlaceholder), required: true },
    { name: "major" as const, label: cmsText(content?.majorLabel), type: "text", placeholder: cmsText(content?.majorPlaceholder), required: false },
    { name: "schoolYear" as const, label: cmsText(content?.schoolYearLabel), type: "text", placeholder: cmsText(content?.schoolYearPlaceholder), required: false },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    const ok = await submitCmsApplication({
      type: "Internship",
      position: pos.title,
      ...formData,
      cvFile,
    });

    setStatus(ok ? "success" : "error");
    if (ok) {
      setFormData(initialFormData);
      setCvFile(null);
      form.reset();
    }
  };

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
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{pos.department} - {cmsText(content?.internTypeLabel)}</p>
            <h3 className="text-white font-bold text-lg uppercase tracking-tight">{pos.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white mt-1 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form className="p-6 flex flex-col gap-5" onSubmit={handleSubmit}>
          <p className="text-[#002d17]/60 text-sm font-medium leading-relaxed">
            {cmsText(content?.internDescription)}
          </p>
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={(event) => setFormData((current) => ({ ...current, [field.name]: event.target.value }))}
                  className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#46aa85] placeholder:text-[#002d17]/30 rounded-lg"
                />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{cmsText(content?.startDateLabel)}</label>
              <input
                type="text"
                placeholder={cmsText(content?.startDatePlaceholder)}
                value={formData.startDate}
                onChange={(event) => setFormData((current) => ({ ...current, startDate: event.target.value }))}
                className="border border-[#002d17]/20 px-4 py-2.5 text-[#002d17] text-sm font-medium focus:outline-none focus:border-[#46aa85] placeholder:text-[#002d17]/30 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-[#002d17]/60">{cmsText(content?.internCvLabel)}</label>
              <div className="border-2 border-dashed border-[#002d17]/20 hover:border-[#46aa85] transition-colors p-4 flex flex-col gap-2 rounded-xl">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-[#002d17]/70 file:mr-4 file:rounded-lg file:border-0 file:bg-[#46aa85] file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-[#002d17]"
                  onChange={(event) => setCvFile(event.target.files?.[0] || null)}
                />
                <span className="text-[#002d17]/40 text-sm font-medium">
                  {cvFile?.name || cmsText(content?.internCvHelpText)}
                </span>
              </div>
            </div>
          </div>
          {status === "success" && <p className="text-[#1a6645] text-sm font-bold">{text("jobs.form.success")}</p>}
          {status === "error" && <p className="text-red-600 text-sm font-bold">{text("jobs.form.error")}</p>}
          <button disabled={status === "submitting"} className="w-full bg-[#46aa85] text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] transition-colors rounded-xl disabled:opacity-60">
            {status === "submitting" ? text("jobs.form.submitting") : cmsText(content?.internSubmitLabel)}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// JOB CARD
function JobCard({ job, applicationModal }: { job: JobPost; applicationModal?: JobsCmsData["applicationModal"] }) {
  const text = useSiteText();
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const levelColor = job.level.includes("Senior") || job.level.includes("Manager")
    ? "bg-[#002d17] text-[#f4aa1f]"
    : job.level.includes("Mid")
    ? "bg-[#d5ede5] text-[#1a6645]"
    : "bg-[#f4aa1f] text-[#002d17]";

  return (
    <>
      <AnimatePresence>
        {applying && <ApplyModal job={job} content={applicationModal} onClose={() => setApplying(false)} />}
      </AnimatePresence>

      <div className="border border-[#002d17]/10 bg-white hover:border-[#002d17]/30 transition-colors rounded-2xl overflow-hidden">
        {/* Card header - always visible */}
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
                  {job.slots} {text("jobs.slots_suffix")}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-[#002d17] text-xl md:text-2xl uppercase tracking-tight leading-snug">
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
                    {text("jobs.salary")}: {job.salary}
                  </span>
                )}
              </div>

              <p className="text-[#002d17]/60 text-[16px] leading-relaxed font-medium max-w-2xl">
                {job.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setApplying(true)}
                className="bg-[#f4aa1f] cursor-pointer text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-[#002d17] hover:text-[#f4aa1f] transition-colors whitespace-nowrap rounded-lg"
              >
                {text("jobs.apply_now")}
              </button>
              {job.jdUrl?.trim() && (
                <a
                  href={job.jdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border cursor-pointer border-[#002d17]/20 text-[#002d17] px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:border-[#002d17] transition-colors flex items-center gap-2 justify-center rounded-lg"
                >
                  <FileText size={12} /> {text("jobs.view_jd")}
                </a>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="border cursor-pointer border-[#002d17]/20 text-[#002d17] px-6 py-2.5 font-bold uppercase tracking-widest text-xs hover:border-[#002d17] transition-colors flex items-center gap-2 justify-center rounded-lg"
              >
                {text("jobs.detail")} {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
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
                  <h4 className="font-bold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> {text("jobs.requirements")}
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
                  <h4 className="font-bold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> {text("jobs.skills")}
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
                  <h4 className="font-bold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#f4aa1f]" /> {text("jobs.benefits")}
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

// INTERN CARD
function InternCard({ pos, applicationModal }: { pos: InternPosition; applicationModal?: JobsCmsData["applicationModal"] }) {
  const text = useSiteText();
  const [expanded, setExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const Icon = pos.icon;

  return (
    <>
      <AnimatePresence>
        {applying && <InternApplyModal pos={pos} content={applicationModal} onClose={() => setApplying(false)} />}
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
                    {pos.slots} {text("jobs.slots_suffix")}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[#002d17] text-lg uppercase tracking-tight leading-snug">
                    {pos.title}
                  </h3>
                  <p className="text-[#46aa85] text-xs font-bold uppercase tracking-widest mt-0.5">{pos.subtitle}</p>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                    <Clock size={11} className="text-[#f4aa1f]" /> {pos.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#002d17]/50 text-xs font-bold uppercase tracking-wider">
                    <MapPin size={11} className="text-[#f4aa1f]" /> {pos.location}
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
                className="bg-[#46aa85] cursor-pointer text-white px-5 py-2.5 font-bold uppercase tracking-widest text-xs hover:bg-[#002d17] transition-colors whitespace-nowrap rounded-lg"
              >
                {text("jobs.apply_now")}
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="border cursor-pointer border-[#46aa85]/30 text-[#46aa85] px-5 py-2 font-bold uppercase tracking-widest text-xs hover:border-[#46aa85] transition-colors flex items-center gap-2 justify-center rounded-lg"
              >
                {text("jobs.detail")} {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
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
                  <h4 className="font-bold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#46aa85]" /> {text("jobs.requirements")}
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
                  <h4 className="font-bold text-[#002d17] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#46aa85]" /> {text("jobs.benefits")}
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

// MAIN
export function Jobs() {
  const text = useSiteText();
  const [openApplication, setOpenApplication] = useState(false);
  const {
    activeDept,
    setActiveDept,
    departments,
    filteredJobs,
    perks,
    internPositions,
    colors,
    breadcrumbLabel,
    heroTitle,
    heroDescription,
    heroDecorativeText,
    perksEyebrow,
    jobsTitle,
    emptyJobsText,
    spontaneous,
    interns,
    cultureTeaser,
    applicationModal,
    loaded,
  } = useJobsPage();
  const openApplicationJob: JobPost = {
    id: "open-application",
    title: spontaneous?.title || "",
    department: spontaneous?.eyebrow || "",
    location: "",
    type: "Job",
    level: "",
    date: "",
    slots: 1,
    description: spontaneous?.description || "",
    requirements: [],
    skills: [],
    benefits: [],
  };

  if (!loaded) {
    return <CmsLoading />;
  }

  return (
    <div className="w-full bg-white min-h-screen">
      <AnimatePresence>
        {openApplication && (
          <ApplyModal
            job={openApplicationJob}
            content={applicationModal}
            onClose={() => setOpenApplication(false)}
          />
        )}
      </AnimatePresence>

      {/* HERO */}
      <div
        className="pt-8 pb-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #12573d 0%, #0d4530 50%, ${colors?.heroBackground || "#002d17"} 100%)`,
        }}
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#f4aa1f 1px, transparent 1px), linear-gradient(90deg, #f4aa1f 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-8">
            <Link to={sitePath("home")} className="hover:text-[#f4aa1f] transition-colors">{text("common.home")}</Link>
            <ChevronRight size={12} />
            <span className="text-[#f4aa1f]">{breadcrumbLabel}</span>
          </div>
          <div className="w-16 h-1 bg-[#f4aa1f] mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight leading-tight mb-4">
            {renderLines(heroTitle)}
          </h1>
          <p className="text-white/70 text-base font-medium max-w-xl">
            {heroDescription}
          </p>
        </div>
        <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-bold text-white/[0.04] uppercase leading-none select-none">
          {heroDecorativeText}
        </div>
      </div>
 
      {/* WHY TONA — gradient bridge */}
      <div
        style={{
          background: `linear-gradient(to bottom, ${colors?.heroBackground || "#002d17"}, ${colors?.perksBackground || "#f9f9f7"})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-[#f4aa1f] font-bold text-[13px] uppercase tracking-widest mb-6">{perksEyebrow}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="flex flex-col gap-3 group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
                  <div className="w-12 h-12 border-2 border-[#f4aa1f] flex items-center justify-center rounded-xl">
                    {perk.iconImage ? (
                      <img src={perk.iconImage} alt="" className="w-5 h-5 object-contain" aria-hidden="true" />
                    ) : Icon ? (
                      <Icon size={20} className="text-[#f4aa1f]" />
                    ) : null}
                  </div>
                  <h3 className="font-bold text-[#002d17] uppercase text-[18px] tracking-tight">{perk.title}</h3>
                  <p className="text-[#002d17]/55 text-[16px] leading-relaxed font-medium">{perk.desc}</p>
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
            <h2 className="text-3xl font-bold text-[#002d17] uppercase tracking-tight">
              {jobsTitle} ({filteredJobs.length})
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
              <JobCard job={job} applicationModal={applicationModal} />
            </motion.div>
          ))}
          {filteredJobs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-[#002d17]/40 font-bold uppercase tracking-widest text-sm">
                {emptyJobsText}
              </p>
            </div>
          )}
        </div>

        {/* Spontaneous */}
        <div className="mt-12 bg-[#f9f9f7] border border-[#002d17]/10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">{spontaneous?.eyebrow || ""}</p>
            <h4 className="font-bold text-[#002d17] text-xl uppercase tracking-tight">{spontaneous?.title || ""}</h4>
            <p className="text-[#002d17]/55 text-sm mt-2 font-medium max-w-md">
              {spontaneous?.description || ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpenApplication(true)}
            className="shrink-0 flex items-center gap-2 bg-[#002d17] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#46aa85] transition-colors rounded-lg"
          >
            {spontaneous?.linkLabel || ""} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* INTERN SECTION */}
      <div className="bg-[#f0faf6] border-y border-[#46aa85]/20 py-16" style={backgroundStyle(colors?.internsBackground)}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#46aa85] flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">{interns?.eyebrow || ""}</span>
              </div>
              <div className="w-12 h-0.5 bg-[#46aa85] mb-4" />
              <h2 className="text-3xl font-bold text-[#002d17] uppercase tracking-tight leading-tight">
                {renderLines(interns?.title || "")}
              </h2>
              <p className="text-[#002d17]/60 text-sm font-medium mt-3 max-w-lg leading-relaxed">
                {interns?.description || ""}
              </p>
            </div>
            <div className="shrink-0 bg-white rounded-2xl px-6 py-5 border border-[#46aa85]/20 flex flex-col gap-3 min-w-[200px]">
              <p className="text-[#46aa85] font-bold text-xs uppercase tracking-widest">{interns?.seasonLabel || ""}</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[#002d17] font-bold text-2xl">{interns?.slotsValue || ""}</span>
                  <span className="text-[#002d17]/50 text-xs font-bold uppercase tracking-widest">{interns?.slotsLabel || ""}</span>
                </div>
                <div className="w-px bg-[#002d17]/10" />
                <div className="flex flex-col">
                  <span className="text-[#002d17] font-bold text-2xl">{interns?.majorsValue || ""}</span>
                  <span className="text-[#002d17]/50 text-xs font-bold uppercase tracking-widest">{interns?.majorsLabel || ""}</span>
                </div>
              </div>
              <div className="text-[#002d17]/50 text-xs font-medium leading-relaxed">
                {interns?.note || ""}
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
                <InternCard pos={pos} applicationModal={applicationModal} />
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
                <p className="font-bold text-[#002d17] text-sm uppercase tracking-tight">{interns?.ctaTitle || ""}</p>
                <p className="text-[#002d17]/55 text-sm font-medium mt-1 max-w-md">
                  {interns?.ctaDescription || ""}
                </p>
              </div>
            </div>
            <a
              href={interns?.ctaLinkUrl || ""}
              className="shrink-0 flex items-center gap-2 bg-[#46aa85] text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#002d17] transition-colors rounded-lg"
            >
              {interns?.ctaLinkLabel || ""} <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* CULTURE TEASER */}
      <div className="bg-[#002d17] py-14" style={backgroundStyle(colors?.cultureBackground)}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="w-16 h-1 bg-[#f4aa1f] mb-4" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
              {cultureTeaser?.title || ""}
            </h3>
            <p className="text-white/50 mt-2 text-sm">{cultureTeaser?.description || ""}</p>
          </div>
          <Link
            to={cultureTeaser?.linkUrl || ""}
            className="shrink-0 flex items-center gap-2 bg-[#f4aa1f] text-[#002d17] px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
          >
            {cultureTeaser?.linkLabel || ""} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}



