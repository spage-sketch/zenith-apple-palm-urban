import { Copy, LineChart, RotateCcw, ScanText, SlidersHorizontal } from "lucide-react";
import { fmt, fmtInt } from "@/lib/nutrition/calc";
import { PRESETS } from "@/lib/nutrition/foods";
import { MEAL_IDS, MEAL_LABEL } from "@/lib/nutrition/types";
import { CoachDialog, CustomFoodDialog, ParserDialog } from "./dialogs";
import { Dashboard } from "./dashboard";
import { FoodColumn } from "./food-column";
import { Meals } from "./meals";
import { useDay } from "./use-day";
import { Button, Field, inputClass } from "./ui";
import { useState } from "react";

export function MacroApp() {
  const day = useDay();
  const [parserOpen, setParserOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);

  async function copySummary() {
    const { analytics, goals } = day;
    const lines = [
      "MACROcore",
      `Kalorije ${fmtInt(analytics.totals.kcal)} / ${fmtInt(goals.kcal)}`,
      `Proteini ${fmt(analytics.totals.p, 1)} / ${fmt(goals.p, 0)} g`,
      `Ugljikohidrati ${fmt(analytics.totals.c, 1)} / ${fmt(goals.c, 0)} g`,
      `Masti ${fmt(analytics.totals.f, 1)} / ${fmt(goals.f, 0)} g`,
      `Sol ${fmt(analytics.totals.salt, 2)} / ${fmt(goals.maxSalt, 1)} g`,
      `Gustoća soli ${fmt(analytics.avgDailySaltDensity, 2)} g/100 g`,
      ...MEAL_IDS.map((id) => {
        const items = day.meals[id].map((item) => `${item.name} ${item.grams} g`).join(", ");
        return `${MEAL_LABEL[id]}: ${items || "prazno"}`;
      }),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      day.setCopied(true);
      window.setTimeout(() => day.setCopied(false), 1600);
    } catch {
      day.setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-2xl leading-none">
              MACRO<span className="text-lime italic">core</span>
            </p>
            <p className="mt-1 text-sm text-muted">Kalkulator obroka · sol ispod 1 g / 100 g</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Button aria-pressed={day.goalsOpen} onClick={() => day.setGoalsOpen(!day.goalsOpen)}>
              <SlidersHorizontal className="size-4" />
              Ciljevi
            </Button>
            <Button onClick={() => setParserOpen(true)}>
              <ScanText className="size-4" />
              Procijeni
            </Button>
            <Button variant="primary" onClick={() => setCoachOpen(true)}>
              <LineChart className="size-4" />
              Analiza
            </Button>
            <Button aria-label="Kopiraj sažetak" onClick={() => void copySummary()}>
              <Copy className="size-4" />
              {day.copied ? "Kopirano" : "Sažetak"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-5">
        {day.goalsOpen ? <Goals day={day} /> : null}
        <Dashboard day={day} />

        <div className="grid grid-cols-2 gap-2 lg:hidden">
          <button
            onClick={() => day.setPanel("meals")}
            className={`h-11 rounded-xl text-sm font-semibold ${day.panel === "meals" ? "bg-lime text-lime-ink" : "bg-surface text-muted"}`}
          >
            Obroci
          </button>
          <button
            onClick={() => day.setPanel("foods")}
            className={`h-11 rounded-xl text-sm font-semibold ${day.panel === "foods" ? "bg-lime text-lime-ink" : "bg-surface text-muted"}`}
          >
            Namirnice
          </button>
        </div>

        <div className="grid min-w-0 items-start gap-4 lg:grid-cols-12">
          <div className={day.panel === "foods" ? "min-w-0 lg:col-span-5" : "hidden min-w-0 lg:col-span-5 lg:block"}>
            <FoodColumn day={day} />
          </div>
          <div className={day.panel === "meals" ? "min-w-0 space-y-4 lg:col-span-7" : "hidden min-w-0 space-y-4 lg:col-span-7 lg:block"}>
            <div className="flex flex-wrap gap-2">
              {day.confirm === "sample" ? (
                <>
                  <Button variant="primary" onClick={day.loadSample}>Učitaj primjer</Button>
                  <Button onClick={() => day.setConfirm(null)}>Odustani</Button>
                </>
              ) : day.confirm === "reset" ? (
                <>
                  <Button variant="danger" onClick={day.resetDay}>Obriši današnji unos</Button>
                  <Button onClick={() => day.setConfirm(null)}>Odustani</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => day.setConfirm("sample")}>Primjer dana</Button>
                  <Button onClick={() => day.setConfirm("reset")}>
                    <RotateCcw className="size-4" />
                    Isprazni
                  </Button>
                </>
              )}
            </div>
            <Meals day={day} />
          </div>
        </div>

        <p className="pb-6 text-xs leading-relaxed text-muted">
          Vrijednosti su tipične na 100 g i služe za praćenje unosa, ne kao medicinski savjet.
          Dan se pamti u ovom pregledniku. AI procjena troši tvoj xAI kredit samo kad je pokreneš.
        </p>
      </main>

      {day.customOpen ? <CustomFoodDialog day={day} /> : null}
      {parserOpen ? <ParserDialog day={day} onClose={() => setParserOpen(false)} /> : null}
      {coachOpen ? <CoachDialog day={day} onClose={() => setCoachOpen(false)} /> : null}
    </div>
  );
}

function Goals({ day }: { day: ReturnType<typeof useDay> }) {
  const fields: Array<{ key: keyof typeof day.goals; label: string; step?: string; min: number }> = [
    { key: "kcal", label: "Kalorije", min: 500 },
    { key: "p", label: "Proteini, g", min: 20 },
    { key: "c", label: "Ugljikohidrati, g", min: 0 },
    { key: "f", label: "Masti, g", min: 10 },
    { key: "maxSalt", label: "Max sol, g", step: "0.5", min: 1 },
  ];

  return (
    <section className="rounded-2xl bg-surface p-4 shadow-ring">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Dnevni cilj</h2>
          <p className="text-sm text-muted">
            {day.preset === "custom" ? "Ručno podešeno" : PRESETS[day.preset]?.detail}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => day.applyPreset(key)}
              className={`rounded-xl px-3 py-2 text-left text-sm ${
                day.preset === key ? "bg-lime text-lime-ink" : "bg-bg text-muted"
              }`}
            >
              <span className="block font-semibold">{preset.name}</span>
              <span className="text-xs tabular-nums">{fmtInt(preset.kcal)} kcal · {preset.p} g P</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {fields.map((field) => (
          <Field key={field.key} label={field.label}>
            <input
              type="number"
              min={field.min}
              step={field.step ?? "1"}
              value={day.goals[field.key]}
              onChange={(event) =>
                day.editGoal({ [field.key]: Math.max(field.min, Number(event.target.value) || 0) })
              }
              className={inputClass}
            />
          </Field>
        ))}
      </div>
    </section>
  );
}
