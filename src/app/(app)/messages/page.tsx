"use client";

import { SidebarPage } from "~/components/sidebar/sidebar.page";
import {
  ConversationsList,
  ChatView,
  NewConversationMenu,
} from "~/components/messages";
import { useMessagesStore } from "~/components/messages";

export default function MessagesPage() {
  const { activeConversationId } = useMessagesStore();

  return (
    <SidebarPage breadcrumbs={[{ href: "/messages", label: "Messages" }]}>
      <div className="flex h-full">
        {/* Conversation List - hidden on mobile when chat is open */}
        <div
          className={`${
            activeConversationId ? "hidden md:flex" : "flex"
          } w-full flex-col border-r md:w-80`}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">Messages</h2>
            <NewConversationMenu />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationsList />
          </div>
        </div>

        {/* Chat View - full width on mobile, flex-1 on desktop */}
        <div
          className={`${
            activeConversationId ? "flex" : "hidden md:flex"
          } min-w-0 flex-1 flex-col`}
        >
          <ChatView />
        </div>
      </div>
    </SidebarPage>
  );
}
