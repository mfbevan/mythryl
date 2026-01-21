import {
  GamepadIcon,
  UsersIcon,
  WalletIcon,
  WrenchIcon,
  ClipboardListIcon,
  HeartPulseIcon,
  NewspaperIcon,
  MusicIcon,
  ShoppingCartIcon,
  GraduationCapIcon,
  CodeIcon,
  TvIcon,
  PaletteIcon,
  type LucideIcon,
} from "lucide-react";

export type AppCategory = {
  key: string;
  name: string;
  icon: LucideIcon;
};

export const APP_CATEGORIES: AppCategory[] = [
  { key: "games", name: "Games", icon: GamepadIcon },
  { key: "social", name: "Social", icon: UsersIcon },
  { key: "finance", name: "Finance", icon: WalletIcon },
  { key: "utility", name: "Utility", icon: WrenchIcon },
  { key: "productivity", name: "Productivity", icon: ClipboardListIcon },
  { key: "health-fitness", name: "Health & Fitness", icon: HeartPulseIcon },
  { key: "news-media", name: "News & Media", icon: NewspaperIcon },
  { key: "music", name: "Music", icon: MusicIcon },
  { key: "shopping", name: "Shopping", icon: ShoppingCartIcon },
  { key: "education", name: "Education", icon: GraduationCapIcon },
  { key: "developer-tools", name: "Developer Tools", icon: CodeIcon },
  { key: "entertainment", name: "Entertainment", icon: TvIcon },
  { key: "art-creativity", name: "Art & Creativity", icon: PaletteIcon },
];

export const getCategoryByKey = (key: string): AppCategory | undefined => {
  return APP_CATEGORIES.find((cat) => cat.key === key);
};

export const getCategoryName = (key: string): string => {
  return getCategoryByKey(key)?.name ?? key;
};
