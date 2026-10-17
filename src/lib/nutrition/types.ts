export const MEAL_IDS = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealId = (typeof MEAL_IDS)[number];

export const CATEGORIES = [
  "Meso i riba",
  "Mliječno i jaja",
  "Ugljikohidrati",
  "Voće i povrće",
  "Masti i grickalice",
  "Vlastito",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SALT_LIMIT = 1;

export type Food = {
  id: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  salt: number;
  category: Category;
};

export type Entry = {
  entryId: string;
  foodId: string;
  name: string;
  grams: number;
  kcal100: number;
  p100: number;
  c100: number;
  f100: number;
  salt100: number;
  category: Category;
};

export type Meals = Record<MealId, Entry[]>;

export type Goals = {
  kcal: number;
  p: number;
  c: number;
  f: number;
  maxSalt: number;
};

export type MacroTotals = {
  kcal: number;
  p: number;
  c: number;
  f: number;
  salt: number;
  grams: number;
};

export type MealTotals = MacroTotals & { avgSaltPer100g: number };

export type Analytics = {
  totals: MacroTotals & { highSaltItems: number };
  byMeal: Record<MealId, MealTotals>;
  split: { pPct: number; cPct: number; fPct: number };
  avgDailySaltDensity: number;
};

export type Suggestion = {
  food: Food;
  grams: number;
  mealId: MealId;
  kcal: number;
  p: number;
  c: number;
  f: number;
  salt: number;
};

export const MEAL_LABEL: Record<MealId, string> = {
  breakfast: "Doručak",
  lunch: "Ručak",
  dinner: "Večera",
  snack: "Međuobrok",
};

export const MEAL_HINT: Record<MealId, string> = {
  breakfast: "Jutarnji unos",
  lunch: "Glavni obrok",
  dinner: "Večernji oporavak",
  snack: "Dopuna između obroka",
};
