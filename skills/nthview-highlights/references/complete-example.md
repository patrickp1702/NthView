# Highlights complete example

A complete, valid object that exercises every field in `schema.md`. It is the
exact data in `examples/example.html`; `scripts/build-html.js --example` reads
it from this file.

```json
{
  "schemaVersion": 1,
  "title": "How Vaccines Train Your Immune System",
  "subtitle": "Eight cards on what a vaccine actually does inside you, before the full lesson.",
  "kicker": "Lesson preview · 5 chapters · about 40 min",
  "theme": "midnight",
  "tags": ["immunology", "vaccines", "health", "biology"],
  "cards": [
    {
      "id": "cover",
      "kind": "cover",
      "headline": "A vaccine is a rehearsal, not the real show.",
      "body": "It lets your immune system practise against a harmless stand-in, so the real pathogen meets a trained defence.",
      "accent": "violet"
    },
    {
      "id": "memory",
      "kind": "number",
      "kicker": "Chapter 1 · The problem",
      "headline": "Memory is the whole point",
      "number": { "value": "7–10", "label": "days for a first-time immune response to peak" },
      "body": "Too slow for many infections. Memory cells cut that to hours.",
      "accent": "coral"
    },
    {
      "id": "antigen",
      "kind": "topic",
      "kicker": "Chapter 2 · The stand-in",
      "headline": "Every vaccine shows your body an antigen",
      "body": "A piece, a weakened form, or instructions to make a piece of the pathogen. Enough to recognise, never enough to cause the disease.",
      "tags": ["antigen", "mrna", "inactivated"],
      "accent": "teal"
    },
    {
      "id": "players",
      "kind": "list",
      "kicker": "Chapter 3 · The team",
      "headline": "Four players you will meet",
      "points": ["Dendritic cells carry the antigen to the lymph node", "Helper T cells raise the alarm", "B cells make antibodies that fit", "Memory cells remember for years"],
      "accent": "amber"
    },
    {
      "id": "quote",
      "kind": "quote",
      "kicker": "Chapter 4 · Herd immunity",
      "headline": "Why your shot protects other people",
      "quote": { "text": "Immunity is a wall. Every vaccinated person is a brick the virus cannot pass through.", "by": "the lesson, chapter 4" },
      "accent": "blue"
    },
    {
      "id": "safety",
      "kind": "topic",
      "kicker": "Chapter 5 · Safety and side effects",
      "headline": "A sore arm is the training in progress",
      "body": "Fever, tiredness and swelling are the immune response itself. The lesson explains what is normal, what is rare, and how trials and monitoring work.",
      "points": ["Common: 1–2 days of soreness or tiredness", "Rare: allergic reactions, watched for 15 minutes", "Monitored: safety reporting continues after approval"],
      "accent": "rose"
    },
    {
      "id": "recap",
      "kind": "recap",
      "headline": "What this lesson covers",
      "body": "Tap any line to jump back to its card.",
      "accent": "lime"
    },
    {
      "id": "start",
      "kind": "cta",
      "headline": "Ready to start?",
      "body": "Chapter 1 opens with the problem a vaccine solves: why a first infection is so slow to fight.",
      "href": "https://www.who.int/news-room/questions-and-answers/item/vaccines-and-immunization-how-do-vaccines-work",
      "cta": "Read how vaccines work",
      "accent": "slate"
    }
  ]
}
```
