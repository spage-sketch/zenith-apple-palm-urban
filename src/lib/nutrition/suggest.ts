import { analyze } from "./calc";
import { MEAL_IDS, type Food, type Goals, type Meals, type Suggestion } from "./types";

const PORTIONS = [40, 60, 80, 100, 120, 150, 180, 200, 250, 300];

function fit(need: number, add: number, weight: number) {
  if (need <= 0) return -add * weight * 1.5;
  const covered = Math.min(need, add);
  const over = Math.max(0, add - need);
  return covered * weight - over * weight * 1.7;
}

function lowestMeal(meals: Meals) {
  const stats = analyze(meals);
  return MEAL_IDS.reduce((best, id) =>
    stats.byMeal[id].kcal < stats.byMeal[best].kcal ? id : best,
  );
}

export function suggestFills(foods: Food[], meals: Meals, goals: Goals): Suggestion[] {
  const stats = analyze(meals);
  if (stats.totals.grams < 1) return [];

  const rem = {
    kcal: goals.kcal - stats.totals.kcal,
    p: goals.p - stats.totals.p,
    c: goals.c - stats.totals.c,
    f: goals.f - stats.totals.f,
    salt: goals.maxSalt - stats.totals.salt,
  };

  if (rem.kcal < 90 && rem.p < 10 && rem.c < 15 && rem.f < 6) return [];

  const mealId = lowestMeal(meals);
  const ranked: Array<Suggestion & { score: number }> = [];

  for (const food of foods) {
    if (food.salt >= 1) continue;
    let best: (Suggestion & { score: number }) | null = null;
    for (const grams of PORTIONS) {
      const factor = grams / 100;
      const add = {
        kcal: food.kcal * factor,
        p: food.p * factor,
        c: food.c * factor,
        f: food.f * factor,
        salt: food.salt * factor,
      };
      if (add.salt > Math.max(0.15, rem.salt)) continue;
      if (rem.kcal > 0 && add.kcal > rem.kcal + 140) continue;
      if (rem.kcal <= 0 && add.kcal > 90) continue;
      const score =
        fit(rem.p, add.p, 3.1) +
        fit(rem.c, add.c, 1.15) +
        fit(rem.f, add.f, 1.35) +
        fit(rem.kcal, add.kcal, 0.018);
      if (!best || score > best.score) {
        best = { food, grams, mealId, ...add, score };
      }
    }
    if (best && best.score > 8) ranked.push(best);
  }

  ranked.sort((a, b) => b.score - a.score);
  const picked: typeof ranked = [];
  for (const item of ranked) {
    if (picked.some((p) => p.food.category === item.food.category && p.food.id !== item.food.id)) {
      if (picked.length >= 2 && picked.filter((p) => p.food.category === item.food.category).length) {
        continue;
      }
    }
    picked.push(item);
    if (picked.length === 3) break;
  }
  return picked;
}

export function lowSaltSwap(current: { category: Food["category"]; salt100: number; name: string }, foods: Food[]) {
  if (current.salt100 < 1) return null;
  const tokens = current.name
    .toLowerCase()
    .split(/[^a-zčćžšđ0-9]+/i)
    .filter((word) => word.length > 3);
  const alts = foods.filter(
    (food) => food.category === current.category && food.salt < 0.5 && food.name !== current.name,
  );
  alts.sort((a, b) => likeness(b) - likeness(a));
  return alts[0] ?? null;

  function likeness(food: Food) {
    const name = food.name.toLowerCase();
    const overlap = tokens.reduce((sum, word) => sum + (name.includes(word) ? 1 : 0), 0);
    return overlap * 5 + (0.5 - food.salt) + food.p / 200;
  }
}
