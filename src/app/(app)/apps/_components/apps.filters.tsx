"use client";

import { SearchIcon, XIcon } from "lucide-react";
import type { KeyboardEvent } from "react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAppsFilters } from "./apps.hooks";
import { APP_CATEGORIES } from "./apps.categories";

export const AppsFilters = () => {
  const {
    searchInput,
    category,
    hasFilters,
    setSearchInput,
    submitSearch,
    setCategory,
    clearFilters,
  } = useAppsFilters();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 sm:max-w-xs">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search apps..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={submitSearch} size="sm">
          Search
        </Button>

        <Select
          value={category ?? "all"}
          onValueChange={(value) => setCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" chevron>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {APP_CATEGORIES.map((cat) => (
              <SelectItem key={cat.key} value={cat.key}>
                <div className="flex items-center gap-2">
                  <cat.icon className="size-4" />
                  {cat.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
