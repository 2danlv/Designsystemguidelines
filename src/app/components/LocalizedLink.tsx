import type React from "react";
import { Link as RouterLink, type LinkProps } from "react-router";
import { localizeUrl, normalizeLinkValue } from "../lib/wordpress";

export function Link({ to, ...props }: LinkProps) {
  const rawTo = normalizeLinkValue(to);
  const localizedTo = localizeUrl(rawTo || "#");

  if (/^https?:\/\//i.test(localizedTo) || localizedTo.startsWith("mailto:") || localizedTo.startsWith("tel:")) {
    return <a href={localizedTo} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  return <RouterLink to={localizedTo} {...props} />;
}
