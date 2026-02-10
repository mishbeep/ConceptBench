import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export async function buildToolInsights({ toolName, toolOutput, pragmatistReview, explorerReview }) {
  const system = `You synthesize a short product insight...`;

  const user = `Tool: ${toolName}
Tool output:
${toolOutput}

Pragmatist review:
${pragmatistReview}

Explorer review:
${explorerReview}

Respond ONLY in this JSON:

{
  "strengths": "string",
  "risks": "string",
  "bestUseCases": "string"
}`;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.3,
    max_tokens: 512
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";

  try {
    return JSON.parse(raw);
  } catch {
    return {
      strengths: "",
      risks: "",
      bestUseCases: ""
    };
  }
}
