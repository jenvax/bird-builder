import React, { useMemo, useState } from "react";
import birdEnergy from "./data/birdEnergy.json";
import simpleBodyShapes from "./data/simpleBodyShapes.json";
import expressions from "./data/expressions.json";
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

const finalEmotionValues = new Set(birdEnergy);
const finalPoseValues = new Set(poses);
const boldPaletteEmotions = new Set([
  "Joyful",
  "Excited",
  "Mischievous",
  "Playful",
  "Cheeky",
  "Surprised",
  "Startled",
  "Shocked",
  "Irritated",
  "Annoyed",
  "Frustrated",
  "Angry"
]);

const stationarySettingPoses = new Set([
  "Neutral",
  "Curious",
  "Proud",
  "Grumpy",
  "Shy",
  "Confused",
  "Daydreaming",
  "One Foot Up",
  "Relaxed Stand",
  "Tucked In",
  "Suspicious"
]);

const stationarySettings = [
  "Perched on a branch",
  "Perched on a fence post",
  "Standing on a mushroom",
  "Standing on a garden stone",
  "Standing on a tree stump",
  "Standing on a flower pot",
  "Tucked into a nest",
  "Nestled among leaves",
  "Sitting in tall grass"
];

const activeSettingDetails = [
  "A snail nearby",
  "A beetle on the path",
  "A dandelion puff nearby",
  "A mysterious footprint nearby",
  "A shiny bottle cap nearby"
];

const tryThisPrompts = [
  "Exaggerate the crest.",
  "Make the eyes extra large.",
  "Make the tail especially dramatic.",
  "Make the bird extra fluffy.",
  "Make the legs comically long.",
  "Draw the tiniest beak possible."
];

const poseDescriptions = {
  Neutral: ["standing normally"],
  Curious: ["leaning in for a closer look"],
  Proud: ["standing tall like it expects applause"],
  Grumpy: ["standing firmly with a stubborn little stance"],
  Shy: ["standing shyly with its feet tucked toward each other"],
  Confused: ["tilting as if it is trying to understand"],
  Daydreaming: ["gazing off into the distance"],
  Walking: ["walking along"],
  Hopping: ["hopping with bright energy"],
  "Relaxed Stand": ["standing in a relaxed pose"],
  "Tucked In": ["tucked into a cozy little shape"],
  Startled: ["frozen in a startled flinch"],
  Scared: ["trying to be brave while looking nervous"],
  Excited: ["bouncing with excitement"],
  Suspicious: ["glancing sideways suspiciously"],
  Frustrated: ["standing with very big feelings"],
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

function validateEmotion(emotion) {
  return finalEmotionValues.has(emotion) ? emotion : "Curious";
}

function validatePose(pose) {
  return finalPoseValues.has(pose) ? pose : "Neutral";
}

const emotionProfiles = {
  Joyful: { archetype: "Zippy", expression: "Joyful", pose: "Hopping", story: "It is hopping like the garden just told it wonderful news." },
  Cheerful: { archetype: "Curious", expression: "Cheerful", pose: "Walking", story: "Walking along as if every flower is a friendly neighbor." },
  Excited: { archetype: "Zippy", expression: "Excited", pose: "Tiny Hop", story: "Bouncing with excitement over something tiny and excellent." },
  Proud: { archetype: "Proud", expression: "Proud", pose: "Proud", story: "Showing off like it has just done something very impressive." },
  Content: { archetype: "Sleepy", expression: "Content", pose: "Relaxed Stand", story: "Resting happily in a quiet garden moment." },
  Curious: { archetype: "Curious", expression: "Curious", pose: "Curious", story: "Watching a snail cross the ground like it is the most important parade." },
  Intrigued: { archetype: "Curious", expression: "Intrigued", pose: "Curious", story: "Leaning toward a tiny mystery in the grass." },
  Focused: { archetype: "Curious", expression: "Focused", pose: "One Foot Up", story: "Studying one small detail with complete seriousness." },
  Thoughtful: { archetype: "Daydreaming", expression: "Thoughtful", pose: "Daydreaming", story: "Pausing as if it just remembered a very poetic leaf." },
  Mischievous: { archetype: "Mischievous", expression: "Mischievous", pose: "Suspicious", story: "Looking much too pleased about a tiny secret." },
  Playful: { archetype: "Zippy", expression: "Playful", pose: "Hopping", story: "Hopping around like the whole garden is a game." },
  Cheeky: { archetype: "Mischievous", expression: "Cheeky", pose: "Suspicious", story: "Pretending it did not cause the tiny mess nearby." },
  Guilty: { archetype: "Shy", expression: "Guilty", pose: "Shy", story: "Trying to look innocent beside something it definitely moved." },
  Surprised: { archetype: "Startled", expression: "Surprised", pose: "Startled", story: "Freezing because something small happened very suddenly." },
  Startled: { archetype: "Startled", expression: "Startled", pose: "Startled", story: "Frozen in place after hearing a rustle in the flowers." },
  Shocked: { archetype: "Startled", expression: "Shocked", pose: "Scared", story: "Shocked by a garden discovery that feels enormous." },
  Disbelieving: { archetype: "Confused", expression: "Disbelieving", pose: "Confused", story: "Staring at the wrong thing and refusing to understand it." },
  Anxious: { archetype: "Nervous", expression: "Anxious", pose: "Scared", story: "Trying to decide whether a tiny sound is friendly or alarming." },
  Worried: { archetype: "Nervous", expression: "Worried", pose: "One Foot Up", story: "Holding one foot up while considering a very small problem." },
  Uneasy: { archetype: "Shy", expression: "Uneasy", pose: "Shy", story: "Keeping close to the leaves just in case." },
  Scared: { archetype: "Nervous", expression: "Scared", pose: "Scared", story: "Trying to be brave near something harmless but surprising." },
  Sad: { archetype: "Shy", expression: "Sad", pose: "Tucked In", story: "Sitting quietly with a very small disappointed feeling." },
  Disappointed: { archetype: "Shy", expression: "Disappointed", pose: "Shy", story: "Looking at the ground like the worm parade was canceled." },
  Lonely: { archetype: "Shy", expression: "Lonely", pose: "Tucked In", story: "Waiting quietly for someone kind to notice." },
  Hopeful: { archetype: "Curious", expression: "Hopeful", pose: "Curious", story: "Looking toward something new with a tiny bit of courage." },
  Irritated: { archetype: "Grumpy", expression: "Irritated", pose: "Grumpy", story: "Not approving of a flower that is being much too cheerful." },
  Annoyed: { archetype: "Grumpy", expression: "Annoyed", pose: "Grumpy", story: "Silently judging a beetle for walking in the wrong direction." },
  Frustrated: { archetype: "Grumpy", expression: "Frustrated", pose: "Frustrated", story: "Trying to solve a tiny problem with very big feelings." },
  Angry: { archetype: "Grumpy", expression: "Angry", pose: "Frustrated", story: "Standing firmly as if the garden owes it an explanation." }
};

const archetypeProfiles = {
  Sleepy: {
    bodyShape: ["Fluffy", "Marshmallow", "Round", "Blob"],
    wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
    crest: ["Ribbon Crest", "Pebble Tuft Crest", "Single Feather Crest"],
    tail: ["Cloud Tail", "Leaf Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Leaf Cape", "Flower Crown", "None"],
    treasure: ["Chair Stuffing", "Dandelion Puff", "Colorful Feather"]
  },
  Shy: {
    bodyShape: ["Bean", "Marshmallow", "Round", "Gumdrop", "Blob"],
    wingStyle: ["Cloud Wings", "Leaf Wings"],
    crest: ["Pebble Tuft Crest", "Ribbon Crest", "Single Feather Crest"],
    tail: ["Leaf Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Flower Crown", "Daisy Necklace", "Round Glasses", "None"],
    treasure: ["Chair Stuffing", "Strip of Ribbon", "Colorful Feather", "Curly Leaf"]
  },
  Proud: {
    bodyShape: ["Pear", "Round", "Tall Skinny"],
    wingStyle: ["Scallop Wings", "Feather Wings"],
    crest: ["Fan Crest", "Triple Tuft Crest", "Sunburst Crest"],
    tail: ["Fan Tail", "Flared Fan Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Gold Crown", "Twig Crown", "Sun Hat", "Flower Crown"],
    treasure: ["Perfect Pebble", "Shiny Bottle Cap", "Lost Button", "Colorful Feather", "Giant Acorn"]
  },
  Zippy: {
    bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
    wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
    crest: ["Sunburst Crest", "Wild Tuft Crest", "Triple Tuft Crest"],
    tail: ["Fan Tail", "Flared Fan Tail", "Ribbon Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Backpack", "Butterfly Bow Tie", "Tiny Umbrella", "None"],
    treasure: ["Shiny Bottle Cap", "Dandelion Puff", "Curly Leaf"]
  },
  Nervous: {
    bodyShape: ["Bean", "Blob", "Marshmallow"],
    wingStyle: ["Leaf Wings", "Tiny Wings", "Feather Wings"],
    crest: ["Wild Tuft Crest", "Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Curly Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Tiny Umbrella", "Round Glasses", "None"],
    treasure: ["Chair Stuffing", "Lost Button", "Colorful Feather"]
  },
  Confused: {
    bodyShape: ["Blob", "Bean", "Tall Skinny"],
    wingStyle: ["Cloud Wings", "Tiny Wings", "Feather Wings"],
    crest: ["Single Feather Crest", "Crooked Tuft Crest", "Pebble Tuft Crest"],
    tail: ["Curly Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Magnifying Glass", "Tiny Backpack", "None"],
    treasure: ["Interesting Twig", "Seed Pod", "Curly Leaf"]
  },
  Startled: {
    bodyShape: ["Bean", "Tall Skinny", "Gumdrop"],
    wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
    crest: ["Sunburst Crest", "Wild Tuft Crest", "Triple Tuft Crest"],
    tail: ["Fan Tail", "Flared Fan Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Umbrella", "Round Glasses", "None"],
    treasure: ["Dandelion Puff", "Lost Button", "Seed Pod"]
  },
  Grumpy: {
    bodyShape: ["Bean", "Blob", "Pear"],
    wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
    crest: ["Crooked Tuft Crest", "Triple Tuft Crest", "Sunburst Crest", "Pebble Tuft Crest"],
    tail: ["Fan Tail", "Curly Tail"],
    legLength: ["Short", "Medium", "Tall"],
    quirk: ["Round Glasses", "Tiny Umbrella", "None"],
    treasure: ["Perfect Pebble", "Lost Button", "Interesting Twig"]
  },
  Daydreaming: {
    bodyShape: ["Fluffy", "Marshmallow", "Blob"],
    wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
    crest: ["Ribbon Crest", "Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Cloud Tail", "Leaf Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Flower Crown", "Leaf Crown", "Daisy Necklace", "Ribbon Bow", "Leaf Cape"],
    treasure: ["Dandelion Puff", "Flower Petal", "Milkweed Fluff", "Colorful Feather"]
  },
  Mischievous: {
    bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
    wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
    crest: ["Crooked Tuft Crest", "Triple Tuft Crest", "Single Feather Crest"],
    tail: ["Curly Tail", "Ribbon Tail"],
    legLength: ["Short", "Medium", "Tall"],
    quirk: ["Butterfly Bow Tie", "Ladybug Button", "Tiny Bell", "None"],
    treasure: ["Lost Button", "Strip of Ribbon", "Shiny Bottle Cap"]
  },
  Curious: {
    bodyShape: ["Bean", "Round", "Gumdrop"],
    wingStyle: ["Leaf Wings", "Feather Wings", "Tiny Wings"],
    crest: ["Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Leaf Tail", "Fan Tail", "Cloud Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Explorer Hat", "Magnifying Glass", "Bug Jar", "Tiny Binoculars", "Tiny Backpack"],
    treasure: ["Curly Leaf", "Dandelion Puff", "Seed Pod", "Interesting Twig"]
  }
};

function emotionProfile(emotion) {
  const safeEmotion = validateEmotion(emotion);
  return emotionProfiles[safeEmotion] || emotionProfiles.Curious;
}

function recommendedPoseForEmotion(emotion) {
  const mappedPose = emotionProfile(emotion).pose;
  return validatePose(mappedPose);
}

function energyProfile(energy) {
  return archetypeProfiles[emotionProfile(energy).archetype] || archetypeProfiles.Curious;
}

function randomAttitude(energy) {
  return randomItem(tables.attitudes[energy] || tables.attitudes.Curious);
}

function randomStoryCue(energy) {
  const baseStory = emotionProfile(energy).story;
  const storyOptions = [
    baseStory,
    "Watching a snail cross the ground like it is the most important parade.",
    "Trying to understand a mysterious footprint.",
    "Listening to the wind like it is music.",
    "Carrying a piece of chair stuffing nearly as large as itself."
  ];

  return { text: randomItem(storyOptions) };
}

function randomPoseDescription(pose, currentDescription = "") {
  const descriptions = poseDescriptions[pose] || [lower(pose)];
  const choices = descriptions.filter((description) => description !== currentDescription);
  return randomItem(choices.length > 0 ? choices : descriptions);
}

function weightedPick(items, names, chance = 0.78) {
  return names && Math.random() < chance ? randomNamedItem(items, names) : randomItem(items);
}

function randomPaletteForEmotion(emotion, currentPaletteName = "") {
  const wantsBold = boldPaletteEmotions.has(validateEmotion(emotion));
  const preferred = tables.palettes.filter((palette) =>
    wantsBold ? palette.collection === "Silly Bird Palettes" : palette.collection !== "Silly Bird Palettes"
  );
  const fallback = preferred.length > 0 ? preferred : tables.palettes;
  const candidates = fallback.filter((palette) => palette.name !== currentPaletteName);
  return randomItem(candidates.length > 0 ? candidates : fallback);
}

function randomSettingForPose(pose, currentSetting = "") {
  const allowsStationarySetting = stationarySettingPoses.has(validatePose(pose));
  const options = ["None", ...(allowsStationarySetting ? stationarySettings : activeSettingDetails)];
  const candidates = options.filter((setting) => setting !== currentSetting);
  return randomItem(candidates.length > 0 ? candidates : options);
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

  return randomItem(options[emotionProfile(energy).archetype] || options[energy] || fallback);
}

function randomExpressionForEnergy(energy, currentExpression = "") {
  const recommended = emotionProfile(energy).expression;

  if (recommended !== currentExpression && Math.random() < 0.85) {
    return recommended;
  }

  return randomDifferentItem(tables.expressions, currentExpression);
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
  const energy = validateEmotion(randomItem(tables.birdEnergy));
  const profile = energyProfile(energy);
  const emotion = emotionProfile(energy);
  const storyCue = randomStoryCue(energy);
  const pose = recommendedPoseForEmotion(energy);
  const treasure = randomTreasureForEnergy(energy);

  return {
    birdEnergy: energy,
    attitude: randomAttitude(energy),
    expression: emotion.expression,
    pose,
    poseDescription: randomPoseDescription(pose),
    storyCue: storyCue.text,
    scene: randomSceneForMoment(energy, pose),
    setting: randomSettingForPose(pose),
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
    colorPalette: randomPaletteForEmotion(energy),
    tryThis: randomItem(tryThisPrompts)
  };
}

function paletteWord(palette) {
  return palette.name.split(" ")[0];
}

function birdName(bird) {
  return `${bird.birdEnergy} ${paletteWord(bird.colorPalette)} Bird`;
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

function feetPhrase(feet) {
  return lower(feet);
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function trimSentence(value) {
  return value.replace(/[.!?]\s*$/, "");
}

function storySentence(bird) {
  return bird.storyCue || emotionProfile(bird.birdEnergy).story;
}

function storyIdea(bird) {
  if (hasValue(bird.treasure)) {
    return bird.treasureStory;
  }

  if (hasValue(bird.setting)) {
    return `${bird.setting}, ${lowerFirst(trimSentence(storySentence(bird)))}.`;
  }

  return storySentence(bird);
}

function birdPrompt(bird) {
  const sections = [
    `Draw a ${lower(bird.birdEnergy)} bird.`,
    `Sketch the Bird\n- ${lower(bird.bodyShape)} shaped body\n- ${lower(bird.wingStyle)}\n- ${lower(bird.crest)}\n- ${lower(bird.tail)}`,
    `Add Legs & Feet\n- ${lower(bird.legLength)} legs\n- ${feetPhrase(bird.feet)}`,
    `Add Color\n- ${bird.colorPalette.name} palette`
  ];

  if (hasValue(bird.pattern)) {
    const location = lower(bird.patternPlacement);
    const patternText = location === "all over" ? `${lower(bird.pattern)} all over` : `${lower(bird.pattern)} on the ${location}`;
    sections.push(`Add Pattern\n- ${patternText}`);
  }

  if (hasValue(bird.quirk)) {
    sections.push(`Optional Accessory\n- ${lower(bird.quirk)}`);
  }

  sections.push(`Recommended Expression\n- ${bird.expression}`);
  sections.push(`Recommended Pose\n- ${bird.pose}`);
  sections.push("Use the reference sheets for inspiration. Feel free to choose any expression or pose you like.");
  sections.push(`Optional Story Idea\n- ${storyIdea(bird)}`);
  sections.push(`Try This\n- ${bird.tryThis}`);

  return sections;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
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

function emotionDetails(bird) {
  return [
    ["Emotion", bird.birdEnergy, "", "birdEnergy"],
    ["Recommended Expression", bird.expression, "", ""],
    ["Recommended Pose", bird.pose, "", ""],
    ["Reference Sheet Note", "Use these as inspiration. Feel free to choose any expression or pose from the reference sheets.", "", ""]
  ];
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
    ["Feet / Footwear", itemName(bird.feet), itemImage(bird.feet), "feet"],
    ["Optional", "Use the recommended pose or draw the bird standing normally.", "", ""]
  ];
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
  return [["Story Idea", storyIdea(bird), "", "storyCue"]];
}

function tryThisDetails(bird) {
  return [["Try This", bird.tryThis, "", ""]];
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
        <h2 id="color-palette-heading"><span>Add Color</span></h2>
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
        const nextEnergy = validateEmotion(randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy));
        const profile = energyProfile(nextEnergy);
        const emotion = emotionProfile(nextEnergy);
        const cue = randomStoryCue(nextEnergy);
        const pose = recommendedPoseForEmotion(nextEnergy);
        const treasure = randomTreasureForEnergy(nextEnergy, currentBird.treasure);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          attitude: randomAttitude(nextEnergy),
          expression: emotion.expression,
          pose,
          poseDescription: randomPoseDescription(pose, currentBird.poseDescription),
          storyCue: cue.text,
          scene: randomSceneForMoment(nextEnergy, pose, currentBird.scene.sceneName),
          setting: randomSettingForPose(pose, currentBird.setting),
          treasure,
          treasureStory: randomTreasureStory(nextEnergy, treasure),
          bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape),
          wingStyle: weightedPick(tables.wingStyles, profile.wingStyle),
          crest: weightedPick(tables.crests, profile.crest),
          tail: weightedPick(tables.tails, profile.tail),
          legLength: weightedPick(tables.legLengths, profile.legLength),
          quirk: weightedPick(tables.quirks, profile.quirk, 0.65),
          colorPalette: randomPaletteForEmotion(nextEnergy, currentBird.colorPalette.name)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "storyCue") {
      setBird((currentBird) => ({
        ...currentBird,
        storyCue: randomStoryCue(currentBird.birdEnergy).text
      }));
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
          scene: randomSceneForMoment(currentBird.birdEnergy, nextPose, currentBird.scene.sceneName),
          setting: randomSettingForPose(nextPose, currentBird.setting)
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

    if (field === "setting") {
      setBird((currentBird) => ({
        ...currentBird,
        setting: randomSettingForPose(currentBird.pose, currentBird.setting)
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

    if (field === "colorPalette") {
      setBird((currentBird) => ({
        ...currentBird,
        colorPalette: randomPaletteForEmotion(currentBird.birdEnergy, currentBird.colorPalette.name)
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
      treasure: tables.treasures
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
          <DetailCard title="Emotion" rows={emotionDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Sketch the Bird" rows={sketchDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Add Legs & Feet" rows={legsDetails(bird)} onShuffle={shuffleField} />
          <ColorPaletteCard palette={bird.colorPalette} onShuffle={shuffleField} />
          {hasValue(bird.pattern) && <DetailCard title="Add Pattern" rows={patternDetails(bird)} onShuffle={shuffleField} />}
          {hasValue(bird.quirk) && <DetailCard title="Optional Accessory" rows={accessoryDetails(bird)} onShuffle={shuffleField} />}
          <DetailCard title="Story Idea" rows={storyDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Try This" rows={tryThisDetails(bird)} onShuffle={shuffleField} />
        </div>

      </section>
    </main>
  );
}
