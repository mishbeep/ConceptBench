import OpenAI from "openai";
import { getTool } from "./toolConfig.js";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export async function simulateToolOutput({ toolId, task, constraints }) {
  const tool = getTool(toolId);
  if (!tool) throw new Error(`Unknown tool: ${toolId}`);

  const userPrompt = [
    "User task:",
    task,
    constraints ? `Constraints: ${constraints}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemContent = tool.stylePrompt;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 1024
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}
