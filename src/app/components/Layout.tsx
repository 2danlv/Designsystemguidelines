import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, MapPin, Phone, Mail, Facebook, Linkedin, Youtube, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type React from "react";
import tonaLogo from "../../imports/TONA_-_LOGO.png";
import { fetchCmsRoute, fetchCmsSettings, getCurrentLanguage, localizeUrl, type CmsRouteMatch, type SiteLink, type SiteMenuItem, type SiteSettings } from "../lib/wordpress";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";

// NAV DATA

const fallbackNavLinks: SiteMenuItem[] = [
  { label: "HOME", url: "/" },
  {
    label: "VỀ TONA",
    children: [
      { label: "Giới Thiệu", url: "/gioi-thieu-tona" },
      { label: "Đội Ngũ", url: "/doi-ngu" },
      { label: "Cuộc Sống Tona", url: "/cuoc-song-tona" },
      { label: "Trách Nhiệm Cộng Đồng", url: "/trach-nhiem-cong-dong" },
    ],
  },
  { label: "DỊCH VỤ", url: "/dich-vu" },
  { label: "DỰ ÁN", url: "/du-an-tona" },
  { label: "TIN TỨC", url: "/tin-tuc" },
  { label: "TUYỂN DỤNG", url: "/nghe-nghiep" },
];

const fallbackNavLinksEn: SiteMenuItem[] = [
  { label: "HOME", url: "/en" },
  {
    label: "ABOUT TONA",
    children: [
      { label: "About Tona", url: "/en/about-tona" },
      { label: "Leadership", url: "/en/leadership" },
      { label: "Tona Life", url: "/en/tona-life" },
      { label: "CSR", url: "/en/csr" },
    ],
  },
  { label: "SERVICES", url: "/en/services" },
  { label: "PROJECTS", url: "/en/projects" },
  { label: "NEWS", url: "/en/news" },
  { label: "CAREERS", url: "/en/jobs" },
];

const fallbackFooter = {
  cta: {
    eyebrow: "Bắt đầu dự án của bạn",
    title: "Hãy kết nối với Tona Corporation",
    button: "Liên Hệ Ngay",
    buttonUrl: "/nghe-nghiep",
  },
  description: "Nhà thầu xây dựng và MEP hàng đầu, cung cấp giải pháp xây dựng toàn diện đạt chuẩn quốc tế - từ thiết kế đến vận hành.",
  certifications: ["ISO 9001", "ISO 45001", "ISO 14001"],
  aboutTitle: "About Tona",
  aboutLinks: [
    { label: "Giới Thiệu", url: "/gioi-thieu-tona" },
    { label: "Đội Ngũ Lãnh Đạo", url: "/doi-ngu" },
    { label: "Cuộc Sống Tona", url: "/cuoc-song-tona" },
    { label: "Dịch Vụ", url: "/dich-vu" },
    { label: "Tuyển Dụng", url: "/nghe-nghiep" },
  ],
  projectsTitle: "Dự Án",
  projectLinks: [
    { label: "Industrial", url: "/du-an-tona" },
    { label: "Commercial", url: "/du-an-tona" },
    { label: "Solar Rooftop", url: "/du-an-tona" },
    { label: "Hotels & Resorts", url: "/du-an-tona" },
    { label: "Apartments", url: "/du-an-tona" },
  ],
  contactTitle: "Contact",
  address: "Tòa nhà Tona, 123 Đường Xây Dựng\nQuận 1, TP. Hồ Chí Minh, Việt Nam",
  phone: "+84 (0)90 123 4567",
  email: "info@tonacorp.vn",
  socials: [
    { platform: "Facebook" as const, url: "" },
    { platform: "LinkedIn" as const, url: "" },
    { platform: "YouTube" as const, url: "" },
  ],
  copyright: "© {year} Tona Corporation. All Rights Reserved.",
  legalLinks: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms of Service", url: "/terms-of-service" },
    { label: "Sitemap", url: "/sitemap" },
  ],
};

function normalizeLinkValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return normalizeLinkValue(value[0]);
  }

  if (value && typeof value === "object") {
    const linkValue = value as { url?: unknown; href?: unknown; link?: unknown; permalink?: unknown };
    return normalizeLinkValue(linkValue.url || linkValue.href || linkValue.link || linkValue.permalink);
  }

  return "";
}

function itemUrl(item: SiteLink | SiteMenuItem) {
  return normalizeLinkValue(item.url || (item as SiteMenuItem & { to?: unknown }).to) || "#";
}

function SmartLink({
  to,
  className,
  children,
  ariaLabel,
  skipLocalization = false,
}: {
  to?: unknown;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
  skipLocalization?: boolean;
}) {
  const rawUrl = normalizeLinkValue(to) || "#";
  const cleanUrl = rawUrl.replace(/\/+$/, "");
  const url = skipLocalization ? rawUrl : (cleanUrl === "/en" ? rawUrl : localizeUrl(rawUrl));

  if (/^https?:\/\//i.test(url) || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return (
      <a href={url} className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link to={url} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

// HEADER

const normalizePath = (path: string) => {
  const cleanPath = path.split("?")[0].split("#")[0];
  return cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;
};

function Header({ settings }: { settings?: SiteSettings["header"] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [routeMatch, setRouteMatch] = useState<CmsRouteMatch | null>(null);
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsRoute(`${location.pathname}${location.search}`, controller.signal).then(setRouteMatch);

    return () => controller.abort();
  }, [location.pathname, location.search]);

  const isCurrent = (path: string) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(localizeUrl(path));

    return currentPath === targetPath || (!["/", "/en"].includes(targetPath) && currentPath.startsWith(targetPath + "/"));
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const currentLanguage = getCurrentLanguage();
  const navLinks = settings?.nav?.length ? settings.nav : currentLanguage === "en" ? fallbackNavLinksEn : fallbackNavLinks;
  const languages = settings?.languages?.length ? settings.languages : [
    { label: "VI", url: "/" },
    { label: "EN", url: "/en" },
  ];
  const displayLanguages = languages.map((language) => {
    const targetLanguage = language.label?.toLowerCase() === "en" ? "en" : "vi";
    const translatedUrl = routeMatch?.translations?.[targetLanguage];

    return {
      ...language,
      url: localizeUrl(translatedUrl || location.pathname, targetLanguage),
      language: targetLanguage,
    };
  });
  const logo = settings?.logo || tonaLogo;
  const logoAlt = settings?.logoAlt || "Tona Corporation";
  const homeUrl = settings?.homeUrl || (currentLanguage === "en" ? "/en" : "/");
  const isHomePage = ["/", "/en"].includes(normalizePath(location.pathname));
  const whiteMode = isHovered && !isScrolled && isHomePage;
  const darkMode = isScrolled || !isHomePage;
  const headerBg = darkMode
    ? "bg-[#002d17] backdrop-blur-md"
    : whiteMode
      ? "bg-white shadow-xl"
      : "bg-transparent";
  const navLinkBase = whiteMode
    ? "text-[#002d17]/70 hover:text-[#002d17]"
    : "text-white/80 hover:text-[#f4aa1f]";
  const navLinkActive = whiteMode ? "text-[#002d17] font-bold" : "text-[#f4aa1f]";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}
      onPointerMove={(event) => {
        const hasRealMovement = event.movementX !== 0 || event.movementY !== 0;

        if (event.pointerType === "mouse" && hasRealMovement && !isScrolled) {
          setIsHovered(true);
        }
      }}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-8">
        {/* LOGO */}
        <SmartLink
          to={homeUrl}
          className="flex items-center shrink-0"
          ariaLabel={logoAlt}
        >
          <img src={logo} alt={logoAlt} className="h-[80px] w-auto ml-[0px] mr-[20px] my-[0px]" />
        </SmartLink>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            if (link.children?.length) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className={`flex items-center gap-1 px-4 py-2 font-semibold uppercase tracking-widest transition-colors duration-200 ${navLinkBase} text-[13px]`}>
                    {link.label}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {/* Dropdown — always dark */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 min-w-[220px] bg-[#002d17] border-t-2 border-[#f4aa1f] transition-all duration-200 overflow-hidden rounded-b-xl shadow-xl ${
                      activeDropdown === link.label
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    }`}
                  >
                    {link.children.map((child) => (
                      <SmartLink
                        key={`${child.label}-${itemUrl(child)}`}
                        to={itemUrl(child)}
                        className="block px-5 py-3 text-white/80 hover:text-[#f4aa1f] hover:bg-[#46aa85]/40 font-semibold text-xs uppercase tracking-wider border-b border-white/5 last:border-0 transition-colors"
                      >
                        {child.label}
                      </SmartLink>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <SmartLink
                key={`${link.label}-${itemUrl(link)}`}
                to={itemUrl(link)}
                className={`px-4 py-2 font-semibold text-[13px] uppercase tracking-widest transition-colors duration-200 ${
                  isCurrent(itemUrl(link))
                    ? navLinkActive
                    : navLinkBase
                }`}
              >
                {link.label}
              </SmartLink>
            );
          })}
        </nav>

        {/* RIGHT: Language + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language */}
          <div className="hidden lg:flex items-center font-bold uppercase overflow-hidden gap-1">
            {displayLanguages.map((language) => (
              <SmartLink
                key={language.language}
                to={language.url}
                skipLocalization
                ariaLabel={`Chuyển sang ${language.label}`}
                className={`px-2 py-1 transition-colors text-xs rounded-md ${
                  language.language === currentLanguage
                    ? "bg-[#f4aa1f] text-[#002d17] hover:bg-[#f4aa1f]/90"
                    : whiteMode
                      ? "text-[#002d17]/50 hover:text-[#002d17] hover:bg-[#002d17]/5"
                      : "text-white/60 hover:text-white hover:bg-[#46aa85]"
                }`}
              >
                {language.label}
              </SmartLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-1 transition-colors duration-200 ${whiteMode ? "text-[#002d17]" : "text-white"}`}
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
            if (link.children?.length) {
              return (
                <div key={link.label} className="flex flex-col">
                  <span className="text-white/50 font-bold text-xs uppercase tracking-widest py-3 border-b border-white/10">
                    {link.label}
                  </span>
                  {link.children.map((child) => (
                    <SmartLink
                      key={`${child.label}-${itemUrl(child)}`}
                      to={itemUrl(child)}
                      className="pl-4 py-2.5 text-white/80 hover:text-[#f4aa1f] font-semibold text-sm transition-colors"
                    >
                      {child.label}
                    </SmartLink>
                  ))}
                </div>
              );
            }
            return (
              <SmartLink
                key={`${link.label}-${itemUrl(link)}`}
                to={itemUrl(link)}
                className="py-3 text-white font-bold text-sm uppercase tracking-wider border-b border-white/10 hover:text-[#f4aa1f] transition-colors"
              >
                {link.label}
              </SmartLink>
            );
          })}
          <div className="flex gap-2 mt-4">
            {displayLanguages.map((language) => (
              <SmartLink
                key={language.language}
                to={language.url}
                skipLocalization
                className={`px-4 py-2 font-bold text-xs uppercase ${
                  language.language === currentLanguage
                    ? "bg-[#f4aa1f] text-[#002d17]"
                    : "border border-white/30 text-white/60"
                }`}
              >
                {language.label}
              </SmartLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

// FOOTER

function Footer({ settings }: { settings?: SiteSettings["footer"] }) {
  const footer = {
    ...fallbackFooter,
    ...settings,
    cta: { ...fallbackFooter.cta, ...settings?.cta },
    certifications: settings?.certifications?.length ? settings.certifications : fallbackFooter.certifications,
    aboutLinks: settings?.aboutLinks?.length ? settings.aboutLinks : fallbackFooter.aboutLinks,
    projectLinks: settings?.projectLinks?.length ? settings.projectLinks : fallbackFooter.projectLinks,
    socials: settings?.socials?.length ? settings.socials : fallbackFooter.socials,
    legalLinks: settings?.legalLinks?.length ? settings.legalLinks : fallbackFooter.legalLinks,
  };
  const footerLogo = footer.logo || tonaLogo;
  const footerLogoAlt = footer.logoAlt || "Tona Corporation";
  const socialIcons = { Facebook, LinkedIn: Linkedin, YouTube: Youtube };
  const copyright = (footer.copyright || fallbackFooter.copyright).replace("{year}", String(new Date().getFullYear()));
  const phoneHref = `tel:${footer.phone.replace(/[^+\d]/g, "")}`;

  return (
    <footer className="bg-[#002d17] text-white">
      {/* Top CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-2">{footer.cta.eyebrow}</p>
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">
              {footer.cta.title}
            </h3>
          </div>
          <SmartLink
            to={footer.cta.buttonUrl}
            className="shrink-0 bg-[#f4aa1f] text-[#002d17] px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors rounded-lg"
          >
            {footer.cta.button}
          </SmartLink>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Col 1: Brand */}
        <div className="md:col-span-4">
          <div className="mb-6">
            <img src={footerLogo} alt={footerLogoAlt} className="h-10 w-auto" />
          </div>
          <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
            {footer.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {footer.certifications.map((cert) => (
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
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">{footer.aboutTitle}</h4>
          <ul className="flex flex-col gap-3">
            {footer.aboutLinks.map((item) => (
              <li key={`${item.label}-${itemUrl(item)}`}>
                <SmartLink
                  to={itemUrl(item)}
                  className="text-white/60 hover:text-[#f4aa1f] font-medium text-sm transition-colors"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Projects */}
        <div className="md:col-span-2">
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">{footer.projectsTitle}</h4>
          <ul className="flex flex-col gap-3">
            {footer.projectLinks.map((item) => (
              <li key={`${item.label}-${itemUrl(item)}`}>
                <SmartLink
                  to={itemUrl(item)}
                  className="text-white/60 hover:text-[#f4aa1f] font-medium text-sm transition-colors"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div className="md:col-span-4">
          <h4 className="text-[#f4aa1f] font-bold text-xs uppercase tracking-widest mb-6">{footer.contactTitle}</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-[#f4aa1f] shrink-0 mt-0.5" />
              <span className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                {footer.address}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-[#f4aa1f] shrink-0" />
              <a href={phoneHref} className="text-white/60 hover:text-white text-sm transition-colors">
                {footer.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#f4aa1f] shrink-0" />
              <a href={`mailto:${footer.email}`} className="text-white/60 hover:text-white text-sm transition-colors">
                {footer.email}
              </a>
            </li>
          </ul>

          <div className="flex gap-3 mt-8">
            {footer.socials.map((social) => {
              const platform = social.platform || "Facebook";
              const Icon = socialIcons[platform];

              return (
                <a
                  key={`${platform}-${social.url}`}
                  href={social.url || "#"}
                  aria-label={platform}
                  target={social.url && /^https?:\/\//i.test(social.url) ? "_blank" : undefined}
                  rel={social.url && /^https?:\/\//i.test(social.url) ? "noreferrer" : undefined}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:border-[#f4aa1f] hover:text-[#f4aa1f] transition-colors"
                >
                  <Icon size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40 font-medium">
          <span>{copyright}</span>
          <div className="flex gap-5">
            {footer.legalLinks.map((item) => (
              <SmartLink
                key={`${item.label}-${itemUrl(item)}`}
                to={itemUrl(item)}
                className="hover:text-white/70 transition-colors"
              >
                {item.label}
              </SmartLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// LAYOUT ROOT

export function Layout() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();
  const language = location.pathname.startsWith("/en") ? "en" : "vi";
  const isHomePage = ["/", "/en"].includes(normalizePath(location.pathname));

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  useEffect(() => {
    const controller = new AbortController();

    fetchCmsSettings(controller.signal).then(setSettings);

    return () => controller.abort();
  }, [language]);

  useEffect(() => {
    const siteTitle = settings?.site?.title?.trim();
    const siteIcon = settings?.site?.icon?.trim();

    if (siteTitle) {
      document.title = siteTitle;
    }

    if (siteIcon) {
      let iconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");

      if (!iconLink) {
        iconLink = document.createElement("link");
        iconLink.rel = "icon";
        document.head.appendChild(iconLink);
      }

      iconLink.href = siteIcon;
    }
  }, [settings?.site?.title, settings?.site?.icon]);

  return (
    <SiteSettingsProvider settings={settings}>
      <div className="min-h-screen flex flex-col font-san text-[#002d17] antialiased">
        <Header settings={settings?.header} />
        <main className={`flex-1 flex flex-col w-full ${isHomePage ? "" : "pt-[72px]"}`}>
          <Outlet />
        </main>
        <Footer settings={settings?.footer} />
      </div>
    </SiteSettingsProvider>
  );
}
