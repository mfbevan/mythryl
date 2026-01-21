"use client";

import { SendHorizonal, SearchIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { cn } from "~/lib/utils";
import { useAppsFilters } from "./apps.hooks";
import { APP_CATEGORIES } from "./apps.categories";

export const AppsFilters = () => {
  const { searchInput, category, setSearchInput, submitSearch, setCategory } =
    useAppsFilters();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleCategoryClick = (key: string) => {
    setCategory(category === key ? null : key);
  };

  return (
    <div className="flex flex-col gap-4">
      <InputGroup className="flex-1 rounded-full">
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search apps..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={submitSearch}
            size="icon-xs"
            className="rounded-full"
            variant="default"
          >
            <SendHorizonal className="size-3" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {APP_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-white transition-all",
                cat.bg,
                isSelected ? "opacity-100" : "opacity-60 hover:opacity-80",
              )}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <Icon className="size-3" />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
