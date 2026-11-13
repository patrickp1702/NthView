# Mechanism complete example

A complete, valid object that exercises every field in `schema.md`. It is the
exact data in `examples/example.html`; `scripts/build-html.js --example` reads
it from this file.

```json
{
  "schemaVersion": 1,
  "title": "How Login Defences Shape a Password Attack",
  "subtitle": "A token bucket, an account lockout with backoff, and what a patient attacker does about them, minute by minute over one day.",
  "kicker": "Mechanism · identity security",
  "theme": "graphite",
  "seed": 7,
  "lead": [
    "Every sign-in page sits behind two classic defences: a ((token bucket)) that limits how fast one IP address may try, and a ((lockout)) that freezes an account after too many failures. Both are counters that fill and drain over time, so the only honest way to understand them is to watch them run.",
    "Scroll and the story drives the clock: cards move it to the moment they describe, pinned chapters run it as you scroll, and the dock at the bottom lets you play, scrub and switch scenarios at any time. Every number is recomputed from minute 0 by the same short list of rules. Values are ((expected value))s for a typical account, and the numbers are illustrative."
  ],
  "clock": {
    "unit": "minute",
    "horizon": 1440,
    "label": "since midnight",
    "speeds": [
      5,
      30,
      120,
      480
    ],
    "speed": 1,
    "windows": [
      {
        "label": "1 h",
        "ticks": 60
      },
      {
        "label": "6 h",
        "ticks": 360
      }
    ],
    "window": 2
  },
  "parameters": [
    {
      "id": "attackRate",
      "label": "Attempts per IP per minute",
      "min": 0,
      "max": 60,
      "default": 0,
      "step": 0.5,
      "unit": "/min",
      "description": "How fast each attacking address would like to guess."
    },
    {
      "id": "attackIps",
      "label": "Attacking IP addresses",
      "min": 1,
      "max": 500,
      "default": 1,
      "step": 1,
      "format": "int"
    },
    {
      "id": "accounts",
      "label": "Accounts targeted",
      "min": 1,
      "max": 2000,
      "default": 1,
      "step": 1,
      "format": "int",
      "description": "The attacker spreads guesses evenly over these accounts."
    },
    {
      "id": "bucketSize",
      "label": "Burst allowance per IP",
      "min": 1,
      "max": 60,
      "default": 10,
      "step": 1,
      "unit": "tokens",
      "format": "int"
    },
    {
      "id": "refillRate",
      "label": "Refill per IP",
      "min": 0.1,
      "max": 10,
      "default": 1,
      "step": 0.1,
      "unit": "/min"
    },
    {
      "id": "lockThreshold",
      "label": "Failures before lockout",
      "min": 3,
      "max": 20,
      "default": 5,
      "step": 1,
      "format": "int"
    },
    {
      "id": "failWindow",
      "label": "Failure memory",
      "min": 5,
      "max": 120,
      "default": 30,
      "step": 5,
      "format": "duration",
      "description": "The counter forgets the threshold's worth of failures over this long."
    },
    {
      "id": "baseLockout",
      "label": "First lockout",
      "min": 1,
      "max": 60,
      "default": 15,
      "step": 1,
      "format": "duration"
    },
    {
      "id": "backoff",
      "label": "Backoff",
      "min": 1,
      "max": 4,
      "default": 2,
      "control": "choice",
      "options": [
        {
          "label": "None",
          "value": 1
        },
        {
          "label": "×2",
          "value": 2
        },
        {
          "label": "×3",
          "value": 3
        },
        {
          "label": "×4",
          "value": 4
        }
      ]
    },
    {
      "id": "maxLockout",
      "label": "Longest lockout",
      "min": 15,
      "max": 1440,
      "default": 240,
      "format": "duration",
      "control": "choice",
      "options": [
        {
          "label": "1 h",
          "value": 60
        },
        {
          "label": "4 h",
          "value": 240
        },
        {
          "label": "24 h",
          "value": 1440
        }
      ]
    },
    {
      "id": "pGuess",
      "label": "Chance one guess is right",
      "min": 0.0001,
      "max": 0.01,
      "default": 0.002,
      "step": 0.0001,
      "format": "percent"
    },
    {
      "id": "screening",
      "label": "Block breached passwords",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 1,
      "control": "toggle",
      "description": "Users may not pick passwords from known breach lists, so common guesses rarely work."
    },
    {
      "id": "mfaShare",
      "label": "Accounts with MFA",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 0.05,
      "format": "percent"
    },
    {
      "id": "challenge",
      "label": "Tenant-wide challenge",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 1,
      "control": "toggle"
    },
    {
      "id": "alarmRate",
      "label": "Challenge above",
      "min": 10,
      "max": 1000,
      "default": 50,
      "step": 10,
      "unit": "fails/min",
      "format": "int"
    }
  ],
  "variables": [
    {
      "id": "tokens",
      "label": "Tokens in the bucket",
      "initial": "bucketSize",
      "min": 0,
      "format": "dp1",
      "color": "blue",
      "description": "Per attacking IP. Each attempt spends one token."
    },
    {
      "id": "allowed",
      "label": "Let through per IP",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "unit": "/min",
      "color": "teal"
    },
    {
      "id": "limited",
      "label": "Turned away by the limiter",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "grey"
    },
    {
      "id": "tenantFails",
      "label": "Failed logins, tenant",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "orange"
    },
    {
      "id": "challenged",
      "label": "Challenge active",
      "initial": 0,
      "min": 0,
      "max": 1,
      "format": "int",
      "color": "violet"
    },
    {
      "id": "passed",
      "label": "Past the challenge",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "teal"
    },
    {
      "id": "stopped",
      "label": "Stopped by the challenge",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "violet"
    },
    {
      "id": "lockLeft",
      "label": "Lockout time left",
      "initial": 0,
      "min": 0,
      "format": "duration",
      "color": "red"
    },
    {
      "id": "rejected",
      "label": "Rejected by the lockout",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "red"
    },
    {
      "id": "perAccount",
      "label": "Guesses per account",
      "initial": 0,
      "min": 0,
      "format": "dp2",
      "unit": "/min",
      "color": "amber"
    },
    {
      "id": "tested",
      "label": "Guesses tested, tenant",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "amber"
    },
    {
      "id": "failures",
      "label": "Failure counter",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "color": "orange"
    },
    {
      "id": "lockouts",
      "label": "Lockouts so far",
      "initial": 0,
      "min": 0,
      "format": "int",
      "color": "red"
    },
    {
      "id": "guesses",
      "label": "Guesses tried per account",
      "initial": 0,
      "min": 0,
      "format": "number",
      "color": "pink"
    },
    {
      "id": "pFallen",
      "label": "Chance an account has fallen",
      "initial": 0,
      "min": 0,
      "max": 1,
      "format": "percent",
      "color": "pink"
    },
    {
      "id": "takeovers",
      "label": "Expected takeovers",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "color": "red"
    },
    {
      "id": "userDenied",
      "label": "Sign-ins refused to the owner",
      "initial": 0,
      "min": 0,
      "format": "int",
      "color": "amber"
    }
  ],
  "rules": [
    {
      "target": "tokens",
      "expr": "min(bucketSize, tokens + refillRate)",
      "label": "Refill the bucket",
      "note": "Tokens drip in at the refill rate and never exceed the burst allowance."
    },
    {
      "target": "allowed",
      "expr": "min(attackRate, floor(tokens))",
      "label": "Let through what tokens cover",
      "note": "One whole token per attempt; the rest waits or is refused."
    },
    {
      "target": "tokens",
      "expr": "tokens - allowed",
      "label": "Spend the tokens"
    },
    {
      "target": "limited",
      "expr": "(attackRate - allowed) * attackIps",
      "label": "Count what the limiter refused",
      "note": "Across every attacking IP."
    },
    {
      "target": "tenantFails",
      "expr": "allowed * attackIps",
      "label": "Failed logins across the tenant"
    },
    {
      "target": "challenged",
      "expr": "if(challenge && tenantFails > alarmRate, 1, 0)",
      "label": "Raise the challenge?",
      "note": "A tenant-wide signal: too many failures per minute anywhere, and every sign-in must pass a challenge."
    },
    {
      "target": "passed",
      "expr": "tenantFails * if(challenged, 0.05, 1)",
      "label": "Attempts that clear the challenge",
      "note": "Automated tools clear about 5% of challenges."
    },
    {
      "target": "stopped",
      "expr": "tenantFails - passed",
      "label": "Attempts the challenge stopped"
    },
    {
      "target": "rejected",
      "expr": "if(lockLeft > 0, passed, 0)",
      "label": "Refused while locked"
    },
    {
      "target": "perAccount",
      "expr": "if(lockLeft > 0, 0, passed / accounts)",
      "label": "Guesses that reach each account",
      "note": "Spread evenly; a locked account accepts none."
    },
    {
      "target": "tested",
      "expr": "perAccount * accounts",
      "label": "Guesses actually tested"
    },
    {
      "target": "failures",
      "expr": "max(0, failures - lockThreshold / failWindow) + perAccount",
      "label": "Leak old failures, add new ones",
      "note": "A leaky counter: it forgets the threshold's worth of failures over the failure memory."
    },
    {
      "target": "guesses",
      "expr": "guesses + perAccount",
      "label": "Add to the guesses tried"
    },
    {
      "target": "pFallen",
      "expr": "1 - pow(1 - pGuess * if(screening, 0.1, 1), guesses)",
      "label": "Chance at least one guess was right",
      "note": "Breach screening makes each common guess ten times less likely to work."
    },
    {
      "target": "takeovers",
      "expr": "accounts * pFallen * (1 - mfaShare)",
      "label": "Accounts actually taken over",
      "note": "A right password does not get past MFA."
    },
    {
      "target": "userDenied",
      "expr": "userDenied + if(lockLeft > 0, userLogin, 0)",
      "label": "Did the owner hit a locked door?"
    },
    {
      "target": "lockLeft",
      "expr": "max(0, lockLeft - 1)",
      "label": "A minute of lockout passes"
    }
  ],
  "events": [
    {
      "id": "lockout",
      "label": "Account locked",
      "when": "failures >= lockThreshold && lockLeft == 0",
      "set": {
        "lockLeft": "min(maxLockout, baseLockout * pow(backoff, lockouts))",
        "lockouts": "lockouts + 1",
        "failures": 0
      },
      "color": "red",
      "note": "Each lockout lasts the first lockout times backoff to the power of earlier lockouts, up to the longest lockout."
    },
    {
      "id": "userLogin",
      "label": "Owner signs in",
      "every": {
        "period": 120,
        "from": 30
      },
      "set": {
        "failures": "if(lockLeft > 0, failures, 0)"
      },
      "color": "green",
      "note": "The real owner signs in every two hours; a success clears the failure counter."
    },
    {
      "id": "challengeOn",
      "label": "Challenge raised",
      "when": "challenged > 0",
      "once": true,
      "color": "violet"
    }
  ],
  "scenarios": [
    {
      "id": "normal",
      "label": "Normal day",
      "description": "No attacker. The owner signs in every two hours and fumbles the password: twice before one sign-in, four times before another.",
      "events": [
        {
          "id": "typo",
          "label": "Owner mistypes",
          "at": [
            148,
            149,
            506,
            507,
            508,
            509
          ],
          "set": {
            "failures": "failures + 1"
          },
          "color": "amber"
        }
      ]
    },
    {
      "id": "brute",
      "label": "Brute force",
      "description": "One IP hammers one account at 30 guesses a minute.",
      "parameters": {
        "attackRate": 30,
        "attackIps": 1,
        "accounts": 1
      }
    },
    {
      "id": "spray",
      "label": "Password spray",
      "description": "200 IPs try one common password at a time across 1,000 accounts, slowly.",
      "parameters": {
        "attackRate": 0.5,
        "attackIps": 200,
        "accounts": 1000
      }
    },
    {
      "id": "defended",
      "label": "Spray, defended",
      "description": "The same spray against breach screening, 90% MFA and a tenant-wide challenge.",
      "parameters": {
        "attackRate": 0.5,
        "attackIps": 200,
        "accounts": 1000,
        "screening": 1,
        "mfaShare": 0.9,
        "challenge": 1
      }
    }
  ],
  "sections": [
    {
      "id": "setting",
      "kicker": "The setting",
      "title": "One sign-in page, one day, four stories",
      "body": [
        "The page you are protecting accepts a username and a password. Behind it sit counters per attacking address and per account, and every minute a short list of rules updates them. The stage behind this page shows those counters as pillars: each arc is a rule reading one counter to set another, and a pulse runs along it whenever that calculation changes something.",
        "Scroll on: each card below moves the clock to the end of the day in a different scenario. Watch the scoreboard and the pillars change."
      ],
      "focus": [
        "takeovers",
        "guesses",
        "lockouts",
        "userDenied"
      ],
      "steps": [
        {
          "title": "A normal day",
          "text": "No attacker. The owner signs in every two hours and mistypes now and then, but the failure counter forgets faster than typos add up. Nothing locks, nobody is refused.",
          "at": 1440,
          "scenario": "normal"
        },
        {
          "title": "Brute force",
          "text": "One address hammers one account at 30 guesses a minute. The account locks **{lockouts}** times and the owner is refused **{userDenied}** sign-ins, yet the attacker only got **{guesses}** guesses in.",
          "at": 1440,
          "scenario": "brute"
        },
        {
          "title": "Password spray",
          "text": "Two hundred addresses, a thousand accounts, half a guess per address per minute. No lockout ever fires, and about **{takeovers}** accounts fall by midnight.",
          "at": 1440,
          "scenario": "spray"
        },
        {
          "title": "Spray, defended",
          "text": "The same spray against breach screening, 90% MFA and a tenant-wide challenge: **{takeovers}** expected takeovers.",
          "at": 1440,
          "scenario": "defended"
        }
      ],
      "figures": [
        {
          "kind": "tile",
          "title": "End-of-day scoreboard",
          "items": [
            {
              "var": "takeovers",
              "better": "down"
            },
            {
              "var": "guesses",
              "label": "Guesses per account",
              "better": "down"
            },
            {
              "var": "lockouts",
              "better": "down"
            },
            {
              "var": "userDenied",
              "label": "Owner refused",
              "better": "down"
            }
          ]
        },
        {
          "kind": "events",
          "title": "What happened when",
          "caption": "Each row is one kind of event in the current scenario. The owner's sign-ins are green."
        }
      ]
    },
    {
      "id": "token-bucket",
      "kicker": "Defence 1",
      "title": "The limiter: a token bucket per IP",
      "body": [
        "A ((token bucket)) holds up to **{bucketSize}** for each address. Every attempt spends one token, and the bucket refills at **{refillRate}**. A full bucket lets a burst through at once; after that the address is held to the refill rate, however fast it tries."
      ],
      "controls": [
        "bucketSize",
        "refillRate",
        "attackRate"
      ],
      "focus": [
        "tokens",
        "allowed"
      ],
      "steps": [
        {
          "title": "Minute 0: a full bucket",
          "text": "Before the first attempt the bucket holds **{tokens}** tokens. Nothing has happened yet.",
          "at": 0,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "Minute 1: the burst",
          "text": "The attacker asks for 30 attempts. The bucket covers **{allowed}** of them and is empty; the limiter refuses the other **{limited}**. Follow the pulses in the flow: the refill feeds the bucket, the bucket feeds what is let through.",
          "at": 1,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "Minute 2 onwards: one a minute",
          "text": "Each minute the bucket refills by one token and the attacker spends it at once. From here on the address gets exactly **{allowed}**, however hard it tries.",
          "at": 5,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "An hour later, nothing has changed",
          "text": "The pattern holds for the whole day: the bucket never fills again. Try a bigger burst allowance or a faster refill in the controls above and scroll back up.",
          "at": 60,
          "scenario": "brute",
          "window": "1 h"
        }
      ],
      "figures": [
        {
          "kind": "flow",
          "title": "How this minute is calculated",
          "targets": [
            "tokens",
            "allowed",
            "limited"
          ],
          "caption": "Each box is a value; each line is a rule reading it. Pulses run when a rule changes its result."
        },
        {
          "kind": "state",
          "title": "The counters right now",
          "vars": [
            "tokens",
            "allowed",
            "limited",
            "tenantFails"
          ]
        },
        {
          "kind": "step",
          "title": "Bucket and throughput, per IP",
          "series": [
            {
              "var": "tokens"
            },
            {
              "var": "allowed"
            }
          ],
          "yLabel": "tokens · attempts/min",
          "caption": "Step lines: each value holds for a whole minute. In the brute force the bucket empties in minute 1 and never refills, so the blue line sits on zero."
        }
      ]
    },
    {
      "id": "lockout",
      "kicker": "Defence 2",
      "title": "The lockout: a leaky counter with backoff",
      "body": [
        "Each account keeps a failure counter. Every wrong guess adds one; the counter also forgets, losing {lockThreshold} failures over each {failWindow|duration}, so a few typos spread over a morning never add up. When it reaches **{lockThreshold}**, the account ((locks|lockout)).",
        "The first lockout lasts {baseLockout|duration}. Each later one is multiplied by the ((exponential backoff)) factor, up to {maxLockout|duration}. Backoff is what makes a lockout expensive for a guessing machine: the waits double while the guesses do not.",
        "This chapter is pinned: **keep scrolling and the clock runs** through the brute-force morning, lockout by lockout."
      ],
      "controls": [
        "lockThreshold",
        "failWindow",
        "baseLockout",
        "backoff",
        "maxLockout"
      ],
      "focus": [
        "failures",
        "lockLeft",
        "lockouts"
      ],
      "scrub": {
        "from": 0,
        "to": 720,
        "scenario": "brute",
        "window": "All",
        "screens": 5,
        "marks": [
          {
            "at": 0,
            "text": "Midnight. The account has a clean record: the failure counter is at zero."
          },
          {
            "at": 2,
            "text": "Minute 2: ten guesses in the first burst, well over the threshold of {lockThreshold}. The first ((lockout)): {baseLockout|duration}."
          },
          {
            "at": 23,
            "text": "The account opens, five more guesses, locked again. This time for 30 minutes: ((exponential backoff)) doubles every wait."
          },
          {
            "at": 59,
            "text": "Third lockout, an hour. The attacker is now spending most of the time waiting."
          },
          {
            "at": 125,
            "text": "Fourth lockout, two hours. Each lockout costs the attacker more than the last; the guesses do not grow."
          },
          {
            "at": 251,
            "text": "From the fifth lockout on, the wait is capped at {maxLockout|duration}. The account opens for a few minutes every four hours."
          },
          {
            "at": 600,
            "text": "By mid-morning the account has been locked **{lockouts}** times for only **{guesses}** guesses."
          }
        ]
      },
      "figures": [
        {
          "kind": "gauge",
          "title": "Failure counter",
          "var": "failures",
          "min": 0,
          "max": 10,
          "label": "failures remembered",
          "zones": [
            {
              "to": "lockThreshold",
              "color": "green",
              "label": "Counting"
            },
            {
              "to": 10,
              "color": "red",
              "label": "Locks next minute"
            }
          ]
        },
        {
          "kind": "area",
          "title": "Lockout time left",
          "series": [
            {
              "var": "lockLeft"
            }
          ],
          "yLabel": "minutes",
          "caption": "Each red marker is a lockout; each ramp is one lockout running down, minute by minute."
        }
      ],
      "check": {
        "prompt": "In the brute force, with backoff ×2 and a 4-hour cap, how many times is the account locked by noon?",
        "options": [
          {
            "text": "About 36: one every 20 minutes",
            "why": "That is what happens without backoff: 15 minutes locked, 5 minutes of guessing, again and again. Set backoff to None and look."
          },
          {
            "text": "About 6: the waits double until the cap",
            "correct": true,
            "why": "15, 30, 60, 120 and then 240 minutes, again and again. Most of the morning is spent locked."
          },
          {
            "text": "Once: the account stays locked all day",
            "why": "Only a 24-hour cap would do that; a cap of 4 hours lets the account open again."
          }
        ],
        "reveal": "By noon the account has been locked **{lockouts}** times and the attacker has tried **{guesses}** guesses against it.",
        "expect": {
          "scenario": "brute",
          "at": 720,
          "test": "lockouts >= 5 && lockouts <= 7"
        }
      }
    },
    {
      "id": "where-attempts-go",
      "kicker": "The funnel",
      "title": "Where every attempt goes",
      "body": [
        "Every attempt the attacker wants to make ends in exactly one place: refused by the limiter, stopped by a challenge, refused by a locked account, or actually tested against a password. The cards switch scenarios at the same moment of the day."
      ],
      "focus": [
        "tenantFails",
        "passed",
        "perAccount"
      ],
      "steps": [
        {
          "title": "Brute force: the limiter does the work",
          "text": "Almost every attempt is refused by the limiter: **{limited}** a minute, against one that gets through.",
          "at": 600,
          "scenario": "brute"
        },
        {
          "title": "Password spray: nothing is refused",
          "text": "Each address sends half a guess a minute, well under its bucket. Every single guess is tested: **{tested}** a minute across the tenant.",
          "at": 600,
          "scenario": "spray"
        },
        {
          "title": "Spray, defended: the challenge takes over",
          "text": "The tenant-wide challenge stops **{stopped}** attempts a minute; only **{tested}** are still tested.",
          "at": 600,
          "scenario": "defended"
        }
      ],
      "figures": [
        {
          "kind": "stacked",
          "title": "Attempts per hour, by outcome",
          "series": [
            {
              "var": "limited",
              "label": "Limiter"
            },
            {
              "var": "stopped",
              "label": "Challenge"
            },
            {
              "var": "rejected",
              "label": "Lockout"
            },
            {
              "var": "tested",
              "label": "Tested"
            }
          ],
          "bucket": 60,
          "agg": "sum",
          "yLabel": "attempts per hour"
        },
        {
          "kind": "bar",
          "title": "This minute, whole tenant",
          "bars": [
            {
              "var": "limited",
              "label": "Limiter"
            },
            {
              "var": "stopped",
              "label": "Challenge"
            },
            {
              "var": "rejected",
              "label": "Lockout"
            },
            {
              "var": "tested",
              "label": "Tested"
            }
          ]
        }
      ]
    },
    {
      "id": "spray",
      "kicker": "The attacker adapts",
      "title": "Password spraying walks under both defences",
      "body": [
        "A ((password spray)) turns the problem around. Instead of many guesses against one account, it tries one common password against many accounts, from many addresses, then the next password, and so on. Each address stays under its bucket and each account sees a guess only every few minutes. Accounts targeted now: **{accounts}**; attacking addresses: **{attackIps}**."
      ],
      "controls": [
        "attackIps",
        "accounts",
        "pGuess"
      ],
      "focus": [
        "perAccount",
        "guesses",
        "pFallen",
        "takeovers"
      ],
      "steps": [
        {
          "title": "One hour in",
          "text": "Each account has seen about **{guesses}** guesses. The chance that a given account has fallen is **{pFallen}**: small, and growing.",
          "at": 60,
          "scenario": "spray"
        },
        {
          "title": "Six hours in",
          "text": "It compounds. After **{guesses}** guesses an account has a **{pFallen}** chance of having fallen; across the tenant that is about **{takeovers}** accounts.",
          "at": 360,
          "scenario": "spray"
        },
        {
          "title": "Midnight",
          "text": "**{takeovers}** expected takeovers, and not one lockout. The small multiples put all four scenarios on one scale: the spray is in a different league.",
          "at": 1440,
          "scenario": "spray"
        }
      ],
      "figures": [
        {
          "kind": "line",
          "title": "Chance a targeted account has fallen",
          "series": [
            {
              "var": "pFallen"
            }
          ],
          "yMin": 0,
          "thresholds": [
            {
              "value": 0.1,
              "label": "1 in 10",
              "color": "grey"
            }
          ]
        },
        {
          "kind": "compare",
          "title": "Expected takeovers, every scenario",
          "var": "takeovers",
          "caption": "Same vertical scale in every panel. The highlighted panel is the scenario you are viewing."
        }
      ],
      "check": {
        "prompt": "The spray sends each account one guess every ten minutes. Will the lockout ever trigger?",
        "options": [
          {
            "text": "Yes, after 50 minutes: five failures",
            "why": "It would, if the counter never forgot. It forgets five failures per half hour, faster than the spray adds them."
          },
          {
            "text": "No, never",
            "correct": true,
            "why": "The counter leaks faster than it fills, so it never gets near five."
          },
          {
            "text": "Yes, but only for the most targeted accounts",
            "why": "The spray is even: every account gets the same trickle, so none reaches the threshold."
          }
        ],
        "reveal": "The spray has locked the account **{lockouts}** times, yet has tested **{guesses}** guesses against each of the {accounts} accounts.",
        "expect": {
          "scenario": "spray",
          "at": 1440,
          "test": "lockouts == 0 && takeovers > 100"
        }
      }
    },
    {
      "id": "lockout-as-weapon",
      "kicker": "The side effect",
      "title": "A lockout is also a weapon",
      "body": [
        "Look at the owner during the brute force. The account is locked for most of the day, so most of the owner's sign-ins hit a locked door: the attacker cannot get in, but neither can the owner. Keep scrolling to run the whole day."
      ],
      "focus": [
        "lockLeft",
        "userDenied"
      ],
      "scrub": {
        "from": 0,
        "to": 1440,
        "scenario": "brute",
        "window": "All",
        "screens": 4,
        "marks": [
          {
            "at": 0,
            "text": "The owner will try to sign in every two hours, starting at half past midnight."
          },
          {
            "at": 30,
            "text": "00:30: the account is locked. The owner is refused for the first time."
          },
          {
            "at": 390,
            "text": "By morning the owner has been refused **{userDenied}** times out of four tries."
          },
          {
            "at": 1350,
            "text": "By the end of the day: refused **{userDenied}** times out of twelve. Anyone who knows a username can do this on purpose."
          }
        ]
      },
      "figures": [
        {
          "kind": "heatmap",
          "title": "Lockout time left, by scenario",
          "var": "lockLeft",
          "buckets": 48,
          "agg": "max"
        },
        {
          "kind": "step",
          "title": "Owner sign-ins refused",
          "series": [
            {
              "var": "userDenied"
            }
          ],
          "yMin": 0
        }
      ]
    },
    {
      "id": "defences-that-work",
      "kicker": "The bench",
      "title": "Defences that look at the whole tenant",
      "body": [
        "The spray is invisible per address and per account, but not across the tenant: two hundred addresses at half a guess a minute is a hundred failures a minute, far above normal. A tenant-wide ((challenge)), raised when failures pass **{alarmRate}**, stops most automated guesses.",
        "Two more defences change the arithmetic instead of the rate. ((Breached-password screening)) makes each common guess ten times less likely to work, and ((MFA)) means a right password alone does not open the account.",
        "This is the bench: every knob, every figure, and the clock. Switch scenarios, turn defences on and off, press play and watch the stage."
      ],
      "controls": [
        "challenge",
        "alarmRate",
        "screening",
        "mfaShare",
        "attackIps",
        "accounts",
        "attackRate",
        "pGuess"
      ],
      "focus": [
        "tenantFails",
        "passed",
        "takeovers",
        "pFallen"
      ],
      "bench": true,
      "figures": [
        {
          "kind": "area",
          "title": "Failed logins across the tenant",
          "series": [
            {
              "var": "passed"
            },
            {
              "var": "stopped"
            }
          ],
          "stacked": true,
          "yLabel": "per minute",
          "thresholds": [
            {
              "value": "alarmRate",
              "label": "challenge threshold",
              "color": "violet"
            }
          ]
        },
        {
          "kind": "tile",
          "items": [
            {
              "var": "takeovers",
              "better": "down"
            },
            {
              "var": "pFallen",
              "better": "down"
            }
          ],
          "sparkline": true
        },
        {
          "kind": "calc",
          "title": "This minute's calculation",
          "targets": [
            "challenged",
            "passed",
            "stopped",
            "perAccount",
            "pFallen",
            "takeovers"
          ]
        }
      ],
      "goto": {
        "label": "Start the defended spray",
        "tick": 0,
        "scenario": "defended"
      }
    }
  ],
  "glossary": [
    {
      "term": "token bucket",
      "definition": "A rate limiter: a bucket holds a fixed number of tokens, each request spends one, and tokens refill at a steady rate. It allows short bursts but caps the long-run rate."
    },
    {
      "term": "lockout",
      "definition": "Refusing every sign-in to an account for a while after too many failed attempts."
    },
    {
      "term": "exponential backoff",
      "definition": "Making each successive wait longer by a fixed factor, for example 15, 30, 60, 120 minutes."
    },
    {
      "term": "password spray",
      "definition": "An attack that tries a few very common passwords against many accounts, slowly, to stay under per-account and per-address limits."
    },
    {
      "term": "challenge",
      "definition": "An extra test, such as a puzzle or a device check, that people pass easily and automated tools mostly fail."
    },
    {
      "term": "breached-password screening",
      "definition": "Refusing passwords that appear in known breach lists when users set them, so the most common guesses stop working."
    },
    {
      "term": "MFA",
      "definition": "Multi-factor authentication: a second proof, such as a code or a key, that a stolen or guessed password alone cannot supply."
    },
    {
      "term": "expected value",
      "definition": "The average outcome over many runs. Half a guess a minute means one guess every two minutes on average."
    }
  ],
  "closing": {
    "heading": "What the clock showed",
    "body": [
      "Per-address rate limits and per-account lockouts are both counters with a refill or a leak. They stop an attacker who is fast and narrow, and they are blind to one who is slow and wide, because neither counter ever fills.",
      "Defences that work against the spray either look across the whole tenant, or change what a right guess is worth. And a lockout always has a cost: whoever can trigger it can lock real users out."
    ],
    "takeaways": [
      "A token bucket caps the long-run rate per address at its refill rate.",
      "A leaky failure counter never trips if failures arrive slower than it forgets them.",
      "Backoff makes lockouts expensive for machines; a cap decides how expensive.",
      "Spraying beats per-address and per-account limits by going wide and slow.",
      "Tenant-wide signals, breach screening and MFA defeat the spray.",
      "Every lockout policy can be turned into a denial of service against real users."
    ]
  },
  "stage": {
    "title": "The counters",
    "variables": [
      "tokens",
      "allowed",
      "tenantFails",
      "passed",
      "perAccount",
      "failures",
      "lockLeft",
      "lockouts",
      "guesses",
      "pFallen",
      "takeovers",
      "userDenied"
    ]
  }
}
```
