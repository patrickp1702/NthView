# Timeline complete example

A complete, valid object that exercises every field in `schema.md`: the
WannaCry ransomware outbreak of May 2017, from the leak of the exploit it used
to the cost counted a year later. It is the exact data in
`examples/example.html`; `scripts/build-html.js --example` reads it from this
file. Build the demo with:

    node scripts/build-html.js skills/nthview-timeline --example skills/nthview-timeline/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "WannaCry: from a leaked exploit to a global outbreak",
  "subtitle": "How a patched flaw still took down hospitals, factories and offices in May 2017, and why",
  "intro": [
    "On Friday 12 May 2017 a piece of ransomware called **WannaCry** spread across the world in hours, locking files on hundreds of thousands of Windows computers and demanding bitcoin to unlock them. In England it disrupted at least 80 of the 236 NHS trusts.",
    "The flaw it used had been fixed by Microsoft two months earlier. This timeline follows the leak, the patch, the outbreak, the accidental kill switch and the aftermath, and asks you along the way what led to what."
  ],
  "reveal": "step",
  "timeZone": "UTC",
  "gaps": true,
  "tracks": [
    { "id": "attackers", "label": "Attackers and leaks", "text": "The people who leaked the exploit and the malware that used it." },
    { "id": "defenders", "label": "Defenders and response", "text": "Vendors, governments, the NHS and the researchers who fought back." }
  ],
  "eras": [
    { "label": "The leak", "from": "shadow-brokers-auction", "to": "lost-in-translation", "text": "A stolen toolkit goes public, and a patch arrives first." },
    { "label": "Outbreak week", "from": "outbreak", "to": "windows-7", "text": "Friday 12 May to the following Friday: infection, kill switch, emergency patches." },
    { "label": "Aftermath", "from": "notpetya", "to": "nhs-cost", "text": "Copycats, reviews, attribution and the bill." }
  ],
  "events": [
    {
      "id": "shadow-brokers-auction",
      "date": "2016-08",
      "title": "The Shadow Brokers offer stolen hacking tools",
      "text": "A group calling itself the **Shadow Brokers** announces an auction of cyber-weapons it says were taken from the **Equation Group**, a team widely linked to the US National Security Agency (NSA). Security experts judge the sample files genuine.",
      "track": "attackers",
      "refs": [0]
    },
    {
      "id": "ms17-010",
      "date": "2017-03-14",
      "title": "Microsoft fixes the SMBv1 flaws (MS17-010)",
      "text": "Microsoft publishes security update **MS17-010**, rated Critical. It fixes six flaws in version 1 of the Windows file-sharing protocol, **SMBv1**, including `CVE-2017-0144`, the one the exploit later known as EternalBlue attacks.",
      "detail": [
        "The bulletin lists the flaws as not publicly disclosed and not exploited at the time: the patch came out a month before the exploit was leaked.",
        "The Washington Post later reported, citing unnamed former officials, that the NSA warned Microsoft once it realised the tool had been stolen. That account has not been officially confirmed."
      ],
      "track": "defenders",
      "turningPoint": true,
      "refs": [1, 2]
    },
    {
      "id": "patch-gap",
      "date": "2017-03-14",
      "end": "2017-05-12",
      "label": "14 March – 12 May 2017",
      "title": "Two months in which the patch was available but not applied",
      "text": "Installing an update takes testing, scheduled downtime and someone responsible for each machine. Across many organisations, including NHS trusts, Windows 7 computers still lacked MS17-010 when the outbreak began. Older Windows XP machines could not get it at all: they were out of support.",
      "detail": [
        "SMBv1 listens on TCP port 445. A machine that is unpatched and reachable on that port, from the internet or from an infected computer inside the same network, can be taken over without anyone clicking anything.",
        "The UK National Audit Office (NAO) later found that every NHS organisation infected by WannaCry had unpatched or unsupported Windows, and that managing internet-facing firewalls would also have protected them."
      ],
      "track": "defenders",
      "causes": [
        { "event": "ms17-010", "how": "the fix existed, so the risk now depended on installing it", "kind": "condition" }
      ],
      "refs": [6]
    },
    {
      "id": "carecert-alert",
      "date": "2017-03-17",
      "title": "NHS Digital tells trusts to apply the patch",
      "text": "NHS Digital's cyber-security service, **CareCERT**, issues a critical alert asking NHS organisations to apply the March patch. It repeats the warning on 28 April.",
      "detail": [
        "The alerts were advice. The NAO found that NHS Digital could not make a local trust act on them, and that before 12 May the Department of Health had no formal way to check whether trusts had done so."
      ],
      "track": "defenders",
      "causes": [
        { "event": "ms17-010", "how": "a published fix gave the warning something to point to", "kind": "trigger" }
      ],
      "refs": [6]
    },
    {
      "id": "lost-in-translation",
      "date": "2017-04-14",
      "title": "The leak goes public: EternalBlue and DoublePulsar",
      "text": "The Shadow Brokers publish a dump they call **Lost in Translation**. It contains working Windows exploits, including **ETERNALBLUE**, and the **DOUBLEPULSAR** backdoor. Microsoft responds the same weekend that EternalBlue is already fixed by MS17-010.",
      "detail": [
        "From this day anyone could download a reliable, ready-made way to take over unpatched Windows machines over SMBv1, plus a backdoor to load further code through it."
      ],
      "track": "attackers",
      "turningPoint": true,
      "causes": [
        { "event": "shadow-brokers-auction", "how": "the same group, now releasing the tools for free", "kind": "condition" }
      ],
      "refs": [2]
    },
    {
      "id": "outbreak",
      "date": "2017-05-12T07:24",
      "label": "12 May 2017, morning",
      "title": "WannaCry starts spreading as a worm",
      "text": "A new ransomware strain begins copying itself from computer to computer. It scans for machines with port 445 open, breaks in with **EternalBlue**, installs **DoublePulsar**, then encrypts files and demands **$300 in bitcoin**, rising to $600 after three days.",
      "detail": [
        "Cisco's DNS service saw the first lookups of the malware's tell-tale domain at 07:24 UTC; the first reports of infections came between about 07:40 and 09:00 UTC. Because it spreads by itself, one infected laptop can infect a whole network without anyone opening an email.",
        "Day-one alerts mentioned phishing as one possible way in. Later analysis, and the NAO for the NHS, found it spread over SMB, not by email."
      ],
      "track": "attackers",
      "turningPoint": true,
      "causes": [
        { "event": "lost-in-translation", "how": "the leaked exploit became the worm's way into each machine", "kind": "condition" },
        { "event": "patch-gap", "how": "unpatched SMBv1 machines left the door open", "kind": "condition" }
      ],
      "refs": [3, 4, 5]
    },
    {
      "id": "cisa-alert",
      "date": "2017-05-12",
      "title": "US-CERT issues alert TA17-132A",
      "text": "The US Computer Emergency Readiness Team warns of tens of thousands of infections in more than 150 countries, names the SMBv1 exploit and tells organisations to apply MS17-010, block port 445 at the edge and disable SMBv1.",
      "track": "defenders",
      "causes": [
        { "event": "outbreak", "how": "infections reported worldwide within hours", "kind": "trigger" }
      ],
      "refs": [3]
    },
    {
      "id": "nhs-major-incident",
      "date": "2017-05-12T15:00",
      "label": "12 May 2017, 16:00 UK time",
      "title": "NHS England declares a major incident",
      "text": "Trusts report locked computers from late morning. At 4 pm UK time (15:00 UTC) NHS England declares a national major incident. Over the next days five hospitals divert emergency patients and thousands of appointments are cancelled.",
      "track": "defenders",
      "causes": [
        { "event": "outbreak", "how": "trusts' computers were locked or switched off as a precaution", "kind": "trigger" },
        { "event": "patch-gap", "how": "unpatched Windows 7 machines were widespread across trusts", "kind": "condition" }
      ],
      "refs": [6]
    },
    {
      "id": "kill-switch",
      "date": "2017-05-12",
      "label": "12 May 2017, evening (UK)",
      "title": "A researcher registers the kill-switch domain",
      "text": "British researcher **Marcus Hutchins** (MalwareTech) notices that each infection first looks up an unregistered web address. He registers it to track the spread. Once the address answers, new infections stop before encrypting: the check was a **kill switch**.",
      "detail": [
        "The domain was `iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com`. The NAO places the moment on the evening of 12 May; other accounts say mid-afternoon UK time.",
        "The kill switch did not unlock machines already encrypted and did nothing for networks that could not reach the internet. Researchers kept the domain online for years; TechCrunch reported it blocked about a million detonations in its first two days."
      ],
      "track": "defenders",
      "turningPoint": true,
      "causes": [
        { "event": "outbreak", "how": "samples of the spreading worm revealed the domain check", "kind": "trigger" }
      ],
      "refs": [7, 6]
    },
    {
      "id": "xp-patch",
      "date": "2017-05-13",
      "label": "12–13 May 2017",
      "title": "Microsoft patches Windows XP, years after support ended",
      "text": "Calling it a \"highly unusual step\", Microsoft publishes the MS17-010 fix for Windows XP, Windows 8 and Windows Server 2003, systems it no longer supported.",
      "track": "defenders",
      "causes": [
        { "event": "outbreak", "how": "unsupported machines had no other fix", "kind": "trigger" }
      ],
      "refs": [8]
    },
    {
      "id": "europol-count",
      "date": "2017-05-14",
      "title": "Europol: more than 200,000 victims in 150 countries",
      "text": "Europol's director puts the count at more than 200,000 victims in at least 150 countries. The same day Microsoft's president blames governments for stockpiling exploits and calls for a \"Digital Geneva Convention\".",
      "track": "defenders",
      "causes": [
        { "event": "outbreak", "how": "the count of one weekend of spread", "kind": "trigger" }
      ],
      "refs": [9, 15]
    },
    {
      "id": "windows-7",
      "date": "2017-05-19",
      "title": "Analysis: most victims ran Windows 7, not XP",
      "text": "Kaspersky reports that about **98%** of infected computers it saw ran Windows 7, and that Windows XP machines were an insignificant share. The NHS major incident is stood down the same day.",
      "detail": [
        "Early coverage blamed old Windows XP. The data pointed instead at a supported system that simply had not been patched. NHS Digital told the NAO the same about NHS devices."
      ],
      "track": "defenders",
      "causes": [
        { "event": "patch-gap", "how": "supported but unpatched machines were the bulk of victims", "kind": "condition" }
      ],
      "refs": [10, 6]
    },
    {
      "id": "notpetya",
      "date": "2017-06-27",
      "title": "NotPetya reuses the same leaked exploits",
      "text": "A second, more destructive malware, **NotPetya**, spreads first through a hijacked update of Ukrainian accounting software and then inside networks using **EternalBlue** and **EternalRomance**. Most infections are in Ukraine, but global companies are hit hard.",
      "detail": [
        "NotPetya was a separate attack by different people. It did not grow out of WannaCry; it drew on the same leak."
      ],
      "track": "attackers",
      "causes": [
        { "event": "lost-in-translation", "how": "the same public exploits, reused", "kind": "condition" }
      ],
      "refs": [11]
    },
    {
      "id": "hutchins-arrest",
      "date": "2017-08-02",
      "title": "The kill-switch researcher is arrested over older malware",
      "text": "Marcus Hutchins is arrested in Las Vegas on US charges about the **Kronos** banking malware from 2014–2015. The case has nothing to do with WannaCry.",
      "track": "defenders"
    },
    {
      "id": "nao-report",
      "date": "2017-10-27",
      "title": "The National Audit Office reports on the NHS",
      "text": "The NAO finds that at least **80 of 236** trusts were disrupted, **603** other NHS organisations were infected, including 595 GP practices, and an estimated **19,494** appointments were cancelled. No NHS organisation paid the ransom.",
      "detail": [
        "Its central finding: the attack exploited basic weaknesses. Every infected NHS organisation had unpatched or unsupported Windows, warnings had been sent, and nobody had the power to make trusts act on them."
      ],
      "track": "defenders",
      "causes": [
        { "event": "nhs-major-incident", "how": "the incident it investigated", "kind": "trigger" },
        { "event": "carecert-alert", "how": "it asked why the warnings went unheeded", "kind": "condition" }
      ],
      "refs": [6]
    },
    {
      "id": "attribution",
      "date": "2017-12-19",
      "title": "The US publicly blames North Korea",
      "text": "The White House attributes WannaCry to North Korea, with the UK, Australia, Canada, New Zealand and Japan backing the finding.",
      "track": "defenders",
      "causes": [
        { "event": "outbreak", "how": "months of forensic work on the malware and its infrastructure", "kind": "condition" }
      ],
      "refs": [12]
    },
    {
      "id": "park-charges",
      "date": "2018-09-06",
      "title": "US charges a North Korean programmer",
      "text": "The US Justice Department charges **Park Jin Hyok**, alleged to work for a North Korean government hacking team, over the 2014 Sony Pictures attack, the 2016 Bangladesh Bank theft and WannaCry.",
      "track": "defenders",
      "causes": [
        { "event": "attribution", "how": "the investigation behind the attribution named a suspect", "kind": "trigger" }
      ],
      "refs": [13]
    },
    {
      "id": "nhs-cost",
      "date": "2018-10-11",
      "title": "The bill for the NHS: about £92 million",
      "text": "The UK Department of Health and Social Care estimates WannaCry cost the NHS about **£92m**: £19m in lost output and £73m in IT support during and after the attack. It notes the figure cannot be estimated with certainty.",
      "track": "defenders",
      "causes": [
        { "event": "nhs-major-incident", "how": "cancelled care and the clean-up afterwards", "kind": "trigger" }
      ],
      "refs": [14]
    }
  ],
  "questions": [
    {
      "id": "what-a-patch-means",
      "kind": "choice",
      "after": "patch-gap",
      "prompt": "Microsoft fixed the flaw on 14 March. What did that mean for an organisation's own computers?",
      "options": [
        { "text": "Each machine was protected only once the update was actually installed on it", "correct": true, "why": "A patch is a download, not a force field. Until it runs on a machine, that machine keeps the flaw." },
        { "text": "Every Windows PC was fixed automatically that day", "why": "Home PCs with automatic updates often were, but organisations usually test and schedule updates themselves, so many machines lagged for weeks." },
        { "text": "Only servers facing the internet needed it", "why": "Tempting, because the edge is where attacks start. But a worm that gets one machine inside then attacks every unpatched neighbour on the internal network." }
      ],
      "explain": "Publishing a fix moves the risk from the vendor to everyone who runs the software: the gap between \"fix available\" and \"fix installed\" is where WannaCry lived."
    },
    {
      "id": "predict-the-leak",
      "kind": "cause",
      "ask": "effect",
      "after": "lost-in-translation",
      "event": "lost-in-translation",
      "prompt": "A working exploit is now public. Which of these later events did the leak lead to directly?",
      "hint": "Look for the event that needed the exploit itself, not one that reacted to something else.",
      "options": [
        { "event": "outbreak", "why": "Yes: WannaCry used EternalBlue and DoublePulsar from the dump to break into each machine." },
        { "event": "xp-patch", "why": "Close, but indirect: Microsoft patched XP because of the outbreak a month later, not because of the leak itself." },
        { "event": "hutchins-arrest", "why": "No: that arrest concerned different malware from years earlier." }
      ],
      "explain": "Leaked exploits rarely stay unused. Within four weeks the leak's two key tools were the engine of a worm, which is why a patch for a leaked exploit is urgent, not routine."
    },
    {
      "id": "trigger-or-condition",
      "kind": "sort",
      "after": "outbreak",
      "prompt": "Sort what made the outbreak happen: the immediate spark, or a longer-standing state that made it possible?",
      "bins": ["Trigger", "Condition"],
      "items": [
        { "text": "Someone released the worm on the morning of 12 May", "bin": 0, "why": "This is the spark: without the release, nothing spreads that day." },
        { "event": "lost-in-translation", "bin": 1, "why": "The exploit had been public for four weeks; it made the attack possible but did not start it." },
        { "event": "patch-gap", "bin": 1, "why": "Unpatched machines had sat waiting for two months." },
        { "text": "SMBv1 enabled and port 445 reachable between machines", "bin": 1, "why": "A configuration that had been in place for years." }
      ],
      "explain": "Historians separate triggers from conditions because they answer different questions: the trigger explains why then, the conditions explain why it was possible at all. Fixing conditions is what prevents the next trigger from working."
    },
    {
      "id": "when-was-the-warning",
      "kind": "place",
      "after": "nhs-major-incident",
      "event": "carecert-alert",
      "prompt": "NHS Digital sent trusts a critical alert telling them to apply the patch. When did that first alert go out?",
      "among": ["ms17-010", "lost-in-translation", "outbreak"],
      "explain": "The first alert came on 17 March, three days after the patch and almost four weeks before the exploit was even public. The warning was early; acting on it was the gap."
    },
    {
      "id": "what-made-the-kill-switch",
      "kind": "cause",
      "after": "kill-switch",
      "event": "kill-switch",
      "options": [
        { "event": "outbreak", "why": "Yes: only by studying samples of the spreading worm could anyone see the domain it checked." },
        { "event": "lost-in-translation", "why": "The leak supplied the exploit, but the domain check was in WannaCry's own code, written later." },
        { "event": "cisa-alert", "why": "The alert told defenders what to patch; it did not reveal the kill switch." }
      ],
      "explain": "The kill switch was found by analysing the malware itself. Registering an unknown domain a sample contacts is routine for researchers, which is how an accident stopped a global attack."
    },
    {
      "id": "order-the-story",
      "kind": "order",
      "after": "europol-count",
      "events": ["lost-in-translation", "xp-patch", "shadow-brokers-auction", "outbreak", "ms17-010"],
      "explain": "Auction (August 2016), patch (March 2017), public leak (April), outbreak (12 May), XP patch (12–13 May). The surprising part is the order of the middle two: the fix came before the leak."
    },
    {
      "id": "how-long-a-gap",
      "kind": "choice",
      "after": "windows-7",
      "prompt": "How long had MS17-010 been available when WannaCry struck?",
      "options": [
        { "text": "About two days", "why": "That would make it a race against a brand-new fix, but this patch was old news by 12 May." },
        { "text": "About two months", "correct": true, "why": "14 March to 12 May is 59 days." },
        { "text": "More than a year", "why": "The Shadow Brokers' first auction was nine months earlier, but the fix itself was much newer." },
        { "text": "No fix existed yet", "why": "The outbreak hit machines that could have been patched; only unsupported systems such as XP lacked a fix before 12 May." }
      ],
      "explain": "Two months is long for an exploit-ready critical flaw and short for a large organisation's patch cycle. WannaCry sat exactly in that gap."
    },
    {
      "id": "where-notpetya-came-from",
      "kind": "cause",
      "after": "notpetya",
      "event": "notpetya",
      "options": [
        { "event": "lost-in-translation", "why": "Yes: NotPetya spread inside networks with EternalBlue and EternalRomance from the same dump." },
        { "event": "outbreak", "why": "Tempting, because it came six weeks later and used the same exploit. But it was a different attack by different people; both drew on the leak." },
        { "event": "kill-switch", "why": "NotPetya had no such kill switch; the two are unrelated." }
      ],
      "explain": "Following and after are not the same as caused by: two attacks with a common cause can look like one leading to the other."
    },
    {
      "id": "why-unpatched",
      "kind": "reflect",
      "after": "nao-report",
      "prompt": "The patch had been out for two months and trusts had been warned twice. Why might so many NHS machines still have been unpatched on 12 May?",
      "explain": "Patching a hospital is not one click: updates must be tested against clinical software, machines taken offline at a safe time, and someone in each of hundreds of separate trusts made responsible. The NAO found the alerts were advice that nobody could enforce, nobody checked compliance, and some devices, like XP inside medical scanners, could not be patched by the trust at all."
    },
    {
      "id": "one-step",
      "kind": "choice",
      "after": "nhs-cost",
      "prompt": "Looking back, which single step would have protected most of the infected NHS machines?",
      "options": [
        { "text": "Applying the March MS17-010 update to Windows 7", "correct": true, "why": "Most infected machines were supported Windows 7 without the patch." },
        { "text": "Replacing every Windows XP computer", "why": "XP got the headlines, but XP machines were a small minority of the infections." },
        { "text": "Blocking email attachments", "why": "WannaCry spread over SMB, not email; NHSmail carried no infections." },
        { "text": "Paying the ransom quickly", "why": "Payment would not stop the worm spreading, and no NHS organisation paid." }
      ],
      "explain": "The most effective defence was also the least dramatic: install the update that already existed. Isolating unpatchable devices and closing port 445 at the edge would have covered most of the rest."
    }
  ],
  "wrap": {
    "heading": "What WannaCry shows",
    "text": [
      "WannaCry was not a story about an unknown flaw. The fix came out a month before the exploit was leaked and two months before the outbreak; the warning reached the NHS within days. What failed was the long middle: turning a published patch into installed patches on every machine.",
      "Read the timeline again through its causes: a leak and an unpatched estate were the conditions, the worm's release was the trigger, and a researcher's routine curiosity was the turning point that stopped it."
    ],
    "takeaways": [
      "A patch protects only the machines it is installed on.",
      "A leaked exploit can be turned into a weapon within weeks.",
      "A worm needs no clicks; one unpatched machine can infect a network.",
      "Warnings without someone who must act on them change little.",
      "Separate triggers (why then) from conditions (why possible)."
    ]
  },
  "references": [
    { "title": "Security experts agree: the NSA was hacked", "publisher": "MIT Technology Review, August 2016", "url": "https://www.technologyreview.com/s/602201/security-experts-agree-the-nsa-was-hacked/" },
    { "title": "Microsoft Security Bulletin MS17-010 – Critical", "publisher": "Microsoft", "url": "https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010" },
    { "title": "Protecting customers and evaluating risk", "publisher": "Microsoft Security Response Center, April 2017", "url": "https://www.microsoft.com/en-us/msrc/blog/2017/04/protecting-customers-and-evaluating-risk" },
    { "title": "Indicators Associated With WannaCry Ransomware (TA17-132A)", "publisher": "CISA / US-CERT", "url": "https://www.cisa.gov/news-events/alerts/2017/05/12/indicators-associated-wannacry-ransomware" },
    { "title": "Player 3 Has Entered the Game: Say Hello to 'WannaCry'", "publisher": "Cisco Talos", "url": "https://blog.talosintelligence.com/wannacry/" },
    { "title": "WannaCry ransomware used in widespread attacks all over the world", "publisher": "Kaspersky Securelist", "url": "https://securelist.com/wannacry-ransomware-used-in-widespread-attacks-all-over-the-world/78351/" },
    { "title": "Investigation: WannaCry cyber attack and the NHS", "publisher": "National Audit Office, October 2017", "url": "https://www.nao.org.uk/reports/investigation-wannacry-cyber-attack-and-the-nhs/" },
    { "title": "The WannaCry sinkhole", "publisher": "TechCrunch, July 2019", "url": "https://techcrunch.com/2019/07/08/the-wannacry-sinkhole/" },
    { "title": "Customer Guidance for WannaCrypt attacks", "publisher": "Microsoft Security Response Center", "url": "https://www.microsoft.com/en-us/msrc/blog/2017/05/customer-guidance-for-wannacrypt-attacks" },
    { "title": "Ransomware attack hit 200,000 victims in 150 countries", "publisher": "Al Jazeera, May 2017", "url": "https://www.aljazeera.com/news/2017/5/14/ransomware-attack-hit-200000-victims-in-150-countries" },
    { "title": "Windows 7 most hit by WannaCry ransomware", "publisher": "SecurityWeek, May 2017", "url": "https://www.securityweek.com/windows-7-most-hit-wannacry-ransomware/" },
    { "title": "Petya Ransomware (TA17-181A)", "publisher": "CISA / US-CERT", "url": "https://www.cisa.gov/news-events/alerts/2017/07/01/petya-ransomware" },
    { "title": "Press briefing on the attribution of the WannaCry malware attack to North Korea", "publisher": "The American Presidency Project, December 2017", "url": "https://www.presidency.ucsb.edu/documents/press-briefing-assistant-the-president-for-homeland-security-and-counterterrorism-tom" },
    { "title": "US charges North Korean hacker over Sony, WannaCry and Bangladesh Bank", "publisher": "CyberScoop, September 2018", "url": "https://cyberscoop.com/north-korea-indictment-sony-pictures-wannacry/" },
    { "title": "Securing cyber resilience in health and care: October 2018 update", "publisher": "UK Department of Health and Social Care", "url": "https://www.gov.uk/government/publications/securing-cyber-resilience-in-health-and-care-october-2018-update" },
    { "title": "The need for urgent collective action to keep people safe online", "publisher": "Microsoft On the Issues, May 2017", "url": "https://blogs.microsoft.com/on-the-issues/2017/05/14/need-urgent-collective-action-keep-people-safe-online-lessons-last-weeks-cyberattack/" }
  ]
}
```
