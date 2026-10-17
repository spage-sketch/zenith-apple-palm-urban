import { Beef, Bookmark, Droplets, Egg, Leaf, Plus, Search, Trash2, Wheat } from "lucide-react";
import { fmt } from "@/lib/nutrition/calc";
import { CATEGORIES, MEAL_LABEL, type Category } from "@/lib/nutrition/types";
import type { DayState } from "./use-day";
import { Button, SaltBadge, inputClass } from "./ui";

const ICONS: Record<Category, typeof Beef> = {
  "Meso i riba": Beef,
  "Mliječno i jaja": Egg,
  Ugljikohidrati: Wheat,
  "Voće i povrće": Leaf,
  "Masti i grickalice": Droplets,
  Vlastito: Bookmark,
};

const PORTIONS = [50, 100, 150, 200, 250];

export function FoodColumn({ day }: { day: DayState }) {
  return (
    <section className="rounded-2xl bg-surface p-4 shadow-ring lg:sticky lg:top-24">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-fg">Baza, na 100 g</h2>
          <p className="mt-1 text-sm text-muted">
            Dodaje se u {MEAL_LABEL[day.activeMeal].toLowerCase()}, {day.portion} g.
          </p>
        </div>
        <Button variant="primary" onClick={() => day.setCustomOpen(true)}>
          <Plus className="size-4" />
          Ručno
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {(Object.keys(MEAL_LABEL) as Array<keyof typeof MEAL_LABEL>).map((id) => (
          <button
            key={id}
            onClick={() => day.setActiveMeal(id)}
            className={`h-11 rounded-xl text-sm font-medium ${
              day.activeMeal === id ? "bg-lime text-lime-ink" : "bg-bg text-muted"
            }`}
          >
            {MEAL_LABEL[id]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PORTIONS.map((grams) => (
          <button
            key={grams}
            onClick={() => day.setPortion(grams)}
            className={`h-11 rounded-lg px-2.5 text-xs font-semibold tabular-nums ${
              day.portion === grams ? "bg-cream text-lime-ink" : "bg-bg text-muted"
            }`}
          >
            {grams} g
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
        <input
          value={day.query}
          onChange={(event) => day.setQuery(event.target.value)}
          placeholder="Traži namirnicu"
          className={`${inputClass} pl-9`}
          aria-label="Pretraži namirnice"
        />
      </div>

      <div className="mt-3 flex min-w-0 gap-1.5 overflow-x-auto pb-1">
        {(["Sve", ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => day.setCategory(cat)}
            className={`h-11 shrink-0 rounded-lg px-2.5 text-xs font-medium ${
              day.category === cat ? "bg-cream text-lime-ink" : "bg-bg text-muted"
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => day.setOnlyLowSalt(!day.onlyLowSalt)}
          aria-pressed={day.onlyLowSalt}
          className={`h-11 shrink-0 rounded-lg px-2.5 text-xs font-medium ${
            day.onlyLowSalt ? "bg-lime text-lime-ink" : "bg-bg text-muted"
          }`}
        >
          Samo niska sol
        </button>
      </div>

      <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto pr-1">
        {day.filtered.length === 0 ? (
          <li className="rounded-xl bg-bg px-3 py-8 text-center text-sm text-muted">
            Nema pogotka.
            <button className="mt-2 block w-full text-lime" onClick={() => day.setCustomOpen(true)}>
              Dodaj ručno
            </button>
          </li>
        ) : (
          day.filtered.map((food) => {
            const Icon = ICONS[food.category] ?? Bookmark;
            return (
              <li key={food.id} className="flex items-center gap-3 rounded-xl bg-bg p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-muted">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg" title={food.name}>
                    {food.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted tabular-nums">
                    {food.kcal} kcal · {fmt(food.p, 1)} P · {fmt(food.c, 1)} UH · {fmt(food.f, 1)} M
                  </p>
                  <div className="mt-1.5">
                    <SaltBadge salt={food.salt} />
                  </div>
                </div>
                {food.category === "Vlastito" ? (
                  <button
                    aria-label={`Ukloni ${food.name} iz baze`}
                    onClick={() => day.removeCustom(food.id)}
                    className="grid size-11 place-items-center rounded-xl text-muted hover:text-salt"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
                <button
                  onClick={() => day.addFood(food)}
                  className="grid h-11 shrink-0 place-items-center rounded-xl bg-surface px-3 text-sm font-semibold text-lime hover:bg-lime hover:text-lime-ink"
                >
                  +{day.portion} g
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
