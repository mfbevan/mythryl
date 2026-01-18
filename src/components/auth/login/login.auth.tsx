"use client";

import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import { FarcasterSignIn } from "~/components/farcaster/farcaster.signin";
import { navigation } from "~/components/navigation/navigation";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Apple } from "~/components/ui/svgs/apple";
import { AppleDark } from "~/components/ui/svgs/appleDark";
import { Discord } from "~/components/ui/svgs/discord";
import { GithubDark } from "~/components/ui/svgs/githubDark";
import { GithubLight } from "~/components/ui/svgs/githubLight";
import { Google } from "~/components/ui/svgs/google";
import { X } from "~/components/ui/svgs/x";
import { XDark } from "~/components/ui/svgs/xDark";
import { cn } from "~/lib/utils";

export const LoginAuth = ({ className }: { className?: string }) => {
  const theme = useTheme();
  const isLight = theme.theme === "light";

  const getCallbackUrl = () =>
    new URLSearchParams(window.location.search).get("redirectUrl") ??
    new URLSearchParams(window.location.search).get("callback") ??
    navigation.home.href;

  const loginGoogle = async () => {
    await signIn("google", { redirectTo: getCallbackUrl() });
  };

  const loginGithub = async () => {
    await signIn("github", { redirectTo: getCallbackUrl() });
  };

  const loginDiscord = async () => {
    await signIn("discord", { redirectTo: getCallbackUrl() });
  };

  const loginApple = async () => {
    await signIn("apple", { redirectTo: getCallbackUrl() });
  };

  const loginTwitter = async () => {
    await signIn("twitter");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In or Sign Up</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Choose your preferred sign in method
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative flex w-full flex-col">
          <Badge
            className="absolute -top-3 -right-3 px-1.5 text-[0.6rem] font-bold uppercase"
            size="sm"
          >
            Recommended
          </Badge>
          <FarcasterSignIn />
        </div>

        {/* <Button variant="outline" className="w-full" onClick={loginGoogle}>
          <Google />
          Google
        </Button>

        <Button variant="outline" className="w-full" onClick={loginDiscord}>
          <Discord />
          Discord
        </Button>

        <Button variant="outline" className="w-full" onClick={loginGithub}>
          {isLight ? <GithubLight /> : <GithubDark />}
          GitHub
        </Button>

        <Button variant="outline" className="w-full" onClick={loginTwitter}>
          {isLight ? <X /> : <XDark />}
          Twitter
        </Button>

        <Button variant="outline" className="w-full" type="button" disabled>
          {isLight ? <Apple /> : <AppleDark />}
          Apple
        </Button> */}
      </div>
    </div>
  );
};
