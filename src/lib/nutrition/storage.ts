import { MEAL_IDS, type Category, type Entry, type Food, type Goals, type MealId, type Meals } from "./types";

const KEY = "macrocore-day-v1";

export type Persisted = {
  v: 1;
  goals: Goals;
  preset: string;
  meals: Meals;
  customFoods: Food[];
};

function num(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asEntry(value: unknown): Entry | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<Entry>;
  if (typeof row.name !== "string" || !row.name.trim()) return null;
  return {
    entryId: typeof row.entryId === "string" ? row.entryId : `e_${Math.random().toString(36).slice(2)}`,
    foodId: typeof row.foodId === "string" ? row.foodId : "custom",
    name: row.name,
    grams: Math.max(0, Math.min(2500, num(row.grams))),
    kcal100: num(row.kcal100),
    p100: num(row.p100),
    c100: num(row.c100),
    f100: num(row.f100),
    salt100: num(row.salt100),
    category: (typeof row.category === "string" ? row.category : "Vlastito") as Category,
  };
}

function asFood(value: unknown): Food | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<Food>;
  if (typeof row.name !== "string" || !row.name.trim()) return null;
  return {
    id: typeof row.id === "string" ? row.id : `custom_${Math.random().toString(36).slice(2)}`,
    name: row.name,
    kcal: num(row.kcal),
    p: num(row.p),
    c: num(row.c),
    f: num(row.f),
    salt: num(row.salt),
    category: "Vlastito",
  };
}

export function loadState(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Persisted>;
    if (data.v !== 1 || !data.goals || !data.meals) return null;
    const meals = {} as Meals;
    for (const id of MEAL_IDS) {
      const list = (data.meals as Partial<Record<MealId, unknown>>)[id];
      meals[id] = Array.isArray(list) ? list.map(asEntry).filter((item): item is Entry => !!item) : [];
    }
    return {
      v: 1,
      preset: typeof data.preset === "string" ? data.preset : "custom",
      goals: {
        kcal: Math.max(500, num(data.goals.kcal, 2400)),
        p: Math.max(20, num(data.goals.p, 185)),
        c: Math.max(0, num(data.goals.c, 240)),
        f: Math.max(10, num(data.goals.f, 78)),
        maxSalt: Math.max(1, num(data.goals.maxSalt, 5)),
      },
      meals,
      customFoods: Array.isArray(data.customFoods)
        ? data.customFoods.map(asFood).filter((item): item is Food => !!item)
        : [],
    };
  } catch {
    return null;
  }
}

export function saveState(state: Persisted) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
