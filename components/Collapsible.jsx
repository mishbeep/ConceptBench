"use client";

import { useState } from "react";

export default function Collapsible({ preview, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="collapsible-block">
      {!open && (
        <>
          <div className="collapsible-preview">
            {preview}
          </div>

          <button
            className="collapsible-toggle"
            onClick={() => setOpen(true)}
            type="button"
          >
            Show more →
          </button>
        </>
      )}

      {open && (
        <>
          <div className="collapsible-full">{children}</div>
          <button
            className="collapsible-toggle"
            onClick={() => setOpen(false)}
            type="button"
          >
            Show less ←
          </button>
        </>
      )}
    </div>
  );
}
