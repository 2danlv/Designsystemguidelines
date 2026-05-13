import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, MapPin, Phone, Mail, Facebook, Linkedin, Youtube, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import tonaLogo from "../../imports/TONA_-_LOGO.png";

// ─── NAV DATA ──────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "HOME", to: "/vi" },
  {
    label: "VỀ TONA",
    children: [
      { label: "Giới Thiệu", to: "/vi/gioi-thieu-tona" },
      { label: "Đội Ngũ", to: "/vi/doi-ngu" },
      { label: "Cuộc Sống Tona", to: "/vi/cuoc-song-tona" },
    ],
  },
  { label: "DỊCH VỤ", to: "/vi/dich-vu" },
  { label: "DỰ ÁN", to: "/vi/du-an-tona" },
  { label: "TIN TỨC", to: "/vi/news" },
  { label: "TUYỂN DỤNG", to: "/vi/nghe-nghiep" },
];

// ─── HEADER ────────────────────────────────────────────────────────────────────

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isCurrent = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#002d17]/98 backdrop-blur-sm" : "bg-[#002d17]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        {/* LOGO */}
        <Link
          to="/vi"
          className="flex items-center shrink-0"
          aria-label="Tona Corporation"
        >
          <div className="bg-white px-3 py-1.5 flex items-center justify-center">
            <img src={tonaLogo} alt="Tona Corporation" className="h-9 w-auto" />
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-white/80 hover:text-[#f4aa1f] font-semibold text-xs uppercase tracking-widest transition-colors">
                    {link.label}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        activeDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 min-w-[200px] bg-[#002d17] border-t-2 border-[#f4aa1f] transition-all duration-200 overflow-hidden rounded-b-xl ${
                      activeDropdown === link.label
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="block px-5 py-3 text-white/80 hover:text-[#f4aa1f] hover:bg-[#46aa85]/40 font-semibold text-xs uppercase tracking-wider border-b border-white/5 last:border-0 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to!}
                className={`px-4 py-2 font-semibold text-xs uppercase tracking-widest transition-colors ${
                  isCurrent(link.to!) && link.to !== "/vi"
                    ? "text-[#f4aa1f]"
                    : link.to === "/vi" && location.pathname === "/vi"
                    ? "text-[#f4aa1f]"
                    : "text-white/80 hover:text-[#f4aa1f]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Language + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language */}
          <div className="hidden lg:flex items-center border border-white/30 text-xs font-bold uppercase overflow-hidden">
            <button className="px-3 py-1.5 bg-[#f4aa1f] text-[#002d17] hover:bg-[#f4aa1f]/90 transition-colors">
              VI
            </button>
            <button className="px-3 py-1.5 text-white/60 hover:text-white hover:bg-[#46aa85] transition-colors rounded-lg">
              EN
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#002d17] border-t border-white/10 py-6 px-6 flex flex-col gap-1">
          {navLinks.map((link) => {
            if (link.children) {
              return (
                <div key={link.label} className="flex flex-col">
                  <span className="text-white/50 font-bold text-xs uppercase tracking-widest py-3 border-b border-white/10">
                    {link.label}
                  </span>
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="pl-4 py-2.5 text-white/80 hover:text-[#f4aa1f] font-semibold text-sm transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={link.to}
                to={link.to!}
                className="py-3 text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 hover:text-[#f4aa1f] transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-[#f4aa1f] text-[#002d17] font-bold text-xs uppercase">VI</button>
            <button className="px-4 py-2 border border-white/30 text-white/60 font-bold text-xs uppercase">EN</button>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#002d17] text-white">
      {/* Top CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">Bắt đầu dự án của bạn</p>
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              Hãy kết nối với Tona Corporation
            </h3>
          </div>
          <Link
            to="/vi/nghe-nghiep"
            className="shrink-0 bg-[#f4aa1f] text-[#002d17] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Liên Hệ Ngay
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Col 1: Brand */}
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white px-3 py-2 inline-flex items-center justify-center">
              <img src={tonaLogo} alt="Tona Corporation" className="h-10 w-auto" />
            </div>
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
            Nhà thầu xây dựng và MEP hàng đầu, cung cấp giải pháp xây dựng toàn diện đạt chuẩn quốc tế — từ thiết kế đến vận hành.
          </p>
          {/* Certs */}
          <div className="flex flex-wrap gap-2">
            {["ISO 9001", "ISO 45001", "ISO 14001"].map((cert) => (
              <span
                key={cert}
                className="border border-white/20 text-white/50 text-xs font-bold uppercase tracking-wider px-3 py-1.5"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* Col 2: About */}
        <div className="md:col-span-2">
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">About Tona</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "Giới Thiệu", to: "/vi/gioi-thieu-tona" },
              { label: "Đội Ngũ Lãnh Đạo", to: "/vi/doi-ngu" },
              { label: "Cuộc Sống Tona", to: "/vi/cuoc-song-tona" },
              { label: "Dịch Vụ", to: "/vi/dich-vu" },
              { label: "Tuyển Dụng", to: "/vi/nghe-nghiep" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-white/60 hover:text-[#f4aa1f] font-medium text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Projects */}
        <div className="md:col-span-2">
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">Dự Án</h4>
          <ul className="flex flex-col gap-3">
            {[
              "Industrial",
              "Commercial",
              "Solar Rooftop",
              "Hotels & Resorts",
              "Apartments",
            ].map((cat) => (
              <li key={cat}>
                <Link
                  to="/vi/du-an-tona"
                  className="text-white/60 hover:text-[#f4aa1f] font-medium text-sm transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="md:col-span-4">
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-[#f4aa1f] shrink-0 mt-0.5" />
              <span className="text-white/60 text-sm leading-relaxed">
                Toa nhà Tona, 123 Đường Xây Dựng<br />
                Quận 1, TP. Hồ Chí Minh, Việt Nam
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-[#f4aa1f] shrink-0" />
              <a href="tel:+84901234567" className="text-white/60 hover:text-white text-sm transition-colors">
                +84 (0)90 123 4567
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#f4aa1f] shrink-0" />
              <a href="mailto:info@tonacorp.vn" className="text-white/60 hover:text-white text-sm transition-colors">
                info@tonacorp.vn
              </a>
            </li>
          </ul>

          {/* Social */}
          <div className="flex gap-3 mt-8">
            {[
              { Icon: Facebook, label: "Facebook" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Youtube, label: "YouTube" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-[#f4aa1f] hover:text-[#f4aa1f] transition-colors"
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-medium">
          <span>© {new Date().getFullYear()} Tona Corporation. All Rights Reserved.</span>
          <div className="flex gap-5">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── LAYOUT ROOT ───────────────────────────────────────────────────────────────

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-[#002d17] antialiased">
      <Header />
      <main className="flex-1 flex flex-col w-full pt-[72px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}