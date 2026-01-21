"use client";

import { SidebarPageHeader } from "~/components/sidebar/sidebar.page-header";
import { navigation } from "~/components/navigation/navigation";
import { PageTabs } from "~/components/page-tabs";
import { useAppsTabs } from "./apps.hooks";
import { AppsFilters } from "./apps.filters";
import { AppsList } from "./apps.list";
import { AppsMyApps } from "./apps.my-apps";
import { AppsFavorites } from "./apps.favorites";
import { AppsCategoriesGrid } from "./apps.categories-grid";
import { SidebarPageContent } from "~/components/sidebar/sidebar.page";

export const AppsContainer = () => {
  const { activeTab, tabs, setActiveTab } = useAppsTabs();

  return (
    <>
      <SidebarPageHeader navigation={navigation.apps}>
        <PageTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </SidebarPageHeader>

      <SidebarPageContent className="space-y-4 p-4">
        {activeTab === "discover" && (
          <>
            <AppsFilters />
            <AppsList />
          </>
        )}
        {activeTab === "categories" && <AppsCategoriesGrid />}
        {activeTab === "my_apps" && <AppsMyApps />}
        {activeTab === "favorites" && <AppsFavorites />}
      </SidebarPageContent>
    </>
  );
};
