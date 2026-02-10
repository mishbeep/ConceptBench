import { getAllToolIds, getTool } from "@/lib/tools/toolConfig.js";
import { simulateToolOutput } from "@/lib/tools/simulateTool.js";
import { runAgent } from "@/lib/runAgent.js";
import { computeDivergence } from "@/lib/divergence.js";
import { buildToolInsights } from "@/lib/insights.js";

export const maxDuration = 60;

/**
 * POST /api/generate
 * Body: { task: string, constraints?: string }
 * Returns full bench-test result with tools, reviews, divergence, insights.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const task = typeof body.task === "string" ? body.task.trim() : "";
    const constraints =
      typeof body.constraints === "string" ? body.constraints.trim() : "";

    if (!task) {
      return Response.json(
        { error: "Missing or invalid task" },
        { status: 400 }
      );
    }

    const toolIds = getAllToolIds();
    const result = {
      task,
      constraints,
      tools: {},
    };

    for (const toolId of toolIds) {
      const tool = getTool(toolId);
      if (!tool) continue;

      const output = await simulateToolOutput({ toolId, task, constraints });
      const pragmatistReview = await runAgent({
        agent: "pragmatist",
        toolOutput: output,
      });
      const explorerReview = await runAgent({
        agent: "explorer",
        toolOutput: output,
      });
      const divergence = await computeDivergence({
        pragmatistReview,
        explorerReview,
      });
      const insights = await buildToolInsights({
        toolName: tool.name,
        toolOutput: output,
        pragmatistReview,
        explorerReview,
      });

      result.tools[toolId] = {
        output,
        reviews: { pragmatist: pragmatistReview, explorer: explorerReview },
        divergence,
        insights,
      };
    }

    return Response.json(result);
  } catch (err) {
    console.error("[generate]", err);
    const message =
      err?.message || err?.toString?.() || "Generation failed";
    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
