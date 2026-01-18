import { SidebarPage } from "~/components/sidebar/sidebar.page";
import { Skeleton } from "~/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <SidebarPage showHeader={false}>
      <div className="h-full w-full p-4">
        <Skeleton className="h-full w-full" />
      </div>
    </SidebarPage>
  );
}
