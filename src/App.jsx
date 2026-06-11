import React, { useMemo, useState } from "react";
import birdEnergy from "./data/birdEnergy.json";
import legLengths from "./data/legLengths.json";
import simpleFeet from "./data/simpleFeet.json";
import palettes from "./data/palettes.json";
import quirks from "./data/quirks.json";
import patterns from "./data/patterns.json";
import patternPlacement from "./data/patternPlacement.json";

const tables = {
  birdEnergy,
  legLengths,
  feet: simpleFeet,
  palettes,
  quirks,
  patterns,
  patternPlacement
};

const finalEmotionValues = new Set(birdEnergy);
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

const sizeProportions = [
  "Tiny bird",
  "Small bird",
  "Round chubby bird",
  "Tall bird",
  "Long-legged bird",
  "Big dramatic bird",
  "Tiny body with giant crest",
  "Tiny bird with huge feet",
  "Big expressive crest",
  "Small quiet bird",
  "Wide squat bird",
  "Tall skinny bird"
];

const emotionPoseProfiles = {
  Joyful: ["lifted wings", "bouncing pose", "open stance"],
  Cheerful: ["easy walking pose", "open stance", "bright little bounce"],
  Excited: ["bouncing pose", "lifted wings", "tiny hop"],
  Proud: ["chest puff", "standing tall", "showing something off"],
  Content: ["relaxed stand", "soft tucked posture", "settled low"],
  Curious: ["leaning forward", "looking down", "one foot lifted"],
  Intrigued: ["leaning forward", "head tilted", "one foot lifted"],
  Focused: ["looking down", "one foot lifted", "still and concentrated"],
  Thoughtful: ["looking up", "soft tucked posture", "quiet tilted head"],
  Mischievous: ["tilted head", "sideways glance", "one foot lifted"],
  Playful: ["bouncing pose", "open stance", "tiny hop"],
  Cheeky: ["sideways glance", "tilted head", "one foot lifted"],
  Guilty: ["tucked posture", "sideways glance", "small hunched pose"],
  Surprised: ["frozen looking-down pose", "wide stance", "leaning backward"],
  Startled: ["frozen in place", "wide stance", "leaning backward"],
  Shocked: ["frozen in place", "lifted wings", "wide stance"],
  Disbelieving: ["looking sideways", "tilted head", "stiff little stance"],
  Anxious: ["tucked posture", "one foot lifted", "looking down"],
  Worried: ["looking down", "one foot lifted", "tucked posture"],
  Uneasy: ["sideways glance", "small hunched pose", "one foot lifted"],
  Scared: ["leaning backward", "wide stance", "tucked posture"],
  Sad: ["looking down", "tucked posture", "sitting low"],
  Disappointed: ["looking down", "sitting low", "small hunched pose"],
  Lonely: ["sitting low", "tucked posture", "looking down"],
  Hopeful: ["looking up", "leaning forward", "open stance"],
  Irritated: ["stiff little stance", "sideways glare", "feet planted"],
  Annoyed: ["sideways glare", "feet planted", "stiff little stance"],
  Frustrated: ["feet planted", "wide stance", "stiff little stance"],
  Angry: ["feet planted", "wide stance", "leaning forward"]
};

const palettePlacements = {
  "Ladybug Lane": ["Red body", "Black spots", "Cream belly", "Green accessory"],
  "Feather Explosion": ["Bright body colors", "Bold spots", "White accent"],
  "Spring Tulips": ["Pink body", "Yellow belly", "Fresh green accessory"],
  "Fern & Foxglove": ["Deep green body", "Soft pink belly", "Pale green accent"],
  "Wildflower Meadow": ["Green body", "Yellow belly", "Red or blue pattern"],
  "Buttercup Picnic": ["Yellow body", "Pink cheeks", "Green accessory"],
  "April Showers": ["Blue body", "Pale belly", "Soft green accent"],
  "Puddle Jump": ["Bright blue body", "Yellow belly", "Green feet or accessory"],
  "Rainbow Daydream": ["Pastel body", "Rainbow pattern", "Blue accent"],
  "Sunbeam Garden": ["Golden body", "Orange belly", "Leafy green accessory"],
  "Honeybee Hollow": ["Yellow body", "Dark green markings", "Cream belly"],
  "Strawberry Patch": ["Red body", "Pink belly", "Green accessory"],
  "Mushroom Hollow": ["Rosy body", "Cream belly", "Muted purple accent"],
  "Garden Gate": ["Leafy green body", "Warm brown feet", "Cream belly"],
  "Tropical Chaos": ["Green body", "Hot pink pattern", "Blue or orange accent"],
  "Parrot Party": ["Green body", "Blue wings or sides", "Red and yellow accents"],
  "Circus Bird": ["Red body", "Blue accessory", "Yellow belly", "Black accent"],
  "Firecracker": ["Red body", "Yellow belly", "Electric blue accent"],
  "Crayon Box": ["Bright mixed body", "Yellow belly", "Blue or purple accent"]
};

const storyIdeaCards = [
  {
    text: "Sitting quietly and hoping someone notices.",
    compatibleEmotion: ["Sad", "Lonely", "Disappointed"],
    compatibleEmotionPose: ["tucked posture", "sitting low", "soft tucked posture"],
    mood: "quiet",
    energyLevel: "low"
  },
  {
    text: "Tucked away among leaves with a small worried thought.",
    compatibleEmotion: ["Sad", "Lonely", "Worried", "Uneasy", "Anxious"],
    compatibleEmotionPose: ["tucked posture", "sitting low", "one foot lifted"],
    mood: "tender",
    energyLevel: "low"
  },
  {
    text: "Trying to be brave near something harmless but surprising.",
    compatibleEmotion: ["Anxious", "Worried", "Uneasy", "Scared", "Shocked"],
    compatibleEmotionPose: ["one foot lifted", "sideways glance", "looking down"],
    mood: "nervous",
    energyLevel: "medium"
  },
  {
    text: "Watching a snail cross the ground like it is the most important parade.",
    compatibleEmotion: ["Curious", "Intrigued", "Focused", "Hopeful"],
    compatibleEmotionPose: ["leaning forward", "looking down", "one foot lifted"],
    mood: "curious",
    energyLevel: "medium"
  },
  {
    text: "Trying to understand a mysterious footprint.",
    compatibleEmotion: ["Curious", "Intrigued", "Focused", "Disbelieving"],
    compatibleEmotionPose: ["looking down", "one foot lifted", "leaning forward"],
    mood: "curious",
    energyLevel: "medium"
  },
  {
    text: "Listening to the wind like it is music.",
    compatibleEmotion: ["Thoughtful", "Content", "Hopeful"],
    compatibleEmotionPose: ["relaxed stand", "looking up", "quiet tilted head"],
    mood: "soft",
    energyLevel: "low"
  },
  {
    text: "Showing off a tiny backyard find like it belongs in a museum.",
    compatibleEmotion: ["Proud", "Cheerful", "Joyful"],
    compatibleEmotionPose: ["standing tall", "chest puff", "showing something off"],
    mood: "proud",
    energyLevel: "medium"
  },
  {
    text: "Presenting a giant acorn to a skeptical beetle.",
    compatibleEmotion: ["Proud", "Cheerful", "Playful"],
    compatibleEmotionPose: ["standing tall", "showing something off", "open stance"],
    mood: "playful",
    energyLevel: "medium"
  },
  {
    text: "Hiding a button and looking much too pleased about it.",
    compatibleEmotion: ["Mischievous", "Cheeky", "Guilty"],
    compatibleEmotionPose: ["tilted head", "sideways glance", "one foot lifted"],
    mood: "mischievous",
    energyLevel: "medium"
  },
  {
    text: "Sneaking off with a strip of ribbon.",
    compatibleEmotion: ["Mischievous", "Cheeky", "Guilty", "Playful"],
    compatibleEmotionPose: ["tilted head", "sideways glance", "one foot lifted"],
    mood: "mischievous",
    energyLevel: "medium"
  },
  {
    text: "Hopping like the garden just told it wonderful news.",
    compatibleEmotion: ["Joyful", "Excited", "Playful"],
    compatibleEmotionPose: ["bouncing pose", "tiny hop", "open stance"],
    mood: "joyful",
    energyLevel: "high"
  },
  {
    text: "Freezing because something tiny happened very suddenly.",
    compatibleEmotion: ["Surprised", "Startled", "Shocked"],
    compatibleEmotionPose: ["frozen in place", "wide stance", "leaning backward"],
    mood: "startled",
    energyLevel: "high"
  },
  {
    text: "Silently judging a flower that is being much too cheerful.",
    compatibleEmotion: ["Irritated", "Annoyed", "Frustrated", "Angry"],
    compatibleEmotionPose: ["sideways glare", "feet planted", "stiff little stance"],
    mood: "grumpy",
    energyLevel: "medium"
  },
  {
    text: "Standing firmly as if the garden owes it an explanation.",
    compatibleEmotion: ["Frustrated", "Angry", "Annoyed"],
    compatibleEmotionPose: ["feet planted", "wide stance", "stiff little stance"],
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

const emotionProfiles = {
  Joyful: { story: "Hopping like the garden just told it wonderful news." },
  Cheerful: { story: "Walking along as if every flower is a friendly neighbor." },
  Excited: { story: "Bouncing with excitement over something tiny and excellent." },
  Proud: { story: "Showing off like it has just done something very impressive." },
  Content: { story: "Resting happily in a quiet garden moment." },
  Curious: { story: "Watching a snail cross the ground like it is the most important parade." },
  Intrigued: { story: "Leaning toward a tiny mystery in the grass." },
  Focused: { story: "Studying one small detail with complete seriousness." },
  Thoughtful: { story: "Pausing as if it just remembered a very poetic leaf." },
  Mischievous: { story: "Looking much too pleased about a tiny secret." },
  Playful: { story: "Hopping around like the whole garden is a game." },
  Cheeky: { story: "Pretending it did not cause the tiny mess nearby." },
  Guilty: { story: "Trying to look innocent beside something it definitely moved." },
  Surprised: { story: "Freezing because something small happened very suddenly." },
  Startled: { story: "Frozen in place after hearing a rustle in the flowers." },
  Shocked: { story: "Shocked by a garden discovery that feels enormous." },
  Disbelieving: { story: "Staring at the wrong thing and refusing to understand it." },
  Anxious: { story: "Trying to decide whether a tiny sound is friendly or alarming." },
  Worried: { story: "Holding one foot up while considering a very small problem." },
  Uneasy: { story: "Keeping close to the leaves just in case." },
  Scared: { story: "Trying to be brave near something harmless but surprising." },
  Sad: { story: "Sitting quietly with a very small disappointed feeling." },
  Disappointed: { story: "Looking at the ground like the worm parade was canceled." },
  Lonely: { story: "Waiting quietly for someone kind to notice." },
  Hopeful: { story: "Looking toward something new with a tiny bit of courage." },
  Irritated: { story: "Not approving of a flower that is being much too cheerful." },
  Annoyed: { story: "Silently judging a beetle for walking in the wrong direction." },
  Frustrated: { story: "Trying to solve a tiny problem with very big feelings." },
  Angry: { story: "Standing firmly as if the garden owes it an explanation." }
};

function emotionProfile(emotion) {
  const safeEmotion = validateEmotion(emotion);
  return emotionProfiles[safeEmotion] || emotionProfiles.Curious;
}

function randomEmotionPose(emotion, currentPose = "") {
  const options = emotionPoseProfiles[validateEmotion(emotion)] || emotionPoseProfiles.Curious;
  return randomDifferentItem(options, currentPose);
}

function randomStoryCue(energy, emotionPose = "", currentStory = "") {
  const safeEnergy = validateEmotion(energy);
  const different = (story) => story.text !== currentStory;
  const emotionMatches = storyIdeaCards.filter((story) => story.compatibleEmotion.includes(safeEnergy));
  const poseMatches = emotionMatches.filter((story) =>
    story.compatibleEmotionPose.includes(emotionPose)
  );
  const candidates = [poseMatches, emotionMatches, storyIdeaCards]
    .map((stories) => stories.filter(different))
    .find((stories) => stories.length > 0);

  return { text: randomItem(candidates || storyIdeaCards).text };
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
  const emotionPose = randomEmotionPose(energy);
  const storyCue = randomStoryCue(energy, emotionPose);

  return {
    birdEnergy: energy,
    sizeProportion: randomItem(sizeProportions),
    emotionPose,
    storyCue: storyCue.text,
    legLength: randomItem(tables.legLengths),
    feet: randomItem(tables.feet),
    pattern: randomItem(tables.patterns),
    patternPlacement: randomItem(tables.patternPlacement),
    quirk: randomItem(tables.quirks),
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

function legFeetPhrase(bird) {
  return `${lower(bird.legLength)} legs and ${feetPhrase(bird.feet)}`;
}

function patternPhrase(bird) {
  if (!hasValue(bird.pattern)) {
    return "";
  }

  const location = lower(bird.patternPlacement);
  return location === "all over" ? `${lower(bird.pattern)} all over` : `${lower(bird.pattern)} on the ${location}`;
}

function palettePlacement(palette) {
  return palettePlacements[palette.name] || [
    "Main color on the body",
    "Light color on the belly",
    "Bright color for pattern or accessory"
  ];
}

function palettePlacementSentence(palette) {
  return palettePlacement(palette).map((placement) => lower(placement)).join(", ");
}

function naturalList(items) {
  if (items.length <= 1) {
    return items[0] || "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function storySentence(bird) {
  return bird.storyCue || emotionProfile(bird.birdEnergy).story;
}

function storyIdea(bird) {
  return storySentence(bird);
}

function birdPrompt(bird) {
  const details = [
    legFeetPhrase(bird),
    patternPhrase(bird),
    hasValue(bird.quirk) ? lower(bird.quirk) : ""
  ].filter(Boolean);

  const sections = [
    `Draw a ${lower(bird.birdEnergy)} ${lower(bird.sizeProportion)}${details.length > 0 ? ` with ${naturalList(details)}` : ""}.`,
    `Give it a ${lower(bird.emotionPose)} pose, as if ${lower(storyIdea(bird))}.`,
    `Use the ${bird.colorPalette.name} palette with ${palettePlacementSentence(bird.colorPalette)}.`
  ];

  return sections;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
    bird.sizeProportion,
    bird.emotionPose,
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

function CardList({ label, items }) {
  return (
    <div className="card-field">
      <dt>{label}</dt>
      <dd>
        <ul className="card-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
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
      <CardList label="Recommended Placement" items={palettePlacement(palette)} />
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

  function shuffleSizeProportionCard() {
    setBird((currentBird) => ({
      ...currentBird,
      sizeProportion: randomDifferentItem(sizeProportions, currentBird.sizeProportion)
    }));
    setCopyStatus("");
  }

  function shuffleEmotionCard() {
    shuffleField("birdEnergy");
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
      storyCue: randomStoryCue(currentBird.birdEnergy, currentBird.emotionPose, currentBird.storyCue).text
    }));
    setCopyStatus("");
  }

  function shuffleField(field) {
    if (field === "birdEnergy") {
      setBird((currentBird) => {
        const nextEnergy = validateEmotion(randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy));
        const nextEmotionPose = randomEmotionPose(nextEnergy, currentBird.emotionPose);
        const cue = randomStoryCue(nextEnergy, nextEmotionPose, currentBird.storyCue);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          emotionPose: nextEmotionPose,
          storyCue: cue.text,
          colorPalette: randomPaletteForEmotion(nextEnergy, currentBird.colorPalette.name)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "storyCue") {
      setBird((currentBird) => ({
        ...currentBird,
        storyCue: randomStoryCue(currentBird.birdEnergy, currentBird.emotionPose, currentBird.storyCue).text
      }));
      setCopyStatus("");
      return;
    }

    if (field === "emotionPose") {
      setBird((currentBird) => {
        const nextEmotionPose = randomEmotionPose(currentBird.birdEnergy, currentBird.emotionPose);
        return {
          ...currentBird,
          emotionPose: nextEmotionPose,
          storyCue: randomStoryCue(currentBird.birdEnergy, nextEmotionPose, currentBird.storyCue).text
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
      sizeProportion: sizeProportions,
      legLength: tables.legLengths,
      feet: tables.feet,
      pattern: tables.patterns,
      patternPlacement: tables.patternPlacement,
      quirk: tables.quirks,
      emotionPose: emotionPoseProfiles[validateEmotion(bird.birdEnergy)] || emotionPoseProfiles.Curious
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

          <ShuffleCard title="Size & Proportions" onShuffle={shuffleSizeProportionCard}>
            <CardField label="Size & Proportions" value={bird.sizeProportion} primary />
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

          <ShuffleCard title="Emotion Pose" onShuffle={() => shuffleField("emotionPose")}>
            <CardField label="Emotion Pose" value={bird.emotionPose} primary />
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
