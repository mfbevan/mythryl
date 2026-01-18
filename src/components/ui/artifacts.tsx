import { cn } from "~/lib/utils";

type Variants = "dots" | "corners";

export const Artifacts = ({
  variant,
  className,
}: {
  variant: Variants;
  className?: string;
}) => {
  switch (variant) {
    case "dots":
      return (
        <>
          <span
            className={cn(
              "absolute -top-0.5 -left-0.5 aspect-square size-0.5 rounded-none bg-current transition-all duration-100 group-hover:scale-150",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 aspect-square size-0.5 rounded-none bg-current transition-all duration-100 group-hover:scale-150",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -left-0.5 aspect-square size-0.5 rounded-none bg-current transition-all duration-100 group-hover:scale-150",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -right-0.5 -bottom-0.5 aspect-square size-0.5 rounded-none bg-current transition-all duration-100 group-hover:scale-150",
              className,
            )}
          />
        </>
      );
    case "corners":
      return (
        <>
          <span
            className={cn(
              "absolute -top-0.5 -left-0.5 h-2 w-0.5 bg-current transition-all duration-100 group-hover:-top-1 group-hover:-left-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -top-0.5 -left-0.5 h-0.5 w-2 bg-current transition-all duration-100 group-hover:-top-1 group-hover:-left-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 h-2 w-0.5 bg-current transition-all duration-100 group-hover:-top-1 group-hover:-right-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 h-0.5 w-2 bg-current transition-all duration-100 group-hover:-top-1 group-hover:-right-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -left-0.5 h-2 w-0.5 bg-current transition-all duration-100 group-hover:-bottom-1 group-hover:-left-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -bottom-0.5 -left-0.5 h-0.5 w-2 bg-current transition-all duration-100 group-hover:-bottom-1 group-hover:-left-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -right-0.5 -bottom-0.5 h-2 w-0.5 bg-current transition-all duration-100 group-hover:-right-1 group-hover:-bottom-1",
              className,
            )}
          />
          <span
            className={cn(
              "absolute -right-0.5 -bottom-0.5 h-0.5 w-2 bg-current transition-all duration-100 group-hover:-right-1 group-hover:-bottom-1",
              className,
            )}
          />
        </>
      );
    default:
      return null;
  }
};
