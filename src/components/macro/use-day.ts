import { useEffect, useMemo, useState, type FormEvent } from "react";
import { analyze } from "@/lib/nutrition/calc";
import { BASE_FOODS, EMPTY_MEALS, PRESETS, SAMPLE_MEALS, entryFromFood } from "@/lib/nutrition/foods";
import { loadState, saveState } from "@/lib/nutrition/storage";
import { suggestFills } from "@/lib/nutrition/suggest";
import type { Category, Food, Goals, MealId, Meals } from "@/lib/nutrition/types";

export type CustomDraft = {
  name: string;
  kcal: string;
  p: string;
  c: string;
  f: string;
  salt: string;
  grams: string;
  saveToDb: boolean;
};

const emptyDraft = (): CustomDraft => ({
  name: "",
  kcal: "",
  p: "",
  c: "",
  f: "",
  salt: "",
  grams: "100",
  saveToDb: true,
});

export function useDay() {
  const [customFoods, setCustomFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meals>(SAMPLE_MEALS);
  const [goals, setGoals] = useState<Goals>(PRESETS.recomp);
  const [preset, setPreset] = useState("recomp");
  const [ready, setReady] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealId>("breakfast");
  const [portion, setPortion] = useState(100);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"Sve" | Category>("Sve");
  const [onlyLowSalt, setOnlyLowSalt] = useState(false);
  const [panel, setPanel] = useState<"meals" | "foods">("meals");
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [draft, setDraft] = useState<CustomDraft>(emptyDraft);
  const [confirm, setConfirm] = useState<null | "reset" | "sample">(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setCustomFoods(saved.customFoods);
      setMeals(saved.meals);
      setGoals(saved.goals);
      setPreset(saved.preset);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ v: 1, customFoods, meals, goals, preset });
  }, [ready, customFoods, meals, goals, preset]);

  const foodDb = useMemo(() => [...customFoods, ...BASE_FOODS], [customFoods]);
  const analytics = useMemo(() => analyze(meals), [meals]);
  const suggestions = useMemo(
    () => suggestFills(foodDb, meals, goals),
    [foodDb, meals, goals],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foodDb.filter((item) => {
      if (q && !item.name.toLowerCase().includes(q)) return false;
      if (category !== "Sve" && item.category !== category) return false;
      if (onlyLowSalt && item.salt >= 1) return false;
      return true;
    });
  }, [foodDb, query, category, onlyLowSalt]);

  function focusMeal(id: MealId) {
    setActiveMeal(id);
    setPanel("meals");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      document.getElementById(`meal-${id}`)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function addFood(food: Food, mealId = activeMeal, grams = portion) {
    setMeals((prev) => ({
      ...prev,
      [mealId]: [...prev[mealId], entryFromFood(food, grams)],
    }));
    focusMeal(mealId);
  }

  function addSnapshot(
    food: Omit<Food, "id" | "category"> & { category?: Category },
    mealId: MealId,
    grams: number,
    save: boolean,
  ) {
    const item: Food = {
      id: `custom_${crypto.randomUUID()}`,
      name: food.name.trim(),
      kcal: food.kcal,
      p: food.p,
      c: food.c,
      f: food.f,
      salt: food.salt,
      category: food.category ?? "Vlastito",
    };
    if (save) setCustomFoods((prev) => [item, ...prev.filter((row) => row.name !== item.name)]);
    addFood(item, mealId, grams);
  }

  function updateGrams(mealId: MealId, entryId: string, grams: number) {
    const next = Math.max(0, Math.min(2500, Math.round(Number(grams) || 0)));
    setMeals((prev) => ({
      ...prev,
      [mealId]: prev[mealId].map((item) => (item.entryId === entryId ? { ...item, grams: next } : item)),
    }));
  }

  function removeEntry(mealId: MealId, entryId: string) {
    setMeals((prev) => ({
      ...prev,
      [mealId]: prev[mealId].filter((item) => item.entryId !== entryId),
    }));
  }

  function replaceEntry(mealId: MealId, entryId: string, food: Food) {
    setMeals((prev) => ({
      ...prev,
      [mealId]: prev[mealId].map((item) =>
        item.entryId === entryId
          ? {
              ...entryFromFood(food, item.grams),
              entryId: item.entryId,
            }
          : item,
      ),
    }));
  }

  function applyPreset(key: string) {
    const next = PRESETS[key];
    if (!next) return;
    setPreset(key);
    setGoals({ kcal: next.kcal, p: next.p, c: next.c, f: next.f, maxSalt: next.maxSalt });
  }

  function editGoal(patch: Partial<Goals>) {
    setPreset("custom");
    setGoals((prev) => ({ ...prev, ...patch }));
  }

  function submitCustom(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    addSnapshot(
      {
        name: draft.name,
        kcal: Number(draft.kcal) || 0,
        p: Number(draft.p) || 0,
        c: Number(draft.c) || 0,
        f: Number(draft.f) || 0,
        salt: Number(draft.salt) || 0,
        category: "Vlastito",
      },
      activeMeal,
      Number(draft.grams) || 100,
      draft.saveToDb,
    );
    setDraft(emptyDraft());
    setCustomOpen(false);
  }

  function removeCustom(id: string) {
    setCustomFoods((prev) => prev.filter((item) => item.id !== id));
  }

  return {
    ready,
    meals,
    goals,
    preset,
    foodDb,
    analytics,
    suggestions,
    filtered,
    activeMeal,
    setActiveMeal,
    portion,
    setPortion,
    query,
    setQuery,
    category,
    setCategory,
    onlyLowSalt,
    setOnlyLowSalt,
    panel,
    setPanel,
    goalsOpen,
    setGoalsOpen,
    customOpen,
    setCustomOpen,
    draft,
    setDraft,
    confirm,
    setConfirm,
    copied,
    setCopied,
    addFood,
    addSnapshot,
    updateGrams,
    removeEntry,
    replaceEntry,
    applyPreset,
    editGoal,
    submitCustom,
    removeCustom,
    loadSample: () => {
      setMeals(SAMPLE_MEALS);
      setConfirm(null);
    },
    resetDay: () => {
      setMeals(EMPTY_MEALS);
      setConfirm(null);
    },
  };
}

export type DayState = ReturnType<typeof useDay>;
