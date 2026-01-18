export const filterUnwrap = <T>(item: T | null | undefined): item is T =>
  item !== null && item !== undefined;

export const filterUnwrapProperty =
  <T, K extends keyof T>(property: K) =>
  (item: T): item is T & { [P in K]: NonNullable<T[P]> } =>
    filterUnwrap(item[property]);
