export type RecommenderOption = {
  id: string;
  label: string;
  categorySlugs?: string[];
  disciplineSlugs?: string[];
};

export const RECOMMENDER_OPTIONS: RecommenderOption[] = [
  {
    id: "reader",
    label: "I like to read a lot of books",
    categorySlugs: ["talks"],
    disciplineSlugs: ["theatre"],
  },
  {
    id: "theatre",
    label: "I like to watch theatre",
    categorySlugs: ["performances"],
    disciplineSlugs: ["theatre"],
  },
  {
    id: "exhibitions",
    label: "I like to enjoy art exhibitions",
    categorySlugs: ["exhibitions"],
    disciplineSlugs: ["visual-arts"],
  },
  {
    id: "foodie",
    label: "I’m a foodie and love different cuisines",
    disciplineSlugs: ["culinary-arts"],
  },
  {
    id: "children",
    label: "I have children who’d enjoy stimulating programmes",
    disciplineSlugs: ["childrens-programmes"],
  },
  {
    id: "crafts",
    label: "I’m into crafts — workshop or exhibition, either works",
    categorySlugs: ["workshops", "exhibitions"],
    disciplineSlugs: ["craft"],
  },
  {
    id: "films",
    label: "I’m a film enthusiast and love underrated films",
    categorySlugs: ["film-screening"],
  },
  {
    id: "workshops",
    label: "I just like attending workshops",
    categorySlugs: ["workshops"],
  },
  {
    id: "music",
    label: "I love live music",
    categorySlugs: ["performances"],
    disciplineSlugs: ["music"],
  },
  {
    id: "dance",
    label: "I love dance and movement",
    categorySlugs: ["performances"],
    disciplineSlugs: ["dance"],
  },
];
