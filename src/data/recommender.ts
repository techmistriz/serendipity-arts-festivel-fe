export type RecommenderOption = {
  id: string;
  label: string;
  match: string[];
};

export const RECOMMENDER_OPTIONS: RecommenderOption[] = [
  { id: "reader", label: "I like to read a lot of books", match: ["Talk", "Theatre"] },
  { id: "theatre", label: "I like to watch theatre", match: ["Theatre", "Performance"] },
  {
    id: "exhibitions",
    label: "I like to enjoy art exhibitions",
    match: ["Exhibition", "Visual Arts"],
  },
  {
    id: "foodie",
    label: "I’m a foodie and love different cuisines",
    match: ["Culinary Arts"],
  },
  {
    id: "children",
    label: "I have children who’d enjoy stimulating programmes",
    match: ["Children’s Programmes"],
  },
  {
    id: "crafts",
    label: "I’m into crafts — workshop or exhibition, either works",
    match: ["Crafts", "Workshop"],
  },
  {
    id: "films",
    label: "I’m a film enthusiast and love underrated films",
    match: ["Film Screening"],
  },
  { id: "workshops", label: "I just like attending workshops", match: ["Workshop"] },
  { id: "music", label: "I love live music", match: ["Music", "Performance"] },
  { id: "dance", label: "I love dance and movement", match: ["Dance", "Performance"] },
];
