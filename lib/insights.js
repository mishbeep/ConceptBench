/**
 * Builds the Insight Matrix (Strengths, Risks, Best Use Cases) per tool.
 */

import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

/**
 * @param {{ toolName: string; toolOutput: string; pragmatistReview: string; explorerReview: string }} params
 * @returns {Promise<{ strengths: string; risks: string; bestUseCases: string }>}
 */
export async function buildToolInsights({
  toolName,
  toolOutput,
  pragmatistReview,
  explorerReview,
}) {
  const system = `You synthesize a short product insight for one design tool output. Be concise (1-3 bullets or 1-2 sentences per field).`;
  const user = `Tool: ${toolName}\n\nTool output:\n${toolOutput}\n\nPragmatist review:\n${pragmatistReview}\n\nExplorer review:\n${explorerReview}\n\nRespond in this exact JSON format only:\n{\n  "strengths": "string",\n  "risks": "string",\n  "bestUseCases": "string"\n}`;

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
      strengths: typeof parsed.strengths === "string" ? parsed.strengths : "",
      risks: typeof parsed.risks === "string" ? parsed.risks : "",
      bestUseCases:
        typeof parsed.bestUseCases === "string" ? parsed.bestUseCases : "",
    };
  } catch {
    return {
      strengths: "",
      risks: "",
      bestUseCases: "",
    };
  }
}
