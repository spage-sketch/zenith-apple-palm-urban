import type { Category, Food, Goals, MealId, Meals } from "./types";

export const PRESETS: Record<string, Goals & { name: string; detail: string }> = {
  deficit: {
    name: "Rezanje",
    detail: "Manjak, visoki proteini",
    kcal: 1950,
    p: 175,
    c: 165,
    f: 65,
    maxSalt: 4,
  },
  recomp: {
    name: "Održavanje",
    detail: "Rekompozicija",
    kcal: 2400,
    p: 185,
    c: 240,
    f: 78,
    maxSalt: 5,
  },
  bulk: {
    name: "Masa",
    detail: "Blagi suficit",
    kcal: 2900,
    p: 195,
    c: 345,
    f: 82,
    maxSalt: 5,
  },
};

function food(
  id: string,
  name: string,
  kcal: number,
  p: number,
  c: number,
  f: number,
  salt: number,
  category: Category,
): Food {
  return { id, name, kcal, p, c, f, salt, category };
}

/** Tipične vrijednosti na 100 g. Sol je u gramima, ne natrij u mg. */
export const BASE_FOODS: Food[] = [
  food("f1", "Pileća prsa, pečena", 165, 31, 0, 3.6, 0.15, "Meso i riba"),
  food("f2", "Pureća prsa, pečena", 135, 30, 0, 1, 0.12, "Meso i riba"),
  food("f3", "Losos, pečeni", 206, 22, 0, 12.5, 0.12, "Meso i riba"),
  food("f4", "Oslić, pečeni", 90, 20.1, 0, 0.6, 0.14, "Meso i riba"),
  food("f5", "Junetina, nemasni odrezak", 187, 27.5, 0, 8.2, 0.12, "Meso i riba"),
  food("f6", "Tuna u vlastitom soku, ocijeđena", 116, 25.5, 0, 1, 0.4, "Meso i riba"),
  food("f7", "Tuna u salamuri, ocijeđena", 113, 24, 0, 1, 1.2, "Meso i riba"),
  food("f8", "Pileća prsa u ovitku", 105, 21, 1, 2, 1.85, "Meso i riba"),
  food("f9", "Pršut", 241, 32, 0.5, 12, 4.6, "Meso i riba"),
  food("f10", "Posni svježi sir", 72, 12, 4, 0.5, 0.1, "Mliječno i jaja"),
  food("f11", "Skyr, natur", 63, 11, 4, 0.2, 0.1, "Mliječno i jaja"),
  food("f12", "Grčki jogurt 0%", 57, 10.3, 3.6, 0.2, 0.1, "Mliječno i jaja"),
  food("f13", "Kefir 1,5%", 52, 3.4, 4, 1.5, 0.12, "Mliječno i jaja"),
  food("f14", "Zrnati sir, neslani", 98, 11, 3.4, 4.3, 0.7, "Mliječno i jaja"),
  food("f15", "Jaje, cijelo kuhano", 155, 13, 1.1, 11, 0.31, "Mliječno i jaja"),
  food("f16", "Bjelanjak", 52, 11, 0.7, 0.2, 0.36, "Mliječno i jaja"),
  food("f17", "Whey izolat", 370, 86, 3, 1, 0.45, "Mliječno i jaja"),
  food("f18", "Zobene pahuljice, suhe", 372, 13.5, 58.7, 7, 0.02, "Ugljikohidrati"),
  food("f19", "Bijela riža, kuhana", 130, 2.7, 28, 0.3, 0.01, "Ugljikohidrati"),
  food("f20", "Krumpir, kuhani", 87, 1.9, 20, 0.1, 0.01, "Ugljikohidrati"),
  food("f21", "Batat, pečeni", 90, 2, 20.7, 0.2, 0.04, "Ugljikohidrati"),
  food("f22", "Heljda, kuhana", 110, 3.8, 20, 0.9, 0.01, "Ugljikohidrati"),
  food("f23", "Tjestenina, kuhana", 131, 5, 25, 1.1, 0.01, "Ugljikohidrati"),
  food("f24", "Integralni kruh", 247, 9, 41, 3.4, 1.1, "Ugljikohidrati"),
  food("f25", "Banana", 89, 1.1, 22.8, 0.3, 0, "Voće i povrće"),
  food("f26", "Borovnice", 57, 0.7, 14.5, 0.3, 0, "Voće i povrće"),
  food("f27", "Jabuka", 52, 0.3, 14, 0.2, 0, "Voće i povrće"),
  food("f28", "Brokula, kuhana", 35, 2.4, 7.2, 0.4, 0.04, "Voće i povrće"),
  food("f29", "Špinat, svježi", 23, 2.9, 3.6, 0.4, 0.08, "Voće i povrće"),
  food("f30", "Rajčica", 18, 0.9, 3.9, 0.2, 0.01, "Voće i povrće"),
  food("f31", "Miješana salata", 15, 1.4, 2.2, 0.2, 0.03, "Voće i povrće"),
  food("f32", "Avokado", 160, 2, 8.5, 14.7, 0.01, "Voće i povrće"),
  food("f33", "Maslinovo ulje", 884, 0, 0, 100, 0, "Masti i grickalice"),
  food("f34", "Bademi", 579, 21.2, 21.6, 49.9, 0.01, "Masti i grickalice"),
  food("f35", "Maslac od kikirikija, neslani", 588, 25, 20, 50, 0.02, "Masti i grickalice"),
  food("f36", "Tamna čokolada 85%", 580, 9.5, 19, 46, 0.02, "Masti i grickalice"),
  food("f37", "Chia sjemenke", 486, 17, 42, 31, 0.02, "Masti i grickalice"),
];

export const EMPTY_MEALS: Meals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snack: [],
};

function entry(
  entryId: string,
  foodId: string,
  grams: number,
): Meals[MealId][number] {
  const item = BASE_FOODS.find((f) => f.id === foodId);
  if (!item) throw new Error(`Missing food ${foodId}`);
  return {
    entryId,
    foodId: item.id,
    name: item.name,
    grams,
    kcal100: item.kcal,
    p100: item.p,
    c100: item.c,
    f100: item.f,
    salt100: item.salt,
    category: item.category,
  };
}

export const SAMPLE_MEALS: Meals = {
  breakfast: [
    entry("s1", "f18", 70),
    entry("s2", "f10", 200),
    entry("s3", "f25", 120),
  ],
  lunch: [
    entry("s4", "f1", 200),
    entry("s5", "f19", 220),
    entry("s6", "f28", 150),
    entry("s7", "f33", 10),
  ],
  dinner: [
    entry("s8", "f2", 180),
    entry("s9", "f20", 250),
    entry("s10", "f15", 100),
  ],
  snack: [
    entry("s11", "f11", 200),
    entry("s12", "f36", 20),
  ],
};

export function entryFromFood(item: Food, grams: number): Meals[MealId][number] {
  return {
    entryId: `e_${crypto.randomUUID()}`,
    foodId: item.id,
    name: item.name,
    grams,
    kcal100: item.kcal,
    p100: item.p,
    c100: item.c,
    f100: item.f,
    salt100: item.salt,
    category: item.category,
  };
}
