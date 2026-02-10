"use client";

import { getTool, getAllToolIds } from "@/lib/tools/toolConfig.js";

/**
 * Insight Summary Matrix A: rows = Strengths, Risks, Best Use Cases; columns = Lovable, Stitch.
 */

export default function InsightMatrix({ tools }) {
  const toolIds = getAllToolIds();
  const rows = [
    { id: "strengths", label: "Strengths" },
    { id: "risks", label: "Risks" },
    { id: "bestUseCases", label: "Best Use Cases" },
  ];

  return (
    <section className="insight-matrix">
      <div className="cb-card">
        <div className="cb-card-eyebrow" style={{ marginBottom: 12 }}>Insight summary</div>
        <table className="matrix-table fade-in">
        <thead>
          <tr>
            <th></th>
            {toolIds.map((id) => {
              const tool = getTool(id);
              return (
                <th key={id}>
                  {tool?.name ?? id}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="matrix-row">
              <td style={{ fontWeight: 600, color: "var(--cb-text-title)" }}>{row.label}</td>
              {toolIds.map((id) => {
                const toolData = tools?.[id];
                const insights = toolData?.insights ?? {};
                const value = insights[row.id] ?? "—";
                return (
                  <td key={id} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
