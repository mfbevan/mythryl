import { navigation } from "~/components/navigation/navigation";
import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { SupportForm } from "./_components/support.form";
import { SupportHeader } from "./_components/support.header";

export default function SupportPage() {
  return (
    <SidebarPage
      breadcrumbs={[navigation.support]}
      className="flex h-screen flex-col"
    >
      <SupportHeader />
      <div className="flex-1">
        <SupportForm />
      </div>
    </SidebarPage>
  );
}
