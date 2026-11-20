# Story complete example

A complete, valid object that exercises the schema: five chapters on how a phishing email steals a password and how multi-factor authentication, and then a passkey, stops it, with narration written for the ear. It is the exact data in `examples/example.html`.

```json
{
  "schemaVersion": 1,
  "title": "How a phishing email steals a password, and how MFA stops it",
  "subtitle": "A five-chapter animated story about phishing, one-time codes and passkeys",
  "summary": "Sam gets an urgent email that looks like it came from the bank. Follow the password from the inbox to a look-alike site and into an attacker's hands, then watch three defences take turns: a one-time code, the relay trick that beats it, and a passkey that only works on the real site.",
  "audience": "Anyone with an email or bank account",
  "lang": "en",
  "world": "day",
  "narrator": {
    "voice": "female",
    "tone": "warm"
  },
  "pace": "chapter",
  "cast": [
    {
      "id": "sam",
      "name": "Sam",
      "role": "the account owner",
      "preset": "citizen",
      "stands": "You, or anyone who signs in to email or a bank online",
      "voice": "female"
    },
    {
      "id": "pip",
      "name": "Pip",
      "role": "email delivery",
      "preset": "courier",
      "stands": "The mail system: it delivers every message, honest or not",
      "voice": "male"
    },
    {
      "id": "mallory",
      "name": "Mallory",
      "role": "the phisher",
      "preset": "crook",
      "post": "fake",
      "stands": "An attacker who builds a fake sign-in page to collect what people type",
      "voice": "male"
    },
    {
      "id": "ward",
      "name": "Ward",
      "role": "the bank's sign-in check",
      "preset": "guard",
      "post": "real",
      "stands": "The real site's login: it checks the password and the second factor",
      "voice": "female"
    },
    {
      "id": "kiro",
      "name": "Kiro",
      "role": "a passkey",
      "preset": "robot",
      "color": "#5aa9e6",
      "stands": "A passkey on Sam's phone: a key made for one website and no other",
      "voice": "male"
    }
  ],
  "props": [
    {
      "id": "email",
      "kind": "letter",
      "label": "Urgent email",
      "color": "#f4efe2",
      "heldBy": "pip",
      "means": "A phishing email dressed up as a message from the bank"
    },
    {
      "id": "notice",
      "kind": "card",
      "label": "The email",
      "title": "From: Security Team",
      "text": "Your account is locked. Verify within 24 hours or it will be closed: rnybank.example/login",
      "means": "What the email says: a threat, a deadline and a link"
    },
    {
      "id": "flags",
      "kind": "counter",
      "label": "Red flags",
      "value": "0",
      "means": "The warning signs Sam can spot before clicking"
    },
    {
      "id": "password",
      "kind": "key",
      "label": "Password",
      "color": "#e8b83a",
      "heldBy": "sam",
      "means": "Something Sam knows. Anything known can be copied"
    },
    {
      "id": "stolen",
      "kind": "key",
      "label": "Copied password",
      "color": "#c9a14a",
      "means": "A copy of what Sam typed: Sam still has the original"
    },
    {
      "id": "account",
      "kind": "lock",
      "label": "Sam's account",
      "color": "#4f7dd1",
      "means": "Sam's account at the real bank"
    },
    {
      "id": "rule",
      "kind": "card",
      "label": "Why it worked",
      "title": "Passwords alone",
      "text": "The bank checks the password, not the person. Whoever holds it gets in.",
      "means": "The weakness the attack used"
    },
    {
      "id": "phone",
      "kind": "phone",
      "label": "Code app",
      "value": "481 207",
      "means": "Something Sam has: an app that shows a fresh 6-digit code every 30 seconds"
    },
    {
      "id": "timer",
      "kind": "clock",
      "label": "Code expires",
      "value": "30 s",
      "means": "A one-time code only lasts a short time"
    },
    {
      "id": "relay",
      "kind": "server",
      "label": "Relay server",
      "value": "forwarding",
      "means": "Mallory's machine that passes everything to the real bank in real time"
    },
    {
      "id": "cookie",
      "kind": "ticket",
      "label": "Session cookie",
      "color": "#d98b2b",
      "means": "The pass a site hands out after sign-in, so it stops asking"
    },
    {
      "id": "nist",
      "kind": "card",
      "label": "NIST SP 800-63B",
      "title": "Typed codes",
      "text": "A code you type by hand is not phishing-resistant: nothing ties it to the real site.",
      "means": "The US standard for authentication, on why codes can be relayed"
    },
    {
      "id": "webauthn",
      "kind": "code",
      "label": "Passkey request",
      "title": "Sign in with a passkey",
      "lang": "JavaScript",
      "code": "navigator.credentials.get({\n  publicKey: {\n    rpId: \"mybank.example\",\n    challenge: freshBytes\n  }\n});\n// the browser offers only passkeys\n// made for this exact site",
      "highlight": [
        3,
        7
      ],
      "means": "The real site asks the browser for a passkey bound to its own name"
    },
    {
      "id": "shield",
      "kind": "shield",
      "label": "Phishing-resistant",
      "color": "#3f9b6a",
      "means": "MFA that a look-alike site cannot trick or relay"
    }
  ],
  "places": [
    {
      "id": "home",
      "set": "home",
      "name": "Sam's home"
    },
    {
      "id": "fake",
      "set": "bank",
      "name": "rnybank.example (fake)"
    },
    {
      "id": "real",
      "set": "bank",
      "name": "mybank.example (real)"
    },
    {
      "id": "lair",
      "set": "server-room",
      "name": "Mallory's relay"
    }
  ],
  "chapters": [
    {
      "id": "bait",
      "title": "The bait",
      "beats": [
        {
          "at": "home",
          "with": [
            "sam"
          ],
          "shot": "establishing",
          "caption": "Meet Sam. Sam banks online, signing in with a password.",
          "say": "Meet Sam. Like most of us, Sam banks online and signs in with a password.",
          "tone": "warm",
          "do": [
            {
              "act": "react",
              "who": "sam",
              "mood": "happy"
            }
          ]
        },
        {
          "with": [
            "sam",
            "pip"
          ],
          "caption": "An email arrives. It looks like it comes from Sam's bank.",
          "say": "One morning, an email lands. It looks like it's from Sam's bank.",
          "tone": "warm",
          "lines": [
            {
              "who": "pip",
              "text": "Delivery! This one's marked URGENT.",
              "mood": "happy"
            }
          ],
          "do": [
            {
              "act": "give",
              "who": "pip",
              "prop": "email",
              "to": "sam"
            }
          ],
          "focus": [
            "pip",
            "sam"
          ],
          "shot": "two-shot"
        },
        {
          "caption": "It threatens to close the account and gives a deadline. Pressure makes people skip checks.",
          "say": "Your account is locked. Fix it in twenty-four hours... or lose it. That's the hook. Panic makes you skip the checks.",
          "tone": "urgent",
          "do": [
            {
              "act": "open",
              "prop": "email"
            },
            {
              "act": "show",
              "prop": "notice",
              "to": "sam"
            },
            {
              "act": "react",
              "who": "sam",
              "mood": "worried"
            }
          ],
          "focus": "sam",
          "shot": "close-up",
          "lines": [
            {
              "who": "sam",
              "text": "Locked? I'd better sort this out now.",
              "mood": "worried"
            }
          ]
        },
        {
          "with": [
            "sam",
            "pip",
            "notice",
            "flags"
          ],
          "caption": "Three red flags: a threat, a rush, and a link that isn't quite the bank's address.",
          "say": "Slow down and count the red flags. A threat. A rush. And a link that isn't quite the bank's address.",
          "tone": "calm",
          "do": [
            {
              "act": "set",
              "prop": "flags",
              "value": "1"
            },
            {
              "act": "set",
              "prop": "flags",
              "value": "2"
            },
            {
              "act": "set",
              "prop": "flags",
              "value": "3"
            }
          ],
          "focus": [
            "flags",
            "notice"
          ],
          "shot": "medium"
        },
        {
          "caption": "Look closely: r-n-y-bank, not m-y-bank. Look-alike names are built to pass a quick glance.",
          "say": "Look again. It's r, n, y bank. Not m, y bank. Squint, and the r and the n become an m. That's the trick.",
          "tone": "wry",
          "do": [
            {
              "act": "point",
              "who": "sam",
              "to": "notice"
            },
            {
              "act": "react",
              "who": "sam",
              "mood": "thinking"
            }
          ],
          "focus": "notice",
          "shot": "close-up",
          "hold": 1
        }
      ],
      "takeaway": {
        "think": "Picture the last urgent message you got. What would have told you it was fake?",
        "seconds": 8,
        "points": [
          "Phishing is a message that pretends to come from someone you trust.",
          "Threats, deadlines and look-alike links are the red flags.",
          "Go to the site yourself instead of following the link."
        ]
      }
    },
    {
      "id": "fake-door",
      "title": "The fake door",
      "beats": [
        {
          "at": "fake",
          "with": [
            "sam",
            "mallory"
          ],
          "shot": "establishing",
          "caption": "Sam clicks the link anyway. The page looks exactly like the bank's sign-in.",
          "say": "Sam clicks anyway. And here's the thing... the page looks exactly like the bank's.",
          "tone": "serious",
          "lines": [
            {
              "who": "mallory",
              "text": "Welcome back! Just sign in as usual.",
              "mood": "smug",
              "tone": "wry"
            }
          ],
          "do": [
            {
              "act": "hide",
              "prop": "notice"
            },
            {
              "act": "hide",
              "prop": "email"
            }
          ]
        },
        {
          "caption": "Sam types the password. A copy lands with Mallory, who runs the fake site.",
          "say": "Sam types the password. And a copy lands right in Mallory's hands.",
          "tone": "serious",
          "do": [
            {
              "act": "show",
              "prop": "stolen",
              "to": "mallory"
            },
            {
              "act": "react",
              "who": "mallory",
              "mood": "smug"
            }
          ],
          "focus": [
            "sam",
            "mallory"
          ],
          "shot": "over-shoulder"
        },
        {
          "at": "real",
          "with": [
            "ward",
            "account",
            "mallory"
          ],
          "caption": "Mallory takes the password to the real bank and signs in as Sam.",
          "say": "Mallory walks it straight over to the real bank. And signs in as Sam.",
          "tone": "serious",
          "do": [
            {
              "act": "walk",
              "who": "mallory",
              "to": "ward"
            },
            {
              "act": "give",
              "who": "mallory",
              "prop": "stolen",
              "to": "ward"
            }
          ],
          "focus": [
            "mallory",
            "ward"
          ],
          "shot": "wide"
        },
        {
          "caption": "With a password alone, the bank can't tell Sam from Mallory. The account opens.",
          "say": "The password matches. The door opens. Why wouldn't it?",
          "tone": "wry",
          "do": [
            {
              "act": "open",
              "prop": "account"
            },
            {
              "act": "give",
              "who": "ward",
              "prop": "stolen",
              "to": "mallory"
            },
            {
              "act": "celebrate",
              "who": "mallory"
            }
          ],
          "lines": [
            {
              "who": "ward",
              "text": "Password matches. Welcome, Sam!",
              "mood": "happy"
            }
          ],
          "focus": [
            "account",
            "mallory"
          ],
          "shot": "medium"
        },
        {
          "with": [
            "ward",
            "mallory",
            "account",
            "rule"
          ],
          "caption": "The bank did nothing wrong. It checked the password, and the password was right.",
          "say": "Notice something. The bank didn't make a mistake. It checked the password... and the password was right.",
          "tone": "calm",
          "focus": "rule",
          "shot": "medium",
          "do": [
            {
              "act": "react",
              "who": "ward",
              "mood": "thinking"
            }
          ]
        }
      ],
      "takeaway": {
        "think": "The real bank worked as designed. Where exactly did the attack happen?",
        "points": [
          "A fake page collects whatever you type into it.",
          "A stolen password works for anyone who has it.",
          "So a password alone can't prove it's really you."
        ]
      }
    },
    {
      "id": "second-key",
      "title": "A second key",
      "beats": [
        {
          "at": "real",
          "with": [
            "ward",
            "account"
          ],
          "caption": "Sam spots the break-in. The bank locks Mallory out and Sam picks a new password.",
          "say": "Sam spots the break-in. The bank locks Mallory out, and Sam picks a new password.",
          "tone": "warm",
          "do": [
            {
              "act": "close",
              "prop": "account"
            }
          ],
          "focus": "account",
          "shot": "close-up"
        },
        {
          "at": "home",
          "with": [
            "sam",
            "phone"
          ],
          "shot": "establishing",
          "caption": "Sam turns on multi-factor authentication: sign-in now also needs a code from an app.",
          "say": "This time Sam turns on multi-factor authentication, or MFA. Signing in now also needs a code from an app on Sam's phone.",
          "tone": "warm",
          "do": [
            {
              "act": "take",
              "who": "sam",
              "prop": "phone"
            },
            {
              "act": "react",
              "who": "sam",
              "mood": "happy"
            }
          ]
        },
        {
          "with": [
            "sam",
            "phone",
            "timer"
          ],
          "caption": "The code changes every 30 seconds and lives only on Sam's phone.",
          "say": "The code changes every thirty seconds. And it only lives on that phone.",
          "tone": "calm",
          "focus": [
            "phone",
            "timer"
          ],
          "shot": "close-up",
          "do": [
            {
              "act": "set",
              "prop": "phone",
              "value": "903 554"
            }
          ]
        },
        {
          "at": "real",
          "with": [
            "ward",
            "mallory",
            "account"
          ],
          "caption": "Mallory phishes the new password the same way. But now the bank asks for the code too.",
          "say": "Mallory phishes the new password. Same trick as before. But now the bank wants the code too.",
          "tone": "serious",
          "do": [
            {
              "act": "walk",
              "who": "mallory",
              "to": "ward"
            }
          ],
          "lines": [
            {
              "who": "ward",
              "text": "Password's fine. Now the code from your phone?",
              "mood": "suspicious",
              "tone": "serious"
            },
            {
              "who": "mallory",
              "text": "Er... I left it at home.",
              "mood": "worried"
            }
          ],
          "focus": [
            "mallory",
            "ward"
          ],
          "shot": "two-shot"
        },
        {
          "caption": "No phone, no code, no entry. A stolen password alone is no longer enough.",
          "say": "No phone. No code. No way in.",
          "tone": "excited",
          "do": [
            {
              "act": "reject",
              "who": "ward",
              "to": "mallory"
            },
            {
              "act": "react",
              "who": "mallory",
              "mood": "angry"
            }
          ],
          "focus": "mallory",
          "shot": "low"
        },
        {
          "caption": "Attacks that reuse leaked or guessed passwords, even by the thousand, stop here.",
          "say": "And that's a big deal. Attackers who reuse leaked or guessed passwords, even thousands at a time... stop right here.",
          "tone": "excited",
          "do": [
            {
              "act": "crowd",
              "who": "mallory",
              "count": 5
            },
            {
              "act": "reject",
              "who": "ward",
              "to": "mallory"
            },
            {
              "act": "crowd",
              "who": "mallory",
              "count": 0
            }
          ],
          "focus": [
            "ward",
            "mallory"
          ],
          "shot": "wide"
        }
      ],
      "takeaway": {
        "think": "Which of your accounts would hurt most to lose? Those are the ones to protect first.",
        "points": [
          "MFA asks for a second proof that a thief usually doesn't have.",
          "A stolen password alone is no longer enough.",
          "Turn MFA on for email and banking first."
        ]
      }
    },
    {
      "id": "relay",
      "title": "The relay trick",
      "beats": [
        {
          "at": "lair",
          "with": [
            "mallory",
            "relay"
          ],
          "shot": "establishing",
          "caption": "Phishers adapt. Mallory's new fake site forwards everything to the real bank, live.",
          "say": "But phishers adapt. Mallory's new fake site forwards everything to the real bank as it happens. This is called an adversary-in-the-middle attack.",
          "tone": "serious",
          "do": [
            {
              "act": "link",
              "from": "relay",
              "to": "ward",
              "label": "live relay",
              "tone": "bad"
            }
          ],
          "lines": [
            {
              "who": "mallory",
              "text": "Let them type. I'll pass it all along.",
              "mood": "smug",
              "tone": "wry"
            }
          ]
        },
        {
          "at": "fake",
          "with": [
            "sam"
          ],
          "caption": "Sam signs in on the fake site. It asks for the password, then the code, just like the real one.",
          "say": "Sam signs in. The password... then the code from the phone. Just like always.",
          "tone": "warm",
          "do": [
            {
              "act": "set",
              "prop": "phone",
              "value": "275 118"
            },
            {
              "act": "link",
              "from": "phone",
              "to": "relay",
              "label": "password + code",
              "tone": "bad"
            }
          ],
          "lines": [
            {
              "who": "sam",
              "text": "Password, then my code: 275 118. Done!",
              "mood": "happy"
            }
          ],
          "focus": "sam",
          "shot": "medium"
        },
        {
          "at": "real",
          "with": [
            "ward",
            "mallory",
            "account",
            "timer"
          ],
          "caption": "Mallory replays both at the real bank within seconds, while the code is still valid.",
          "say": "Mallory replays both at the real bank, within seconds. The code's still fresh. So it works.",
          "tone": "urgent",
          "do": [
            {
              "act": "walk",
              "who": "mallory",
              "to": "ward"
            },
            {
              "act": "stamp",
              "who": "ward",
              "prop": "account",
              "text": "CODE OK",
              "tone": "good"
            },
            {
              "act": "open",
              "prop": "account"
            }
          ],
          "focus": [
            "mallory",
            "ward"
          ],
          "shot": "two-shot",
          "cut": true
        },
        {
          "caption": "The bank hands back a session cookie. Mallory is now signed in as Sam, MFA and all.",
          "say": "The bank hands back a session cookie. That's a pass that says, you're signed in. Now Mallory is Sam... MFA and all.",
          "tone": "serious",
          "do": [
            {
              "act": "show",
              "prop": "cookie",
              "to": "ward"
            },
            {
              "act": "give",
              "who": "ward",
              "prop": "cookie",
              "to": "mallory"
            },
            {
              "act": "celebrate",
              "who": "mallory"
            }
          ],
          "focus": [
            "cookie",
            "mallory"
          ],
          "shot": "medium"
        },
        {
          "with": [
            "ward",
            "mallory",
            "account",
            "nist"
          ],
          "caption": "A typed code can be typed anywhere, including on a fake site. Push prompts can be relayed too.",
          "say": "A code you type can be typed anywhere, including on a fake site. Approve-or-deny push prompts can be relayed the same way, so standards such as NIST's don't count either as phishing-resistant.",
          "tone": "calm",
          "focus": "nist",
          "shot": "medium",
          "do": [
            {
              "act": "react",
              "who": "ward",
              "mood": "worried"
            }
          ]
        }
      ],
      "takeaway": {
        "think": "What would have to change so that the code is useless on the fake site?",
        "points": [
          "Codes and push prompts help, but a live relay can steal them.",
          "The weak spot: a person has to judge which site is real.",
          "Phishing-resistant MFA takes that judgement off the person."
        ]
      }
    },
    {
      "id": "passkey",
      "title": "A key that knows the door",
      "beats": [
        {
          "at": "home",
          "with": [
            "sam",
            "kiro"
          ],
          "shot": "establishing",
          "caption": "Sam switches to a passkey: a key kept on the phone and made for mybank.example only.",
          "say": "So Sam tries something different. A passkey. It lives on the phone... and it's made for one site only.",
          "tone": "warm",
          "lines": [
            {
              "who": "kiro",
              "text": "I open exactly one door: mybank.example.",
              "mood": "happy"
            }
          ],
          "do": [
            {
              "act": "unlink",
              "from": "relay",
              "to": "ward"
            },
            {
              "act": "unlink",
              "from": "phone",
              "to": "relay"
            },
            {
              "act": "hide",
              "prop": "cookie"
            },
            {
              "act": "close",
              "prop": "account"
            }
          ]
        },
        {
          "at": "fake",
          "with": [
            "sam",
            "kiro",
            "mallory"
          ],
          "caption": "On the fake site the browser checks the address. No passkey matches, so nothing is offered.",
          "say": "Back on the fake site, the browser checks the address itself. No match? Then there's simply nothing to hand over.",
          "tone": "wry",
          "do": [
            {
              "act": "walk",
              "who": "kiro",
              "to": "mallory"
            },
            {
              "act": "react",
              "who": "kiro",
              "mood": "suspicious"
            }
          ],
          "lines": [
            {
              "who": "kiro",
              "text": "You're rnybank, not mybank. I have nothing for you.",
              "mood": "suspicious",
              "tone": "serious"
            },
            {
              "who": "mallory",
              "text": "But... the page looks identical!",
              "mood": "surprised"
            }
          ],
          "focus": [
            "kiro",
            "mallory"
          ],
          "shot": "two-shot"
        },
        {
          "with": [
            "sam",
            "kiro",
            "mallory",
            "webauthn"
          ],
          "caption": "In code: the site names itself, and the browser, not the person, enforces the match.",
          "say": "Here's what that looks like in code. The site says who it is. And the browser, not you, makes sure that's true.",
          "tone": "calm",
          "focus": "webauthn",
          "shot": "medium",
          "hold": 2
        },
        {
          "at": "real",
          "with": [
            "ward",
            "sam",
            "kiro",
            "account"
          ],
          "caption": "On the real site the passkey signs a fresh challenge. Sam is in, with no code to type.",
          "say": "On the real site, the passkey signs a fresh challenge. Sam's in. No code to type.",
          "tone": "excited",
          "do": [
            {
              "act": "walk",
              "who": "kiro",
              "to": "ward"
            },
            {
              "act": "open",
              "prop": "account"
            },
            {
              "act": "celebrate",
              "who": "sam"
            }
          ],
          "focus": [
            "kiro",
            "ward"
          ],
          "shot": "two-shot"
        },
        {
          "at": "lair",
          "with": [
            "mallory",
            "relay"
          ],
          "caption": "Mallory's relay gets nothing reusable: the answer is tied to the real site and to this one sign-in.",
          "say": "And Mallory's relay? It gets nothing it can reuse. The answer only works for the real site, and only this once.",
          "tone": "wry",
          "do": [
            {
              "act": "set",
              "prop": "relay",
              "value": "nothing to relay"
            },
            {
              "act": "react",
              "who": "mallory",
              "mood": "sad"
            }
          ],
          "focus": "mallory",
          "shot": "crane-up"
        },
        {
          "at": "real",
          "with": [
            "ward",
            "sam",
            "kiro",
            "account",
            "shield"
          ],
          "caption": "That is phishing-resistant MFA: passkeys and security keys, built on FIDO2 and WebAuthn.",
          "say": "That's phishing-resistant MFA. Passkeys and security keys, built on FIDO2 and WebAuthn.",
          "tone": "warm",
          "do": [
            {
              "act": "show",
              "prop": "shield",
              "to": "kiro"
            },
            {
              "act": "react",
              "who": "ward",
              "mood": "happy"
            }
          ],
          "focus": [
            "shield",
            "kiro"
          ],
          "shot": "medium"
        }
      ],
      "takeaway": {
        "think": "Name two accounts where you could switch to a passkey this week.",
        "points": [
          "Passkeys and security keys (FIDO2, WebAuthn) are phishing-resistant MFA.",
          "They work only on the real site, so a look-alike gets nothing.",
          "Where there's no passkey, an authenticator app still beats a password alone."
        ]
      }
    }
  ],
  "recap": {
    "title": "Key takeaways",
    "points": [
      "Phishing tricks you into handing secrets to a look-alike site.",
      "A password alone can be copied and reused by anyone who has it.",
      "MFA stops stolen passwords, but typed codes and push prompts can be relayed live.",
      "Passkeys and security keys are bound to the real site, so a fake one gets nothing.",
      "Type the address yourself, and report phishing instead of clicking."
    ]
  },
  "next": "Next: Part 2, what to do in the first hour after you click a phishing link",
  "sources": [
    {
      "title": "NIST SP 800-63B-4: Digital Identity Guidelines, Authentication and Authenticator Management",
      "url": "https://pages.nist.gov/800-63-4/sp800-63b.html",
      "note": "Phishing resistance; manually entered codes are not phishing-resistant"
    },
    {
      "title": "CISA: Implementing Phishing-Resistant MFA (fact sheet, 2022)",
      "url": "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf",
      "note": "FIDO/WebAuthn as the widely available phishing-resistant option"
    },
    {
      "title": "CISA: Implementing Number Matching in MFA Applications",
      "url": "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implement-number-matching-in-mfa-applications-508c.pdf",
      "note": "Push fatigue, and number matching as an interim step"
    },
    {
      "title": "CISA: Recognize and Report Phishing",
      "url": "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing",
      "note": "Red flags: urgency, unexpected senders, look-alike links"
    },
    {
      "title": "OWASP Multifactor Authentication Cheat Sheet",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html",
      "note": "Factor types and their weaknesses"
    },
    {
      "title": "W3C Web Authentication (WebAuthn) Level 2",
      "url": "https://www.w3.org/TR/webauthn-2/",
      "note": "Relying party ID and origin binding of credentials"
    }
  ]
}
```
