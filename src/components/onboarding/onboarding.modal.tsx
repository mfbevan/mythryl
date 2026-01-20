"use client";

import { useEffect } from "react";

import { OnboardingFlow } from "./onboarding.flow";
import { useOnboardingStatus } from "./onboarding.hooks";
import { useOnboardingStore } from "./onboarding.store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export const OnboardingModal = () => {
  const { isModalOpen, closeModal } = useOnboardingStore();
  const { isComplete } = useOnboardingStatus();

  // Auto-close modal when onboarding completes
  useEffect(() => {
    if (isComplete && isModalOpen) {
      closeModal();
    }
  }, [isComplete, isModalOpen, closeModal]);

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle>Complete Setup</DialogTitle>
          <DialogDescription>
            Finish setting up your account to unlock all features
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <OnboardingFlow />
        </div>
      </DialogContent>
    </Dialog>
  );
};
