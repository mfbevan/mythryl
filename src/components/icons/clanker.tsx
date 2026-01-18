import { ChartNoAxesColumnIncreasing } from "lucide-react";
import type { SVGProps } from "react";

export const ClankerIcon = (
  props: SVGProps<SVGSVGElement> & {
    mode?: "dark" | "light" | "color";
  },
) => {
  return (
    <ChartNoAxesColumnIncreasing color="#8a63d2" strokeWidth={3} {...props} />
  );
};
