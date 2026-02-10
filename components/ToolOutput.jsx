"use client";

import { getTool } from "@/lib/tools/toolConfig.js";
import Collapsible from "./Collapsible";

/**
 * Tool output in premium card with eyebrow "Tool Output", collapsible long text.
 */

const PREVIEW_LEN = 220;
const LINE_HEIGHT = 1.6;

export default function ToolOutput({ toolId, output }) {
  const tool = getTool(toolId);
  const text = output || "—";
  const isLong = text.length > PREVIEW_LEN;
  const preview = isLong ? text.slice(0, PREVIEW_LEN) + "…" : text;

  if (!tool) return null;

  return (
    <div className="cb-card">
      <div className="cb-card-eyebrow">Tool output</div>
      {tool.website ? (
        <p style={{ marginBottom: 12, fontSize: 14 }}>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--cb-text-title)", fontWeight: 500 }}
          >
            Open in {tool.name} →
          </a>
        </p>
      ) : null}
      {isLong ? (
        <Collapsible preview={preview}>
          <pre className="tool-output-full">{text}</pre>
        </Collapsible>
      ) : (
        <pre className="tool-output-full">{text}</pre>
      )}
    </div>
  );
}
