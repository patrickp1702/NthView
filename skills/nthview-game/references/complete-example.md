# Game complete example

A 31-level cybersecurity game, one level per activity type, with world dressing for all three games; it is the data of `examples/example.html` (islands), `examples/example-runner.html` and `examples/example-stealth.html`, which differ only in `game`.

```json
{
  "schemaVersion": 1,
  "title": "Cyber Watch",
  "subtitle": "Thirty-one short lessons on staying safe online",
  "game": "islands",
  "strictMode": false,
  "hero": { "name": "Kai" },
  "lives": 3,
  "intro": {
    "paragraphs": [
      "Kai has just joined the cyber watch: the people who keep a small company's accounts, laptops and files safe.",
      "Every level is one short lesson about a real threat or a real defence, then one question or task about it. Read first; nothing moves until you are ready."
    ],
    "steps": [
      "Read the lesson. The game waits for you.",
      "Answer the question or play the task. A wrong answer is explained, never a dead end.",
      "Keep the one-line takeaway. They all come back in the report."
    ],
    "note": "Figures on second steps come from Google's 2019 study of account takeovers; the rest is standard practice."
  },
  "levels": [
    {
      "id": "phishing",
      "name": "The Locked Account",
      "lead": "**Phishing** is a message that pretends to come from someone you trust, so that you click, pay or type a password. It works by hurry and fear: your account is locked, your parcel is stuck, your boss needs this now.",
      "body": ["The safe habit is simple: never use the link in the message. Open the app, or type the address you already know."],
      "activity": {
        "type": "choice",
        "title": "What do you do?",
        "question": "An email from 'your bank' says your account is locked and asks you to log in through its link. What is the safest move?",
        "options": [
          { "text": "Open the bank's app, or type its address yourself", "correct": true },
          { "text": "Use the link, but check for the padlock first", "why": "A padlock only means the connection is encrypted. A fake site can have one too." },
          { "text": "Reply and ask whether the email is real", "why": "Your reply goes straight to whoever sent it." },
          { "text": "Forward it to your friends as a warning", "why": "That spreads the link to people who might click it." }
        ],
        "okText": "Right: go to the bank by a road you already know."
      },
      "checks": [
        { "type": "truefalse", "statement": "A message that uses your name cannot be phishing.", "answer": false, "why": "Your name is easy to find. It proves nothing about the sender." }
      ],
      "remember": "Never log in through a link you were sent. Go there yourself."
    },
    {
      "id": "passphrase",
      "name": "Length Beats Tricks",
      "color": "#2f7fd8",
      "lead": "A password is hard to guess when there are a great many possible ones of its kind. **Length** adds far more than swapping letters for symbols: attackers try 'P@ssw0rd' style tricks first.",
      "body": ["Four or five random words make a **passphrase**: long, yet easy to remember."],
      "activity": {
        "type": "lanes",
        "prompt": "Which password is the hardest to guess?",
        "options": [
          { "id": "symbols", "label": "P@ssw0rd!", "hint": "Common words with swapped symbols are among the first guesses." },
          { "id": "season", "label": "Summer2024", "hint": "A season and a year: guessing lists are full of them." },
          { "id": "words", "label": "lamp cactus jet", "hint": "Random words, and long." }
        ],
        "answer": "words"
      },
      "aside": { "title": "Random means random", "text": "A line from a song or a famous quote is not random. Pick words by rolling dice or let a password manager choose." },
      "remember": "Long beats clever: use random words, not swapped symbols."
    },
    {
      "id": "manager",
      "name": "One Key, Many Locks",
      "lead": "Nobody can remember a different strong password for every site, so most people reuse one. A **password manager** remembers them for you: you learn one strong master password, and it creates and fills a unique one everywhere else.",
      "activity": {
        "type": "truefalse",
        "statement": "With a password manager, one strong master password protects many unique ones.",
        "answer": true,
        "why": "That is the whole idea: one thing to remember, nothing reused.",
        "trueLabel": "True",
        "falseLabel": "False"
      },
      "remember": "Let a password manager make a unique password for every site."
    },
    {
      "id": "alert",
      "name": "The Sign-in Alert",
      "lead": "An unexpected 'new sign-in' alert can be real, or it can be phishing dressed as a warning. Either way, the order of what you do matters.",
      "activity": {
        "type": "order",
        "prompt": "Put the steps in order after an unexpected sign-in alert.",
        "items": [
          { "text": "Do not use any link in the alert", "note": "It may be fake." },
          { "text": "Open the account yourself, by app or typed address" },
          { "text": "Change the password", "note": "Use a new, unique one." },
          { "text": "Turn on two-step verification" },
          { "text": "Check recent activity and connected devices" }
        ]
      },
      "remember": "Go in by your own road, change the password, add a second step, then look around."
    },
    {
      "id": "second-step",
      "name": "The Second Step",
      "lead": "**Two-step verification** asks for something more than the password: a code, a tap on your phone or a small **security key**. A stolen password alone is then not enough.",
      "body": ["Not every second step is equally strong. Codes by text message can be stolen by moving your number to a new SIM card, and codes of any kind can be typed into a fake site."],
      "activity": {
        "type": "gates",
        "prompt": "Which second step is hardest for an attacker to steal?",
        "paths": [
          { "id": "sms", "label": "SMS code", "hint": "Texts can be redirected by SIM swapping." },
          { "id": "app", "label": "Authenticator", "hint": "Strong, but its codes can still be typed into a fake site." },
          { "id": "key", "label": "Security key", "hint": "It checks the real site's address, so a fake site gets nothing." }
        ],
        "answer": "key"
      },
      "remember": "Any second step helps; a security key is the hardest to steal."
    },
    {
      "id": "toolkit",
      "name": "The Toolkit",
      "lead": "Defence is a set of tools, each with one job. Knowing which does what keeps you from expecting one tool to do everything.",
      "activity": {
        "type": "match",
        "prompt": "Match each tool to its job.",
        "pairs": [
          { "left": "Firewall", "right": "Filters traffic in and out of a network" },
          { "left": "Antivirus", "right": "Finds and stops known malware" },
          { "left": "Backup", "right": "Brings files back after a loss" },
          { "left": "VPN", "right": "Encrypts your traffic on an untrusted network" }
        ]
      },
      "remember": "Each tool has one job; you need several."
    },
    {
      "id": "read-link",
      "name": "Reading a Link",
      "lead": "The address of a site is read from the right: the part just before the first single slash decides where you really go. Everything to its left is decoration that anyone can choose.",
      "body": ["In login.example-bank.com.evil.io, the site is **evil.io**. The bank's name is only a disguise."],
      "activity": {
        "type": "hotspot",
        "prompt": "Tap the part of https://login.example-bank.com.evil.io/account that decides which site you reach.",
        "parts": [
          { "id": "scheme", "label": "https://", "shape": "rect", "x": 2, "y": 22, "w": 16, "h": 16, "hint": "This says how to connect, not where." },
          { "id": "sub", "label": "login.", "shape": "rect", "x": 20, "y": 22, "w": 13, "h": 16, "hint": "A label anyone can add in front of their own domain." },
          { "id": "decoy", "label": "example-bank.com.", "shape": "rect", "x": 35, "y": 22, "w": 30, "h": 16, "hint": "A disguise: it is just more labels in front." },
          { "id": "domain", "label": "evil.io", "shape": "rect", "x": 67, "y": 22, "w": 15, "h": 16, "color": "#d9534f", "hint": "This is the real site." },
          { "id": "path", "label": "/account", "shape": "circle", "x": 91, "y": 30, "r": 7, "hint": "A page on the site, after the address." }
        ],
        "answer": "domain",
        "links": [ { "from": "sub", "to": "decoy" }, { "from": "decoy", "to": "domain" } ]
      },
      "remember": "Read the address from the right: the end of the name is the site."
    },
    {
      "id": "warning-signs",
      "name": "Warning Signs",
      "lead": "Phishing messages share a few tells. None proves anything alone, but each is a reason to slow down and check another way.",
      "activity": {
        "type": "multi",
        "question": "Which of these are warning signs?",
        "options": [
          { "text": "It demands action within the hour", "correct": true },
          { "text": "It carries an attachment you did not expect", "correct": true },
          { "text": "The sender's address does not match the company", "correct": true },
          { "text": "It greets you by your first name", "why": "Attackers often know your name. It is not a sign either way." },
          { "text": "It arrived during working hours", "why": "Phishing arrives at any hour." }
        ]
      },
      "remember": "Hurry, surprise attachments and odd senders mean: check another way."
    },
    {
      "id": "backup-plan",
      "name": "A Backup Plan",
      "lead": "A backup only counts if you can get the files back when everything else is gone. That means a copy that malware cannot reach, made without anyone remembering to, and tested.",
      "activity": {
        "type": "torches",
        "prompt": "Light the lamps for what a good backup plan includes.",
        "items": [
          { "id": "offline", "label": "Offline copy", "lit": true },
          { "id": "tested", "label": "Test restores", "lit": true },
          { "id": "automatic", "label": "Auto schedule", "lit": true },
          { "id": "same-disk", "label": "Same disk only", "lit": false },
          { "id": "one-copy", "label": "One copy only", "lit": false }
        ]
      },
      "remember": "Back up automatically, keep a copy offline, and test that it restores."
    },
    {
      "id": "three-two-one",
      "name": "Three, Two, One",
      "lead": "The **3-2-1 rule** is an easy way to remember a sturdy backup: several copies, on different kinds of storage, with one of them somewhere else.",
      "activity": {
        "type": "cloze",
        "text": "Keep ___ copies of your data, on ___ different kinds of storage, with ___ copy kept off site.",
        "gaps": [
          { "options": ["3", "2", "5"], "answer": 0 },
          { "options": ["2", "1", "4"], "answer": 0 },
          { "options": ["1", "no", "every"], "answer": 0 }
        ]
      },
      "remember": "3 copies, 2 kinds of storage, 1 off site."
    },
    {
      "id": "kinds-of-attack",
      "name": "Kinds of Attack",
      "lead": "Attacks come in by different doors. **Phishing** tricks you on a screen, **malware** is software that does harm once it runs, and **phone scams** use a voice to rush you.",
      "activity": {
        "type": "sort",
        "prompt": "Put each attack in its group.",
        "buckets": [
          { "id": "phishing", "label": "Phishing" },
          { "id": "malware", "label": "Malware" },
          { "id": "phone", "label": "Phone scam" }
        ],
        "items": [
          { "text": "A fake login page that copies your bank", "bucket": "phishing" },
          { "text": "Ransomware that locks your files", "bucket": "malware" },
          { "text": "A caller from 'tech support' who wants remote access", "bucket": "phone" },
          { "text": "A keylogger that records what you type", "bucket": "malware" },
          { "text": "A text saying your parcel is held, with a link", "bucket": "phishing" },
          { "text": "A voice like your manager's asking for an urgent transfer", "bucket": "phone" }
        ]
      },
      "remember": "Screens, software and voices: three doors, one rule of slowing down."
    },
    {
      "id": "public-wifi",
      "name": "Café Wi-Fi",
      "lead": "On an open network, other people share the same air. Most sites now encrypt their traffic, but the network itself can be fake, and a name proves nothing.",
      "activity": {
        "type": "planks",
        "prompt": "True or false about public Wi-Fi?",
        "planks": [
          { "text": "Anyone can name a hotspot 'Café Free WiFi'", "answer": true },
          { "text": "A padlock means the site is honest", "answer": false, "why": "It means the connection is encrypted, nothing more." },
          { "text": "A VPN hides your traffic from the café's network", "answer": true },
          { "text": "Open networks are safe for banking without a VPN", "answer": false, "why": "Use mobile data or a VPN for anything sensitive." }
        ]
      },
      "remember": "On public Wi-Fi, trust no network name; use mobile data or a VPN."
    },
    {
      "id": "combinations",
      "name": "Counting Guesses",
      "lead": "Strength is counting: how many passwords of this kind exist? Every extra character multiplies the count, so length grows it fastest.",
      "activity": {
        "type": "rank",
        "prompt": "Rank from the most possible combinations (top) to the fewest.",
        "items": [
          { "text": "4 random words from a list of 7,776", "value": 100, "show": "3.7×10¹⁵" },
          { "text": "8 lowercase letters", "value": 73, "show": "2.1×10¹¹" },
          { "text": "6-digit PIN", "value": 39, "show": "1,000,000" },
          { "text": "4-digit PIN", "value": 26, "show": "10,000" }
        ],
        "caption": "The bars use a log scale: each step up is ten times more."
      },
      "findings": {
        "caption": "Combinations, on a log scale",
        "rows": [
          { "label": "4-digit PIN", "value": 26, "show": "10⁴", "style": "grey" },
          { "label": "8 lowercase letters", "value": 73, "show": "10¹¹", "style": "dashed" },
          { "label": "4 random words", "value": 100, "show": "10¹⁵", "style": "normal" }
        ],
        "text": "Each extra character or word multiplies the count; that is why length wins.",
        "after": true
      },
      "remember": "Every extra character multiplies the work for an attacker."
    },
    {
      "id": "offline-guessing",
      "name": "A Billion a Second",
      "lead": "When a site is breached, attackers may get its stored password data and guess offline, at billions of tries per second, with no lockout to stop them.",
      "activity": {
        "type": "estimate",
        "question": "A 6-letter lowercase password has 26⁶, about 309 million, possibilities. At a billion guesses a second, about how many seconds to try them all?",
        "min": 0,
        "max": 10,
        "answer": 0.3,
        "tolerance": 0.3,
        "step": 0.1,
        "unit": "s",
        "reveal": "About a third of a second. Short passwords fall instantly offline."
      },
      "remember": "Offline, short passwords fall in moments; only length holds out."
    },
    {
      "id": "pin-maths",
      "name": "PIN Maths",
      "lead": "A PIN is safe on a phone or card only because the device locks after a few wrong tries. Count the possibilities to see why the lockout matters.",
      "activity": {
        "type": "number",
        "question": "How many different 4-digit PINs are there, from 0000 to 9999?",
        "answer": 10000,
        "tolerance": 0,
        "unit": "PINs",
        "reveal": "Ten choices for each of four digits: 10 × 10 × 10 × 10 = 10,000."
      },
      "remember": "A short PIN is safe only because of the lockout."
    },
    {
      "id": "ransomware",
      "name": "Files Held Hostage",
      "lead": "Some malware encrypts every file it can reach and demands payment for the key. Paying is no guarantee of getting the files back, and it funds the next attack. A tested offline backup is the real cure.",
      "activity": {
        "type": "text",
        "question": "What is the name for malware that encrypts your files and demands payment?",
        "answer": "ransomware",
        "accept": ["ransom ware", "ransomware attack"],
        "placeholder": "One word",
        "reveal": "Ransomware: the ransom is for the key to your own files."
      },
      "remember": "Ransomware is beaten by a tested backup it cannot reach."
    },
    {
      "id": "good-habits",
      "name": "Good Habits",
      "lead": "Most break-ins use old doors: reused passwords, missing updates, shared logins. Good habits close them before anyone tries.",
      "activity": {
        "type": "harvest",
        "prompt": "Pick up the habits that keep accounts safe; leave the rest.",
        "items": [
          { "label": "Unique pwds", "belongs": true },
          { "label": "2-step login", "belongs": true },
          { "label": "Auto updates", "belongs": true },
          { "label": "Reused pwd", "belongs": false },
          { "label": "Shared login", "belongs": false },
          { "label": "Old browser", "belongs": false }
        ]
      },
      "remember": "Unique passwords, a second step and updates close the old doors."
    },
    {
      "id": "odd-one",
      "name": "The Odd One Out",
      "lead": "Phishing has cousins named after the channel: **smishing** by text message and **vishing** by voice. They are all the same trick.",
      "activity": {
        "type": "odd",
        "prompt": "Which one is not a kind of phishing?",
        "items": ["Phishing", "Smishing", "Vishing", "Firewall"],
        "answer": 3,
        "why": "The first three are tricks by email, text and voice; a firewall is a defence."
      },
      "remember": "Email, text or voice: the trick is the same."
    },
    {
      "id": "incident",
      "name": "When It Happens",
      "lead": "Teams handle incidents in phases, so nobody skips a step in the rush. Preparation comes before anything happens; recovery comes last.",
      "activity": {
        "type": "levers",
        "prompt": "Step on the phases of incident response in order.",
        "items": [
          { "id": "prepare", "label": "Prepare" },
          { "id": "detect", "label": "Detect" },
          { "id": "contain", "label": "Contain" },
          { "id": "eradicate", "label": "Eradicate" },
          { "id": "recover", "label": "Recover" }
        ]
      },
      "remember": "Prepare, detect, contain, eradicate, recover."
    },
    {
      "id": "data-labels",
      "name": "Labels on Data",
      "lead": "Not all data needs the same care. Labelling it tells everyone how carefully to handle it: public, internal or confidential.",
      "activity": {
        "type": "tiles",
        "prompt": "Carry each item to the bin of its label.",
        "bins": [
          { "id": "public", "label": "Public" },
          { "id": "internal", "label": "Internal" },
          { "id": "confidential", "label": "Confidential" }
        ],
        "items": [
          { "label": "Blog post", "bin": "public" },
          { "label": "Org chart", "bin": "internal" },
          { "label": "Passwords", "bin": "confidential" },
          { "label": "Payroll", "bin": "confidential" },
          { "label": "Office map", "bin": "internal" },
          { "label": "Ad poster", "bin": "public" }
        ]
      },
      "remember": "Label data, and handle it as its label says."
    },
    {
      "id": "second-step-data",
      "name": "What the Study Found",
      "lead": "In 2019 Google measured how well different second steps stopped account takeovers. Every kind helped against bulk phishing; against targeted attacks the differences were large.",
      "activity": {
        "type": "pads",
        "prompt": "Grey: share of bulk phishing stopped. Colour: share of targeted attacks stopped. Which second step stopped the most targeted attacks?",
        "options": [
          { "id": "sms", "label": "SMS code", "bars": [96, 76], "hint": "Good against bulk phishing, weaker against targeted attacks." },
          { "id": "prompt", "label": "Phone prompt", "bars": [99, 90], "hint": "Strong, but not the strongest." },
          { "id": "key", "label": "Security key", "bars": [100, 100], "size": 1.2, "hint": "It stopped all of them." }
        ],
        "answer": "key"
      },
      "remember": "A security key stopped every targeted attack in the study."
    },
    {
      "id": "plugged-backup",
      "name": "The Plugged-in Backup",
      "lead": "Malware runs with your rights. Whatever you can change, it can change, including a backup drive that stays plugged in.",
      "activity": {
        "type": "predict",
        "question": "Ransomware hits a laptop whose only backup is a drive that is always plugged in. What happens to the backup?",
        "options": [
          { "text": "It is encrypted too", "correct": true },
          { "text": "It stays safe because it is a separate drive", "why": "Separate, but reachable. That is enough." },
          { "text": "It deletes itself to protect the files", "why": "Drives do not defend themselves." }
        ],
        "runLabel": "Run the attack",
        "frames": [
          "The malware starts, with the user's rights.",
          "It lists every drive the user can write to, the backup included.",
          "It encrypts them all."
        ],
        "result": "A backup the malware can reach is not a backup. Keep one copy offline."
      },
      "remember": "Unplug one backup: what malware can reach, it can lock."
    },
    {
      "id": "padlock",
      "name": "The Padlock",
      "lead": "The padlock in the address bar means the connection is encrypted: nobody in between can read or change what you send. It says nothing about who runs the site; fake sites get padlocks for free.",
      "activity": {
        "type": "confidence",
        "question": "What does the padlock in the address bar tell you?",
        "options": [
          { "text": "The connection to this site is encrypted", "correct": true },
          { "text": "The site is honest", "why": "Fake sites have padlocks too." },
          { "text": "The site belongs to a bank or a shop", "why": "A padlock does not say who owns the site." }
        ]
      },
      "remember": "A padlock means encrypted, not trustworthy."
    },
    {
      "id": "reuse",
      "name": "One Leak, Every Lock",
      "lead": "Sites get breached. If you reuse a password, one leak opens every account that shares it, because attackers try leaked passwords everywhere, automatically.",
      "activity": {
        "type": "compare",
        "prompt": "Flip between one reused password and unique ones.",
        "before": {
          "label": "One password everywhere",
          "text": "A shop you used once is breached. The same password opens your email, bank and work account.",
          "rows": [ { "label": "Accounts open after one leak", "value": 100, "show": "All" } ]
        },
        "after": {
          "label": "Unique passwords",
          "text": "The same shop is breached. Only that shop's password is out, and you change it.",
          "rows": [ { "label": "Accounts open after one leak", "value": 10, "show": "One" } ]
        },
        "caption": "Attackers try leaked passwords on many sites at once: this is called credential stuffing."
      },
      "quiz": {
        "question": "Why does a leak at one small site matter to your email account?",
        "options": [
          { "text": "Because reused passwords are tried everywhere", "correct": true },
          { "text": "Because sites share passwords with each other", "why": "They do not; attackers simply try the leaked ones." },
          { "text": "It does not matter at all", "why": "It matters whenever a password is reused." }
        ]
      },
      "remember": "A reused password turns one leak into many."
    },
    {
      "id": "study-guess",
      "name": "Guess the Numbers",
      "lead": "Before you see the study's numbers, guess them. Guessing first makes the real numbers stick.",
      "activity": {
        "type": "bars",
        "prompt": "Set each bar to your guess: what share of attacks did a second step stop in Google's 2019 study?",
        "items": [
          { "label": "SMS code against bulk phishing", "value": 96, "show": "96%" },
          { "label": "SMS code against targeted attacks", "value": 76, "show": "76%" },
          { "label": "Security key against targeted attacks", "value": 100, "show": "100%" }
        ],
        "revealText": "Even the weakest second step stopped most attacks.",
        "buttonLabel": "Show the study's numbers"
      },
      "quiz": {
        "question": "What does the study say about a text-message code?",
        "options": [
          { "text": "Far better than nothing, weaker than a key", "correct": true },
          { "text": "Useless, so not worth turning on", "why": "It stopped 96% of bulk phishing." },
          { "text": "As strong as a security key", "why": "Against targeted attacks it stopped 76%, the key 100%." }
        ]
      },
      "remember": "Any second step beats none; keys beat codes."
    },
    {
      "id": "layers",
      "name": "Layers",
      "lead": "No single defence is perfect, so we stack them: **defence in depth**. When one layer fails, the next one still stands.",
      "activity": {
        "type": "switches",
        "prompt": "Turn the defences on and off and read the status.",
        "switches": [
          { "id": "mfa", "label": "Two-step login", "on": false },
          { "id": "updates", "label": "Automatic updates", "on": true },
          { "id": "backup", "label": "Offline backup", "on": false }
        ],
        "readout": [
          { "when": "mfa && updates && backup", "text": "Well defended: each layer covers the others' gaps.", "tone": "ok" },
          { "when": "!backup", "text": "Ransomware would cost you your files.", "tone": "no" },
          { "when": "!mfa", "text": "A stolen password opens the account.", "tone": "no" },
          { "text": "Better, but a gap remains.", "tone": "note" }
        ],
        "caption": "Real security is several layers, each one cheap."
      },
      "quiz": {
        "question": "Why stack several defences?",
        "options": [
          { "text": "So one failing layer is not the end", "correct": true },
          { "text": "Because each layer is useless alone", "why": "Each helps; together they cover each other's gaps." },
          { "text": "To slow the computer down", "why": "Good layers cost little speed." }
        ]
      },
      "remember": "Stack defences: when one fails, the next still holds."
    },
    {
      "id": "terms",
      "name": "Words to Know",
      "lead": "A few words come up again and again. Flip through them until each feels familiar.",
      "activity": {
        "type": "flashcards",
        "prompt": "Flip each card, then say the meaning before you look.",
        "cards": [
          { "front": "Patch", "back": "An update that fixes a security flaw." },
          { "front": "Two-step verification", "back": "A second proof besides the password, such as a key or an app." },
          { "front": "Credential stuffing", "back": "Trying leaked passwords on many other sites." },
          { "front": "Encryption", "back": "Scrambling data so only someone with the key can read it." }
        ]
      },
      "quiz": {
        "question": "What is a patch?",
        "options": [
          { "text": "An update that fixes a flaw", "correct": true },
          { "text": "A kind of malware", "why": "A patch is the cure, not the disease." },
          { "text": "A backup of your files", "why": "That is a backup." }
        ]
      },
      "remember": "Patches fix flaws: install them soon."
    },
    {
      "id": "lena",
      "name": "Lena's Monday",
      "lead": "Most incidents start small and quiet. Follow one, step by step.",
      "activity": {
        "type": "story",
        "buttonLabel": "What happened next?",
        "resetLabel": "Start over",
        "frames": [
          "Lena gets an email: 'Your mailbox is full. Log in here to keep your messages.'",
          "She logs in on the page it links to. It looks just like the real one.",
          "An hour later, her contacts get the same email, sent from her account.",
          "Her password was reused: the attackers also open her online shop account.",
          "IT resets her passwords and turns on two-step verification. The spread stops."
        ],
        "caption": "One click, one reused password, many accounts."
      },
      "quiz": {
        "question": "Which single change would have stopped the spread at the start?",
        "options": [
          { "text": "Two-step verification on her email", "correct": true },
          { "text": "A longer email signature", "why": "That does nothing for security." },
          { "text": "A bigger mailbox", "why": "The full mailbox was only the bait." }
        ]
      },
      "remember": "A second step turns a stolen password into a dead end."
    },
    {
      "id": "password-lab",
      "name": "The Password Lab",
      "lead": "Try lengths and character types and watch the strength change. Notice which control moves the result most.",
      "activity": {
        "type": "tune",
        "controls": [
          { "id": "len", "label": "Password length", "min": 4, "max": 20, "value": 8 },
          { "id": "kinds", "label": "Kinds of character (1 to 4)", "min": 1, "max": 4, "value": 1 }
        ],
        "readout": [
          { "when": "len >= 14", "text": "{len} characters: strong against offline guessing." },
          { "when": "len >= 10", "text": "{len} characters: getting there; a few more help a lot." },
          { "text": "{len} characters: too short, whatever the symbols." }
        ],
        "visual": { "kind": "grid", "count": "kinds * 2", "extra": "len / 4", "leader": true },
        "tally": { "count": "len", "icon": "🔑", "max": 20 },
        "outcomes": {
          "buttonLabel": "Test the password",
          "cases": [
            { "when": "len >= 14", "text": "It holds: length did the work.", "tone": "ok" },
            { "when": "len >= 10 && kinds >= 3", "text": "It holds for now. Longer would be safer.", "tone": "note" }
          ],
          "fallback": { "text": "Cracked. Add length first.", "tone": "no" }
        },
        "caption": "Length moves the result far more than adding symbols."
      },
      "quiz": {
        "question": "Which change makes a password stronger fastest?",
        "options": [
          { "text": "Making it longer", "correct": true },
          { "text": "Swapping a letter for a symbol", "why": "It helps a little; length helps a lot." },
          { "text": "Adding the current year", "why": "Years are among the first guesses." }
        ]
      },
      "remember": "Length first, then variety."
    },
    {
      "id": "crack-race",
      "name": "The Cracking Race",
      "lead": "Picture an attacker with a stolen password file, guessing a billion times a second. Watch how long each kind of password lasts.",
      "activity": {
        "type": "race",
        "buttonLabel": "Start the race",
        "bars": [
          { "label": "6 lowercase letters", "value": 5, "show": "0.3 s", "tag": "6 letters" },
          { "label": "8 mixed characters", "value": 40, "show": "~70 days", "tag": "8 mixed" },
          { "label": "5 random words", "value": 100, "show": "~900 years", "tag": "5 words" }
        ],
        "caption": "At a billion guesses a second. Longer bars last longer."
      },
      "quiz": {
        "question": "What made the last password last centuries?",
        "options": [
          { "text": "Its length", "correct": true },
          { "text": "Its symbols", "why": "It had none: only words." },
          { "text": "Luck", "why": "It is arithmetic, not luck." }
        ]
      },
      "remember": "Five random words outlast any short clever password."
    },
    {
      "id": "team-vote",
      "name": "The Team Vote",
      "lead": "Kai asks the team which habit they find hardest. Each token is one vote: **P** for passwords, **U** for updates, **B** for backups.",
      "activity": {
        "type": "collect",
        "prompt": "Collect every vote, then see what the team said.",
        "items": ["P", "P", "U", "P", "B", "P", "U"],
        "resultTitle": "The team's vote",
        "resultText": "{top} won with {count} of {total} votes.",
        "resultNote": "Passwords are where most teams start, and a password manager is the easy win."
      },
      "quiz": {
        "question": "Most votes went to passwords. What is the easiest first step for the team?",
        "options": [
          { "text": "Give everyone a password manager", "correct": true },
          { "text": "Ask everyone to change passwords monthly", "why": "Forced frequent changes lead to weak, predictable passwords." },
          { "text": "Write passwords on a shared sheet", "why": "That puts them all in one leakable place." }
        ]
      },
      "remember": "Start with passwords: a manager makes good ones easy."
    }
  ],
  "finale": {
    "name": "The Final Check",
    "lead": "Five questions from everything you have learned. Each right answer brings Kai one step closer to the watch badge.",
    "ask": 5,
    "questions": [
      {
        "question": "A message rushes you to log in through its link. What do you do?",
        "options": [
          { "text": "Go to the site by your own road", "correct": true },
          { "text": "Click quickly before it expires", "why": "Hurry is the trick." }
        ]
      },
      {
        "question": "Which password is strongest?",
        "options": [
          { "text": "Five random words", "correct": true },
          { "text": "Tr0ub4dor!", "why": "Short and full of common swaps." },
          { "text": "Your pet's name and a year", "why": "Easy to find and to guess." }
        ]
      },
      {
        "question": "What does a padlock in the address bar promise?",
        "options": [
          { "text": "An encrypted connection", "correct": true },
          { "text": "An honest site", "why": "Fake sites have padlocks too." }
        ]
      },
      {
        "question": "Which backup survives ransomware?",
        "options": [
          { "text": "An offline copy", "correct": true },
          { "text": "A drive that stays plugged in", "why": "The malware reaches it too." }
        ]
      },
      {
        "question": "Which second step is hardest to steal?",
        "options": [
          { "text": "A security key", "correct": true },
          { "text": "A code by text message", "why": "Texts can be redirected by SIM swapping." },
          { "text": "A second password", "why": "It can be phished like the first." }
        ],
        "okText": "Right: keys check the real site's address."
      },
      {
        "question": "In login.example.com.evil.io, which site is it?",
        "options": [
          { "text": "evil.io", "correct": true },
          { "text": "example.com", "why": "Read from the right: example.com is only decoration." }
        ]
      }
    ]
  },
  "report": {
    "heading": "Kai joins the watch!",
    "tiers": {
      "perfect": "Every answer right first time. The watch is lucky to have you.",
      "great": "A strong watch. Play again to catch the ones you missed.",
      "pass": "You made it. The takeaways below are worth a second read."
    },
    "lessons": [
      "Never log in through a link you were sent.",
      "Long passphrases beat clever symbols; a manager makes unique ones easy.",
      "Any second step helps; a security key is the strongest.",
      "Read web addresses from the right.",
      "Back up 3-2-1, keep one copy offline, and test restores.",
      "Defences work in layers."
    ],
    "glossaryIntro": "The game's words and what they are called at work:",
    "glossaryColumns": ["In this game", "In real life"],
    "glossary": [
      { "term": "The locked account email", "meaning": "Phishing" },
      { "term": "Security key", "meaning": "FIDO2 hardware authenticator" },
      { "term": "Layers", "meaning": "Defence in depth" },
      { "term": "Trying leaked passwords", "meaning": "Credential stuffing" }
    ],
    "source": {
      "label": "CISA: Secure Our World",
      "url": "https://www.cisa.gov/secure-our-world",
      "note": "Free guidance on passwords, two-step verification, updates and phishing."
    }
  },
  "world": {
    "islands": {
      "theme": "aurora",
      "levels": {
        "phishing": { "scenery": "tower" },
        "team-vote": { "scenery": "grove" },
        "password-lab": { "scenery": "workshop" }
      }
    },
    "runner": {
      "theme": "haunted",
      "chaser": { "name": "the phishing phantoms", "kind": "ghost" },
      "levels": {
        "phishing": { "scenery": "ruins", "encounter": "ghost", "hazards": "light" },
        "public-wifi": { "scenery": "bridges", "encounter": "ropebridge", "hazards": "normal" },
        "incident": { "scenery": "tunnel", "encounter": "gate", "hazards": "heavy" }
      }
    },
    "stealth": {
      "theme": "rooftop",
      "guards": { "name": "the botnet guards" },
      "levels": {
        "phishing": { "room": "offices", "boss": "sentinel", "soldiers": 3, "squad": ["rookie", "rookie", "rifleman"], "reward": "smoke" },
        "second-step": { "room": "pillars", "boss": "warden", "soldiers": 4, "reward": "knife" }
      }
    }
  }
}
```
