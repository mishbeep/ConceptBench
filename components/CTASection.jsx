"use client";

import Link from "next/link";
import { getTool, getAllToolIds } from "@/lib/tools/toolConfig.js";

/**
 * CTA block: Primary "Open in {Tool}" x2, Secondary "Try another task", Tertiary "Save this bench test".
 */

export default function CTASection() {
  const toolIds = getAllToolIds();

  return (
    <section className="cta-block">
      <div className="cta-primary-row">
        {toolIds.map((id) => {
          const tool = getTool(id);
          if (!tool) return null;
          return (
            <a
              key={id}
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Open in {tool.name} →
            </a>
          );
        })}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 14 }}>
        <Link href="/initialize" className="cta-secondary">
          Try another task
        </Link>
      </div>
      <div style={{ textAlign: "center", marginTop: 6 }}>
        <button
          type="button"
          className="cta-tertiary"
          onClick={() => {}}
          title="Stub — not implemented"
        >
          Save this bench test
        </button>
      </div>
    </section>
  );
}
