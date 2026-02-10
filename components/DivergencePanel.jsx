"use client";

import Collapsible from "./Collapsible";

/**
 * One divergence subsection: title + collapsible list. Use inline inside unified card.
 */

export default function DivergencePanel({ title, items, inline }) {
  if (!items || items.length === 0) return null;

  const preview = items.slice(0, 2).join("\n") + (items.length > 2 ? "…" : "");

  const content = (
    <>
      <h3 className="divergence-title">{title}</h3>
      <Collapsible preview={preview}>
        <ul className="divergence-list">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Collapsible>
    </>
  );

  if (inline) {
    return <div className="divergence-inline">{content}</div>;
  }
  return (
    <div className="divergence-block fade-in">
      {content}
    </div>
  );
}
