/**
 * Computes divergence between Pragmatist and Explorer reviews for a single tool.
 */
import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

/**
 * @param {{ pragmatistReview: string; explorerReview: string }} params
 */
export async function computeDivergence({
  pragmatistReview,
  explorerReview,
}) {
  const system = `
You compare two design reviews of the same idea:
• Pragmatist → practical, faster delivery, risk reduction
• Explorer → originality, novelty, long-term differentiation
Return JSON ONLY. NEVER add explanations.
  `.trim();

  const user = `
Pragmatist review:
${pragmatistReview}

Explorer review:
${explorerReview}

RETURN JSON ONLY:
{
  "summary": "string",
  "conflictingAssumptions": ["string"],
  "differentPriorities": ["string"],
  "tradeoffs": ["string"]
}
  `.trim();

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
    max_tokens: 512,
  });

  let raw = completion.choices[0]?.message?.content?.trim() ?? "{}";

  // 🛑 HARD SANITIZATION FIX — Removes stray text before/after JSON
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    raw = raw.slice(start, end + 1);
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary ?? "",
      conflictingAssumptions: Array.isArray(parsed.conflictingAssumptions)
        ? parsed.conflictingAssumptions
        : [],
      differentPriorities: Array.isArray(parsed.differentPriorities)
        ? parsed.differentPriorities
        : [],
      tradeoffs: Array.isArray(parsed.tradeoffs)
        ? parsed.tradeoffs
        : [],
    };
  } catch (err) {
    console.error("DIVERGENCE JSON PARSE ERROR:", raw);
    return {
      summary: "Divergence unavailable",
      conflictingAssumptions: [],
      differentPriorities: [],
      tradeoffs: [],
    };
  }
}
