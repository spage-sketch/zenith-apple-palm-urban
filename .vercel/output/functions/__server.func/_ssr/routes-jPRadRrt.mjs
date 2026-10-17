import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, o as string } from "../_libs/zod.mjs";
import { C as Camera, S as ChartLine, T as Beef, _ as Egg, a as Sun, b as Cookie, c as ShieldAlert, d as RotateCcw, f as Plus, g as Flame, h as Leaf, i as Trash2, l as Search, m as LoaderCircle, n as Wheat, o as SlidersHorizontal, p as Moon, s as ShieldCheck, t as X, u as ScanText, v as Droplets, w as Bookmark, x as Coffee, y as Copy } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-jPRadRrt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MEAL_IDS = [
	"breakfast",
	"lunch",
	"dinner",
	"snack"
];
var CATEGORIES = [
	"Meso i riba",
	"Mliječno i jaja",
	"Ugljikohidrati",
	"Voće i povrće",
	"Masti i grickalice",
	"Vlastito"
];
var MEAL_LABEL = {
	breakfast: "Doručak",
	lunch: "Ručak",
	dinner: "Večera",
	snack: "Međuobrok"
};
var MEAL_HINT = {
	breakfast: "Jutarnji unos",
	lunch: "Glavni obrok",
	dinner: "Večernji oporavak",
	snack: "Dopuna između obroka"
};
function scaleEntry(entry) {
	const factor = (Number(entry.grams) || 0) / 100;
	return {
		kcal: entry.kcal100 * factor,
		p: entry.p100 * factor,
		c: entry.c100 * factor,
		f: entry.f100 * factor,
		salt: entry.salt100 * factor
	};
}
function macroKcal(p, c, f) {
	return p * 4 + c * 4 + f * 9;
}
function analyze(meals) {
	const totals = {
		kcal: 0,
		p: 0,
		c: 0,
		f: 0,
		salt: 0,
		grams: 0,
		highSaltItems: 0
	};
	const byMeal = {};
	for (const id of MEAL_IDS) {
		const sub = {
			kcal: 0,
			p: 0,
			c: 0,
			f: 0,
			salt: 0,
			grams: 0
		};
		for (const item of meals[id]) {
			const scaled = scaleEntry(item);
			sub.kcal += scaled.kcal;
			sub.p += scaled.p;
			sub.c += scaled.c;
			sub.f += scaled.f;
			sub.salt += scaled.salt;
			sub.grams += Number(item.grams) || 0;
			if (item.salt100 >= 1) totals.highSaltItems += 1;
		}
		byMeal[id] = {
			...sub,
			avgSaltPer100g: sub.grams > 0 ? sub.salt / sub.grams * 100 : 0
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
	const split = sum <= 0 ? {
		pPct: 0,
		cPct: 0,
		fPct: 0
	} : {
		pPct: Math.round(pKcal / sum * 100),
		cPct: Math.round(cKcal / sum * 100),
		fPct: 0
	};
	if (sum > 0) split.fPct = Math.max(0, 100 - split.pPct - split.cPct);
	return {
		totals,
		byMeal,
		split,
		avgDailySaltDensity: totals.grams > 0 ? totals.salt / totals.grams * 100 : 0
	};
}
function fmt(value, digits) {
	return value.toLocaleString("hr-HR", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function fmtInt(value) {
	return Math.round(value).toLocaleString("hr-HR");
}
var PRESETS = {
	deficit: {
		name: "Rezanje",
		detail: "Manjak, visoki proteini",
		kcal: 1950,
		p: 175,
		c: 165,
		f: 65,
		maxSalt: 4
	},
	recomp: {
		name: "Održavanje",
		detail: "Rekompozicija",
		kcal: 2400,
		p: 185,
		c: 240,
		f: 78,
		maxSalt: 5
	},
	bulk: {
		name: "Masa",
		detail: "Blagi suficit",
		kcal: 2900,
		p: 195,
		c: 345,
		f: 82,
		maxSalt: 5
	}
};
function food(id, name, kcal, p, c, f, salt, category) {
	return {
		id,
		name,
		kcal,
		p,
		c,
		f,
		salt,
		category
	};
}
/** Tipične vrijednosti na 100 g. Sol je u gramima, ne natrij u mg. */
var BASE_FOODS = [
	food("f1", "Pileća prsa, pečena", 165, 31, 0, 3.6, .15, "Meso i riba"),
	food("f2", "Pureća prsa, pečena", 135, 30, 0, 1, .12, "Meso i riba"),
	food("f3", "Losos, pečeni", 206, 22, 0, 12.5, .12, "Meso i riba"),
	food("f4", "Oslić, pečeni", 90, 20.1, 0, .6, .14, "Meso i riba"),
	food("f5", "Junetina, nemasni odrezak", 187, 27.5, 0, 8.2, .12, "Meso i riba"),
	food("f6", "Tuna u vlastitom soku, ocijeđena", 116, 25.5, 0, 1, .4, "Meso i riba"),
	food("f7", "Tuna u salamuri, ocijeđena", 113, 24, 0, 1, 1.2, "Meso i riba"),
	food("f8", "Pileća prsa u ovitku", 105, 21, 1, 2, 1.85, "Meso i riba"),
	food("f9", "Pršut", 241, 32, .5, 12, 4.6, "Meso i riba"),
	food("f10", "Posni svježi sir", 72, 12, 4, .5, .1, "Mliječno i jaja"),
	food("f11", "Skyr, natur", 63, 11, 4, .2, .1, "Mliječno i jaja"),
	food("f12", "Grčki jogurt 0%", 57, 10.3, 3.6, .2, .1, "Mliječno i jaja"),
	food("f13", "Kefir 1,5%", 52, 3.4, 4, 1.5, .12, "Mliječno i jaja"),
	food("f14", "Zrnati sir, neslani", 98, 11, 3.4, 4.3, .7, "Mliječno i jaja"),
	food("f15", "Jaje, cijelo kuhano", 155, 13, 1.1, 11, .31, "Mliječno i jaja"),
	food("f16", "Bjelanjak", 52, 11, .7, .2, .36, "Mliječno i jaja"),
	food("f17", "Whey izolat", 370, 86, 3, 1, .45, "Mliječno i jaja"),
	food("f18", "Zobene pahuljice, suhe", 372, 13.5, 58.7, 7, .02, "Ugljikohidrati"),
	food("f19", "Bijela riža, kuhana", 130, 2.7, 28, .3, .01, "Ugljikohidrati"),
	food("f20", "Krumpir, kuhani", 87, 1.9, 20, .1, .01, "Ugljikohidrati"),
	food("f21", "Batat, pečeni", 90, 2, 20.7, .2, .04, "Ugljikohidrati"),
	food("f22", "Heljda, kuhana", 110, 3.8, 20, .9, .01, "Ugljikohidrati"),
	food("f23", "Tjestenina, kuhana", 131, 5, 25, 1.1, .01, "Ugljikohidrati"),
	food("f24", "Integralni kruh", 247, 9, 41, 3.4, 1.1, "Ugljikohidrati"),
	food("f25", "Banana", 89, 1.1, 22.8, .3, 0, "Voće i povrće"),
	food("f26", "Borovnice", 57, .7, 14.5, .3, 0, "Voće i povrće"),
	food("f27", "Jabuka", 52, .3, 14, .2, 0, "Voće i povrće"),
	food("f28", "Brokula, kuhana", 35, 2.4, 7.2, .4, .04, "Voće i povrće"),
	food("f29", "Špinat, svježi", 23, 2.9, 3.6, .4, .08, "Voće i povrće"),
	food("f30", "Rajčica", 18, .9, 3.9, .2, .01, "Voće i povrće"),
	food("f31", "Miješana salata", 15, 1.4, 2.2, .2, .03, "Voće i povrće"),
	food("f32", "Avokado", 160, 2, 8.5, 14.7, .01, "Voće i povrće"),
	food("f33", "Maslinovo ulje", 884, 0, 0, 100, 0, "Masti i grickalice"),
	food("f34", "Bademi", 579, 21.2, 21.6, 49.9, .01, "Masti i grickalice"),
	food("f35", "Maslac od kikirikija, neslani", 588, 25, 20, 50, .02, "Masti i grickalice"),
	food("f36", "Tamna čokolada 85%", 580, 9.5, 19, 46, .02, "Masti i grickalice"),
	food("f37", "Chia sjemenke", 486, 17, 42, 31, .02, "Masti i grickalice")
];
var EMPTY_MEALS = {
	breakfast: [],
	lunch: [],
	dinner: [],
	snack: []
};
function entry(entryId, foodId, grams) {
	const item = BASE_FOODS.find((f) => f.id === foodId);
	if (!item) throw new Error(`Missing food ${foodId}`);
	return {
		entryId,
		foodId: item.id,
		name: item.name,
		grams,
		kcal100: item.kcal,
		p100: item.p,
		c100: item.c,
		f100: item.f,
		salt100: item.salt,
		category: item.category
	};
}
var SAMPLE_MEALS = {
	breakfast: [
		entry("s1", "f18", 70),
		entry("s2", "f10", 200),
		entry("s3", "f25", 120)
	],
	lunch: [
		entry("s4", "f1", 200),
		entry("s5", "f19", 220),
		entry("s6", "f28", 150),
		entry("s7", "f33", 10)
	],
	dinner: [
		entry("s8", "f2", 180),
		entry("s9", "f20", 250),
		entry("s10", "f15", 100)
	],
	snack: [entry("s11", "f11", 200), entry("s12", "f36", 20)]
};
function entryFromFood(item, grams) {
	return {
		entryId: `e_${crypto.randomUUID()}`,
		foodId: item.id,
		name: item.name,
		grams,
		kcal100: item.kcal,
		p100: item.p,
		c100: item.c,
		f100: item.f,
		salt100: item.salt,
		category: item.category
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var parseInput = object({
	text: string().max(2e3),
	imageBase64: string().max(18e5).optional()
});
var coachInput = object({ prompt: string().min(20).max(6e3) });
var parseMealWithAi = createServerFn({ method: "POST" }).validator((input) => parseInput.parse(input)).handler(createSsrRpc("8e204be084d38f18ed2766107bb1f9fa8c16f61e140eab6a223920cf3539f537"));
var coachDayWithAi = createServerFn({ method: "POST" }).validator((input) => coachInput.parse(input)).handler(createSsrRpc("b00986faf5bccfaab7938fd3ba4af0de940cc99794811882dbce95c44301c792"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "ghost", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-lime text-lime-ink hover:bg-lime/90", variant === "ghost" && "bg-surface-2 text-fg shadow-ring hover:bg-surface-2/80", variant === "danger" && "bg-salt/15 text-salt hover:bg-salt/25", variant === "quiet" && "h-10 bg-transparent text-muted hover:bg-surface-2 hover:text-fg", className),
		type,
		...props
	});
}
function Modal({ title, subtitle, onClose, children, wide = false }) {
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-3 sm:items-center sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: "absolute inset-0 cursor-default",
			"aria-label": "Zatvori",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			className: cn("relative max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-surface p-5 shadow-ring sm:p-6", wide ? "max-w-2xl" : "max-w-md"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium text-fg",
					children: title
				}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: subtitle
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Zatvori",
					className: "grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:bg-surface-2 hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), children]
		})]
	});
}
function SaltBadge({ salt }) {
	const high = salt >= 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", high ? "bg-salt/15 text-salt" : "bg-lime/12 text-lime"),
		children: [
			high ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5" }),
			high ? "Visoka sol" : "Niska sol",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums",
				children: [fmt(salt, 2), " g"]
			})
		]
	});
}
function Meter({ value, max, tone }) {
	const ratio = max > 0 ? value / max : 0;
	const over = ratio > 1;
	const width = `${Math.min(100, ratio * 100)}%`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", over || tone === "salt" ? "bg-salt" : tone === "lime" ? "bg-lime" : tone === "cream" ? "bg-cream" : "bg-olive"),
			style: { width }
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-xs font-medium text-muted",
			children: label
		}), children]
	});
}
var inputClass = "h-11 w-full rounded-xl bg-bg px-3 text-sm text-fg shadow-ring outline-none placeholder:text-faint";
var CATEGORY_SET = /* @__PURE__ */ new Set([
	"Meso i riba",
	"Mliječno i jaja",
	"Ugljikohidrati",
	"Voće i povrće",
	"Masti i grickalice",
	"Vlastito"
]);
function CustomFoodDialog({ day }) {
	const salt = Number(day.draft.salt) || 0;
	const fromMacros = macroKcal(Number(day.draft.p) || 0, Number(day.draft.c) || 0, Number(day.draft.f) || 0);
	const stated = Number(day.draft.kcal) || 0;
	const drift = stated > 0 && Math.abs(fromMacros - stated) / stated > .2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Vlastita namirnica",
		subtitle: "Vrijednosti s deklaracije, na 100 g.",
		onClose: () => day.setCustomOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: day.submitCustom,
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Naziv",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: day.draft.name,
						onChange: (event) => day.setDraft({
							...day.draft,
							name: event.target.value
						}),
						className: inputClass,
						placeholder: "npr. Skyr jagoda"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "kcal / 100 g",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.1",
								min: "0",
								value: day.draft.kcal,
								onChange: (e) => day.setDraft({
									...day.draft,
									kcal: e.target.value
								}),
								className: inputClass
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Proteini",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.1",
								min: "0",
								value: day.draft.p,
								onChange: (e) => day.setDraft({
									...day.draft,
									p: e.target.value
								}),
								className: inputClass
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Ugljikohidrati",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.1",
								min: "0",
								value: day.draft.c,
								onChange: (e) => day.setDraft({
									...day.draft,
									c: e.target.value
								}),
								className: inputClass
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Masti",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.1",
								min: "0",
								value: day.draft.f,
								onChange: (e) => day.setDraft({
									...day.draft,
									f: e.target.value
								}),
								className: inputClass
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Sol, g / 100 g",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "0.01",
								min: "0",
								value: day.draft.salt,
								onChange: (e) => day.setDraft({
									...day.draft,
									salt: e.target.value
								}),
								className: inputClass
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Porcija, g",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: "number",
								step: "1",
								min: "1",
								value: day.draft.grams,
								onChange: (e) => day.setDraft({
									...day.draft,
									grams: e.target.value
								}),
								className: inputClass
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-xl bg-bg px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaltBadge, { salt }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `text-xs ${drift ? "text-salt" : "text-muted"}`,
						children: [
							"Iz makrosa: ",
							fmtInt(fromMacros),
							" kcal"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: day.draft.saveToDb,
						onChange: (event) => day.setDraft({
							...day.draft,
							saveToDb: event.target.checked
						}),
						className: "size-4 accent-lime"
					}), "Spremi u bazu na ovom uređaju"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					variant: "primary",
					className: "w-full",
					children: ["Dodaj u ", MEAL_LABEL[day.activeMeal].toLowerCase()]
				})
			]
		})
	});
}
async function fileToJpeg(file) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(bitmap.width * scale));
	canvas.height = Math.max(1, Math.round(bitmap.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL("image/jpeg", .82);
	bitmap.close();
	return dataUrl.split(",")[1] ?? "";
}
function ParserDialog({ day, onClose }) {
	const [text, setText] = (0, import_react.useState)("");
	const [image, setImage] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function onFile(file) {
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
	async function run(event) {
		event.preventDefault();
		setLoading(true);
		setError("");
		setItems([]);
		const result = await parseMealWithAi({ data: {
			text,
			imageBase64: image ?? void 0
		} });
		setLoading(false);
		if (!result.ok) {
			setError(result.error);
			return;
		}
		setItems(result.items);
	}
	function addOne(item) {
		const known = day.foodDb.find((food) => food.name.toLowerCase() === item.name.toLowerCase());
		const category = CATEGORY_SET.has(item.category) ? item.category : "Vlastito";
		if (known) {
			day.addFood(known, day.activeMeal, item.grams);
			return;
		}
		day.addSnapshot({
			name: item.name,
			kcal: item.kcal100,
			p: item.p100,
			c: item.c100,
			f: item.f100,
			salt: item.salt100,
			category
		}, day.activeMeal, item.grams, true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		wide: true,
		title: "Procijena obroka",
		subtitle: "Opiši tanjur ili učitaj deklaraciju. Grok računa makrose i sol na 100 g.",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: run,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: text,
						onChange: (event) => setText(event.target.value),
						placeholder: "200 g pečenog lososa, 180 g batata, žlica maslinovog ulja",
						className: "w-full rounded-xl bg-bg px-3 py-3 text-sm text-fg shadow-ring outline-none placeholder:text-faint"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							"200 g pečenog lososa i 150 g batata",
							"Omlet od 3 jaja i 100 g špinata",
							"200 g skyr-a i 30 g whey izolata"
						].map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setText(sample),
							className: "rounded-lg bg-bg px-2.5 py-1.5 text-left text-xs text-muted hover:text-fg",
							children: sample
						}, sample))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-xl bg-bg p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-lime" }), "Fotografija tanjura ili deklaracije"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex h-11 cursor-pointer items-center rounded-xl bg-surface-2 px-3 text-sm font-semibold text-fg",
							children: ["Odaberi", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/jpeg,image/png,image/webp",
								className: "sr-only",
								onChange: (event) => void onFile(event.target.files?.[0])
							})]
						})]
					}),
					preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: preview,
							alt: "Pregled učitane fotografije",
							className: "h-16 w-16 rounded-lg object-cover outline outline-fg/10 -outline-offset-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-salt",
							onClick: () => {
								setImage(null);
								setPreview(null);
							},
							children: "Ukloni sliku"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Ide u ",
								MEAL_LABEL[day.activeMeal].toLowerCase(),
								"."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "primary",
							disabled: loading || !text.trim() && !image,
							children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, "Procijeni"]
						})]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-xl bg-salt/10 px-3 py-2 text-sm text-salt",
				children: error
			}) : null,
			items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 border-t border-line pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Prepoznato"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => {
							items.forEach(addOne);
							onClose();
						},
						children: "Dodaj sve"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: items.map((item, index) => {
						const factor = item.grams / 100;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 rounded-xl bg-bg p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-semibold",
										children: [
											item.name,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted",
												children: [item.grams, " g"]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted tabular-nums",
										children: [
											fmtInt(item.kcal100 * factor),
											" kcal · ",
											fmt(item.p100 * factor, 1),
											" P · sol ",
											fmt(item.salt100 * factor, 2),
											" g"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaltBadge, { salt: item.salt100 })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => addOne(item),
								children: "Dodaj"
							})]
						}, `${item.name}-${index}`);
					})
				})]
			}) : null
		]
	});
}
function CoachDialog({ day, onClose }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [added, setAdded] = (0, import_react.useState)({});
	async function run() {
		setLoading(true);
		setError("");
		const { analytics, goals, meals } = day;
		const lines = MEAL_IDS.map((id) => {
			const items = meals[id].map((item) => `${item.name} ${item.grams} g (sol ${item.salt100} g/100 g)`).join(", ");
			return `${MEAL_LABEL[id]}: ${items || "prazno"}`;
		}).join("\n");
		const response = await coachDayWithAi({ data: { prompt: `Vrati JSON:
{"score":0,"headline":"","analysis":"","sodiumAdvice":"","tips":[""],"recipeTitle":"","recipeSteps":"","foods":[{"name":"","reason":"","targetMeal":"lunch","grams":0,"kcal100":0,"p100":0,"c100":0,"f100":0,"salt100":0,"category":"Vlastito"}]}
score 1-100. tips najviše 3. foods 2 ili 3, salt100 strogo ispod 0.5. targetMeal je breakfast, lunch, dinner ili snack.
Ako koristiš namirnicu iz popisa, prepiši točan naziv: ${day.foodDb.filter((food) => food.salt < .5).slice(0, 24).map((food) => food.name).join(", ")}.
Cilj: ${goals.kcal} kcal, P ${goals.p} g, UH ${goals.c} g, M ${goals.f} g, sol max ${goals.maxSalt} g.
Unos: ${Math.round(analytics.totals.kcal)} kcal, P ${analytics.totals.p.toFixed(1)}, UH ${analytics.totals.c.toFixed(1)}, M ${analytics.totals.f.toFixed(1)}, sol ${analytics.totals.salt.toFixed(2)} g, gustoća ${analytics.avgDailySaltDensity.toFixed(2)} g/100 g, visokosolnih stavki ${analytics.totals.highSaltItems}.
Obroci:
${lines}
Piši konkretno i kratko, na hrvatskom. Ako je dan prazan, reci to i predloži jednostavan niskosolni dan.` } });
		setLoading(false);
		if (!response.ok) {
			setError(response.error);
			return;
		}
		setResult(response.result);
		setAdded({});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		wide: true,
		title: "Analiza dana",
		subtitle: "Jednokratni pregled unosa, soli i dopune. Ne zamjenjuje nutricionista.",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "primary",
				onClick: () => void run(),
				disabled: loading,
				children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, result ? "Ponovi analizu" : "Pokreni analizu"]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 rounded-xl bg-salt/10 px-3 py-2 text-sm text-salt",
				children: error
			}) : null,
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-bg p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl text-fg",
									children: result.headline
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 rounded-full bg-lime/15 px-2.5 py-1 text-sm font-semibold text-lime tabular-nums",
									children: [result.score, "/100"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: result.analysis
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Sol. "
								}), result.sodiumAdvice]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1.5 text-sm text-muted",
						children: result.tips.map((tip) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl bg-bg px-3 py-2",
							children: tip
						}, tip))
					}),
					result.recipeTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-bg p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-wide text-muted uppercase",
								children: "Priprema"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-semibold",
								children: result.recipeTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: result.recipeSteps
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: result.foods.map((food, index) => {
							const factor = food.grams / 100;
							const isAdded = added[index];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 rounded-xl bg-bg p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-semibold",
											children: [
												food.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted",
													children: [
														food.grams,
														" g · ",
														MEAL_LABEL[food.targetMeal]
													]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: food.reason
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs tabular-nums text-fg",
											children: [
												fmtInt(food.kcal100 * factor),
												" kcal · ",
												fmt(food.p100 * factor, 1),
												" P · sol ",
												fmt(food.salt100 * factor, 2),
												" g"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: isAdded ? "ghost" : "primary",
									disabled: isAdded,
									onClick: () => {
										const known = day.foodDb.find((row) => row.name.toLowerCase() === food.name.toLowerCase());
										if (known) day.addFood(known, food.targetMeal, food.grams);
										else day.addSnapshot({
											name: food.name,
											kcal: food.kcal100,
											p: food.p100,
											c: food.c100,
											f: food.f100,
											salt: food.salt100,
											category: "Vlastito"
										}, food.targetMeal, food.grams, true);
										setAdded((prev) => ({
											...prev,
											[index]: true
										}));
									},
									children: isAdded ? "Dodano" : "Dodaj"
								})]
							}, `${food.name}-${index}`);
						})
					})
				]
			}) : null
		]
	});
}
function saltPhrase(count) {
	const mod10 = count % 10;
	const mod100 = count % 100;
	return `${count} ${mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "namirnice prelaze" : "namirnica prelazi"}`;
}
function Dashboard({ day }) {
	const { analytics, goals } = day;
	const cards = [
		{
			label: "Još kalorija",
			icon: Flame,
			value: analytics.totals.kcal,
			goal: goals.kcal,
			unit: "kcal",
			digits: 0,
			tone: "lime"
		},
		{
			label: "Još proteina",
			icon: Beef,
			value: analytics.totals.p,
			goal: goals.p,
			unit: "g",
			digits: 1,
			tone: "lime"
		},
		{
			label: "Još ugljikohidrata",
			icon: Wheat,
			value: analytics.totals.c,
			goal: goals.c,
			unit: "g",
			digits: 1,
			tone: "cream"
		},
		{
			label: "Još masti",
			icon: Droplets,
			value: analytics.totals.f,
			goal: goals.f,
			unit: "g",
			digits: 1,
			tone: "olive"
		}
	];
	const saltOver = analytics.totals.salt > goals.maxSalt;
	const saltLeft = goals.maxSalt - analytics.totals.salt;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: cards.map((card) => {
					const left = card.goal - card.value;
					const Icon = card.icon;
					const over = left < 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-2xl bg-surface p-4 shadow-ring",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium",
									children: card.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-display text-3xl leading-none text-fg tabular-nums",
								children: [card.digits === 0 ? fmtInt(Math.max(0, left)) : fmt(Math.max(0, left), 1), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 font-sans text-sm font-medium text-muted",
									children: card.unit
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted tabular-nums",
								children: over ? `${card.digits === 0 ? fmtInt(-left) : fmt(-left, 1)} ${card.unit} preko` : `preostalo od ${card.digits === 0 ? fmtInt(card.goal) : fmt(card.goal, 0)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									value: card.value,
									max: card.goal,
									tone: over ? "salt" : card.tone
								})
							})
						]
					}, card.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: `rounded-2xl p-4 shadow-ring ${saltOver || analytics.totals.highSaltItems > 0 ? "bg-salt/10" : "bg-surface"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted",
							children: "Još soli · prag 1 g / 100 g"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `mt-1 font-display text-3xl leading-none tabular-nums ${saltOver ? "text-salt" : "text-fg"}`,
							children: [fmt(Math.max(0, saltLeft), 2), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-1 font-sans text-sm text-muted",
								children: "g preostalo"
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular-nums",
							children: [
								fmt(analytics.totals.salt, 2),
								" / ",
								fmt(goals.maxSalt, 1),
								" g",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mx-2 text-line",
									children: "·"
								}),
								"gustoća ",
								fmt(analytics.avgDailySaltDensity, 2),
								" g/100 g"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							value: analytics.totals.salt,
							max: goals.maxSalt,
							tone: saltOver ? "salt" : "lime"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: analytics.totals.highSaltItems === 0 ? "Nijedna stavka ne prelazi 1 g soli na 100 g." : `${saltPhrase(analytics.totals.highSaltItems)} prag. Zamjena je ponuđena uz stavku.`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-surface px-4 py-3 shadow-ring",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Udio kalorija iz makrosa" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							"P ",
							analytics.split.pPct,
							"% · UH ",
							analytics.split.cPct,
							"% · M ",
							analytics.split.fPct,
							"%"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-2 overflow-hidden rounded-full bg-bg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-lime",
							style: { width: `${analytics.split.pPct}%` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-cream",
							style: { width: `${analytics.split.cPct}%` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-olive",
							style: { width: `${analytics.split.fPct}%` }
						})
					]
				})]
			}),
			day.suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl bg-surface p-4 shadow-ring",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-fg",
						children: "Dopuna iz baze"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Porcije koje zatvaraju ostatak, sol ispod 1 g/100 g"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 lg:grid-cols-3",
					children: day.suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 rounded-xl bg-bg p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm font-semibold text-fg",
								children: [item.food.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-muted",
									children: [
										" · ",
										item.grams,
										" g"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted tabular-nums",
								children: [
									MEAL_LABEL[item.mealId],
									" · ",
									fmtInt(item.kcal),
									" kcal · ",
									fmt(item.p, 1),
									" g P · ",
									fmt(item.salt, 2),
									" g soli"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "shrink-0",
							variant: "primary",
							onClick: () => day.addFood(item.food, item.mealId, item.grams),
							children: "Dodaj"
						})]
					}, item.food.id))
				})]
			}) : null
		]
	});
}
var ICONS$1 = {
	"Meso i riba": Beef,
	"Mliječno i jaja": Egg,
	Ugljikohidrati: Wheat,
	"Voće i povrće": Leaf,
	"Masti i grickalice": Droplets,
	Vlastito: Bookmark
};
var PORTIONS$1 = [
	50,
	100,
	150,
	200,
	250
];
function FoodColumn({ day }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface p-4 shadow-ring lg:sticky lg:top-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold text-fg",
					children: "Baza, na 100 g"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Dodaje se u ",
						MEAL_LABEL[day.activeMeal].toLowerCase(),
						", ",
						day.portion,
						" g."
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "primary",
					onClick: () => day.setCustomOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Ručno"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4",
				children: Object.keys(MEAL_LABEL).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => day.setActiveMeal(id),
					className: `h-11 rounded-xl text-sm font-medium ${day.activeMeal === id ? "bg-lime text-lime-ink" : "bg-bg text-muted"}`,
					children: MEAL_LABEL[id]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1.5",
				children: PORTIONS$1.map((grams) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => day.setPortion(grams),
					className: `h-11 rounded-lg px-2.5 text-xs font-semibold tabular-nums ${day.portion === grams ? "bg-cream text-lime-ink" : "bg-bg text-muted"}`,
					children: [grams, " g"]
				}, grams))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: day.query,
					onChange: (event) => day.setQuery(event.target.value),
					placeholder: "Traži namirnicu",
					className: `${inputClass} pl-9`,
					"aria-label": "Pretraži namirnice"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex min-w-0 gap-1.5 overflow-x-auto pb-1",
				children: [["Sve", ...CATEGORIES].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => day.setCategory(cat),
					className: `h-11 shrink-0 rounded-lg px-2.5 text-xs font-medium ${day.category === cat ? "bg-cream text-lime-ink" : "bg-bg text-muted"}`,
					children: cat
				}, cat)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => day.setOnlyLowSalt(!day.onlyLowSalt),
					"aria-pressed": day.onlyLowSalt,
					className: `h-11 shrink-0 rounded-lg px-2.5 text-xs font-medium ${day.onlyLowSalt ? "bg-lime text-lime-ink" : "bg-bg text-muted"}`,
					children: "Samo niska sol"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 max-h-[32rem] space-y-2 overflow-y-auto pr-1",
				children: day.filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-bg px-3 py-8 text-center text-sm text-muted",
					children: ["Nema pogotka.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-2 block w-full text-lime",
						onClick: () => day.setCustomOpen(true),
						children: "Dodaj ručno"
					})]
				}) : day.filtered.map((food) => {
					const Icon = ICONS$1[food.category] ?? Bookmark;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-xl bg-bg p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold text-fg",
										title: food.name,
										children: food.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-xs text-muted tabular-nums",
										children: [
											food.kcal,
											" kcal · ",
											fmt(food.p, 1),
											" P · ",
											fmt(food.c, 1),
											" UH · ",
											fmt(food.f, 1),
											" M"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaltBadge, { salt: food.salt })
									})
								]
							}),
							food.category === "Vlastito" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": `Ukloni ${food.name} iz baze`,
								onClick: () => day.removeCustom(food.id),
								className: "grid size-11 place-items-center rounded-xl text-muted hover:text-salt",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => day.addFood(food),
								className: "grid h-11 shrink-0 place-items-center rounded-xl bg-surface px-3 text-sm font-semibold text-lime hover:bg-lime hover:text-lime-ink",
								children: [
									"+",
									day.portion,
									" g"
								]
							})
						]
					}, food.id);
				})
			})
		]
	});
}
var PORTIONS = [
	40,
	60,
	80,
	100,
	120,
	150,
	180,
	200,
	250,
	300
];
function fit(need, add, weight) {
	if (need <= 0) return -add * weight * 1.5;
	const covered = Math.min(need, add);
	const over = Math.max(0, add - need);
	return covered * weight - over * weight * 1.7;
}
function lowestMeal(meals) {
	const stats = analyze(meals);
	return MEAL_IDS.reduce((best, id) => stats.byMeal[id].kcal < stats.byMeal[best].kcal ? id : best);
}
function suggestFills(foods, meals, goals) {
	const stats = analyze(meals);
	if (stats.totals.grams < 1) return [];
	const rem = {
		kcal: goals.kcal - stats.totals.kcal,
		p: goals.p - stats.totals.p,
		c: goals.c - stats.totals.c,
		f: goals.f - stats.totals.f,
		salt: goals.maxSalt - stats.totals.salt
	};
	if (rem.kcal < 90 && rem.p < 10 && rem.c < 15 && rem.f < 6) return [];
	const mealId = lowestMeal(meals);
	const ranked = [];
	for (const food of foods) {
		if (food.salt >= 1) continue;
		let best = null;
		for (const grams of PORTIONS) {
			const factor = grams / 100;
			const add = {
				kcal: food.kcal * factor,
				p: food.p * factor,
				c: food.c * factor,
				f: food.f * factor,
				salt: food.salt * factor
			};
			if (add.salt > Math.max(.15, rem.salt)) continue;
			if (rem.kcal > 0 && add.kcal > rem.kcal + 140) continue;
			if (rem.kcal <= 0 && add.kcal > 90) continue;
			const score = fit(rem.p, add.p, 3.1) + fit(rem.c, add.c, 1.15) + fit(rem.f, add.f, 1.35) + fit(rem.kcal, add.kcal, .018);
			if (!best || score > best.score) best = {
				food,
				grams,
				mealId,
				...add,
				score
			};
		}
		if (best && best.score > 8) ranked.push(best);
	}
	ranked.sort((a, b) => b.score - a.score);
	const picked = [];
	for (const item of ranked) {
		if (picked.some((p) => p.food.category === item.food.category && p.food.id !== item.food.id)) {
			if (picked.length >= 2 && picked.filter((p) => p.food.category === item.food.category).length) continue;
		}
		picked.push(item);
		if (picked.length === 3) break;
	}
	return picked;
}
function lowSaltSwap(current, foods) {
	if (current.salt100 < 1) return null;
	const tokens = current.name.toLowerCase().split(/[^a-zčćžšđ0-9]+/i).filter((word) => word.length > 3);
	const alts = foods.filter((food) => food.category === current.category && food.salt < .5 && food.name !== current.name);
	alts.sort((a, b) => likeness(b) - likeness(a));
	return alts[0] ?? null;
	function likeness(food) {
		const name = food.name.toLowerCase();
		return tokens.reduce((sum, word) => sum + (name.includes(word) ? 1 : 0), 0) * 5 + (.5 - food.salt) + food.p / 200;
	}
}
var ICONS = {
	breakfast: Coffee,
	lunch: Sun,
	dinner: Moon,
	snack: Cookie
};
function Meals({ day }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [MEAL_IDS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MealCard, {
			id,
			day
		}, id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, { day })]
	});
}
function MealCard({ id, day }) {
	const Icon = ICONS[id];
	const items = day.meals[id];
	const sub = day.analytics.byMeal[id];
	const active = day.activeMeal === id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: `meal-${id}`,
		className: `scroll-mt-24 overflow-hidden rounded-2xl bg-surface shadow-ring ${active ? "shadow-ring-strong" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => day.setActiveMeal(id),
			className: "flex w-full flex-col gap-3 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-11 place-items-center rounded-xl bg-bg text-lime",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base font-semibold text-fg",
						children: MEAL_LABEL[id]
					}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-lime",
						children: "odabran"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block text-sm text-muted",
					children: MEAL_HINT[id]
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted tabular-nums sm:text-right",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-fg",
						children: [fmtInt(sub.kcal), " kcal"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1.5",
						children: "·"
					}),
					fmt(sub.p, 1),
					" P",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1.5",
						children: "·"
					}),
					fmt(sub.c, 1),
					" UH",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1.5",
						children: "·"
					}),
					fmt(sub.f, 1),
					" M",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-1.5",
						children: "·"
					}),
					fmt(sub.salt, 2),
					" g soli"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 px-4 pb-4",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					day.setActiveMeal(id);
					day.setPanel("foods");
				},
				className: "w-full rounded-xl border border-dashed border-line px-3 py-6 text-sm text-muted hover:text-fg",
				children: "Prazno. Otvori bazu i dodaj namirnicu."
			}) : items.map((item) => {
				const scaled = scaleEntry(item);
				const swap = lowSaltSwap(item, day.foodDb);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-bg p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-fg",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted tabular-nums",
									children: [
										fmtInt(scaled.kcal),
										" kcal · ",
										fmt(scaled.p, 1),
										" P · ",
										fmt(scaled.c, 1),
										" UH · ",
										fmt(scaled.f, 1),
										" M · sol ",
										fmt(scaled.salt, 2),
										" g"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaltBadge, { salt: item.salt100 })]
						}),
						swap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => day.replaceEntry(id, item.entryId, swap),
							className: "mt-2 text-left text-xs font-medium text-lime hover:underline",
							children: [
								"Zamijeni s: ",
								swap.name,
								" (",
								fmt(swap.salt, 2),
								" g/100 g)"
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-1 flex-wrap gap-1",
									children: [
										50,
										100,
										150,
										200
									].map((grams) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => day.updateGrams(id, item.entryId, grams),
										className: `h-11 rounded-lg px-2 text-xs font-semibold tabular-nums ${item.grams === grams ? "bg-lime text-lime-ink" : "bg-surface text-muted"}`,
										children: [grams, " g"]
									}, grams))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "sr-only",
											children: ["Gramaža za ", item.name]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: 0,
											max: 2500,
											value: item.grams,
											onChange: (event) => day.updateGrams(id, item.entryId, Number(event.target.value)),
											className: "h-11 w-20 rounded-xl bg-surface pr-6 pl-2 text-sm font-semibold text-fg tabular-nums shadow-ring outline-none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-faint",
											children: "g"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": `Ukloni ${item.name}`,
									onClick: () => day.removeEntry(id, item.entryId),
									className: "grid size-11 place-items-center rounded-xl text-muted hover:bg-salt/10 hover:text-salt",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						})
					]
				}, item.entryId);
			})
		})]
	});
}
function Summary({ day }) {
	const { analytics } = day;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "overflow-x-auto rounded-2xl bg-surface p-4 shadow-ring",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-fg",
					children: "Sažetak dana"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted tabular-nums",
					children: [
						"Masa hrane ",
						fmtInt(analytics.totals.grams),
						" g"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 md:hidden",
				children: [MEAL_IDS.map((id) => {
					const row = analytics.byMeal[id];
					const high = row.avgSaltPer100g >= 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-bg px-3 py-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: MEAL_LABEL[id]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm tabular-nums",
									children: [fmtInt(row.kcal), " kcal"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted tabular-nums",
								children: [
									fmt(row.p, 1),
									" P · ",
									fmt(row.c, 1),
									" UH · ",
									fmt(row.f, 1),
									" M · ",
									fmt(row.salt, 2),
									" g soli"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `mt-1 text-xs tabular-nums ${high ? "text-salt" : "text-lime"}`,
								children: [fmt(row.avgSaltPer100g, 2), " g / 100 g"]
							})
						]
					}, id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-1 text-sm font-semibold tabular-nums",
					children: [
						"Ukupno ",
						fmtInt(analytics.totals.kcal),
						" kcal · ",
						fmt(analytics.totals.p, 1),
						" P · ",
						fmt(analytics.totals.salt, 2),
						" g soli"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 font-medium",
										children: "Obrok"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "Masa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "kcal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "P"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "UH"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "M"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 pr-3 text-right font-medium",
										children: "Sol"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 text-right font-medium",
										children: "g / 100 g"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: MEAL_IDS.map((id) => {
							const row = analytics.byMeal[id];
							const high = row.avgSaltPer100g >= 1;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-line/70",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 font-medium",
										children: MEAL_LABEL[id]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2.5 pr-3 text-right text-muted tabular-nums",
										children: [fmtInt(row.grams), " g"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 text-right tabular-nums",
										children: fmtInt(row.kcal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 text-right tabular-nums",
										children: fmt(row.p, 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 text-right tabular-nums",
										children: fmt(row.c, 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 text-right tabular-nums",
										children: fmt(row.f, 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 pr-3 text-right tabular-nums",
										children: fmt(row.salt, 2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: `py-2.5 text-right tabular-nums ${high ? "text-salt" : "text-lime"}`,
										children: fmt(row.avgSaltPer100g, 2)
									})
								]
							}, id);
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3",
									children: "Ukupno"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "pt-3 text-right tabular-nums",
									children: [fmtInt(analytics.totals.grams), " g"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmtInt(analytics.totals.kcal)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmt(analytics.totals.p, 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmt(analytics.totals.c, 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmt(analytics.totals.f, 1)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmt(analytics.totals.salt, 2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "pt-3 text-right tabular-nums",
									children: fmt(analytics.avgDailySaltDensity, 2)
								})
							]
						}) })
					]
				})
			})
		]
	});
}
var KEY = "macrocore-day-v1";
function num(value, fallback = 0) {
	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}
function asEntry(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (typeof row.name !== "string" || !row.name.trim()) return null;
	return {
		entryId: typeof row.entryId === "string" ? row.entryId : `e_${Math.random().toString(36).slice(2)}`,
		foodId: typeof row.foodId === "string" ? row.foodId : "custom",
		name: row.name,
		grams: Math.max(0, Math.min(2500, num(row.grams))),
		kcal100: num(row.kcal100),
		p100: num(row.p100),
		c100: num(row.c100),
		f100: num(row.f100),
		salt100: num(row.salt100),
		category: typeof row.category === "string" ? row.category : "Vlastito"
	};
}
function asFood(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	if (typeof row.name !== "string" || !row.name.trim()) return null;
	return {
		id: typeof row.id === "string" ? row.id : `custom_${Math.random().toString(36).slice(2)}`,
		name: row.name,
		kcal: num(row.kcal),
		p: num(row.p),
		c: num(row.c),
		f: num(row.f),
		salt: num(row.salt),
		category: "Vlastito"
	};
}
function loadState() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (data.v !== 1 || !data.goals || !data.meals) return null;
		const meals = {};
		for (const id of MEAL_IDS) {
			const list = data.meals[id];
			meals[id] = Array.isArray(list) ? list.map(asEntry).filter((item) => !!item) : [];
		}
		return {
			v: 1,
			preset: typeof data.preset === "string" ? data.preset : "custom",
			goals: {
				kcal: Math.max(500, num(data.goals.kcal, 2400)),
				p: Math.max(20, num(data.goals.p, 185)),
				c: Math.max(0, num(data.goals.c, 240)),
				f: Math.max(10, num(data.goals.f, 78)),
				maxSalt: Math.max(1, num(data.goals.maxSalt, 5))
			},
			meals,
			customFoods: Array.isArray(data.customFoods) ? data.customFoods.map(asFood).filter((item) => !!item) : []
		};
	} catch {
		return null;
	}
}
function saveState(state) {
	localStorage.setItem(KEY, JSON.stringify(state));
}
var emptyDraft = () => ({
	name: "",
	kcal: "",
	p: "",
	c: "",
	f: "",
	salt: "",
	grams: "100",
	saveToDb: true
});
function useDay() {
	const [customFoods, setCustomFoods] = (0, import_react.useState)([]);
	const [meals, setMeals] = (0, import_react.useState)(SAMPLE_MEALS);
	const [goals, setGoals] = (0, import_react.useState)(PRESETS.recomp);
	const [preset, setPreset] = (0, import_react.useState)("recomp");
	const [ready, setReady] = (0, import_react.useState)(false);
	const [activeMeal, setActiveMeal] = (0, import_react.useState)("breakfast");
	const [portion, setPortion] = (0, import_react.useState)(100);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Sve");
	const [onlyLowSalt, setOnlyLowSalt] = (0, import_react.useState)(false);
	const [panel, setPanel] = (0, import_react.useState)("meals");
	const [goalsOpen, setGoalsOpen] = (0, import_react.useState)(false);
	const [customOpen, setCustomOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = loadState();
		if (saved) {
			setCustomFoods(saved.customFoods);
			setMeals(saved.meals);
			setGoals(saved.goals);
			setPreset(saved.preset);
		}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		saveState({
			v: 1,
			customFoods,
			meals,
			goals,
			preset
		});
	}, [
		ready,
		customFoods,
		meals,
		goals,
		preset
	]);
	const foodDb = (0, import_react.useMemo)(() => [...customFoods, ...BASE_FOODS], [customFoods]);
	const analytics = (0, import_react.useMemo)(() => analyze(meals), [meals]);
	const suggestions = (0, import_react.useMemo)(() => suggestFills(foodDb, meals, goals), [
		foodDb,
		meals,
		goals
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return foodDb.filter((item) => {
			if (q && !item.name.toLowerCase().includes(q)) return false;
			if (category !== "Sve" && item.category !== category) return false;
			if (onlyLowSalt && item.salt >= 1) return false;
			return true;
		});
	}, [
		foodDb,
		query,
		category,
		onlyLowSalt
	]);
	function focusMeal(id) {
		setActiveMeal(id);
		setPanel("meals");
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		requestAnimationFrame(() => {
			document.getElementById(`meal-${id}`)?.scrollIntoView({
				behavior: reduce ? "auto" : "smooth",
				block: "start"
			});
		});
	}
	function addFood(food, mealId = activeMeal, grams = portion) {
		setMeals((prev) => ({
			...prev,
			[mealId]: [...prev[mealId], entryFromFood(food, grams)]
		}));
		focusMeal(mealId);
	}
	function addSnapshot(food, mealId, grams, save) {
		const item = {
			id: `custom_${crypto.randomUUID()}`,
			name: food.name.trim(),
			kcal: food.kcal,
			p: food.p,
			c: food.c,
			f: food.f,
			salt: food.salt,
			category: food.category ?? "Vlastito"
		};
		if (save) setCustomFoods((prev) => [item, ...prev.filter((row) => row.name !== item.name)]);
		addFood(item, mealId, grams);
	}
	function updateGrams(mealId, entryId, grams) {
		const next = Math.max(0, Math.min(2500, Math.round(Number(grams) || 0)));
		setMeals((prev) => ({
			...prev,
			[mealId]: prev[mealId].map((item) => item.entryId === entryId ? {
				...item,
				grams: next
			} : item)
		}));
	}
	function removeEntry(mealId, entryId) {
		setMeals((prev) => ({
			...prev,
			[mealId]: prev[mealId].filter((item) => item.entryId !== entryId)
		}));
	}
	function replaceEntry(mealId, entryId, food) {
		setMeals((prev) => ({
			...prev,
			[mealId]: prev[mealId].map((item) => item.entryId === entryId ? {
				...entryFromFood(food, item.grams),
				entryId: item.entryId
			} : item)
		}));
	}
	function applyPreset(key) {
		const next = PRESETS[key];
		if (!next) return;
		setPreset(key);
		setGoals({
			kcal: next.kcal,
			p: next.p,
			c: next.c,
			f: next.f,
			maxSalt: next.maxSalt
		});
	}
	function editGoal(patch) {
		setPreset("custom");
		setGoals((prev) => ({
			...prev,
			...patch
		}));
	}
	function submitCustom(event) {
		event.preventDefault();
		if (!draft.name.trim()) return;
		addSnapshot({
			name: draft.name,
			kcal: Number(draft.kcal) || 0,
			p: Number(draft.p) || 0,
			c: Number(draft.c) || 0,
			f: Number(draft.f) || 0,
			salt: Number(draft.salt) || 0,
			category: "Vlastito"
		}, activeMeal, Number(draft.grams) || 100, draft.saveToDb);
		setDraft(emptyDraft());
		setCustomOpen(false);
	}
	function removeCustom(id) {
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
		}
	};
}
function MacroApp() {
	const day = useDay();
	const [parserOpen, setParserOpen] = (0, import_react.useState)(false);
	const [coachOpen, setCoachOpen] = (0, import_react.useState)(false);
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
			})
		];
		try {
			await navigator.clipboard.writeText(lines.join("\n"));
			day.setCopied(true);
			window.setTimeout(() => day.setCopied(false), 1600);
		} catch {
			day.setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-2xl leading-none",
							children: ["MACRO", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lime italic",
								children: "core"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Kalkulator obroka · sol ispod 1 g / 100 g"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								"aria-pressed": day.goalsOpen,
								onClick: () => day.setGoalsOpen(!day.goalsOpen),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), "Ciljevi"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setParserOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanText, { className: "size-4" }), "Procijeni"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "primary",
								onClick: () => setCoachOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "size-4" }), "Analiza"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								"aria-label": "Kopiraj sažetak",
								onClick: () => void copySummary(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), day.copied ? "Kopirano" : "Sažetak"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl space-y-4 px-4 py-5",
				children: [
					day.goalsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Goals, { day }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { day }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => day.setPanel("meals"),
							className: `h-11 rounded-xl text-sm font-semibold ${day.panel === "meals" ? "bg-lime text-lime-ink" : "bg-surface text-muted"}`,
							children: "Obroci"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => day.setPanel("foods"),
							className: `h-11 rounded-xl text-sm font-semibold ${day.panel === "foods" ? "bg-lime text-lime-ink" : "bg-surface text-muted"}`,
							children: "Namirnice"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-w-0 items-start gap-4 lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: day.panel === "foods" ? "min-w-0 lg:col-span-5" : "hidden min-w-0 lg:col-span-5 lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodColumn, { day })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: day.panel === "meals" ? "min-w-0 space-y-4 lg:col-span-7" : "hidden min-w-0 space-y-4 lg:col-span-7 lg:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: day.confirm === "sample" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "primary",
									onClick: day.loadSample,
									children: "Učitaj primjer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => day.setConfirm(null),
									children: "Odustani"
								})] }) : day.confirm === "reset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: day.resetDay,
									children: "Obriši današnji unos"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => day.setConfirm(null),
									children: "Odustani"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => day.setConfirm("sample"),
									children: "Primjer dana"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => day.setConfirm("reset"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Isprazni"]
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meals, { day })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-6 text-xs leading-relaxed text-muted",
						children: "Vrijednosti su tipične na 100 g i služe za praćenje unosa, ne kao medicinski savjet. Dan se pamti u ovom pregledniku. AI procjena troši tvoj xAI kredit samo kad je pokreneš."
					})
				]
			}),
			day.customOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomFoodDialog, { day }) : null,
			parserOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParserDialog, {
				day,
				onClose: () => setParserOpen(false)
			}) : null,
			coachOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachDialog, {
				day,
				onClose: () => setCoachOpen(false)
			}) : null
		]
	});
}
function Goals({ day }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface p-4 shadow-ring",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: "Dnevni cilj"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: day.preset === "custom" ? "Ručno podešeno" : PRESETS[day.preset]?.detail
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: Object.entries(PRESETS).map(([key, preset]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => day.applyPreset(key),
					className: `rounded-xl px-3 py-2 text-left text-sm ${day.preset === key ? "bg-lime text-lime-ink" : "bg-bg text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-semibold",
						children: preset.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs tabular-nums",
						children: [
							fmtInt(preset.kcal),
							" kcal · ",
							preset.p,
							" g P"
						]
					})]
				}, key))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5",
			children: [
				{
					key: "kcal",
					label: "Kalorije",
					min: 500
				},
				{
					key: "p",
					label: "Proteini, g",
					min: 20
				},
				{
					key: "c",
					label: "Ugljikohidrati, g",
					min: 0
				},
				{
					key: "f",
					label: "Masti, g",
					min: 10
				},
				{
					key: "maxSalt",
					label: "Max sol, g",
					step: "0.5",
					min: 1
				}
			].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: field.label,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: field.min,
					step: field.step ?? "1",
					value: day.goals[field.key],
					onChange: (event) => day.editGoal({ [field.key]: Math.max(field.min, Number(event.target.value) || 0) }),
					className: inputClass
				})
			}, field.key))
		})]
	});
}
var SplitComponent = MacroApp;
//#endregion
export { SplitComponent as component };
