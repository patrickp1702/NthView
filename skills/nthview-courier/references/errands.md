# Courier — casting residents and choosing errands

Load this when you prepare a Courier JSON. The schema
(`references/schema.md`) says what each field is; this guide says how to
choose good content for it.

## The method in one paragraph
Courier is situated learning: every idea lives somewhere and belongs to
someone, so the learner remembers *who* does *what* *where*. Each idea is met
several times in different forms, spaced over a walk: explained in a letter,
said again in the resident's own words, retrieved when a parcel must find its
owner, categorised at the sorting table, sequenced in a chain, recalled as
the missing word in a telegram. No answer is ever marked against the learner;
every wrong choice is answered with the reason, and the review collects those
reasons at the end.

## Casting
1. **List the actors.** Write down every idea, role, component or step that
   *does* something distinct. Keep 3–14; merge ideas that a beginner cannot
   tell apart, drop ones that only matter to experts.
2. **Group them into districts.** A district is one main part of the concept
   (a layer, a stage, a department, an organ). Two to six districts; each
   holds at most six residents. The district `blurb` says what belongs there,
   because it is the answer when an envelope lands in the wrong bin.
3. **Give each actor a job and a voice.** A resident is a person with a
   trade, not a definition: the directory keeper, the crossroads guide, the
   careful courier. Their `role` is the trade; `personality` is one human
   line; `knows` is the idea in the first person with the real term in
   **bold**. Map story words to real terms in `glossary`.
4. **Make their talk teach.** `greeting` and each `smallTalk` line add one
   new fact or example, so a second visit reinforces rather than repeats.
5. **Look the part.** Portraits should be easy to tell apart at a glance:
   vary `hairStyle`, `top` colour and `accessory`. Use the district colour or
   a close shade for `top` when you want the district to read clearly.

## Which errand for which idea

| The idea is… | Use | Why it works |
| :- | :- | :- |
| New, needs explaining first | `letter` | The learner reads the explanation, carries it, then applies it in one check question |
| Defined by its properties ("the one that…") | `parcel` | Matching clues to an owner is retrieval and transfer; wrong owners explain themselves |
| A common question with a tempting wrong answer | `reply` | The learner chooses the answer card, each card explains itself, then carries the right one |
| One of several categories | `sort` | Envelopes into district bins; a wrong bin answers with that district's blurb |
| A process with handoffs in order | `chain` | Walking the message person to person makes the order physical; early visits earn a hint |
| A key term or sentence worth recalling exactly | `telegram` | Cloze: fill the gaps from options before sending |
| A number people misjudge | `weigh` | Estimate on the scale, then the reveal with the real figure and its source |
| Background, lore, a "did you know" | `notice` | Optional reading on a board; no check |

A good round of 8–10 errands uses five to eight kinds: two letters, one or
two parcels, one reply, one sort, one chain, and one each of telegram, weigh
and notice when the content has a key term, a number and some lore.

## Order and pacing
- List errands roughly in teaching order: explanations (letters, replies)
  before retrieval (parcels, sorting, chains). All of them are open at once,
  which is the point: the learner chooses where to walk.
- Use `after` only when an errand makes no sense earlier (a chain that needs
  the first letter's idea, a weigh that follows a telegram). Never chain more
  than two or three `after`s.
- Spread recipients across districts so the learner walks the whole planet.
- Notices are optional and do not hold back the closing letter.

## Writing each kind

### `letter`
Two short paragraphs from the postmaster or a resident (`from`), addressed
to the resident whose idea it explains. The check question is asked in the
recipient's voice and applies the idea to a tiny situation. Wrong options are
the confusions a beginner really has, each `why` pointing back to the right
resident.

```json
{ "id": "letter-for-della", "kind": "letter", "title": "A letter for the directory keeper",
  "hint": "Della lives up on Name Hill, by the big library.",
  "teaches": "DNS turns a name people can remember into a number address computers can use.",
  "done": "Perfectly put. Names for people, numbers for machines.",
  "to": "della",
  "letter": { "paragraphs": ["Dear Della, …", "Ada"] },
  "check": { "question": "Pip wants bakery.example. What do I give back?",
    "options": [
      { "text": "The number address", "correct": true, "why": "Della only translates the name into a number." },
      { "text": "The page itself", "why": "Pages are baked by Bea on Server Street." } ] } }
```

### `parcel`
`label` says what it looks like; `clues` are 2–4 properties of the owner's
idea, never their name or role word. `decoys` cover the residents a learner
will most likely try first, each explaining why it is not theirs and nudging
toward the owner. Everyone else answers with their own `knows`.

```json
{ "id": "numbered-pages", "kind": "parcel", "title": "A bundle of numbered pages",
  "hint": "No name on this one. Think who would care about every page arriving.",
  "teaches": "TCP numbers the pieces, checks they all arrived and resends the missing ones.",
  "done": "My pages! I'd already noticed five was late.",
  "label": "A bundle of pages tied with string",
  "clues": ["Every page is numbered: 1 of 8, 2 of 8…", "A note: page 5 never arrived, please resend."],
  "owner": "tess",
  "decoys": [{ "resident": "ivy", "why": "I stamp addresses; counting and resending is Tess's job." }] }
```

### `reply`
The asker poses a real question in their voice; 2–4 `cards`, exactly one
correct, each with a `why`. The right card is carried to `to`, usually the
resident the answer matters to.

```json
{ "id": "rorys-question", "kind": "reply", "title": "Rory's question",
  "hint": "Rory at the Crossroads has been puzzling over something.",
  "teaches": "No router knows the whole route; each sends a packet one hop closer.",
  "done": "So my address stamp is all he needs. Thank you.",
  "asker": "rory", "question": "Do I need the whole route before I send a packet?",
  "cards": [
    { "text": "No. Choose the next hop; the next guide does the same.", "correct": true, "why": "That is routing." },
    { "text": "Yes. Every guide keeps a map of the whole internet.", "why": "Far too big, and it changes every second." } ],
  "to": "ivy" }
```

### `sort`
3–10 envelopes, each a short phrase (a request, a symptom, a task) that
clearly belongs to one district; `note` says why. Use at least three
districts as destinations.

```json
{ "id": "morning-sort", "kind": "sort", "title": "Sort the morning mail",
  "hint": "Talk to Ada at the post office.",
  "teaches": "Each part of the journey has its own job.",
  "done": "Every envelope in the right pigeonhole.",
  "envelopes": [
    { "label": "What is the number for shop.example?", "district": "name-hill", "note": "Names become numbers on Name Hill." },
    { "label": "GET /menu", "district": "server-street", "note": "Orders go to Server Street." },
    { "label": "Page 3 of 8 is missing", "district": "harbour", "note": "Resending is the Harbour's job." } ] }
```

### `chain`
List `steps` in the true order. The first resident starts the chain (their
`says` hands over the message); each later `says` is what happens at that
step; `tooEarly` explains what must come first without naming the next
person outright.

```json
{ "id": "fetch-the-page", "kind": "chain", "title": "Fetch the bakery page",
  "hint": "Pass the request along in the order it really happens.",
  "teaches": "Ask, look up, connect, seal, order.",
  "done": "A fresh page, delivered in the right order.",
  "message": "Pip would like the page at bakery.example.",
  "steps": [
    { "resident": "pip", "says": "Here is what I want. Who turns names into numbers?" },
    { "resident": "della", "says": "That's 93.184.216.34.", "tooEarly": "Has Pip told you what to look up?" },
    { "resident": "tess", "says": "Connection open.", "tooEarly": "Which number would I even call?" } ] }
```

### `telegram`
One or two sentences with 1–4 `___` gaps over the key terms; options are
real alternatives a beginner might pick; `why` explains the right word.

```json
{ "id": "telegram-to-hal", "kind": "telegram", "title": "A telegram for Hal",
  "hint": "The telegraph is at the post office.",
  "teaches": "GET asks for a page; 200 means OK, 404 not found.",
  "done": "A perfectly written order.",
  "to": "hal", "text": "ORDER READS ___ /menu STOP IF ALL IS WELL ___ STOP",
  "gaps": [
    { "options": ["GET", "POST"], "answer": 0, "why": "GET asks for something; POST sends something." },
    { "options": ["404 Not Found", "200 OK"], "answer": 1, "why": "200 means here it is." } ] }
```

### `weigh`
A real, sourced number people misjudge. Set `min`/`max` so the answer is not
in the middle, a `tolerance` of roughly a tenth of the range, and say the
source in `reveal`. The weighed parcel goes to `to`.

```json
{ "id": "weigh-the-page", "kind": "weigh", "title": "How heavy is a web page?",
  "hint": "There is a parcel on the post-office scale.",
  "teaches": "A typical page weighs 2–3 MB, mostly pictures and scripts.",
  "done": "Into the pantry it goes.",
  "label": "Bea's front page", "prompt": "How many MB does a whole web page weigh?",
  "unit": "MB", "min": 0, "max": 10, "step": 0.1, "answer": 2.5, "tolerance": 1,
  "reveal": "About 2.5 MB (HTTP Archive 2024 median).", "to": "cass" }
```

### `notice`
Lore with no check: how something works behind the scenes, a surprising
fact, a bit of history. One to three short paragraphs.

```json
{ "id": "hill-notice", "kind": "notice", "title": "The board on Name Hill",
  "hint": "There is a notice board by the library.",
  "teaches": "Lookups climb a ladder of directories and answers are cached.",
  "district": "name-hill", "heading": "How Della finds a name she doesn't know",
  "paragraphs": ["If Della has never heard of a name, she asks a root directory…"] }
```

## Checklist before validating
- Every idea appears in at least two forms (a resident's `knows` plus an
  errand, or an errand plus a sort envelope).
- No parcel clue, `tooEarly` or `hint` names the answer outright.
- Every wrong option, card, decoy and gap explains itself.
- `teaches` lines read as a summary of the whole concept when listed in
  order; they become the closing letter's recap.
