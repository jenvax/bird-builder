import React, { useMemo, useState } from "react";
import constructionTypes from "./data/constructionTypes.json";
import birdEnergy from "./data/birdEnergy.json";
import heads from "./data/heads.json";
import bodies from "./data/bodies.json";
import headSizes from "./data/headSizes.json";
import bodySizes from "./data/bodySizes.json";
import crests from "./data/crests.json";
import tails from "./data/tails.json";
import wingShapes from "./data/wingShapes.json";
import eyeStyles from "./data/eyeStyles.json";
import eyeSizes from "./data/eyeSizes.json";
import eyePlacement from "./data/eyePlacement.json";
import eyeSpacing from "./data/eyeSpacing.json";
import eyeExpressions from "./data/eyeExpressions.json";
import beaks from "./data/beaks.json";
import legs from "./data/legs.json";
import legPoses from "./data/legPoses.json";
import feet from "./data/feet.json";
import palettes from "./data/palettes.json";
import quirks from "./data/quirks.json";
import critterFriends from "./data/critterFriends.json";

const tables = {
  constructionTypes,
  birdEnergy,
  heads,
  bodies,
  headSizes,
  bodySizes,
  crests,
  tails,
  wingShapes,
  eyeStyles,
  eyeSizes,
  eyePlacement,
  eyeSpacing,
  eyeExpressions,
  beaks,
  legs,
  legPoses,
  feet,
  palettes,
  quirks,
  critterFriends
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
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

function findItem(items, name) {
  return items.find((item) => itemName(item) === name);
}

function randomNamedItem(items, names) {
  const matches = names.map((name) => findItem(items, name)).filter(Boolean);
  return randomItem(matches.length > 0 ? matches : items);
}

function randomWeightedNone(items, noneWeight = 0.65) {
  if (Math.random() < noneWeight) {
    return findItem(items, "None") || "None";
  }

  const choices = items.filter((item) => itemName(item) !== "None");
  return randomItem(choices.length > 0 ? choices : items);
}

function itemName(item) {
  return typeof item === "string" ? item : item.name;
}

function itemImage(item) {
  return typeof item === "string" ? "" : item.image || "";
}

function slug(value) {
  return itemName(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomConstructionType() {
  return Math.random() < 0.7 ? "Two-Part Bird" : "One-Part Bird";
}

function energyBiasedBirdParts(energy) {
  const defaults = {
    eyeSize: randomItem(tables.eyeSizes),
    eyeStyle: randomItem(tables.eyeStyles),
    eyePlacement: randomItem(tables.eyePlacement),
    eyeSpacing: randomItem(tables.eyeSpacing),
    eyeExpression: randomItem(tables.eyeExpressions),
    beak: randomItem(tables.beaks),
    legType: randomItem(tables.legs),
    legPose: randomItem(tables.legPoses),
    footType: randomItem(tables.feet),
    bodySize: randomItem(tables.bodySizes),
    singleShapeSize: randomItem(tables.bodySizes),
    crest: randomItem(tables.crests)
  };

  const pick = (items, names, fallback = randomItem(items)) => (Math.random() < 0.72 ? randomNamedItem(items, names) : fallback);

  switch (energy) {
    case "Startled":
      return {
        ...defaults,
        eyeSize: pick(tables.eyeSizes, ["Huge", "Gigantic"]),
        eyeStyle: pick(tables.eyeStyles, ["Round", "Dot"]),
        eyePlacement: pick(tables.eyePlacement, ["High"]),
        eyeSpacing: pick(tables.eyeSpacing, ["Close Together", "Wide Apart"]),
        eyeExpression: pick(tables.eyeExpressions, ["Surprised", "Open"]),
        beak: pick(tables.beaks, ["Tiny Triangle"]),
        legPose: pick(tables.legPoses, ["Splayed", "Tiny Hop"]),
        crest: pick(tables.crests, ["Sunburst Crest", "Triple Tuft Crest", "Double Tuft Crest"])
      };
    case "Nervous":
      return {
        ...defaults,
        eyeSize: pick(tables.eyeSizes, ["Large", "Huge"]),
        eyeSpacing: pick(tables.eyeSpacing, ["Close Together"]),
        eyeExpression: pick(tables.eyeExpressions, ["Worried", "Blank Stare"]),
        legType: pick(tables.legs, ["Short Stubby"]),
        legPose: pick(tables.legPoses, ["Pigeon Toed", "Straight"]),
        footType: pick(tables.feet, ["Tiny Round Feet"])
      };
    case "Proud":
      return {
        ...defaults,
        eyeSize: pick(tables.eyeSizes, ["Tiny", "Small"]),
        eyePlacement: pick(tables.eyePlacement, ["High"]),
        eyeExpression: pick(tables.eyeExpressions, ["Happy", "Open"]),
        legType: pick(tables.legs, ["Tall Skinny", "Very Tall"]),
        legPose: pick(tables.legPoses, ["Straight", "Splayed"]),
        crest: pick(tables.crests, ["Fan Crest", "Sunburst Crest", "Flower Crown"])
      };
    case "Sleepy":
      return {
        ...defaults,
        eyeSize: pick(tables.eyeSizes, ["Tiny", "Small"]),
        eyePlacement: pick(tables.eyePlacement, ["Low"]),
        eyeExpression: pick(tables.eyeExpressions, ["Sleepy", "Blank Stare"]),
        eyeStyle: pick(tables.eyeStyles, ["Oval", "Tall Oval"]),
        legPose: pick(tables.legPoses, ["Belly Sit", "Straight"])
      };
    case "Zippy":
      return {
        ...defaults,
        bodySize: pick(tables.bodySizes, ["Tiny", "Small"]),
        singleShapeSize: pick(tables.bodySizes, ["Tiny", "Small"]),
        eyeSize: pick(tables.eyeSizes, ["Small", "Medium"]),
        beak: pick(tables.beaks, ["Pointy Beak", "Tiny Triangle"]),
        legType: pick(tables.legs, ["Tall Skinny", "Very Tall"]),
        legPose: pick(tables.legPoses, ["Mid Step", "Tiny Hop"]),
        crest: pick(tables.crests, ["Sunburst Crest", "Single Feather Crest", "Triple Tuft Crest"])
      };
    default:
      return defaults;
  }
}

function makeBird() {
  const constructionType = randomConstructionType();
  const energy = randomItem(tables.birdEnergy);
  const energyParts = energyBiasedBirdParts(energy);

  return {
    constructionType,
    birdEnergy: energy,
    headShape: randomItem(tables.heads),
    headSize: randomItem(tables.headSizes),
    bodyShape: randomItem(tables.bodies),
    bodySize: energyParts.bodySize,
    singleShape: randomItem(tables.bodies),
    singleShapeSize: energyParts.singleShapeSize,
    crest: energyParts.crest,
    tail: randomItem(tables.tails),
    wingShape: randomItem(tables.wingShapes),
    eyeSize: energyParts.eyeSize,
    eyeStyle: energyParts.eyeStyle,
    eyePlacement: energyParts.eyePlacement,
    eyeSpacing: energyParts.eyeSpacing,
    eyeExpression: energyParts.eyeExpression,
    beak: energyParts.beak,
    legType: energyParts.legType,
    legPose: energyParts.legPose,
    footType: energyParts.footType,
    colorPalette: randomItem(tables.palettes),
    quirk: randomItem(tables.quirks),
    critterFriend: randomWeightedNone(tables.critterFriends, 0.65)
  };
}

function lower(value) {
  return itemName(value).toLowerCase();
}

function hasValue(value) {
  return itemName(value) !== "None";
}

function withSuffix(value, suffix) {
  const normalized = lower(value);
  return normalized.endsWith(suffix) ? normalized : `${normalized} ${suffix}`;
}

function articleFor(value) {
  return /^[aeiou]/i.test(itemName(value)) ? "an" : "a";
}

function wingValue(bird) {
  if (!hasValue(bird.wingShape)) {
    return "None";
  }

  return itemName(bird.wingShape);
}

function wingPromptPhrase(bird) {
  if (!hasValue(bird.wingShape)) {
    return "";
  }

  return `a ${lower(bird.wingShape)}`;
}

function paletteWord(palette) {
  return palette.name.split(" ")[0];
}

function birdName(bird) {
  return `${bird.birdEnergy} ${paletteWord(bird.colorPalette)} Bird`;
}

function eyePhrase(bird) {
  return `${lower(bird.eyeSize)} ${lower(bird.eyeStyle)} eyes with ${articleFor(bird.eyeExpression)} ${lower(bird.eyeExpression)} expression placed ${lower(bird.eyePlacement)} and ${lower(bird.eyeSpacing)}`;
}

function legPhrase(bird) {
  return `${lower(bird.legType)} legs in a ${lower(bird.legPose)} pose`;
}

function quirkPhrase(quirk) {
  const value = lower(quirk);
  return /(glasses|sunglasses|socks|boots)$/.test(value) ? value : `${articleFor(quirk)} ${value}`;
}

function birdPrompt(bird) {
  const wingText = wingPromptPhrase(bird);
  const wingSegment = wingText ? `${wingText}, ` : "";
  const paragraphs = [];

  if (bird.constructionType === "One-Part Bird") {
    paragraphs.push(`Draw a ${lower(bird.birdEnergy)} one-part bird with a ${lower(bird.singleShapeSize)} ${lower(bird.singleShape)} shape, ${wingSegment}${eyePhrase(bird)}, a ${withSuffix(bird.beak, "beak")}, a ${lower(bird.crest)}, ${lower(bird.tail)}, ${legPhrase(bird)}, and ${lower(bird.footType)}.`);
  } else {
    paragraphs.push(`Draw a ${lower(bird.birdEnergy)} bird with a ${lower(bird.headSize)} ${withSuffix(bird.headShape, "head")}, a ${lower(bird.bodySize)} ${withSuffix(bird.bodyShape, "body")}, ${wingSegment}a ${lower(bird.crest)}, ${lower(bird.tail)}, ${eyePhrase(bird)}, a ${withSuffix(bird.beak, "beak")}, ${legPhrase(bird)}, and ${lower(bird.footType)}.`);
  }

  if (hasValue(bird.quirk)) {
    paragraphs.push(`Add ${quirkPhrase(bird.quirk)}.`);
  }

  if (hasValue(bird.critterFriend)) {
    paragraphs.push(`Include ${articleFor(bird.critterFriend)} ${lower(bird.critterFriend)} friend nearby.`);
  }

  paragraphs.push(`Use the ${bird.colorPalette.name} palette.`);

  return paragraphs;
}

function constructionDetails(bird) {
  if (bird.constructionType === "One-Part Bird") {
    return [
      ["Construction Type", bird.constructionType],
      ["Shape Size", bird.singleShapeSize, "", "singleShapeSize"],
      ["Shape", itemName(bird.singleShape), itemImage(bird.singleShape), "singleShape"],
      ["Wings", wingValue(bird), itemImage(bird.wingShape), "wingShape"],
      ["Crest", itemName(bird.crest), itemImage(bird.crest), "crest"],
      ["Tail", itemName(bird.tail), itemImage(bird.tail), "tail"],
      ["Legs", itemName(bird.legType), itemImage(bird.legType), "legType"],
      ["Leg Pose", bird.legPose, "", "legPose"],
      ["Feet", itemName(bird.footType), itemImage(bird.footType), "footType"]
    ];
  }

  return [
    ["Construction Type", bird.constructionType],
    ["Head Size", bird.headSize, "", "headSize"],
    ["Head Shape", itemName(bird.headShape), itemImage(bird.headShape), "headShape"],
    ["Body Size", bird.bodySize, "", "bodySize"],
    ["Body Shape", itemName(bird.bodyShape), itemImage(bird.bodyShape), "bodyShape"],
    ["Wings", wingValue(bird), itemImage(bird.wingShape), "wingShape"],
    ["Crest", itemName(bird.crest), itemImage(bird.crest), "crest"],
    ["Tail", itemName(bird.tail), itemImage(bird.tail), "tail"],
    ["Legs", itemName(bird.legType), itemImage(bird.legType), "legType"],
    ["Leg Pose", bird.legPose, "", "legPose"],
    ["Feet", itemName(bird.footType), itemImage(bird.footType), "footType"]
  ];
}

function faceDetails(bird) {
  return [
    ["Eye Size", bird.eyeSize, "", "eyeSize"],
    ["Eye Style", itemName(bird.eyeStyle), itemImage(bird.eyeStyle), "eyeStyle"],
    ["Eye Placement (vertical)", bird.eyePlacement, "", "eyePlacement"],
    ["Eye Spacing (distance)", bird.eyeSpacing, "", "eyeSpacing"],
    ["Eye Expression", bird.eyeExpression, "", "eyeExpression"],
    ["Beak", itemName(bird.beak), itemImage(bird.beak), "beak"]
  ];
}

function personalityDetails(bird) {
  return [
    ["Bird Energy", bird.birdEnergy, "", "birdEnergy"],
    ["Quirk", bird.quirk, "", "quirk"],
    ["Critter Friend", bird.critterFriend, "", "critterFriend"]
  ];
}

function recipeChips(bird) {
  if (bird.constructionType === "One-Part Bird") {
    return [
      bird.birdEnergy,
      bird.constructionType,
      `${bird.singleShapeSize} ${itemName(bird.singleShape)} Shape`,
      `${bird.eyeSize} ${itemName(bird.eyeStyle)} Eyes`,
      itemName(bird.crest),
      itemName(bird.tail),
      bird.legPose,
      bird.colorPalette.name
    ];
  }

  return [
    bird.birdEnergy,
    bird.constructionType,
    `${bird.headSize} ${itemName(bird.headShape)} Head + ${bird.bodySize} ${itemName(bird.bodyShape)} Body`,
    `${bird.eyeSize} ${itemName(bird.eyeStyle)} Eyes`,
    itemName(bird.crest),
    itemName(bird.tail),
    bird.legPose,
    bird.colorPalette.name
  ];
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
  const isOnePart = bird.constructionType === "One-Part Bird";
  const bodySource = isOnePart ? itemImage(bird.singleShape) : itemImage(bird.bodyShape);
  const stageClasses = [
    "sketch-stage",
    isOnePart ? "one-part" : "two-part",
    `eye-size-${slug(bird.eyeSize)}`,
    `eye-placement-${slug(bird.eyePlacement)}`,
    `leg-pose-${slug(bird.legPose)}`
  ].join(" ");

  return (
    <section className="sketch-preview-card" aria-labelledby="sketch-preview-heading">
      <div className="section-heading">
        <h2 id="sketch-preview-heading">Rough Sketch Preview</h2>
        <p>A simple construction guide, not final art.</p>
      </div>
      <div className={stageClasses}>
        {!isOnePart && (
          <SketchLayer src={itemImage(bird.headShape)} className="sketch-head" />
        )}
        <SketchLayer src={bodySource} className="sketch-body" />
        <SketchLayer src={itemImage(bird.crest)} className="sketch-crest" />
        <SketchLayer src={itemImage(bird.tail)} className="sketch-tail" />
        <SketchLayer src={itemImage(bird.wingShape)} className="sketch-wing" />
        <SketchLayer src={itemImage(bird.eyeStyle)} className="sketch-eyes" />
        <SketchLayer src={itemImage(bird.beak)} className="sketch-beak" />
        <SketchLayer src={itemImage(bird.legType)} className="sketch-legs" />
        <SketchLayer src={itemImage(bird.footType)} className="sketch-feet" />
      </div>
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
        <h2 id="color-palette-heading">Color Palette</h2>
        <p>{palette.mood}</p>
      </div>
      <div className="palette-heading-row">
        <h3>{palette.name}</h3>
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
    const fieldTables = {
      birdEnergy: tables.birdEnergy,
      headShape: tables.heads,
      headSize: tables.headSizes,
      bodyShape: tables.bodies,
      bodySize: tables.bodySizes,
      singleShape: tables.bodies,
      singleShapeSize: tables.bodySizes,
      crest: tables.crests,
      tail: tables.tails,
      wingShape: tables.wingShapes,
      eyeSize: tables.eyeSizes,
      eyeStyle: tables.eyeStyles,
      eyePlacement: tables.eyePlacement,
      eyeSpacing: tables.eyeSpacing,
      eyeExpression: tables.eyeExpressions,
      beak: tables.beaks,
      legType: tables.legs,
      legPose: tables.legPoses,
      footType: tables.feet,
      quirk: tables.quirks,
      critterFriend: tables.critterFriends,
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

        <div className="feature-grid">
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

          <SketchPreview bird={bird} />
        </div>

        <ColorPaletteCard palette={bird.colorPalette} onShuffle={shuffleField} />

        <div className="detail-grid">
          <DetailCard title="Shape & Body" rows={constructionDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Face Details" rows={faceDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Personality & Story" rows={personalityDetails(bird)} onShuffle={shuffleField} />
        </div>

      </section>
    </main>
  );
}
