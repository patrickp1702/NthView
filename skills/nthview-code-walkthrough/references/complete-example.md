# Code Walkthrough complete example

A complete, valid walkthrough of Heartbleed (CVE-2014-0160) that exercises every field; it is the data of `examples/example.html`.

```json
{
  "schemaVersion": 1,
  "title": "Heartbleed, line by line",
  "subtitle": "How OpenSSL's heartbeat handler leaked server memory (CVE-2014-0160), and the two lines that fixed it",
  "intro": [
    "On 7 April 2014 OpenSSL published a security advisory for CVE-2014-0160, soon known as **Heartbleed**. A missing bounds check in the TLS heartbeat extension let anyone connected to a server, or to a client, read up to 64 KB of that program's memory, again and again, without leaving a trace in the logs.",
    "The bug sat in one short function, `tls1_process_heartbeat` in `ssl/t1_lib.c`, from OpenSSL 1.0.1 (March 2012) to 1.0.1f. You will read it as it was in 1.0.1f, then read the fix from commit 96db902. All code is quoted from the public OpenSSL repository; the excerpts stop where the rest of the function no longer matters."
  ],
  "goal": "Explain why tls1_process_heartbeat leaked memory, and which comparison the fix adds.",
  "opening": {
    "id": "predict-the-reply",
    "kind": "choice",
    "prompt": "Predict before you read: a peer sends a heartbeat request whose length field claims a 16,384-byte payload, but the whole message is only 3 bytes long. What does the vulnerable server send back?",
    "options": [
      {
        "text": "Nothing: it sees that the message is too short and drops it.",
        "why": "That is what the fixed version does. The question is whether 1.0.1f ever compares the claim with what arrived."
      },
      {
        "text": "A TLS alert saying the message is malformed.",
        "why": "A reasonable guess for a careful protocol stack, but nothing in this handler sends an alert."
      },
      {
        "text": "A reply carrying 16,384 bytes, almost all of them from its own memory.",
        "correct": true,
        "why": "Yes. The handler builds its reply from the claimed length, and the claim is never checked."
      },
      {
        "text": "A 3-byte reply that echoes the message.",
        "why": "Echoing what actually arrived would be safe; the handler echoes what the peer says arrived."
      }
    ],
    "explain": "This is a prediction, not a test. Keep your answer in mind: the walkthrough shows exactly where the claimed length is read, where it is trusted, and where the fix stops it."
  },
  "snippets": [
    {
      "id": "before",
      "title": "Before the fix",
      "path": "ssl/t1_lib.c",
      "lang": "c",
      "startLine": 2552,
      "caption": "OpenSSL 1.0.1f, lines 2552–2602: the start of tls1_process_heartbeat and its request branch. The response branch and the final return 0; that follow are not shown.",
      "code": "#ifndef OPENSSL_NO_HEARTBEATS\nint\ntls1_process_heartbeat(SSL *s)\n\t{\n\tunsigned char *p = &s->s3->rrec.data[0], *pl;\n\tunsigned short hbtype;\n\tunsigned int payload;\n\tunsigned int padding = 16; /* Use minimum padding */\n\n\t/* Read type and payload length first */\n\thbtype = *p++;\n\tn2s(p, payload);\n\tpl = p;\n\n\tif (s->msg_callback)\n\t\ts->msg_callback(0, s->version, TLS1_RT_HEARTBEAT,\n\t\t\t&s->s3->rrec.data[0], s->s3->rrec.length,\n\t\t\ts, s->msg_callback_arg);\n\n\tif (hbtype == TLS1_HB_REQUEST)\n\t\t{\n\t\tunsigned char *buffer, *bp;\n\t\tint r;\n\n\t\t/* Allocate memory for the response, size is 1 bytes\n\t\t * message type, plus 2 bytes payload length, plus\n\t\t * payload, plus padding\n\t\t */\n\t\tbuffer = OPENSSL_malloc(1 + 2 + payload + padding);\n\t\tbp = buffer;\n\t\t\n\t\t/* Enter response type, length and copy payload */\n\t\t*bp++ = TLS1_HB_RESPONSE;\n\t\ts2n(payload, bp);\n\t\tmemcpy(bp, pl, payload);\n\t\tbp += payload;\n\t\t/* Random padding */\n\t\tRAND_pseudo_bytes(bp, padding);\n\n\t\tr = ssl3_write_bytes(s, TLS1_RT_HEARTBEAT, buffer, 3 + payload + padding);\n\n\t\tif (r >= 0 && s->msg_callback)\n\t\t\ts->msg_callback(1, s->version, TLS1_RT_HEARTBEAT,\n\t\t\t\tbuffer, 3 + payload + padding,\n\t\t\t\ts, s->msg_callback_arg);\n\n\t\tOPENSSL_free(buffer);\n\n\t\tif (r < 0)\n\t\t\treturn r;\n\t\t}"
    },
    {
      "id": "n2s",
      "title": "The n2s macro",
      "path": "ssl/ssl_locl.h",
      "lang": "c",
      "startLine": 249,
      "caption": "OpenSSL 1.0.1f, lines 249–252: n2s reads a 2-byte number from the network, s2n writes one.",
      "code": "#define n2s(c,s)\t((s=(((unsigned int)(c[0]))<< 8)| \\\n\t\t\t    (((unsigned int)(c[1]))    )),c+=2)\n#define s2n(s,c)\t((c[0]=(unsigned char)(((s)>> 8)&0xff), \\\n\t\t\t  c[1]=(unsigned char)(((s)    )&0xff)),c+=2)"
    },
    {
      "id": "after",
      "title": "After the fix",
      "path": "ssl/t1_lib.c",
      "lang": "c",
      "startLine": 2582,
      "caption": "Commit 96db902 (“Add heartbeat extension bounds check.”), lines 2582–2621. The rest of the function is unchanged.",
      "code": "#ifndef OPENSSL_NO_HEARTBEATS\nint\ntls1_process_heartbeat(SSL *s)\n\t{\n\tunsigned char *p = &s->s3->rrec.data[0], *pl;\n\tunsigned short hbtype;\n\tunsigned int payload;\n\tunsigned int padding = 16; /* Use minimum padding */\n\n\tif (s->msg_callback)\n\t\ts->msg_callback(0, s->version, TLS1_RT_HEARTBEAT,\n\t\t\t&s->s3->rrec.data[0], s->s3->rrec.length,\n\t\t\ts, s->msg_callback_arg);\n\n\t/* Read type and payload length first */\n\tif (1 + 2 + 16 > s->s3->rrec.length)\n\t\treturn 0; /* silently discard */\n\thbtype = *p++;\n\tn2s(p, payload);\n\tif (1 + 2 + payload + 16 > s->s3->rrec.length)\n\t\treturn 0; /* silently discard per RFC 6520 sec. 4 */\n\tpl = p;\n\n\tif (hbtype == TLS1_HB_REQUEST)\n\t\t{\n\t\tunsigned char *buffer, *bp;\n\t\tint r;\n\n\t\t/* Allocate memory for the response, size is 1 bytes\n\t\t * message type, plus 2 bytes payload length, plus\n\t\t * payload, plus padding\n\t\t */\n\t\tbuffer = OPENSSL_malloc(1 + 2 + payload + padding);\n\t\tbp = buffer;\n\t\t\n\t\t/* Enter response type, length and copy payload */\n\t\t*bp++ = TLS1_HB_RESPONSE;\n\t\ts2n(payload, bp);\n\t\tmemcpy(bp, pl, payload);\n\t\tbp += payload;"
    }
  ],
  "steps": [
    {
      "id": "entry-point",
      "snippet": "before",
      "lines": [
        2552,
        2555
      ],
      "focus": [
        {
          "line": 2552,
          "text": "OPENSSL_NO_HEARTBEATS"
        }
      ],
      "subgoal": "Find the entry point",
      "title": "A handler you could compile out",
      "note": [
        "OpenSSL calls `tls1_process_heartbeat` for every heartbeat message that arrives on a TLS connection. Heartbeats (RFC 6520) let one side ask “are you still there?” and get the same bytes echoed back, without renegotiating the connection.",
        "The whole function sits inside `#ifndef OPENSSL_NO_HEARTBEATS`. That is why the advisory offered a workaround for anyone who could not upgrade at once: recompile with `-DOPENSSL_NO_HEARTBEATS` and the vulnerable code is simply not built."
      ],
      "checks": [
        {
          "id": "workaround",
          "kind": "choice",
          "prompt": "Your server cannot be upgraded to 1.0.1g today. What does the advisory suggest instead?",
          "options": [
            {
              "text": "Recompile OpenSSL with -DOPENSSL_NO_HEARTBEATS.",
              "correct": true,
              "why": "The #ifndef on line 2552 removes the handler entirely, so there is nothing left to exploit."
            },
            {
              "text": "Turn on TLS logging so attacks show up.",
              "why": "Heartbleed requests look like ordinary heartbeats; heartbleed.com notes that exploitation leaves no trace in the logs."
            },
            {
              "text": "Disable TLS 1.0 and keep TLS 1.2.",
              "why": "Heartbeats are an extension negotiated in any of these versions; the bug is in the extension's handler, not in one protocol version."
            }
          ],
          "explain": "The 7 April 2014 advisory: upgrade to 1.0.1g, or, if that is not possible, recompile OpenSSL with -DOPENSSL_NO_HEARTBEATS."
        }
      ]
    },
    {
      "id": "the-record",
      "snippet": "before",
      "lines": [
        2556,
        2559
      ],
      "focus": [
        {
          "line": 2556,
          "text": "&s->s3->rrec.data[0]"
        }
      ],
      "subgoal": "Find the entry point",
      "title": "Where the bytes come from",
      "note": [
        "`s->s3->rrec` is the record that just arrived. `rrec.data` holds its bytes and `rrec.length` says how many bytes **actually** arrived. Keep `rrec.length` in mind: it is the one number in this function the peer cannot lie about.",
        "`p` starts at the first byte of the heartbeat message. `payload` will hold a length, and `padding` is fixed at 16, the minimum that RFC 6520 requires.",
        "From here on we follow one malicious message of exactly three bytes: `01 40 00`."
      ],
      "watch": [
        {
          "name": "rrec.length",
          "value": "3",
          "note": "the attacker's whole message: 01 40 00"
        },
        {
          "name": "p",
          "value": "→ rrec.data[0]",
          "note": "points at 01"
        },
        {
          "name": "padding",
          "value": "16"
        }
      ]
    },
    {
      "id": "read-type",
      "snippet": "before",
      "lines": [
        2561,
        2562
      ],
      "focus": [
        {
          "line": 2562,
          "text": "*p++"
        }
      ],
      "subgoal": "Read what the peer claims",
      "title": "One byte of type",
      "note": [
        "`*p++` reads one byte and moves `p` past it. RFC 6520 defines type 1 as `heartbeat_request` and type 2 as `heartbeat_response`; OpenSSL calls them `TLS1_HB_REQUEST` and `TLS1_HB_RESPONSE`.",
        "Our message starts with `01`, so this is a request: the server is being asked to echo a payload back."
      ],
      "watch": [
        {
          "name": "hbtype",
          "value": "1",
          "note": "TLS1_HB_REQUEST"
        },
        {
          "name": "p",
          "value": "→ rrec.data[1]",
          "note": "points at 40"
        }
      ]
    },
    {
      "id": "n2s-macro",
      "snippet": "n2s",
      "lines": [
        249,
        250
      ],
      "focus": [
        {
          "line": 249,
          "text": "<< 8"
        },
        {
          "line": 250,
          "text": "c+=2"
        }
      ],
      "subgoal": "Read what the peer claims",
      "title": "How n2s reads two bytes",
      "note": [
        "`n2s` means “network to short”. It reads two bytes in network (big-endian) order: the first byte shifted left by 8, joined with the second. Then `c+=2` moves the pointer past both.",
        "Two bytes can hold any value from 0 to 65,535, so a peer can claim a payload of up to about 64 KB. Its twin `s2n` on lines 251–252 writes a number back out the same way."
      ],
      "checks": [
        {
          "id": "decode-length",
          "kind": "predict",
          "ask": "before",
          "prompt": "After the type byte, the attacker's message holds the two bytes 40 00 (hexadecimal). What number does n2s put into payload? Answer in decimal.",
          "answer": "16384",
          "accept": [
            "0x4000"
          ],
          "hint": "0x40 is 64. The first byte is worth 256 times its value.",
          "explain": "0x40 × 256 + 0x00 = 64 × 256 = 16,384. The largest possible claim, FF FF, is 65,535: the “up to 64k” in the advisory."
        }
      ]
    },
    {
      "id": "claimed-length",
      "snippet": "before",
      "lines": [
        2563,
        2564
      ],
      "focus": [
        {
          "line": 2563,
          "text": "n2s(p, payload)"
        },
        {
          "line": 2564,
          "text": "pl = p"
        }
      ],
      "subgoal": "Read what the peer claims",
      "title": "A length the peer chose",
      "note": [
        "`payload` now holds what the peer **says** the payload length is, and `pl` points to where that payload should start.",
        "Nothing on these lines, and nothing before the copy further down, compares `payload` with `s->s3->rrec.length`. Our message ended after its third byte, so `pl` already points one byte past the end of what arrived."
      ],
      "watch": [
        {
          "name": "payload",
          "value": "16384",
          "note": "claimed by the peer"
        },
        {
          "name": "pl",
          "value": "→ rrec.data[3]",
          "note": "one past the last byte received"
        },
        {
          "name": "rrec.length",
          "value": "3"
        }
      ],
      "checks": [
        {
          "id": "compared-with",
          "kind": "choice",
          "ask": "before",
          "prompt": "By the end of line 2564, what has payload been compared with?",
          "options": [
            {
              "text": "s->s3->rrec.length, the bytes that arrived",
              "why": "That comparison is exactly what the fix adds. In 1.0.1f it is missing."
            },
            {
              "text": "padding, so the reply stays small",
              "why": "padding is only added to the reply's size later; it is never compared with anything."
            },
            {
              "text": "Nothing: the claim is trusted as sent",
              "correct": true,
              "why": "Right. The only check on payload is that it fits in two bytes, which the format guarantees anyway."
            }
          ],
          "explain": "A length field is a claim. Until it is checked against the bytes you actually hold, any code that uses it is trusting the sender."
        }
      ]
    },
    {
      "id": "debug-hook",
      "snippet": "before",
      "lines": [
        2566,
        2569
      ],
      "focus": [
        {
          "line": 2568,
          "text": "s->s3->rrec.length"
        }
      ],
      "subgoal": "Read what the peer claims",
      "title": "A debugging hook, not a check",
      "note": [
        "`msg_callback` lets an application watch protocol messages go by. It is handed the real record and its real length, `rrec.length`, but it only observes: it cannot reject the message.",
        "So the true length is right there on line 2568, two lines from where it is needed. The fix moves this call above the parsing and puts the checks in its place: see [[fix-minimum]]."
      ]
    },
    {
      "id": "allocate",
      "snippet": "before",
      "lines": [
        2571,
        2580
      ],
      "focus": [
        {
          "line": 2580,
          "text": "1 + 2 + payload + padding"
        }
      ],
      "subgoal": "Build the reply",
      "title": "A reply sized from the claim",
      "note": [
        "For a request, the server allocates its reply: 1 byte of type, 2 bytes of length, the payload, and the padding.",
        "The size comes from the claimed `payload`, so the buffer is big enough for what the code is about to write. The danger is not where the bytes go but where they come **from**."
      ],
      "watch": [
        {
          "name": "hbtype",
          "value": "1",
          "note": "the if is true"
        },
        {
          "name": "buffer size",
          "value": "16403",
          "note": "1 + 2 + 16384 + 16"
        }
      ],
      "checks": [
        {
          "id": "find-malloc",
          "kind": "spot",
          "prompt": "Tap the line that decides how big the reply buffer is.",
          "lines": [
            2571,
            2591
          ],
          "answer": [
            2580
          ],
          "miss": [
            {
              "line": 2573,
              "text": "This declares the pointers; it allocates nothing."
            },
            {
              "line": 2591,
              "text": "This sends the reply. It uses the same size, but the buffer already exists."
            }
          ],
          "explain": "Line 2580 calls OPENSSL_malloc with 1 + 2 + payload + padding: the reply is sized from the peer's claim."
        }
      ]
    },
    {
      "id": "echo-header",
      "snippet": "before",
      "lines": [
        2581,
        2585
      ],
      "focus": [
        {
          "line": 2585,
          "text": "s2n(payload, bp)"
        }
      ],
      "subgoal": "Build the reply",
      "title": "Type and length, echoed",
      "note": [
        "`bp` walks through the new buffer. The first byte becomes `TLS1_HB_RESPONSE` (type 2) and `s2n` writes the claimed length back in two bytes, the mirror of [[n2s-macro]].",
        "So far the reply only repeats what the peer said. The next line fills in the payload."
      ]
    },
    {
      "id": "the-overread",
      "snippet": "before",
      "lines": [
        2586,
        2587
      ],
      "focus": [
        {
          "line": 2586,
          "text": "memcpy(bp, pl, payload)"
        }
      ],
      "subgoal": "Build the reply",
      "title": "The over-read",
      "note": [
        "`memcpy` copies exactly `payload` bytes starting at `pl`. It has no idea how many bytes the record really holds: it was told 16,384, so it copies 16,384.",
        "The record held three bytes and all three are already behind `pl`, so every copied byte is whatever happens to lie in the process's memory after the record. This is the whole of Heartbleed: an **over-read** driven by a length the attacker chose."
      ],
      "watch": [
        {
          "name": "bytes copied",
          "value": "16384"
        },
        {
          "name": "from the record",
          "value": "0"
        },
        {
          "name": "from other memory",
          "value": "16384",
          "note": "whatever lies after the record"
        }
      ],
      "checks": [
        {
          "id": "find-overread",
          "kind": "spot",
          "prompt": "Tap the line that reads memory the peer never sent.",
          "lines": [
            2571,
            2591
          ],
          "answer": [
            2586
          ],
          "miss": [
            {
              "line": 2580,
              "text": "This only reserves space for the reply. Allocating too much would waste memory, not reveal it."
            },
            {
              "line": 2585,
              "text": "s2n writes the claimed length into the reply. It reads nothing from the record."
            },
            {
              "line": 2589,
              "text": "This fills the padding with fresh random bytes; it reads no memory from elsewhere."
            }
          ],
          "explain": "Line 2586: memcpy(bp, pl, payload) reads payload bytes starting at pl, far beyond the 3 bytes that arrived."
        },
        {
          "id": "why-no-stop",
          "kind": "choice",
          "prompt": "Why does memcpy not stop at the end of the record?",
          "options": [
            {
              "text": "It copies exactly the count it is given and cannot know where its source ends.",
              "correct": true,
              "why": "Right. In C, a pointer carries no length; only the code that calls memcpy can know the real size."
            },
            {
              "text": "It does stop, at the first zero byte.",
              "why": "That is how strcpy behaves with strings. memcpy copies raw bytes, zeros included."
            },
            {
              "text": "The operating system stops it as soon as it leaves the record.",
              "why": "The OS only faults on memory the process does not own. Memory right after the record usually belongs to the same process, so the copy succeeds silently."
            }
          ],
          "explain": "Bounds in C are the caller's job. Here the caller had the true length (rrec.length) and did not use it."
        }
      ]
    },
    {
      "id": "send-it-back",
      "snippet": "before",
      "lines": [
        2588,
        2596
      ],
      "focus": [
        {
          "line": 2591,
          "text": "3 + payload + padding"
        }
      ],
      "subgoal": "Build the reply",
      "title": "Sent straight back",
      "note": [
        "Random padding is added and `ssl3_write_bytes` sends all `3 + payload + padding` bytes to the peer. The attacker receives about 16 KB of server memory, and can ask again with a new heartbeat as often as they like.",
        "heartbleed.com lists what that memory held in practice: secret keys, user names and passwords, and the protected content itself. And nothing about the request looks abnormal in the logs."
      ],
      "checks": [
        {
          "id": "uses-of-payload",
          "kind": "spot",
          "select": "all",
          "prompt": "Trace the claim: tap every line in the request branch that uses the peer's payload value.",
          "lines": [
            2571,
            2602
          ],
          "answer": [
            2580,
            2585,
            2586,
            2587,
            2591,
            2595
          ],
          "explain": "Six lines use payload: the allocation (2580), the echoed length (2585), the copy (2586), the pointer step (2587), the send (2591) and the callback (2595). One check before all of them would protect every one."
        },
        {
          "id": "what-leaks",
          "kind": "choice",
          "prompt": "What can the attacker find in the echoed bytes?",
          "options": [
            {
              "text": "Only the 16 random padding bytes.",
              "why": "The padding is random and harmless, but it is only 16 of the 16,403 bytes sent."
            },
            {
              "text": "Whatever the process held in nearby memory: keys, passwords, other users' data.",
              "correct": true,
              "why": "Yes. The copied bytes come from the server's own memory, which holds secrets for every connection it serves."
            },
            {
              "text": "Files copied straight from the server's disk.",
              "why": "memcpy reads memory, not files. File contents leak only if the process happened to hold them in memory."
            }
          ],
          "explain": "The leak is limited to memory of the process running OpenSSL, but that is exactly where TLS keeps its private keys and its users' secrets."
        }
      ]
    },
    {
      "id": "fix-minimum",
      "snippet": "after",
      "lines": [
        2591,
        2598
      ],
      "focus": [
        {
          "line": 2597,
          "text": "1 + 2 + 16 > s->s3->rrec.length"
        }
      ],
      "subgoal": "Check the claim against reality",
      "title": "First: is there room for a message at all?",
      "note": [
        "The fix first moves the `msg_callback` call up, so it still sees every message, then adds a check before anything is parsed.",
        "A heartbeat message needs at least 1 byte of type, 2 bytes of length and 16 bytes of padding. A record shorter than 19 bytes cannot be valid, so it is discarded and no reply is sent."
      ],
      "watch": [
        {
          "name": "1 + 2 + 16",
          "value": "19"
        },
        {
          "name": "rrec.length",
          "value": "3"
        },
        {
          "name": "result",
          "value": "return 0",
          "note": "our 3-byte message stops here"
        }
      ],
      "checks": [
        {
          "id": "why-sixteen",
          "kind": "choice",
          "ask": "before",
          "prompt": "Why does the first check add 16?",
          "options": [
            {
              "text": "RFC 6520 requires at least 16 bytes of padding in every heartbeat message.",
              "correct": true,
              "why": "Right: 1 type byte + 2 length bytes + at least 16 bytes of padding is the smallest legal message."
            },
            {
              "text": "It is the size of an encryption block.",
              "why": "A sensible guess, since AES blocks are 16 bytes, but the number comes from the heartbeat format, not from the cipher."
            },
            {
              "text": "It allows a 16-byte payload, the smallest useful one.",
              "why": "A payload may be empty; the 16 bytes are the padding that must follow it."
            }
          ],
          "explain": "RFC 6520 section 4 says the padding_length must be at least 16, so 19 bytes is the minimum."
        }
      ]
    },
    {
      "id": "fix-bound",
      "snippet": "after",
      "lines": [
        2599,
        2603
      ],
      "focus": [
        {
          "line": 2601,
          "text": "1 + 2 + payload + 16 > s->s3->rrec.length"
        }
      ],
      "subgoal": "Check the claim against reality",
      "title": "Then: does the claim fit what arrived?",
      "note": [
        "After reading the type and the claimed length, the fix compares the claim with reality: type, length, the claimed payload and the minimum padding must all fit inside the bytes that arrived. If they do not, the message is discarded silently.",
        "This is the rule RFC 6520 section 4 had stated from the start: a message whose payload_length is too large must be discarded silently. The comment on line 2602 cites it."
      ],
      "watch": [
        {
          "name": "payload",
          "value": "16384",
          "note": "a 19-byte message making this claim"
        },
        {
          "name": "1 + 2 + payload + 16",
          "value": "16403"
        },
        {
          "name": "rrec.length",
          "value": "19"
        },
        {
          "name": "result",
          "value": "return 0",
          "note": "16403 > 19: discarded"
        }
      ],
      "checks": [
        {
          "id": "complete-the-check",
          "kind": "fill",
          "prompt": "Complete the bound check the fix adds.",
          "code": "if (1 + 2 + payload + 16 > s->s3->rrec.length)\n\treturn 0; /* silently discard per RFC 6520 sec. 4 */",
          "blanks": [
            {
              "text": "payload",
              "options": [
                "payload",
                "padding",
                "hbtype"
              ]
            },
            {
              "text": "rrec.length",
              "options": [
                "rrec.length",
                "rrec.data",
                "rrec.type"
              ]
            },
            {
              "text": "return 0",
              "options": [
                "return 0",
                "return -1",
                "continue"
              ]
            }
          ],
          "explain": "The claimed payload, plus the 3 header bytes and 16 bytes of padding, must fit in rrec.length, the bytes that really arrived. If not, return 0 drops the message without a reply or an error."
        },
        {
          "id": "fixed-return",
          "kind": "predict",
          "prompt": "Against the fixed code, the attacker sends the same 3-byte message, 01 40 00. On which line does tls1_process_heartbeat return?",
          "answer": "2598",
          "accept": [
            "line 2598"
          ],
          "hint": "Which check runs first, before anything is read?",
          "explain": "Line 2597 compares 19 with rrec.length = 3 and line 2598 returns 0. The message never reaches the type or length reads."
        }
      ]
    },
    {
      "id": "copy-unchanged",
      "snippet": "after",
      "lines": [
        2614,
        2621
      ],
      "focus": [
        {
          "line": 2620,
          "text": "memcpy(bp, pl, payload)"
        }
      ],
      "subgoal": "Check the claim against reality",
      "title": "The same memcpy, now safe",
      "note": [
        "The request branch is unchanged: same allocation, same `memcpy(bp, pl, payload)`. It is safe now because, by the time it runs, `payload` is known to fit inside the record.",
        "The same commit applied the same checks to the DTLS version of the handler, `dtls1_process_heartbeat` in `ssl/d1_both.c`, which had the same bug."
      ],
      "checks": [
        {
          "id": "order-the-fix",
          "kind": "order",
          "prompt": "Put the fixed handler's key statements in the order they run. Each if is written on one line here. One block in the pair is a near-miss: leave it out.",
          "lines": [
            "if (1 + 2 + 16 > s->s3->rrec.length) return 0;",
            "hbtype = *p++;",
            "n2s(p, payload);",
            "if (1 + 2 + payload + 16 > s->s3->rrec.length) return 0;",
            "buffer = OPENSSL_malloc(1 + 2 + payload + padding);",
            "memcpy(bp, pl, payload);"
          ],
          "distractors": [
            {
              "text": "if (payload > s->s3->rrec.length) return 0;",
              "pairedWith": 3,
              "why": "Close, but the record also holds 3 header bytes and the padding. pl starts 3 bytes in, so a claim equal to rrec.length would still read 3 bytes past the end."
            }
          ],
          "explain": "Check that a message fits, read the type and the claim, check the claim against the record, and only then allocate and copy. Every use of payload now comes after the check."
        }
      ]
    }
  ],
  "summary": {
    "heading": "What you have learned",
    "points": [
      "A length field in a message is the sender's claim; the record length is what actually arrived.",
      "memcpy copies exactly the count it is given; the real size of its source never enters into it.",
      "One missing comparison let anyone read up to 64 KB of a server's memory per heartbeat, without a trace in the logs.",
      "The fix discards any message whose claimed payload does not fit in the record, as RFC 6520 section 4 already required."
    ],
    "closing": "Heartbleed was in OpenSSL 1.0.1 through 1.0.1f, from March 2012 until 1.0.1g on 7 April 2014. The lesson travels to any language: never let a length from the wire drive a copy until you have checked it against the bytes you actually hold.",
    "checks": [
      {
        "id": "explain-the-bug",
        "kind": "choice",
        "prompt": "Explain it in one sentence: what was the Heartbleed bug?",
        "options": [
          {
            "text": "The handler trusted a length sent by the peer and copied that many bytes without comparing it with the bytes that arrived.",
            "correct": true,
            "why": "Exactly: a trusted claim driving a memcpy, an over-read of up to 64 KB."
          },
          {
            "text": "The reply buffer was too small, so memcpy wrote past its end.",
            "why": "That would be a buffer overflow, a write. The buffer was sized from the same payload, so the write fit; the problem was reading from beyond the record."
          },
          {
            "text": "OpenSSL freed the reply buffer twice.",
            "why": "OPENSSL_free(buffer) runs once per request. The defect is the read from pl, not memory management."
          }
        ],
        "explain": "Heartbleed is a buffer over-read: input-controlled length, no bounds check, memory disclosure."
      }
    ]
  },
  "sources": [
    {
      "label": "OpenSSL Security Advisory, 7 April 2014: TLS heartbeat read overrun (CVE-2014-0160)",
      "href": "https://openssl-library.org/news/secadv/20140407.txt"
    },
    {
      "label": "OpenSSL commit 96db902: Add heartbeat extension bounds check.",
      "href": "https://github.com/openssl/openssl/commit/96db9023b881d7cd9f379b0c154650d6c108e9a3"
    },
    {
      "label": "ssl/t1_lib.c in OpenSSL 1.0.1f",
      "href": "https://github.com/openssl/openssl/blob/OpenSSL_1_0_1f/ssl/t1_lib.c"
    },
    {
      "label": "The Heartbleed Bug, heartbleed.com",
      "href": "https://heartbleed.com/"
    },
    {
      "label": "RFC 6520: TLS and DTLS Heartbeat Extension",
      "href": "https://www.rfc-editor.org/rfc/rfc6520"
    }
  ]
}
```
