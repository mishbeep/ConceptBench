/**
 * Simulates a tool output using OpenAI in the configured tool style.
 * Does not call real Lovable/Stitch APIs — prompt engineering only.
 */

import OpenAI from "openai";
import { getTool } from "./toolConfig.js";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

/**
 * @param {{ toolId: string; task: string; constraints?: string }} params
 * @returns {Promise<string>} Formatted string suitable for agent evaluation
 */
export async function simulateToolOutput({ toolId, task, constraints }) {
  const tool = getTool(toolId);
  if (!tool) {
    throw new Error(`Unknown tool: ${toolId}`);
  }

  const userPrompt = [
    "User task:",
    task,
    constraints ? `Constraints: ${constraints}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const systemContent = tool.stylePrompt;
  const userContent = userPrompt;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";
  return raw;
}
