export const formatCategory = (category?: string | null) => {
  if (!category) return "Unknown";

  switch (category) {
    case "weapon":
      return "Weapons";
    case "armor":
      return "Armor";
    case "consumable":
      return "Consumables";
    case "cosmetic":
      return "Cosmetics";
    case "misc":
      return "Miscellaneous";
    default:
      return category;
  }
};

export const formatRarity = (rarity?: string | null) => {
  if (!rarity) return "Common";

  switch (rarity) {
    case "common":
      return "Common";
    case "uncommon":
      return "Uncommon";
    case "rare":
      return "Rare";
    case "epic":
      return "Epic";
    case "legendary":
      return "Legendary";
  }
};

export const formatTokenId = (tokenId: bigint) => {
  if (tokenId.toString().length > 10) {
    return tokenId.toString().slice(0, 10) + "...";
  }
  return tokenId.toString();
};
