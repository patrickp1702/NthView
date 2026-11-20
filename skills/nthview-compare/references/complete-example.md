# Compare complete example

A complete, valid object that exercises every field in `schema.md`. It is the
exact data in `examples/example.html`; `scripts/build-html.js --example` reads
it from this file.

The example compares three security assessments that are often confused: a
vulnerability scan, a penetration test and a red team exercise. The facts
come from NIST SP 800-115, NIST SP 800-53 (CA-8, RA-5), PCI DSS v4.0.1
requirements 11.3 and 11.4, TIBER-EU, CBEST, DORA and the PTES. Durations
of scans and pen tests and the cost order are industry convention, and the
cells say so. Build the demo with:

    node scripts/build-html.js skills/nthview-compare --example skills/nthview-compare/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Vulnerability scan vs penetration test vs red team",
  "subtitle": "Three ways to test your defences, and the question each one answers",
  "focus": "Which security assessment answers which question about your defences?",
  "intro": [
    "All three are authorised attacks on your own organisation, all three end in a report, and people use their names loosely. A board asks for \"a pen test\" and gets a scan; a team buys \"a red team\" when it needed a pen test.",
    "The difference is not size or price. Each answers a different question: **what known weaknesses do we have**, **can someone actually exploit them**, and **would we notice and stop a real attacker**."
  ],
  "options": [
    {
      "id": "scan",
      "name": "Vulnerability scan",
      "short": "Scan",
      "aka": "vulnerability scanning; often loosely called a vulnerability assessment",
      "summary": "An automated tool checks many systems against a database of known vulnerabilities and misconfigurations and lists what it finds.",
      "colour": "teal"
    },
    {
      "id": "pen-test",
      "name": "Penetration test",
      "short": "Pen test",
      "aka": "pentest, ethical hacking",
      "summary": "Skilled testers attack a defined set of systems the way an attacker would, exploiting and chaining weaknesses to show how far they get.",
      "colour": "amber"
    },
    {
      "id": "red-team",
      "name": "Red team exercise",
      "short": "Red team",
      "aka": "adversary emulation; threat-led penetration testing (TLPT) in EU finance",
      "summary": "A specialised team emulates a realistic adversary pursuing a business objective, covertly, to test whether the organisation detects and responds.",
      "colour": "rose"
    }
  ],
  "dimensions": [
    {
      "id": "goal",
      "name": "Question it answers",
      "why": "Start here: pick the assessment whose question you actually need answered.",
      "takeaway": "A scan asks **what known flaws exist**, a pen test asks **can they be exploited and how far**, a red team asks **would we detect and stop a real adversary**."
    },
    {
      "id": "breadth",
      "name": "Breadth of coverage",
      "why": "How many systems and controls the assessment looks at.",
      "takeaway": "Coverage narrows as depth grows: a scan touches everything in range, a pen test a defined scope, a red team only the path to its objective."
    },
    {
      "id": "depth",
      "name": "Depth",
      "why": "Whether weaknesses are only reported, actually exploited, or used to reach a goal.",
      "takeaway": "A scan **finds**, a pen test **exploits**, a red team **achieves an objective**."
    },
    {
      "id": "who",
      "name": "Who does it",
      "why": "Skill needed, independence, and who knows the test is happening.",
      "takeaway": "A tool plus someone to interpret it; skilled testers; a specialised team watched over by a small control team the defenders do not know about."
    },
    {
      "id": "stealth",
      "name": "Stealth",
      "why": "Whether the defenders know, which decides whether detection is being tested.",
      "takeaway": "Only the red team is meant to stay hidden, because the defenders' response is part of what it tests."
    },
    {
      "id": "duration",
      "name": "Duration",
      "why": "How long one engagement takes, which shapes when results arrive.",
      "takeaway": "Hours to days, days to weeks, months."
    },
    {
      "id": "frequency",
      "name": "How often",
      "why": "Regulations set minimum cadences for some sectors.",
      "takeaway": "Scans are routine (at least quarterly under PCI DSS), pen tests periodic (at least yearly and after big changes), red teams occasional (at least every three years for firms in scope of DORA's threat-led testing)."
    },
    {
      "id": "cost",
      "name": "Relative cost",
      "why": "Budget is real, but the cheaper option answers a smaller question.",
      "takeaway": "Cost rises with skill and time: scan, then pen test, then red team. The standards give no figures; this is the usual order."
    },
    {
      "id": "output",
      "name": "What you get",
      "why": "The report decides what you can act on.",
      "takeaway": "A list of possible flaws to triage; proven attack paths to fix; a story of the attack and of the defence, with no pass or fail."
    },
    {
      "id": "authorisation",
      "name": "Authorisation",
      "why": "All three are attacks; without permission they are illegal.",
      "takeaway": "Alike: each needs written permission and rules of engagement agreed before it starts.",
      "alike": true
    }
  ],
  "cells": [
    { "option": "scan", "dimension": "goal", "text": "Which known vulnerabilities and misconfigurations do our systems have?", "detail": "NIST SP 800-115: scanners compare what they find against known vulnerabilities stored in the scanner's database. They cannot judge the overall risk on their own." },
    { "option": "pen-test", "dimension": "goal", "text": "Can an attacker actually exploit our weaknesses, and how far could they get?", "detail": "NIST SP 800-53 CA-8 uses penetration testing to validate vulnerabilities or determine the degree of penetration resistance." },
    { "option": "red-team", "dimension": "goal", "text": "Could a realistic adversary reach a business objective, and would we detect and respond?", "detail": "NIST SP 800-53 CA-8(2): red team exercises extend the objectives of penetration testing by examining the security and privacy posture and the capability to implement effective cyber defences." },

    { "option": "scan", "dimension": "breadth", "text": "Broad: every host and application in range, checked for as many known issues as possible", "mark": "high", "detail": "Breadth is the point. NIST SP 800-115 adds the limits: a scan sees only active systems and surface vulnerabilities." },
    { "option": "pen-test", "dimension": "breadth", "text": "A defined set of systems, such as an application, a network or the card-data environment", "mark": "medium", "detail": "PCI DSS 11.4.1 asks for coverage of the entire card-data environment perimeter and critical systems, tested from inside and outside the network." },
    { "option": "red-team", "dimension": "breadth", "text": "Only what lies on the path to the objective, but across technology, people and processes", "mark": "low", "detail": "NIST SP 800-115 on covert testing: it does not test every security control, identify each vulnerability or assess all systems. TIBER-EU scopes a test around critical functions and the people, processes and technology behind them." },

    { "option": "scan", "dimension": "depth", "text": "Finds and reports; does not exploit", "mark": "low", "detail": "Most scanners stop at identifying a likely vulnerability and suggesting a fix." },
    { "option": "pen-test", "dimension": "depth", "text": "Exploits weaknesses and chains them to show real impact", "mark": "medium", "detail": "NIST SP 800-115: penetration testing often involves launching real attacks on real systems and data, looking for combinations of vulnerabilities. The PTES runs through exploitation and post-exploitation." },
    { "option": "red-team", "dimension": "depth", "text": "Uses whatever works to reach a goal, such as reaching payment systems", "mark": "high", "detail": "NIST SP 800-115: covert testing examines the damage or impact an adversary can cause; it does not focus on identifying vulnerabilities." },

    { "option": "scan", "dimension": "who", "text": "An automated tool, run and interpreted by staff or a vendor", "detail": "NIST SP 800-115 says someone with networking and operating-system security expertise should interpret the results. PCI DSS requires external scans by an Approved Scanning Vendor (ASV)." },
    { "option": "pen-test", "dimension": "who", "text": "Skilled testers, internal or external, independent of the systems tested", "detail": "PCI DSS 11.4.2 allows a qualified internal resource or a qualified external third party, with organisational independence. NIST CA-8 asks for demonstrable skills and experience." },
    { "option": "red-team", "dimension": "who", "text": "A specialised red team, with a small control team that knows; the defenders do not", "detail": "NIST's glossary calls that group the White Team: a small group with prior knowledge of unannounced Red Team activities. TIBER-EU requires external threat intelligence and strongly encourages external red team testers." },

    { "option": "scan", "dimension": "stealth", "text": "Noisy: heavy traffic that defenders can easily see, sometimes disruptive", "mark": "low", "detail": "NIST SP 800-115: vulnerability scanning generates significantly more network traffic than port scanning and may disrupt network operations." },
    { "option": "pen-test", "dimension": "stealth", "text": "Usually overt: IT staff know and agree, so findings come faster", "mark": "medium", "detail": "NIST SP 800-115 calls testing with the knowledge and consent of IT staff overt. A pen test can still check whether attacks are detected, but hiding is not its purpose." },
    { "option": "red-team", "dimension": "stealth", "text": "Covert: defenders are not told, because their response is being tested", "mark": "high", "detail": "In TIBER-EU the blue team is tested without its foreknowledge. NIST SP 800-115 describes covert testing as done without the knowledge of IT staff but with the full permission of upper management." },

    { "option": "scan", "dimension": "duration", "text": "Hours to days per run (convention)", "mark": "low", "detail": "No standard sets a figure; thorough scans take longer than light ones." },
    { "option": "pen-test", "dimension": "duration", "text": "Days to a few weeks (convention)", "mark": "medium", "detail": "Time-boxed by scope. The PTES advises adding about 20% to the estimated time as padding." },
    { "option": "red-team", "dimension": "duration", "text": "Months: TIBER-EU requires at least 12 weeks of active testing", "mark": "high", "detail": "The Bank of England puts an average CBEST project at around 9 to 12 months from start to finish." },

    { "option": "scan", "dimension": "frequency", "text": "Routine: at least every three months, and after significant changes (PCI DSS)", "mark": "high", "detail": "PCI DSS 11.3.1 and 11.3.2 require internal and external scans at least once every three months. NIST RA-5 lets the organisation set the frequency." },
    { "option": "pen-test", "dimension": "frequency", "text": "Periodic: at least every 12 months and after significant changes (PCI DSS)", "mark": "medium", "detail": "PCI DSS 11.4.2 and 11.4.3. NIST SP 800-115 notes that annual penetration testing may be sufficient for many organisations." },
    { "option": "red-team", "dimension": "frequency", "text": "Occasional: at least every three years for financial firms required to do threat-led testing under DORA", "mark": "low", "detail": "DORA Article 26 requires threat-led penetration testing at least every three years for the entities in its scope. Elsewhere it is optional: CA-8(2) sits in no NIST baseline." },

    { "option": "scan", "dimension": "cost", "text": "Lowest: mostly tool licences and the time to triage results", "mark": "low", "detail": "Conventional order; no standard gives prices." },
    { "option": "pen-test", "dimension": "cost", "text": "Higher: skilled people for days or weeks", "mark": "medium", "detail": "NIST SP 800-115 mentions the high cost of penetration testing compared with scanning." },
    { "option": "red-team", "dimension": "cost", "text": "Highest: a specialised team, threat intelligence and months of effort", "mark": "high", "detail": "NIST SP 800-115: overt testing is less expensive, but covert testing gives a better picture of everyday security." },

    { "option": "scan", "dimension": "output", "text": "A list of possible vulnerabilities with tool-assigned severities, including false positives", "detail": "NIST SP 800-115 warns that scanners can have a high false positive rate and that assessors should not simply accept the risk levels the scanner assigns." },
    { "option": "pen-test", "dimension": "output", "text": "Proven attack paths with evidence, ranked findings and fixes to retest", "detail": "PCI DSS 11.4.4: exploitable vulnerabilities found are corrected and the testing is repeated to verify the corrections." },
    { "option": "red-team", "dimension": "output", "text": "The story of the attack and of the defence, then a remediation plan; no pass or fail", "detail": "TIBER-EU produces red team and blue team reports, a replay and purple teaming session, and a remediation plan; it states the test does not result in a pass or fail. CBEST says the same." },

    { "option": "scan", "dimension": "authorisation", "text": "Written permission and agreed scope before scanning", "mark": "yes", "detail": "NIST SP 800-115 gives a rules-of-engagement template for every kind of test it covers." },
    { "option": "pen-test", "dimension": "authorisation", "text": "Signed permission to test and rules of engagement", "mark": "yes", "detail": "The PTES requires a signed permission-to-test document covering timing, evidence handling and emergency contacts." },
    { "option": "red-team", "dimension": "authorisation", "text": "Permission from top management, plus a plan of allowed and forbidden techniques", "mark": "yes", "detail": "TIBER-EU's red team test plan lists the tactics allowed and forbidden, including ethical boundaries for social engineering." }
  ],
  "whenToChoose": [
    { "situation": "You need routine evidence, every quarter, that no known high-risk flaw is exposed", "option": "scan", "why": "Cheap, fast and broad enough to repeat; PCI DSS requires it at least every three months." },
    { "situation": "You patched last month's findings and want to confirm the fixes across thousands of hosts", "option": "scan", "why": "Re-scanning is the quick, broad check. A pen test would cover far less ground." },
    { "situation": "A new customer portal goes live next month and you want to know if an attacker could reach customer data", "option": "pen-test", "why": "You need proof of exploitability within a defined scope, before launch." },
    { "situation": "Your yearly compliance cycle, or a major change to the network, calls for an independent attack test", "option": "pen-test", "why": "PCI DSS asks for a penetration test at least every 12 months and after significant change." },
    { "situation": "Your security operations centre is mature and the board asks whether it would catch a real attacker", "option": "red-team", "why": "Only a covert, objective-driven exercise tests detection and response." },
    { "situation": "A financial regulator requires threat-intelligence-led testing of your critical functions", "option": "red-team", "why": "TIBER-EU, CBEST and DORA's threat-led penetration testing are red team frameworks." }
  ],
  "similarities": [
    "All three are **authorised** attacks: written permission and rules of engagement come first.",
    "All three find weaknesses so that they can be **fixed**, and end in a report.",
    "All three are a **snapshot** of one point in time, not a guarantee for the future.",
    "They **build on each other**: a pen test usually starts with scanning, and a red team uses pen-testing skills."
  ],
  "differences": [
    "They answer different questions: **known flaws**, **exploitability**, **detection and response**.",
    "Depth rises and coverage narrows: a scan is broad and shallow, a red team narrow and deep.",
    "Only the red team is **covert**, because the defenders are part of what is tested.",
    "Scans are routine, pen tests periodic, red teams occasional and usually for mature organisations."
  ],
  "bigIdea": "Choose by the question, not the price: a scan tells you **what** is weak, a pen test **how far** weaknesses lead, and a red team **whether you would notice**. Mature programmes run all three, each at its own rhythm.",
  "misconceptions": [
    { "claim": "A vulnerability scan is a penetration test.", "truth": "NIST SP 800-53 says penetration testing goes beyond automated vulnerability scanning, and PCI DSS keeps them as separate requirements (11.3 and 11.4)." },
    { "claim": "A clean scan means we are secure.", "truth": "Scanners check only for known, surface-level issues and cannot see business-logic flaws. The OWASP testing guide warns that relying on automated tools gives a false sense of security." },
    { "claim": "A red team is just a bigger, more expensive pen test.", "truth": "Its objective is different: it emulates a specific adversary, covertly, to test detection and response, and it does not try to find every vulnerability." },
    { "claim": "A red team exercise ends with a pass or a fail.", "truth": "TIBER-EU and CBEST both state that their tests are not pass or fail; the value is in what the attack and the defence reveal." }
  ],
  "questions": [
    {
      "id": "sort-traits",
      "kind": "sort",
      "prompt": "Which assessment does each statement describe?",
      "statements": [
        { "text": "Checks systems against a database of known vulnerabilities", "answer": ["scan"], "why": "Matching against known issues is what a scanner does. Testers use scanners too, but their work goes further." },
        { "text": "Needs written permission and agreed rules before it starts", "answer": ["scan", "pen-test", "red-team"], "why": "Every one of them is an attack on real systems; without authorisation it would be illegal." },
        { "text": "Exploits weaknesses rather than only listing them", "answer": ["pen-test", "red-team"], "why": "Exploitation separates both from a scan. A red team exploits only what serves its objective." },
        { "text": "Is kept secret from the defenders being tested", "answer": ["red-team"], "why": "Only the red team is covert; a small control team knows, the defenders do not." },
        { "text": "Proves that no weaknesses remain", "answer": [], "why": "None can. Each is a snapshot of one moment and limited by its scope, tools and time." }
      ]
    },
    {
      "id": "cell-pen-depth",
      "kind": "cell",
      "option": "pen-test",
      "dimension": "depth"
    },
    {
      "id": "pick-quarterly",
      "kind": "pick",
      "situation": "You run an online shop that takes card payments. Your bank wants evidence **every quarter** that your internet-facing systems have no known high-risk vulnerabilities.",
      "answer": "scan",
      "why": "PCI DSS requires external scans by an Approved Scanning Vendor at least every three months. A scan is broad, cheap and fast enough to repeat that often.",
      "notes": {
        "pen-test": "A pen test is required too, but yearly and after significant change; it is too slow and narrow to repeat every quarter.",
        "red-team": "A red team tests detection and response over months; it says nothing about the full list of known flaws."
      }
    },
    {
      "id": "choice-red-not-pen",
      "kind": "choice",
      "prompt": "Which is true of a red team exercise but **not** of a penetration test?",
      "choices": [
        { "text": "It tests whether the defenders detect and respond, without warning them", "correct": true, "why": "Covertness and testing the defence are what make a red team. A pen test is usually overt." },
        { "text": "It exploits vulnerabilities to show real impact", "why": "Both exploit. That is what separates them from a scan, not from each other." },
        { "text": "It needs signed rules of engagement", "why": "All three need written authorisation, so this does not tell them apart." },
        { "text": "It is done by skilled people, not only a tool", "why": "Pen testers are skilled people too." }
      ]
    },
    {
      "id": "cell-red-duration",
      "kind": "cell",
      "option": "red-team",
      "dimension": "duration"
    },
    {
      "id": "pick-portal",
      "kind": "pick",
      "situation": "A new customer portal goes live next month. You want to know whether an attacker could get from the login page to other customers' data.",
      "answer": "pen-test",
      "why": "The question is whether weaknesses in one defined system can be exploited and chained. That is exactly a pen test's job, and it fits before launch.",
      "notes": {
        "scan": "A scan would list known issues but not prove whether they chain into a path to customer data, and it misses logic flaws.",
        "red-team": "A red team targets the whole organisation's detection over months; the portal question is narrower and needs answering before launch."
      }
    },
    {
      "id": "choice-false",
      "kind": "choice",
      "prompt": "Which statement is **false**?",
      "choices": [
        { "text": "A clean vulnerability scan shows that the systems are secure", "correct": true, "why": "False, and a classic mix-up: scanners see only known, surface issues and miss logic flaws. A clean scan means no known issue was found." },
        { "text": "A pen test usually includes vulnerability scanning as one of its steps", "why": "True. NIST SP 800-115 notes that penetration testing usually relies on scanning first." },
        { "text": "A red team does not try to test every control", "why": "True. It follows the path to its objective, so coverage is narrow by design." },
        { "text": "Scanners can report vulnerabilities that are not really there", "why": "True. NIST SP 800-115 warns of high false positive rates, so results need triage." }
      ]
    },
    {
      "id": "sort-cadence",
      "kind": "sort",
      "prompt": "Which does each rule or fact apply to?",
      "statements": [
        { "text": "PCI DSS: at least once every three months", "answer": ["scan"], "why": "Requirement 11.3: internal and external vulnerability scans quarterly and after significant change." },
        { "text": "PCI DSS: at least once every 12 months and after significant change", "answer": ["pen-test"], "why": "Requirement 11.4: internal and external penetration testing." },
        { "text": "DORA: at least every three years for financial firms in scope", "answer": ["red-team"], "why": "DORA's threat-led penetration testing follows the red team model of TIBER-EU." },
        { "text": "Gives a snapshot of one point in time", "answer": ["scan", "pen-test", "red-team"], "why": "NIST SP 800-115: an assessment provides a snapshot of security at a given point in time." }
      ]
    },
    {
      "id": "pick-soc",
      "kind": "pick",
      "situation": "Your security operations centre has run for three years. The board asks: **would we notice and stop** a serious criminal group going after our payment systems?",
      "answer": "red-team",
      "why": "Only a covert exercise against a realistic objective tests detection and response. The defenders must not know, or the answer means nothing.",
      "notes": {
        "scan": "A scan is noisy and announced; it tells you nothing about whether a quiet attacker would be caught.",
        "pen-test": "A pen test is usually overt, so the defenders know it is happening, and it aims for coverage of a scope rather than a realistic attack on an objective."
      }
    },
    {
      "id": "cell-scan-stealth",
      "kind": "cell",
      "option": "scan",
      "dimension": "stealth",
      "prompt": "How visible is a vulnerability scan to the defenders?",
      "why": "Scanning sends a lot of traffic in a short time, so it is easy to see. That is fine: hiding is not its purpose."
    },
    {
      "id": "explain-red-vs-pen",
      "kind": "explain",
      "prompt": "In two or three sentences: how does a red team exercise differ from a penetration test?",
      "model": "A pen test asks how far weaknesses in a defined scope can be exploited; testers work openly with IT staff and aim to find as many exploitable paths as they can in days or weeks. A red team emulates a realistic adversary pursuing one objective, covertly, over months, to find out whether the organisation detects and responds, so it tests people and processes as much as technology.",
      "points": [
        "Different question: exploitability vs detection and response",
        "Pen test is usually overt; red team is covert to the defenders",
        "Pen test covers a scope; red team follows the path to an objective",
        "Red team takes longer and emulates a realistic adversary"
      ]
    },
    {
      "id": "pick-patches",
      "kind": "pick",
      "situation": "Last month's assessment found 300 missing patches. The team says they are fixed. You want to confirm across all 2,000 servers by Friday.",
      "answer": "scan",
      "why": "Verifying known fixes across many hosts quickly is what scanning is for.",
      "notes": {
        "pen-test": "Far too slow and narrow to check 2,000 servers by Friday; use it for what a scan cannot prove.",
        "red-team": "Months long and covert; it would not tell you which patches landed."
      }
    }
  ],
  "sources": [
    { "label": "NIST SP 800-115, Technical Guide to Information Security Testing and Assessment (2008)", "url": "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf" },
    { "label": "NIST SP 800-53 Rev. 5, controls CA-8 Penetration Testing and RA-5 Vulnerability Monitoring and Scanning", "url": "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
    { "label": "NIST CSRC glossary: red team, white team", "url": "https://csrc.nist.gov/glossary/term/red_team" },
    { "label": "PCI DSS v4.0.1, requirements 11.3 (vulnerability scans) and 11.4 (penetration testing)", "url": "https://www.pcisecuritystandards.org/document_library/" },
    { "label": "TIBER-EU Framework (European Central Bank, 2025)", "url": "https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/html/index.en.html" },
    { "label": "CBEST Threat Intelligence-Led Assessments, Implementation Guide (Bank of England)", "url": "https://www.bankofengland.co.uk/financial-stability/operational-resilience-of-the-financial-sector/cbest-threat-intelligence-led-assessments-implementation-guide" },
    { "label": "Regulation (EU) 2022/2554 (DORA), Article 26", "url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554" },
    { "label": "Penetration Testing Execution Standard (PTES)", "url": "http://www.pentest-standard.org/index.php/Main_Page" },
    { "label": "OWASP Web Security Testing Guide v4.2, Introduction", "url": "https://owasp.org/www-project-web-security-testing-guide/" }
  ]
}
```
