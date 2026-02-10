# ConceptBench

Bench-test AI product-design tools by comparing two simulated “tool style” outputs and evaluating them with two AI evaluation agents (Pragmatist and Explorer).

## Install

```bash
npm install
```

## Run locally

1. Copy environment variables and add your OpenAI API key:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and set:

   ```
   OPENAI_API_KEY=sk-...
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to `/initialize` to start a bench test.

## Deploy on Vercel

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), create a new project and import this repo.
3. In Project Settings → Environment Variables, add:
   - `OPENAI_API_KEY` = your OpenAI API key (required for generation and evaluations).
4. Deploy. The App Router and serverless API route (`/api/generate`) are compatible with Vercel.

## Add more simulated tools

1. **Register the tool** in `lib/tools/toolConfig.js`:
   - Add a new entry to the `tools` object with `id`, `name`, `stylePrompt`, and `website`.
2. **Optional:** Add a dedicated simulator in `lib/tools/` (e.g. `myToolSim.js`) that calls `simulateToolOutput({ toolId: "myTool", task, constraints })`.
3. The `/api/generate` route uses `getAllToolIds()` from `toolConfig.js`, so any new tool there is automatically included in the bench test.
4. UI (e.g. `InsightMatrix`, `CTASection`, initialize page) uses `getTool(id)` and `getAllToolIds()`, so new tools appear without further code changes.

## Extend toolConfig.js

- **Tool names and URLs:** Change `name` and `website` for display and “Open in …” links.
- **Tool styles:** Edit each tool’s `stylePrompt`. This is the system prompt used when simulating that tool’s output with OpenAI; adjust tone, structure, and focus as needed.

## Project layout

- **`app/`** — App Router: `initialize`, `compare`, `api/generate`, root redirect.
- **`components/`** — CaseContext, ToolOutput, AgentReview, DivergencePanel, InsightMatrix, CTASection.
- **`lib/`** — `agents.js` (Pragmatist/Explorer prompts), `runAgent.js`, `divergence.js`, `insights.js`, `tools/` (toolConfig, simulateTool, lovableSim, stitchSim).
- **`styles/theme.css`** — Theme variables and utilities (spacing, typography, light UI). Editable for theme and spacing.

Everything is modular: you can change tool styles, agent prompts, theme, spacing, wording, and redirects in the files above.
