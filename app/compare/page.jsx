"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CaseContext from "@/components/CaseContext";
import ToolOutput from "@/components/ToolOutput";
import AgentReview from "@/components/AgentReview";
import DivergencePanel from "@/components/DivergencePanel";
import InsightMatrix from "@/components/InsightMatrix";
import CTASection from "@/components/CTASection";
import SectionHeader from "@/components/SectionHeader";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getAllToolIds, getTool } from "@/lib/tools/toolConfig.js";

const RESULT_KEY = "conceptbench_result";

export default function ComparePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) {
      setMissing(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setData(parsed);
    } catch {
      setMissing(true);
    }
  }, []);

  useEffect(() => {
    if (missing) {
      router.replace("/initialize");
    }
  }, [missing, router]);

  if (missing) {
    return (
      <div className="col-compare cb-layout font-body" style={pageStyle}>
        <p style={mutedStyle}>Redirecting…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="col-compare cb-layout font-body" style={pageStyle}>
        <LoadingSkeleton />
      </div>
    );
  }

  const { task, constraints, tools } = data;
  const toolIds = getAllToolIds();

  return (
    <div className="col-compare cb-layout font-body" style={pageStyle}>
      <section className="compare-section">
        <SectionHeader>Case context</SectionHeader>
        <CaseContext task={task} constraints={constraints} />
      </section>

      <div className="editorial-divider" />
      {toolIds.map((toolId) => (
        <section key={`${toolId}-output`} className="compare-section">
          <SectionHeader>{getTool(toolId)?.name ?? toolId} — Output</SectionHeader>
          <ToolOutput toolId={toolId} output={tools?.[toolId]?.output} />
        </section>
      ))}

      <div className="editorial-divider" />
      {toolIds.map((toolId) => (
        <section key={`${toolId}-reviews`} className="compare-section">
          <SectionHeader>{getTool(toolId)?.name ?? toolId} — Agent reviews</SectionHeader>
          <AgentReview
            toolId={toolId}
            reviews={tools?.[toolId]?.reviews}
          />
        </section>
      ))}

      <div className="editorial-divider" />
      <section className="compare-section">
        <SectionHeader>Divergence</SectionHeader>
        <div className="divergence-summary-card fade-in">
          <div className="cb-card-eyebrow" style={{ marginBottom: 16 }}>Divergence summary</div>
          {toolIds.map((toolId) => {
            const d = tools?.[toolId]?.divergence || {};
            const summary = d.summary ?? "";
            const conflicting = d.conflictingAssumptions ?? [];
            const priorities = d.differentPriorities ?? [];
            const tradeoffs = d.tradeoffs ?? [];
            const toolName = getTool(toolId)?.name ?? toolId;
            const hasAny = summary || conflicting.length > 0 || priorities.length > 0 || tradeoffs.length > 0;
            return (
              <div key={toolId} style={{ marginBottom: hasAny ? 28 : 0 }}>
                {hasAny ? (
                  <>
                    <h3 className="cb-card-title" style={{ marginBottom: 16 }}>{toolName}</h3>
                    {summary ? (
                      <DivergencePanel inline title="Summary" items={[summary]} />
                    ) : null}
                    {conflicting.length > 0 ? (
                      <DivergencePanel inline title="Conflicting assumptions" items={conflicting} />
                    ) : null}
                    {priorities.length > 0 ? (
                      <DivergencePanel inline title="Different priorities" items={priorities} />
                    ) : null}
                    {tradeoffs.length > 0 ? (
                      <DivergencePanel inline title="Tradeoffs" items={tradeoffs} />
                    ) : null}
                  </>
                ) : (
                  <p style={{ margin: 0, fontSize: 14, color: "var(--cb-text-meta)" }}>No divergence data.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="editorial-divider" />
      <section className="compare-section">
        <SectionHeader>Insight summary</SectionHeader>
        <InsightMatrix tools={tools} />
      </section>

      <div className="editorial-divider" />
      <CTASection />
    </div>
  );
}

const pageStyle = {
  paddingTop: 48,
  paddingBottom: 24,
  minHeight: "100vh",
  background: "#FFFFFF",
};
const mutedStyle = {
  fontSize: 14,
  color: "var(--cb-text-meta)",
  fontFamily: "var(--font-stack)",
};
