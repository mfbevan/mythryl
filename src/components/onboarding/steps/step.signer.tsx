"use client";

import { useEffect, useState } from "react";
import { KeyRound, CheckCircle, ExternalLink } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";

interface StepSignerProps {
  onComplete: () => void;
}

export const StepSigner = ({ onComplete }: StepSignerProps) => {
  const utils = api.useUtils();
  const [isPolling, setIsPolling] = useState(false);
  // Track approval URL locally since it might come from mutation before query refetches
  const [localApprovalUrl, setLocalApprovalUrl] = useState<string | null>(null);

  const signerStatus = api.signers.getStatus.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const createSigner = api.signers.create.useMutation({
    onSuccess: (data) => {
      if (data?.approvalUrl) {
        setLocalApprovalUrl(data.approvalUrl);
      }
      void signerStatus.refetch();
    },
  });

  const checkApproval = api.signers.checkApproval.useMutation({
    onSuccess: (data) => {
      // Update local approval URL from mutation result
      if (data?.approvalUrl) {
        setLocalApprovalUrl(data.approvalUrl);
      }

      if (data?.status === "approved") {
        setIsPolling(false);
        void utils.onboarding.getStatus.invalidate();
        onComplete();
      }
    },
  });

  // Start polling when signer is created but not approved
  useEffect(() => {
    if (!signerStatus.data || signerStatus.data.status === "approved") return;

    setIsPolling(true);
    const interval = setInterval(() => {
      void checkApproval.mutateAsync();
    }, 3000);

    return () => clearInterval(interval);
  }, [signerStatus.data?.status]);

  // If already approved, move to next step
  useEffect(() => {
    if (signerStatus.data?.status === "approved") {
      onComplete();
    }
  }, [signerStatus.data?.status, onComplete]);

  // Sync local approval URL from query data
  useEffect(() => {
    if (signerStatus.data?.approvalUrl && !localApprovalUrl) {
      setLocalApprovalUrl(signerStatus.data.approvalUrl);
    }
  }, [signerStatus.data?.approvalUrl, localApprovalUrl]);

  const isLoading = signerStatus.isLoading;
  const signer = signerStatus.data;
  const isApproved = signer?.status === "approved";
  const isPending = signer && !isApproved;
  const needsCreation = !signer && !isLoading;
  // Use local approval URL (which gets updated from both query and mutation)
  const approvalUrl = localApprovalUrl ?? signer?.approvalUrl;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        {isApproved ? (
          <CheckCircle className="h-8 w-8 text-green-500" />
        ) : (
          <KeyRound className="text-primary h-8 w-8" />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Create Farcaster Signer</h2>
        <p className="text-muted-foreground text-sm">
          A signer allows you to post casts and interact with Farcaster on your
          behalf. Scan the QR code to approve.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2">
          <Spinner className="h-4 w-4" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      )}

      {needsCreation && (
        <Button
          onClick={() => createSigner.mutate()}
          isLoading={createSigner.isPending}
          className="w-full max-w-xs"
        >
          Create Signer
        </Button>
      )}

      {isPending && (
        <div className="flex flex-col items-center gap-4">
          {approvalUrl ? (
            <>
              {/* QR Code */}
              <div className="rounded-lg border bg-white p-3">
                { }
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(approvalUrl)}`}
                  alt="Scan to approve signer"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px]"
                />
              </div>

              {/* Direct link as fallback */}
              <a
                href={approvalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 text-sm underline"
              >
                <ExternalLink className="h-3 w-3" />
                Open in Farcaster
              </a>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Generating approval link...
            </p>
          )}

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
          <span className="text-sm">Signer approved!</span>
        </div>
      )}

      {(createSigner.isError || checkApproval.isError) && (
        <p className="text-destructive text-sm">
          {createSigner.error?.message ||
            checkApproval.error?.message ||
            "An error occurred"}
        </p>
      )}
    </div>
  );
};
