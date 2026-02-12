"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAllToolIds, getTool } from "@/lib/tools/toolConfig.js";

const RESULT_KEY = "conceptbench_result";
function PipelineRow({ active, label, sublabel }) {
  return (
    <div className="cb-row">
      <div className={`cb-pipeline-dot ${active ? "active" : ""}`} />
      <div>
        <div className="cb-row-label">{label}</div>
        <div className="cb-row-sub">{sublabel}</div>
      </div>
    </div>
  );
}


export default function InitializePage() {
  const router = useRouter();
  const [task, setTask] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);

  const [error, setError] = useState("");

  const toolIds = getAllToolIds();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!task.trim()) {
      setError("Please enter a task to bench-test.");
      return;
    }
    setLoading(true);
setStage(1);

setTimeout(() => setStage(2), 1200);
setTimeout(() => setStage(3), 2400);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: task.trim(),
          constraints: constraints.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem(RESULT_KEY, JSON.stringify(data));
      }
      router.push("/compare");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="col-centered cb-layout font-body" style={pageStyle}>
      {loading && (
  <div className="cb-loading-overlay">
    <div className="cb-pipeline">
      <h2 className="cb-pipeline-title">
        Running bench test…
      </h2>

      <PipelineRow
        active={stage >= 1}
        label="Simulating tools"
        sublabel="Lovable + Google Stitch"
      />

      <PipelineRow
        active={stage >= 2}
        label="Running evaluation lenses"
        sublabel="Viability + Differentiation"
      />

      <PipelineRow
        active={stage >= 3}
        label="Computing lens tension & insights"
        sublabel="Comparing perspectives"
      />
    </div>
  </div>
)}



      <h1 style={titleStyle}>ConceptBench</h1>
      <p style={subtitleStyle}>
        Bench-test AI product-design tools by comparing simulated outputs and
        evaluation agents.
      </p>

      <form onSubmit={handleSubmit} style={formStyle}>
        <label className="label" htmlFor="task">
          What do you want to bench-test?
        </label>
        <textarea
          id="task"
          className="input"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. A sign-up flow for a B2B SaaS product"
          rows={3}
          style={textareaStyle}
          disabled={loading}
        />

        <label className="label" htmlFor="constraints" style={labelOptionalStyle}>
          Constraints (optional)
        </label>
        <input
          id="constraints"
          type="text"
          className="input"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="e.g. Mobile-first, under 5 steps"
          style={inputStyle}
          disabled={loading}
        />

        <p style={toolsLabelStyle}>Simulated tools</p>
        <ul style={toolsListStyle}>
          {toolIds.map((id) => {
            const tool = getTool(id);
            return (
              <li key={id} style={toolItemStyle}>
                {tool?.name ?? id}
              </li>
            );
          })}
        </ul>

        {error ? <p style={errorStyle}>{error}</p> : null}

        <button
          type="submit"
          className={loading ? "btn btn-primary btn-shimmer" : "btn btn-primary"}
          disabled={loading}
          style={submitStyle}
        >
          {loading ? "Running bench test…" : "Bench-test the tools →"}
        </button>
      </form>
    </div>
  );
}

const pageStyle = {
  padding: "var(--space-xl) var(--space-md)",
  minHeight: "100vh",
};
const titleStyle = {
  fontSize: "18px",
  fontWeight: 600,
  margin: "0 0 var(--space-sm) 0",
  fontFamily: "var(--font-stack)",
  color: "var(--text-primary)",
};
const subtitleStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "var(--text-secondary)",
  margin: "0 0 var(--space-xl) 0",
  lineHeight: 1.5,
  fontFamily: "var(--font-stack)",
};
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-lg)",
};
const textareaStyle = {
  resize: "vertical",
  minHeight: 80,
};
const inputStyle = {};
const labelOptionalStyle = {
  marginTop: "var(--space-xs)",
};
const toolsLabelStyle = {
  fontSize: "14px",
  fontWeight: 500,
  color: "var(--text-secondary)",
  margin: "var(--space-md) 0 0 0",
  fontFamily: "var(--font-stack)",
};
const toolsListStyle = {
  margin: "var(--space-xs) 0 0 0",
  paddingLeft: "var(--space-lg)",
  fontSize: "14px",
  color: "var(--text-secondary)",
  fontFamily: "var(--font-stack)",
};
const toolItemStyle = {
  marginBottom: "var(--space-xs)",
};
const errorStyle = {
  fontSize: "14px",
  color: "#c00",
  margin: 0,
  fontFamily: "var(--font-stack)",
};
const submitStyle = {
  marginTop: "var(--space-lg)",
};
