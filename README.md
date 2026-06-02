# ETC Presentation Web App

Interactive presentation app for the Enabling Technology Collaboratory (ETC) at Temasek Polytechnic. The app combines a polished React presentation flow, a 3D avatar assistant, voice input, text-to-speech narration, and detailed project showcases for visitor demos.

## Highlights

- Light, glass-style presentation UI with routed sections for ETC introduction, partners, projects, featured demo, and collaboration opportunities.
- Floating 3D avatar assistant that answers ETC-specific questions, supports typed and voice input, and can navigate visitors to relevant pages.
- Project portfolio with search, domain filters, expandable case studies, and avatar narration buttons.
- Featured Smart Wheelchair demo page with video fallback, technology highlights, and assistant explanation.
- Express API handlers for GPT, speech-to-text, and text-to-speech with validation and clearer error responses.
- Route-level lazy loading to reduce initial JavaScript cost.

## Recent Improvements (Pre-Demo Pass)

The latest pass focused on polish, performance, accessibility, and code quality:

- **Performance — hero image:** Recompressed the building photo from **2.8 MB → ~0.45 MB** (4032px → 1600px), removing the single heaviest asset on the Home page with no visible quality loss.
- **Code quality — DRY refactor:** Extracted the duplicated "Listen to Avatar Explain" markup (repeated **8 times** across the project pages) into a single reusable `AvatarExplainButton` component, plus a shared `useAvatarStatus` hook. This removed ~200 lines of copy-pasted JSX and shrank the project bundle.
- **New feature — reading progress + back-to-top:** A `ScrollProgress` component adds a gradient progress bar and a floating back-to-top button, and resets scroll position on every route change so each section opens at the top.
- **New feature — search shortcut:** Press **`/`** anywhere on the portfolio page to jump straight to the project search box (with an inline hint).
- **Accessibility:** Project cards are now real keyboard controls (focusable, Enter/Space to expand, `aria-expanded`, visible focus ring); the avatar buttons announce state via `aria-live`.
- **Robustness — 404 route:** Unknown URLs now render a styled `NotFound` page instead of a blank screen.

## Tech Stack

- React 19 + Vite
- React Router v7
- Three.js via the local `avatar-model` vendor package
- Framer Motion
- Express API server
- OpenAI API for GPT, STT, and TTS

## Project Structure

```text
src/
  App.jsx                         # Routes, persistent background, clock, scroll + assistant
  components/
    AvatarExplainButton.jsx       # Reusable "Listen to Avatar Explain" control
    ScrollProgress.jsx            # Reading-progress bar + back-to-top + per-route scroll reset
    ...                           # Avatar, assistant, counters, clock, nav controls
  hooks/
    useAvatarStatus.js            # Shared subscription to avatar thinking/speaking state
    ...                           # GPT/STT client hook and sound effects
  pages/
    NotFound.jsx                  # 404 catch-all page
    ...                           # Presentation sections
  styles/                         # Global, page, and component CSS
api/
  gpt.js                          # ETC assistant endpoint
  stt.js                          # Voice transcription endpoint
  tts.js                          # Avatar speech endpoint
public/
  audio/, model/, logos/, images  # Demo media, partner logos, avatar models
server.js                         # Express server for APIs and production build
```

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key
```

For local development, run the API server and Vite in two terminals:

```bash
npm start
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` to the Express server at `http://localhost:20356` by default. Override with `VITE_API_PROXY_TARGET` if needed.

## Production Build

```bash
npm run build
npm start
```

The Express server serves `dist/` and the API endpoints on `PORT` or `20356`.

## Quality Checks

```bash
npm run lint
npm run build
```

Both should pass before a supervisor demo. The build may still warn about large chunks because the 3D/avatar stack is inherently heavy; route-level lazy loading is already enabled.

## Demo Talking Points

- The assistant is scoped to ETC only and can answer about mission, projects, partners, contact details, and office hours.
- Quick prompts help visitors ask common questions without typing.
- Project cards can be searched and filtered, then expanded into rich case studies.
- Avatar narration buttons let the presenter hand off explanations to the 3D assistant.
- The Smart Wheelchair page has graceful video fallback so the page remains demo-safe even if media fails to load.
