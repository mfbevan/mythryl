import { ThemeToggle } from "~/components/theme/theme.toggle";

export const LoginTheme = () => {
  return (
    <div className="text-muted-foreground fixed top-0 left-0 p-4 text-xs">
      <ThemeToggle />
    </div>
  );
};
