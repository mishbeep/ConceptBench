/**
 * Lovable-style simulator.
 * Delegates to simulateToolOutput with toolId "lovable".
 * Edit toolConfig.js to change the Lovable style prompt.
 */

import { simulateToolOutput } from "./simulateTool.js";

const LOVABLE_ID = "lovable";

/**
 * @param {{ task: string; constraints?: string }} params
 * @returns {Promise<string>}
 */
export async function simulateLovable({ task, constraints }) {
  return simulateToolOutput({
    toolId: LOVABLE_ID,
    task,
    constraints,
  });
}
