import { LifeBuoy } from "lucide-react";
import { PageTitle } from "~/components/navigation/title";

export const SupportHeader = () => {
  return (
    <PageTitle
      icon={<LifeBuoy />}
      title="Support"
      description="Fill out this form to get in contact with the team."
    />
  );
};
