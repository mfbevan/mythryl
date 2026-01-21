import {
  Code,
  Cog,
  Compass,
  Handshake,
  HatGlasses,
  Home,
  Layout,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Rss,
  Search,
  type LucideIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { env } from "~/env.app";

export interface NavigationItem {
  label: string;
  icon?: LucideIcon;
  href: string;
  isAvailable?: boolean;
  isExternal?: boolean;
  onClick?: () => void;
}

export const navigation = {
  home: {
    label: "Home",
    href: "/",
    icon: Home,
    isAvailable: true,
  },

  search: {
    label: "Search",
    href: "/search",
    icon: Search,
    isAvailable: true,
  },

  explore: {
    label: "Explore",
    href: "/explore",
    icon: Compass,
    isAvailable: true,
  },

  apps: {
    label: "Apps",
    href: "/apps",
    icon: LayoutGrid,
    isAvailable: true,
  },

  channels: {
    label: "Channels",
    href: "/channels",
    icon: Rss,
    isAvailable: true,
  },

  messages: {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    isAvailable: true,
  },

  windows: {
    label: "Windows",
    href: "/windows",
    icon: Layout,
    isAvailable: true,
  },

  settings: {
    label: "Settings",
    href: "/settings",
    icon: Cog,
    isAvailable: true,
  },

  // Developers

  developers: {
    label: "Developers",
    href: "/developers",
    icon: Code,
    isAvailable: true,
  },

  // Support & Legal

  support: {
    label: "Support",
    href: "/support",
    icon: LifeBuoy,
    isAvailable: true,
  },

  terms: {
    label: "Terms of Service",
    href: "/terms",
    icon: Handshake,
    isAvailable: true,
    isExternal: true,
  },

  privacy: {
    label: "Privacy Policy",
    href: "/privacy",
    icon: HatGlasses,
    isAvailable: true,
    isExternal: true,
  },
};

export const checkNavigation = (nav: NavigationItem) => {
  if (!env.NEXT_PUBLIC_APP_ENABLED || !nav.isAvailable) redirect("/home");
};

export const homeUrl = navigation.home.href;

export const disableLink =
  (bool: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (bool) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

export const createNftCollectionLink = ({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) => {
  return `/collections/${chainId}/${address}`;
};

export const createNftLink = ({
  chainId,
  address,
  tokenId,
}: {
  chainId: number;
  address: string;
  tokenId: bigint;
}) => {
  return `/collections/${chainId.toString()}/${address.toString()}/${tokenId.toString()}`;
};

export const createProfileLink = (address: string) => {
  return `/profile/${address}`;
};

export const createMintPageLink = ({ mintId }: { mintId: string }) => {
  return `/mint/${mintId}`;
};

const FARCASTER_URL = "https://farcaster.xyz";

export const createFarcasterCastLink = ({
  author,
  castHash,
}: {
  author: string;
  castHash: string;
}) => {
  return `${FARCASTER_URL}/${author}/${castHash}`;
};

export const createFarcasterProfileLink = ({ author }: { author: string }) => {
  return `${FARCASTER_URL}/${author}`;
};
