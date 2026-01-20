import { toast } from "sonner";

import { useOnboardingStatus } from "./onboarding.hooks";
import { useOnboardingStore } from "./onboarding.store";

export const useRequireOnboarding = (message?: string) => {
  const { isComplete } = useOnboardingStatus();
  const { openModal } = useOnboardingStore();

  /**
   * Returns true if blocked (not complete), false if allowed
   * Shows toast with action button when blocked
   */
  const requireOnboarding = () => {
    if (isComplete) return false; // allowed

    toast.warning(message ?? "Complete setup to use this feature", {
      action: {
        label: "Complete Setup",
        onClick: openModal,
      },
    });
    return true; // blocked
  };

  return { requireOnboarding, isComplete };
};
