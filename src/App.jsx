import React, { useMemo, useState } from "react";
import constructionTypes from "./data/constructionTypes.json";
import moods from "./data/moods.json";
import heads from "./data/heads.json";
import bodies from "./data/bodies.json";
import headSizes from "./data/headSizes.json";
import bodySizes from "./data/bodySizes.json";
import crests from "./data/crests.json";
import tails from "./data/tails.json";
import wingShapes from "./data/wingShapes.json";
import eyeStyles from "./data/eyeStyles.json";
import eyePlacement from "./data/eyePlacement.json";
import eyeSpacing from "./data/eyeSpacing.json";
import beaks from "./data/beaks.json";
import legs from "./data/legs.json";
import feet from "./data/feet.json";
import palettes from "./data/palettes.json";
import patterns from "./data/patterns.json";
import patternPlacement from "./data/patternPlacement.json";
import eyewear from "./data/eyewear.json";
import footwear from "./data/footwear.json";
import socks from "./data/socks.json";
import accessories from "./data/accessories.json";
import critterFriends from "./data/critterFriends.json";

const tables = {
  constructionTypes,
  moods,
  heads,
  bodies,
  headSizes,
  bodySizes,
  crests,
  tails,
  wingShapes,
  eyeStyles,
  eyePlacement,
  eyeSpacing,
  beaks,
  legs,
  feet,
  palettes,
  patterns,
  patternPlacement,
  eyewear,
  footwear,
  socks,
  accessories,
  critterFriends
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

function randomConstructionType() {
  return Math.random() < 0.7 ? "Two-Part Bird" : "One-Part Bird";
}

function makeBird() {
  const constructionType = randomConstructionType();

  return {
    constructionType,
    mood: randomItem(tables.moods),
    headShape: randomItem(tables.heads),
    headSize: randomItem(tables.headSizes),
    bodyShape: randomItem(tables.bodies),
    bodySize: randomItem(tables.bodySizes),
    singleShape: randomItem(tables.bodies),
    singleShapeSize: randomItem(tables.bodySizes),
    crest: randomItem(tables.crests),
    tail: randomItem(tables.tails),
    wingShape: randomItem(tables.wingShapes),
    eyeStyle: randomItem(tables.eyeStyles),
    eyePlacement: randomItem(tables.eyePlacement),
    eyeSpacing: randomItem(tables.eyeSpacing),
    beak: randomItem(tables.beaks),
    legType: randomItem(tables.legs),
    footType: randomItem(tables.feet),
    colorPalette: randomItem(tables.palettes),
    pattern: randomItem(tables.patterns),
    patternPlacement: randomItem(tables.patternPlacement),
    eyewear: randomItem(tables.eyewear),
    footwear: randomItem(tables.footwear),
    socks: randomItem(tables.socks),
    accessory: randomItem(tables.accessories),
    critterFriend: randomItem(tables.critterFriends)
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

function sentenceList(items) {
  if (items.length === 0) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function articleFor(value) {
  return /^[aeiou]/i.test(itemName(value)) ? "an" : "a";
}

function patternPhrase(pattern, placement) {
  if (!hasValue(pattern)) {
    return "";
  }

  if (placement === "All Over") {
    return `${lower(pattern)} all over`;
  }

  if (placement === "Random Patches") {
    return `${lower(pattern)} in random patches`;
  }

  return `${lower(pattern)} on the ${lower(placement)}`;
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
  return `${bird.mood} ${paletteWord(bird.colorPalette)} Bird`;
}

function birdPrompt(bird) {
  const eyePhrase = `${lower(bird.eyeStyle)} eyes placed ${lower(bird.eyePlacement)} and ${lower(bird.eyeSpacing)}`;
  const wingText = wingPromptPhrase(bird);
  const wingSegment = wingText ? `${wingText}, ` : "";
  const extras = [
    patternPhrase(bird.pattern, bird.patternPlacement),
    hasValue(bird.eyewear) ? lower(bird.eyewear) : "",
    hasValue(bird.socks) ? lower(bird.socks) : "",
    hasValue(bird.footwear) ? lower(bird.footwear) : "",
    hasValue(bird.accessory) ? lower(bird.accessory) : ""
  ].filter(Boolean);
  const paragraphs = [];

  if (bird.constructionType === "One-Part Bird") {
    paragraphs.push(`Draw a ${lower(bird.mood)} one-part bird with a ${lower(bird.singleShapeSize)} ${lower(bird.singleShape)} shape, ${wingSegment}${eyePhrase}, a ${withSuffix(bird.beak, "beak")}, a ${lower(bird.crest)}, ${lower(bird.tail)}, ${lower(bird.legType)} legs, and ${lower(bird.footType)}.`);
  } else {
    paragraphs.push(`Draw a ${lower(bird.mood)} bird with a ${lower(bird.headSize)} ${withSuffix(bird.headShape, "head")}, a ${lower(bird.bodySize)} ${withSuffix(bird.bodyShape, "body")}, ${wingSegment}a ${lower(bird.crest)}, ${lower(bird.tail)}, ${eyePhrase}, a ${withSuffix(bird.beak, "beak")}, ${lower(bird.legType)} legs, and ${lower(bird.footType)}.`);
  }

  if (extras.length > 0) {
    paragraphs.push(`Add ${sentenceList(extras)}.`);
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
      ["Shape", `${bird.singleShapeSize} ${itemName(bird.singleShape)}`, itemImage(bird.singleShape)],
      ["Wings", wingValue(bird), itemImage(bird.wingShape)],
      ["Crest", itemName(bird.crest), itemImage(bird.crest)],
      ["Tail", itemName(bird.tail), itemImage(bird.tail)],
      ["Legs", itemName(bird.legType), itemImage(bird.legType)],
      ["Feet", itemName(bird.footType), itemImage(bird.footType)]
    ];
  }

  return [
    ["Construction Type", bird.constructionType],
    ["Head", `${bird.headSize} ${itemName(bird.headShape)}`, itemImage(bird.headShape)],
    ["Body", `${bird.bodySize} ${itemName(bird.bodyShape)}`, itemImage(bird.bodyShape)],
    ["Wings", wingValue(bird), itemImage(bird.wingShape)],
    ["Crest", itemName(bird.crest), itemImage(bird.crest)],
    ["Tail", itemName(bird.tail), itemImage(bird.tail)],
    ["Legs", itemName(bird.legType), itemImage(bird.legType)],
    ["Feet", itemName(bird.footType), itemImage(bird.footType)]
  ];
}

function faceDetails(bird) {
  return [
    ["Eye Style", itemName(bird.eyeStyle), itemImage(bird.eyeStyle)],
    ["Eye Placement (vertical)", bird.eyePlacement],
    ["Eye Spacing (distance)", bird.eyeSpacing],
    ["Beak", itemName(bird.beak), itemImage(bird.beak)]
  ];
}

function personalityDetails(bird) {
  return [
    ["Mood", bird.mood],
    ["Accessory", bird.accessory],
    ["Critter Friend", bird.critterFriend]
  ];
}

function decorationDetails(bird) {
  return [
    ["Pattern", bird.pattern],
    ["Pattern Placement", hasValue(bird.pattern) ? bird.patternPlacement : "None"],
    ["Eyewear", bird.eyewear],
    ["Socks", bird.socks],
    ["Footwear", bird.footwear],
    ["Palette", bird.colorPalette.name]
  ];
}

function recipeChips(bird) {
  if (bird.constructionType === "One-Part Bird") {
    return [
      bird.mood,
      bird.constructionType,
      `${bird.singleShapeSize} ${itemName(bird.singleShape)} Shape`,
      itemName(bird.crest),
      itemName(bird.tail),
      wingValue(bird),
      bird.colorPalette.name
    ];
  }

  return [
    bird.mood,
    bird.constructionType,
    `${bird.headSize} ${itemName(bird.headShape)} Head`,
    `${bird.bodySize} ${itemName(bird.bodyShape)} Body`,
    itemName(bird.crest),
    itemName(bird.tail),
    wingValue(bird),
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

  return (
    <section className="sketch-preview-card" aria-labelledby="sketch-preview-heading">
      <div className="section-heading">
        <h2 id="sketch-preview-heading">Rough Sketch Preview</h2>
        <p>A simple construction guide, not final art.</p>
      </div>
      <div className={`sketch-stage ${isOnePart ? "one-part" : "two-part"}`}>
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

function DetailCard({ title, rows }) {
  return (
    <section className="detail-card" aria-labelledby={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>
      <h2 id={`${title.replaceAll(" ", "-").toLowerCase()}-heading`}>
        <span>{title}</span>
      </h2>
      <dl>
        {rows.map(([label, value, image]) => (
          <div className="detail-row" key={label}>
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
        ))}
      </dl>
    </section>
  );
}

function ColorPaletteCard({ palette }) {
  return (
    <section className="palette-card" aria-labelledby="color-palette-heading">
      <div className="section-heading">
        <h2 id="color-palette-heading">Color Palette</h2>
        <p>{palette.mood}</p>
      </div>
      <h3>{palette.name}</h3>
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

        <ColorPaletteCard palette={bird.colorPalette} />

        <div className="detail-grid">
          <DetailCard title="Shape & Body" rows={constructionDetails(bird)} />
          <DetailCard title="Face Details" rows={faceDetails(bird)} />
          <DetailCard title="Personality" rows={personalityDetails(bird)} />
          <DetailCard title="Extras & Decoration" rows={decorationDetails(bird)} />
        </div>

      </section>
    </main>
  );
}
