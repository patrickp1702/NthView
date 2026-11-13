# Dataflow complete example

A complete, valid object that exercises every field in `schema.md`. It is the
exact data in `examples/example.html`; `scripts/build-html.js --example` reads
it from this file.

How a card payment is authorised: shopper, checkout page, payment gateway,
acquiring bank, card network, issuing bank with its fraud service, access
control server and ledger, in five topics over two versions of the
authentication step (3-D Secure 1 and 3-D Secure 2). Build the demo with:

    node scripts/build-html.js skills/nthview-dataflow --example skills/nthview-dataflow/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Card payments explained",
  "kicker": "Online card payments",
  "heading": "What happens when you pay by card?",
  "lead": "When you pay with a card online, the shop never talks to your bank. The request travels through a payment gateway, the shop's bank and the card network to **your** bank, which checks the card, the risk and the balance and answers in about a second. This explainer follows every message on that path, from the first tap to the money arriving days later.",
  "facts": [
    {
      "term": "Issuer",
      "text": "the bank that gave you the card; it says yes or no"
    },
    {
      "term": "Acquirer",
      "text": "the shop's bank; it collects the money on the shop's behalf"
    },
    {
      "term": "Card network",
      "text": "the rails between the two banks, which route by card number and settle the totals"
    },
    {
      "term": "Gateway",
      "text": "the service the shop integrates; it turns a web request into a bank message and keeps the card number out of the shop"
    },
    {
      "term": "Not a transfer",
      "text": "an authorisation moves no money. It places a hold; the money moves days later at settlement"
    }
  ],
  "startLabel": "Start the lessons",
  "jumps": [
    "authentication",
    "declines"
  ],
  "theme": "graphite",
  "versions": [
    {
      "id": "3ds1",
      "label": "3-D Secure 1",
      "date": "2001",
      "note": "Static passwords on a full-page redirect to the bank. Retired by the networks in October 2022."
    },
    {
      "id": "3ds2",
      "label": "3-D Secure 2",
      "date": "2016 onward",
      "note": "Device data, risk-based decisions and in-page challenges. The version in use today.",
      "default": true
    }
  ],
  "versionsLabel": "Authentication",
  "zones": [
    {
      "id": "device",
      "name": "SHOPPER'S DEVICE",
      "subtitle": "browser or app"
    },
    {
      "id": "merchant",
      "name": "MERCHANT",
      "subtitle": "shop and its gateway"
    },
    {
      "id": "acquiring",
      "name": "ACQUIRER",
      "subtitle": "the shop's bank",
      "remote": true
    },
    {
      "id": "scheme",
      "name": "CARD NETWORK",
      "subtitle": "the rails",
      "remote": true
    },
    {
      "id": "issuing",
      "name": "ISSUER",
      "subtitle": "the shopper's bank",
      "remote": true
    }
  ],
  "entities": [
    {
      "id": "shopper",
      "name": "Shopper",
      "subtitle": "you",
      "kind": "person",
      "zone": "device",
      "holds": [
        "card number",
        "CVV"
      ]
    },
    {
      "id": "checkout",
      "name": "Checkout page",
      "subtitle": "shop.example",
      "kind": "browser",
      "zone": "device"
    },
    {
      "id": "shop",
      "name": "Shop backend",
      "subtitle": "orders and tokens",
      "kind": "app",
      "zone": "merchant"
    },
    {
      "id": "gateway",
      "name": "Payment gateway",
      "subtitle": "pay.example",
      "kind": "gateway",
      "zone": "merchant"
    },
    {
      "id": "acquirer",
      "name": "Acquiring bank",
      "subtitle": "merchant account",
      "kind": "bank",
      "zone": "acquiring"
    },
    {
      "id": "network",
      "name": "Card network",
      "subtitle": "routes by card number",
      "kind": "network",
      "zone": "scheme"
    },
    {
      "id": "directory",
      "name": "Directory server",
      "subtitle": "3-D Secure lookup",
      "kind": "server",
      "zone": "scheme"
    },
    {
      "id": "issuer",
      "name": "Issuing bank",
      "subtitle": "authorisation host",
      "kind": "bank",
      "zone": "issuing"
    },
    {
      "id": "fraud",
      "name": "Fraud service",
      "subtitle": "risk scoring",
      "kind": "service",
      "zone": "issuing"
    },
    {
      "id": "acs",
      "name": "Access control server",
      "subtitle": "challenges the shopper",
      "kind": "server",
      "zone": "issuing"
    },
    {
      "id": "ledger",
      "name": "Ledger",
      "subtitle": "balances and holds",
      "kind": "database",
      "zone": "issuing"
    }
  ],
  "links": [
    {
      "from": "shopper",
      "to": "checkout",
      "label": "taps",
      "channel": "browser"
    },
    {
      "from": "checkout",
      "to": "shop",
      "label": "HTTPS",
      "channel": "browser"
    },
    {
      "from": "checkout",
      "to": "gateway",
      "label": "HTTPS",
      "channel": "browser"
    },
    {
      "from": "shop",
      "to": "gateway",
      "label": "REST API",
      "channel": "api"
    },
    {
      "from": "gateway",
      "to": "acquirer",
      "label": "ISO 8583",
      "channel": "rails"
    },
    {
      "from": "acquirer",
      "to": "network",
      "label": "ISO 8583",
      "channel": "rails"
    },
    {
      "from": "network",
      "to": "issuer",
      "label": "ISO 8583",
      "channel": "rails"
    },
    {
      "from": "issuer",
      "to": "fraud",
      "label": "internal",
      "channel": "internal"
    },
    {
      "from": "issuer",
      "to": "ledger",
      "label": "internal",
      "channel": "internal"
    },
    {
      "from": "gateway",
      "to": "directory",
      "label": "3-D Secure",
      "channel": "api"
    },
    {
      "from": "directory",
      "to": "acs",
      "label": "3-D Secure",
      "channel": "api"
    },
    {
      "from": "checkout",
      "to": "acs",
      "label": "HTTPS",
      "channel": "browser"
    },
    {
      "from": "acs",
      "to": "fraud",
      "label": "internal",
      "channel": "internal"
    }
  ],
  "sections": [
    {
      "title": "Checkout",
      "topics": [
        {
          "id": "capture",
          "title": "Capture the card",
          "subtitle": "From the card form to a token",
          "article": {
            "body": [
              "The shop wants to be paid, but it does not want to hold your card number: anyone who stores card numbers has to prove, every year, that they protect them. So the checkout page hands the number straight to the **payment gateway**, which gives back a **token**, a stand-in that is useless outside that gateway. The shop keeps the token and never sees the number.",
              "Everything the shop does later, authorising, capturing, refunding, refers to the token or to a payment id the gateway issued. The card number crosses the merchant's systems exactly zero times."
            ],
            "referencesLabel": "Background",
            "references": [
              {
                "label": "PCI DSS overview",
                "url": "https://www.pcisecuritystandards.org/standards/pci-dss/"
              }
            ]
          },
          "steps": [
            {
              "title": "Enter the card",
              "explanation": "You type the card number, expiry and security code into a form. The form belongs to the shop's page, but its fields are served by the gateway, so the shop's own code never reads them.",
              "messages": [
                {
                  "from": "shopper",
                  "to": "checkout",
                  "name": "type card details",
                  "info": "number, expiry, CVV, name",
                  "kind": "transport",
                  "holds": {
                    "checkout": {
                      "add": [
                        "card number",
                        "CVV"
                      ]
                    }
                  }
                }
              ]
            },
            {
              "title": "Tokenise",
              "explanation": "The page posts the card data to the gateway and gets a token back. The gateway stores the real number in its vault; the token is just a reference to it.",
              "check": {
                "prompt": "Why does the page send the card number to the gateway rather than to the shop's own server?",
                "options": [
                  {
                    "text": "So the shop never stores card numbers and its security audit covers far less",
                    "correct": true,
                    "why": "Right. The fewer systems that touch the number, the smaller the surface an attacker can hit and the smaller the compliance scope the shop must prove every year."
                  },
                  {
                    "text": "Because browsers cannot post card numbers to the same site that served the page",
                    "why": "Browsers do not care what a field contains. The choice is about who is allowed to hold the number, not about what is technically possible."
                  },
                  {
                    "text": "Because the gateway needs the shopper's IP address for fraud checks",
                    "why": "The gateway may collect device data, but that would work through the shop's server too. Keeping the number out of the shop is the reason."
                  }
                ]
              },
              "messages": [
                {
                  "from": "checkout",
                  "to": "gateway",
                  "name": "POST /v1/tokens",
                  "info": "card data, over TLS",
                  "kind": "request",
                  "size": "210 B",
                  "payload": {
                    "card": {
                      "number": "4111 1111 1111 1111",
                      "expMonth": 9,
                      "expYear": 2028,
                      "cvc": "123"
                    },
                    "billing": {
                      "name": "A. Shopper",
                      "postalCode": "10115"
                    }
                  },
                  "annotations": [
                    {
                      "field": "card.number",
                      "text": "The primary account number (PAN). The first six to eight digits, the BIN, identify the issuing bank."
                    },
                    {
                      "field": "card.cvc",
                      "text": "The three-digit code from the back. It may never be stored after authorisation, by anyone, not even the gateway."
                    },
                    {
                      "field": "billing.postalCode",
                      "text": "Used by the issuer for address verification; a mismatch lowers the risk score but rarely declines on its own."
                    }
                  ],
                  "holds": {
                    "gateway": {
                      "add": [
                        "card number (vault)",
                        "CVV (until authorisation)"
                      ]
                    }
                  }
                },
                {
                  "from": "gateway",
                  "to": "checkout",
                  "name": "201 Created",
                  "info": "token, last four digits, brand",
                  "kind": "response",
                  "size": "140 B",
                  "payload": {
                    "token": "tok_7f3a9c2e1b",
                    "last4": "1111",
                    "brand": "visa",
                    "expMonth": 9,
                    "expYear": 2028
                  },
                  "annotations": [
                    {
                      "field": "token",
                      "text": "A random id meaningful only inside this gateway. Stealing it from the shop gives an attacker nothing."
                    },
                    {
                      "field": "last4",
                      "text": "Enough for the shopper to recognise the card on a receipt; not enough to reconstruct the number."
                    }
                  ],
                  "holds": {
                    "checkout": {
                      "add": [
                        "token"
                      ],
                      "remove": [
                        "card number",
                        "CVV"
                      ]
                    }
                  }
                }
              ]
            },
            {
              "title": "Place the order",
              "explanation": "The page sends the token to the shop with the basket. The shop creates the order, then asks the gateway to create a payment for the amount, naming the token. Nothing has reached a bank yet.",
              "messages": [
                {
                  "from": "checkout",
                  "to": "shop",
                  "name": "POST /orders",
                  "info": "basket and token",
                  "kind": "request",
                  "payload": {
                    "items": [
                      {
                        "sku": "lamp-01",
                        "qty": 1,
                        "price": 4995
                      }
                    ],
                    "currency": "EUR",
                    "paymentToken": "tok_7f3a9c2e1b"
                  },
                  "annotations": [
                    {
                      "field": "price",
                      "text": "Amounts travel as integers in the minor unit: 4995 is 49.95 euro. Floating point never touches money."
                    },
                    {
                      "field": "paymentToken",
                      "text": "The only card-related value the shop ever stores."
                    }
                  ],
                  "holds": {
                    "shop": {
                      "add": [
                        "order",
                        "token"
                      ]
                    }
                  }
                },
                {
                  "from": "shop",
                  "to": "gateway",
                  "name": "POST /v1/payments",
                  "info": "amount, token, 3-D Secure requested",
                  "kind": "request",
                  "payload": {
                    "amount": 4995,
                    "currency": "EUR",
                    "source": "tok_7f3a9c2e1b",
                    "authenticate": "when-required",
                    "capture": false,
                    "reference": "order-20481"
                  },
                  "annotations": [
                    {
                      "field": "capture",
                      "text": "false asks for authorisation only. The shop captures later, when it ships; see the settlement topic."
                    },
                    {
                      "field": "authenticate",
                      "text": "Lets the gateway decide whether to run 3-D Secure before asking the bank."
                    }
                  ]
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "202 Accepted",
                  "info": "payment id, status pending",
                  "kind": "response",
                  "payload": {
                    "id": "pay_01HZX8",
                    "status": "requires_authentication",
                    "next": "3ds"
                  },
                  "holds": {
                    "shop": {
                      "add": [
                        "payment id"
                      ]
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "id": "authentication",
          "title": "Authenticate the shopper",
          "subtitle": "3-D Secure: is it really you?",
          "article": {
            "body": [
              "Authorisation asks the bank whether the card is good for the amount. **Authentication** asks a different question: is the person typing really the cardholder? 3-D Secure is the protocol the card networks use for that. Three domains take part: the merchant's (the gateway's 3-D Secure server), the network's (a directory server that finds the right bank) and the issuer's (an access control server, ACS, that decides whether to challenge you and how).",
              "The two versions differ sharply. The first generation redirected you to a bank page that asked for a static password; shoppers abandoned carts and forgot passwords. The second generation sends the bank a hundred or so data points about the device and the purchase and lets the bank wave most payments through without asking anything. When it does ask, it does so in a small window on the shop's page, usually with a one-time code or an approval in the bank's app."
            ],
            "referencesLabel": "Specs",
            "references": [
              {
                "label": "EMV 3-D Secure",
                "url": "https://www.emvco.com/emv-technologies/3-d-secure/"
              }
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "What changed in 3-D Secure 2",
                "items": [
                  "The verify-enrolment round trip is gone; one authentication request carries device and transaction data.",
                  "Most payments are approved frictionless, without a challenge.",
                  "Challenges happen in-page, with one-time codes or app approval instead of static passwords.",
                  "Merchants can request exemptions, and issuers can answer a soft decline that asks for authentication."
                ]
              }
            ],
            "boxes": [
              {
                "title": "Why it matters",
                "tone": "attention",
                "items": [
                  {
                    "text": "A payment that passed authentication shifts fraud liability from the shop to the issuer."
                  },
                  {
                    "text": "In some regions regulation requires strong customer authentication for most online payments.",
                    "tag": "regional"
                  }
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Send the authentication request",
              "explanation": "The gateway's 3-D Secure server sends an authentication request to the directory server, which forwards it to the issuer's access control server. It carries the amount, the merchant and dozens of facts about your browser and device.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "authentication request with device data",
                  "size": "4 KB",
                  "payload": {
                    "messageType": "AReq",
                    "messageVersion": "2.2.0",
                    "threeDSServerTransID": "8a880dc0-d2d2-4067-bcb1-b08d1690b26e",
                    "acctNumber": "4111111111111111",
                    "purchaseAmount": "4995",
                    "purchaseCurrency": "978",
                    "merchantName": "Lamp Shop",
                    "browserUserAgent": "Mozilla/5.0 …",
                    "browserIP": "203.0.113.42",
                    "browserJavaEnabled": false,
                    "browserScreenHeight": "1080",
                    "deviceChannel": "02",
                    "threeDSRequestorChallengeInd": "01"
                  },
                  "annotations": [
                    {
                      "field": "deviceChannel",
                      "text": "02 means a browser; 01 is an app, 03 a merchant-initiated payment with no shopper present."
                    },
                    {
                      "field": "threeDSRequestorChallengeInd",
                      "text": "What the merchant prefers: 01 no preference, 02 no challenge requested, 03 challenge requested, 04 challenge mandated."
                    },
                    {
                      "field": "browserIP",
                      "text": "One of about a hundred optional data points the issuer feeds into its risk model."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "AReq",
                  "info": "routed by the card's BIN range",
                  "size": "4 KB"
                },
                {
                  "from": "acs",
                  "to": "fraud",
                  "name": "score",
                  "info": "device, history, amount, merchant",
                  "kind": "local"
                },
                {
                  "from": "fraud",
                  "to": "acs",
                  "name": "risk: medium",
                  "info": "new device for this card",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Verify enrolment",
                  "explanation": "The gateway first asks the directory server whether this card is enrolled in 3-D Secure at all. The directory forwards the question to the issuer and returns the answer with the address of the bank's page.",
                  "messages": [
                    {
                      "from": "gateway",
                      "to": "directory",
                      "name": "VEReq",
                      "info": "verify enrolment for this card number",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"1\">\n  <VEReq>\n    <version>1.0.2</version>\n    <pan>4111111111111111</pan>\n    <Merchant><acqBIN>123456</acqBIN><merID>lamp-shop</merID></Merchant>\n  </VEReq>\n</Message>",
                      "annotations": [
                        {
                          "field": "VEReq",
                          "text": "Verify Enrolment Request, an XML message. It asks only whether the card can be authenticated."
                        }
                      ]
                    },
                    {
                      "from": "directory",
                      "to": "acs",
                      "name": "VEReq",
                      "info": "is this card enrolled?",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "directory",
                      "name": "VERes",
                      "info": "enrolled = Y, ACS URL",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "directory",
                      "to": "gateway",
                      "name": "VERes",
                      "info": "enrolled = Y, ACS URL",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"1\">\n  <VERes>\n    <version>1.0.2</version>\n    <CH><enrolled>Y</enrolled><acctID>…</acctID></CH>\n    <url>https://acs.bank.example/pareq</url>\n  </VERes>\n</Message>"
                    }
                  ]
                }
              }
            },
            {
              "title": "Challenge the shopper",
              "explanation": "The issuer decided it wants more. The checkout page opens a small window served by the bank's access control server; you confirm with a one-time code or by approving in your banking app.",
              "check": {
                "prompt": "In 3-D Secure 2, what does the bank base its decision to challenge on?",
                "options": [
                  {
                    "text": "The device and transaction data in the authentication request, scored against the card's history",
                    "correct": true,
                    "why": "Right. Risk-based authentication is the whole point of the second version: the bank sees enough to approve most payments silently and challenges only the unusual ones."
                  },
                  {
                    "text": "A static password the shopper registered with the bank",
                    "why": "That was the first version. Static passwords were forgotten, phished and abandoned; the second version removed them."
                  },
                  {
                    "text": "The shop's reputation score at the card network",
                    "why": "The merchant's identity is one input among many, but the decision belongs to the issuer and rests on the shopper's device and behaviour."
                  }
                ]
              },
              "messages": [
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "ARes",
                  "info": "transStatus = C, challenge required",
                  "kind": "response",
                  "payload": {
                    "messageType": "ARes",
                    "transStatus": "C",
                    "acsURL": "https://acs.bank.example/challenge",
                    "acsTransID": "d7c45b2e-…",
                    "dsTransID": "f1a3c9…"
                  },
                  "annotations": [
                    {
                      "field": "transStatus",
                      "text": "Y authenticated, N not authenticated, C challenge required, A attempted, U unavailable, R rejected."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "transStatus = C",
                  "kind": "response"
                },
                {
                  "from": "checkout",
                  "to": "acs",
                  "name": "CReq",
                  "info": "opens the challenge window in-page",
                  "payload": {
                    "messageType": "CReq",
                    "messageVersion": "2.2.0",
                    "threeDSServerTransID": "8a880dc0-…",
                    "acsTransID": "d7c45b2e-…",
                    "challengeWindowSize": "03"
                  }
                },
                {
                  "from": "acs",
                  "to": "checkout",
                  "name": "challenge page",
                  "info": "enter the code we sent you",
                  "kind": "response"
                },
                {
                  "from": "shopper",
                  "to": "checkout",
                  "name": "one-time code",
                  "info": "typed from the bank's text message or app",
                  "kind": "transport"
                },
                {
                  "from": "checkout",
                  "to": "acs",
                  "name": "CReq",
                  "info": "with the code"
                },
                {
                  "from": "acs",
                  "to": "checkout",
                  "name": "CRes",
                  "info": "transStatus = Y",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Redirect to the bank's page",
                  "explanation": "The whole browser is sent to the bank's page, which asks for the static 3-D Secure password you set up when you got the card. Many shoppers never did, or forgot it, and gave up here.",
                  "messages": [
                    {
                      "from": "checkout",
                      "to": "acs",
                      "name": "POST PAReq",
                      "info": "full-page redirect to the bank",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"2\">\n  <PAReq>\n    <version>1.0.2</version>\n    <Purchase><amount>49.95</amount><currency>978</currency></Purchase>\n    <TermUrl>https://pay.example/3ds/return</TermUrl>\n  </PAReq>\n</Message>",
                      "annotations": [
                        {
                          "field": "TermUrl",
                          "text": "Where the bank should send the browser back when it is done."
                        }
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "checkout",
                      "name": "password page",
                      "info": "the bank's own page, full screen",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "shopper",
                      "to": "checkout",
                      "name": "static password",
                      "info": "set up once, rarely remembered",
                      "kind": "transport",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "checkout",
                      "to": "acs",
                      "name": "POST password",
                      "info": "checked by the bank",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "checkout",
                      "name": "PARes",
                      "info": "signed result, redirect back to TermUrl",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    }
                  ]
                }
              }
            },
            {
              "title": "Carry the proof",
              "explanation": "After a challenge the access control server reports the result to the gateway through the directory. The gateway now holds an authentication value and an indicator it can attach to the authorisation so the issuer knows this payment was authenticated.",
              "messages": [
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "RReq",
                  "info": "results request: transStatus Y, authentication value",
                  "payload": {
                    "messageType": "RReq",
                    "transStatus": "Y",
                    "eci": "05",
                    "authenticationValue": "AAABBJg0VhI0VniQEjRWAAAAAAA=",
                    "dsTransID": "f1a3c9…"
                  },
                  "annotations": [
                    {
                      "field": "authenticationValue",
                      "text": "A cryptogram the issuer can verify later in the authorisation message. Proof that authentication happened."
                    },
                    {
                      "field": "eci",
                      "text": "The electronic commerce indicator. 05 fully authenticated, 06 attempted, 07 no authentication (values vary by network)."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "RReq",
                  "info": "forwarded to the 3-D Secure server"
                },
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "RRes",
                  "info": "received",
                  "kind": "response"
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "RRes",
                  "info": "received",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Verify the signed result",
                  "explanation": "The browser came back carrying the PARes. The gateway checks the bank's signature on it and extracts the authentication value and the indicator for the authorisation.",
                  "messages": [
                    {
                      "from": "gateway",
                      "to": "gateway",
                      "name": "verify PARes signature",
                      "info": "extract CAVV and ECI",
                      "kind": "local",
                      "tags": [
                        "deprecated"
                      ]
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "id": "exemptions",
          "title": "Exemptions and frictionless flow",
          "subtitle": "When nobody asks you anything",
          "availableFrom": "3ds2",
          "article": {
            "body": [
              "Most 3-D Secure 2 payments never show a challenge. The issuer looks at the data in the authentication request, finds nothing unusual and answers **authenticated** straight away. The shopper notices nothing.",
              "Where regulation requires strong authentication, merchants and acquirers may also claim **exemptions**: low-value payments, payments to a merchant the shopper has whitelisted, or payments the acquirer judges low-risk under its own fraud rate. An exemption skips authentication entirely, so the liability for fraud stays with the merchant."
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "New in 3-D Secure 2",
                "items": [
                  "Frictionless approval based on device and transaction data.",
                  "Exemption flags in the authorisation and authentication messages."
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Frictionless approval",
              "explanation": "The access control server scores the request, finds a known device and a usual amount, and returns authenticated without a challenge. The gateway receives the proof in the same response.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "device data, known card"
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "AReq"
                },
                {
                  "from": "acs",
                  "to": "fraud",
                  "name": "score",
                  "kind": "local",
                  "info": "known device, usual amount"
                },
                {
                  "from": "fraud",
                  "to": "acs",
                  "name": "risk: low",
                  "kind": "response"
                },
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "ARes",
                  "info": "transStatus = Y, authentication value",
                  "kind": "response",
                  "payload": {
                    "messageType": "ARes",
                    "transStatus": "Y",
                    "eci": "05",
                    "authenticationValue": "AAABBJg0VhI0VniQEjRWAAAAAAA="
                  }
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "transStatus = Y",
                  "kind": "response"
                }
              ]
            },
            {
              "title": "Claim a low-value exemption",
              "explanation": "For a small amount the gateway may skip authentication and flag the exemption in the authorisation. The issuer can accept it or answer with a soft decline asking for authentication after all.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "exemption: low value",
                  "payload": {
                    "mti": "0100",
                    "pan": "411111******1111",
                    "amount": "000000000950",
                    "currency": "978",
                    "eci": "07",
                    "scaExemption": "low-value"
                  },
                  "annotations": [
                    {
                      "field": "scaExemption",
                      "text": "Tells the issuer which exemption the acquirer claims. The issuer may still insist on authentication."
                    },
                    {
                      "field": "eci",
                      "text": "07 says no authentication was performed."
                    }
                  ]
                },
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "0100",
                  "info": "forwarded"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "forwarded"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 00",
                  "info": "approved, exemption accepted",
                  "kind": "response"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "Authorisation",
      "topics": [
        {
          "id": "authorisation",
          "title": "Authorise the payment",
          "subtitle": "The one-second round trip to your bank",
          "article": {
            "body": [
              "An authorisation is a question: will this card pay this amount to this merchant right now? The gateway turns the shop's request into a bank message, the acquirer forwards it to the card network, the network looks at the first digits of the card number and hands it to the issuer. The issuer checks the card, scores the risk, checks the balance and answers with a two-character response code. The whole trip usually takes well under a second.",
              "The classic wire format is ISO 8583: a message type (`0100` for an authorisation request, `0110` for its response) followed by numbered fields. Modern gateways show it as JSON in their APIs, but the structure is the same and so are the codes."
            ],
            "referencesLabel": "Specs",
            "references": [
              {
                "label": "ISO 8583 overview",
                "url": "https://en.wikipedia.org/wiki/ISO_8583"
              }
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "What changed with 3-D Secure 2",
                "items": [
                  "The authorisation carries the authentication value and indicator from the frictionless or challenge flow.",
                  "Issuers may answer a soft decline that asks the merchant to authenticate and retry."
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Ask the acquirer",
              "explanation": "The gateway builds the authorisation request: card number, amount, currency, merchant id and the proof from authentication. It sends it over a dedicated connection to the acquiring bank.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "authorisation request",
                  "size": "~300 B",
                  "payload": {
                    "mti": "0100",
                    "pan": "411111******1111",
                    "processingCode": "000000",
                    "amount": "000000004995",
                    "currency": "978",
                    "stan": "482913",
                    "merchantId": "lamp-shop-00042",
                    "mcc": "5712",
                    "eci": "05",
                    "cavv": "AAABBJg0VhI0VniQEjRWAAAAAAA=",
                    "posEntryMode": "812"
                  },
                  "annotations": [
                    {
                      "field": "mti",
                      "text": "Message type indicator. 0100 is an authorisation request; 0110 its response; 0400 a reversal."
                    },
                    {
                      "field": "amount",
                      "text": "Twelve digits in the minor unit: 000000004995 is 49.95."
                    },
                    {
                      "field": "stan",
                      "text": "System trace audit number. Matches the response to the request and makes reversals possible."
                    },
                    {
                      "field": "mcc",
                      "text": "Merchant category code; 5712 is furniture. Issuers use it in risk rules."
                    },
                    {
                      "field": "cavv",
                      "text": "The authentication value from 3-D Secure. The issuer verifies it before trusting the ECI."
                    }
                  ]
                }
              ]
            },
            {
              "title": "Route by card number",
              "explanation": "The acquirer passes the message to the card network. The network reads the first digits, the bank identification number, finds the issuer that owns that range and forwards the request.",
              "messages": [
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "0100",
                  "info": "forwarded with the acquirer's id"
                },
                {
                  "from": "network",
                  "to": "network",
                  "name": "look up BIN 411111",
                  "info": "range belongs to the issuing bank",
                  "kind": "local"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "forwarded to the issuer's authorisation host"
                }
              ]
            },
            {
              "title": "The issuer decides",
              "explanation": "The issuer's host checks the card's status and expiry, asks its fraud service for a score, and asks the ledger whether the available balance covers the amount. If all is well it places a hold for the amount.",
              "check": {
                "prompt": "At the moment the issuer approves, where has the money moved?",
                "options": [
                  {
                    "text": "Nowhere yet: the issuer only places a hold on the shopper's available balance",
                    "correct": true,
                    "why": "Right. Authorisation reserves the amount. Money moves later, in clearing and settlement, and only for payments the merchant captures."
                  },
                  {
                    "text": "From the shopper's account to the shop's bank account",
                    "why": "The shop's account is credited days later, after capture, clearing and settlement. Nothing leaves the issuer at authorisation."
                  },
                  {
                    "text": "From the issuer to the card network, which holds it in escrow",
                    "why": "The network never holds the funds. It routes messages now and nets the totals between banks later."
                  }
                ]
              },
              "messages": [
                {
                  "from": "issuer",
                  "to": "fraud",
                  "name": "score transaction",
                  "info": "merchant, amount, device, velocity",
                  "kind": "local"
                },
                {
                  "from": "fraud",
                  "to": "issuer",
                  "name": "score 12 / 100",
                  "info": "low risk",
                  "kind": "response"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "available balance?",
                  "info": "account linked to the card",
                  "kind": "local"
                },
                {
                  "from": "ledger",
                  "to": "issuer",
                  "name": "1 240.00 available",
                  "kind": "response"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "place hold 49.95",
                  "info": "reduces available, not booked",
                  "kind": "local",
                  "payload": {
                    "op": "hold",
                    "account": "acct_…9921",
                    "amount": 4995,
                    "currency": "EUR",
                    "expiresInDays": 7,
                    "reference": "auth_a1b2c3"
                  },
                  "annotations": [
                    {
                      "field": "expiresInDays",
                      "text": "A hold that is never captured falls off after a few days; that is why a cancelled order can show a pending amount for a while."
                    }
                  ],
                  "holds": {
                    "ledger": {
                      "add": [
                        "hold 49.95"
                      ]
                    }
                  }
                }
              ]
            },
            {
              "title": "Approved",
              "explanation": "The response travels back the same path with response code 00 and an authorisation code. The gateway tells the shop, the shop confirms the order. Still no money has moved.",
              "messages": [
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 00",
                  "info": "approved, auth code 731204",
                  "kind": "response",
                  "payload": {
                    "mti": "0110",
                    "stan": "482913",
                    "responseCode": "00",
                    "authCode": "731204",
                    "avsResult": "Y",
                    "cvvResult": "M"
                  },
                  "annotations": [
                    {
                      "field": "responseCode",
                      "text": "00 approved. 05 do not honour, 51 insufficient funds, 54 expired card, 1A authentication required."
                    },
                    {
                      "field": "authCode",
                      "text": "The issuer's reference for this approval; it appears on the receipt and in the later capture."
                    }
                  ],
                  "holds": {
                    "gateway": {
                      "remove": [
                        "CVV (until authorisation)"
                      ]
                    }
                  }
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 00",
                  "kind": "response"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 00",
                  "kind": "response",
                  "holds": {
                    "gateway": {
                      "add": [
                        "auth code 731204"
                      ]
                    }
                  }
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payment.authorized",
                  "info": "webhook with payment id",
                  "kind": "notification",
                  "payload": {
                    "event": "payment.authorized",
                    "id": "pay_01HZX8",
                    "amount": 4995,
                    "authCode": "731204"
                  },
                  "holds": {
                    "shop": {
                      "add": [
                        "authorised"
                      ]
                    }
                  }
                },
                {
                  "from": "shop",
                  "to": "checkout",
                  "name": "order confirmed",
                  "info": "thank-you page",
                  "kind": "response"
                }
              ]
            }
          ],
          "holds": {
            "gateway": [
              "card number (vault)",
              "CVV (until authorisation)",
              "authentication value"
            ],
            "shop": [
              "order",
              "payment id"
            ]
          }
        },
        {
          "id": "declines",
          "title": "Declines and retries",
          "subtitle": "What a no means and what to do",
          "article": {
            "body": [
              "A decline is a response code other than approval. Some are hard: the card is reported stolen, the account is closed, the issuer says **do not honour** and will not explain. Others are soft: insufficient funds today, a transient system error, or, since 3-D Secure 2, a request to authenticate the shopper first and try again.",
              "The networks watch retries. Hammering a hard decline with the same request earns fines and a worse reputation for the merchant. A good gateway keeps a retry policy per response code and never retries a stolen-card decline."
            ]
          },
          "steps": [
            {
              "title": "Do not honour",
              "explanation": "The issuer declines without a reason. Code 05 covers everything from a risk rule to a temporary block. The shop can only ask the shopper for another card.",
              "messages": [
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "authorisation request"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 05",
                  "info": "do not honour",
                  "kind": "error",
                  "payload": {
                    "mti": "0110",
                    "stan": "482914",
                    "responseCode": "05"
                  }
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 05",
                  "kind": "error"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 05",
                  "kind": "error"
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payment.declined",
                  "info": "reason: generic decline",
                  "kind": "notification"
                }
              ]
            },
            {
              "title": "Soft decline: authenticate first",
              "explanation": "The issuer wants the shopper authenticated before it approves. It answers with a soft decline; the gateway runs 3-D Secure and sends the same authorisation again with the proof attached.",
              "check": {
                "prompt": "The issuer answers with a soft decline asking for authentication. What should the gateway do?",
                "options": [
                  {
                    "text": "Run 3-D Secure, then send the authorisation again with the authentication value",
                    "correct": true,
                    "why": "Right. A soft decline is an instruction, not a refusal. The retry with proof is expected and usually approved."
                  },
                  {
                    "text": "Send the same authorisation again immediately",
                    "why": "An unchanged retry gets the same answer and counts against the merchant's retry limits."
                  },
                  {
                    "text": "Tell the shopper the card is blocked and ask for another",
                    "why": "Nothing is wrong with the card. The issuer only wants to be sure who is paying."
                  }
                ]
              },
              "messages": [
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 1A",
                  "info": "authentication required",
                  "kind": "error",
                  "tags": [
                    "new"
                  ],
                  "payload": {
                    "mti": "0110",
                    "responseCode": "1A"
                  },
                  "annotations": [
                    {
                      "field": "responseCode",
                      "text": "1A (or 65 on some networks) means: perform strong customer authentication and retry."
                    }
                  ]
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 1A",
                  "kind": "error"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 1A",
                  "kind": "error"
                },
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "challenge requested (03)"
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "after the challenge: transStatus Y",
                  "kind": "response"
                },
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "retry with authentication value and ECI 05"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "No step-up path",
                  "explanation": "The first generation of 3-D Secure had no soft decline. An issuer that wanted authentication could only decline outright, and the merchant could only ask the shopper to try again from the start.",
                  "messages": []
                }
              }
            },
            {
              "title": "Retry rules",
              "explanation": "The gateway consults its retry policy. Transient codes may be retried after a pause; insufficient funds may be retried days later for a subscription; stolen or closed cards are never retried.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "gateway",
                  "name": "apply retry policy",
                  "info": "code 05: no automatic retry",
                  "kind": "local",
                  "payload": "05 do not honour      -> no retry, ask for another card\n51 insufficient funds -> retry in 3 days (subscriptions only)\n91 issuer unavailable -> retry once after 30 s\n41 lost card          -> never retry\n43 stolen card        -> never retry\n1A authentication     -> run 3-D Secure, retry once"
                }
              ]
            }
          ],
          "fragments": [
            {
              "kind": "alt",
              "label": "the issuer's answer",
              "start": 0,
              "end": 1,
              "branches": [
                {
                  "condition": "hard decline",
                  "start": 0,
                  "end": 0
                },
                {
                  "condition": "soft decline: authenticate first",
                  "start": 1,
                  "end": 1
                }
              ]
            },
            {
              "kind": "opt",
              "condition": "the gateway has a retry policy",
              "start": 2,
              "end": 2
            }
          ]
        }
      ]
    },
    {
      "title": "After the sale",
      "topics": [
        {
          "id": "settlement",
          "title": "Capture, clearing and settlement",
          "subtitle": "How the money finally moves",
          "article": {
            "body": [
              "An approved authorisation is a promise. The shop turns it into money in two more stages. **Capture** tells the gateway the goods shipped and the amount is final. **Clearing** is the nightly exchange of captured transactions between acquirers and issuers through the network. **Settlement** is the actual transfer of the netted totals between the banks, after which the acquirer pays the merchant and the issuer posts the charge to the shopper's statement.",
              "This is why a pending amount appears on your statement at once but the real charge a day or two later, and why a cancelled order sometimes shows a hold that simply fades away: it was never captured."
            ]
          },
          "steps": [
            {
              "title": "Capture",
              "explanation": "When the order ships, the shop captures the payment. The gateway queues a capture for the acquirer; nothing travels to the issuer in real time.",
              "messages": [
                {
                  "from": "shop",
                  "to": "gateway",
                  "name": "POST /v1/payments/pay_01HZX8/capture",
                  "info": "amount 4995",
                  "payload": {
                    "amount": 4995
                  },
                  "holds": {
                    "gateway": {
                      "add": [
                        "capture 49.95"
                      ]
                    }
                  }
                },
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "capture record",
                  "info": "added to today's batch",
                  "kind": "transport"
                }
              ]
            },
            {
              "title": "Clearing",
              "explanation": "Overnight the acquirer sends a file of captured transactions to the network, which splits it by issuer. Each issuer receives the records for its cards and matches them to the holds.",
              "messages": [
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "clearing file",
                  "info": "thousands of records, batch",
                  "kind": "transport",
                  "size": "12 MB"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "clearing records",
                  "info": "this issuer's cards only",
                  "kind": "transport"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "post 49.95, release hold",
                  "info": "the charge appears on the statement",
                  "kind": "local",
                  "payload": {
                    "op": "post",
                    "account": "acct_…9921",
                    "amount": 4995,
                    "currency": "EUR",
                    "description": "LAMP SHOP",
                    "releaseHold": "auth_a1b2c3"
                  },
                  "holds": {
                    "ledger": {
                      "remove": [
                        "hold 49.95"
                      ],
                      "add": [
                        "posted 49.95"
                      ]
                    }
                  }
                }
              ]
            },
            {
              "title": "Settlement",
              "explanation": "The network nets what every bank owes every other bank and moves the totals through a settlement bank. The acquirer then pays the merchant, minus its fees.",
              "messages": [
                {
                  "from": "network",
                  "to": "network",
                  "name": "compute net positions",
                  "info": "issuer owes acquirer, minus interchange",
                  "kind": "local"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "settlement transfer",
                  "info": "net amount for the day",
                  "kind": "transport"
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "settlement transfer",
                  "info": "net amount for the day",
                  "kind": "transport"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "payout report",
                  "info": "merchant balance credited, fees deducted",
                  "kind": "notification"
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payout.paid",
                  "info": "webhook: 48.46 after fees",
                  "kind": "notification",
                  "payload": {
                    "event": "payout.paid",
                    "gross": 4995,
                    "fees": 149,
                    "net": 4846,
                    "currency": "EUR"
                  },
                  "holds": {
                    "shop": {
                      "add": [
                        "payout 48.46"
                      ]
                    }
                  }
                }
              ]
            }
          ],
          "holds": {
            "gateway": [
              "auth code 731204"
            ],
            "shop": [
              "order",
              "payment id",
              "authorised"
            ],
            "ledger": [
              "hold 49.95"
            ]
          }
        }
      ]
    }
  ],
  "further": {
    "title": "Go further",
    "items": [
      {
        "title": "EMV 3-D Secure specifications",
        "subtitle": "the protocol behind authentication",
        "url": "https://www.emvco.com/emv-technologies/3-d-secure/"
      },
      {
        "title": "PCI Security Standards",
        "subtitle": "why nobody wants to store card numbers",
        "url": "https://www.pcisecuritystandards.org/"
      }
    ]
  },
  "footer": "Amounts, identifiers and hostnames are illustrative. Response codes and message names follow common practice; details vary by network and acquirer.",
  "channels": [
    {
      "id": "browser",
      "name": "Browser · visible on the device",
      "color": "amber",
      "description": "Travels through the shopper's browser; anyone on the device could see it."
    },
    {
      "id": "api",
      "name": "API · TLS between servers",
      "color": "blue",
      "description": "Server-to-server HTTPS."
    },
    {
      "id": "rails",
      "name": "Card rails · private network",
      "color": "green",
      "description": "The acquirer, network and issuer talk over private, authenticated links."
    },
    {
      "id": "internal",
      "name": "Internal · inside one organisation",
      "color": "slate",
      "description": "Never leaves the organisation's own systems."
    }
  ]
}
```
