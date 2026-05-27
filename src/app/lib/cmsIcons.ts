import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  MapPin,
  PenTool,
  Shield,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const cmsIconMap: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  GraduationCap,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  MapPin,
  PenTool,
  Shield,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
};

export type CmsIconName = keyof typeof cmsIconMap;

export function getCmsIcon(name: string | undefined | null, fallback: LucideIcon): LucideIcon {
  if (!name) {
    return fallback;
  }

  return cmsIconMap[name] || fallback;
}
