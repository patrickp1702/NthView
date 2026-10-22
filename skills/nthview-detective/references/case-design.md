# Detective — designing a case from a concept

This guide turns a concept into a solvable case and helps pick a location
type for each fact. The field tables and limits live in `schema.md`; the
complete Marigold Kitchen example there uses every type. This file is about
*how* to design the case.

## From concept to case in five moves

1. **The question.** Phrase the concept as one question with one answer.
   "What is compliance?" becomes "Why did fourteen people fall ill after
   Tuesday's lunch?", whose answer ("the checks happened on paper, not in the
   kitchen") *is* the concept in action.
2. **The theories.** List what people wrongly believe about the concept.
   Each belief becomes a wrong hypothesis that explains the incident in its
   own terms. Two to four is right; mark the one or two most people hold as
   `popular`.
3. **The killers.** For every wrong theory, write the fact that rules it out
   and why (`because`). For the right theory, the facts that support it.
4. **The incident.** Invent a small, concrete place where all those facts can
   be found: a kitchen, an office, a codebase, a ship. Give each wrong theory
   to a person who would believe it for understandable reasons.
5. **The search.** Put each fact somewhere it can be discovered by doing
   something: looking, asking, reading, comparing, ordering, checking,
   unlocking, testing.

## The theory and clue matrix

Draw the matrix before writing any location. Rows are clues, columns are
theories; mark **✕** where a clue rules a theory out and **✓** where it fits.

| Clue | Supplier | New cook | Red tape | Customer | Paper checks (right) |
| :- | :- | :- | :- | :- | :- |
| Arrived at 3 °C | ✕ | | | | |
| Same batch, no complaints | ✕ | | | | |
| Readings on a closed Sunday | ✕ | | | | ✓ |
| Alarm taped over | | ✕ | | | ✓ |
| Never trained | | ✕ | | | ✓ |
| What 9 °C does | | | ✕ | | ✓ |
| Eaten straight away | | | | ✕ | |
| Only the chicken wraps | ✓ | | | | ✓ |
| Five-star certificate (red herring) | | | | | |

Check, in this order:
- every wrong column has at least one ✕ (two from different locations is
  better: the learner should not depend on one puzzle);
- the right column has no ✕ and three or more ✓;
- at least one row has ✓ on a wrong theory and on the right one (fitting is
  not proof; only contradiction eliminates);
- one row is empty: the red herring.

The validator enforces the first two; the rest are what make the board
teach.

## Which location type fits which fact

| The fact is… | Use | Why |
| :- | :- | :- |
| Physical: a setting, a label, an object out of place | `examine` | Looking around a scene is the most detective-like act; three or four hotspots with clues, two or three dead ends |
| Something a person knows, believes or admits | `interview` | Questions that open up (`unlocks`) or appear once evidence is found (`requires`) make returning pay off |
| A rule, a policy, a contract clause, an email line | `document` | Highlighting the line that matters is close reading; the other lines get short notes |
| Two records that should agree and don't | `compare` | Row by row, the difference is the clue |
| A sequence that rules something out by timing | `timeline` | Rebuilding the order makes "when" concrete; times stay hidden until solved |
| A log or table where one entry cannot be true | `ledger` | Checking numbers against a stated rule is real-world verification |
| Evidence hidden until another clue is understood | `lock` | The code comes from something found elsewhere; gate it with `requires` |
| A cause and effect worth seeing for yourself | `lab` | Toggling conditions shows *why* a rule exists (the reason behind the limit) |

Rules of thumb:
- Use at least five types; the validator warns below four.
- Lead with `examine` (it yields several clues fast and sets the scene).
- Gate one location (`requires`) so the case has a second act.
- Put the clue that kills the most popular theory somewhere central, not
  behind a lock.
- An interviewee can reveal the same clue as another location; the board
  counts it once. That is a good way to give two routes to a key clue.

## Snippets

Each snippet is one `locations[]` entry. Replace the text; keep the shape.

### examine
```json
{ "id": "office", "name": "The office", "type": "examine", "summary": "Where the email was sent from.",
  "scene": "office",
  "hotspots": [
    { "id": "screen", "label": "Laptop", "object": "laptop", "x": 40, "y": 55, "note": "Still logged in as the finance manager.", "clue": "logged-in" },
    { "id": "note", "label": "Sticky note", "object": "note", "x": 62, "y": 30, "note": "A password, written out in full.", "clue": "password-note" },
    { "id": "plant", "label": "Plant", "object": "plant", "x": 85, "y": 70, "note": "Thirsty, but innocent." }
  ] }
```

### interview
```json
{ "id": "sam", "name": "Interview: Sam", "type": "interview", "person": "sam", "summary": "The intern who clicked the link.",
  "opening": "\"I thought it was from the bank.\"",
  "questions": [
    { "id": "what", "ask": "What did the email say?", "answer": "\"That our account was frozen.\"", "unlocks": ["link"] },
    { "id": "link", "ask": "Where did the link go?", "answer": "\"A page that looked exactly like the bank's.\"", "clue": "lookalike" },
    { "id": "note", "ask": "Whose password was on the note?", "requires": ["password-note"], "answer": "\"Mine. Everyone does it.\"", "clue": "shared-habit" },
    { "id": "blame", "ask": "Who do you think is to blame?", "answer": "\"IT should have blocked it.\"", "redHerring": true, "note": "Filters catch most phishing, not all; the habit that failed was checking the sender." }
  ] }
```

### document
```json
{ "id": "policy", "name": "Security policy", "type": "document", "docType": "policy", "docTitle": "Acceptable use, section 2",
  "summary": "The rules everyone signed.",
  "lines": [
    { "text": "2.1 Never write passwords down.", "clue": "rule-passwords" },
    { "text": "2.2 Lock your screen when you leave your desk.", "note": "Worth remembering in the office." },
    { "text": "2.3 Printers are shared.", "note": "True, and irrelevant." }
  ] }
```

### compare
```json
{ "id": "emails", "name": "Two emails", "type": "compare", "summary": "The real bank email and the fake.",
  "rowLabels": ["From", "Link", "Greeting"],
  "left":  { "label": "Exhibit A: real email", "rows": ["alerts@bank.com", "bank.com/login", "Dear Ms Rao"] },
  "right": { "label": "Exhibit B: phishing email", "rows": ["alerts@bank-secure.co", "bank-secure.co/login", "Dear customer"] },
  "spots": [
    { "row": 0, "note": "One letter of difference in the domain.", "clue": "fake-domain" },
    { "row": 2, "note": "The real bank uses your name." }
  ] }
```

### timeline
```json
{ "id": "night", "name": "That night", "type": "timeline", "summary": "Put the log entries in order.",
  "events": [
    { "id": "a", "time": "21:04", "text": "Email arrives." },
    { "id": "b", "time": "21:09", "text": "Link clicked." },
    { "id": "c", "time": "21:11", "text": "Password entered on the fake page." },
    { "id": "d", "time": "02:30", "text": "Login from abroad." }
  ],
  "solvedNote": "Seven minutes from email to stolen password.", "clue": "seven-minutes" }
```

### ledger
```json
{ "id": "payments", "name": "Payments log", "type": "ledger", "summary": "Last week's outgoing payments.",
  "rule": "Payments over £5,000 need two approvers.",
  "columns": ["Date", "Amount", "Approved by"],
  "rows": [["Mon", "£1,200", "A. Rao"], ["Tue", "£9,800", "A. Rao"], ["Wed", "£300", "B. Kim"]],
  "mismatches": [{ "row": 1, "cell": 2, "note": "£9,800 with a single approver.", "clue": "one-approver" }] }
```

### lock
```json
{ "id": "drawer", "name": "Locked drawer", "type": "lock", "summary": "The manager's desk drawer.",
  "requires": ["password-note"], "lockedNote": "Look around the office first.",
  "prompt": "A three-digit lock.", "answer": "417",
  "hints": ["The sticky note had numbers on it.", "The last three digits of the password.", "The code is 4 1 7."],
  "openText": "Inside: the printed list of every shared password.", "clue": "password-list" }
```

### lab
```json
{ "id": "test", "name": "Test lab", "type": "lab", "summary": "Try the same login with and without two-factor.",
  "prompt": "Set the protections, then try the stolen password.", "visual": "gauge", "meterLabel": "Chance the attacker gets in",
  "controls": [{ "id": "mfa", "label": "Two-factor login", "options": ["Off", "On"] }],
  "outcomes": [
    { "when": { "mfa": 0 }, "level": 95, "reading": "Almost certain", "text": "The password alone is enough.", "clue": "mfa-matters" },
    { "level": 5, "reading": "Very unlikely", "text": "Without the phone, the password is useless." }
  ] }
```

## Writing the debrief well
The debrief is built from the data: the correct theory's `statement` and
`why` with its supporting clues; each wrong theory's holder, `statement`,
`tempting`, `why` and every clue that rules it out with its `because`; every
red herring. So:
- write each `because` as a full sentence that makes sense on its own;
- write `tempting` so the holder would agree with it;
- make the correct theory's `why` list the evidence in plain words.
