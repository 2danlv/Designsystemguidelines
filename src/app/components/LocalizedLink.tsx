import { Link as RouterLink, type LinkProps } from "react-router";
import { localizeUrl } from "../lib/wordpress";

export function Link({ to, ...props }: LinkProps) {
  const localizedTo = typeof to === "string" ? localizeUrl(to) : to;

  return <RouterLink to={localizedTo} {...props} />;
}
