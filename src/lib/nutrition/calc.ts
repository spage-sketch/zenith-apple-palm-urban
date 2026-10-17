import { MEAL_IDS, SALT_LIMIT, type Analytics, type Entry, type Meals } from "./types";

export function scaleEntry(entry: Entry) {
  const factor = (Number(entry.grams) || 0) / 100;
  return {
    kcal: entry.kcal100 * factor,
    p: entry.p100 * factor,
    c: entry.c100 * factor,
    f: entry.f100 * factor,
    salt: entry.salt100 * factor,
  };
}

export function macroKcal(p: number, c: number, f: number) {
  return p * 4 + c * 4 + f * 9;
}

export function analyze(meals: Meals): Analytics {
  const totals = { kcal: 0, p: 0, c: 0, f: 0, salt: 0, grams: 0, highSaltItems: 0 };
  const byMeal = {} as Analytics["byMeal"];

  for (const id of MEAL_IDS) {
    const sub = { kcal: 0, p: 0, c: 0, f: 0, salt: 0, grams: 0 };
    for (const item of meals[id]) {
      const scaled = scaleEntry(item);
      sub.kcal += scaled.kcal;
      sub.p += scaled.p;
      sub.c += scaled.c;
      sub.f += scaled.f;
      sub.salt += scaled.salt;
      sub.grams += Number(item.grams) || 0;
      if (item.salt100 >= SALT_LIMIT) totals.highSaltItems += 1;
    }
    byMeal[id] = {
      ...sub,
      avgSaltPer100g: sub.grams > 0 ? (sub.salt / sub.grams) * 100 : 0,
    };
    totals.kcal += sub.kcal;
    totals.p += sub.p;
    totals.c += sub.c;
    totals.f += sub.f;
    totals.salt += sub.salt;
    totals.grams += sub.grams;
  }

  const pKcal = totals.p * 4;
  const cKcal = totals.c * 4;
  const fKcal = totals.f * 9;
  const sum = pKcal + cKcal + fKcal;
  const split =
    sum <= 0
      ? { pPct: 0, cPct: 0, fPct: 0 }
      : {
          pPct: Math.round((pKcal / sum) * 100),
          cPct: Math.round((cKcal / sum) * 100),
          fPct: 0,
        };
  if (sum > 0) split.fPct = Math.max(0, 100 - split.pPct - split.cPct);

  return {
    totals,
    byMeal,
    split,
    avgDailySaltDensity: totals.grams > 0 ? (totals.salt / totals.grams) * 100 : 0,
  };
}

export function fmt(value: number, digits: number) {
  return value.toLocaleString("hr-HR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtInt(value: number) {
  return Math.round(value).toLocaleString("hr-HR");
}
