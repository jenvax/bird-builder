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

const palettePlacements = {
  "Ladybug Lane": ["Red body", "Cream belly", "Green accessory", "White accent details"],
  "Feather Explosion": ["Pink body", "Teal wings", "Yellow and green crest", "Purple tail", "White accent details"],
  "Spring Tulips": ["Pink body", "Peach belly", "Yellow crest", "Green accessory"],
  "Fern & Foxglove": ["Deep green body", "Soft pink belly", "Pale green wings", "Peach accent details"],
  "Wildflower Meadow": ["Green body", "Yellow belly", "Red crest", "Blue tail"],
  "Buttercup Picnic": ["Yellow body", "Soft pink belly", "Green tail", "Cream accent details"],
  "April Showers": ["Soft blue body", "Pale belly", "Fresh green crest", "Deep blue feet"],
  "Puddle Jump": ["Bright blue body", "Pale blue belly", "Yellow crest", "Green feet"],
  "Rainbow Daydream": ["Pink body", "Peach belly", "Green wings", "Blue tail"],
  "Sunbeam Garden": ["Golden body", "Orange belly", "Green tail", "Cream accent details"],
  "Honeybee Hollow": ["Yellow body", "Cream belly", "Dark green crest", "Leafy green accessory"],
  "Strawberry Patch": ["Red body", "Pink belly", "Green crest", "Cream accent details"],
  "Mushroom Hollow": ["Rosy body", "Peach belly", "Muted purple crest", "Cream tail"],
  "Garden Gate": ["Leafy green body", "Cream belly", "Warm brown feet", "Golden accessory"],
  "Tropical Chaos": ["Green body", "Hot pink crest", "Blue wings", "Orange tail"],
  "Parrot Party": ["Green body", "Blue wings", "Red crest", "Yellow belly", "Orange feet"],
  "Circus Bird": ["Red body", "Yellow belly", "Blue accessory", "White accent details"],
  "Firecracker": ["Red body", "Yellow belly", "Purple crest", "Electric blue tail"],
  "Crayon Box": ["Red body", "Yellow belly", "Blue wings", "Purple tail"]
};

const paletteAccents = {
  "Ladybug Lane": "Cream or white tiny details",
  "Feather Explosion": "White highlights or tiny details",
  "Spring Tulips": "Fresh green tiny details",
  "Fern & Foxglove": "Pale green or peach tiny details",
  "Wildflower Meadow": "Blue or cream tiny details",
  "Buttercup Picnic": "Cream highlights",
  "April Showers": "Pale blue highlights",
  "Puddle Jump": "Yellow tiny details",
  "Rainbow Daydream": "Soft blue tiny details",
  "Sunbeam Garden": "Cream highlights",
  "Honeybee Hollow": "Dark green tiny details",
  "Strawberry Patch": "Cream highlights",
  "Mushroom Hollow": "Cream tiny details",
  "Garden Gate": "Golden brown tiny details",
  "Tropical Chaos": "Yellow tiny details",
  "Parrot Party": "Orange tiny details",
  "Circus Bird": "White highlights",
  "Firecracker": "Electric blue tiny details",
  "Crayon Box": "Purple or blue tiny details"
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
  return palettePlacements[palette.name] || [
    "Main color on the body",
    "Light color on the belly",
    "Bright color on the crest",
    "Accent color on the tail"
  ];
}

function palettePlacementSentence(palette) {
  return palettePlacement(palette).map((placement) => lower(placement)).join(", ");
}

function paletteAccent(palette) {
  return paletteAccents[palette.name] || "Tiny accent details";
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
