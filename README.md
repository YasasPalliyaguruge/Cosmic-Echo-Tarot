# Cosmic Echo Tarot

![Cosmic Echo Tarot project cover](assets/recruiter/cover.png)

Cosmic Echo Tarot is a browser-based reflective tarot experience built with React, TypeScript and Gemini. Users choose a spread, draw cards, receive an AI-assisted interpretation, discuss the result with the Aura chat guide, generate spoken audio, and save personal notes in a local journal.

The application presents tarot as a tool for reflection rather than certainty. Its prompts explicitly avoid fatalistic predictions and medical, legal or financial advice.

## Implemented experience

- Multiple tarot spreads with position-specific card interpretation
- Upright and reversed card meanings
- Gemini-generated Markdown readings
- Follow-up conversation with the Aura chat guide
- Optional Gemini text-to-speech playback
- Optional AI-generated card imagery after cards are revealed
- Theme and card-back selection
- Browser-local journal with saved cards, reading and personal notes
- Journal detail view for revisiting previous sessions
- Client-side handling for missing API configuration and failed model responses
- Safer rendering for model-generated Markdown

## Technology

- React 19 and TypeScript
- Vite
- Google Gen AI SDK
- Browser `localStorage` for journal and display preferences
- Globally loaded `marked` renderer for Markdown presentation

## Local setup

Install the exact dependency tree recorded in `package-lock.json`:

```bash
npm ci
```

Copy the environment template:

```bash
cp .env.example .env.local
```

Add a restricted development key:

```env
GEMINI_API_KEY=your_development_key
```

Run the application:

```bash
npm run dev
```

Quality commands:

```bash
npm audit --omit=dev --audit-level=high
npm run typecheck
npm run build
npm run preview
```

GitHub Actions uses the same lockfile with `npm ci`, runs the production dependency audit, type-checks the project, and creates a production build. The current validated production audit reports no vulnerabilities at the configured high-severity threshold.

## Data and privacy behaviour

- Journal entries, theme selection and card-back selection remain in the current browser's local storage.
- There is no account system, cloud journal, cross-device synchronisation or server-side journal database.
- Clearing site data or changing browsers removes access to locally stored journal entries.
- Reading prompts and chat messages are sent to Gemini when AI features are used.
- The application should not be used to store sensitive personal, health, legal or financial information.

## Reliability and safety improvements

The recruiter-readiness pass adds:

- lazy Gemini client initialisation so the non-AI interface can load without a configured key
- on-demand loading of Gemini code for readings, Aura chat, speech and generated card images
- explicit errors instead of displaying failure text as a successful tarot reading
- a guard that stops failed card-image requests from immediately re-triggering themselves
- recovery from malformed or unavailable local storage
- safer IDs for journal entries
- raw-HTML escaping, safe destination checks for rendered links, removal of model-supplied images, and escaped-text fallback when the Markdown renderer is unavailable
- accessible dialog labelling, form labels and live error/status regions
- a checked-in npm lockfile for reproducible installs
- automated production dependency auditing, TypeScript checking and production-build validation

## Bundle behaviour

Gemini operations are loaded only when an AI feature needs them. In the current validated production build, the initial application JavaScript is about 311 kB (92 kB gzip) and the on-demand Gemini-service chunk is about 292 kB (58 kB gzip). No generated JavaScript chunk exceeds Vite's default 500 kB warning threshold.

This is a performance boundary only. Lazy-loading the SDK does not make a browser-delivered API credential secret.

## Important deployment limitation

The current Vite configuration injects `GEMINI_API_KEY` into browser-delivered JavaScript when the AI chunk is loaded. Environment files keep a key out of Git history, but they **do not make a browser-delivered key secret**.

For a public deployment, route Gemini requests through a controlled server-side or serverless endpoint that:

- stores the provider credential outside the browser
- validates request shape and size
- applies rate limits and abuse controls
- restricts allowed model operations
- returns only the response data required by the client

Until that architecture is implemented, use a tightly restricted development key and treat this repository as an experimental client application rather than a secure public AI service.

## Project boundaries

This is a creative, reflective interface. It does not claim predictive accuracy, provide professional advice or replace mental-health support. Model output can be incomplete or incorrect and should be interpreted as generated reflective content.
