# Timeline data schema — schemaVersion 1

## Overview
The data describes a dated story the learner reads from top to bottom: events
in time order, optional lanes (tracks) such as attacker and defender, eras
that label stretches of time, and cause → effect links between events.
Questions sit between events wherever the author puts them, in six kinds that
ask the learner to order, place, explain causes and effects, choose, sort and
reflect; every question explains its answer.

Text fields accept two inline marks: `**bold**` and `` `code` ``. Nothing
else is interpreted. Character limits count JavaScript string length.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `intro` | string[] | no | 1–4 items, each 1–600 chars | Opening paragraphs above the first event |
| `reveal` | string | no | `step` (default) or `open` | `step`: everything after an unanswered question stays hidden until the learner answers or skips it. `open`: the whole timeline shows at once and questions can be answered in any order |
| `timeZone` | string | no | ≤12 chars, e.g. `UTC` | Appended to every time shown |
| `gaps` | boolean | no | default `true` | Show the elapsed time between neighbouring events ("4 months later") |
| `tracks` | array | no | 1–3 Track objects | Lanes; with exactly two, wide screens put one on each side of the line |
| `eras` | array | no | 1–8 Era objects, no overlap | Labelled stretches of the timeline |
| `events` | array | yes | 2–80 Event objects, in time order | The timeline |
| `questions` | array | no | 0–40 Question objects | Placed after events; several after one event keep their listed order |
| `wrap` | object | no | see Wrap | The end card; a plain ending is shown without it |
| `references` | array | no | 1–20 Reference objects | Sources, listed on the end card and cited by events |

## Track object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Used by `events[].track` |
| `label` | string | yes | 1–40 chars | Legend and filter label, e.g. "Attackers" |
| `text` | string | no | ≤200 chars | One line in the legend |

## Era object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | Era heading, e.g. "The leak" |
| `from` | string | yes | event id | First event of the era |
| `to` | string | yes | event id, not listed before `from` | Last event of the era |
| `text` | string | no | ≤300 chars | One or two lines under the heading |

## Event object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `date` | string | yes | `YYYY`, `YYYY-MM`, `YYYY-MM-DD` or `YYYY-MM-DDThh:mm`; year may be negative (BCE) and 1–6 digits | Sort key and default label; write only the precision you know |
| `end` | string | no | same format, later than `date` | Makes the event a span ("12–15 May 2017") |
| `label` | string | no | ≤40 chars | Shown instead of the formatted date, e.g. "c. 1450" or "Spring 2017"; `date` still sorts |
| `title` | string | yes | 1–100 chars | Headline |
| `text` | string | yes | 1–600 chars | What happened, in two or three sentences |
| `detail` | string[] | no | 1–6 items, each 1–800 chars | Paragraphs behind a "Read more" toggle |
| `track` | string | no | a `tracks[].id` | Lane; required in spirit when tracks exist (a warning otherwise) |
| `turningPoint` | boolean | no | default `false` | Marks a moment that changed the direction or pace of events |
| `causes` | array | no | 1–4 Cause objects | Earlier events that led to this one |
| `refs` | integer[] | no | 1–4 indexes into `references` | Sources shown under the event |

## Cause object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `event` | string | yes | event id listed before this event, not repeated | The cause |
| `how` | string | no | ≤200 chars | How it led here, shown on the link ("gave anyone a working exploit") |
| `kind` | string | no | `trigger` or `condition` | `trigger`: the immediate spark. `condition`: a longer-standing state that made it possible |

The view also lists the reverse links ("Led to") on each cause.

## Question object

Fields shared by every kind:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among questions | Stable key |
| `kind` | string | yes | `order`, `place`, `cause`, `choice`, `sort` or `reflect` | See below |
| `after` | string | yes | event id | The question appears right after this event |
| `prompt` | string | no (yes for `reflect`) | ≤300 chars | The question; each kind has a default |
| `hint` | string | no | ≤300 chars | Behind a "Hint" button |
| `explain` | string | yes | 1–800 chars | Shown after answering or skipping, right or wrong; for `reflect`, the model answer |

Fields by kind:

| Kind | Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- | :- |
| `order` | `events` | string[] | yes | 3–6 distinct event ids | Shown shuffled, without dates; the learner moves them into time order. Default prompt "Put these in time order, earliest first." |
| `place` | `event` | string | yes | event id listed before `after`; placed by at most one question | The event to place. It stays off the timeline until the question is answered, then appears in its slot |
| `place` | `among` | string[] | yes | 2–6 distinct event ids, listed at or before `after`, not the placed event | Neighbours shown with dates; the learner picks the gap. Default prompt "Where does this event belong?" |
| `cause` | `event` | string | yes | event id | The event asked about |
| `cause` | `ask` | string | no | `cause` (default) or `effect` | `cause`: which option led to `event`. `effect`: which option `event` led to |
| `cause` | `options` | array | yes | 2–5 `{ event, why }`, distinct event ids, not `event` | `event` (id, required), `why` (≤400 chars). Exactly one option must be linked: for `cause`, listed in `event`'s `causes`; for `effect`, an event whose `causes` list `event` |
| `choice` | `options` | array | yes | 2–6 `{ text, correct, why }`, exactly one `correct: true` | `text` (1–200 chars, required), `correct` (boolean), `why` (≤400 chars) |
| `sort` | `bins` | string[] | yes | 2–3 items, each 1–40 chars | Groups, e.g. "Trigger", "Condition" or "Changed", "Stayed the same" |
| `sort` | `items` | array | yes | 2–8 `{ event` or `text, bin, why }` | Exactly one of `event` (id) or `text` (1–160 chars); `bin` (integer index into `bins`, required); `why` (≤300 chars) |

`reflect` has no extra fields: the learner thinks or types an answer, then
reveals `explain` to compare. It is never marked right or wrong.

## Wrap object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "What the timeline shows" | End card heading |
| `text` | string[] | yes | 1–4 items, each 1–600 chars | Closing paragraphs |
| `takeaways` | string[] | no | 1–8 items, each 1–200 chars | Bullet points to remember |

## Reference object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–160 chars | Source title |
| `publisher` | string | no | ≤80 chars | Who published it |
| `url` | string | no | ≤500 chars, starts with `http://` or `https://`, no spaces | Link, opened in a new tab |

## Cross-field rules
- Event, track and question ids are each unique within their list.
- `events[i].date` is not earlier than `events[i-1].date`, compared only at
  the precision both share: `2017-05-12` may sit before or after
  `2017-05-12T15:00`, and `2017` before or after `2017-05`.
- `events[i].end` is later than `events[i].date` at the precision both share.
- `events[i].track` matches a `tracks[j].id`; setting it without `tracks` is
  an error.
- `events[i].refs[k]` is an index into `references`.
- `events[i].causes[k].event` is an event listed before `events[i]`.
- `eras[i].from` and `eras[i].to` are event ids, `to` not listed before
  `from`; two eras never share an event.
- `questions[i].after` is an event id that no `place` question hides.
- `place`: `event` is listed before `after`; `among` events are at or before
  `after` and are not hidden by any `place` question; an event is placed by
  at most one question.
- `cause`: exactly one option is linked as described in the table.
- `choice`: exactly one option has `correct: true`.
- `sort`: every `bin` is an index into `bins`.

## Warnings (non-blocking)
- Fewer than 4 events.
- No questions (the learner only reads).
- More than 8 events in a row with no question after any of them.
- An event without `track` while tracks exist.
- A `cause` or `choice` option without `why`.
- An `order` question with two events on the same date.
- A `sort` bin that no item belongs to.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
