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

const crestTailSizes = [
  "Tiny crest + tiny tail",
  "Big expressive crest + tiny tail",
  "Tiny crest + big dramatic tail",
  "Wild messy crest + small tail",
  "Tall crest + short tail",
  "Floppy crest + long tail",
  "Big crest + big tail",
  "Small quiet crest + small tail",
  "Extra dramatic crest + simple tail",
  "Simple crest + fancy tail"
];

const paletteGuides = {
  "Spring Tulips": {
    placement: ["Pink body", "Peach wings", "Yellow crest", "Green tail", "Peach feet", "White wearable accessory"],
    accent: "Fresh green tiny details",
    description: "Fresh garden colors inspired by spring tulips and sunny flower beds."
  },
  "Fern & Foxglove": {
    placement: ["Deep green body", "Soft pink wings", "Pale green crest", "Peach tail", "Deep green feet", "Soft pink wearable accessory"],
    accent: "Pale green or peach tiny details",
    description: "Secret-garden greens with soft foxglove pinks and gentle woodland warmth."
  },
  "Wildflower Meadow": {
    placement: ["Lavender body", "Pink and yellow wings", "Yellow crest", "Lavender and pink tail", "Brown feet", "Green wearable accessory"],
    accent: "Cream highlights",
    description: "Bright floral colors inspired by blooming meadow flowers."
  },
  "Buttercup Picnic": {
    placement: ["Yellow body", "Soft pink wings", "Pale yellow crest", "Green tail", "Yellow feet", "Cream wearable accessory"],
    accent: "Cream highlights",
    description: "Cheerful buttercup colors with a sweet picnic-blanket feeling."
  },
  "April Showers": {
    placement: ["Soft blue body", "Pale blue wings", "Fresh green crest", "Blue tail", "Deep blue feet", "Pale green wearable accessory"],
    accent: "Pale blue highlights",
    description: "Gentle rainy-day colors with fresh leaves and clean puddle sparkle."
  },
  "Puddle Jump": {
    placement: ["Bright blue body", "Pale blue wings", "Yellow crest", "Green tail", "Bright blue feet", "Yellow wearable accessory"],
    accent: "Yellow tiny details",
    description: "Splashy rainy-day colors made for a playful bird with tiny boots."
  },
  "Rainbow Daydream": {
    placement: ["Pink body", "Peach wings", "Yellow crest", "Blue tail", "Green feet", "Soft blue wearable accessory"],
    accent: "Soft blue tiny details",
    description: "Soft rainbow colors with a dreamy, imaginative sketchbook feeling."
  },
  "Sunbeam Garden": {
    placement: ["Golden body", "Orange wings", "Yellow crest", "Green tail", "Orange feet", "Cream wearable accessory"],
    accent: "Cream highlights",
    description: "Warm garden colors glowing with afternoon sun."
  },
  "Honeybee Hollow": {
    placement: ["Yellow body", "Cream wings", "Dark green crest", "Leafy green tail", "Dark green feet", "Cream wearable accessory"],
    accent: "Dark green tiny details",
    description: "Golden garden colors with leafy greens and a cozy honeybee feeling."
  },
  "Strawberry Patch": {
    placement: ["Red body", "Pink wings", "Green crest", "Cream tail", "Red feet", "Pink wearable accessory"],
    accent: "Cream highlights",
    description: "Juicy berry colors with cheerful garden sweetness."
  },
  "Mushroom Hollow": {
    placement: ["Rosy body", "Peach wings", "Muted purple crest", "Cream tail", "Rosy feet", "Cream wearable accessory"],
    accent: "Cream tiny details",
    description: "Cozy woodland colors with a soft storybook mood."
  },
  "Ladybug Lane": {
    placement: ["Red body", "Deep green wings", "Cream crest", "Red and orange tail", "Deep green feet", "Green wearable accessory"],
    accent: "Cream highlights",
    description: "Playful garden colors inspired by ladybugs and summer flowers."
  },
  "Garden Gate": {
    placement: ["Leafy green body", "Light green wings", "Golden crest", "Warm brown tail", "Warm brown feet", "Cream wearable accessory"],
    accent: "Golden brown tiny details",
    description: "Rustic garden colors with leafy greens and warm gate-side browns."
  },
  "Feather Explosion": {
    placement: ["Hot pink body", "Teal and yellow wings", "Yellow and green crest", "Purple and teal tail", "Purple feet", "White wearable accessory"],
    accent: "White highlights",
    description: "Bright, loud, and made for a bird with big feelings."
  },
  "Tropical Chaos": {
    placement: ["Green body", "Blue wings", "Hot pink crest", "Orange tail", "Green feet", "Yellow wearable accessory"],
    accent: "Yellow tiny details",
    description: "Juicy tropical colors with wild, high-energy contrast."
  },
  "Parrot Party": {
    placement: ["Green body", "Blue wings", "Red crest", "Yellow and orange tail", "Orange feet", "Yellow wearable accessory"],
    accent: "Orange tiny details",
    description: "Bold party colors with a bright, squawky personality."
  },
  "Circus Bird": {
    placement: ["Red body", "Blue wings", "Yellow crest", "Blue and red tail", "Black feet", "White wearable accessory"],
    accent: "White highlights",
    description: "High-contrast circus colors with theatrical, playful energy."
  },
  "Firecracker": {
    placement: ["Red body", "Orange wings", "Yellow crest", "Electric blue tail", "Purple feet", "Yellow wearable accessory"],
    accent: "Electric blue tiny details",
    description: "Explosive bright colors for a zippy bird that refuses to be quiet."
  },
  "Crayon Box": {
    placement: ["Red body", "Blue wings", "Yellow crest", "Purple tail", "Green feet", "Yellow wearable accessory"],
    accent: "Purple or blue tiny details",
    description: "Fresh crayon colors with playful classroom energy."
  },
  "Bluebird Morning": {
    placement: ["Sky blue body", "Soft yellow wings", "White crest", "Blue and yellow tail", "Brown feet", "White wearable accessory"],
    accent: "Soft gray details",
    description: "Fresh morning colors with a cheerful countryside feel."
  }
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

  return {
    birdEnergy: energy,
    sizeProportion: randomItem(sizeProportions),
    crestTailSize: randomItem(crestTailSizes),
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
  return (paletteGuides[palette.name] && paletteGuides[palette.name].placement) || [
    "Main color on the body",
    "Light color on the wings",
    "Bright color on the crest",
    "Accent color on the tail",
    "Dark color on the feet",
    "Light color on the wearable accessory"
  ];
}

function palettePlacementSentence(palette) {
  return palettePlacement(palette).map((placement) => lower(placement)).join(", ");
}

function paletteAccent(palette) {
  return (paletteGuides[palette.name] && paletteGuides[palette.name].accent) || "Tiny accent details";
}

function paletteDescription(palette) {
  return (paletteGuides[palette.name] && paletteGuides[palette.name].description) || palette.mood;
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

function birdPrompt(bird) {
  const details = [
    legFeetPhrase(bird),
    patternPhrase(bird),
    hasValue(bird.quirk) ? lower(bird.quirk) : "",
    lower(bird.crestTailSize)
  ].filter(Boolean);

  const sections = [
    `Draw a ${lower(bird.birdEnergy)} ${lower(bird.sizeProportion)}${details.length > 0 ? ` with ${naturalList(details)}` : ""}.`,
    `Use the ${bird.colorPalette.name} palette with ${palettePlacementSentence(bird.colorPalette)}, and ${lower(paletteAccent(bird.colorPalette))}.`
  ];

  return sections;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
    bird.sizeProportion,
    bird.crestTailSize,
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
      <CardField label="Accent" value={paletteAccent(palette)} />
      <CardField label="Description" value={paletteDescription(palette)} />
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

  function shuffleCrestTailSizeCard() {
    setBird((currentBird) => ({
      ...currentBird,
      crestTailSize: randomDifferentItem(crestTailSizes, currentBird.crestTailSize)
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

  function shuffleField(field) {
    if (field === "birdEnergy") {
      setBird((currentBird) => {
        const nextEnergy = validateEmotion(randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy));
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          colorPalette: randomPaletteForEmotion(nextEnergy, currentBird.colorPalette.name)
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
      crestTailSize: crestTailSizes,
      legLength: tables.legLengths,
      feet: tables.feet,
      pattern: tables.patterns,
      patternPlacement: tables.patternPlacement,
      quirk: tables.quirks
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

          <ShuffleCard title="Crest & Tail Size" onShuffle={shuffleCrestTailSizeCard}>
            <CardField label="Crest & Tail Size" value={bird.crestTailSize} primary />
          </ShuffleCard>

          <ShuffleCard title="Legs & Feet" onShuffle={shuffleLegsFeetCard}>
            <CardField label="Legs" value={bird.legLength} primary />
            <CardField label="Feet / Footwear" value={itemName(bird.feet)} image={itemImage(bird.feet)} />
          </ShuffleCard>

          <ShuffleCard title="Pattern" onShuffle={shufflePatternCard}>
            <CardField label="Pattern" value={itemName(bird.pattern)} primary />
            {hasValue(bird.pattern) && <CardField label="Location" value={itemName(bird.patternPlacement)} />}
          </ShuffleCard>

          <ShuffleCard title="Wearable Accessory" onShuffle={() => shuffleField("quirk")}>
            <CardField label="Wearable Accessory" value={hasValue(bird.quirk) ? bird.quirk : "No accessory this time."} primary />
          </ShuffleCard>

          <ColorPaletteCard palette={bird.colorPalette} onShuffle={shuffleField} />
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
