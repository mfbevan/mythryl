import { useWindowActions } from "./provider";
import { useRequireOnboarding } from "~/components/onboarding/use-require-onboarding";
import type { Window } from "./windows.schema";

export const useGatedWindowActions = () => {
  const actions = useWindowActions();
  const { requireOnboarding } = useRequireOnboarding("Complete setup to use mini apps");

  const addWindow = (window: Window) => {
    if (window.type === "miniapp" && requireOnboarding()) return;
    actions.addWindow(window);
  };

  return { ...actions, addWindow };
};
