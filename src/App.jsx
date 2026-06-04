import React, { useMemo, useState } from "react";
import constructionTypes from "./data/constructionTypes.json";
import moods from "./data/moods.json";
import shapeFamilies from "./data/shapeFamilies.json";
import headSizes from "./data/headSizes.json";
import bodySizes from "./data/bodySizes.json";
import crests from "./data/crests.json";
import tails from "./data/tails.json";
import eyeStyles from "./data/eyeStyles.json";
import eyePlacement from "./data/eyePlacement.json";
import eyeSpacing from "./data/eyeSpacing.json";
import beaks from "./data/beaks.json";
import legs from "./data/legs.json";
import feet from "./data/feet.json";
import palettes from "./data/palettes.json";

const tables = {
  constructionTypes,
  moods,
  shapeFamilies,
  headSizes,
  bodySizes,
  crests,
  tails,
  eyeStyles,
  eyePlacement,
  eyeSpacing,
  beaks,
  legs,
  feet,
  palettes
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomConstructionType() {
  return Math.random() < 0.7 ? "Two-Part Bird" : "One-Part Bird";
}

function makeBird() {
  const constructionType = randomConstructionType();
  const headShape = randomItem(tables.shapeFamilies);
  const headSize = randomItem(tables.headSizes);
  const bodyShape = randomItem(tables.shapeFamilies);
  const bodySize = randomItem(tables.bodySizes);

  return {
    constructionType,
    mood: randomItem(tables.moods),
    headShape,
    headSize,
    bodyShape,
    bodySize,
    singleShape: randomItem(tables.shapeFamilies),
    singleShapeSize: randomItem(tables.bodySizes),
    crest: randomItem(tables.crests),
    tail: randomItem(tables.tails),
    eyeStyle: randomItem(tables.eyeStyles),
    eyePlacement: randomItem(tables.eyePlacement),
    eyeSpacing: randomItem(tables.eyeSpacing),
    beak: randomItem(tables.beaks),
    legType: randomItem(tables.legs),
    footType: randomItem(tables.feet),
    colorPalette: randomItem(tables.palettes)
  };
}

function lower(value) {
  return value.toLowerCase();
}

function token(value) {
  return lower(value).replaceAll(" ", "-");
}

function withSuffix(value, suffix) {
  const normalized = lower(value);
  return normalized.endsWith(suffix) ? normalized : `${normalized} ${suffix}`;
}

function paletteWord(palette) {
  return palette.split(" ")[0];
}

function birdName(bird) {
  return `${bird.mood} ${paletteWord(bird.colorPalette)} Bird`;
}

function birdPrompt(bird) {
  const eyePhrase = `${lower(bird.eyeStyle)} eyes placed ${lower(bird.eyePlacement).replace(" set", "")} and ${lower(bird.eyeSpacing)}`;

  if (bird.constructionType === "One-Part Bird") {
    return `Draw a ${lower(bird.mood)} one-part bird with a ${lower(bird.singleShapeSize)} ${lower(bird.singleShape)} shape, ${eyePhrase}, a ${withSuffix(bird.beak, "beak")}, a ${withSuffix(bird.crest, "crest")}, ${lower(bird.tail)}, ${lower(bird.legType)} legs, and ${lower(bird.footType)}. Use the ${bird.colorPalette} palette.`;
  }

  return `Draw a ${lower(bird.mood)} bird with a ${lower(bird.headSize)} ${withSuffix(bird.headShape, "head")}, a ${lower(bird.bodySize)} ${withSuffix(bird.bodyShape, "body")}, a ${withSuffix(bird.crest, "crest")}, ${lower(bird.tail)}, ${eyePhrase}, a ${withSuffix(bird.beak, "beak")}, ${lower(bird.legType)} legs, and ${lower(bird.footType)}. Use the ${bird.colorPalette} palette.`;
}

function birdFormula(bird) {
  const sharedRows = [
    ["Crest", bird.crest],
    ["Tail", bird.tail],
    ["Eyes", `${bird.eyeStyle} / ${bird.eyePlacement} / ${bird.eyeSpacing}`],
    ["Beak", bird.beak],
    ["Legs", bird.legType],
    ["Feet", bird.footType],
    ["Palette", bird.colorPalette]
  ];

  if (bird.constructionType === "One-Part Bird") {
    return [
      ["Shape", `${bird.singleShapeSize} ${bird.singleShape}`],
      ...sharedRows
    ];
  }

  return [
    ["Head", `${bird.headSize} ${bird.headShape}`],
    ["Body", `${bird.bodySize} ${bird.bodyShape}`],
    ...sharedRows
  ];
}

function VisualBird({ bird }) {
  const paletteClass = `palette-${palettes.indexOf(bird.colorPalette) % palettes.length}`;
  const isTall = bird.legType.includes("Tall");
  const isOnePart = bird.constructionType === "One-Part Bird";
  const isHugeHead = ["Huge", "Grand"].includes(bird.headSize);
  const isTinyBody = ["Tiny", "Small"].includes(bird.bodySize);
  const isLargeSingleShape = ["Huge", "Grand", "Large"].includes(bird.singleShapeSize);

  return (
    <div className={`visual-bird ${paletteClass} ${isOnePart ? "one-part" : "two-part"}`} aria-hidden="true">
      <div className={`crest ${bird.crest.includes("Sunburst") ? "sunny" : ""}`} />
      {isOnePart ? (
        <div className={`single-shape ${isLargeSingleShape ? "single-shape-large" : ""}`}>
          <span className={`eye left ${token(bird.eyePlacement)} ${token(bird.eyeSpacing)}`} />
          <span className={`eye right ${token(bird.eyePlacement)} ${token(bird.eyeSpacing)}`} />
          <span className="beak" />
        </div>
      ) : (
        <div className={`head ${isHugeHead ? "head-large" : ""}`}>
          <span className={`eye left ${token(bird.eyePlacement)} ${token(bird.eyeSpacing)}`} />
          <span className={`eye right ${token(bird.eyePlacement)} ${token(bird.eyeSpacing)}`} />
          <span className="beak" />
        </div>
      )}
      {!isOnePart && <div className={`body ${isTinyBody ? "body-small" : ""}`} />}
      <div className="tail" />
      <div className={`legs ${isTall ? "legs-tall" : ""}`}>
        <span />
        <span />
      </div>
      <div className="feet">
        <span />
        <span />
      </div>
    </div>
  );
}

function FormulaRows({ formula }) {
  return formula.map(([label, value]) => (
    <div className="formula-row" key={label}>
      <dt>{label}:</dt>
      <dd>{value}</dd>
    </div>
  ));
}

export default function App() {
  const [bird, setBird] = useState(() => makeBird());
  const [copyStatus, setCopyStatus] = useState("");
  const prompt = useMemo(() => birdPrompt(bird), [bird]);
  const formula = useMemo(() => birdFormula(bird), [bird]);

  function generateBird() {
    setBird(makeBird());
    setCopyStatus("");
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyStatus("Prompt copied.");
    } catch {
      setCopyStatus("Copy is blocked here. Select the prompt text to copy it.");
    }
  }

  return (
    <main className="page">
      <section className="sketchbook" aria-labelledby="bird-title">
        <div className="eyebrow">Bird Builder MVP</div>
        <div className="hero">
          <VisualBird bird={bird} />
          <div>
            <p className="kicker">Whimsical drawing prompt generator</p>
            <h1 id="bird-title">{birdName(bird)}</h1>
          </div>
        </div>

        <div className="actions">
          <button type="button" onClick={generateBird}>Generate Bird</button>
          <button type="button" className="secondary" onClick={copyPrompt}>Copy Prompt</button>
        </div>

        <section className="paper-panel" aria-labelledby="formula-heading">
          <h2 id="formula-heading">Bird Formula</h2>
          <dl className="formula">
            <FormulaRows formula={formula} />
          </dl>
        </section>

        <section className="paper-panel prompt-panel" aria-labelledby="prompt-heading">
          <h2 id="prompt-heading">Prompt</h2>
          <p>{prompt}</p>
          <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>
        </section>
      </section>
    </main>
  );
}
