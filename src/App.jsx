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
import storyCues from "./data/storyCues.json";
import attitudes from "./data/attitudes.json";

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
  storyCues,
  attitudes
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
      expression: ["Sleepy Blink", "Blank Stare"],
      pose: ["Belly Sit", "Slouched", "Tucked and Cozy"],
      bodyShape: ["Fluffy", "Marshmallow", "Blob"],
      wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
      crest: ["Floppy Ribbon Crest", "Pebble Tuft Crest", "Single Feather Crest"],
      tail: ["Cloud Tail", "Petal Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["None", "Tiny Scarf"]
    },
    Shy: {
      expression: ["Worried Side Glance", "Nervous Smile", "Curious Peek"],
      pose: ["Pigeon-Toed Stand", "One Foot Up", "Tucked and Cozy"],
      bodyShape: ["Bean", "Marshmallow", "Gumdrop", "Blob"],
      wingStyle: ["Cloud Wings", "Leaf Wings", "Tiny Wings"],
      crest: ["Pebble Tuft Crest", "Floppy Ribbon Crest", "Single Feather Crest"],
      tail: ["Petal Tail", "Cloud Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["None", "Tiny Scarf", "Round Glasses"]
    },
    Bossy: {
      expression: ["Skeptical Squint", "Grumpy Glare", "Proud Smile"],
      pose: ["Proud Chest Puff", "Splayed Stance", "Mid-Step"],
      bodyShape: ["Round", "Pear", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Scallop Wings"],
      crest: ["Fan Crest", "Scallop Crest", "Wild Sunburst Crest"],
      tail: ["Fan Tail", "Flared Fan Tail", "Ribbon Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["Explorer Hat", "Bow Tie", "Round Glasses"]
    },
    Zippy: {
      expression: ["Wide-Eyed Gasp", "Delighted Smile", "Curious Peek"],
      pose: ["Tiny Hop", "Wing Flap", "Mid-Step", "Leaning Forward"],
      bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
      crest: ["Wild Sunburst Crest", "Triple Tuft Crest", "Single Feather Crest"],
      tail: ["Fan Tail", "Flared Fan Tail", "Ribbon Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["None", "Explorer Hat", "Heart Sunglasses"]
    },
    Nervous: {
      expression: ["Worried Side Glance", "Wide-Eyed Gasp", "Nervous Smile"],
      pose: ["Frozen Mid-Flinch", "Pigeon-Toed Stand", "One Foot Up"],
      bodyShape: ["Bean", "Blob", "Marshmallow"],
      wingStyle: ["Leaf Wings", "Tiny Wings", "Feather Wings"],
      crest: ["Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legLength: ["Tiny", "Short"],
      quirk: ["None", "Round Glasses", "Tiny Scarf"]
    },
    Confused: {
      expression: ["Confused Stare", "Blank Stare", "Worried Side Glance"],
      pose: ["Looking Over Shoulder", "One Foot Up", "Splayed Stance"],
      bodyShape: ["Blob", "Bean", "Tall Skinny"],
      wingStyle: ["Cloud Wings", "Tiny Wings", "Feather Wings"],
      crest: ["Single Feather Crest", "Triple Tuft Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legLength: ["Short", "Medium"],
      quirk: ["None", "Round Glasses", "Explorer Hat"]
    },
    Startled: {
      expression: ["Wide-Eyed Gasp", "Confused Stare"],
      pose: ["Frozen Mid-Flinch", "Tiny Hop", "Splayed Stance"],
      bodyShape: ["Bean", "Tall Skinny", "Gumdrop"],
      wingStyle: ["Feather Wings", "Tiny Wings", "Scallop Wings"],
      crest: ["Wild Sunburst Crest", "Triple Tuft Crest"],
      tail: ["Flared Fan Tail", "Fan Tail", "Ribbon Tail"],
      legLength: ["Medium", "Tall"],
      quirk: ["None", "Explorer Hat", "Tiny Scarf"]
    },
    Proud: {
      expression: ["Proud Smile", "Delighted Smile", "Skeptical Squint"],
      pose: ["Proud Chest Puff", "Perched", "Splayed Stance"],
      bodyShape: ["Pear", "Round", "Tall Skinny"],
      wingStyle: ["Scallop Wings", "Feather Wings"],
      crest: ["Fan Crest", "Scallop Crest", "Wild Sunburst Crest"],
      tail: ["Fan Tail", "Flared Fan Tail", "Petal Tail"],
      legLength: ["Tall", "Very Tall"],
      quirk: ["Bow Tie", "Flower Crown", "Heart Sunglasses"]
    },
    Grumpy: {
      expression: ["Grumpy Glare", "Skeptical Squint", "Tiny Frown"],
      pose: ["Splayed Stance", "Slouched", "Perched"],
      bodyShape: ["Bean", "Blob", "Pear"],
      wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
      crest: ["Triple Tuft Crest", "Wild Sunburst Crest", "Scallop Crest"],
      tail: ["Fan Tail", "Curly Tail"],
      legLength: ["Short", "Medium", "Tall"],
      quirk: ["None", "Tiny Scarf", "Round Glasses"]
    },
    Daydreaming: {
      expression: ["Sleepy Blink", "Blank Stare", "Curious Peek"],
      pose: ["Tucked and Cozy", "Belly Sit", "Leaning Forward"],
      bodyShape: ["Fluffy", "Marshmallow", "Blob"],
      wingStyle: ["Cloud Wings", "Fluffy Wings", "Leaf Wings"],
      crest: ["Floppy Ribbon Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Cloud Tail", "Petal Tail"],
      legLength: ["Tiny", "Short", "Medium"],
      quirk: ["None", "Flower Crown", "Tiny Scarf"]
    },
    Mischievous: {
      expression: ["Worried Side Glance", "Delighted Smile", "Tiny Frown"],
      pose: ["Tiptoe Sneak", "Looking Over Shoulder", "Mid-Step"],
      bodyShape: ["Bean", "Gumdrop", "Tall Skinny"],
      wingStyle: ["Feather Wings", "Scallop Wings", "Tiny Wings"],
      crest: ["Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Ribbon Tail"],
      legLength: ["Short", "Medium", "Tall"],
      quirk: ["Little Cape", "Heart Sunglasses", "Bow Tie"]
    },
    Curious: {
      expression: ["Curious Peek", "Wide-Eyed Gasp", "Worried Side Glance"],
      pose: ["Leaning Forward", "One Foot Up", "Mid-Step"],
      bodyShape: ["Bean", "Round", "Gumdrop"],
      wingStyle: ["Leaf Wings", "Feather Wings", "Tiny Wings"],
      crest: ["Single Feather Crest", "Triple Tuft Crest", "Fan Crest"],
      tail: ["Petal Tail", "Fan Tail", "Cloud Tail"],
      legLength: ["Medium", "Tall"],
      quirk: ["None", "Explorer Hat", "Round Glasses"]
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

function weightedPick(items, names, chance = 0.78) {
  return names && Math.random() < chance ? randomNamedItem(items, names) : randomItem(items);
}

function makeBird() {
  const energy = randomItem(tables.birdEnergy);
  const profile = energyProfile(energy);
  const storyCue = randomStoryCue(energy);

  return {
    birdEnergy: energy,
    attitude: randomAttitude(energy),
    expression: weightedPick(tables.expressions, profile.expression),
    pose: weightedPick(tables.poses, profile.pose),
    storyCue: storyCue.text,
    bodyShape: weightedPick(tables.bodyShapes, profile.bodyShape),
    wingStyle: weightedPick(tables.wingStyles, profile.wingStyle),
    crest: weightedPick(tables.crests, profile.crest),
    tail: weightedPick(tables.tails, profile.tail),
    legLength: weightedPick(tables.legLengths, profile.legLength),
    feet: randomItem(tables.feet),
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
  return /(glasses|sunglasses|boots)$/.test(value) ? value : `${articleFor(quirk)} ${value}`;
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

function storySentence(bird) {
  return bird.storyCue || `It is ${bird.attitude}.`;
}

function birdPrompt(bird) {
  const paragraphs = [
    `Draw a ${lower(bird.birdEnergy)} bird that looks like it is ${lower(bird.pose)}. ${storySentence(bird)}`,
    `It has a ${lower(bird.bodyShape)} shaped body, ${wingPhrase(bird.wingStyle)}, ${crestPhrase(bird.crest)}, ${tailPhrase(bird.tail)}, and ${lower(bird.legLength)} legs.`,
    `Give it a ${lower(bird.expression)} expression and ${lower(bird.feet)}.`
  ];

  if (hasValue(bird.quirk)) {
    paragraphs.push(`Add ${quirkPhrase(bird.quirk)}.`);
  }

  paragraphs.push(`Use the ${bird.colorPalette.name} palette.`);
  return paragraphs;
}

function recipeChips(bird) {
  return [
    bird.birdEnergy,
    bird.expression,
    bird.pose,
    itemName(bird.bodyShape),
    itemName(bird.crest),
    itemName(bird.tail),
    bird.quirk,
    bird.colorPalette.name
  ];
}

function personalityDetails(bird) {
  return [
    ["Bird Energy", bird.birdEnergy, "", "birdEnergy"],
    ["Expression", bird.expression, "", "expression"],
    ["Pose", bird.pose, "", "pose"]
  ];
}

function storyDetails(bird) {
  return [["Story Cue", bird.storyCue, "", "storyCue"]];
}

function featureDetails(bird) {
  return [
    ["Body Shape", itemName(bird.bodyShape), itemImage(bird.bodyShape), "bodyShape"],
    ["Wing Style", itemName(bird.wingStyle), itemImage(bird.wingStyle), "wingStyle"],
    ["Crest", itemName(bird.crest), itemImage(bird.crest), "crest"],
    ["Tail", itemName(bird.tail), itemImage(bird.tail), "tail"],
    ["Leg Length", bird.legLength, "", "legLength"],
    ["Feet", itemName(bird.feet), itemImage(bird.feet), "feet"]
  ];
}

function stylingDetails(bird) {
  return [
    ["Quirk", bird.quirk, "", "quirk"],
    ["Palette", bird.colorPalette.name, "", "colorPalette"]
  ];
}

function expressionImage(expression) {
  const images = {
    "Wide-Eyed Gasp": "/assets/bird-parts/eyes/round.png",
    "Worried Side Glance": "/assets/bird-parts/eyes/oval.png",
    "Sleepy Blink": "/assets/bird-parts/eyes/tall.png",
    "Skeptical Squint": "/assets/bird-parts/eyes/tall.png",
    "Blank Stare": "/assets/bird-parts/eyes/simple.png",
    "Delighted Smile": "/assets/bird-parts/eyes/round.png",
    "Tiny Frown": "/assets/bird-parts/eyes/simple.png",
    "Proud Smile": "/assets/bird-parts/eyes/gumdrop.png",
    "Nervous Smile": "/assets/bird-parts/eyes/oval.png",
    "Confused Stare": "/assets/bird-parts/eyes/round.png",
    "Grumpy Glare": "/assets/bird-parts/eyes/tall.png",
    "Curious Peek": "/assets/bird-parts/eyes/round.png"
  };

  return images[expression] || "/assets/bird-parts/eyes/simple.png";
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
    if (field === "birdEnergy") {
      setBird((currentBird) => {
        const nextEnergy = randomDifferentItem(tables.birdEnergy, currentBird.birdEnergy);
        const profile = energyProfile(nextEnergy);
        const cue = randomStoryCue(nextEnergy);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          attitude: randomAttitude(nextEnergy),
          expression: weightedPick(tables.expressions, profile.expression),
          pose: weightedPick(tables.poses, profile.pose),
          storyCue: cue.text,
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

    const fieldTables = {
      expression: tables.expressions,
      pose: tables.poses,
      bodyShape: tables.bodyShapes,
      wingStyle: tables.wingStyles,
      crest: tables.crests,
      tail: tables.tails,
      legLength: tables.legLengths,
      feet: tables.feet,
      quirk: tables.quirks,
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
          <DetailCard title="Personality" rows={personalityDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Story" rows={storyDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Bird Features" rows={featureDetails(bird)} onShuffle={shuffleField} />
          <DetailCard title="Styling" rows={stylingDetails(bird)} onShuffle={shuffleField} />
        </div>

      </section>
    </main>
  );
}
