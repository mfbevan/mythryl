"use client";

import { useMemo } from "react";
import { CheckCircle, Circle } from "lucide-react";

import { useOnboardingStatus } from "./onboarding.hooks";
import { StepWallet } from "./steps/step.wallet";
import { StepSigner } from "./steps/step.signer";

import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import type { OnboardingStatus } from "~/server/db/schema";

const STEPS = [
  { id: "wallet", label: "Create Wallet", statuses: ["pending"] },
  {
    id: "signer",
    label: "Create Signer",
    statuses: ["wallet_created", "signer_pending"],
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const getStepIndex = (status: OnboardingStatus): number => {
  const stepIndex = STEPS.findIndex((step) =>
    (step.statuses as readonly string[]).includes(status),
  );
  return stepIndex === -1 ? STEPS.length : stepIndex;
};

export const OnboardingFlow = () => {
  const { status } = useOnboardingStatus();
  const utils = api.useUtils();

  const updateStatus = api.onboarding.updateStatus.useMutation({
    onSuccess: () => {
      void utils.onboarding.getStatus.invalidate();
    },
  });

  const currentStepIndex = useMemo(() => getStepIndex(status), [status]);

  const handleStepComplete = (nextStatus: OnboardingStatus) => {
    void updateStatus.mutateAsync(nextStatus);
  };

  const renderStep = (stepId: StepId) => {
    switch (stepId) {
      case "wallet":
        return (
          <StepWallet
            onComplete={() => handleStepComplete("wallet_created")}
          />
        );
      case "signer":
        return (
          <StepSigner onComplete={() => handleStepComplete("complete")} />
        );
    }
  };

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((step, index) => {
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                  isComplete && "bg-green-500 text-white",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground",
                )}
              >
                {isComplete ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8",
                    index < currentStepIndex ? "bg-green-500" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-lg border p-6">
        {currentStep && renderStep(currentStep.id)}
      </div>

      {/* Step labels */}
      <div className="flex justify-between px-2 text-xs">
        {STEPS.map((step, index) => (
          <span
            key={step.id}
            className={cn(
              "text-center",
              index === currentStepIndex
                ? "text-primary font-medium"
                : "text-muted-foreground",
            )}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};
