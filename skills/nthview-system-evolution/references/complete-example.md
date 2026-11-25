# System Evolution complete example

A complete, valid example that exercises the main fields: defending a login against credential stuffing, in nine steps with illustrative numbers.

```json
{
  "schemaVersion": 1,
  "title": "Defending a Login Against Credential Stuffing",
  "summary": "Five defences against a botnet replaying leaked passwords, and what each one costs real users.",
  "breadcrumb": [
    "Security",
    "Identity"
  ],
  "minutes": 8,
  "level": "intermediate",
  "note": "All numbers are illustrative, chosen to show the shape of each trade-off; they are not measurements.",
  "objectives": [
    {
      "id": "what-is-stuffing",
      "text": "What credential stuffing is and why reused passwords make it work"
    },
    {
      "id": "ip-limits",
      "text": "Why per-IP rate limits fail against residential proxies"
    },
    {
      "id": "signals",
      "text": "How bot detection and breached-password checks thin the attack"
    },
    {
      "id": "tradeoffs",
      "text": "What each defence costs real users"
    },
    {
      "id": "passkeys",
      "text": "Why passkeys end takeovers and are quicker than codes"
    }
  ],
  "metrics": [
    {
      "id": "tries",
      "label": "Tries reaching login",
      "icon": "bot",
      "unit": "/min",
      "format": "compact",
      "better": "lower",
      "warn": 1000,
      "bad": 5000
    },
    {
      "id": "takeovers",
      "label": "Takeovers / hour",
      "icon": "mask",
      "format": "number",
      "better": "lower",
      "warn": 1,
      "bad": 50
    },
    {
      "id": "failed",
      "label": "Failed logins",
      "icon": "x",
      "format": "percent",
      "better": "lower",
      "warn": 20,
      "bad": 60
    },
    {
      "id": "turned-away",
      "label": "Real users turned away",
      "icon": "users",
      "format": "percent",
      "decimals": 1,
      "better": "lower",
      "warn": 1,
      "bad": 3
    },
    {
      "id": "added-time",
      "label": "Added login time",
      "icon": "clock",
      "format": "duration",
      "better": "lower",
      "warn": 300,
      "bad": 3000
    }
  ],
  "packets": [
    {
      "id": "real",
      "label": "Real login",
      "shape": "dot",
      "tone": "blue"
    },
    {
      "id": "stuff",
      "label": "Stuffing attempt",
      "shape": "dot",
      "tone": "orange"
    },
    {
      "id": "takeover",
      "label": "Account takeover",
      "shape": "diamond",
      "tone": "red"
    },
    {
      "id": "lookup",
      "label": "Breach lookup",
      "shape": "ring",
      "tone": "purple"
    },
    {
      "id": "challenge",
      "label": "Challenge",
      "shape": "square",
      "tone": "amber"
    }
  ],
  "components": [
    {
      "id": "users",
      "kind": "users",
      "label": "Real users",
      "sublabel": "~500 logins/min",
      "count": 10
    },
    {
      "id": "bots",
      "kind": "botnet",
      "label": "Botnet",
      "sublabel": "leaked combo list",
      "count": 12
    },
    {
      "id": "proxies",
      "kind": "proxy",
      "label": "Home proxies",
      "sublabel": "rented IPs"
    },
    {
      "id": "limiter",
      "kind": "rate-limiter",
      "label": "Rate limit",
      "sublabel": "10/min per IP"
    },
    {
      "id": "detect",
      "kind": "detector",
      "label": "Bot detection",
      "sublabel": "fingerprints"
    },
    {
      "id": "login",
      "kind": "api",
      "label": "Login API",
      "sublabel": "password check"
    },
    {
      "id": "accounts",
      "kind": "database",
      "label": "Accounts"
    },
    {
      "id": "breach",
      "kind": "storage",
      "label": "Breached list",
      "sublabel": "hash prefixes",
      "icon": "list",
      "tone": "red"
    },
    {
      "id": "mfa",
      "kind": "mfa",
      "label": "MFA",
      "sublabel": "one-time code"
    }
  ],
  "links": [
    {
      "id": "users-login",
      "from": "users",
      "to": "login",
      "label": "POST /login"
    },
    {
      "id": "bots-login",
      "from": "bots",
      "to": "login",
      "label": "stolen pairs"
    },
    {
      "id": "users-limiter",
      "from": "users",
      "to": "limiter"
    },
    {
      "id": "bots-limiter",
      "from": "bots",
      "to": "limiter",
      "label": "stolen pairs"
    },
    {
      "id": "bots-proxies",
      "from": "bots",
      "to": "proxies",
      "label": "rotate IPs"
    },
    {
      "id": "proxies-limiter",
      "from": "proxies",
      "to": "limiter"
    },
    {
      "id": "limiter-login",
      "from": "limiter",
      "to": "login"
    },
    {
      "id": "limiter-detect",
      "from": "limiter",
      "to": "detect"
    },
    {
      "id": "detect-login",
      "from": "detect",
      "to": "login"
    },
    {
      "id": "login-accounts",
      "from": "login",
      "to": "accounts",
      "label": "session"
    },
    {
      "id": "login-breach",
      "from": "login",
      "to": "breach",
      "label": "leaked?",
      "arrow": "both"
    },
    {
      "id": "login-mfa",
      "from": "login",
      "to": "mfa",
      "label": "second factor",
      "arrow": "both"
    }
  ],
  "steps": [
    {
      "id": "password-only",
      "type": "context",
      "short": "Password only",
      "title": "A login with only a password",
      "body": [
        "A sign-in page asks for a username and a password. The **Login API** checks them against the **Accounts** store, and a match opens a session. Nothing else stands in the way.",
        "On a normal day about 500 people sign in each minute and 8% mistype. Watch each real login travel to the accounts store."
      ],
      "callouts": [
        {
          "kind": "key",
          "text": "A password proves only that someone *knows* it. If the same password leaked from another site, everyone holding that leak knows it too."
        }
      ],
      "components": {
        "users": {},
        "login": {
          "load": 22
        },
        "accounts": {}
      },
      "links": {
        "users-login": {},
        "login-accounts": {}
      },
      "flows": [
        {
          "path": [
            "users-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 2
        }
      ],
      "metrics": {
        "tries": 0,
        "takeovers": 0,
        "failed": 8,
        "turned-away": 0,
        "added-time": 0
      }
    },
    {
      "id": "botnet",
      "type": "problem",
      "short": "Botnet arrives",
      "title": "A botnet replays leaked passwords",
      "body": [
        "Billions of username and password pairs have leaked from other sites. A **credential-stuffing** botnet replays them against your login, betting that people reuse passwords. Nothing is guessed: every try is a real pair from somewhere else.",
        "Most pairs fail, but about 1 in 1,000 opens an account. At 20,000 tries a minute that is 1,200 takeovers an hour, and the flood slows real users down too."
      ],
      "callouts": [
        {
          "kind": "warn",
          "text": "Failed logins jump to 98%. That number shows the size of the attack, not its success: **takeovers** are the metric that matters."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "Botnet: 20,000 tries a minute from 300 data-centre IPs"
        },
        {
          "mark": "change",
          "text": "Login API load 22% → 96%"
        },
        {
          "mark": "change",
          "text": "Takeovers 0 → 1,200 an hour"
        }
      ],
      "objectives": [
        "what-is-stuffing"
      ],
      "components": {
        "users": {},
        "bots": {
          "badge": "300 IPs",
          "badgeTone": "bad"
        },
        "login": {
          "status": "overloaded",
          "load": 96,
          "badge": "20k tries/min",
          "badgeTone": "bad"
        },
        "accounts": {}
      },
      "links": {
        "users-login": {},
        "bots-login": {},
        "login-accounts": {
          "label": "stolen sessions"
        }
      },
      "flows": [
        {
          "link": "bots-login",
          "packet": "stuff",
          "rate": 5,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-login",
            "login-accounts"
          ],
          "packet": "takeover",
          "rate": 1
        },
        {
          "link": "users-login",
          "packet": "real",
          "rate": 2,
          "outcome": "held"
        }
      ],
      "metrics": {
        "tries": 20000,
        "takeovers": 1200,
        "failed": 98,
        "turned-away": 4,
        "added-time": 900
      }
    },
    {
      "id": "rate-limit",
      "type": "technique",
      "short": "Rate limit",
      "title": "Rate limit each IP address",
      "body": [
        "Put a **rate limit** in front of the login: each IP address may try 10 times a minute, then it waits. The botnet has 300 addresses, so at most 3,000 tries a minute get through.",
        "Takeovers fall from 1,200 to 180 an hour. A few real users share one address, such as an office or a mobile carrier's NAT, and hit the limit by accident."
      ],
      "callouts": [
        {
          "kind": "tip",
          "text": "Limit per account as well as per IP. Many failures on one account is a different signal from many accounts tried from one address."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "Rate limit: 10 tries a minute per IP"
        },
        {
          "mark": "change",
          "text": "Takeovers 1,200 → 180 an hour"
        },
        {
          "mark": "change",
          "text": "Real users turned away 4% → 0.6%"
        }
      ],
      "components": {
        "users": {},
        "bots": {
          "badge": "300 IPs",
          "badgeTone": "bad"
        },
        "limiter": {
          "load": 40,
          "badge": "17k/min stopped",
          "badgeTone": "good"
        },
        "login": {
          "load": 35
        },
        "accounts": {}
      },
      "links": {
        "users-limiter": {},
        "bots-limiter": {},
        "limiter-login": {},
        "login-accounts": {}
      },
      "flows": [
        {
          "link": "bots-limiter",
          "packet": "stuff",
          "rate": 5,
          "outcome": "blocked"
        },
        {
          "path": [
            "bots-limiter",
            "limiter-login"
          ],
          "packet": "stuff",
          "rate": 2,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-limiter",
            "limiter-login",
            "login-accounts"
          ],
          "packet": "takeover",
          "rate": 1
        },
        {
          "path": [
            "users-limiter",
            "limiter-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 2
        }
      ],
      "metrics": {
        "tries": 3000,
        "takeovers": 180,
        "failed": 87,
        "turned-away": 0.6,
        "added-time": 5
      }
    },
    {
      "id": "home-proxies",
      "type": "problem",
      "short": "Home proxies",
      "title": "The botnet hides behind home IPs",
      "body": [
        "Attack tools rent **residential proxies**: thousands of ordinary home connections. The same 20,000 tries now arrive from 15,000 addresses, about one try per address a minute. Every address stays far under the limit.",
        "Takeovers climb back to 1,164 an hour. The limiter still costs real users almost nothing, but it no longer sees an attack."
      ],
      "callouts": [
        {
          "kind": "warn",
          "text": "OWASP warns that proxy networks can defeat both IP block-lists and rate limiting. Never make IP blocking the only defence."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "15,000 residential proxy IPs"
        },
        {
          "mark": "change",
          "text": "Tries reaching login 3,000 → 19,400 a minute"
        },
        {
          "mark": "change",
          "text": "Takeovers 180 → 1,164 an hour"
        }
      ],
      "objectives": [
        "ip-limits"
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {
          "badge": "15,000 IPs",
          "badgeTone": "bad"
        },
        "limiter": {
          "load": 30,
          "badge": "all under limit",
          "badgeTone": "warn"
        },
        "login": {
          "status": "overloaded",
          "load": 93,
          "badge": "19k tries/min",
          "badgeTone": "bad"
        },
        "accounts": {}
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-login": {},
        "login-accounts": {}
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-login"
          ],
          "packet": "stuff",
          "rate": 5,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-login",
            "login-accounts"
          ],
          "packet": "takeover",
          "rate": 1
        },
        {
          "path": [
            "users-limiter",
            "limiter-login"
          ],
          "packet": "real",
          "rate": 2,
          "outcome": "held"
        }
      ],
      "metrics": {
        "tries": 19400,
        "takeovers": 1164,
        "failed": 98,
        "turned-away": 3,
        "added-time": 700
      }
    },
    {
      "id": "bot-detection",
      "type": "technique",
      "short": "Bot detection",
      "title": "Detect bots, not addresses",
      "body": [
        "**Bot detection** scores each try by *how* it arrives rather than where from: the device and browser fingerprint, the TLS handshake, whether a real browser ran the page, typing and timing.",
        "Nine in ten stuffing tries are stopped before any password is checked, and takeovers drop to 116 an hour. The cost: some real users on VPNs, privacy browsers or old phones look unusual and get a challenge."
      ],
      "callouts": [
        {
          "kind": "warn",
          "text": "Detection is an arms race. Attackers spoof fingerprints and pay people to solve CAPTCHAs, so expect the 90% to erode over time."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "Bot detection: fingerprints and behaviour"
        },
        {
          "mark": "change",
          "text": "Tries reaching login 19,400 → 1,940 a minute"
        },
        {
          "mark": "change",
          "text": "Real users turned away 3% → 1.8%"
        },
        {
          "mark": "change",
          "text": "Added login time 700 ms → 120 ms"
        }
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {},
        "limiter": {
          "load": 30
        },
        "detect": {
          "load": 55,
          "badge": "90% flagged",
          "badgeTone": "good"
        },
        "login": {
          "load": 30
        },
        "accounts": {}
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-detect": {},
        "detect-login": {},
        "login-accounts": {}
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect"
          ],
          "packet": "stuff",
          "rate": 5,
          "outcome": "blocked"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login"
          ],
          "packet": "stuff",
          "rate": 2,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "takeover",
          "rate": 1
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 2
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect"
          ],
          "packet": "challenge",
          "rate": 1,
          "reverse": true
        }
      ],
      "metrics": {
        "tries": 1940,
        "takeovers": 116,
        "failed": 81,
        "turned-away": 1.8,
        "added-time": 120
      }
    },
    {
      "id": "breach-check",
      "type": "technique",
      "short": "Breach check",
      "title": "Refuse passwords that have leaked",
      "body": [
        "Stuffed pairs come from old breaches, so the login can ask a **breached-password list** whether this password has leaked. With a k-anonymity range query, only the first characters of the password's hash leave the server.",
        "A correct but leaked password no longer opens the account: the owner must reset it by email. Takeovers fall to 23 an hour, and about 3% of real users are asked once to choose a new password."
      ],
      "callouts": [
        {
          "kind": "tip",
          "text": "NIST SP 800-63B requires checking new passwords against a blocklist that includes passwords from previous breaches. Checking at sign-in too catches the old ones."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "Breach check on every correct password"
        },
        {
          "mark": "change",
          "text": "Takeovers 116 → 23 an hour"
        },
        {
          "mark": "change",
          "text": "Added login time 120 ms → 140 ms"
        }
      ],
      "objectives": [
        "signals"
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {},
        "limiter": {
          "load": 30
        },
        "detect": {
          "load": 55,
          "badge": "90% flagged",
          "badgeTone": "good"
        },
        "login": {
          "load": 32
        },
        "accounts": {},
        "breach": {
          "badge": "leaked → reset",
          "badgeTone": "info"
        }
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-detect": {},
        "detect-login": {},
        "login-accounts": {},
        "login-breach": {}
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect"
          ],
          "packet": "stuff",
          "rate": 5,
          "outcome": "blocked"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login"
          ],
          "packet": "stuff",
          "rate": 2,
          "outcome": "fail"
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 2
        },
        {
          "link": "login-breach",
          "packet": "lookup",
          "rate": 2
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "takeover",
          "rate": 1
        }
      ],
      "metrics": {
        "tries": 1940,
        "takeovers": 23,
        "failed": 81,
        "turned-away": 1.8,
        "added-time": 140
      }
    },
    {
      "id": "add-mfa",
      "type": "tradeoff",
      "short": "Add MFA",
      "title": "Add a second factor",
      "body": [
        "**Multi-factor authentication** asks for something the attacker does not have: a code from an app or a text message. A stolen password alone is now useless, and takeovers fall to about 1 an hour.",
        "Real users pay for it. Typing a code adds about 9 seconds to every sign-in, some people lose their phone, and codes can still be phished or approved by a tired user."
      ],
      "callouts": [
        {
          "kind": "key",
          "text": "OWASP calls MFA by far the best defence against password attacks. The cost moves from security to convenience, so bot detection can now be less strict."
        }
      ],
      "changes": [
        {
          "mark": "add",
          "text": "MFA: a one-time code after the password"
        },
        {
          "mark": "change",
          "text": "Takeovers 23 → 1 an hour"
        },
        {
          "mark": "change",
          "text": "Added login time 140 ms → 9 s"
        },
        {
          "mark": "change",
          "text": "Detection relaxed: turned away 1.8% → 1.5%"
        }
      ],
      "objectives": [
        "tradeoffs"
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {},
        "limiter": {
          "load": 30
        },
        "detect": {
          "load": 50,
          "badge": "less strict",
          "badgeTone": "info"
        },
        "login": {
          "load": 32
        },
        "accounts": {},
        "breach": {},
        "mfa": {
          "badge": "+9 s per sign-in",
          "badgeTone": "warn"
        }
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-detect": {},
        "detect-login": {},
        "login-accounts": {},
        "login-breach": {},
        "login-mfa": {}
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect"
          ],
          "packet": "stuff",
          "rate": 5,
          "outcome": "blocked"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login"
          ],
          "packet": "stuff",
          "rate": 2,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login",
            "login-mfa"
          ],
          "packet": "takeover",
          "rate": 1,
          "outcome": "blocked"
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 2
        },
        {
          "link": "login-mfa",
          "packet": "challenge",
          "rate": 2
        },
        {
          "link": "login-breach",
          "packet": "lookup",
          "rate": 1
        }
      ],
      "metrics": {
        "tries": 1940,
        "takeovers": 1,
        "failed": 81,
        "turned-away": 1.5,
        "added-time": 9000
      }
    },
    {
      "id": "passkeys",
      "type": "case",
      "short": "Passkeys",
      "title": "Case: passkeys replace the password",
      "body": [
        "A **passkey** replaces both the password and the code with a key pair. The private key never leaves the person's device, and it signs in only to the real site, so there is nothing to stuff and nothing to phish.",
        "Users who switch stop being targets: takeovers reach zero, and a fingerprint or face check takes about a second instead of typing two secrets. Stuffing tries keep coming for the accounts that still have passwords."
      ],
      "callouts": [
        {
          "kind": "tip",
          "text": "CISA calls FIDO/WebAuthn, the standard behind passkeys, the only widely available phishing-resistant form of MFA."
        }
      ],
      "changes": [
        {
          "mark": "change",
          "text": "One-time codes → passkeys (FIDO/WebAuthn)"
        },
        {
          "mark": "change",
          "text": "Takeovers 1 → 0 an hour"
        },
        {
          "mark": "change",
          "text": "Added login time 9 s → 0.8 s"
        },
        {
          "mark": "change",
          "text": "Real users turned away 1.5% → 0.9%"
        }
      ],
      "objectives": [
        "passkeys"
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {},
        "limiter": {
          "load": 30
        },
        "detect": {
          "load": 50
        },
        "login": {
          "load": 30
        },
        "accounts": {},
        "breach": {
          "status": "dim"
        },
        "mfa": {
          "label": "Passkeys",
          "sublabel": "phishing-resistant",
          "badge": "nothing to type",
          "badgeTone": "good"
        }
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-detect": {},
        "detect-login": {},
        "login-accounts": {},
        "login-breach": {
          "state": "faint"
        },
        "login-mfa": {
          "label": "sign with device key"
        }
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect"
          ],
          "packet": "stuff",
          "rate": 5,
          "outcome": "blocked"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login"
          ],
          "packet": "stuff",
          "rate": 2,
          "outcome": "fail"
        },
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect",
            "detect-login",
            "login-mfa"
          ],
          "packet": "takeover",
          "rate": 1,
          "outcome": "blocked"
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 3
        }
      ],
      "metrics": {
        "tries": 1940,
        "takeovers": 0,
        "failed": 81,
        "turned-away": 0.9,
        "added-time": 800
      }
    },
    {
      "id": "recap",
      "type": "recap",
      "short": "Recap",
      "title": "Where an hour of attack went",
      "body": [
        "Every layer took its share, and each one cost real users something. No single defence would have been enough."
      ],
      "takeaways": [
        "Credential stuffing replays **leaked pairs**; it wins wherever passwords are reused.",
        "**Per-IP limits** are cheap but fall to residential proxies.",
        "**Bot detection** stops most tries, at the price of false positives.",
        "**Breach checks** turn a correct but leaked password into a reset.",
        "**MFA** ends most takeovers; **passkeys** end them and are quicker.",
        "Watch **takeovers** and **users turned away**, not the failed-login rate."
      ],
      "components": {
        "users": {},
        "bots": {},
        "proxies": {},
        "limiter": {
          "load": 30
        },
        "detect": {
          "load": 50
        },
        "login": {
          "load": 30
        },
        "accounts": {},
        "breach": {},
        "mfa": {
          "label": "Passkeys",
          "sublabel": "phishing-resistant"
        }
      },
      "links": {
        "users-limiter": {},
        "bots-proxies": {},
        "proxies-limiter": {},
        "limiter-detect": {},
        "detect-login": {},
        "login-accounts": {},
        "login-breach": {},
        "login-mfa": {}
      },
      "flows": [
        {
          "path": [
            "bots-proxies",
            "proxies-limiter",
            "limiter-detect"
          ],
          "packet": "stuff",
          "rate": 4,
          "outcome": "blocked"
        },
        {
          "path": [
            "users-limiter",
            "limiter-detect",
            "detect-login",
            "login-accounts"
          ],
          "packet": "real",
          "rate": 3
        }
      ],
      "breakdown": {
        "title": "Where an hour of attack went",
        "rows": [
          {
            "label": "Stopped by the rate limit",
            "value": 36000
          },
          {
            "label": "Stopped by bot detection",
            "value": 1047600,
            "highlight": true
          },
          {
            "label": "Wrong password",
            "value": 116284
          },
          {
            "label": "Leaked password, reset forced",
            "value": 93
          },
          {
            "label": "Stopped by MFA or passkey",
            "value": 23
          }
        ],
        "total": {
          "label": "Attack tries in an hour",
          "value": 1200000
        },
        "note": "Illustrative: 20,000 tries a minute against all five layers."
      },
      "metrics": {
        "tries": 1940,
        "takeovers": 0,
        "failed": 81,
        "turned-away": 0.9,
        "added-time": 800
      }
    }
  ],
  "sources": [
    {
      "label": "OWASP Credential Stuffing Prevention Cheat Sheet",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
    },
    {
      "label": "OWASP Automated Threats to Web Applications: OAT-008 Credential Stuffing",
      "url": "https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-008_Credential_Stuffing"
    },
    {
      "label": "NIST SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management",
      "url": "https://pages.nist.gov/800-63-4/sp800-63b.html"
    },
    {
      "label": "CISA, Implementing Phishing-Resistant MFA (fact sheet)",
      "url": "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf"
    }
  ]
}
```
