import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const mealItem = z.object({
  name: z.string().min(1).max(80),
  grams: z.number().min(1).max(1500),
  kcal100: z.number().min(0).max(950),
  p100: z.number().min(0).max(100),
  c100: z.number().min(0).max(100),
  f100: z.number().min(0).max(100),
  salt100: z.number().min(0).max(15),
  category: z.string().max(40).optional().default("Vlastito"),
});

const parserSchema = z.object({
  items: z.array(mealItem).max(8),
});

const coachSchema = z.object({
  score: z.number().min(0).max(100),
  headline: z.string().min(1).max(140),
  analysis: z.string().min(1).max(700),
  sodiumAdvice: z.string().min(1).max(400),
  tips: z.array(z.string().max(220)).max(4).optional().default([]),
  recipeTitle: z.string().max(80).optional().default(""),
  recipeSteps: z.string().max(500).optional().default(""),
  foods: z.array(mealItem.extend({
    reason: z.string().max(180),
    targetMeal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  })).max(3),
});

const parseInput = z.object({
  text: z.string().max(2000),
  imageBase64: z.string().max(1_800_000).optional(),
});

const coachInput = z.object({
  prompt: z.string().min(20).max(6000),
});

type ChatContent =
  | string
  | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail: "low" } }>;

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.search(/[[{]/);
  if (start < 0) throw new Error("NO_JSON");
  return JSON.parse(raw.slice(start));
}

function coerceItems(json: unknown) {
  if (Array.isArray(json)) return { items: json };
  if (json && typeof json === "object") {
    const record = json as Record<string, unknown>;
    if (Array.isArray(record.items)) return json;
    const nested = record.result ?? record.data ?? record.foods;
    if (Array.isArray(nested)) return { items: nested };
  }
  return json;
}

function normalizeSalt(value: number) {
  if (value > 15) return Math.round((value / 1000) * 100) / 100;
  return Math.round(value * 100) / 100;
}

async function complete(content: ChatContent, maxTokens: number) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("NO_KEY");

  const bodies = [
    {
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: maxTokens,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Ti si sportski nutricionist. Odgovaraš isključivo JSON-om na hrvatskom. Sol je uvijek u gramima (ne u mg natrija). 1 g natrija = 2,5 g soli. Vrijednosti kcal100, p100, c100, f100 i salt100 su na 100 g.",
        },
        { role: "user", content },
      ],
    },
    {
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content:
            "Odgovori isključivo valjanim JSON-om, bez markdowna. Sol u gramima na 100 g. Jezik: hrvatski.",
        },
        { role: "user", content },
      ],
    },
  ];

  let last = "AI trenutno nije dostupan.";
  for (const body of bodies) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      last = res.status === 401 || res.status === 403
        ? "AI ključ nije važeći u ovom okruženju."
        : "AI zahtjev nije prošao. Pokušaj ponovno.";
      continue;
    }
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = json.choices?.[0]?.message?.content;
    if (typeof text === "string" && text.trim()) return text;
    last = "Model je vratio prazan odgovor.";
  }
  throw new Error(last);
}

export const parseMealWithAi = createServerFn({ method: "POST" })
  .validator((input: unknown) => parseInput.parse(input))
  .handler(async ({ data }) => {
    if (!data.text.trim() && !data.imageBase64) {
      return { ok: false as const, error: "Upiši obrok ili dodaj fotografiju." };
    }
    try {
      const instruction = `Procijeni namirnice i vrati JSON oblika {"items":[{"name":"","grams":0,"kcal100":0,"p100":0,"c100":0,"f100":0,"salt100":0,"category":""}]}.
category je jedna od: Meso i riba, Mliječno i jaja, Ugljikohidrati, Voće i povrće, Masti i grickalice.
grams je procijenjena porcija. Makrosi i sol su NA 100 g.
Ako je na deklaraciji natrij (sodium), pretvori u sol (×2,5) i izrazi na 100 g.
Najviše 8 namirnica. Opis: ${data.text.trim() || "Analiziraj hranu ili deklaraciju na slici."}`;

      const content: ChatContent = data.imageBase64
        ? [
            { type: "text", text: instruction },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${data.imageBase64}`, detail: "low" },
            },
          ]
        : instruction;

      const raw = await complete(content, 1400);
      const parsed = parserSchema.parse(coerceItems(extractJson(raw)));
      return {
        ok: true as const,
        items: parsed.items.map((item) => ({
          ...item,
          name: item.name.trim(),
          kcal100: Math.round(item.kcal100),
          p100: Math.round(item.p100 * 10) / 10,
          c100: Math.round(item.c100 * 10) / 10,
          f100: Math.round(item.f100 * 10) / 10,
          salt100: normalizeSalt(item.salt100),
          grams: Math.round(item.grams),
        })),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "NO_KEY") {
        return { ok: false as const, error: "AI nije uključen u ovom okruženju. Baza i ručni unos i dalje rade." };
      }
      if (message.startsWith("AI")) return { ok: false as const, error: message };
      return { ok: false as const, error: "Nisam uspio pročitati obrok. Preciziraj gramažu ili pokušaj ponovno." };
    }
  });

export const coachDayWithAi = createServerFn({ method: "POST" })
  .validator((input: unknown) => coachInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const raw = await complete(data.prompt, 1600);
      const parsed = coachSchema.parse(extractJson(raw));
      return {
        ok: true as const,
        result: {
          ...parsed,
          score: Math.round(parsed.score),
          foods: parsed.foods.map((food) => ({
            ...food,
            salt100: normalizeSalt(food.salt100),
            grams: Math.round(food.grams),
            kcal100: Math.round(food.kcal100),
          })),
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message === "NO_KEY") {
        return { ok: false as const, error: "AI nije uključen u ovom okruženju." };
      }
      if (message.startsWith("AI")) return { ok: false as const, error: message };
      return { ok: false as const, error: "Analiza nije uspjela. Pokušaj ponovno za trenutak." };
    }
  });
