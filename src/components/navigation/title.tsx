"use client";

import { cn } from "~/lib/utils";
import { Separator } from "../ui/separator";

export const PageTitle = ({
  icon,
  title,
  description,
  titleClassName,
  descriptionClassName,
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 pt-4">
      <div className="[&_svg:not([class*='text-'])]:text-muted-foreground flex items-center gap-2 px-4">
        {icon}
        {title && (
          <h1
            className={cn(
              "text-2xl leading-none font-semibold md:text-3xl",
              titleClassName,
            )}
          >
            {title}
          </h1>
        )}
      </div>

      {description && (
        <p
          className={cn(
            "text-muted-foreground px-4 text-xs",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}

      <Separator className="mt-2" />
    </div>
  );
};
