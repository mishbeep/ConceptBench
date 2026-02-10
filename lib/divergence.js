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
 * @returns {Promise<{ summary: string; conflictingAssumptions: string[]; differentPriorities: string[]; tradeoffs: string[] }>}
 */
export async function computeDivergence({
  pragmatistReview,
  explorerReview,
}) {
  const system = `You compare two design reviews of the same idea: one from a Pragmatist (practical, speed, risk reduction) and one from an Explorer (originality, differentiation, long-term potential). Extract structured divergence.`;
  const user = `Pragmatist review:\n${pragmatistReview}\n\nExplorer review:\n${explorerReview}\n\nRespond in this exact JSON format only, no other text:\n{\n  "summary": "1-2 sentence summary of how the two perspectives differ",\n  "conflictingAssumptions": ["item1", "item2"],\n  "differentPriorities": ["item1", "item2"],\n  "tradeoffs": ["item1", "item2"]\n}`;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.3,
    max_tokens: 512,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
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
      tradeoffs: Array.isArray(parsed.tradeoffs) ? parsed.tradeoffs : [],
    };
  } catch {
    return {
      summary: raw.slice(0, 200),
      conflictingAssumptions: [],
      differentPriorities: [],
      tradeoffs: [],
    };
  }
}
