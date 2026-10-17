import { Coffee, Cookie, Moon, Sun, Trash2 } from "lucide-react";
import { fmt, fmtInt, scaleEntry } from "@/lib/nutrition/calc";
import { MEAL_HINT, MEAL_IDS, MEAL_LABEL, type MealId } from "@/lib/nutrition/types";
import { lowSaltSwap } from "@/lib/nutrition/suggest";
import type { DayState } from "./use-day";
import { SaltBadge } from "./ui";

const ICONS = { breakfast: Coffee, lunch: Sun, dinner: Moon, snack: Cookie };

export function Meals({ day }: { day: DayState }) {
  return (
    <div className="space-y-4">
      {MEAL_IDS.map((id) => (
        <MealCard key={id} id={id} day={day} />
      ))}
      <Summary day={day} />
    </div>
  );
}

function MealCard({ id, day }: { id: MealId; day: DayState }) {
  const Icon = ICONS[id];
  const items = day.meals[id];
  const sub = day.analytics.byMeal[id];
  const active = day.activeMeal === id;

  return (
    <section
      id={`meal-${id}`}
      className={`scroll-mt-24 overflow-hidden rounded-2xl bg-surface shadow-ring ${active ? "shadow-ring-strong" : ""}`}
    >
      <button
        onClick={() => day.setActiveMeal(id)}
        className="flex w-full flex-col gap-3 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-bg text-lime">
            <Icon className="size-5" />
          </span>
          <span>
            <span className="flex items-center gap-2">
              <span className="text-base font-semibold text-fg">{MEAL_LABEL[id]}</span>
              {active ? <span className="text-xs font-medium text-lime">odabran</span> : null}
            </span>
            <span className="mt-0.5 block text-sm text-muted">{MEAL_HINT[id]}</span>
          </span>
        </span>
        <span className="text-xs text-muted tabular-nums sm:text-right">
          <span className="font-semibold text-fg">{fmtInt(sub.kcal)} kcal</span>
          <span className="mx-1.5">·</span>
          {fmt(sub.p, 1)} P
          <span className="mx-1.5">·</span>
          {fmt(sub.c, 1)} UH
          <span className="mx-1.5">·</span>
          {fmt(sub.f, 1)} M
          <span className="mx-1.5">·</span>
          {fmt(sub.salt, 2)} g soli
        </span>
      </button>

      <div className="space-y-2 px-4 pb-4">
        {items.length === 0 ? (
          <button
            onClick={() => {
              day.setActiveMeal(id);
              day.setPanel("foods");
            }}
            className="w-full rounded-xl border border-dashed border-line px-3 py-6 text-sm text-muted hover:text-fg"
          >
            Prazno. Otvori bazu i dodaj namirnicu.
          </button>
        ) : (
          items.map((item) => {
            const scaled = scaleEntry(item);
            const swap = lowSaltSwap(item, day.foodDb);
            return (
              <article key={item.entryId} className="rounded-xl bg-bg p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-fg">{item.name}</h3>
                    <p className="mt-1 text-xs text-muted tabular-nums">
                      {fmtInt(scaled.kcal)} kcal · {fmt(scaled.p, 1)} P · {fmt(scaled.c, 1)} UH · {fmt(scaled.f, 1)} M · sol {fmt(scaled.salt, 2)} g
                    </p>
                  </div>
                  <SaltBadge salt={item.salt100} />
                </div>
                {swap ? (
                  <button
                    onClick={() => day.replaceEntry(id, item.entryId, swap)}
                    className="mt-2 text-left text-xs font-medium text-lime hover:underline"
                  >
                    Zamijeni s: {swap.name} ({fmt(swap.salt, 2)} g/100 g)
                  </button>
                ) : null}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex flex-1 flex-wrap gap-1">
                    {[50, 100, 150, 200].map((grams) => (
                      <button
                        key={grams}
                        onClick={() => day.updateGrams(id, item.entryId, grams)}
                        className={`h-11 rounded-lg px-2 text-xs font-semibold tabular-nums ${
                          item.grams === grams ? "bg-lime text-lime-ink" : "bg-surface text-muted"
                        }`}
                      >
                        {grams} g
                      </button>
                    ))}
                  </div>
                  <label className="relative">
                    <span className="sr-only">Gramaža za {item.name}</span>
                    <input
                      type="number"
                      min={0}
                      max={2500}
                      value={item.grams}
                      onChange={(event) => day.updateGrams(id, item.entryId, Number(event.target.value))}
                      className="h-11 w-20 rounded-xl bg-surface pr-6 pl-2 text-sm font-semibold text-fg tabular-nums shadow-ring outline-none"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-faint">g</span>
                  </label>
                  <button
                    aria-label={`Ukloni ${item.name}`}
                    onClick={() => day.removeEntry(id, item.entryId)}
                    className="grid size-11 place-items-center rounded-xl text-muted hover:bg-salt/10 hover:text-salt"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function Summary({ day }: { day: DayState }) {
  const { analytics } = day;
  return (
    <section className="overflow-x-auto rounded-2xl bg-surface p-4 shadow-ring">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-fg">Sažetak dana</h2>
        <p className="text-xs text-muted tabular-nums">Masa hrane {fmtInt(analytics.totals.grams)} g</p>
      </div>
      <div className="space-y-2 md:hidden">
        {MEAL_IDS.map((id) => {
          const row = analytics.byMeal[id];
          const high = row.avgSaltPer100g >= 1;
          return (
            <div key={id} className="rounded-xl bg-bg px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-medium">{MEAL_LABEL[id]}</p>
                <p className="text-sm tabular-nums">{fmtInt(row.kcal)} kcal</p>
              </div>
              <p className="mt-1 text-xs text-muted tabular-nums">
                {fmt(row.p, 1)} P · {fmt(row.c, 1)} UH · {fmt(row.f, 1)} M · {fmt(row.salt, 2)} g soli
              </p>
              <p className={`mt-1 text-xs tabular-nums ${high ? "text-salt" : "text-lime"}`}>
                {fmt(row.avgSaltPer100g, 2)} g / 100 g
              </p>
            </div>
          );
        })}
        <p className="px-1 text-sm font-semibold tabular-nums">
          Ukupno {fmtInt(analytics.totals.kcal)} kcal · {fmt(analytics.totals.p, 1)} P · {fmt(analytics.totals.salt, 2)} g soli
        </p>
      </div>
      <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-muted">
          <tr className="border-b border-line">
            <th className="py-2 pr-3 font-medium">Obrok</th>
            <th className="py-2 pr-3 text-right font-medium">Masa</th>
            <th className="py-2 pr-3 text-right font-medium">kcal</th>
            <th className="py-2 pr-3 text-right font-medium">P</th>
            <th className="py-2 pr-3 text-right font-medium">UH</th>
            <th className="py-2 pr-3 text-right font-medium">M</th>
            <th className="py-2 pr-3 text-right font-medium">Sol</th>
            <th className="py-2 text-right font-medium">g / 100 g</th>
          </tr>
        </thead>
        <tbody>
          {MEAL_IDS.map((id) => {
            const row = analytics.byMeal[id];
            const high = row.avgSaltPer100g >= 1;
            return (
              <tr key={id} className="border-b border-line/70">
                <td className="py-2.5 pr-3 font-medium">{MEAL_LABEL[id]}</td>
                <td className="py-2.5 pr-3 text-right text-muted tabular-nums">{fmtInt(row.grams)} g</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{fmtInt(row.kcal)}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{fmt(row.p, 1)}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{fmt(row.c, 1)}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{fmt(row.f, 1)}</td>
                <td className="py-2.5 pr-3 text-right tabular-nums">{fmt(row.salt, 2)}</td>
                <td className={`py-2.5 text-right tabular-nums ${high ? "text-salt" : "text-lime"}`}>
                  {fmt(row.avgSaltPer100g, 2)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="pt-3">Ukupno</td>
            <td className="pt-3 text-right tabular-nums">{fmtInt(analytics.totals.grams)} g</td>
            <td className="pt-3 text-right tabular-nums">{fmtInt(analytics.totals.kcal)}</td>
            <td className="pt-3 text-right tabular-nums">{fmt(analytics.totals.p, 1)}</td>
            <td className="pt-3 text-right tabular-nums">{fmt(analytics.totals.c, 1)}</td>
            <td className="pt-3 text-right tabular-nums">{fmt(analytics.totals.f, 1)}</td>
            <td className="pt-3 text-right tabular-nums">{fmt(analytics.totals.salt, 2)}</td>
            <td className="pt-3 text-right tabular-nums">{fmt(analytics.avgDailySaltDensity, 2)}</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </section>
  );
}
