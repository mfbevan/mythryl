"use client";

import { use } from "react";
import {
  SidebarPage,
  SidebarPageContent,
} from "~/components/sidebar/sidebar.page";
import { SidebarPageHeader } from "~/components/sidebar/sidebar.page-header";
import { ProfileContent } from "./_components/profile.content";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { username } = use(params);

  return (
    <SidebarPage>
      <SidebarPageHeader />

      <SidebarPageContent>
        <ProfileContent username={username} />
      </SidebarPageContent>
    </SidebarPage>
  );
};

export default ProfilePage;
