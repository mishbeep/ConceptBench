"use client";

import { getTool } from "@/lib/tools/toolConfig.js";
import Collapsible from "./Collapsible";

const PREVIEW_LEN = 180;

/**
 * Two premium cards side by side (Pragmatist / Explorer) with eyebrow + agent name, collapsible content.
 */

export default function AgentReview({ toolId, reviews }) {
  const tool = getTool(toolId);
  if (!tool || !reviews) return null;

  const pragmatist = reviews.pragmatist || "—";
  const explorer = reviews.explorer || "—";

  return (
    <section className="agent-review">
      <div className="agent-review-grid">
        <div className="agent-card fade-in">
          <div className="cb-card-eyebrow">Agent review</div>
          <div className="agent-label">
            {tool.name} — The Pragmatist
            <span className="agent-tooltip-trigger">
              <span className="agent-tooltip-icon">ⓘ</span>
              <span className="agent-tooltip">
                Evaluates output based on speed to value, clarity, and practical feasibility.
              </span>
            </span>
          </div>
          <AgentReviewCard reviewText={pragmatist} />
        </div>
        <div className="agent-card fade-in">
          <div className="cb-card-eyebrow">Agent review</div>
          <div className="agent-label">
            {tool.name} — The Explorer
            <span className="agent-tooltip-trigger">
              <span className="agent-tooltip-icon">ⓘ</span>
              <span className="agent-tooltip">
                Evaluates output based on novelty, differentiation, and long-term creative potential.
              </span>
            </span>
          </div>
          <AgentReviewCard reviewText={explorer} />
        </div>
      </div>
    </section>
  );
}

function AgentReviewCard({ reviewText }) {
  const preview = reviewText.length > PREVIEW_LEN
    ? reviewText.slice(0, PREVIEW_LEN) + "…"
    : reviewText;
  const isLong = reviewText.length > PREVIEW_LEN;

  return (
    <>
      {isLong ? (
        <Collapsible preview={preview}>
          <div className="agent-content">{reviewText}</div>
        </Collapsible>
      ) : (
        <div className="agent-content">{reviewText}</div>
      )}
    </>
  );
}
