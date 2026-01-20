"use client";

import * as React from "react";
import { useDebounceValue } from "usehooks-ts";
import { Check } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import type { FarcasterUser } from "~/services/neynar.service";

export interface SearchFarcasterUsersProps {
  /**
   * Callback fired when a user is selected
   */
  onSelect: (user: FarcasterUser) => void;
  /**
   * Optional selected user to show in the trigger
   */
  selectedUser?: FarcasterUser | null;
  /**
   * Optional placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Optional trigger content. If not provided, a default button will be shown
   */
  trigger?: React.ReactNode;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;
  /**
   * Whether the popover is disabled
   */
  disabled?: boolean;
}

export function SearchFarcasterUsers({
  onSelect,
  selectedUser,
  placeholder = "Search users...",
  trigger,
  debounceMs = 300,
  disabled = false,
}: SearchFarcasterUsersProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedQuery] = useDebounceValue(searchQuery, debounceMs);

  const { data: searchResults, isLoading } =
    api.players.searchFarcasterUsers.useQuery(
      { query: debouncedQuery },
      {
        enabled: debouncedQuery.length > 0,
        staleTime: 1000 * 60, // Cache for 1 minute
      },
    );

  const handleSelect = React.useCallback(
    (user: FarcasterUser) => {
      onSelect(user);
      setOpen(false);
      setSearchQuery("");
    },
    [onSelect],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {trigger || (
          <button
            type="button"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedUser ? (
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarImage
                    src={selectedUser.pfp_url}
                    alt={selectedUser.display_name}
                  />
                  <AvatarFallback>
                    {selectedUser.display_name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {selectedUser.display_name || selectedUser.username}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] max-w-[400px] p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading && searchQuery.length > 0 && (
              <div className="text-muted-foreground py-6 text-center text-sm">
                Searching...
              </div>
            )}
            {!isLoading &&
              debouncedQuery.length > 0 &&
              searchResults?.result?.users?.length === 0 && (
                <CommandEmpty>No users found.</CommandEmpty>
              )}
            {searchResults?.result?.users &&
              searchResults.result.users.length > 0 && (
                <CommandGroup>
                  {searchResults.result.users.map((user) => (
                    <CommandItem
                      key={user.fid}
                      value={user.fid.toString()}
                      onSelect={() => handleSelect(user)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage
                            src={user.pfp_url}
                            alt={user.display_name}
                          />
                          <AvatarFallback>
                            {user.display_name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-medium">
                            {user.display_name || user.username}
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      {selectedUser?.fid === user.fid && (
                        <Check className="ml-auto size-4 shrink-0" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            {searchQuery.length === 0 && (
              <div className="text-muted-foreground py-6 text-center text-sm">
                Start typing
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
