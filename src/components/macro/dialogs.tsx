import { Camera, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { coachDayWithAi, parseMealWithAi } from "@/lib/nutrition/ai.functions";
import { fmt, fmtInt, macroKcal } from "@/lib/nutrition/calc";
import { MEAL_IDS, MEAL_LABEL, type Category, type MealId } from "@/lib/nutrition/types";
import type { DayState } from "./use-day";
import { Button, Field, Modal, SaltBadge, inputClass } from "./ui";

const CATEGORY_SET = new Set<string>([
  "Meso i riba",
  "Mliječno i jaja",
  "Ugljikohidrati",
  "Voće i povrće",
  "Masti i grickalice",
  "Vlastito",
]);

type Parsed = {
  name: string;
  grams: number;
  kcal100: number;
  p100: number;
  c100: number;
  f100: number;
  salt100: number;
  category: string;
};

export function CustomFoodDialog({ day }: { day: DayState }) {
  const salt = Number(day.draft.salt) || 0;
  const fromMacros = macroKcal(Number(day.draft.p) || 0, Number(day.draft.c) || 0, Number(day.draft.f) || 0);
  const stated = Number(day.draft.kcal) || 0;
  const drift = stated > 0 && Math.abs(fromMacros - stated) / stated > 0.2;

  return (
    <Modal
      title="Vlastita namirnica"
      subtitle="Vrijednosti s deklaracije, na 100 g."
      onClose={() => day.setCustomOpen(false)}
    >
      <form onSubmit={day.submitCustom} className="space-y-3">
        <Field label="Naziv">
          <input
            required
            value={day.draft.name}
            onChange={(event) => day.setDraft({ ...day.draft, name: event.target.value })}
            className={inputClass}
            placeholder="npr. Skyr jagoda"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="kcal / 100 g">
            <input required type="number" step="0.1" min="0" value={day.draft.kcal} onChange={(e) => day.setDraft({ ...day.draft, kcal: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Proteini">
            <input required type="number" step="0.1" min="0" value={day.draft.p} onChange={(e) => day.setDraft({ ...day.draft, p: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Ugljikohidrati">
            <input required type="number" step="0.1" min="0" value={day.draft.c} onChange={(e) => day.setDraft({ ...day.draft, c: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Masti">
            <input required type="number" step="0.1" min="0" value={day.draft.f} onChange={(e) => day.setDraft({ ...day.draft, f: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Sol, g / 100 g">
            <input required type="number" step="0.01" min="0" value={day.draft.salt} onChange={(e) => day.setDraft({ ...day.draft, salt: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Porcija, g">
            <input required type="number" step="1" min="1" value={day.draft.grams} onChange={(e) => day.setDraft({ ...day.draft, grams: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-bg px-3 py-2">
          <SaltBadge salt={salt} />
          <span className={`text-xs ${drift ? "text-salt" : "text-muted"}`}>
            Iz makrosa: {fmtInt(fromMacros)} kcal
          </span>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={day.draft.saveToDb}
            onChange={(event) => day.setDraft({ ...day.draft, saveToDb: event.target.checked })}
            className="size-4 accent-lime"
          />
          Spremi u bazu na ovom uređaju
        </label>
        <Button type="submit" variant="primary" className="w-full">
          Dodaj u {MEAL_LABEL[day.activeMeal].toLowerCase()}
        </Button>
      </form>
    </Modal>
  );
}

async function fileToJpeg(file: File) {
  const bitmap = await createImageBitmap(file);
  const max = 1280;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
  bitmap.close();
  return dataUrl.split(",")[1] ?? "";
}

export function ParserDialog({ day, onClose }: { day: DayState; onClose: () => void }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<Parsed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const base64 = await fileToJpeg(file);
      setImage(base64);
      setPreview(`data:image/jpeg;base64,${base64}`);
      setError("");
    } catch {
      setError("Sliku nisam mogao pročitati. Probaj JPG ili PNG.");
    }
  }

  async function run(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setItems([]);
    const result = await parseMealWithAi({ data: { text, imageBase64: image ?? undefined } });
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setItems(result.items);
  }

  function addOne(item: Parsed) {
    const known = day.foodDb.find((food) => food.name.toLowerCase() === item.name.toLowerCase());
    const category = (CATEGORY_SET.has(item.category) ? item.category : "Vlastito") as Category;
    if (known) {
      day.addFood(known, day.activeMeal, item.grams);
      return;
    }
    day.addSnapshot(
      {
        name: item.name,
        kcal: item.kcal100,
        p: item.p100,
        c: item.c100,
        f: item.f100,
        salt: item.salt100,
        category,
      },
      day.activeMeal,
      item.grams,
      true,
    );
  }

  return (
    <Modal
      wide
      title="Procijena obroka"
      subtitle="Opiši tanjur ili učitaj deklaraciju. Grok računa makrose i sol na 100 g."
      onClose={onClose}
    >
      <form onSubmit={run} className="space-y-3">
        <textarea
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="200 g pečenog lososa, 180 g batata, žlica maslinovog ulja"
          className="w-full rounded-xl bg-bg px-3 py-3 text-sm text-fg shadow-ring outline-none placeholder:text-faint"
        />
        <div className="flex flex-wrap gap-2">
          {[
            "200 g pečenog lososa i 150 g batata",
            "Omlet od 3 jaja i 100 g špinata",
            "200 g skyr-a i 30 g whey izolata",
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setText(sample)}
              className="rounded-lg bg-bg px-2.5 py-1.5 text-left text-xs text-muted hover:text-fg"
            >
              {sample}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-bg p-3">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Camera className="size-4 text-lime" />
            Fotografija tanjura ili deklaracije
          </div>
          <label className="inline-flex h-11 cursor-pointer items-center rounded-xl bg-surface-2 px-3 text-sm font-semibold text-fg">
            Odaberi
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(event) => void onFile(event.target.files?.[0])}
            />
          </label>
        </div>
        {preview ? (
          <div className="flex items-center justify-between gap-3">
            <img src={preview} alt="Pregled učitane fotografije" className="h-16 w-16 rounded-lg object-cover outline outline-fg/10 -outline-offset-1" />
            <button
              type="button"
              className="text-sm text-salt"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
            >
              Ukloni sliku
            </button>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Ide u {MEAL_LABEL[day.activeMeal].toLowerCase()}.</p>
          <Button type="submit" variant="primary" disabled={loading || (!text.trim() && !image)}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Procijeni
          </Button>
        </div>
      </form>
      {error ? <p className="mt-3 rounded-xl bg-salt/10 px-3 py-2 text-sm text-salt">{error}</p> : null}
      {items.length > 0 ? (
        <div className="mt-4 space-y-2 border-t border-line pt-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">Prepoznato</p>
            <Button
              variant="primary"
              onClick={() => {
                items.forEach(addOne);
                onClose();
              }}
            >
              Dodaj sve
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((item, index) => {
              const factor = item.grams / 100;
              return (
                <li key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-bg p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {item.name} <span className="text-muted">{item.grams} g</span>
                    </p>
                    <p className="mt-1 text-xs text-muted tabular-nums">
                      {fmtInt(item.kcal100 * factor)} kcal · {fmt(item.p100 * factor, 1)} P · sol {fmt(item.salt100 * factor, 2)} g
                    </p>
                    <div className="mt-1.5">
                      <SaltBadge salt={item.salt100} />
                    </div>
                  </div>
                  <Button onClick={() => addOne(item)}>Dodaj</Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </Modal>
  );
}

type CoachFood = Parsed & { reason: string; targetMeal: MealId };
type CoachResult = {
  score: number;
  headline: string;
  analysis: string;
  sodiumAdvice: string;
  tips: string[];
  recipeTitle: string;
  recipeSteps: string;
  foods: CoachFood[];
};

export function CoachDialog({ day, onClose }: { day: DayState; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CoachResult | null>(null);
  const [added, setAdded] = useState<Record<number, boolean>>({});

  async function run() {
    setLoading(true);
    setError("");
    const { analytics, goals, meals } = day;
    const lines = MEAL_IDS.map((id) => {
      const items = meals[id].map((item) => `${item.name} ${item.grams} g (sol ${item.salt100} g/100 g)`).join(", ");
      return `${MEAL_LABEL[id]}: ${items || "prazno"}`;
    }).join("\n");
    const names = day.foodDb
      .filter((food) => food.salt < 0.5)
      .slice(0, 24)
      .map((food) => food.name)
      .join(", ");
    const prompt = `Vrati JSON:
{"score":0,"headline":"","analysis":"","sodiumAdvice":"","tips":[""],"recipeTitle":"","recipeSteps":"","foods":[{"name":"","reason":"","targetMeal":"lunch","grams":0,"kcal100":0,"p100":0,"c100":0,"f100":0,"salt100":0,"category":"Vlastito"}]}
score 1-100. tips najviše 3. foods 2 ili 3, salt100 strogo ispod 0.5. targetMeal je breakfast, lunch, dinner ili snack.
Ako koristiš namirnicu iz popisa, prepiši točan naziv: ${names}.
Cilj: ${goals.kcal} kcal, P ${goals.p} g, UH ${goals.c} g, M ${goals.f} g, sol max ${goals.maxSalt} g.
Unos: ${Math.round(analytics.totals.kcal)} kcal, P ${analytics.totals.p.toFixed(1)}, UH ${analytics.totals.c.toFixed(1)}, M ${analytics.totals.f.toFixed(1)}, sol ${analytics.totals.salt.toFixed(2)} g, gustoća ${analytics.avgDailySaltDensity.toFixed(2)} g/100 g, visokosolnih stavki ${analytics.totals.highSaltItems}.
Obroci:
${lines}
Piši konkretno i kratko, na hrvatskom. Ako je dan prazan, reci to i predloži jednostavan niskosolni dan.`;

    const response = await coachDayWithAi({ data: { prompt } });
    setLoading(false);
    if (!response.ok) {
      setError(response.error);
      return;
    }
    setResult(response.result);
    setAdded({});
  }

  return (
    <Modal wide title="Analiza dana" subtitle="Jednokratni pregled unosa, soli i dopune. Ne zamjenjuje nutricionista." onClose={onClose}>
      <Button variant="primary" onClick={() => void run()} disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {result ? "Ponovi analizu" : "Pokreni analizu"}
      </Button>
      {error ? <p className="mt-3 rounded-xl bg-salt/10 px-3 py-2 text-sm text-salt">{error}</p> : null}
      {result ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-bg p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl text-fg">{result.headline}</h3>
              <span className="shrink-0 rounded-full bg-lime/15 px-2.5 py-1 text-sm font-semibold text-lime tabular-nums">
                {result.score}/100
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{result.analysis}</p>
            <p className="mt-3 text-sm text-fg">
              <span className="font-semibold">Sol. </span>
              {result.sodiumAdvice}
            </p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted">
            {result.tips.map((tip) => (
              <li key={tip} className="rounded-xl bg-bg px-3 py-2">{tip}</li>
            ))}
          </ul>
          {result.recipeTitle ? (
            <div className="rounded-xl bg-bg p-4">
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Priprema</p>
              <p className="mt-1 font-semibold">{result.recipeTitle}</p>
              <p className="mt-1 text-sm text-muted">{result.recipeSteps}</p>
            </div>
          ) : null}
          <ul className="space-y-2">
            {result.foods.map((food, index) => {
              const factor = food.grams / 100;
              const isAdded = added[index];
              return (
                <li key={`${food.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-bg p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {food.name} <span className="text-muted">{food.grams} g · {MEAL_LABEL[food.targetMeal]}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">{food.reason}</p>
                    <p className="mt-1 text-xs tabular-nums text-fg">
                      {fmtInt(food.kcal100 * factor)} kcal · {fmt(food.p100 * factor, 1)} P · sol {fmt(food.salt100 * factor, 2)} g
                    </p>
                  </div>
                  <Button
                    variant={isAdded ? "ghost" : "primary"}
                    disabled={isAdded}
                    onClick={() => {
                      const known = day.foodDb.find((row) => row.name.toLowerCase() === food.name.toLowerCase());
                      if (known) day.addFood(known, food.targetMeal, food.grams);
                      else {
                        day.addSnapshot(
                          {
                            name: food.name,
                            kcal: food.kcal100,
                            p: food.p100,
                            c: food.c100,
                            f: food.f100,
                            salt: food.salt100,
                            category: "Vlastito",
                          },
                          food.targetMeal,
                          food.grams,
                          true,
                        );
                      }
                      setAdded((prev) => ({ ...prev, [index]: true }));
                    }}
                  >
                    {isAdded ? "Dodano" : "Dodaj"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </Modal>
  );
}
