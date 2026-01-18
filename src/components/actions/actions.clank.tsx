"use client";

import { Button } from "../ui/button";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useClankerCreatorModal } from "../clankers/clanker-creator.store";

export const ActionsClank = ({ url }: { url: string }) => {
  const { open } = useClankerCreatorModal();

  const onAction = async () => {
    open(url);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="iconXs"
          variant="ghost"
          className="relative"
          onClick={onAction}
        >
          <ChartNoAxesColumnIncreasing className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">New Clanker</TooltipContent>
    </Tooltip>
  );
};
