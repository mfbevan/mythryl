import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";

export const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export const obscenityRefiner: [(val: string) => boolean, string] = [
  (val) => !matcher.hasMatch(val),
  "Contains inappropriate language",
];
