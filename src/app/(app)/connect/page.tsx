import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { WalletSignIn } from "~/components/wallet/wallet.signin";

export default function ConnectPage() {
  return (
    <SidebarPage className="relative" showHeader={false}>
      <WalletSignIn />
    </SidebarPage>
  );
}
