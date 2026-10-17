import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-B66SCLZ-.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var mealItem = object({
	name: string().min(1).max(80),
	grams: number().min(1).max(1500),
	kcal100: number().min(0).max(950),
	p100: number().min(0).max(100),
	c100: number().min(0).max(100),
	f100: number().min(0).max(100),
	salt100: number().min(0).max(15),
	category: string().max(40).optional().default("Vlastito")
});
var parserSchema = object({ items: array(mealItem).max(8) });
var coachSchema = object({
	score: number().min(0).max(100),
	headline: string().min(1).max(140),
	analysis: string().min(1).max(700),
	sodiumAdvice: string().min(1).max(400),
	tips: array(string().max(220)).max(4).optional().default([]),
	recipeTitle: string().max(80).optional().default(""),
	recipeSteps: string().max(500).optional().default(""),
	foods: array(mealItem.extend({
		reason: string().max(180),
		targetMeal: _enum([
			"breakfast",
			"lunch",
			"dinner",
			"snack"
		])
	})).max(3)
});
var parseInput = object({
	text: string().max(2e3),
	imageBase64: string().max(18e5).optional()
});
var coachInput = object({ prompt: string().min(20).max(6e3) });
function extractJson(text) {
	const raw = (text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text).trim();
	const start = raw.search(/[[{]/);
	if (start < 0) throw new Error("NO_JSON");
	return JSON.parse(raw.slice(start));
}
function coerceItems(json) {
	if (Array.isArray(json)) return { items: json };
	if (json && typeof json === "object") {
		const record = json;
		if (Array.isArray(record.items)) return json;
		const nested = record.result ?? record.data ?? record.foods;
		if (Array.isArray(nested)) return { items: nested };
	}
	return json;
}
function normalizeSalt(value) {
	if (value > 15) return Math.round(value / 1e3 * 100) / 100;
	return Math.round(value * 100) / 100;
}
async function complete(content, maxTokens) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("NO_KEY");
	const bodies = [{
		model: "grok-4.5",
		temperature: .2,
		max_tokens: maxTokens,
		reasoning_effort: "low",
		response_format: { type: "json_object" },
		messages: [{
			role: "system",
			content: "Ti si sportski nutricionist. Odgovaraš isključivo JSON-om na hrvatskom. Sol je uvijek u gramima (ne u mg natrija). 1 g natrija = 2,5 g soli. Vrijednosti kcal100, p100, c100, f100 i salt100 su na 100 g."
		}, {
			role: "user",
			content
		}]
	}, {
		model: "grok-4.5",
		temperature: .2,
		max_tokens: maxTokens,
		messages: [{
			role: "system",
			content: "Odgovori isključivo valjanim JSON-om, bez markdowna. Sol u gramima na 100 g. Jezik: hrvatski."
		}, {
			role: "user",
			content
		}]
	}];
	let last = "AI trenutno nije dostupan.";
	for (const body of bodies) {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			last = res.status === 401 || res.status === 403 ? "AI ključ nije važeći u ovom okruženju." : "AI zahtjev nije prošao. Pokušaj ponovno.";
			continue;
		}
		const text = (await res.json()).choices?.[0]?.message?.content;
		if (typeof text === "string" && text.trim()) return text;
		last = "Model je vratio prazan odgovor.";
	}
	throw new Error(last);
}
var parseMealWithAi_createServerFn_handler = createServerRpc({
	id: "8e204be084d38f18ed2766107bb1f9fa8c16f61e140eab6a223920cf3539f537",
	name: "parseMealWithAi",
	filename: "src/lib/nutrition/ai.functions.ts"
}, (opts) => parseMealWithAi.__executeServer(opts));
var parseMealWithAi = createServerFn({ method: "POST" }).validator((input) => parseInput.parse(input)).handler(parseMealWithAi_createServerFn_handler, async ({ data }) => {
	if (!data.text.trim() && !data.imageBase64) return {
		ok: false,
		error: "Upiši obrok ili dodaj fotografiju."
	};
	try {
		const instruction = `Procijeni namirnice i vrati JSON oblika {"items":[{"name":"","grams":0,"kcal100":0,"p100":0,"c100":0,"f100":0,"salt100":0,"category":""}]}.
category je jedna od: Meso i riba, Mliječno i jaja, Ugljikohidrati, Voće i povrće, Masti i grickalice.
grams je procijenjena porcija. Makrosi i sol su NA 100 g.
Ako je na deklaraciji natrij (sodium), pretvori u sol (×2,5) i izrazi na 100 g.
Najviše 8 namirnica. Opis: ${data.text.trim() || "Analiziraj hranu ili deklaraciju na slici."}`;
		const raw = await complete(data.imageBase64 ? [{
			type: "text",
			text: instruction
		}, {
			type: "image_url",
			image_url: {
				url: `data:image/jpeg;base64,${data.imageBase64}`,
				detail: "low"
			}
		}] : instruction, 1400);
		return {
			ok: true,
			items: parserSchema.parse(coerceItems(extractJson(raw))).items.map((item) => ({
				...item,
				name: item.name.trim(),
				kcal100: Math.round(item.kcal100),
				p100: Math.round(item.p100 * 10) / 10,
				c100: Math.round(item.c100 * 10) / 10,
				f100: Math.round(item.f100 * 10) / 10,
				salt100: normalizeSalt(item.salt100),
				grams: Math.round(item.grams)
			}))
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "";
		if (message === "NO_KEY") return {
			ok: false,
			error: "AI nije uključen u ovom okruženju. Baza i ručni unos i dalje rade."
		};
		if (message.startsWith("AI")) return {
			ok: false,
			error: message
		};
		return {
			ok: false,
			error: "Nisam uspio pročitati obrok. Preciziraj gramažu ili pokušaj ponovno."
		};
	}
});
var coachDayWithAi_createServerFn_handler = createServerRpc({
	id: "b00986faf5bccfaab7938fd3ba4af0de940cc99794811882dbce95c44301c792",
	name: "coachDayWithAi",
	filename: "src/lib/nutrition/ai.functions.ts"
}, (opts) => coachDayWithAi.__executeServer(opts));
var coachDayWithAi = createServerFn({ method: "POST" }).validator((input) => coachInput.parse(input)).handler(coachDayWithAi_createServerFn_handler, async ({ data }) => {
	try {
		const raw = await complete(data.prompt, 1600);
		const parsed = coachSchema.parse(extractJson(raw));
		return {
			ok: true,
			result: {
				...parsed,
				score: Math.round(parsed.score),
				foods: parsed.foods.map((food) => ({
					...food,
					salt100: normalizeSalt(food.salt100),
					grams: Math.round(food.grams),
					kcal100: Math.round(food.kcal100)
				}))
			}
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "";
		if (message === "NO_KEY") return {
			ok: false,
			error: "AI nije uključen u ovom okruženju."
		};
		if (message.startsWith("AI")) return {
			ok: false,
			error: message
		};
		return {
			ok: false,
			error: "Analiza nije uspjela. Pokušaj ponovno za trenutak."
		};
	}
});
//#endregion
export { coachDayWithAi_createServerFn_handler, parseMealWithAi_createServerFn_handler };
