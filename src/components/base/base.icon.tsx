import { cn } from "~/lib/utils";

export const BaseIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4 text-[#0000FF]", className)}
    >
      <rect width="1024" height="1024" rx="100" fill="currentColor" />
    </svg>
  );
};
