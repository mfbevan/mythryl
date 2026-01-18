"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartNoAxesColumnIncreasing,
  ChevronLeft,
  Eye,
  FlaskConical,
  Image,
  Laptop,
  MonitorSmartphone,
  Percent,
  Smartphone,
  SquareUserRound,
} from "lucide-react";
import Link from "next/link";

import { Checkbox } from "../ui/checkbox";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { navigation } from "~/components/navigation/navigation";
import { useCurrentUser } from "../user/user.hooks";
import { CreditsIcon } from "../credits/credits.icon";
import { FarcasterIcon } from "../farcaster/farcaster.icon";

const features = [
  {
    icon: Image,
    title: "Advanced Image Generation",
    description: "Generate images using various models and style options",
  },
  {
    icon: () => <FarcasterIcon className="text-primary size-3" />,
    title: "Farcaster Native",
    description: "Spruce up your casts without having to leave Farcaster",
  },
  {
    icon: SquareUserRound,
    title: "Generative NFT Collections",
    description: "Explore new ways to create Generative AI NFT Collections",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Clank the World",
    description: "All your generations can be instantly clanked",
  },
  {
    icon: MonitorSmartphone,
    title: "Cross-Platform",
    description: "Access your generations from Farcaster, TBA or the web",
  },
];

const disclaimers = [
  {
    icon: () => (
      <CreditsIcon className="border-primary" iconClassName="text-primary" />
    ),
    title: "Credit Based Usage",
    description:
      "Pay only for what you use. Topup your credits balance with Crypto or Fiat.",
  },
  {
    icon: Eye,
    title: "Public Generations",
    description:
      "All generations are currently public and can be seen by everyone. Future versions will allow private generation.",
  },
  {
    icon: Percent,
    title: "Platform Fees",
    description:
      "10% on primary and secondary NFT sales. 20% on Clanker. All other fees to creators",
  },
  {
    icon: FlaskConical,
    title: "Highly Experimental",
    description: "Features may change or be removed at any time.",
  },
];

const content = [
  {
    title: "Immutagen AI",
    description: "Generative AI with social DNA",
    button: "Continue",
    customContent: (
      <div className="space-y-4">
        {features.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-sm">
                <Icon className="text-primary size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs leading-none">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
  },
  {
    title: "Immutagen AI",
    description: "There's a few things you should know before we get started.",
    button: "Enter Immutagen",
    customContent: (
      <div className="space-y-4">
        {disclaimers.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-sm">
                <Icon className="text-primary size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-xs leading-none">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    ),
  },
];
export const OnboardDialog = () => {
  const [user] = useCurrentUser();
  const utils = api.useUtils();
  const setFlags = api.users.setFlag.useMutation({
    onSuccess: () => {
      void utils.users.getCurrentUser.invalidate();
    },
    onError: () => {
      void utils.users.getCurrentUser.invalidate();
      setDisclaimerJustAccepted(false);
      setHasAcceptedTerms(false);
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [disclaimerJustAccepted, setDisclaimerJustAccepted] = useState(false);
  const isLastPage = currentIndex === content.length - 1;

  // Only show dialog if user is authenticated, hasn't accepted disclaimer, and didn't just accept it
  const shouldShowDialog =
    !!user && !user.flags?.termsAccepted && !disclaimerJustAccepted;
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (isLastPage) {
      if (!hasAcceptedTerms) return; // Don't proceed if terms not accepted

      // Close modal immediately, assuming success
      setDisclaimerJustAccepted(true);

      void setFlags.mutateAsync({ flag: "termsAccepted" });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={!!shouldShowDialog}>
      <DialogOverlay />
      <DialogContent
        className="h-full max-h-none w-full max-w-none overflow-hidden p-0 sm:h-auto sm:max-h-none sm:max-w-md"
        showCloseButton={false}
      >
        <div className="relative flex h-full w-full flex-col sm:h-[500px]">
          {/* Content section with animations */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.05,
                }}
                className="absolute inset-0 p-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {content[currentIndex]?.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-base whitespace-pre-line">
                    {content[currentIndex]?.description}
                  </DialogDescription>
                </DialogHeader>
                {content[currentIndex]?.customContent && (
                  <div className="mt-4">
                    {content[currentIndex].customContent}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed footer with stepper and button */}
          <div className="flex flex-col items-center gap-4">
            {/* Terms acceptance checkbox on final page */}
            {isLastPage && (
              <div className="w-full space-y-4 px-6">
                <div className="flex items-center justify-center gap-2">
                  <Checkbox
                    id="accept-terms"
                    checked={hasAcceptedTerms}
                    onCheckedChange={(checked) =>
                      setHasAcceptedTerms(
                        checked === "indeterminate" ? false : checked === true,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <label
                    htmlFor="accept-terms"
                    className="text-sm text-gray-600"
                  >
                    I agree to the{" "}
                    <Link
                      href={navigation.terms.href}
                      className="text-rose-600 underline hover:text-rose-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href={navigation.privacy.href}
                      className="text-rose-600 underline hover:text-rose-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}

            {/* Button row with back and next */}
            <div className="flex w-full gap-2 px-6">
              {currentIndex > 0 && (
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  className="h-9 w-9 flex-shrink-0 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="min-w-0 flex-1"
                disabled={
                  setFlags.isPending || (isLastPage && !hasAcceptedTerms)
                }
              >
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="truncate"
                >
                  {setFlags.isPending && isLastPage
                    ? "Processing..."
                    : content[currentIndex]?.button}
                </motion.span>
              </Button>
            </div>

            {/* Stepper dots - fixed position */}
            <div className="mb-4 flex justify-center">
              {content.map((_, index) => (
                <div
                  key={index}
                  className={`bg-primary mx-1 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "w-8" : "w-2 opacity-50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
