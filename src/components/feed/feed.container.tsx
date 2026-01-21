"use client";

import { FeedList } from "./feed.list";
import { SidebarPageHeader } from "../sidebar/sidebar.page-header";
import { navigation } from "../navigation/navigation";
import { PageTabs } from "~/components/page-tabs";
import { useFeedTabs } from "./feed.hooks";
import { SidebarPageContent } from "../sidebar/sidebar.page";

export const FeedContainer = () => {
  const { activeTab, tabs, setActiveTab } = useFeedTabs();

  return (
    <>
      <SidebarPageHeader navigation={navigation.home} centered>
        <PageTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </SidebarPageHeader>

      <SidebarPageContent>
        <FeedList feedType={activeTab} />
      </SidebarPageContent>
    </>
  );
};
