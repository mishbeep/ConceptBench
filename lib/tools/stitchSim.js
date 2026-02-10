/**
 * Google Stitch-style simulator.
 * Delegates to simulateToolOutput with toolId "stitch".
 * Edit toolConfig.js to change the Stitch style prompt.
 */

import { simulateToolOutput } from "./simulateTool.js";

const STITCH_ID = "stitch";

/**
 * @param {{ task: string; constraints?: string }} params
 * @returns {Promise<string>}
 */
export async function simulateStitch({ task, constraints }) {
  return simulateToolOutput({
    toolId: STITCH_ID,
    task,
    constraints,
  });
}
