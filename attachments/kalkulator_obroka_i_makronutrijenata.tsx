import React, { useState, useMemo } from 'react';
import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Search,
  Sliders,
  RotateCcw,
  Sparkles,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Scale,
  PlusCircle,
  Filter,
  Brain,
  Wand2,
  Camera,
  Loader2,
  X,
  ArrowRight,
  MessageSquareSparkles,
  Check
} from 'lucide-react';

// Predefinirana baza lokalnih namirnica (vrijednosti na 100g)
const INITIAL_FOOD_DB = [
  { id: 'f1', name: 'Pileća prsa (pečena / sirova)', kcal: 165, p: 31.0, c: 0.0, f: 3.6, salt: 0.18, category: 'Meso i riba', emoji: '🍗' },
  { id: 'f2', name: 'Pureća prsa (čista)', kcal: 135, p: 30.0, c: 0.0, f: 1.0, salt: 0.15, category: 'Meso i riba', emoji: '🦃' },
  { id: 'f3', name: 'Posni sir (Dukat / Pilos)', kcal: 72, p: 12.0, c: 4.0, f: 0.5, branch: 'Mliječno', salt: 0.10, category: 'Mliječno i jaja', emoji: '🥣' },
  { id: 'f4', name: 'Kefir (klasični)', kcal: 52, p: 3.4, c: 4.0, f: 2.5, salt: 0.12, category: 'Mliječno i jaja', emoji: '🥛' },
  { id: 'f5', name: 'Tamna čokolada (85% kakaa)', kcal: 580, p: 9.0, c: 20.0, f: 48.0, salt: 0.02, category: 'Grickalice i zdrave masti', emoji: '🍫' },
  { id: 'f6', name: 'Zobene pahuljice', kcal: 372, p: 13.5, c: 58.7, f: 7.0, salt: 0.02, category: 'Ugljikohidrati', emoji: '🌾' },
  { id: 'f7', name: 'Jaja (cijela, kuhana/pečena)', kcal: 155, p: 13.0, c: 1.1, f: 11.0, salt: 0.30, category: 'Mliječno i jaja', emoji: '🥚' },
  { id: 'f8', name: 'Bijela riža (kuhana)', kcal: 130, p: 2.7, c: 28.0, f: 0.3, salt: 0.01, category: 'Ugljikohidrati', emoji: '🍚' },
  { id: 'f9', name: 'Krumpir (kuhani/pečeni bez ulja)', kcal: 87, p: 1.9, c: 20.0, f: 0.1, salt: 0.05, category: 'Ugljikohidrati', emoji: '🥔' },
  { id: 'f10', name: 'Maslinovo ulje (ekstra djevičansko)', kcal: 884, p: 0.0, c: 0.0, f: 100.0, salt: 0.00, category: 'Grickalice i zdrave masti', emoji: '🫒' },
  { id: 'f11', name: 'Tuna u salamuri (ocijeđena)', kcal: 116, p: 26.0, c: 0.0, f: 1.0, salt: 1.10, category: 'Meso i riba', emoji: '🐟' },
  { id: 'f12', name: 'Dimcek / Pileća prsa u ovitku', kcal: 105, p: 21.0, c: 1.0, f: 2.0, salt: 1.85, category: 'Meso i riba', emoji: '🥓' },
  { id: 'f13', name: 'Zrnati sir (Cottage cheese)', kcal: 98, p: 11.0, c: 3.4, f: 4.3, salt: 0.75, category: 'Mliječno i jaja', emoji: '🧀' },
  { id: 'f14', name: 'Banana', kcal: 89, p: 1.1, c: 22.8, f: 0.3, salt: 0.00, category: 'Voće i povrće', emoji: '🍌' },
  { id: 'f15', name: 'Brokula (kuhana na pari)', kcal: 35, p: 2.4, c: 7.2, f: 0.4, salt: 0.04, category: 'Voće i povrće', emoji: '🥦' },
];

const MEAL_SLOTS = [
  { id: 'breakfast', label: 'Doručak', subtitle: 'Jutarnje punjenje goriva', icon: Coffee, accent: 'from-amber-500/20 to-orange-500/5', border: 'border-amber-500/30', text: 'text-amber-400' },
  { id: 'lunch', label: 'Ručak', subtitle: 'Glavni energetski blok', icon: Sun, accent: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { id: 'dinner', label: 'Večera', subtitle: 'Oporavak i regeneracija', icon: Moon, accent: 'from-cyan-500/20 to-blue-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  { id: 'snack', label: 'Međuobrok / Snack', subtitle: 'Taktička dopuna makrosa', icon: Cookie, accent: 'from-purple-500/20 to-indigo-500/5', border: 'border-purple-500/30', text: 'text-purple-400' },
];

const GOAL_PRESETS = {
  deficit: { name: 'Deficit / Rezanje', desc: 'Visoki proteini, kontrolirani UH i sol', kcal: 1950, p: 175, c: 165, f: 65, maxSalt: 4.0 },
  recomp: { name: 'Rekompozicija / Održavanje', desc: 'Balansirani unos za snagu i definiciju', kcal: 2400, p: 185, c: 240, f: 78, maxSalt: 5.0 },
  bulk: { name: 'Lean Bulk / Masa', desc: 'Kalorijski suficit za rast mišića', kcal: 2900, p: 195, c: 345, f: 82, maxSalt: 5.0 },
};

// Ogledni "High-Protein Low-Salt" dnevni jelovnik
const SAMPLE_PRESET_MEALS = {
  breakfast: [
    { entryId: 's1', foodId: 'f6', name: 'Zobene pahuljice', emoji: '🌾', grams: 80, kcal100: 372, p100: 13.5, c100: 58.7, f100: 7.0, salt100: 0.02 },
    { entryId: 's2', foodId: 'f3', name: 'Posni sir (Dukat / Pilos)', emoji: '🥣', grams: 200, kcal100: 72, p100: 12.0, c100: 4.0, f100: 0.5, salt100: 0.10 },
    { entryId: 's3', foodId: 'f14', name: 'Banana', emoji: '🍌', grams: 120, kcal100: 89, p100: 1.1, c100: 22.8, f100: 0.3, salt100: 0.00 },
  ],
  lunch: [
    { entryId: 's4', foodId: 'f1', name: 'Pileća prsa (pečena / sirova)', emoji: '🍗', grams: 220, kcal100: 165, p100: 31.0, c100: 0.0, f100: 3.6, salt100: 0.18 },
    { entryId: 's5', foodId: 'f8', name: 'Bijela riža (kuhana)', emoji: '🍚', grams: 250, kcal100: 130, p100: 2.7, c100: 28.0, f100: 0.3, salt100: 0.01 },
    { entryId: 's6', foodId: 'f15', name: 'Brokula (kuhana na pari)', emoji: '🥦', grams: 150, kcal100: 35, p100: 2.4, c100: 7.2, f100: 0.4, salt100: 0.04 },
    { entryId: 's7', foodId: 'f10', name: 'Maslinovo ulje (ekstra djevičansko)', emoji: '🫒', grams: 12, kcal100: 884, p100: 0.0, c100: 0.0, f100: 100.0, salt100: 0.00 },
  ],
  dinner: [
    { entryId: 's8', foodId: 'f2', name: 'Pureća prsa (čista)', emoji: '🦃', grams: 180, kcal100: 135, p100: 30.0, c100: 0.0, f100: 1.0, salt100: 0.15 },
    { entryId: 's9', foodId: 'f9', name: 'Krumpir (kuhani/pečeni bez ulja)', emoji: '🥔', grams: 250, kcal100: 87, p100: 1.9, c100: 20.0, f100: 0.1, salt100: 0.05 },
    { entryId: 's10', foodId: 'f7', name: 'Jaja (cijela, kuhana/pečena)', emoji: '🥚', grams: 100, kcal100: 155, p100: 13.0, c100: 1.1, f100: 11.0, salt100: 0.30 },
  ],
  snack: [
    { entryId: 's11', foodId: 'f4', name: 'Kefir (klasični)', emoji: '🥛', grams: 250, kcal100: 52, p100: 3.4, c100: 4.0, f100: 2.5, salt100: 0.12 },
    { entryId: 's12', foodId: 'f5', name: 'Tamna čokolada (85% kakaa)', emoji: '🍫', grams: 30, kcal100: 580, p100: 9.0, c100: 20.0, f100: 48.0, salt100: 0.02 },
  ]
};

export default function App() {
  // Baza namirnica i filteri
  const [foodDb, setFoodDb] = useState(INITIAL_FOOD_DB);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Sve');
  const [onlyLowSalt, setOnlyLowSalt] = useState(false);
  const [activeMealSlot, setActiveMealSlot] = useState('breakfast');
  const [quickPortionGrams, setQuickPortionGrams] = useState(100);

  // Dnevni ciljevi
  const [goals, setGoals] = useState(GOAL_PRESETS.recomp);
  const [activePresetKey, setActivePresetKey] = useState('recomp');
  const [showGoalEditor, setShowGoalEditor] = useState(false);

  // Stanje obroka (počinje s učitanim oglednim jelovnikom)
  const [meals, setMeals] = useState(SAMPLE_PRESET_MEALS);

  // Forma za vlastitu namirnicu
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    kcal: '',
    p: '',
    c: '',
    f: '',
    salt: '',
    grams: '100',
    saveToDb: true
  });

  // --- GEMINI AI STANJA ---
  const [showAiParserModal, setShowAiParserModal] = useState(false);
  const [aiQueryText, setAiQueryText] = useState('');
  const [aiImageBase64, setAiImageBase64] = useState(null);
  const [aiImageMime, setAiImageMime] = useState('image/jpeg');
  const [aiImagePreview, setAiImagePreview] = useState(null);
  const [aiParsedItems, setAiParsedItems] = useState([]);
  const [aiParserLoading, setAiParserLoading] = useState(false);
  const [aiParserError, setAiParserError] = useState('');

  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [aiCoachResult, setAiCoachResult] = useState(null);
  const [aiCoachError, setAiCoachError] = useState('');
  const [addedSuggestions, setAddedSuggestions] = useState({});

  // Pomoćna funkcija za Gemini API poziv s eksponencijalnim backoffom
  const callGeminiApi = async (payload) => {
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Prazan odgovor od AI modela.');
        }
        return text;
      } catch (err) {
        if (attempt === delays.length) {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
      }
    }
  };

  // Učitavanje slike za AI skener obroka ili deklaracije
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAiImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setAiImagePreview(dataUrl);
      const base64Content = dataUrl.split(',')[1];
      setAiImageBase64(base64Content);
    };
    reader.readAsDataURL(file);
  };

  // 1. Gemini AI: Prirodni unos obroka ili analiza fotografije
  const handleRunAiFoodParser = async (e) => {
    e.preventDefault();
    if (!aiQueryText.trim() && !aiImageBase64) return;

    setAiParserLoading(true);
    setAiParserError('');
    setAiParsedItems([]);

    try {
      const parts = [];
      const promptText = `Analiziraj navedeni opis obroka ili priloženu sliku (hrane ili nutritivne deklaracije) i pretvori svaku prepoznatu namirnicu u točne nutritivne vrijednosti NA 100 GRAMA, uz procijenjenu porciju u gramima.
Opis korisnika: "${aiQueryText || 'Analiziraj hranu/deklaraciju sa slike'}"
Vrati isključivo JSON polje objekata na hrvatskom jeziku.`;

      parts.push({ text: promptText });

      if (aiImageBase64) {
        parts.push({
          inlineData: {
            mimeType: aiImageMime,
            data: aiImageBase64,
          },
        });
      }

      const payload = {
        contents: [{ role: 'user', parts }],
        systemInstruction: {
          parts: [
            {
              text: 'Ti si vrhunski sportski nutricionist. Precizno procjenjuješ kalorije, proteine, ugljikohidrate, masti i sol (u gramima na 100g namirnice). Posebno pazi na točan izračun soli na 100g zbog Sodium Watch protokola (<1g/100g). Odgovaraj na hrvatskom jeziku.',
            },
          ],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                emoji: { type: 'STRING' },
                grams: { type: 'NUMBER' },
                kcal100: { type: 'NUMBER' },
                p100: { type: 'NUMBER' },
                c100: { type: 'NUMBER' },
                f100: { type: 'NUMBER' },
                salt100: { type: 'NUMBER' },
                category: { type: 'STRING' }
              },
              propertyOrdering: ['name', 'emoji', 'grams', 'kcal100', 'p100', 'c100', 'f100', 'salt100', 'category']
            }
          }
        }
      };

      const rawJson = await callGeminiApi(payload);
      const parsed = JSON.parse(rawJson);
      setAiParsedItems(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      setAiParserError('Nije uspjela AI analiza. Provjeri opis ili pokušaj ponovno.');
    } finally {
      setAiParserLoading(false);
    }
  };

  // Dodavanje stavki iz AI parsera u aktivni obrok i bazu
  const handleAddAiParsedItem = (item, saveToDatabase = true) => {
    const newFoodObj = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: item.name,
      kcal: Math.round(Number(item.kcal100) || 0),
      p: Number(Number(item.p100 || 0).toFixed(1)),
      c: Number(Number(item.c100 || 0).toFixed(1)),
      f: Number(Number(item.f100 || 0).toFixed(1)),
      salt: Number(Number(item.salt100 || 0).toFixed(2)),
      category: item.category || 'Vlastito',
      emoji: item.emoji || '✨',
    };

    if (saveToDatabase) {
      setFoodDb((prev) => [newFoodObj, ...prev]);
    }
    handleAddFoodToMeal(newFoodObj, activeMealSlot, Number(item.grams) || 100);
  };

  const handleAddAllAiParsed = () => {
    aiParsedItems.forEach((item) => handleAddAiParsedItem(item, true));
    setShowAiParserModal(false);
    setAiParsedItems([]);
    setAiQueryText('');
    setAiImageBase64(null);
    setAiImagePreview(null);
  };

  // 2. Gemini AI: Pametni Nutricionist, Analiza Jelovnika i Dopuna Makrosa
  const handleRunAiCoach = async () => {
    setAiCoachOpen(true);
    setAiCoachLoading(true);
    setAiCoachError('');
    setAddedSuggestions({});

    try {
      const remKcal = Math.round(goals.kcal - analytics.totals.kcal);
      const remP = (goals.p - analytics.totals.p).toFixed(1);
      const remC = (goals.c - analytics.totals.c).toFixed(1);
      const remF = (goals.f - analytics.totals.f).toFixed(1);
      const remSalt = (goals.maxSalt - analytics.totals.salt).toFixed(2);

      const currentMealsSummary = MEAL_SLOTS.map((slot) => {
        const items = meals[slot.id] || [];
        const itemNames = items.map((i) => `${i.name} (${i.grams}g, sol: ${i.salt100}g/100g)`).join(', ');
        return `${slot.label}: ${itemNames || 'Prazno'}`;
      }).join('\n');

      const prompt = `Analiziraj moj današnji jelovnik i ciljeve:
CILJEVI: ${goals.kcal} kcal, Proteini: ${goals.p}g, UH: ${goals.c}g, Masti: ${goals.f}g, Max Sol: ${goals.maxSalt}g (strogo pravilo: birati namirnice s <1g soli na 100g).
TRENUTNI UNOS: ${Math.round(analytics.totals.kcal)} kcal, P: ${analytics.totals.p.toFixed(1)}g, UH: ${analytics.totals.c.toFixed(1)}g, M: ${analytics.totals.f.toFixed(1)}g, Sol: ${analytics.totals.salt.toFixed(2)}g (Prosjek gustoće soli: ${analytics.avgDailySaltDensity.toFixed(2)}g/100g).
PREOSTALO ZA UNIJETI: Kalorije: ${remKcal} kcal, P: ${remP}g, UH: ${remC}g, M: ${remF}g, Preostali budžet soli: ${remSalt}g.

TRENUTNI OBROCI:
${currentMealsSummary}

Zadatak:
1. Ocijeni današnji jelovnik (score 1-100) i napiši kratku, konkretnu stručnu analizu (status makrosa i fokus na nisku razinu soli).
2. Navedi 2-3 konkretna savjeta ili zamjene (posebno ako postoji namirnica s >=1g soli/100g ili disbalans makrosa).
3. Osmisli 1 brzi kulinarski recept/ideju koristeći namirnice koje su već u jelovniku ili predložene.
4. Predloži 2 do 3 konkretne namirnice (s točnim gramažama i nutritivnim vrijednostima na 100g, isključivo s <0.5g soli/100g) koje će idealno popuniti preostale makronutrijente do cilja (ili poslužiti kao zdrava niskokalorična zamjena ako sam u suficitu). Za svaku navedi targetMeal ("breakfast", "lunch", "dinner" ili "snack").`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: {
          parts: [
            {
              text: 'Ti si elitni sportski nutricionist specijaliziran za rekompoziciju tijela i Low-Sodium prehranu (<1g soli na 100g hrane). Odgovaraj isključivo na hrvatskom jeziku u zadanom JSON formatu.',
            },
          ],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              score: { type: 'NUMBER' },
              headline: { type: 'STRING' },
              analysis: { type: 'STRING' },
              sodiumAdvice: { type: 'STRING' },
              recipeTitle: { type: 'STRING' },
              recipeInstructions: { type: 'STRING' },
              tips: {
                type: 'ARRAY',
                items: { type: 'STRING' }
              },
              recommendedFoods: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    name: { type: 'STRING' },
                    emoji: { type: 'STRING' },
                    reason: { type: 'STRING' },
                    targetMeal: { type: 'STRING' },
                    grams: { type: 'NUMBER' },
                    kcal100: { type: 'NUMBER' },
                    p100: { type: 'NUMBER' },
                    c100: { type: 'NUMBER' },
                    f100: { type: 'NUMBER' },
                    salt100: { type: 'NUMBER' }
                  },
                  propertyOrdering: ['name', 'emoji', 'reason', 'targetMeal', 'grams', 'kcal100', 'p100', 'c100', 'f100', 'salt100']
                }
              }
            },
            propertyOrdering: ['score', 'headline', 'analysis', 'sodiumAdvice', 'recipeTitle', 'recipeInstructions', 'tips', 'recommendedFoods']
          }
        }
      };

      const rawJson = await callGeminiApi(payload);
      const parsed = JSON.parse(rawJson);
      setAiCoachResult(parsed);
    } catch (err) {
      setAiCoachError('Trenutno nije moguće dohvatiti AI analizu. Pokušaj ponovno za nekoliko sekundi.');
    } finally {
      setAiCoachLoading(false);
    }
  };

  // Pomoćna funkcija za izračun makrosa pojedinog unosa
  const calcEntry = (entry) => {
    const factor = (Number(entry.grams) || 0) / 100;
    return {
      kcal: entry.kcal100 * factor,
      p: entry.p100 * factor,
      c: entry.c100 * factor,
      f: entry.f100 * factor,
      salt: entry.salt100 * factor,
    };
  };

  // Izračun ukupnih dnevnih vrijednosti i statistike po obrocima
  const analytics = useMemo(() => {
    const totals = { kcal: 0, p: 0, c: 0, f: 0, salt: 0, grams: 0, highSaltItemsCount: 0 };
    const byMeal = {};

    MEAL_SLOTS.forEach((slot) => {
      const items = meals[slot.id] || [];
      const sub = { kcal: 0, p: 0, c: 0, f: 0, salt: 0, grams: 0 };

      items.forEach((item) => {
        const res = calcEntry(item);
        sub.kcal += res.kcal;
        sub.p += res.p;
        sub.c += res.c;
        sub.f += res.f;
        sub.salt += res.salt;
        sub.grams += Number(item.grams) || 0;

        if (item.salt100 >= 1.0) {
          totals.highSaltItemsCount += 1;
        }
      });

      sub.avgSaltPer100g = sub.grams > 0 ? (sub.salt / sub.grams) * 100 : 0;
      byMeal[slot.id] = sub;

      totals.kcal += sub.kcal;
      totals.p += sub.p;
      totals.c += sub.c;
      totals.f += sub.f;
      totals.salt += sub.salt;
      totals.grams += sub.grams;
    });

    // Kalorijski udio makronutrijenata (P=4kcal, UH=4kcal, M=9kcal)
    const pKcal = totals.p * 4;
    const cKcal = totals.c * 4;
    const fKcal = totals.f * 9;
    const macroKcalSum = pKcal + cKcal + fKcal || 1;

    const split = {
      pPct: Math.round((pKcal / macroKcalSum) * 100),
      cPct: Math.round((cKcal / macroKcalSum) * 100),
      fPct: Math.max(0, 100 - Math.round((pKcal / macroKcalSum) * 100) - Math.round((cKcal / macroKcalSum) * 100)),
    };

    const avgDailySaltDensity = totals.grams > 0 ? (totals.salt / totals.grams) * 100 : 0;

    return { totals, byMeal, split, avgDailySaltDensity };
  }, [meals]);

  // Filtriranje baze namirnica
  const filteredFoods = useMemo(() => {
    return foodDb.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'Sve' || item.category === selectedCategory;
      const matchesSalt = !onlyLowSalt || item.salt < 1.0;
      return matchesSearch && matchesCat && matchesSalt;
    });
  }, [foodDb, searchQuery, selectedCategory, onlyLowSalt]);

  // Dodavanje namirnice iz baze u aktivni obrok
  const handleAddFoodToMeal = (food, targetMeal = activeMealSlot, grams = quickPortionGrams) => {
    const newEntry = {
      entryId: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      foodId: food.id,
      name: food.name,
      emoji: food.emoji || '🍽️',
      grams: Number(grams) || 100,
      kcal100: Number(food.kcal),
      p100: Number(food.p),
      c100: Number(food.c),
      f100: Number(food.f),
      salt100: Number(food.salt),
    };

    setMeals((prev) => ({
      ...prev,
      [targetMeal]: [...(prev[targetMeal] || []), newEntry],
    }));
  };

  // Ažuriranje gramaže stavke u obroku
  const handleUpdateGrams = (mealId, entryId, newGrams) => {
    const sanitized = Math.max(0, Math.min(2500, Number(newGrams) || 0));
    setMeals((prev) => ({
      ...prev,
      [mealId]: prev[mealId].map((item) =>
        item.entryId === entryId ? { ...item, grams: sanitized } : item
      ),
    }));
  };

  // Brisanje stavke iz obroka
  const handleRemoveEntry = (mealId, entryId) => {
    setMeals((prev) => ({
      ...prev,
      [mealId]: prev[mealId].filter((item) => item.entryId !== entryId),
    }));
  };

  // Dodavanje vlastite namirnice
  const handleAddCustomSubmit = (e) => {
    e.preventDefault();
    if (!customFood.name.trim()) return;

    const foodObj = {
      id: `custom_${Date.now()}`,
      name: customFood.name.trim(),
      kcal: parseFloat(customFood.kcal) || 0,
      p: parseFloat(customFood.p) || 0,
      c: parseFloat(customFood.c) || 0,
      f: parseFloat(customFood.f) || 0,
      salt: parseFloat(customFood.salt) || 0,
      category: 'Vlastito',
      emoji: '⚡',
    };

    if (customFood.saveToDb) {
      setFoodDb((prev) => [foodObj, ...prev]);
    }

    handleAddFoodToMeal(foodObj, activeMealSlot, parseFloat(customFood.grams) || 100);
    setCustomFood({ name: '', kcal: '', p: '', c: '', f: '', salt: '', grams: '100', saveToDb: true });
    setShowCustomModal(false);
  };

  // Primjena TDEE preseta
  const applyPreset = (key) => {
    setActivePresetKey(key);
    setGoals(GOAL_PRESETS[key]);
  };

  // Resetiranje dana ili učitavanje predloška
  const handleResetDay = () => {
    setMeals({ breakfast: [], lunch: [], dinner: [], snack: [] });
  };

  const handleLoadSampleDay = () => {
    setMeals(SAMPLE_PRESET_MEALS);
  };

  // Komponenta značke za sol (<1g / 100g protokol)
  const SaltBadge = ({ saltPer100g, compact = false }) => {
    const isHigh = Number(saltPer100g) >= 1.0;
    if (isHigh) {
      return (
        <span
          title="Oprez: Ova namirnica prelazi granicu od 1g soli na 100g!"
          className={`inline-flex items-center gap-1 font-medium rounded-full border bg-rose-500/15 text-rose-300 border-rose-500/40 ${
            compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>High Salt ⚠️ {Number(saltPer100g).toFixed(2)}g/100g</span>
        </span>
      );
    }
    return (
      <span
        title="Sigurno: Manje od 1g soli na 100g namirnice"
        className={`inline-flex items-center gap-1 font-medium rounded-full border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 ${
          compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Safe {Number(saltPer100g).toFixed(2)}g/100g</span>
      </span>
    );
  };

  const categories = ['Sve', 'Meso i riba', 'Mliječno i jaja', 'Ugljikohidrati', 'Voće i povrće', 'Grickalice i zdrave masti', 'Vlastito'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 pb-16">
      {/* Dekorativna cyber pozadina */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Zaglavlje (Header) */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  MACRO<span className="text-emerald-400">CORE</span> // Kalkulator Obroka
                </h1>
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Sodium Watch &lt;1g/100g
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Precizni nadzor kalorija, makronutrijenata i gustoće soli bez nepotrebne zadržane vode.
              </p>
            </div>
          </div>

          {/* Brze akcije */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAiParserModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 hover:from-violet-500/30 hover:to-fuchsia-500/30 text-violet-200 border border-violet-500/40 shadow-sm shadow-violet-500/10 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-violet-400" />
              <span>AI Unos &amp; Foto Skener ✨</span>
            </button>

            <button
              onClick={handleRunAiCoach}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-cyan-200 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 transition-all"
            >
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Dopuna &amp; Analiza</span>
            </button>

            <button
              onClick={() => setShowGoalEditor(!showGoalEditor)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                showGoalEditor
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ciljevi i TDEE</span>
            </button>

            <button
              onClick={handleLoadSampleDay}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Low-Salt jelovnik</span>
            </button>

            <button
              onClick={handleResetDay}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-rose-500/15 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {}
        {/* Gemini AI Coach & Smart Optimizer Panel */}
        {aiCoachOpen && (
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/30 border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Gemini AI Nutricionist &amp; Optimizator Makrosa
                    </h2>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      gemini-3-flash-preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Pametna analiza tvog dnevnog unosa, kontrola soli (&lt;1g/100g) i prijedlog namirnica za zatvaranje makrosa.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAiCoach}
                  disabled={aiCoachLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${aiCoachLoading ? 'animate-spin' : ''}`} />
                  <span>Osvježi analizu</span>
                </button>
                <button
                  onClick={() => setAiCoachOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {aiCoachLoading && (
              <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    Gemini analizira tvoje obroke, omjer makronutrijenata i gustoću soli...
                  </p>
                  <p className="text-xs text-slate-400">
                    Računam idealne Low-Salt namirnice za dopunu tvog dnevnog plana.
                  </p>
                </div>
              </div>
            )}

            {aiCoachError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between">
                <span>{aiCoachError}</span>
                <button
                  onClick={handleRunAiCoach}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold"
                >
                  Pokušaj ponovno
                </button>
              </div>
            )}

            {!aiCoachLoading && aiCoachResult && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Lijevi dio: Ocjena, analiza i recept */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-cyan-300">{aiCoachResult.headline}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Ocjena plana: {aiCoachResult.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{aiCoachResult.analysis}</p>
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/25 text-xs text-emerald-200">
                      <strong className="text-emerald-400">🧂 Sodium Watch osvrt:</strong> {aiCoachResult.sodiumAdvice}
                    </div>
                  </div>

                  {/* Savjeti i kulinarski prijedlog */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Ključne Preporuke
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {(aiCoachResult.tips || []).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                        AI Ideja za Pripremu
                      </div>
                      <div className="text-xs font-semibold text-white">{aiCoachResult.recipeTitle}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {aiCoachResult.recipeInstructions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desni dio: Konkretne namirnice za 1-klik dopunu makrosa */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Wand2 className="w-3.5 h-3.5" />
                      AI Prijedlog za Dopunu Makrosa (1-Klik Unos)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Namirnice prilagođene tvojim preostalim kalorijama uz strogo &lt;1g soli/100g:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {(aiCoachResult.recommendedFoods || []).map((rec, idx) => {
                      const factor = (Number(rec.grams) || 100) / 100;
                      const mealLabel =
                        MEAL_SLOTS.find((m) => m.id === rec.targetMeal)?.label || 'Međuobrok';
                      const isAdded = addedSuggestions[idx];

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{rec.emoji || '🥗'}</span>
                              <span className="text-xs font-bold text-white">{rec.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                {rec.grams}g → {mealLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{rec.reason}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-300 flex-wrap">
                              <span className="font-semibold text-amber-300">
                                {Math.round(rec.kcal100 * factor)} kcal
                              </span>
                              <span className="text-emerald-400">
                                {(rec.p100 * factor).toFixed(1)}g P
                              </span>
                              <span className="text-cyan-400">
                                {(rec.c100 * factor).toFixed(1)}g UH
                              </span>
                              <span className="text-amber-400">
                                {(rec.f100 * factor).toFixed(1)}g M
                              </span>
                              <span className="text-emerald-300">
                                🧂 {(rec.salt100 * factor).toFixed(2)}g soli
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const validSlot = MEAL_SLOTS.some((s) => s.id === rec.targetMeal)
                                ? rec.targetMeal
                                : activeMealSlot;
                              handleAddFoodToMeal(
                                {
                                  id: `airec_${Date.now()}_${idx}`,
                                  name: rec.name,
                                  emoji: rec.emoji || '🥗',
                                  kcal: rec.kcal100,
                                  p: rec.p100,
                                  c: rec.c100,
                                  f: rec.f100,
                                  salt: rec.salt100,
                                },
                                validSlot,
                                rec.grams
                              );
                              setAddedSuggestions((prev) => ({ ...prev, [idx]: true }));
                            }}
                            disabled={isAdded}
                            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 transition-all ${
                              isAdded
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Dodano</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Dodaj</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Konfigurator ciljeva (Collapsible) */}
        {showGoalEditor && (
          <section className="rounded-2xl bg-slate-900/90 border border-cyan-500/30 p-5 shadow-xl backdrop-blur-md animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Konfigurator Dnevnih Ciljeva &amp; Protokola Soli
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Odaberi brzi TDEE profil ili ručno podesi ciljane makronutrijente za svoj režim.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GOAL_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                      activePresetKey === key
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold">{preset.name}</div>
                    <div className="text-[10px] opacity-80">{preset.kcal} kcal · {preset.p}g P</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Ciljane Kalorije (kcal)</label>
                <input
                  type="number"
                  value={goals.kcal}
                  onChange={(e) => {
                    setActivePresetKey('custom');
                    setGoals({ ...goals, kcal: Math.max(500, Number(e.target.value) || 0) });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-emerald-400 mb-1">Proteini (g)</label>
                <input
                  type="number"
                  value={goals.p}
                  onChange={(e) => {
                    setActivePresetKey('custom');
                    setGoals({ ...goals, p: Math.max(20, Number(e.target.value) || 0) });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-cyan-400 mb-1">Ugljikohidrati (g)</label>
                <input
                  type="number"
                  value={goals.c}
                  onChange={(e) => {
                    setActivePresetKey('custom');
                    setGoals({ ...goals, c: Math.max(0, Number(e.target.value) || 0) });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-amber-400 mb-1">Masti (g)</label>
                <input
                  type="number"
                  value={goals.f}
                  onChange={(e) => {
                    setActivePresetKey('custom');
                    setGoals({ ...goals, f: Math.max(10, Number(e.target.value) || 0) });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[11px] font-medium text-rose-400 mb-1">Max Dnevna Sol (g)</label>
                <input
                  type="number"
                  step="0.5"
                  value={goals.maxSalt}
                  onChange={(e) => {
                    setActivePresetKey('custom');
                    setGoals({ ...goals, maxSalt: Math.max(1, Number(e.target.value) || 0) });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-rose-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* Nadzorna ploča makronutrijenata i soli */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Kalorije */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Kalorije</span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">{Math.round(analytics.totals.kcal)}</span>
                <span className="text-xs text-slate-400">/ {goals.kcal} kcal</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {goals.kcal - analytics.totals.kcal >= 0
                  ? `Preostalo još ${Math.round(goals.kcal - analytics.totals.kcal)} kcal`
                  : `Prekoračeno za ${Math.round(analytics.totals.kcal - goals.kcal)} kcal`}
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analytics.totals.kcal / (goals.kcal || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Proteini */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Proteini</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Beef className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-emerald-300">{analytics.totals.p.toFixed(1)}g</span>
                <span className="text-xs text-slate-400">/ {goals.p}g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {analytics.split.pPct}% ukupnih kalorija
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analytics.totals.p / (goals.p || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Ugljikohidrati */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Ugljikohidrati</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Wheat className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-cyan-300">{analytics.totals.c.toFixed(1)}g</span>
                <span className="text-xs text-slate-400">/ {goals.c}g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {analytics.split.cPct}% ukupnih kalorija
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analytics.totals.c / (goals.c || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Masti */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Masti</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Droplet className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-amber-300">{analytics.totals.f.toFixed(1)}g</span>
                <span className="text-xs text-slate-400">/ {goals.f}g</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {analytics.split.fPct}% ukupnih kalorija
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (analytics.totals.f / (goals.f || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Ukupna Sol & Sodium Watch */}
          <div
            className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
              analytics.totals.salt > goals.maxSalt || analytics.totals.highSaltItemsCount > 0
                ? 'bg-rose-950/25 border-rose-500/40'
                : 'bg-slate-900/80 border-emerald-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Sodium Watch</span>
              <div
                className={`p-2 rounded-xl ${
                  analytics.totals.salt > goals.maxSalt || analytics.totals.highSaltItemsCount > 0
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {analytics.totals.salt > goals.maxSalt || analytics.totals.highSaltItemsCount > 0 ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-2xl font-bold ${
                    analytics.totals.salt > goals.maxSalt ? 'text-rose-400' : 'text-emerald-300'
                  }`}
                >
                  {analytics.totals.salt.toFixed(2)}g
                </span>
                <span className="text-xs text-slate-400">/ {goals.maxSalt.toFixed(1)}g soli</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Prosjek: <span className="text-slate-200 font-medium">{analytics.avgDailySaltDensity.toFixed(2)}g / 100g</span> hrane
              </p>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  analytics.totals.salt > goals.maxSalt
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                }`}
                style={{ width: `${Math.min(100, (analytics.totals.salt / (goals.maxSalt || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Vizualni omjer kalorija i status protokola soli */}
        <section className="rounded-2xl bg-slate-900/70 border border-slate-800/90 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                Kalorijski omjer makronutrijenata (P / UH / M)
              </span>
              <div className="flex items-center gap-3 font-medium">
                <span className="text-emerald-400">P: {analytics.split.pPct}%</span>
                <span className="text-cyan-400">UH: {analytics.split.cPct}%</span>
                <span className="text-amber-400">M: {analytics.split.fPct}%</span>
              </div>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
              <div
                style={{ width: `${analytics.split.pPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Proteini: ${analytics.split.pPct}%`}
              />
              <div
                style={{ width: `${analytics.split.cPct}%` }}
                className="bg-cyan-500 h-full transition-all duration-300"
                title={`Ugljikohidrati: ${analytics.split.cPct}%`}
              />
              <div
                style={{ width: `${analytics.split.fPct}%` }}
                className="bg-amber-500 h-full transition-all duration-300"
                title={`Masti: ${analytics.split.fPct}%`}
              />
            </div>
          </div>

          <div className="lg:w-96 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800/80">
            {analytics.totals.highSaltItemsCount === 0 ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-300">Clean Sodium Status (&lt;1g/100g)</div>
                  <div className="text-slate-400">
                    Sve odabrane namirnice u jelovniku imaju nisku gustoću soli.
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-rose-300">
                    Detektirano {analytics.totals.highSaltItemsCount} namirnica s &ge;1g soli/100g!
                  </div>
                  <div className="text-slate-400">
                    Provjeri stavke označene crvenom značkom (npr. salamura ili suhomesnato).
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Glavni radni prostor: Lijevo baza namirnica, Desno dnevni obroci */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LIJEVI STUPAC: Baza namirnica i brzi unos (5/12) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    Baza Namirnica (na 100g)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Klikni na obrok desno ili odaberi cilj ovdje, pa dodaj namirnicu.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setShowAiParserModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 border border-violet-500/40 transition-all"
                    title="AI procjena teksta ili fotografije obroka"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-violet-400" />
                    <span>AI Unos ✨</span>
                  </button>
                  <button
                    onClick={() => setShowCustomModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-95 transition-all shadow-md shadow-emerald-500/10"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ručni unos</span>
                  </button>
                </div>
              </div>

              {/* Selektor aktivnog obroka i početne gramaže */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    1. Odaberi obrok u koji dodaješ:
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {MEAL_SLOTS.map((slot) => {
                    const Icon = slot.icon;
                    const isSelected = activeMealSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => setActiveMealSlot(slot.id)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{slot.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    2. Početna porcija pri dodavanju:
                  </span>
                  <div className="flex items-center gap-1">
                    {[50, 100, 150, 200, 250].map((g) => (
                      <button
                        key={g}
                        onClick={() => setQuickPortionGrams(g)}
                        className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                          quickPortionGrams === g
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {g}g
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tražilica i filter za sol */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pretraži (npr. pileća prsa, posni sir, kefir, tuna...)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-slate-200 text-slate-950 font-semibold'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setOnlyLowSalt(!onlyLowSalt)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                      onlyLowSalt
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    <span>Samo &lt;1g soli</span>
                  </button>
                </div>
              </div>

              {/* Lista namirnica */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredFoods.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="text-sm text-slate-400">Nema pronađenih namirnica za zadani upit.</p>
                    <button
                      onClick={() => setShowCustomModal(true)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> Dodaj kao vlastitu namirnicu
                    </button>
                  </div>
                ) : (
                  filteredFoods.map((food) => {
                    const isHighSalt = food.salt >= 1.0;
                    return (
                      <div
                        key={food.id}
                        className={`group p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isHighSalt
                            ? 'bg-rose-950/10 border-rose-500/25 hover:border-rose-500/50'
                            : 'bg-slate-950/80 border-slate-800/90 hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base">{food.emoji}</span>
                            <span className="text-sm font-semibold text-slate-100 truncate">
                              {food.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap">
                            <span className="font-semibold text-white">{food.kcal} kcal</span>
                            <span className="text-emerald-400 font-medium">{food.p}g P</span>
                            <span className="text-cyan-400">{food.c}g UH</span>
                            <span className="text-amber-400">{food.f}g M</span>
                          </div>
                          <div className="pt-0.5">
                            <SaltBadge saltPer100g={food.salt} compact />
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddFoodToMeal(food)}
                          className="shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all"
                          title={`Dodaj ${quickPortionGrams}g u ${
                            MEAL_SLOTS.find((s) => s.id === activeMealSlot)?.label
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>{quickPortionGrams}g</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* DESNI STUPAC: Dnevni Raspored Obroka i Tablica (7/12) */}
          <div className="lg:col-span-7 space-y-5">
            {MEAL_SLOTS.map((slot) => {
              const Icon = slot.icon;
              const items = meals[slot.id] || [];
              const sub = analytics.byMeal[slot.id];
              const isCurrentTarget = activeMealSlot === slot.id;

              return (
                <div
                  key={slot.id}
                  onClick={() => setActiveMealSlot(slot.id)}
                  className={`rounded-2xl bg-slate-900/85 border transition-all overflow-hidden cursor-pointer ${
                    isCurrentTarget
                      ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Zaglavlje obroka */}
                  <div className={`p-4 bg-gradient-to-r ${slot.accent} border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-slate-950/80 border ${slot.border} ${slot.text}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{slot.label}</h3>
                          {isCurrentTarget && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Aktivni odabir
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{slot.subtitle}</p>
                      </div>
                    </div>

                    {/* Subtotal obroka */}
                    <div className="flex items-center gap-3 text-xs bg-slate-950/75 px-3.5 py-2 rounded-xl border border-slate-800/90 flex-wrap">
                      <span className="font-bold text-white">{Math.round(sub.kcal)} kcal</span>
                      <span className="text-emerald-400 font-semibold">{sub.p.toFixed(1)}g P</span>
                      <span className="text-cyan-400 font-medium">{sub.c.toFixed(1)}g UH</span>
                      <span className="text-amber-400 font-medium">{sub.f.toFixed(1)}g M</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md ${
                          sub.avgSaltPer100g >= 1.0
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-900 text-slate-300'
                        }`}
                      >
                        🧂 {sub.salt.toFixed(2)}g soli
                      </span>
                    </div>
                  </div>

                  {/* Stavke u obroku */}
                  <div className="p-4 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                    {items.length === 0 ? (
                      <div
                        onClick={() => setActiveMealSlot(slot.id)}
                        className="py-6 text-center rounded-xl border border-dashed border-slate-800 hover:border-slate-700 text-xs text-slate-500 cursor-pointer transition-all"
                      >
                        Nema dodanih namirnica u obroku <span className="text-slate-300 font-medium">{slot.label}</span>. Klikni na namirnicu iz baze lijevo za brzi unos!
                      </div>
                    ) : (
                      items.map((item) => {
                        const c = calcEntry(item);
                        return (
                          <div
                            key={item.entryId}
                            className="p-3 rounded-xl bg-slate-950/85 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{item.emoji}</span>
                                <span className="text-sm font-semibold text-white">{item.name}</span>
                                <SaltBadge saltPer100g={item.salt100} compact />
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                                <span className="font-bold text-amber-200">{Math.round(c.kcal)} kcal</span>
                                <span className="text-emerald-400 font-medium">{c.p.toFixed(1)}g P</span>
                                <span className="text-cyan-400">{c.c.toFixed(1)}g UH</span>
                                <span className="text-amber-400">{c.f.toFixed(1)}g M</span>
                                <span className="text-slate-300">
                                  Sol u porciji: <strong className={item.salt100 >= 1.0 ? 'text-rose-400' : 'text-emerald-300'}>{c.salt.toFixed(2)}g</strong>
                                </span>
                              </div>
                            </div>

                            {/* Kontrola gramaže i brisanje */}
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                                {[50, 100, 150, 200].map((presetG) => (
                                  <button
                                    key={presetG}
                                    onClick={() => handleUpdateGrams(slot.id, item.entryId, presetG)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                                      Number(item.grams) === presetG
                                        ? 'bg-emerald-500 text-slate-950 font-bold'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {presetG}g
                                  </button>
                                ))}
                              </div>

                              <div className="relative w-20">
                                <input
                                  type="number"
                                  min="0"
                                  max="2500"
                                  value={item.grams}
                                  onChange={(e) => handleUpdateGrams(slot.id, item.entryId, e.target.value)}
                                  className="w-full pl-2.5 pr-6 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                                  g
                                </span>
                              </div>

                              <button
                                onClick={() => handleRemoveEntry(slot.id, item.entryId)}
                                className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                title="Ukloni stavku"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}

            {/* Sažeta analitička tablica po obrocima */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Dnevni Sažetak i Gustoća Soli po Obrocima
                </h3>
                <span className="text-xs text-slate-400">
                  Ukupna masa hrane: <strong className="text-slate-200">{analytics.totals.grams}g</strong>
                </span>
              </div>

              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-2">Obrok</th>
                    <th className="py-2.5 px-2 text-right">Količina</th>
                    <th className="py-2.5 px-2 text-right">Kalorije</th>
                    <th className="py-2.5 px-2 text-right text-emerald-400">Proteini</th>
                    <th className="py-2.5 px-2 text-right text-cyan-400">UH</th>
                    <th className="py-2.5 px-2 text-right text-amber-400">Masti</th>
                    <th className="py-2.5 px-2 text-right">Ukupno Soli</th>
                    <th className="py-2.5 px-2 text-right">Prosjek Soli / 100g</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {MEAL_SLOTS.map((slot) => {
                    const s = analytics.byMeal[slot.id];
                    return (
                      <tr key={slot.id} className="hover:bg-slate-950/40">
                        <td className="py-2.5 px-2 font-semibold text-slate-200">{slot.label}</td>
                        <td className="py-2.5 px-2 text-right text-slate-400">{s.grams}g</td>
                        <td className="py-2.5 px-2 text-right font-bold text-white">{Math.round(s.kcal)} kcal</td>
                        <td className="py-2.5 px-2 text-right text-emerald-300 font-medium">{s.p.toFixed(1)}g</td>
                        <td className="py-2.5 px-2 text-right text-cyan-300">{s.c.toFixed(1)}g</td>
                        <td className="py-2.5 px-2 text-right text-amber-300">{s.f.toFixed(1)}g</td>
                        <td className="py-2.5 px-2 text-right font-semibold text-slate-200">{s.salt.toFixed(2)}g</td>
                        <td className="py-2.5 px-2 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              s.avgSaltPer100g >= 1.0
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                            }`}
                          >
                            {s.avgSaltPer100g.toFixed(2)}g / 100g
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-700 font-bold text-white bg-slate-950/60">
                    <td className="py-3 px-2">UKUPNO DANAS</td>
                    <td className="py-3 px-2 text-right text-slate-300">{analytics.totals.grams}g</td>
                    <td className="py-3 px-2 text-right text-orange-300">{Math.round(analytics.totals.kcal)} kcal</td>
                    <td className="py-3 px-2 text-right text-emerald-400">{analytics.totals.p.toFixed(1)}g</td>
                    <td className="py-3 px-2 text-right text-cyan-400">{analytics.totals.c.toFixed(1)}g</td>
                    <td className="py-3 px-2 text-right text-amber-400">{analytics.totals.f.toFixed(1)}g</td>
                    <td className="py-3 px-2 text-right text-slate-100">{analytics.totals.salt.toFixed(2)}g</td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          analytics.avgDailySaltDensity >= 1.0
                            ? 'bg-rose-500/25 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {analytics.avgDailySaltDensity.toFixed(2)}g / 100g
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal za unos vlastite namirnice s trenutnom provjerom <1g/100g pravila */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Dodaj Vlastitu Namirnicu</h3>
                <p className="text-xs text-slate-400">Unesi nutritivne vrijednosti s deklaracije (na 100g)</p>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Zatvori ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Naziv namirnice</label>
                <input
                  type="text"
                  required
                  placeholder="npr. Grčki jogurt 0% / Losos file"
                  value={customFood.name}
                  onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Kalorije (na 100g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="npr. 120"
                    value={customFood.kcal}
                    onChange={(e) => setCustomFood({ ...customFood, kcal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">Proteini g (na 100g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="npr. 20"
                    value={customFood.p}
                    onChange={(e) => setCustomFood({ ...customFood, p: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cyan-400 mb-1">Ugljikohidrati g (na 100g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="npr. 4"
                    value={customFood.c}
                    onChange={(e) => setCustomFood({ ...customFood, c: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1">Masti g (na 100g)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="npr. 2.5"
                    value={customFood.f}
                    onChange={(e) => setCustomFood({ ...customFood, f: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-rose-300 mb-1">Sol u gramima (na 100g)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="npr. 0.15"
                    value={customFood.salt}
                    onChange={(e) => setCustomFood({ ...customFood, salt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Porcija za unos (g)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={customFood.grams}
                    onChange={(e) => setCustomFood({ ...customFood, grams: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Live provjera <1g/100g pravila */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Sodium Watch status:</span>
                <SaltBadge saltPer100g={parseFloat(customFood.salt) || 0} />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customFood.saveToDb}
                  onChange={(e) => setCustomFood({ ...customFood, saveToDb: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Spremi ovu namirnicu u moju bazu za buduće obroke</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-95"
                >
                  Dodaj u {MEAL_SLOTS.find((s) => s.id === activeMealSlot)?.label}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {/* Modal za Gemini AI Brzi Unos ( Prirodni tekst + Foto Skener obroka/deklaracije ) */}
      {showAiParserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-violet-500/40 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AI Brzi Unos Obroka &amp; Foto Skener
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Gemini Vision + JSON
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Opiši obrok svojim riječima ili učitaj sliku tanjura / deklaracije — Gemini računa makrose i sol na 100g.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiParserModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
              >
                Zatvori ✕
              </button>
            </div>

            <form onSubmit={handleRunAiFoodParser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Opiši što si pojeo ili što planiraš pojesti:
                </label>
                <textarea
                  rows={3}
                  value={aiQueryText}
                  onChange={(e) => setAiQueryText(e.target.value)}
                  placeholder="Npr. 220g pečenog lososa na žaru, 180g kuhanog batata i zdjelica rukole s žlicom maslinovog ulja..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Brzi primjeri */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Primjeri:</span>
                {[
                  '200g pečenog lososa i 150g kuhanog batata',
                  'Omlet od 3 jaja s 50g špinata i 100g zrnatog sira',
                  '150g grčkog jogurta, 30g whey proteina i šaka borovnica',
                ].map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAiQueryText(sample)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              {/* Opcija učitavanja slike hrane ili deklaracije */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-violet-400 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-200">
                      Dodaj fotografiju obroka ili nutritivne tablice (opcionalno)
                    </div>
                    <div className="text-slate-400">
                      Gemini prepoznaje namirnice na tanjuru ili čita brojke izravno s deklaracije proizvoda.
                    </div>
                  </div>
                </div>

                <label className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-violet-300 border border-violet-500/30 cursor-pointer transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Odaberi sliku</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {aiImagePreview && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-violet-500/30">
                  <div className="flex items-center gap-3">
                    <img
                      src={aiImagePreview}
                      alt="Pregled učitane slike"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                    />
                    <span className="text-xs text-emerald-300 font-medium">
                      Slika spremna za Gemini multimodalnu analizu
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAiImageBase64(null);
                      setAiImagePreview(null);
                    }}
                    className="text-xs text-rose-400 hover:underline px-2"
                  >
                    Ukloni sliku
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-400">
                  Ciljani obrok:{' '}
                  <strong className="text-emerald-400">
                    {MEAL_SLOTS.find((s) => s.id === activeMealSlot)?.label}
                  </strong>
                </div>
                <button
                  type="submit"
                  disabled={aiParserLoading || (!aiQueryText.trim() && !aiImageBase64)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-violet-500/20"
                >
                  {aiParserLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini analizira makrose...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Analiziraj pomoću AI-ja</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {aiParserError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
                {aiParserError}
              </div>
            )}

            {/* Rezultati AI parsiranja */}
            {aiParsedItems.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-300">
                    Prepoznate namirnice (vrijednosti na 100g + procijenjena porcija):
                  </span>
                  <button
                    type="button"
                    onClick={handleAddAllAiParsed}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all"
                  >
                    + Dodaj sve u {MEAL_SLOTS.find((s) => s.id === activeMealSlot)?.label}
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {aiParsedItems.map((item, index) => {
                    const factor = (Number(item.grams) || 100) / 100;
                    return (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{item.emoji || '🍽️'}</span>
                            <span className="text-sm font-bold text-white">{item.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-semibold">
                              Porcija: {item.grams}g
                            </span>
                            <SaltBadge saltPer100g={item.salt100} compact />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                            <span className="text-white font-semibold">
                              U porciji: {Math.round(item.kcal100 * factor)} kcal
                            </span>
                            <span className="text-emerald-400">
                              {(item.p100 * factor).toFixed(1)}g P
                            </span>
                            <span className="text-cyan-400">
                              {(item.c100 * factor).toFixed(1)}g UH
                            </span>
                            <span className="text-amber-400">
                              {(item.f100 * factor).toFixed(1)}g M
                            </span>
                            <span className="text-slate-300">
                              🧂 {(item.salt100 * factor).toFixed(2)}g soli
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddAiParsedItem(item, true)}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all"
                        >
                          + Dodaj ({item.grams}g)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}