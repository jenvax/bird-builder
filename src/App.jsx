import React, { useMemo, useState } from "react";
import birdEnergy from "./data/birdEnergy.json";
import simpleBodyShapes from "./data/simpleBodyShapes.json";
import actionPoses from "./data/actionPoses.json";
import wingStyles from "./data/wingStyles.json";
import simpleCrests from "./data/simpleCrests.json";
import simpleTails from "./data/simpleTails.json";
import legLengths from "./data/legLengths.json";
import simpleFeet from "./data/simpleFeet.json";
import palettes from "./data/palettes.json";
import quirks from "./data/quirks.json";
import patterns from "./data/patterns.json";
import patternPlacement from "./data/patternPlacement.json";
import attitudes from "./data/attitudes.json";

const tables = {
  birdEnergy,
  bodyShapes: simpleBodyShapes,
  actionPoses,
  wingStyles,
  crests: simpleCrests,
  tails: simpleTails,
  legLengths,
  feet: simpleFeet,
  palettes,
  quirks,
  patterns,
  patternPlacement,
  attitudes
};

const finalEmotionValues = new Set(birdEnergy);
const finalActionPoseValues = new Set(actionPoses);
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

const optionalActionPoseChoices = ["None", ...actionPoses];

const storyIdeaCards = [
  {
    text: "Sitting quietly and hoping someone notices.",
    compatibleEmotion: ["Sad", "Lonely", "Disappointed"],
    compatibleActionPose: ["Tucked In", "Nest Sit", "Relaxed Stand"],
    mood: "quiet",
    energyLevel: "low"
  },
  {
    text: "Tucked away among leaves with a small worried thought.",
    compatibleEmotion: ["Sad", "Lonely", "Worried", "Uneasy", "Anxious"],
    compatibleActionPose: ["Tucked In", "Nest Sit", "Belly Sit", "One Foot Up"],
    mood: "tender",
    energyLevel: "low"
  },
  {
    text: "Trying to be brave near something harmless but surprising.",
    compatibleEmotion: ["Anxious", "Worried", "Uneasy", "Scared", "Shocked"],
    compatibleActionPose: ["One Foot Up", "Peeking", "Looking Sideways"],
    mood: "nervous",
    energyLevel: "medium"
  },
  {
    text: "Watching a snail cross the ground like it is the most important parade.",
    compatibleEmotion: ["Curious", "Intrigued", "Focused", "Hopeful"],
    compatibleActionPose: ["Peeking", "One Foot Up", "Walking", "Looking Down"],
    mood: "curious",
    energyLevel: "medium"
  },
  {
    text: "Trying to understand a mysterious footprint.",
    compatibleEmotion: ["Curious", "Intrigued", "Focused", "Disbelieving"],
    compatibleActionPose: ["Looking Down", "One Foot Up", "Peeking"],
    mood: "curious",
    energyLevel: "medium"
  },
  {
    text: "Listening to the wind like it is music.",
    compatibleEmotion: ["Thoughtful", "Content", "Hopeful"],
    compatibleActionPose: ["Relaxed Stand", "Looking Up", "Standing"],
    mood: "soft",
    energyLevel: "low"
  },
  {
    text: "Showing off a tiny backyard find like it belongs in a museum.",
    compatibleEmotion: ["Proud", "Cheerful", "Joyful"],
    compatibleActionPose: ["Standing", "Walking", "Wings Spread"],
    mood: "proud",
    energyLevel: "medium"
  },
  {
    text: "Presenting a giant acorn to a skeptical beetle.",
    compatibleEmotion: ["Proud", "Cheerful", "Playful"],
    compatibleActionPose: ["Standing", "Walking", "Wings Spread"],
    mood: "playful",
    energyLevel: "medium"
  },
  {
    text: "Hiding a button and looking much too pleased about it.",
    compatibleEmotion: ["Mischievous", "Cheeky", "Guilty"],
    compatibleActionPose: ["Sneaking", "Peeking", "Looking Sideways"],
    mood: "mischievous",
    energyLevel: "medium"
  },
  {
    text: "Sneaking off with a strip of ribbon.",
    compatibleEmotion: ["Mischievous", "Cheeky", "Guilty", "Playful"],
    compatibleActionPose: ["Sneaking", "Walking", "Peeking"],
    mood: "mischievous",
    energyLevel: "medium"
  },
  {
    text: "Hopping like the garden just told it wonderful news.",
    compatibleEmotion: ["Joyful", "Excited", "Playful"],
    compatibleActionPose: ["Hopping", "Tiny Hop", "Leaping"],
    mood: "joyful",
    energyLevel: "high"
  },
  {
    text: "Freezing because something tiny happened very suddenly.",
    compatibleEmotion: ["Surprised", "Startled", "Shocked"],
    compatibleActionPose: ["Landing", "Leaping", "Wings Spread"],
    mood: "startled",
    energyLevel: "high"
  },
  {
    text: "Silently judging a flower that is being much too cheerful.",
    compatibleEmotion: ["Irritated", "Annoyed", "Frustrated", "Angry"],
    compatibleActionPose: ["Standing", "Looking Sideways", "Over the Shoulder"],
    mood: "grumpy",
    energyLevel: "medium"
  },
  {
    text: "Standing firmly as if the garden owes it an explanation.",
    compatibleEmotion: ["Frustrated", "Angry", "Annoyed"],
    compatibleActionPose: ["Standing", "Running", "Wings Spread"],
    mood: "frustrated",
    energyLevel: "high"
  }
];

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

function validateEmotion(emotion) {
  return finalEmotionValues.has(emotion) ? emotion : "Curious";
}

function validateActionPose(actionPose) {
  return finalActionPoseValues.has(actionPose) ? actionPose : "Standing";
}

const emotionProfiles = {
  Joyful: { archetype: "Zippy", story: "Hopping like the garden just told it wonderful news." },
  Cheerful: { archetype: "Curious", story: "Walking along as if every flower is a friendly neighbor." },
  Excited: { archetype: "Zippy", story: "Bouncing with excitement over something tiny and excellent." },
  Proud: { archetype: "Proud", story: "Showing off like it has just done something very impressive." },
  Content: { archetype: "Sleepy", story: "Resting happily in a quiet garden moment." },
  Curious: { archetype: "Curious", story: "Watching a snail cross the ground like it is the most important parade." },
  Intrigued: { archetype: "Curious", story: "Leaning toward a tiny mystery in the grass." },
  Focused: { archetype: "Curious", story: "Studying one small detail with complete seriousness." },
  Thoughtful: { archetype: "Daydreaming", story: "Pausing as if it just remembered a very poetic leaf." },
  Mischievous: { archetype: "Mischievous", story: "Looking much too pleased about a tiny secret." },
  Playful: { archetype: "Zippy", story: "Hopping around like the whole garden is a game." },
  Cheeky: { archetype: "Mischievous", story: "Pretending it did not cause the tiny mess nearby." },
  Guilty: { archetype: "Shy", story: "Trying to look innocent beside something it definitely moved." },
  Surprised: { archetype: "Startled", story: "Freezing because something small happened very suddenly." },
  Startled: { archetype: "Startled", story: "Frozen in place after hearing a rustle in the flowers." },
  Shocked: { archetype: "Startled", story: "Shocked by a garden discovery that feels enormous." },
  Disbelieving: { archetype: "Confused", story: "Staring at the wrong thing and refusing to understand it." },
  Anxious: { archetype: "Nervous", story: "Trying to decide whether a tiny sound is friendly or alarming." },
  Worried: { archetype: "Nervous", story: "Holding one foot up while considering a very small problem." },
  Uneasy: { archetype: "Shy", story: "Keeping close to the leaves just in case." },
  Scared: { archetype: "Nervous", story: "Trying to be brave near something harmless but surprising." },
  Sad: { archetype: "Shy", story: "Sitting quietly with a very small disappointed feeling." },
  Disappointed: { archetype: "Shy", story: "Looking at the ground like the worm parade was canceled." },
  Lonely: { archetype: "Shy", story: "Waiting quietly for someone kind to notice." },
  Hopeful: { archetype: "Curious", story: "Looking toward something new with a tiny bit of courage." },
  Irritated: { archetype: "Grumpy", story: "Not approving of a flower that is being much too cheerful." },
  Annoyed: { archetype: "Grumpy", story: "Silently judging a beetle for walking in the wrong direction." },
  Frustrated: { archetype: "Grumpy", story: "Trying to solve a tiny problem with very big feelings." },
  Angry: { archetype: "Grumpy", story: "Standing firmly as if the garden owes it an explanation." }
};

const archetypeProfiles = {
  Sleepy: {
    bodyShape: ["Fluffy", "Marshmallow", "Round", "Blob"],
    wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
    crest: ["Ribbon Crest", "Pebble Tuft Crest", "Single Feather Crest"],
    tail: ["Cloud Tail", "Leaf Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Leaf Cape", "Flower Crown", "None"]
  },
  Shy: {
    bodyShape: ["Bean", "Marshmallow", "Round", "Gumdrop", "Blob"],
    wingStyle: ["Cloud Wings", "Leaf Wings"],
    crest: ["Pebble Tuft Crest", "Ribbon Crest", "Single Feather Crest"],
    tail: ["Leaf Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Flower Crown", "Daisy Necklace", "Round Glasses", "None"]
  },
  Proud: {
    bodyShape: ["Pear", "Round", "Tall Skinny"],
    wingStyle: ["Scallop Wings", "Feather Wings"],
    crest: ["Fan Crest", "Triple Tuft Crest", "Sunburst Crest"],
    tail: ["Fan Tail", "Flared Fan Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Gold Crown", "Twig Crown", "Sun Hat", "Flower Crown"]
  },
  Zippy: {
    bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
    wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
    crest: ["Sunburst Crest", "Wild Tuft Crest", "Triple Tuft Crest"],
    tail: ["Fan Tail", "Flared Fan Tail", "Ribbon Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Backpack", "Butterfly Bow Tie", "Tiny Umbrella", "None"]
  },
  Nervous: {
    bodyShape: ["Bean", "Blob", "Marshmallow"],
    wingStyle: ["Leaf Wings", "Tiny Wings", "Feather Wings"],
    crest: ["Wild Tuft Crest", "Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Curly Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Tiny Umbrella", "Round Glasses", "None"]
  },
  Confused: {
    bodyShape: ["Blob", "Bean", "Tall Skinny"],
    wingStyle: ["Cloud Wings", "Tiny Wings", "Feather Wings"],
    crest: ["Single Feather Crest", "Crooked Tuft Crest", "Pebble Tuft Crest"],
    tail: ["Curly Tail", "Cloud Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Magnifying Glass", "Tiny Backpack", "None"]
  },
  Startled: {
    bodyShape: ["Bean", "Tall Skinny", "Gumdrop"],
    wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
    crest: ["Sunburst Crest", "Wild Tuft Crest", "Triple Tuft Crest"],
    tail: ["Fan Tail", "Flared Fan Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Tiny Umbrella", "Round Glasses", "None"]
  },
  Grumpy: {
    bodyShape: ["Bean", "Blob", "Pear"],
    wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
    crest: ["Crooked Tuft Crest", "Triple Tuft Crest", "Sunburst Crest", "Pebble Tuft Crest"],
    tail: ["Fan Tail", "Curly Tail"],
    legLength: ["Short", "Medium", "Tall"],
    quirk: ["Round Glasses", "Tiny Umbrella", "None"]
  },
  Daydreaming: {
    bodyShape: ["Fluffy", "Marshmallow", "Blob"],
    wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
    crest: ["Ribbon Crest", "Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Cloud Tail", "Leaf Tail"],
    legLength: ["Short", "Medium"],
    quirk: ["Flower Crown", "Leaf Crown", "Daisy Necklace", "Ribbon Bow", "Leaf Cape"]
  },
  Mischievous: {
    bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
    wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
    crest: ["Crooked Tuft Crest", "Triple Tuft Crest", "Single Feather Crest"],
    tail: ["Curly Tail", "Ribbon Tail"],
    legLength: ["Short", "Medium", "Tall"],
    quirk: ["Butterfly Bow Tie", "Ladybug Button", "Tiny Bell", "None"]
  },
  Curious: {
    bodyShape: ["Bean", "Round", "Gumdrop"],
    wingStyle: ["Leaf Wings", "Feather Wings", "Tiny Wings"],
    crest: ["Single Feather Crest", "Pebble Tuft Crest"],
    tail: ["Leaf Tail", "Fan Tail", "Cloud Tail"],
    legLength: ["Medium", "Tall"],
    quirk: ["Explorer Hat", "Magnifying Glass", "Bug Jar", "Tiny Binoculars", "Tiny Backpack"]
  }
};

function emotionProfile(emotion) {
  const safeEmotion = validateEmotion(emotion);
  return emotionProfiles[safeEmotion] || emotionProfiles.Curious;
}

function energyProfile(energy) {
  return archetypeProfiles[emotionProfile(energy).archetype] || archetypeProfiles.Curious;
}

function randomAttitude(energy) {
  return randomItem(tables.attitudes[energy] || tables.attitudes.Curious);
}

function randomActionPose(currentActionPose = "") {
  if (Math.random() < 0.28) {
    return "None";
  }

  return randomDifferentItem(optionalActionPoseChoices, currentActionPose);
}

function randomStoryCue(energy, actionPose = "", currentStory = "") {
  const safeEnergy = validateEmotion(energy);
  const safeActionPose = finalActionPoseValues.has(actionPose) ? actionPose : "";
  const different = (story) => story.text !== currentStory;
  const emotionMatches = storyIdeaCards.filter((story) => story.compatibleEmotion.includes(safeEnergy));
  const exactMatches = emotionMatches.filter((story) => story.compatibleActionPose.includes(safeActionPose));
  const actionPoseMatches = storyIdeaCards.filter((story) => story.compatibleActionPose.includes(safeActionPose));
  const candidates = [exactMatches, emotionMatches, actionPoseMatches, storyIdeaCards]
    .map((stories) => stories.filter(different))
    .find((stories) => stories.length > 0);

  return { text: randomItem(candidates || storyIdeaCards).text };
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

function makeBird() {
  const energy = validateEmotion(randomItem(tables.birdEnergy));
  const profile = energyProfile(energy);
  const actionPose = randomActionPose();
  const storyCue = randomStoryCue(energy, actionPose);

  return {
    birdEnergy: energy,
    attitude: randomAttitude(energy),
    actionPose,
    storyCue: storyCue.text,
    bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape),
    wingStyle: weightedPick(tables.wingStyles, profile.wingStyle),
    crest: weightedPick(tables.crests, profile.crest),
    tail: weightedPick(tables.tails, profile.tail),
    legLength: weightedPick(tables.legLengths, profile.legLength),
    feet: randomItem(tables.feet),
    pattern: randomItem(tables.patterns),
    patternPlacement: randomItem(tables.patternPlacement),
    quirk: weightedPick(tables.quirks, profile.quirk, 0.65),
    colorPalette: randomPaletteForEmotion(energy)
  };
}

function paletteWord(palette) {
  return palette.name.split(" ")[0];
}

function birdName(bird) {
  return `${bird.birdEnergy} ${paletteWord(bird.colorPalette)} Bird`;
}

function feetPhrase(feet) {
  return lower(feet);
}

function storySentence(bird) {
  return bird.storyCue || emotionProfile(bird.birdEnergy).story;
}

function storyIdea(bird) {
  return storySentence(bird);
}

function birdPrompt(bird) {
  const patternText = hasValue(bird.pattern)
    ? `${lower(bird.pattern)}${lower(bird.patternPlacement) === "all over" ? " all over" : ` on the ${lower(bird.patternPlacement)}`}`
    : "no pattern";
  const accessoryText = hasValue(bird.quirk) ? lower(bird.quirk) : "no accessory";
  const actionPoseText = hasValue(bird.actionPose) ? bird.actionPose : "None";

  const sections = [
    `Draw a ${lower(bird.birdEnergy)} bird.`,
    `It has a ${lower(bird.bodyShape)} body, ${lower(bird.wingStyle)}, a ${lower(bird.crest)}, and a ${lower(bird.tail)}.`,
    `Give it ${lower(bird.legLength)} legs and ${feetPhrase(bird.feet)}.`,
    `Add ${patternText}.`,
    `Add ${accessoryText}.`,
    `Use the ${bird.colorPalette.name} palette.`,
    `Optional action pose: ${actionPoseText}.`,
    `Optional story idea: ${storyIdea(bird)}.`
  ];

  return sections;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
    itemName(bird.bodyShape),
    hasValue(bird.actionPose) ? bird.actionPose : "",
    bird.colorPalette.name
  ].filter(hasValue);
}

function CardField({ label, value, image, primary = false }) {
  return (
    <div className={primary ? "card-field card-field-primary" : "card-field"}>
      <dt>{label}</dt>
      <dd>
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
      </dd>
    </div>
  );
}

function ShuffleCard({ title, answer, onShuffle, children, className = "" }) {
  return (
    <section className={`shuffle-card ${className}`} aria-labelledby={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>
      <div className="shuffle-card-header">
        <h2 id={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>{title}</h2>
        <button type="button" className="shuffle-button" onClick={onShuffle}>
          Shuffle
        </button>
      </div>
      <dl className="shuffle-card-content">{children}</dl>
      {answer && <p className="card-answer">{answer}</p>}
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

function ColorPaletteCard({ palette, onShuffle }) {
  return (
    <ShuffleCard title="Color Palette" onShuffle={() => onShuffle("colorPalette")} className="color-card">
      <CardField label="Palette" value={palette.name} primary />
      <PaletteSwatches colors={palette.colors} />
      <p className="card-note">{palette.mood}</p>
    </ShuffleCard>
  );
}

export default function App() {
  const [bird, setBird] = useState(() => makeBird());
  const [copyStatus, setCopyStatus] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const prompt = useMemo(() => birdPrompt(bird), [bird]);

  function generateBird() {
    setBird(makeBird());
    setCopyStatus("");
    setShowSummary(false);
  }

  function shuffleBirdBodyCard() {
    setBird((currentBird) => {
      const profile = energyProfile(currentBird.birdEnergy);
      return {
        ...currentBird,
        bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape)
      };
    });
    setCopyStatus("");
  }

  function shuffleEmotionCard() {
    shuffleField("birdEnergy");
  }

  function shuffleWingCard() {
    setBird((currentBird) => ({
      ...currentBird,
      wingStyle: weightedPick(tables.wingStyles, energyProfile(currentBird.birdEnergy).wingStyle)
    }));
    setCopyStatus("");
  }

  function shuffleCrestCard() {
    setBird((currentBird) => ({
      ...currentBird,
      crest: weightedPick(tables.crests, energyProfile(currentBird.birdEnergy).crest)
    }));
    setCopyStatus("");
  }

  function shuffleTailCard() {
    setBird((currentBird) => ({
      ...currentBird,
      tail: weightedPick(tables.tails, energyProfile(currentBird.birdEnergy).tail)
    }));
    setCopyStatus("");
  }

  function shuffleLegsFeetCard() {
    setBird((currentBird) => ({
      ...currentBird,
      legLength: randomDifferentItem(tables.legLengths, currentBird.legLength),
      feet: randomDifferentItem(tables.feet, currentBird.feet)
    }));
    setCopyStatus("");
  }

  function shufflePatternCard() {
    setBird((currentBird) => ({
      ...currentBird,
      pattern: randomDifferentItem(tables.patterns, currentBird.pattern),
      patternPlacement: randomDifferentItem(tables.patternPlacement, currentBird.patternPlacement)
    }));
    setCopyStatus("");
  }

  function shuffleStoryCard() {
    setBird((currentBird) => ({
      ...currentBird,
      storyCue: randomStoryCue(currentBird.birdEnergy, currentBird.actionPose, currentBird.storyCue).text
    }));
    setCopyStatus("");
  }

  function shuffleField(field) {
    if (field === "birdEnergy") {
      setBird((currentBird) => {
        const nextEnergy = validateEmotion(randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy));
        const profile = energyProfile(nextEnergy);
        const cue = randomStoryCue(nextEnergy, currentBird.actionPose, currentBird.storyCue);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          attitude: randomAttitude(nextEnergy),
          storyCue: cue.text,
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
        storyCue: randomStoryCue(currentBird.birdEnergy, currentBird.actionPose, currentBird.storyCue).text
      }));
      setCopyStatus("");
      return;
    }

    if (field === "actionPose") {
      setBird((currentBird) => {
        const nextActionPose = randomActionPose(currentBird.actionPose);
        return {
          ...currentBird,
          actionPose: nextActionPose,
          storyCue: randomStoryCue(currentBird.birdEnergy, nextActionPose, currentBird.storyCue).text
        };
      });
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
      actionPose: optionalActionPoseChoices
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

        <div className="card-grid">
          <ShuffleCard title="Bird Emotion" onShuffle={shuffleEmotionCard}>
            <CardField label="Emotion" value={bird.birdEnergy} primary />
          </ShuffleCard>

          <ShuffleCard title="Bird Body" onShuffle={shuffleBirdBodyCard}>
            <CardField label="Body" value={itemName(bird.bodyShape)} image={itemImage(bird.bodyShape)} primary />
          </ShuffleCard>

          <ShuffleCard title="Wings" onShuffle={shuffleWingCard}>
            <CardField label="Wings" value={itemName(bird.wingStyle)} image={itemImage(bird.wingStyle)} primary />
          </ShuffleCard>

          <ShuffleCard title="Crest" onShuffle={shuffleCrestCard}>
            <CardField label="Crest" value={itemName(bird.crest)} image={itemImage(bird.crest)} primary />
          </ShuffleCard>

          <ShuffleCard title="Tail" onShuffle={shuffleTailCard}>
            <CardField label="Tail" value={itemName(bird.tail)} image={itemImage(bird.tail)} primary />
          </ShuffleCard>

          <ShuffleCard title="Legs & Feet" onShuffle={shuffleLegsFeetCard}>
            <CardField label="Legs" value={bird.legLength} primary />
            <CardField label="Feet / Footwear" value={itemName(bird.feet)} image={itemImage(bird.feet)} />
          </ShuffleCard>

          <ShuffleCard title="Pattern" onShuffle={shufflePatternCard}>
            <CardField label="Pattern" value={itemName(bird.pattern)} primary />
            {hasValue(bird.pattern) && <CardField label="Location" value={itemName(bird.patternPlacement)} />}
          </ShuffleCard>

          <ShuffleCard title="Accessory" onShuffle={() => shuffleField("quirk")}>
            <CardField label="Accessory" value={hasValue(bird.quirk) ? bird.quirk : "No accessory this time."} primary />
          </ShuffleCard>

          <ColorPaletteCard palette={bird.colorPalette} onShuffle={shuffleField} />

          <ShuffleCard title="Optional Action Pose" onShuffle={() => shuffleField("actionPose")}>
            <CardField label="Action Pose" value={hasValue(bird.actionPose) ? bird.actionPose : "No action pose this time."} primary />
          </ShuffleCard>

          <ShuffleCard title="Story Idea" onShuffle={shuffleStoryCard}>
            <CardField label="Story" value={storyIdea(bird)} primary />
          </ShuffleCard>
        </div>

        <div className="summary-actions">
          <button type="button" className="secondary" onClick={() => setShowSummary((value) => !value)}>
            {showSummary ? "Hide Written Summary" : "Generate Written Summary"}
          </button>
          {showSummary && (
            <div className="prompt-column">
              <section className="prompt-card" aria-labelledby="prompt-heading">
                <h2 id="prompt-heading">Written Summary</h2>
                <div className="prompt-text">
                  {prompt.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <div className="copy-action">
                <button type="button" className="secondary" onClick={copyPrompt}>Copy Summary</button>
                <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
              </div>
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
