/**
 * Tool style definitions for simulated outputs.
 * Edit these to change tool names, style prompts, and redirect URLs.
 */

export const tools = {
  lovable: {
    id: "lovable",
    name: "Lovable",
    stylePrompt: `
Generate a UI concept in the style of Lovable.
Characteristics: optimistic tone, component-based layout, fast prototyping, clean structure.
Produce a structured concept or flow description.
    `.trim(),
    website: "https://lovable.dev",
  },
  stitch: {
    id: "stitch",
    name: "Google Stitch",
    stylePrompt: `
Generate a UX flow in the style of Google Stitch.
Characteristics: logical sequence, step-by-step onboarding, role-based segmentation, clear transitions.
Produce a structured flow description.
    `.trim(),
    website: "https://stitch.withgoogle.com",
  },
};

export function getTool(id) {
  return tools[id] ?? null;
}

export function getAllToolIds() {
  return Object.keys(tools);
}
