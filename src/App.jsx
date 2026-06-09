import React, { useMemo, useState } from "react";
import birdEnergy from "./data/birdEnergy.json";
import simpleBodyShapes from "./data/simpleBodyShapes.json";
import expressions from "./data/expressions.json";
import expressionPools from "./data/expressionPools.json";
import poses from "./data/poses.json";
import wingStyles from "./data/wingStyles.json";
import simpleCrests from "./data/simpleCrests.json";
import simpleTails from "./data/simpleTails.json";
import legLengths from "./data/legLengths.json";
import simpleFeet from "./data/simpleFeet.json";
import palettes from "./data/palettes.json";
import quirks from "./data/quirks.json";
import treasures from "./data/treasures.json";
import patterns from "./data/patterns.json";
import patternPlacement from "./data/patternPlacement.json";
import storyCues from "./data/storyCues.json";
import attitudes from "./data/attitudes.json";
import sceneCards from "./data/sceneCards.json";

const tables = {
  birdEnergy,
  bodyShapes: simpleBodyShapes,
  expressions,
  expressionPools,
  poses,
  wingStyles,
  crests: simpleCrests,
  tails: simpleTails,
  legLengths,
  feet: simpleFeet,
  palettes,
  quirks,
  treasures,
  patterns,
  patternPlacement,
  storyCues,
  attitudes,
  sceneCards
};

const priorityTreasures = [
  "Chair Stuffing",
  "Lost Button",
  "Strip of Ribbon",
  "Perfect Pebble",
  "Shiny Bottle Cap",
  "Dandelion Puff",
  "Curly Leaf",
  "Colorful Feather",
  "Giant Acorn"
];

const poseDescriptions = {
  "Frozen Mid-Flinch": [
    "frozen in a startled flinch",
    "stopped mid-flinch with its whole body tense",
    "caught in a tiny moment of alarm"
  ],
  "One Foot Up": [
    "balancing on one foot",
    "hesitating with one foot raised",
    "holding one foot up like it just noticed something"
  ],
  "Tiny Hop": [
    "frozen mid-hop",
    "bouncing with excitement",
    "springing lightly off the ground"
  ],
  "Splayed Stance": [
    "standing with its feet planted wide",
    "bracing itself with a stubborn little stance",
    "standing wide like it refuses to move"
  ],
  "Pigeon-Toed Stand": [
    "standing with its toes turned inward",
    "standing shyly with its feet tucked toward each other",
    "looking bashful with pigeon-toed feet"
  ],
  "Proud Chest Puff": [
    "puffing out its chest proudly",
    "standing tall like it expects applause",
    "posing with its chest pushed forward"
  ],
  "Leaning Forward": [
    "leaning in for a closer look",
    "craning forward curiously",
    "tilting toward the interesting thing"
  ],
  "Tiptoe Sneak": [
    "sneaking quietly",
    "tiptoeing forward",
    "creeping along like it is up to something"
  ],
  Perched: [
    "perched neatly",
    "settled on its little perch",
    "balanced calmly in place"
  ],
  "Belly Sit": [
    "sitting on its tummy",
    "resting squarely on its belly",
    "plopped down with its belly on the ground"
  ],
  Slouched: [
    "slumping sleepily",
    "drooping like it has had a long day",
    "sagging into a soft little slouch"
  ],
  "Looking Over Shoulder": [
    "looking back over its shoulder",
    "glancing behind itself suspiciously",
    "twisting around to see what is happening"
  ],
  "Mid-Step": [
    "paused in the middle of a step",
    "caught mid-stride",
    "taking one careful little step"
  ],
  "Wing Flap": [
    "flapping its wings in a burst of energy",
    "fluttering like it cannot stand still",
    "waving its wings with dramatic urgency"
  ],
  "Tucked and Cozy": [
    "tucked into a cozy little shape",
    "nestled down comfortably",
    "curled into a soft resting pose"
  ]
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function itemName(item) {
  return typeof item === "string" ? item : item.name;
}

function itemImage(item) {
  return typeof item === "string" ? "" : item.image || "";
}

function hasValue(value) {
  return itemName(value) !== "None";
}

function lower(value) {
  return itemName(value).toLowerCase();
}

function slug(value) {
  return itemName(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function findItem(items, name) {
  return items.find((item) => itemName(item) === name);
}

function randomNamedItem(items, names) {
  const matches = names.map((name) => findItem(items, name)).filter(Boolean);
  return randomItem(matches.length > 0 ? matches : items);
}

function randomDifferentItem(items, currentItem) {
  if (items.length < 2) {
    return items[0];
  }

  let nextItem = randomItem(items);
  while (itemName(nextItem) === itemName(currentItem)) {
    nextItem = randomItem(items);
  }
  return nextItem;
}

function articleFor(value) {
  return /^[aeiou]/i.test(itemName(value)) ? "an" : "a";
}

function energyProfile(energy) {
  const profiles = {
    Sleepy: {
      pose: ["Belly Sit", "Slouched", "Tucked and Cozy"],
      bodyShape: ["Fluffy", "Marshmallow", "Blob"],
      wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
      crest: ["Ribbon Crest", "Pebble Tuft Crest", "Single Feather Crest"],
      tail: ["Cloud Tail", "Leaf Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["Leaf Cape", "Petal Collar", "Flower Crown", "None"],
      treasure: ["Chair Stuffing", "Dryer Lint Puff", "Soft Feather", "Dandelion Puff"]
    },
    Shy: {
      pose: ["Pigeon-Toed Stand", "One Foot Up", "Tucked and Cozy"],
      bodyShape: ["Bean", "Marshmallow", "Gumdrop", "Blob"],
      wingStyle: ["Cloud Wings", "Leaf Wings", "Tiny Wings"],
      crest: ["Pebble Tuft Crest", "Ribbon Crest", "Single Feather Crest"],
      tail: ["Leaf Tail", "Cloud Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["Flower Crown", "Daisy Necklace", "Round Glasses", "None"],
      treasure: ["Soft Feather", "Chair Stuffing", "Fabric Scrap", "Curly Leaf"]
    },
    Bossy: {
      pose: ["Proud Chest Puff", "Splayed Stance", "Mid-Step"],
      bodyShape: ["Round", "Pear", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Scallop Wings"],
      crest: ["Sunburst Crest", "Triple Tuft Crest", "Single Feather Crest"],
      tail: ["Fan Tail", "Ribbon Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["Tiny Gold Crown", "Tiny Bell", "Round Glasses"],
      treasure: ["Metal Washer", "Shiny Bottle Cap", "Lost Button", "Perfect Pebble"]
    },
    Zippy: {
      pose: ["Tiny Hop", "Wing Flap", "Mid-Step", "Leaning Forward"],
      bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
      crest: ["Sunburst Crest", "Triple Tuft Crest", "Single Feather Crest"],
      tail: ["Fan Tail", "Ribbon Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["Rain Boots", "Tiny Backpack", "Butterfly Bow Tie", "Sunflower Pin", "None"],
      treasure: ["Soda Tab", "Maple Seed", "Gum Wrapper", "Shiny Bottle Cap"]
    },
    Nervous: {
      pose: ["Frozen Mid-Flinch", "Pigeon-Toed Stand", "One Foot Up"],
      bodyShape: ["Bean", "Blob", "Marshmallow"],
      wingStyle: ["Leaf Wings", "Tiny Wings", "Feather Wings"],
      crest: ["Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["Tiny Umbrella", "Round Glasses", "Petal Collar", "None"],
      treasure: ["Chair Stuffing", "Lost Button", "Soft Feather", "Fabric Scrap"]
    },
    Confused: {
      pose: ["Looking Over Shoulder", "One Foot Up", "Splayed Stance"],
      bodyShape: ["Blob", "Bean", "Tall Skinny"],
      wingStyle: ["Cloud Wings", "Tiny Wings", "Feather Wings"],
      crest: ["Single Feather Crest", "Triple Tuft Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legLength: ["Short", "Medium"],
      quirk: ["Oversized Glasses", "Magnifying Glass", "Tiny Backpack", "None"],
      treasure: ["Metal Washer", "Pinecone Scale", "Smooth Shell", "Interesting Twig"]
    },
    Startled: {
      pose: ["Frozen Mid-Flinch", "Tiny Hop", "Splayed Stance"],
      bodyShape: ["Bean", "Tall Skinny", "Gumdrop"],
      wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
      crest: ["Sunburst Crest", "Triple Tuft Crest"],
      tail: ["Fan Tail", "Ribbon Tail"],
      legLength: ["Medium", "Tall"],
      quirk: ["Rain Hat", "Tiny Umbrella", "Round Glasses", "None"],
      treasure: ["Dandelion Puff", "Soda Tab", "Lost Button", "Maple Seed"]
    },
    Proud: {
      pose: ["Proud Chest Puff", "Perched", "Splayed Stance"],
      bodyShape: ["Pear", "Round", "Tall Skinny"],
      wingStyle: ["Scallop Wings", "Feather Wings"],
      crest: ["Sunburst Crest", "Triple Tuft Crest", "Flower Crown"],
      tail: ["Fan Tail", "Leaf Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["Tiny Gold Crown", "Twig Crown", "Sun Hat", "Flower Crown"],
      treasure: ["Perfect Pebble", "Shiny Bottle Cap", "Lost Button", "Colorful Feather", "Giant Acorn"]
    },
    Grumpy: {
      pose: ["Splayed Stance", "Slouched", "Perched"],
      bodyShape: ["Bean", "Blob", "Pear"],
      wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
      crest: ["Triple Tuft Crest", "Sunburst Crest", "Pebble Tuft Crest"],
      tail: ["Fan Tail", "Curly Tail"],
      legLength: ["Short", "Medium", "Tall"],
      quirk: ["Rain Hat", "Rain Boots", "Round Glasses", "None"],
      treasure: ["Perfect Pebble", "Metal Washer", "Lost Button", "Pinecone Scale"]
    },
    Daydreaming: {
      pose: ["Tucked and Cozy", "Belly Sit", "Leaning Forward"],
      bodyShape: ["Fluffy", "Marshmallow", "Blob"],
      wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
      crest: ["Ribbon Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Cloud Tail", "Leaf Tail"],
      legLength: ["Tiny", "Short", "Medium"],
      quirk: ["Flower Crown", "Leaf Crown", "Daisy Necklace", "Ribbon Bow", "Leaf Cape"],
      treasure: ["Dandelion Puff", "Fallen Flower Petal", "Milkweed Fluff", "Colorful Feather"]
    },
    Mischievous: {
      pose: ["Tiptoe Sneak", "Looking Over Shoulder", "Mid-Step"],
      bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
      crest: ["Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Ribbon Tail"],
      legLength: ["Short", "Medium", "Tall"],
      quirk: ["Oversized Glasses", "Butterfly Bow Tie", "Ladybug Button", "Tiny Bell"],
      treasure: ["Lost Button", "Strip of Ribbon", "Gum Wrapper", "Soda Tab", "Shiny Bottle Cap"]
    },
    Curious: {
      pose: ["Leaning Forward", "One Foot Up", "Mid-Step"],
      bodyShape: ["Bean", "Round", "Gumdrop"],
      wingStyle: ["Leaf Wings", "Feather Wings", "Tiny Wings"],
      crest: ["Single Feather Crest", "Triple Tuft Crest", "Pebble Tuft Crest"],
      tail: ["Leaf Tail", "Fan Tail", "Cloud Tail"],
      legLength: ["Medium", "Tall"],
      quirk: ["Explorer Hat", "Magnifying Glass", "Bug Jar", "Tiny Binoculars", "Tiny Backpack"],
      treasure: ["Curly Leaf", "Dandelion Puff", "Seed Pod", "Interesting Twig", "Maple Seed"]
    }
  };

  return profiles[energy] || profiles.Curious;
}

function randomAttitude(energy) {
  return randomItem(tables.attitudes[energy] || tables.attitudes.Curious);
}

function randomStoryCue(energy) {
  return randomItem(tables.storyCues[energy] || tables.storyCues.Curious);
}

function randomPoseDescription(pose, currentDescription = "") {
  const descriptions = poseDescriptions[pose] || [lower(pose)];
  const choices = descriptions.filter((description) => description !== currentDescription);
  return randomItem(choices.length > 0 ? choices : descriptions);
}

function weightedPick(items, names, chance = 0.78) {
  return names && Math.random() < chance ? randomNamedItem(items, names) : randomItem(items);
}

function randomTreasureForEnergy(energy, currentTreasure = "") {
  const profile = energyProfile(energy);

  if (Math.random() < 0.6) {
    return "None";
  }

  const weightedNames = profile.treasure || priorityTreasures;
  const candidates = Math.random() < 0.85 ? weightedNames : priorityTreasures;
  const matches = candidates.filter((treasure) => treasure !== currentTreasure && tables.treasures.includes(treasure));

  return randomItem(matches.length > 0 ? matches : tables.treasures.filter((treasure) => treasure !== "None"));
}

function randomDifferentTreasureForEnergy(energy, currentTreasure) {
  for (let index = 0; index < 8; index += 1) {
    const treasure = randomTreasureForEnergy(energy, currentTreasure);
    if (treasure !== currentTreasure) {
      return treasure;
    }
  }

  return currentTreasure === "None" ? randomNamedItem(tables.treasures, priorityTreasures) : "None";
}

function treasurePhrase(treasure) {
  const value = lower(treasure);
  return /(stuffing|lint|fluff)$/.test(value) ? value : `${articleFor(treasure)} ${value}`;
}

function randomTreasureStory(energy, treasure) {
  if (!hasValue(treasure)) {
    return "";
  }

  const phrase = treasurePhrase(treasure);
  const options = {
    Proud: [
      `It is proudly displaying ${phrase} it discovered this morning.`,
      `It is showing off ${phrase} like it belongs in a museum.`,
      `It is presenting ${phrase} as if it were priceless.`
    ],
    Curious: [
      `It is carefully investigating ${phrase} it has never seen before.`,
      `It is trying to understand why ${phrase} seems so important.`,
      `It has stopped everything to inspect ${phrase}.`
    ],
    Mischievous: [
      `It looks suspiciously pleased about ${phrase} beside it.`,
      `It may have borrowed ${phrase} without permission.`,
      `It is pretending ${phrase} was already there.`
    ],
    Shy: [
      `It is quietly hiding ${phrase} behind its back.`,
      `It hopes nobody notices its treasured ${lower(treasure)} collection.`,
      `It is guarding ${phrase} very politely.`
    ],
    Daydreaming: [
      `It is gazing at ${phrase} like it might contain a tiny daydream.`,
      `It is imagining an entire story about ${phrase}.`,
      `It is holding ${phrase} as if it floated in from a dream.`
    ]
  };

  const fallback = [
    `It has discovered ${phrase} and seems to have very strong feelings about it.`,
    `It is treating ${phrase} like the most important object in the garden.`,
    `It has chosen ${phrase} as its favorite backyard discovery.`
  ];

  return randomItem(options[energy] || fallback);
}

function randomExpressionForEnergy(energy, currentExpression = "") {
  const pool = tables.expressionPools[energy] || {};
  const primary = pool.primary || [];
  const secondary = pool.secondary || tables.expressions;
  const candidates = Math.random() < 0.8 ? primary : secondary;
  const choices = candidates.filter((expression) => expression !== currentExpression);
  return randomItem(choices.length > 0 ? choices : candidates.length > 0 ? candidates : tables.expressions);
}

function weightedScenePick(scenes) {
  const totalWeight = scenes.reduce((sum, scene) => sum + (scene.weight || 1), 0);
  let ticket = Math.random() * totalWeight;

  for (const scene of scenes) {
    ticket -= scene.weight || 1;
    if (ticket <= 0) {
      return scene;
    }
  }

  return scenes.at(-1);
}

function sceneMatchesEnergy(scene, energy) {
  return scene.compatibleCharacterStates.includes(energy);
}

function sceneMatchesPose(scene, pose) {
  return scene.compatiblePoses.includes(pose);
}

function randomSceneForMoment(energy, pose, currentSceneName = "") {
  const withoutCurrent = tables.sceneCards.filter((scene) => scene.sceneName !== currentSceneName);
  const candidates = withoutCurrent.length > 0 ? withoutCurrent : tables.sceneCards;
  const exact = candidates.filter((scene) => sceneMatchesEnergy(scene, energy) && sceneMatchesPose(scene, pose));
  const energyOnly = candidates.filter((scene) => sceneMatchesEnergy(scene, energy));
  const poseOnly = candidates.filter((scene) => sceneMatchesPose(scene, pose));

  return weightedScenePick(exact.length > 0 ? exact : energyOnly.length > 0 ? energyOnly : poseOnly.length > 0 ? poseOnly : candidates);
}

function makeBird() {
  const energy = randomItem(tables.birdEnergy);
  const profile = energyProfile(energy);
  const storyCue = randomStoryCue(energy);
  const pose = weightedPick(tables.poses, profile.pose);
  const treasure = randomTreasureForEnergy(energy);

  return {
    birdEnergy: energy,
    attitude: randomAttitude(energy),
    expression: randomExpressionForEnergy(energy),
    pose,
    poseDescription: randomPoseDescription(pose),
    storyCue: storyCue.text,
    scene: randomSceneForMoment(energy, pose),
    treasure,
    treasureStory: randomTreasureStory(energy, treasure),
    bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape),
    wingStyle: weightedPick(tables.wingStyles, profile.wingStyle),
    crest: weightedPick(tables.crests, profile.crest),
    tail: weightedPick(tables.tails, profile.tail),
    legLength: weightedPick(tables.legLengths, profile.legLength),
    feet: randomItem(tables.feet),
    pattern: randomItem(tables.patterns),
    patternPlacement: randomItem(tables.patternPlacement),
    quirk: weightedPick(tables.quirks, profile.quirk, 0.65),
    colorPalette: randomItem(tables.palettes)
  };
}

function paletteWord(palette) {
  return palette.name.split(" ")[0];
}

function birdName(bird) {
  return `${bird.birdEnergy} ${paletteWord(bird.colorPalette)} Bird`;
}

function quirkPhrase(quirk) {
  const value = lower(quirk);
  return /(glasses|boots|binoculars)$/.test(value) ? value : `${articleFor(quirk)} ${value}`;
}

function wingPhrase(wingStyle) {
  return hasValue(wingStyle) ? lower(wingStyle) : "no visible wings";
}

function crestPhrase(crest) {
  return hasValue(crest) ? `a ${lower(crest)}` : "no crest";
}

function tailPhrase(tail) {
  return hasValue(tail) ? `a ${lower(tail)}` : "no tail";
}

function patternPhrase(bird) {
  if (!hasValue(bird.pattern)) {
    return "";
  }

  const location = lower(bird.patternPlacement);
  return location === "all over" ? `Add ${lower(bird.pattern)} all over.` : `Add ${lower(bird.pattern)} on the ${location}.`;
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function storySentence(bird) {
  const cue = bird.storyCue || `It is ${bird.attitude}.`;
  const sceneText = lower(bird.scene.sceneText);

  if (cue.startsWith("It is ")) {
    return `It is ${sceneText}, ${cue.slice(6)}`;
  }

  if (cue.startsWith("It looks ")) {
    return `It is ${sceneText}, ${lowerFirst(cue)}`;
  }

  if (cue.startsWith("It just ") || cue.startsWith("It has ")) {
    return `It is ${sceneText} after ${lowerFirst(cue)}`;
  }

  if (cue.startsWith("It does ")) {
    return `It is ${sceneText} and ${cue.slice(3)}`;
  }

  return `It is ${sceneText}. ${cue}`;
}

function birdPrompt(bird) {
  const paragraphs = [
    `Draw a ${lower(bird.birdEnergy)} bird with a ${lower(bird.bodyShape)} shaped body, ${wingPhrase(bird.wingStyle)}, ${crestPhrase(bird.crest)}, and ${tailPhrase(bird.tail)}.`,
    `Add ${lower(bird.legLength)} legs with ${lower(bird.feet)}. Give it a ${lower(bird.expression)} expression.`
  ];

  if (hasValue(bird.pattern)) {
    paragraphs.push(patternPhrase(bird));
  }

  if (hasValue(bird.quirk)) {
    paragraphs.push(`Add ${quirkPhrase(bird.quirk)}.`);
  }

  paragraphs.push(`Use the ${bird.colorPalette.name} palette.`);

  paragraphs.push(`Optional story idea: ${storySentence(bird)} Optional pose inspiration: ${bird.poseDescription}.`);

  if (hasValue(bird.treasure)) {
    paragraphs.push(bird.treasureStory);
  }

  return paragraphs;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
    bird.expression,
    itemName(bird.bodyShape),
    itemName(bird.wingStyle),
    itemName(bird.crest),
    itemName(bird.tail),
    bird.pattern,
    bird.treasure,
    bird.quirk,
    bird.colorPalette.name
  ].filter(hasValue);
}

function sketchDetails(bird) {
  return [
    ["Body Shape", itemName(bird.bodyShape), itemImage(bird.bodyShape), "bodyShape"],
    ["Wings", itemName(bird.wingStyle), itemImage(bird.wingStyle), "wingStyle"],
    ["Crest", itemName(bird.crest), itemImage(bird.crest), "crest"],
    ["Tail", itemName(bird.tail), itemImage(bird.tail), "tail"]
  ];
}

function legsDetails(bird) {
  return [
    ["Leg Length", bird.legLength, "", "legLength"],
    ["Feet", itemName(bird.feet), itemImage(bird.feet), "feet"],
    ["Optional", "Use the pose idea below, or draw the bird standing normally.", "", ""]
  ];
}

function faceDetails(bird) {
  return [["Expression", bird.expression, "", "expression"]];
}

function patternDetails(bird) {
  return [
    ["Pattern", bird.pattern, "", "pattern"],
    ["Location", hasValue(bird.pattern) ? bird.patternPlacement : "Optional", "", "patternPlacement"]
  ];
}

function accessoryDetails(bird) {
  return [["Accessory", bird.quirk, "", "quirk"]];
}

function storyDetails(bird) {
  const rows = [
    ["Story Idea", storySentence(bird), "", "storyCue"],
    ["Optional Pose Inspiration", bird.poseDescription, "", "pose"],
    ["Treasure", bird.treasure, "", "treasure"]
  ];

  if (hasValue(bird.treasure)) {
    rows.push(["Treasure Moment", bird.treasureStory, "", ""]);
  }

  return rows;
}

function expressionImage(expression) {
  const value = lower(expression);

  if (/(gasp|wide|spark|surprised|scream|question)/.test(value)) {
    return "/assets/bird-parts/eyes/round.png";
  }

  if (/(squint|blink|glare|unimpressed|dozy|sleepy|heavy)/.test(value)) {
    return "/assets/bird-parts/eyes/tall.png";
  }

  if (/(side|peek|looking away|worried|unsure|nervous|tilted)/.test(value)) {
    return "/assets/bird-parts/eyes/oval.png";
  }

  if (/(smile|grin|smirk|pleased|proud|royal|delighted|guilty)/.test(value)) {
    return "/assets/bird-parts/eyes/gumdrop.png";
  }

  return "/assets/bird-parts/eyes/simple.png";
}

function SketchLayer({ src, className }) {
  if (!src) {
    return null;
  }

  return (
    <img
      className={`sketch-layer ${className}`}
      src={src}
      alt=""
      onError={(event) => {
        event.currentTarget.hidden = true;
      }}
    />
  );
}

function SketchPreview({ bird }) {
  const stageClasses = [
    "sketch-stage",
    "simple-bird",
    `energy-${slug(bird.birdEnergy)}`,
    `expression-${slug(bird.expression)}`,
    `pose-${slug(bird.pose)}`
  ].join(" ");

  return (
    <section className="sketch-preview-card" aria-labelledby="sketch-preview-heading">
      <div className="section-heading">
        <h2 id="sketch-preview-heading">Character Construction Preview</h2>
        <p>A simple character pose guide, not final art.</p>
      </div>
      <div className={stageClasses}>
        <SketchLayer src={itemImage(bird.bodyShape)} className="sketch-body" />
        <SketchLayer src={itemImage(bird.crest)} className="sketch-crest" />
        <SketchLayer src={itemImage(bird.tail)} className="sketch-tail" />
        <SketchLayer src={itemImage(bird.wingStyle)} className="sketch-wing" />
        <SketchLayer src={expressionImage(bird.expression)} className="sketch-eyes" />
        <SketchLayer src={itemImage(bird.feet)} className="sketch-feet" />
      </div>
    </section>
  );
}

function CharacterSnapshot({ bird }) {
  return (
    <section className="snapshot-card" aria-labelledby="snapshot-heading">
      <div className="section-heading">
        <h2 id="snapshot-heading">Character Snapshot</h2>
      </div>
      <div className="snapshot-main">
        <p className="snapshot-energy">{bird.birdEnergy} Bird</p>
        <p className="snapshot-pose">{bird.poseDescription}</p>
      </div>
      <dl className="snapshot-details">
        <div>
          <dt>Expression</dt>
          <dd>{bird.expression}</dd>
        </div>
        <div>
          <dt>Story</dt>
          <dd>
            {storySentence(bird)}
            {hasValue(bird.treasure) ? ` ${bird.treasureStory}` : ""}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function PaletteSwatches({ colors }) {
  return (
    <div className="palette-swatches" aria-label="Palette colors">
      {colors.map((color) => (
        <span key={color} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function DetailCard({ title, rows, onShuffle }) {
  return (
    <section className="detail-card" aria-labelledby={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>
      <h2 id={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>
        <span>{title}</span>
      </h2>
      <dl>
        {rows.map(([label, value, image, field]) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd>
              <span className="detail-value">
                {image && (
                  <img
                    className="detail-thumb"
                    src={image}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                )}
                <span>{value}</span>
              </span>
              {field && (
                <button type="button" className="shuffle-button" onClick={() => onShuffle(field)}>
                  Shuffle
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ColorPaletteCard({ palette, onShuffle }) {
  return (
    <section className="palette-card" aria-labelledby="color-palette-heading">
      <div className="section-heading">
        <h2 id="color-palette-heading"><span>Step 3 - Add Color</span></h2>
        <p>{palette.mood}</p>
      </div>
      <div className="palette-heading-row">
        <h3>Palette: {palette.name}</h3>
        <button type="button" className="shuffle-button" onClick={() => onShuffle("colorPalette")}>
          Shuffle
        </button>
      </div>
      <PaletteSwatches colors={palette.colors} />
    </section>
  );
}

export default function App() {
  const [bird, setBird] = useState(() => makeBird());
  const [copyStatus, setCopyStatus] = useState("");
  const prompt = useMemo(() => birdPrompt(bird), [bird]);

  function generateBird() {
    setBird(makeBird());
    setCopyStatus("");
  }

  function shuffleField(field) {
    if (field === "birdEnergy") {
      setBird((currentBird) => {
        const nextEnergy = randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy);
        const profile = energyProfile(nextEnergy);
        const cue = randomStoryCue(nextEnergy);
        const pose = weightedPick(tables.poses, profile.pose);
        const treasure = randomTreasureForEnergy(nextEnergy, currentBird.treasure);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          attitude: randomAttitude(nextEnergy),
          expression: randomExpressionForEnergy(nextEnergy, currentBird.expression),
          pose,
          poseDescription: randomPoseDescription(pose, currentBird.poseDescription),
          storyCue: cue.text,
          scene: randomSceneForMoment(nextEnergy, pose, currentBird.scene.sceneName),
          treasure,
          treasureStory: randomTreasureStory(nextEnergy, treasure),
          bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape),
          wingStyle: weightedPick(tables.wingStyles, profile.wingStyle),
          crest: weightedPick(tables.crests, profile.crest),
          tail: weightedPick(tables.tails, profile.tail),
          legLength: weightedPick(tables.legLengths, profile.legLength),
          quirk: weightedPick(tables.quirks, profile.quirk, 0.65)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "storyCue") {
      setBird((currentBird) => {
        const cues = tables.storyCues[currentBird.birdEnergy] || tables.storyCues.Curious;
        const choices = cues.filter((cue) => cue.text !== currentBird.storyCue);
        return {
          ...currentBird,
          storyCue: randomItem(choices.length > 0 ? choices : cues).text
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "pose") {
      setBird((currentBird) => {
        const nextPose = randomDifferentItem(tables.poses, currentBird.pose);
        return {
          ...currentBird,
          pose: nextPose,
          poseDescription: randomPoseDescription(nextPose, currentBird.poseDescription),
          scene: randomSceneForMoment(currentBird.birdEnergy, nextPose, currentBird.scene.sceneName)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "scene") {
      setBird((currentBird) => ({
        ...currentBird,
        scene: randomSceneForMoment(currentBird.birdEnergy, currentBird.pose, currentBird.scene.sceneName)
      }));
      setCopyStatus("");
      return;
    }

    if (field === "treasure") {
      setBird((currentBird) => {
        const treasure = randomDifferentTreasureForEnergy(currentBird.birdEnergy, currentBird.treasure);
        return {
          ...currentBird,
          treasure,
          treasureStory: randomTreasureStory(currentBird.birdEnergy, treasure)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "expression") {
      setBird((currentBird) => ({
        ...currentBird,
        expression: randomExpressionForEnergy(currentBird.birdEnergy, currentBird.expression)
      }));
      setCopyStatus("");
      return;
    }

    const fieldTables = {
      bodyShape: tables.bodyShapes,
      wingStyle: tables.wingStyles,
      crest: tables.crests,
      tail: tables.tails,
      legLength: tables.legLengths,
      feet: tables.feet,
      pattern: tables.patterns,
      patternPlacement: tables.patternPlacement,
      quirk: tables.quirks,
      treasure: tables.treasures,
      colorPalette: tables.palettes
    };

    const items = fieldTables[field];
    if (!items) {
      return;
    }

    setBird((currentBird) => ({
      ...currentBird,
      [field]: randomDifferentItem(items, currentBird[field])
    }));
    setCopyStatus("");
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt.join("\n\n"));
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Copy is blocked here. Select the prompt text to copy it.");
    }
  }

  return (
    <main className="page">
      <section className="sketchbook" aria-labelledby="bird-title">
        <header className="page-header">
          <div className="eyebrow">Whimsical Bird Builder</div>
          <p className="kicker">Whimsical Drawing Prompt Generator</p>
        </header>

        <button type="button" className="primary-action" onClick={generateBird}>Build Another Bird</button>

        <section className="result-hero">
          <p className="today-label">Today's Bird</p>
          <h1 id="bird-title">{birdName(bird)}</h1>
        </section>

        <div className="recipe-strip" aria-label="Bird recipe highlights">
          {recipeChips(bird).map((chip, index) => (
            <span key={`${chip}-${index}`}>{chip}</span>
          ))}
        </div>

        <div className="prompt-column">
          <section className="prompt-card" aria-labelledby="prompt-heading">
            <h2 id="prompt-heading">Draw This Bird</h2>
            <div className="prompt-text">
              {prompt.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <div className="copy-action">
            <button type="button" className="secondary" onClick={copyPrompt}>Copy Prompt</button>
            <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
          </div>
        </div>

        <div className="detail-grid">
          <DetailCard title="Step 1 - Sketch the Bird" rows={sketchDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Step 2 - Add Legs & Feet" rows={legsDetails(bird)} onShuffle={shuffleField} />
          <ColorPaletteCard palette={bird.colorPalette} onShuffle={shuffleField} />
          <DetailCard title="Step 4 - Draw the Face" rows={faceDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Step 5 - Add Pattern" rows={patternDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Step 6 - Optional Accessory" rows={accessoryDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Step 7 - Story Idea" rows={storyDetails(bird)} onShuffle={shuffleField} />
        </div>

      </section>
    </main>
  );
}
