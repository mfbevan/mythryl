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
  gradient: string;
  bg: string;
};

export const APP_CATEGORIES: AppCategory[] = [
  {
    key: "games",
    name: "Games",
    icon: GamepadIcon,
    gradient: "from-violet-400 to-purple-600",
    bg: "bg-violet-400",
  },
  {
    key: "social",
    name: "Social",
    icon: UsersIcon,
    gradient: "from-blue-400 to-cyan-400",
    bg: "bg-blue-400",
  },
  {
    key: "finance",
    name: "Finance",
    icon: WalletIcon,
    gradient: "from-emerald-400 to-teal-600",
    bg: "bg-emerald-400",
  },
  {
    key: "utility",
    name: "Utility",
    icon: WrenchIcon,
    gradient: "from-slate-400 to-zinc-600",
    bg: "bg-slate-400",
  },
  {
    key: "productivity",
    name: "Productivity",
    icon: ClipboardListIcon,
    gradient: "from-orange-400 to-amber-400",
    bg: "bg-orange-400",
  },
  {
    key: "health-fitness",
    name: "Health & Fitness",
    icon: HeartPulseIcon,
    gradient: "from-rose-400 to-pink-600",
    bg: "bg-rose-400",
  },
  {
    key: "news-media",
    name: "News & Media",
    icon: NewspaperIcon,
    gradient: "from-sky-400 to-blue-600",
    bg: "bg-sky-400",
  },
  {
    key: "music",
    name: "Music",
    icon: MusicIcon,
    gradient: "from-fuchsia-400 to-pink-400",
    bg: "bg-fuchsia-400",
  },
  {
    key: "shopping",
    name: "Shopping",
    icon: ShoppingCartIcon,
    gradient: "from-lime-400 to-green-600",
    bg: "bg-lime-400",
  },
  {
    key: "education",
    name: "Education",
    icon: GraduationCapIcon,
    gradient: "from-indigo-400 to-violet-600",
    bg: "bg-indigo-400",
  },
  {
    key: "developer-tools",
    name: "Developer Tools",
    icon: CodeIcon,
    gradient: "from-gray-600 to-neutral-700",
    bg: "bg-gray-600",
  },
  {
    key: "entertainment",
    name: "Entertainment",
    icon: TvIcon,
    gradient: "from-red-400 to-orange-400",
    bg: "bg-red-400",
  },
  {
    key: "art-creativity",
    name: "Art & Creativity",
    icon: PaletteIcon,
    gradient: "from-pink-400 to-rose-400",
    bg: "bg-pink-400",
  },
];

export const getCategoryByKey = (key: string): AppCategory | undefined => {
  return APP_CATEGORIES.find((cat) => cat.key === key);
};

export const getCategoryName = (key: string): string => {
  return getCategoryByKey(key)?.name ?? key;
};
