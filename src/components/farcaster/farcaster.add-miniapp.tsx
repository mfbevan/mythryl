"use client";

import sdk from "@farcaster/miniapp-sdk";
import { useState } from "react";

import { Button, type ButtonProps } from "../ui/button";

import {
  useFarcasterContext,
  useIsMiniApp,
} from "~/components/farcaster/farcaster.hooks";
import { cn } from "~/lib/utils";
import { PlusSquare } from "lucide-react";

export const AddMiniapp = ({ className, ...props }: ButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [ctx, { isLoading }] = useFarcasterContext();
  const [isMiniApp] = useIsMiniApp();

  const onAdd = async () => {
    const response = await sdk.actions.addMiniApp();
    if (!!response.notificationDetails) setIsAdded(true);
  };

  if (isLoading || !isMiniApp || isAdded || ctx?.client.added) return null;

  return (
    <Button
      onClick={onAdd}
      className={cn("w-full", className)}
      variant="outline"
      size="lg"
      {...props}
    >
      Add Mini App <PlusSquare />
    </Button>
  );
};
