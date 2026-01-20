import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { FeedContainer } from "~/components/feed";

export default function HomePage() {
  return (
    <SidebarPage showHeader={false} className="relative !overflow-hidden">
      <FeedContainer />
    </SidebarPage>
  );
}
