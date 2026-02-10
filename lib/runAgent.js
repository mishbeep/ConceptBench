/**
 * Runs an evaluation agent (Pragmatist or Explorer) on tool output.
 */

import OpenAI from "openai";
import {
  pragmatistSystem,
  pragmatistTask,
  explorerSystem,
  explorerTask,
} from "./agents.js";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

/**
 * @param {{ agent: 'pragmatist' | 'explorer'; toolOutput: string }} params
 * @returns {Promise<string>}
 */
export async function runAgent({ agent, toolOutput }) {
  const system =
    agent === "pragmatist" ? pragmatistSystem : explorerSystem;
  const task = agent === "pragmatist" ? pragmatistTask : explorerTask;
  const userContent = `Ideation output to review:\n\n${toolOutput}`;

  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${task}\n\n${userContent}` },
    ],
    temperature: 0.5,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}
