"use client";

import {
  ChevronsUpDown,
  Cog,
  LogOut,
  Moon,
  RefreshCcw,
  Sun,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { useUserDialogStore } from "../user/user.dialog";
import { useCurrentUser, useHasRole } from "../user/user.hooks";
import { UserAvatar } from "../user/user.avatar";
import { ConfirmSignout } from "../auth/auth.confirm-signout";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  AccountAddress,
  AccountAvatar,
  AccountProvider,
  useActiveAccount,
  useConnectModal,
} from "thirdweb/react";
import { client } from "~/services/thirdweb.service";
import { ConnectButton, useConnectButton } from "../wallet/connect-button";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export const SidebarUser = () => {
  const pathname = usePathname();
  const [user] = useCurrentUser();
  const account = useActiveAccount();
  const [signOutOpen, setSignOutOpen] = useState(false);
  const { openDialog } = useUserDialogStore();
  const { setTheme, theme } = useTheme();
  const { open } = useSidebar();
  const showSettings = useHasRole(["admin", "creator"]);
  const utils = api.useUtils();
  const syncUser = api.users.syncUser.useMutation({
    onSuccess: () => {
      void utils.users.getCurrentUser.invalidate();
    },
  });

  const onToggle = (e: React.MouseEvent) => {
    setTheme(theme === "light" ? "dark" : "light");
    e.preventDefault();
  };

  const { isMobile } = useSidebar();

  if (!user)
    return (
      <Link href={`/login?redirectUrl=${encodeURIComponent(pathname)}`}>
        <Button className="w-full" size="lg">
          Sign In / Sign Up
        </Button>
      </Link>
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={cn(!open || account?.address ? "hidden" : "flex")}>
          <ConnectButton />
        </div>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs">{user.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.displayName}
                  </span>
                  <span className="truncate text-xs">{user.username}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <WalletItem />

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => openDialog(user.id)}>
              <User className="icon-inner-shadow size-4" /> Profile
            </DropdownMenuItem>

            {/* <DropdownMenuItem onClick={() => openCredits()}>
              <ShoppingBag className="icon-inner-shadow size-4" /> Purchase
              Credits
            </DropdownMenuItem> */}

            <DropdownMenuItem onClick={onToggle}>
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              {"Toggle theme"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                void toast
                  .promise(() => syncUser.mutateAsync(), {
                    loading: "Syncing Farcaster Profile...",
                    success: "Farcaster Profile Synced!",
                    error: "Failed to sync profile",
                  })
                  .unwrap()
              }
            >
              <RefreshCcw
                className={cn(
                  "icon-inner-shadow size-4",
                  syncUser.isPending && "animate-spin",
                )}
              />{" "}
              Sync Profile
            </DropdownMenuItem>

            {showSettings && (
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Cog className="icon-inner-shadow size-4" /> Settings
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSignOutOpen(true)}>
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <ConfirmSignout open={signOutOpen} onOpenChange={setSignOutOpen} />

      <div className="hidden">
        <ConnectButton />
      </div>
    </SidebarMenu>
  );
};

const WalletItem = () => {
  const { connectOptions, account, modal, walletImage, wallet } =
    useConnectButton({});
  const { connect } = useConnectModal();

  const FallbackWalletImage = () => (
    <img
      src={walletImage?.data}
      alt={wallet?.id ?? "Wallet Image"}
      className="size-4"
    />
  );

  if (account?.address) {
    return (
      <DropdownMenuItem onClick={() => modal.open(connectOptions)}>
        <AccountProvider address={account?.address} client={client}>
          <div className="flex w-full items-center gap-2">
            <div className="flex items-center gap-2">
              <AccountAvatar
                className="aspect-square size-5"
                fallbackComponent={<FallbackWalletImage />}
                loadingComponent={<FallbackWalletImage />}
              />
              <AccountAddress formatFn={(s) => shortenAddress(s)} />
            </div>

            {/* <p className="text-muted-foreground text-xs">on</p>

            <div className="flex items-center gap-2">
              <ChainIcon chain={activeChain} className="size-4" />
              <p className="line-clamp-1 text-xs font-medium">
                {activeChain.name}
              </p>
            </div> */}
          </div>
        </AccountProvider>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={() => connect(connectOptions)}>
      <Wallet /> Connect Wallet
    </DropdownMenuItem>
  );
};
