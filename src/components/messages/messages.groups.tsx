"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Plus, Users, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

import { useCreateDm, useCreateGroup } from "./messages.hooks";
import { useMessages } from "./messages.provider";

export const NewConversationMenu = () => {
  const [mounted, setMounted] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const { isReady } = useMessages();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="icon" variant="ghost" disabled>
        <Plus className="size-4" />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" disabled={!isReady}>
            <Plus className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDmOpen(true)}>
            <MessageSquare className="size-4" />
            New Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setGroupOpen(true)}>
            <Users className="size-4" />
            New Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NewDmDialog open={dmOpen} onOpenChange={setDmOpen} />
      <NewGroupDialog open={groupOpen} onOpenChange={setGroupOpen} />
    </>
  );
};

const NewDmDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [address, setAddress] = useState("");
  const createDm = useCreateDm();

  const handleCreate = async () => {
    if (!address.trim()) return;
    await createDm.mutateAsync(address.trim());
    onOpenChange(false);
    setAddress("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setAddress("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Start a conversation with another user
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
          }}
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            isLoading={createDm.isPending}
            disabled={!address.trim()}
          >
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NewGroupDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberInput, setMemberInput] = useState("");
  const createGroup = useCreateGroup();

  const handleAddMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (member: string) => {
    setMembers(members.filter((m) => m !== member));
  };

  const handleCreate = async () => {
    if (members.length < 1) return;
    await createGroup.mutateAsync({
      memberAddresses: members,
      groupName: groupName.trim() || undefined,
    });
    onOpenChange(false);
    setGroupName("");
    setMembers([]);
  };

  const handleClose = () => {
    onOpenChange(false);
    setGroupName("");
    setMembers([]);
    setMemberInput("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Group</DialogTitle>
          <DialogDescription>
            Create a group chat with multiple members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Group name (optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add member address (0x...)"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddMember}>
                Add
              </Button>
            </div>
            {members.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <div
                    key={member}
                    className="bg-secondary flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                  >
                    <span className="max-w-32 truncate">{member}</span>
                    <button
                      onClick={() => handleRemoveMember(member)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            isLoading={createGroup.isPending}
            disabled={members.length < 1}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
