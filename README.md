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

Install dependencies:

```bash
npm ci
```

Create `.env.local` beside `package.json`:

```env
GEMINI_API_KEY=your_development_key
```

Run the application:

```bash
npm run dev
```

Quality commands:

```bash
npm run typecheck
npm run build
npm run preview
```

## Data and privacy behaviour

- Journal entries, theme selection and card-back selection remain in the current browser's local storage.
- There is no account system, cloud journal, cross-device synchronisation or server-side journal database.
- Clearing site data or changing browsers removes access to locally stored journal entries.
- Reading prompts and chat messages are sent to Gemini when AI features are used.
- The application should not be used to store sensitive personal, health, legal or financial information.

## Important deployment limitation

The current Vite configuration injects `GEMINI_API_KEY` into the browser bundle. Environment files keep a key out of Git history, but they **do not make a browser-delivered key secret**.

For a public deployment, route Gemini requests through a controlled server-side or serverless endpoint that:

- stores the provider credential outside the browser
- validates request shape and size
- applies rate limits and abuse controls
- restricts allowed model operations
- returns only the response data required by the client

Until that architecture is implemented, use a tightly restricted development key and treat this repository as an experimental client application rather than a secure public AI service.

## Reliability and safety improvements

The recruiter-readiness pass adds:

- lazy Gemini client initialisation so the non-AI interface can load without a configured key
- explicit errors instead of displaying failure text as a successful tarot reading
- recovery from malformed or unavailable local storage
- safer IDs for journal entries
- raw-HTML escaping and common unsafe-link protocol blocking before model Markdown reaches the rendered interface
- accessible dialog labelling, form labels and live error/status regions
- automated TypeScript and production-build checks

## Project boundaries

This is a creative, reflective interface. It does not claim predictive accuracy, provide professional advice or replace mental-health support. Model output can be incomplete or incorrect and should be interpreted as generated reflective content.
