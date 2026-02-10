"use client";

/**
 * Case context in a small bordered info card (premium hybrid).
 */

export default function CaseContext({ task, constraints }) {
  return (
    <div className="cb-card">
      <div className="cb-card-eyebrow">Bench test</div>
      <p className="cb-card-body" style={{ margin: "0 0 8px 0" }}>{task || "—"}</p>
      {constraints ? (
        <p className="cb-card-body" style={{ margin: 0, fontSize: 14, color: "var(--cb-text-meta)" }}>
          <strong style={{ color: "var(--cb-text-title)" }}>Constraints:</strong> {constraints}
        </p>
      ) : null}
    </div>
  );
}
