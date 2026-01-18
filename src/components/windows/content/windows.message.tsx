"use client";

import { useWindowActions } from "../provider";

const DUMMY_CONVERSATIONS = [
  { id: "1", name: "vitalik.eth", avatar: "https://i.pravatar.cc/150?u=vitalik", lastMessage: "gm! have you seen the latest...", time: "2m", unread: 2 },
  { id: "2", name: "jesse.base.eth", avatar: "https://i.pravatar.cc/150?u=jesse", lastMessage: "that's a great idea for the...", time: "15m", unread: 0 },
  { id: "3", name: "dwr.eth", avatar: "https://i.pravatar.cc/150?u=dwr", lastMessage: "shipped it!", time: "1h", unread: 1 },
  { id: "4", name: "linda.eth", avatar: "https://i.pravatar.cc/150?u=linda", lastMessage: "can you review the PR?", time: "3h", unread: 0 },
  { id: "5", name: "ccarella.eth", avatar: "https://i.pravatar.cc/150?u=ccarella", lastMessage: "looking forward to it", time: "1d", unread: 0 },
  { id: "6", name: "0xdesigner", avatar: "https://i.pravatar.cc/150?u=designer", lastMessage: "here's the new mockup", time: "2d", unread: 0 },
];

export function MessageWindowContent() {
  const { addWindow } = useWindowActions();

  const openConversation = (id: string, name: string) => {
    addWindow({ type: "conversation", recipientId: id, recipientName: name });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {DUMMY_CONVERSATIONS.map((convo) => (
          <div
            key={convo.id}
            onClick={() => openConversation(convo.id, convo.name)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
          >
            <div className="relative">
              <img
                src={convo.avatar}
                alt={convo.name}
                className="size-10 rounded-full"
              />
              {convo.unread > 0 && (
                <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  {convo.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm truncate">{convo.name}</p>
                <p className="text-xs text-muted-foreground shrink-0">{convo.time}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
