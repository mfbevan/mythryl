"use client";

import { useEffect, useState } from "react";
import { Shield, ExternalLink, CheckCircle } from "lucide-react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

interface StepAuthAddressProps {
  onComplete: () => void;
}

export const StepAuthAddress = ({ onComplete }: StepAuthAddressProps) => {
  const utils = api.useUtils();
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);

  const wallet = useActiveWallet();
  const account = useActiveAccount();

  const onboardingStatus = api.onboarding.getStatus.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchInterval: isWaitingForApproval ? 3000 : false,
  });

  const typedDataQuery = api.signers.getAuthAddressTypedData.useQuery(
    undefined,
    {
      enabled: !!account?.address,
    },
  );

  const registerAuthAddress = api.signers.registerAuthAddress.useMutation({
    onSuccess: (data) => {
      if (data.approvalUrl) {
        setApprovalUrl(data.approvalUrl);
        setIsWaitingForApproval(true);
      }
    },
  });

  const completeOnboarding = api.onboarding.complete.useMutation({
    onSuccess: () => {
      void utils.onboarding.getStatus.invalidate();
      onComplete();
    },
  });

  // Check if auth address is approved via onboarding status
  useEffect(() => {
    if (onboardingStatus.data?.authAddressStatus === "approved") {
      setIsWaitingForApproval(false);
      void completeOnboarding.mutateAsync();
    }
    // Load any existing approval URL
    if (
      onboardingStatus.data?.authAddressApprovalUrl &&
      !approvalUrl &&
      onboardingStatus.data?.authAddressStatus === "pending"
    ) {
      setApprovalUrl(onboardingStatus.data.authAddressApprovalUrl);
      setIsWaitingForApproval(true);
    }
  }, [onboardingStatus.data?.authAddressStatus]);

  const handleSign = async () => {
    if (!typedDataQuery.data || !wallet || !account) return;

    const { domain, types, primaryType, message, deadline } =
      typedDataQuery.data;

    try {
      const signature = await account.signTypedData({
        domain,
        types,
        primaryType,
        message,
      });

      await registerAuthAddress.mutateAsync({
        signature,
        deadline,
      });
    } catch (e) {
      console.error("Failed to sign typed data:", e);
    }
  };

  const handleOpenApproval = () => {
    if (approvalUrl) {
      window.open(approvalUrl, "_blank");
    }
  };

  const isApproved = onboardingStatus.data?.authAddressStatus === "approved";
  const isPending = isWaitingForApproval || !!approvalUrl;
  const canSign = !!typedDataQuery.data && !!account && !isPending;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        {isApproved ? (
          <CheckCircle className="h-8 w-8 text-green-500" />
        ) : (
          <Shield className="text-primary h-8 w-8" />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Register Auth Address</h2>
        <p className="text-muted-foreground text-sm">
          Link your wallet as an authorized address with Farcaster. This allows
          you to sign in using your wallet address.
        </p>
      </div>

      {canSign && (
        <Button
          onClick={handleSign}
          isLoading={registerAuthAddress.isPending || typedDataQuery.isLoading}
          className="w-full max-w-xs"
        >
          Sign & Register
        </Button>
      )}

      {isPending && !isApproved && (
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={handleOpenApproval}
            variant="outline"
            className="w-full max-w-xs"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Warpcast to Approve
          </Button>

          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            <span className="text-muted-foreground text-sm">
              Waiting for approval...
            </span>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Auth address registered!</span>
        </div>
      )}

      {registerAuthAddress.isError && (
        <p className="text-destructive text-sm">
          {registerAuthAddress.error.message || "Failed to register address"}
        </p>
      )}
    </div>
  );
};
