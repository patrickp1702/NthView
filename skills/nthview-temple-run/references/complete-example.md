# Temple Run complete example

A complete, valid object that exercises every field in `schema.md`. It is the
exact data in `examples/example.html`; `scripts/build-html.js --example` reads
it from this file.

The complete example is Rainforest Run: 31 stretches, one per activity type,
covering every encounter and every scenery, in the `jungle` theme and
learning mode. It is the data embedded in `examples/example.html`; build that
file with:

    node scripts/build-html.js skills/nthview-temple-run --example skills/nthview-temple-run/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Rainforest Run",
  "subtitle": "Race through a jungle temple and learn how a rainforest works",
  "theme": "jungle",
  "strictMode": false,
  "runner": {
    "name": "Mara"
  },
  "chaser": {
    "name": "the shadow monkeys",
    "kind": "monkey"
  },
  "torches": 3,
  "intro": {
    "paragraphs": [
      "Mara is a young explorer who just grabbed a golden seed from the heart of an old jungle temple. The temple did not like that. A troop of shadow monkeys is on her heels.",
      "Every stretch of the escape teaches one thing about how a rainforest works. At the end of each stretch a guardian of the temple blocks the way and asks about it. Answer and the way opens."
    ],
    "steps": [
      "Read the short lesson, then press **Run**. Arrows or swipes move between lanes, **up** jumps, **down** slides. At a corner, press the way the path turns.",
      "Some guardians ask in a card. Others set a trial on the track: run through the right lane, light the right torches, jump the false planks.",
      "A wrong answer shows you why and the monkeys get a step closer. You always get through; first-try answers earn three stars."
    ],
    "note": "Numbers are rounded for learning. The temple, Mara and the monkeys are made up; the rainforest facts are real."
  },
  "stretches": [
    {
      "id": "what-is-a-rainforest",
      "name": "Rain Gate",
      "scenery": "causeway",
      "encounter": "gate",
      "hazards": "light",
      "lead": "A rainforest is a forest where it rains a lot all year: usually more than **2,000 mm** a year, about two metres of water. Most are also warm all year, because they sit near the equator.",
      "body": [
        "Tall trees, monkeys and parrots live in many kinds of forest. What makes a rainforest a rainforest is the water."
      ],
      "activity": {
        "type": "choice",
        "question": "What makes a forest a rainforest?",
        "options": [
          {
            "text": "Heavy rain all through the year",
            "correct": true
          },
          {
            "text": "Very tall trees",
            "why": "Redwood and pine forests have giant trees too. The rain is what counts."
          },
          {
            "text": "Monkeys living in it",
            "why": "Monkeys live in many forests and some rainforests have none. It is about rain."
          }
        ],
        "okText": "Right: lots of rain, all year round."
      },
      "remember": "A rainforest gets heavy rain all year, usually over 2,000 mm."
    },
    {
      "id": "where-they-grow",
      "name": "Equator Lanes",
      "scenery": "canopy",
      "encounter": "ghost",
      "lead": "Most rainforests grow in a belt around the **equator**: the Amazon in South America, the Congo in Africa, and the forests of South-East Asia. Near the equator the sun is strong all year, so the air is warm and wet and it rains almost every afternoon.",
      "activity": {
        "type": "lanes",
        "prompt": "Three rune stones float over the lanes. Run through the one that names the belt where most rainforests grow.",
        "options": [
          {
            "id": "equator",
            "label": "Equator"
          },
          {
            "id": "poles",
            "label": "Near the poles",
            "hint": "It is far too cold near the poles for a rainforest."
          },
          {
            "id": "deserts",
            "label": "Desert belt",
            "hint": "The desert belts are dry. Rainforests need rain all year."
          }
        ],
        "answer": "equator"
      },
      "remember": "Most rainforests lie in a warm, wet belt around the equator."
    },
    {
      "id": "small-but-crowded",
      "name": "Crowded Corner",
      "scenery": "ruins",
      "encounter": "fire",
      "lead": "Rainforests cover only about **6%** of Earth's land. Yet more than half of all the kinds of land plants and animals live in them. A single hectare can hold more kinds of tree than the whole of Europe.",
      "activity": {
        "type": "truefalse",
        "statement": "Rainforests cover most of Earth's land.",
        "answer": false,
        "why": "They cover only about 6% of the land, but they are packed with life."
      },
      "checks": [
        {
          "type": "choice",
          "question": "About how much of all land life lives in rainforests?",
          "options": [
            {
              "text": "About a tenth",
              "why": "Far more than that: over half of land species."
            },
            {
              "text": "More than half",
              "correct": true
            },
            {
              "text": "Almost none",
              "why": "Rainforests are the most crowded places for life on land."
            }
          ]
        }
      ],
      "remember": "Rainforests are small, about 6% of land, but hold over half of land species."
    },
    {
      "id": "four-layers",
      "name": "Layer Steps",
      "scenery": "canopy",
      "encounter": "guardian",
      "lead": "A rainforest is built in **layers**, like floors in a building. On top, a few giant trees poke out: the **emergent** layer. Below them the leaves of most trees join into a roof, the **canopy**. Under it is the shady **understory**, and at the bottom the dark **forest floor**.",
      "activity": {
        "type": "order",
        "prompt": "Put the layers in order from the top of the forest to the ground.",
        "items": [
          {
            "text": "Emergent layer",
            "note": "Lone giants, up to 60 m tall"
          },
          {
            "text": "Canopy",
            "note": "The leafy roof, 30–45 m up"
          },
          {
            "text": "Understory",
            "note": "Shady and still"
          },
          {
            "text": "Forest floor",
            "note": "Only about 2% of the sunlight gets here"
          }
        ]
      },
      "remember": "Top to bottom: emergent, canopy, understory, forest floor."
    },
    {
      "id": "sunlight",
      "name": "Sun Gates",
      "scenery": "courtyard",
      "encounter": "bridge",
      "lead": "Sunlight is the forest's food. The highest leaves catch it first. By the time light has passed through the canopy, only a tiny bit is left, which is why the forest floor is so dark even at noon.",
      "activity": {
        "type": "gates",
        "prompt": "Three carved gates stand across the path. Run through the gate of the layer that gets the most sunlight.",
        "paths": [
          {
            "id": "emergent",
            "label": "Emergent"
          },
          {
            "id": "understory",
            "label": "Understory",
            "hint": "The understory is in the canopy's shade."
          },
          {
            "id": "floor",
            "label": "Forest floor",
            "hint": "The floor is the darkest layer of all."
          }
        ],
        "answer": "emergent"
      },
      "remember": "The higher the layer, the more sunlight it gets; the floor gets almost none."
    },
    {
      "id": "who-lives-where",
      "name": "Animal Ledge",
      "scenery": "cliffs",
      "encounter": "monkey",
      "lead": "Each layer has its own animals. Eagles nest on the emergent giants. Sloths and monkeys spend their lives in the canopy. Big cats prowl the understory, and ants and beetles work the floor.",
      "activity": {
        "type": "match",
        "prompt": "Match each animal to the layer it calls home.",
        "pairs": [
          {
            "left": "Harpy eagle",
            "right": "Emergent layer"
          },
          {
            "left": "Three-toed sloth",
            "right": "Canopy"
          },
          {
            "left": "Jaguar",
            "right": "Understory"
          },
          {
            "left": "Leafcutter ants",
            "right": "Forest floor"
          }
        ]
      },
      "remember": "Every layer is a different home with its own animals."
    },
    {
      "id": "busiest-layer",
      "name": "Diagram Wall",
      "scenery": "tunnel",
      "encounter": "vines",
      "lead": "Scientists who climb into the canopy find it is the busiest layer of all. Fruit, flowers and insects are up there in the light, so most animals live there too: by some counts, more than half of all rainforest species.",
      "activity": {
        "type": "hotspot",
        "prompt": "This carving shows the forest's layers. Tap the layer where most of the animals live.",
        "parts": [
          {
            "id": "sun",
            "label": "Sun",
            "shape": "circle",
            "x": 88,
            "y": 9,
            "r": 7,
            "color": "#f2c14e",
            "hint": "That's the sun. Which layer gets its light and fruit?"
          },
          {
            "id": "emergent",
            "label": "Emergent",
            "x": 8,
            "y": 4,
            "w": 66,
            "h": 10,
            "hint": "Only a few giant trees reach up here."
          },
          {
            "id": "canopy",
            "label": "Canopy",
            "x": 4,
            "y": 16,
            "w": 92,
            "h": 14
          },
          {
            "id": "understory",
            "label": "Understory",
            "x": 4,
            "y": 32,
            "w": 92,
            "h": 12,
            "hint": "The understory is shady; fewer animals live here."
          },
          {
            "id": "floor",
            "label": "Forest floor",
            "x": 4,
            "y": 46,
            "w": 92,
            "h": 12,
            "hint": "The floor is dark; most life is higher up."
          }
        ],
        "links": [
          {
            "from": "sun",
            "to": "emergent"
          }
        ],
        "answer": "canopy"
      },
      "remember": "The canopy is the busiest layer: most rainforest animals live there."
    },
    {
      "id": "living-in-the-dark",
      "name": "Shade Hall",
      "scenery": "ruins",
      "encounter": "idol",
      "lead": "Plants on the dark floor have their own tricks. Some grow **enormous leaves** to catch every scrap of light. Vines called **lianas** root in the ground and climb trees to reach the sun. Others, like orchids, skip the ground and grow on branches.",
      "activity": {
        "type": "multi",
        "question": "Which of these help a plant get light under the canopy?",
        "options": [
          {
            "text": "Growing very large leaves",
            "correct": true
          },
          {
            "text": "Climbing up a tree as a vine",
            "correct": true
          },
          {
            "text": "Growing on a high branch",
            "correct": true
          },
          {
            "text": "A thick trunk that stores water",
            "why": "That helps desert plants survive drought, not darkness."
          },
          {
            "text": "Thick fur-like hairs against the cold",
            "why": "Rainforests are warm; that helps mountain plants."
          }
        ]
      },
      "remember": "Under the canopy, plants grow big leaves, climb, or perch on branches to reach light."
    },
    {
      "id": "recyclers",
      "name": "Torch Bridge",
      "scenery": "bridges",
      "encounter": "ropebridge",
      "lead": "Leaves, fruit and dead animals rain onto the floor all the time. **Decomposers** break them down within weeks and hand the nutrients back to the trees. Without them the forest would be buried in its own litter.",
      "activity": {
        "type": "torches",
        "prompt": "Braziers line the bridge. Run through the ones that name a decomposer to light them; steer around the others.",
        "items": [
          {
            "id": "fungi",
            "label": "Fungi",
            "lit": true
          },
          {
            "id": "toucan",
            "label": "Toucan",
            "lit": false
          },
          {
            "id": "termites",
            "label": "Termites",
            "lit": true
          },
          {
            "id": "orchid",
            "label": "Orchid",
            "lit": false
          },
          {
            "id": "worms",
            "label": "Earthworms",
            "lit": true
          }
        ]
      },
      "remember": "Decomposers like fungi, termites and worms recycle dead matter into nutrients."
    },
    {
      "id": "poor-soil",
      "name": "Thin Soil",
      "scenery": "waterfall",
      "encounter": "serpent",
      "lead": "Here is a surprise: rainforest soil is **poor**. Heavy rain washes nutrients away, and decomposers work so fast that nutrients go straight back into roots. Almost all the forest's food is stored in the living plants, not in the ground.",
      "activity": {
        "type": "cloze",
        "text": "Most of a rainforest's nutrients are stored in the ___, not in the ___, because heavy rain ___ the soil.",
        "gaps": [
          {
            "options": [
              "living plants",
              "rocks"
            ],
            "answer": 0
          },
          {
            "options": [
              "leaves",
              "soil"
            ],
            "answer": 1
          },
          {
            "options": [
              "washes out",
              "fertilises"
            ],
            "answer": 0
          }
        ]
      },
      "remember": "Rainforest soil is thin and poor; the nutrients live in the plants."
    },
    {
      "id": "food-web",
      "name": "Web Court",
      "scenery": "courtyard",
      "encounter": "gate",
      "hazards": "heavy",
      "lead": "Every living thing in the forest has a job in the **food web**. **Producers** (plants) make food from sunlight. **Consumers** (animals) eat plants or each other. **Decomposers** turn whatever dies back into nutrients.",
      "activity": {
        "type": "sort",
        "prompt": "Put each living thing in its job.",
        "buckets": [
          {
            "id": "producer",
            "label": "Producer"
          },
          {
            "id": "consumer",
            "label": "Consumer"
          },
          {
            "id": "decomposer",
            "label": "Decomposer"
          }
        ],
        "items": [
          {
            "text": "Kapok tree",
            "bucket": "producer"
          },
          {
            "text": "Jaguar",
            "bucket": "consumer"
          },
          {
            "text": "Mushroom",
            "bucket": "decomposer"
          },
          {
            "text": "Fern",
            "bucket": "producer"
          },
          {
            "text": "Howler monkey",
            "bucket": "consumer"
          },
          {
            "text": "Termite",
            "bucket": "decomposer"
          }
        ]
      },
      "remember": "Producers make food, consumers eat it, decomposers recycle it."
    },
    {
      "id": "lungs-myth",
      "name": "Plank Bridge",
      "scenery": "bridges",
      "encounter": "ghost",
      "lead": "People often call the Amazon \"the lungs of the world\". The forest does make a lot of oxygen by day, but its own trees, animals and decomposers breathe almost all of it back in. Most of the oxygen we breathe comes from the ocean's tiny algae. What rainforests really do for the planet is **store carbon**.",
      "activity": {
        "type": "planks",
        "prompt": "Each glowing plank carries a statement. Step on the true ones. Jump over the false ones.",
        "planks": [
          {
            "text": "Trees take in carbon dioxide",
            "answer": true
          },
          {
            "text": "The Amazon makes most of our oxygen",
            "answer": false,
            "why": "The forest uses almost all its own oxygen; ocean algae make most of ours."
          },
          {
            "text": "Rainforests store huge amounts of carbon",
            "answer": true
          },
          {
            "text": "Rainforest soil is very rich",
            "answer": false,
            "why": "It is poor: heavy rain washes the nutrients out."
          }
        ]
      },
      "remember": "Rainforests are carbon stores more than oxygen factories."
    },
    {
      "id": "wettest-places",
      "name": "Rain Ranks",
      "scenery": "waterfall",
      "encounter": "fire",
      "lead": "How wet is wet? A rainforest gets two to three times the rain of a forest in Europe, and twenty times as much as a desert.",
      "activity": {
        "type": "rank",
        "prompt": "Rank the places from the most rain per year to the least.",
        "items": [
          {
            "text": "Tropical rainforest",
            "value": 100,
            "show": "2,500 mm"
          },
          {
            "text": "European forest",
            "value": 36,
            "show": "900 mm"
          },
          {
            "text": "Grassland",
            "value": 20,
            "show": "500 mm"
          },
          {
            "text": "Desert",
            "value": 4,
            "show": "100 mm"
          }
        ],
        "caption": "Typical yearly rainfall, rounded."
      },
      "remember": "Rainforests get about two metres or more of rain a year, far more than other forests."
    },
    {
      "id": "how-many-species",
      "name": "Guess Gully",
      "scenery": "cliffs",
      "encounter": "guardian",
      "lead": "Nobody knows exactly how many species live on Earth, and many rainforest insects have never been named. But scientists agree that a very large share of land species live in rainforests.",
      "activity": {
        "type": "estimate",
        "question": "Roughly what percentage of land plant and animal species live in rainforests?",
        "min": 0,
        "max": 100,
        "answer": 55,
        "tolerance": 12,
        "unit": "%",
        "reveal": "Estimates are about half or more: roughly 50 to 70%."
      },
      "remember": "About half or more of all land species live in rainforests."
    },
    {
      "id": "carbon-sums",
      "name": "Carbon Bridge",
      "scenery": "bridges",
      "encounter": "bridge",
      "lead": "A big rainforest tree takes in roughly **22 kg** of carbon dioxide a year and locks the carbon into its wood. Multiply that by billions of trees and you see why forests matter for the climate.",
      "activity": {
        "type": "number",
        "question": "If one tree takes in 22 kg of carbon dioxide a year, how many kilograms do 10 trees take in?",
        "answer": 220,
        "unit": "kg",
        "reveal": "10 × 22 kg = 220 kg a year."
      },
      "remember": "Each tree stores carbon every year, so whole forests store enormous amounts."
    },
    {
      "id": "name-the-gas",
      "name": "Word Shrine",
      "scenery": "tunnel",
      "encounter": "monkey",
      "lead": "Plants take in a gas from the air, use sunlight to split it, keep the carbon to build wood and leaves, and let the oxygen go. Too much of this gas in the air traps heat and warms the planet.",
      "activity": {
        "type": "text",
        "question": "Which gas do trees take in from the air to build their wood?",
        "answer": "carbon dioxide",
        "accept": [
          "co2",
          "carbon dioxide gas",
          "co 2"
        ],
        "placeholder": "Type the gas",
        "reveal": "Carbon dioxide, CO2."
      },
      "remember": "Trees take in carbon dioxide and keep the carbon in their wood."
    },
    {
      "id": "forest-gifts",
      "name": "Market Run",
      "scenery": "causeway",
      "encounter": "vines",
      "color": "#d98f2b",
      "lead": "You eat and use rainforest plants every week. Chocolate comes from the cacao tree, rubber from the rubber tree's sap, and bananas, vanilla and many medicines first came from tropical forests.",
      "activity": {
        "type": "harvest",
        "prompt": "Tokens float over the lanes. Grab the ones that come from rainforest plants and dodge the rest.",
        "items": [
          {
            "label": "Chocolate",
            "belongs": true
          },
          {
            "label": "Wool",
            "belongs": false
          },
          {
            "label": "Rubber",
            "belongs": true
          },
          {
            "label": "Sea salt",
            "belongs": false
          },
          {
            "label": "Vanilla",
            "belongs": true
          },
          {
            "label": "Granite",
            "belongs": false
          }
        ]
      },
      "remember": "Chocolate, rubber, vanilla and many medicines come from rainforest plants."
    },
    {
      "id": "not-from-here",
      "name": "Odd Idols",
      "scenery": "ruins",
      "encounter": "idol",
      "lead": "Rainforest animals are built for heat, rain and climbing: thin fur or none, long tails and grippy feet. An animal made for cold and ice would not last a week here.",
      "activity": {
        "type": "odd",
        "prompt": "Which animal does not belong in a rainforest?",
        "items": [
          "Sloth",
          "Toucan",
          "Jaguar",
          "Polar bear"
        ],
        "answer": 3,
        "why": "Polar bears are built for Arctic ice; the others are rainforest animals."
      },
      "remember": "Rainforest animals are adapted to heat, rain and life in the trees."
    },
    {
      "id": "making-rain",
      "name": "Lever Falls",
      "scenery": "waterfall",
      "encounter": "ropebridge",
      "lead": "A rainforest helps make its own rain. Roots drink water from the soil, leaves breathe it out as vapour (**transpiration**), the vapour rises and forms clouds, and the clouds rain on the forest again. Up to half of the Amazon's rain is recycled this way.",
      "activity": {
        "type": "levers",
        "prompt": "Levers stand in the lanes. Pull them in the order of the forest's water cycle, starting with the rain.",
        "items": [
          {
            "id": "rain",
            "label": "Rain falls"
          },
          {
            "id": "roots",
            "label": "Roots drink"
          },
          {
            "id": "leaves",
            "label": "Leaves sweat"
          },
          {
            "id": "clouds",
            "label": "Clouds form"
          }
        ]
      },
      "remember": "Rain, roots, leaves, clouds, rain: the forest recycles its own water."
    },
    {
      "id": "high-and-low",
      "name": "Tile Path",
      "scenery": "canopy",
      "encounter": "serpent",
      "lead": "Some living things never touch the ground; others never leave it. Orchids and bromeliads grow on branches high up. Tapirs and fungi live their lives down on the floor.",
      "activity": {
        "type": "tiles",
        "prompt": "Each glowing orb names a living thing. Step on the floor tile of the layer where it lives.",
        "bins": [
          {
            "id": "canopy",
            "label": "Canopy"
          },
          {
            "id": "floor",
            "label": "Forest floor"
          }
        ],
        "items": [
          {
            "label": "Sloth",
            "bin": "canopy"
          },
          {
            "label": "Tapir",
            "bin": "floor"
          },
          {
            "label": "Orchid",
            "bin": "canopy"
          },
          {
            "label": "Fungi",
            "bin": "floor"
          }
        ]
      },
      "remember": "Some species live their whole life in the canopy, others on the floor."
    },
    {
      "id": "why-forests-vanish",
      "name": "Clearing",
      "scenery": "courtyard",
      "encounter": "gate",
      "lead": "Rainforests are being cut down for land. In the Amazon the biggest cause by far is **cattle ranching**: forest is cleared and turned into pasture. Farming crops like soy, logging and mining clear much less.",
      "activity": {
        "type": "pads",
        "prompt": "The bigger the figure, the more forest that cause clears. Pick the biggest cause of clearing in the Amazon.",
        "options": [
          {
            "id": "cattle",
            "label": "Cattle",
            "size": 3.4
          },
          {
            "id": "soy",
            "label": "Soy fields",
            "size": 1.4,
            "hint": "Soy clears some forest, but much less than pasture for cattle."
          },
          {
            "id": "logging",
            "label": "Logging",
            "size": 1.1,
            "hint": "Logging damages forest, but cattle pasture clears far more."
          },
          {
            "id": "mining",
            "label": "Mining",
            "size": 0.7,
            "hint": "Mines are destructive locally, but small in area."
          }
        ],
        "answer": "cattle"
      },
      "remember": "In the Amazon, most forest is cleared to make pasture for cattle."
    },
    {
      "id": "less-rain",
      "name": "Dry Spell",
      "scenery": "cliffs",
      "encounter": "ghost",
      "lead": "Remember that the forest makes much of its own rain. So what happens to the rain when a big part of the forest is cut down?",
      "activity": {
        "type": "predict",
        "question": "A huge area of forest is cleared for pasture. What happens to the rain nearby?",
        "options": [
          {
            "text": "Less rain falls",
            "correct": true
          },
          {
            "text": "More rain falls",
            "why": "Without leaves breathing out water, fewer clouds form."
          },
          {
            "text": "Nothing changes",
            "why": "The forest was helping to make that rain."
          }
        ],
        "frames": [
          "The trees are gone, so no roots drink and no leaves breathe out vapour.",
          "Fewer clouds form over the cleared land.",
          "The dry season gets longer and the remaining forest suffers."
        ],
        "result": "Less rain falls: clearing forest dries out the region."
      },
      "remember": "Cutting a rainforest can reduce the rain that the rest of the forest needs."
    },
    {
      "id": "soil-surprise",
      "name": "Sure Steps",
      "scenery": "causeway",
      "encounter": "fire",
      "lead": "Farmers who clear rainforest often find that crops grow well for two or three years and then fail. Now you know why.",
      "activity": {
        "type": "confidence",
        "question": "Why do crops on cleared rainforest land often fail after a few years?",
        "options": [
          {
            "text": "The soil was poor; the nutrients were in the trees",
            "correct": true
          },
          {
            "text": "It gets too cold once the trees are gone",
            "why": "The land stays warm. The problem is the thin soil."
          },
          {
            "text": "The monkeys eat the crops",
            "why": "Pests happen, but the main problem is poor soil."
          }
        ],
        "okText": "Right: once the trees are burned and the rain washes the ash away, the soil has little left."
      },
      "remember": "Cleared rainforest soil runs out of nutrients within a few years."
    },
    {
      "id": "before-and-after",
      "name": "Two Valleys",
      "scenery": "cliffs",
      "encounter": "guardian",
      "lead": "Compare a valley of standing forest with the same valley after it has been cleared for pasture.",
      "activity": {
        "type": "compare",
        "prompt": "Flip between the two valleys.",
        "before": {
          "label": "Forest",
          "text": "Tall trees, many layers, wet air.",
          "rows": [
            {
              "label": "Kinds of tree in a hectare",
              "value": 100,
              "show": "~250"
            },
            {
              "label": "Rain recycled locally",
              "value": 50,
              "show": "~50%"
            }
          ]
        },
        "after": {
          "label": "Pasture",
          "text": "Grass, cattle and hot, dry ground.",
          "rows": [
            {
              "label": "Kinds of tree in a hectare",
              "value": 2,
              "show": "~5"
            },
            {
              "label": "Rain recycled locally",
              "value": 10,
              "show": "~10%"
            }
          ]
        },
        "caption": "Rounded, illustrative numbers."
      },
      "quiz": {
        "question": "What changes most when the forest becomes pasture?",
        "options": [
          {
            "text": "The number of kinds of tree drops sharply",
            "correct": true
          },
          {
            "text": "The valley gets more rain",
            "why": "Less rain is recycled once the trees are gone."
          }
        ]
      },
      "remember": "Clearing a forest wipes out most of its variety of life and its rain-making."
    },
    {
      "id": "guess-the-split",
      "name": "Split Stones",
      "scenery": "ruins",
      "encounter": "bridge",
      "lead": "Before you see the real numbers, guess them. How is the cleared land in the Amazon used?",
      "activity": {
        "type": "bars",
        "prompt": "Slide each bar to your guess of how much cleared land goes to each use, then reveal the real split.",
        "items": [
          {
            "label": "Cattle pasture",
            "value": 70,
            "show": "~70%"
          },
          {
            "label": "Crops such as soy",
            "value": 15,
            "show": "~15%"
          },
          {
            "label": "Everything else",
            "value": 15,
            "show": "~15%"
          }
        ],
        "revealText": "Pasture dwarfs everything else."
      },
      "quiz": {
        "question": "Roughly how much of the cleared Amazon land is cattle pasture?",
        "options": [
          {
            "text": "About a tenth",
            "why": "Look at the revealed bars: pasture is the big one."
          },
          {
            "text": "About seven tenths",
            "correct": true
          }
        ]
      },
      "remember": "About seven tenths of cleared Amazon land becomes cattle pasture."
    },
    {
      "id": "what-keeps-it-alive",
      "name": "Switch Room",
      "scenery": "tunnel",
      "encounter": "monkey",
      "lead": "A rainforest stays healthy when its parts keep working together: rain to drink, decomposers to recycle, and pollinators to carry pollen so new seeds grow.",
      "activity": {
        "type": "switches",
        "prompt": "Turn the parts of the forest on and off and read its health.",
        "switches": [
          {
            "id": "rain",
            "label": "Rain all year",
            "on": true
          },
          {
            "id": "decomposers",
            "label": "Decomposers",
            "on": true
          },
          {
            "id": "pollinators",
            "label": "Pollinators",
            "on": true
          }
        ],
        "readout": [
          {
            "when": "!rain",
            "text": "Without rain the forest dries out and fires spread.",
            "tone": "no"
          },
          {
            "when": "!decomposers",
            "text": "Litter piles up and the trees starve for nutrients.",
            "tone": "no"
          },
          {
            "when": "!pollinators",
            "text": "Old trees live on, but few new seeds grow.",
            "tone": "note"
          },
          {
            "text": "Healthy: everything is working together.",
            "tone": "ok"
          }
        ]
      },
      "quiz": {
        "question": "What happens without pollinators?",
        "options": [
          {
            "text": "Fewer new seeds grow",
            "correct": true
          },
          {
            "text": "The forest floods",
            "why": "Pollinators carry pollen; they do not control water."
          }
        ]
      },
      "remember": "Rain, decomposers and pollinators all have to keep working for a healthy forest."
    },
    {
      "id": "jungle-words",
      "name": "Word Cards",
      "scenery": "courtyard",
      "encounter": "vines",
      "hazards": "none",
      "lead": "A short rest before the last stretches. Flip through the words explorers use for the forest.",
      "activity": {
        "type": "flashcards",
        "cards": [
          {
            "front": "Canopy",
            "back": "The leafy roof formed by most trees' crowns."
          },
          {
            "front": "Epiphyte",
            "back": "A plant that grows on another plant, like an orchid on a branch."
          },
          {
            "front": "Liana",
            "back": "A woody vine that roots in the ground and climbs to the light."
          },
          {
            "front": "Transpiration",
            "back": "Leaves breathing out water vapour."
          }
        ]
      },
      "quiz": {
        "question": "An orchid growing on a high branch is called…",
        "options": [
          {
            "text": "An epiphyte",
            "correct": true
          },
          {
            "text": "A liana",
            "why": "A liana roots in the ground and climbs; an epiphyte grows on the branch itself."
          }
        ]
      },
      "remember": "Canopy, epiphyte, liana, transpiration: the explorer's words for the forest."
    },
    {
      "id": "strangler-fig",
      "name": "Fig Tale",
      "scenery": "canopy",
      "encounter": "idol",
      "lead": "Some rainforest plants compete fiercely for light. The strangler fig has a sneaky way to the top.",
      "activity": {
        "type": "story",
        "buttonLabel": "What happens next?",
        "frames": [
          "A bird eats a fig and drops a seed high on a branch of a big tree.",
          "The seed sprouts up there, in the light, and sends long roots down to the ground.",
          "The roots thicken and wrap around the host tree's trunk.",
          "Years later the host tree dies inside the cage of roots, and the fig stands on its own."
        ],
        "caption": "Strangler figs are real, and many animals depend on their fruit."
      },
      "quiz": {
        "question": "Why does the strangler fig start life high on a branch?",
        "options": [
          {
            "text": "To reach the light without growing up from the dark floor",
            "correct": true
          },
          {
            "text": "To hide from the rain",
            "why": "Rain is everywhere; light is what is scarce below the canopy."
          }
        ]
      },
      "remember": "The strangler fig starts at the top to reach the light, then roots its way down."
    },
    {
      "id": "plant-a-forest",
      "name": "Seed Field",
      "scenery": "causeway",
      "encounter": "ropebridge",
      "lead": "Can planting trees undo the damage? Young trees take in carbon too, but slowly, and a planted forest takes many decades to grow back its full variety of life.",
      "activity": {
        "type": "tune",
        "controls": [
          {
            "id": "t",
            "label": "Trees planted (hundreds)",
            "min": 1,
            "max": 6,
            "value": 2
          },
          {
            "id": "y",
            "label": "Years of growth",
            "min": 1,
            "max": 5,
            "value": 1
          }
        ],
        "readout": [
          {
            "text": "Roughly {t*100*y*10} kg of carbon dioxide taken in over {y} year(s)."
          }
        ],
        "visual": {
          "kind": "grid",
          "count": "t",
          "extra": "y"
        },
        "caption": "Young trees take in about a tenth of what a grown tree does; the numbers are illustrative."
      },
      "quiz": {
        "question": "What makes a planted forest take in more carbon?",
        "options": [
          {
            "text": "More trees and more years of growth",
            "correct": true
          },
          {
            "text": "Fewer trees, planted closer",
            "why": "More trees, given time, store more carbon."
          }
        ]
      },
      "remember": "Planting helps, but young forests store carbon slowly and take decades to recover."
    },
    {
      "id": "fast-and-slow",
      "name": "Race Clock",
      "scenery": "tunnel",
      "encounter": "serpent",
      "lead": "Cutting is quick. Recovery is slow. A machine can clear a hectare in a day; the forest needs a lifetime to grow back.",
      "activity": {
        "type": "race",
        "buttonLabel": "Start the race",
        "bars": [
          {
            "label": "Clearing a hectare",
            "value": 2,
            "show": "1 day",
            "tag": "cut"
          },
          {
            "label": "Forest growing back",
            "value": 100,
            "show": "100+ years",
            "tag": "regrow"
          }
        ]
      },
      "quiz": {
        "question": "How long does a cleared rainforest take to grow back fully?",
        "options": [
          {
            "text": "About a year",
            "why": "Press the race button: regrowth takes a century or more."
          },
          {
            "text": "A century or more",
            "correct": true
          }
        ]
      },
      "remember": "A forest cut in a day can take over a hundred years to grow back."
    },
    {
      "id": "what-to-protect",
      "name": "Vote Hall",
      "scenery": "courtyard",
      "lead": "Mara asked seven villagers living at the forest edge what protects the forest best. Their votes are the glowing letters on the track: **P** protected parks run with local people, **T** more tourism, **F** fences.",
      "activity": {
        "type": "collect",
        "prompt": "Run through all seven glowing letters to collect the votes.",
        "items": [
          "P",
          "T",
          "P",
          "F",
          "P",
          "P",
          "T"
        ],
        "resultTitle": "The vote",
        "resultText": "Most votes: {top} ({count} of {total})",
        "resultNote": "Studies agree with the villagers: forests last longest where local and Indigenous people help run them."
      },
      "quiz": {
        "question": "Which kind of protection keeps forests standing best?",
        "options": [
          {
            "text": "Parks run together with local people",
            "correct": true
          },
          {
            "text": "Fences around the forest",
            "why": "Fences do little; people who live there and care for it protect it best."
          }
        ]
      },
      "remember": "Forests last longest where local and Indigenous people help protect them."
    }
  ],
  "finale": {
    "name": "The last sprint",
    "lead": "The temple is collapsing behind you and the monkeys are closing in. Answer as you run; every right answer is a burst of speed.",
    "ask": 4,
    "questions": [
      {
        "question": "What makes a forest a rainforest?",
        "options": [
          {
            "text": "Heavy rain all year",
            "correct": true
          },
          {
            "text": "Tall trees",
            "why": "Many forests have tall trees; rainforests have heavy rain."
          }
        ]
      },
      {
        "question": "Which layer is busiest with animals?",
        "options": [
          {
            "text": "The canopy",
            "correct": true
          },
          {
            "text": "The forest floor",
            "why": "The floor is dark; most life is up in the canopy."
          },
          {
            "text": "The emergent layer",
            "why": "Only a few giant trees reach that high."
          }
        ]
      },
      {
        "question": "Where are most of a rainforest's nutrients?",
        "options": [
          {
            "text": "In the living plants",
            "correct": true
          },
          {
            "text": "In the soil",
            "why": "The soil is thin and poor."
          }
        ]
      },
      {
        "question": "What clears the most Amazon forest?",
        "options": [
          {
            "text": "Cattle pasture",
            "correct": true
          },
          {
            "text": "Logging",
            "why": "Logging damages forest, but pasture clears far more."
          }
        ]
      },
      {
        "question": "What happens to rain when a lot of forest is cut?",
        "options": [
          {
            "text": "There is less rain",
            "correct": true
          },
          {
            "text": "There is more rain",
            "why": "The forest helped make the rain through its leaves."
          }
        ]
      },
      {
        "question": "What do rainforests mostly do for the climate?",
        "options": [
          {
            "text": "Store carbon",
            "correct": true
          },
          {
            "text": "Make most of our oxygen",
            "why": "Ocean algae make most of it; forests store carbon."
          }
        ]
      }
    ]
  },
  "report": {
    "heading": "Mara made it out!",
    "tiers": {
      "perfect": "Every guardian answered first time. The temple will be telling stories about you.",
      "great": "A fine escape. Mara owes you a share of the golden seed.",
      "pass": "You got Mara out of the temple! Run it again to earn more stars."
    },
    "lessons": [
      "A rainforest has heavy rain all year and lies mostly near the equator.",
      "It covers 6% of land but holds over half of land species.",
      "It is built in layers; the canopy is the busiest.",
      "Decomposers recycle nutrients fast, so the soil itself is poor.",
      "Rainforests store carbon and make much of their own rain.",
      "Most clearing in the Amazon is for cattle pasture, and recovery takes a century."
    ],
    "glossaryIntro": "Words to know when you read more about rainforests:",
    "glossaryColumns": [
      "Word",
      "Meaning"
    ],
    "glossary": [
      {
        "term": "Emergent layer",
        "meaning": "The few giant trees that rise above the canopy"
      },
      {
        "term": "Canopy",
        "meaning": "The leafy roof formed by most tree crowns"
      },
      {
        "term": "Decomposer",
        "meaning": "A living thing that breaks down dead matter"
      },
      {
        "term": "Transpiration",
        "meaning": "Plants releasing water vapour through their leaves"
      },
      {
        "term": "Deforestation",
        "meaning": "Clearing forest for other uses"
      }
    ],
    "source": {
      "label": "General teaching material about tropical rainforests",
      "note": "Figures are rounded from widely published estimates and are meant to build intuition, not for citation."
    }
  }
}
```
