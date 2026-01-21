"use client";

import { APP_CATEGORIES } from "./apps.categories";
import { CategoryCard } from "./apps.category-card";

export const AppsCategoriesGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {APP_CATEGORIES.map((category) => (
        <CategoryCard key={category.key} category={category} />
      ))}
    </div>
  );
};
