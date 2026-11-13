# Highlights data schema — schemaVersion 1

## Overview
A short stack of text-only cards, in the rhythm of an educational social-media carousel, that previews everything a lesson or document is going to cover without teaching it in detail. One idea per card, a hook first, a recap and a call to action last.

## External libraries
The renderer loads two Google Fonts (Fraunces for headlines, Inter for text) from `fonts.googleapis.com`. The page falls back to system fonts when offline.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Name shown in the post header and used for the avatar initials |
| `subtitle` | string | no | ≤200 chars | One sentence shown as the post caption under the cards |
| `kicker` | string | no | ≤60 chars | Small line under the title in the header, e.g. "Lesson · 5 chapters · 45 min"; default "Highlights · N cards" |
| `theme` | string | no | one of `midnight`, `sunrise`, `ocean`, `forest`, `berry`, `paper`; default `midnight` | Page and card palette. `midnight`, `ocean`, `forest`, `berry` are dark; `sunrise`, `paper` are light. Every card gradient stays on one brightness side |
| `tags` | string[] | no | 0–10 items, each 1–30 chars, lowercase kebab-case | Shown as hashtags in the caption and on the cover card when it has no tags of its own |
| `cards` | array | yes | 3–24 Card objects | In reading order |

## Card object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | 1–40 chars, lowercase kebab-case, unique | Stable key for read-state |
| `kind` | string | no | one of `cover`, `topic`, `list`, `quote`, `number`, `recap`, `cta`; default `topic` | Layout of the card (see Kinds) |
| `kicker` | string | no | ≤40 chars | Small uppercase line above the headline, e.g. the chapter name |
| `headline` | string | yes | 1–90 chars | The one idea of the card. For `quote` and `number` it is read by screen readers only |
| `body` | string | no | ≤320 chars | One short paragraph |
| `points` | string[] | no | 0–6 items, each ≤90 chars | Numbered points; required (≥2) for `list` |
| `quote` | object | conditional | `text` 1–200, `by` ≤60 | Required for `quote` |
| `number` | object | conditional | `value` 1–12 chars, `label` 1–80 | Required for `number`; `value` is shown huge, e.g. "14", "3×", "1 in 5" |
| `tags` | string[] | no | 0–6 items, each ≤24 chars, kebab-case | Hashtags at the card's foot |
| `accent` | string | no | one of `violet`, `coral`, `teal`, `amber`, `blue`, `rose`, `lime`, `slate` | Card gradient; default rotates through the list by position |
| `href` | string | no | ≤200 chars, not `javascript:` | A page to open: a chapter, a doc, a source. Shown as an "Open" button; required for `cta` |
| `cta` | string | no | ≤40 chars, needs `href` | Button label on the card, e.g. "Start chapter 1" |

## Kinds

| Kind | Shows | Use for |
| :- | :- | :- |
| `cover` | Headline large, body, tags | The hook: what this is and why it matters. First card |
| `topic` | Kicker, headline, body, optional points | One thing the lesson will cover |
| `list` | Headline, 2–6 big numbered points | Several things in one breath: the chapters, the steps, the parts |
| `quote` | A quotation and who said it | A line worth remembering, or the one-sentence version of the idea |
| `number` | One huge figure and its label | A number that makes the point |
| `recap` | Headline and a checklist of every topic card, ticked once read | Second to last |
| `cta` | Headline, body, one button | Last: where to go next |

## Cross-field rules
- `cards[i].id` values are unique.
- A `list` card has at least 2 `points`; a `quote` card has `quote`; a `number` card has `number`; a `cta` card has `href`; `cta` (the label) needs `href` on the same card.

## Warnings (non-blocking)
- No `cover` card, or the cover is not first.
- No `recap` or `cta` card at the end.
- Fewer than 5 cards.
- A `topic` card with neither `body` nor `points`.
- A card with `body` and more than 3 `points` (may overflow on a phone).

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
