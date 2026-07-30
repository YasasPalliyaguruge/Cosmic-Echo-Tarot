# Cosmic Echo Tarot

![Cosmic Echo Tarot project cover](assets/recruiter/cover.png)

> **Portfolio lens:** A private, browser-first reflective experience that pairs a rich visual ritual with intentionally local journal data.

Cosmic Echo Tarot is a small, browser-first tarot-reading experience. Pick a spread, draw cards, ask Aura follow-up questions, listen to the generated reading, and keep private reflections in the local journal.

The reading, speech, chat, and optional card-image tools use Gemini. Journal entries, theme choices, and card-back preferences stay in the browser's local storage; this repository does not provide an account system or a server-side journal.

## Local run

```bash
npm install
```

Create `.env.local` beside `package.json`:

```env
GEMINI_API_KEY=your_key
```

Then start Vite with `npm run dev`. Use `npm run build` to produce the deployable bundle and `npm run preview` to inspect that bundle locally.

The Vite setup makes the Gemini key available to the client application. Use a tightly restricted key and never commit `.env.local`.
