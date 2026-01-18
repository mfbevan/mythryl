import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { ConnectToken } from "./_components/connect.token";

export default function ConnectPage() {
  return (
    <SidebarPage className="relative" showHeader={false}>
      <ConnectToken />
    </SidebarPage>
  );
}
