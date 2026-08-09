import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings } from "../lib/wordpress";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useSiteText() {
  const settings = useSiteSettings();

  return (key: string) => settings?.ui?.[key] || "";
}
