export const runtime = "nodejs";   // forces Node runtime
export const maxDuration = 60;    // serverless gives 120 sec

import { getAllToolIds, getTool } from "@/lib/tools/toolConfig.js";
import { simulateToolOutput } from "@/lib/tools/simulateTool.js";
import { runAgent } from "@/lib/runAgent.js";
import { computeDivergence } from "@/lib/divergence.js";
import { buildToolInsights } from "@/lib/insights.js";



export async function POST(request) {
  try {
    const body = await request.json();
    const task = typeof body.task === "string" ? body.task.trim() : "";
    const constraints = typeof body.constraints === "string" ? body.constraints.trim() : "";

    if (!task) {
      return Response.json({ error: "Missing or invalid task" }, { status: 400 });
    }

    const toolIds = getAllToolIds();
    const result = { task, constraints, tools: {} };

    for (const toolId of toolIds) {
      const tool = getTool(toolId);
      if (!tool) continue;
    
      // Kick off the tool output generation
      const outputPromise = simulateToolOutput({ toolId, task, constraints });
    
      // Wait for the tool output
      const output = await outputPromise;
    
      // Run agent reviews in parallel
      const pragPromise = runAgent({
        agent: "pragmatist",
        toolOutput: output,
      });
    
      const explPromise = runAgent({
        agent: "explorer",
        toolOutput: output,
      });
    
      const [pragmatistReview, explorerReview] = await Promise.all([
        pragPromise,
        explPromise,
      ]);
    
      // Run divergence + insights in parallel
      const divergencePromise = computeDivergence({
        pragmatistReview,
        explorerReview,
      });
    
      const insightsPromise = buildToolInsights({
        toolName: tool.name,
        toolOutput: output,
        pragmatistReview,
        explorerReview,
      });
    
      const [divergence, insights] = await Promise.all([
        divergencePromise,
        insightsPromise,
      ]);
    
      // Attach to result
      result.tools[toolId] = {
        output,
        reviews: { pragmatist: pragmatistReview, explorer: explorerReview },
        divergence,
        insights,
      };
    }
    

    return Response.json(result);
  } catch (err) {
    console.error("[generate-error]", err);
    return Response.json(
      { error: err?.message || "Generation failed" },
      { status: 500 }
    );
  }
}
