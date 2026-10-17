import { Beef, Droplets, Flame, Wheat } from "lucide-react";
import { fmt, fmtInt } from "@/lib/nutrition/calc";
import { MEAL_LABEL } from "@/lib/nutrition/types";
import type { DayState } from "./use-day";
import { Button, Meter } from "./ui";

function saltPhrase(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const few = mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14);
  return `${count} ${few ? "namirnice prelaze" : "namirnica prelazi"}`;
}

export function Dashboard({ day }: { day: DayState }) {
  const { analytics, goals } = day;
  const cards = [
    {
      label: "Još kalorija",
      icon: Flame,
      value: analytics.totals.kcal,
      goal: goals.kcal,
      unit: "kcal",
      digits: 0,
      tone: "lime" as const,
    },
    {
      label: "Još proteina",
      icon: Beef,
      value: analytics.totals.p,
      goal: goals.p,
      unit: "g",
      digits: 1,
      tone: "lime" as const,
    },
    {
      label: "Još ugljikohidrata",
      icon: Wheat,
      value: analytics.totals.c,
      goal: goals.c,
      unit: "g",
      digits: 1,
      tone: "cream" as const,
    },
    {
      label: "Još masti",
      icon: Droplets,
      value: analytics.totals.f,
      goal: goals.f,
      unit: "g",
      digits: 1,
      tone: "olive" as const,
    },
  ];

  const saltOver = analytics.totals.salt > goals.maxSalt;
  const saltLeft = goals.maxSalt - analytics.totals.salt;

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => {
          const left = card.goal - card.value;
          const Icon = card.icon;
          const over = left < 0;
          return (
            <article key={card.label} className="rounded-2xl bg-surface p-4 shadow-ring">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs font-medium">{card.label}</span>
                <Icon className="size-4" />
              </div>
              <p className="mt-3 font-display text-3xl leading-none text-fg tabular-nums">
                {card.digits === 0 ? fmtInt(Math.max(0, left)) : fmt(Math.max(0, left), 1)}
                <span className="ml-1 font-sans text-sm font-medium text-muted">{card.unit}</span>
              </p>
              <p className="mt-1 text-xs text-muted tabular-nums">
                {over
                  ? `${card.digits === 0 ? fmtInt(-left) : fmt(-left, 1)} ${card.unit} preko`
                  : `preostalo od ${card.digits === 0 ? fmtInt(card.goal) : fmt(card.goal, 0)}`}
              </p>
              <div className="mt-3">
                <Meter value={card.value} max={card.goal} tone={over ? "salt" : card.tone} />
              </div>
            </article>
          );
        })}
      </div>

      <article
        className={`rounded-2xl p-4 shadow-ring ${saltOver || analytics.totals.highSaltItems > 0 ? "bg-salt/10" : "bg-surface"}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted">Još soli · prag 1 g / 100 g</p>
            <p className={`mt-1 font-display text-3xl leading-none tabular-nums ${saltOver ? "text-salt" : "text-fg"}`}>
              {fmt(Math.max(0, saltLeft), 2)}
              <span className="ml-1 font-sans text-sm text-muted">g preostalo</span>
            </p>
          </div>
          <p className="text-sm text-muted tabular-nums">
            {fmt(analytics.totals.salt, 2)} / {fmt(goals.maxSalt, 1)} g
            <span className="mx-2 text-line">·</span>
            gustoća {fmt(analytics.avgDailySaltDensity, 2)} g/100 g
          </p>
        </div>
        <div className="mt-3">
          <Meter value={analytics.totals.salt} max={goals.maxSalt} tone={saltOver ? "salt" : "lime"} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {analytics.totals.highSaltItems === 0
            ? "Nijedna stavka ne prelazi 1 g soli na 100 g."
            : `${saltPhrase(analytics.totals.highSaltItems)} prag. Zamjena je ponuđena uz stavku.`}
        </p>
      </article>

      <div className="rounded-2xl bg-surface px-4 py-3 shadow-ring">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
          <span>Udio kalorija iz makrosa</span>
          <span className="tabular-nums">
            P {analytics.split.pPct}% · UH {analytics.split.cPct}% · M {analytics.split.fPct}%
          </span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-bg">
          <div className="bg-lime" style={{ width: `${analytics.split.pPct}%` }} />
          <div className="bg-cream" style={{ width: `${analytics.split.cPct}%` }} />
          <div className="bg-olive" style={{ width: `${analytics.split.fPct}%` }} />
        </div>
      </div>

      {day.suggestions.length > 0 ? (
        <div className="rounded-2xl bg-surface p-4 shadow-ring">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold text-fg">Dopuna iz baze</h2>
            <p className="text-xs text-muted">Porcije koje zatvaraju ostatak, sol ispod 1 g/100 g</p>
          </div>
          <ul className="grid gap-2 lg:grid-cols-3">
            {day.suggestions.map((item) => (
              <li key={item.food.id} className="flex items-center justify-between gap-3 rounded-xl bg-bg p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-fg">
                    {item.food.name}
                    <span className="font-medium text-muted"> · {item.grams} g</span>
                  </p>
                  <p className="mt-1 text-xs text-muted tabular-nums">
                    {MEAL_LABEL[item.mealId]} · {fmtInt(item.kcal)} kcal · {fmt(item.p, 1)} g P · {fmt(item.salt, 2)} g soli
                  </p>
                </div>
                <Button className="shrink-0" variant="primary" onClick={() => day.addFood(item.food, item.mealId, item.grams)}>
                  Dodaj
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
