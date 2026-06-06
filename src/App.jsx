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
import storyCues from "./data/storyCues.json";
import attitudes from "./data/attitudes.json";

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
  critterFriends,
  storyCues,
  attitudes
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
  const bias = {
    Sleepy: {
      shapes: ["Marshmallow", "Cloud", "Pebble", "Soft Heart"],
      eyeSize: ["Tiny", "Small"],
      eyeStyle: ["Oval", "Tall Oval"],
      eyePlacement: ["Low"],
      eyeSpacing: ["Medium Spacing", "Close Together"],
      eyeExpression: ["Sleepy", "Blank Stare"],
      crest: ["Pebble Tuft Crest", "Ribbon Crest", "Single Feather Crest"],
      tail: ["Cloud Tail", "Petal Tail", "Leaf Tail"],
      legType: ["Short Stubby"],
      legPose: ["Belly Sit", "Straight"],
      beak: ["Tiny Triangle", "Round Beak"]
    },
    Shy: {
      shapes: ["Pebble", "Marshmallow", "Gumdrop", "Soft Heart"],
      eyeSize: ["Medium", "Large"],
      eyePlacement: ["Low", "Middle"],
      eyeSpacing: ["Close Together"],
      eyeExpression: ["Worried", "Open"],
      crest: ["Pebble Tuft Crest", "Single Feather Crest", "Ribbon Crest"],
      tail: ["Petal Tail", "Cloud Tail"],
      legType: ["Short Stubby"],
      legPose: ["Pigeon-Toed", "One Foot Up"],
      beak: ["Tiny Triangle", "Stubby Beak"]
    },
    Bossy: {
      shapes: ["Bell", "Tulip", "Circle", "Acorn"],
      eyeSize: ["Small", "Medium"],
      eyePlacement: ["High", "Middle"],
      eyeExpression: ["Open", "Side Glance"],
      crest: ["Fan Crest", "Sunburst Crest", "Scallop Crest"],
      tail: ["Fan Tail", "Ribbon Tail"],
      legType: ["Tall Skinny", "Very Tall"],
      legPose: ["Straight", "Splayed"],
      beak: ["Pointy Beak", "Stubby Beak"]
    },
    Zippy: {
      shapes: ["Teardrop", "Gumdrop", "Bell", "Circle"],
      bodySize: ["Tiny", "Small"],
      singleShapeSize: ["Tiny", "Small"],
      eyeSize: ["Small", "Medium"],
      eyePlacement: ["High"],
      eyeSpacing: ["Wide Apart", "Close Together"],
      eyeExpression: ["Open", "Happy"],
      crest: ["Sunburst Crest", "Triple Tuft Crest", "Single Feather Crest"],
      tail: ["Fan Tail", "Ribbon Tail", "Petal Tail"],
      legType: ["Tall Skinny", "Very Tall"],
      legPose: ["Tiny Hop", "Mid Step"],
      beak: ["Pointy Beak", "Tiny Triangle"]
    },
    Nervous: {
      shapes: ["Bean", "Pebble", "Teardrop", "Marshmallow"],
      eyeSize: ["Huge", "Gigantic"],
      eyeSpacing: ["Close Together"],
      eyeExpression: ["Worried", "Open"],
      crest: ["Triple Tuft Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legType: ["Short Stubby"],
      legPose: ["Pigeon-Toed", "One Foot Up", "Splayed"],
      footType: ["Tiny Round Feet"],
      beak: ["Tiny Triangle", "Stubby Beak"]
    },
    Confused: {
      shapes: ["Bean", "Half Circle", "Pebble", "Mushroom Cap"],
      eyeSize: ["Huge", "Gigantic"],
      eyePlacement: ["Middle", "Low"],
      eyeExpression: ["Side Glance", "Blank Stare", "Worried"],
      crest: ["Single Feather Crest", "Triple Tuft Crest"],
      tail: ["Curly Tail", "Cloud Tail"],
      legPose: ["Splayed", "One Foot Up"],
      beak: ["Stubby Beak", "Round Beak"]
    },
    Startled: {
      eyeSize: ["Huge", "Gigantic"],
      eyeStyle: ["Round", "Dot"],
      eyePlacement: ["High"],
      eyeSpacing: ["Close Together", "Wide Apart"],
      eyeExpression: ["Surprised", "Open"],
      crest: ["Sunburst Crest", "Triple Tuft Crest", "Double Tuft Crest"],
      tail: ["Fan Tail", "Ribbon Tail"],
      legPose: ["Splayed", "Tiny Hop"],
      beak: ["Tiny Triangle", "Pointy Beak"]
    },
    Proud: {
      shapes: ["Bell", "Circle", "Tulip", "Acorn"],
      eyeSize: ["Small", "Medium"],
      eyePlacement: ["High", "Middle"],
      eyeExpression: ["Happy", "Open"],
      crest: ["Fan Crest", "Sunburst Crest", "Scallop Crest"],
      tail: ["Fan Tail", "Petal Tail"],
      legType: ["Tall Skinny", "Very Tall"],
      legPose: ["Straight", "Splayed"],
      beak: ["Pointy Beak", "Round Beak"]
    },
    Grumpy: {
      shapes: ["Acorn", "Bean", "Bell", "Pebble"],
      eyeSize: ["Tiny", "Small"],
      eyePlacement: ["Low"],
      eyeExpression: ["Side Glance", "Blank Stare"],
      crest: ["Triple Tuft Crest", "Fan Crest", "Scallop Crest"],
      tail: ["Fan Tail", "Cloud Tail"],
      legPose: ["Straight", "Splayed"],
      beak: ["Stubby Beak", "Pointy Beak"]
    },
    Daydreaming: {
      shapes: ["Cloud", "Soft Heart", "Marshmallow", "Pebble"],
      eyeSize: ["Small", "Medium"],
      eyePlacement: ["Middle", "Low"],
      eyeExpression: ["Sleepy", "Side Glance"],
      crest: ["Ribbon Crest", "Single Feather Crest", "Pebble Tuft Crest"],
      tail: ["Cloud Tail", "Petal Tail"],
      legPose: ["Straight", "Belly Sit", "One Foot Up"],
      beak: ["Round Beak", "Tiny Triangle"]
    },
    Mischievous: {
      shapes: ["Bean", "Acorn", "Teardrop", "Gumdrop"],
      eyeSize: ["Small", "Medium"],
      eyeExpression: ["Side Glance", "Happy"],
      crest: ["Triple Tuft Crest", "Pebble Tuft Crest", "Single Feather Crest"],
      tail: ["Curly Tail", "Ribbon Tail"],
      legPose: ["One Foot Up", "Mid Step"],
      beak: ["Pointy Beak", "Stubby Beak"]
    },
    Curious: {
      eyeSize: ["Medium", "Large"],
      eyePlacement: ["Middle", "High"],
      eyeExpression: ["Open", "Side Glance"],
      crest: ["Single Feather Crest", "Triple Tuft Crest"],
      tail: ["Petal Tail", "Fan Tail", "Cloud Tail"],
      legPose: ["One Foot Up", "Mid Step"],
      beak: ["Tiny Triangle", "Pointy Beak"]
    }
  };
  const profile = bias[energy] || {};

  const pick = (items, names, chance = 0.74) => (names && Math.random() < chance ? randomNamedItem(items, names) : randomItem(items));
  const shapeNames = profile.shapes;

  return {
    headShape: pick(tables.heads, shapeNames),
    bodyShape: pick(tables.bodies, shapeNames),
    singleShape: pick(tables.bodies, shapeNames),
    bodySize: pick(tables.bodySizes, profile.bodySize),
    singleShapeSize: pick(tables.bodySizes, profile.singleShapeSize || profile.bodySize),
    eyeSize: pick(tables.eyeSizes, profile.eyeSize),
    eyeStyle: pick(tables.eyeStyles, profile.eyeStyle),
    eyePlacement: pick(tables.eyePlacement, profile.eyePlacement),
    eyeSpacing: pick(tables.eyeSpacing, profile.eyeSpacing),
    eyeExpression: pick(tables.eyeExpressions, profile.eyeExpression),
    beak: pick(tables.beaks, profile.beak),
    legType: pick(tables.legs, profile.legType),
    legPose: pick(tables.legPoses, profile.legPose),
    footType: pick(tables.feet, profile.footType),
    crest: pick(tables.crests, profile.crest),
    tail: pick(tables.tails, profile.tail)
  };
}

function randomStoryCue(energy) {
  return randomItem(tables.storyCues[energy] || tables.storyCues.Curious);
}

function randomAttitude(energy) {
  return randomItem(tables.attitudes[energy] || tables.attitudes.Curious);
}

function findStoryCueByText(text) {
  return Object.values(tables.storyCues).flat().find((cue) => cue.text === text);
}

function randomCritterFriend(storyCue) {
  if (Math.random() < 0.65) {
    return "None";
  }

  if (storyCue?.critter) {
    return storyCue.critter;
  }

  const choices = tables.critterFriends.filter((critter) => critter !== "None");
  return randomItem(choices);
}

function makeBird() {
  const constructionType = randomConstructionType();
  const energy = randomItem(tables.birdEnergy);
  const energyParts = energyBiasedBirdParts(energy);
  const storyCue = randomStoryCue(energy);

  return {
    constructionType,
    birdEnergy: energy,
    attitude: randomAttitude(energy),
    headShape: energyParts.headShape,
    headSize: randomItem(tables.headSizes),
    bodyShape: energyParts.bodyShape,
    bodySize: energyParts.bodySize,
    singleShape: energyParts.singleShape,
    singleShapeSize: energyParts.singleShapeSize,
    crest: energyParts.crest,
    tail: energyParts.tail,
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
    storyCue: storyCue.text,
    critterFriend: randomCritterFriend(storyCue)
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

function energyModifier(energy, part) {
  const modifiers = {
    Grumpy: { crest: "stiff", tail: "bristly", legs: "planted" },
    Curious: { crest: "alert", tail: "perky", legs: "leaning" },
    Mischievous: { crest: "jaunty", tail: "sneaky", legs: "ready-to-dart" },
    Proud: { crest: "showy", tail: "fancy", legs: "confident" },
    Shy: { crest: "small", tail: "tucked-looking", legs: "careful" },
    Startled: { crest: "wild", tail: "flared", legs: "startled" },
    Zippy: { crest: "springy", tail: "bouncy", legs: "quick" },
    Sleepy: { crest: "droopy", tail: "soft", legs: "sleepy" },
    Nervous: { crest: "fidgety", tail: "wobbly", legs: "uneasy" },
    Confused: { crest: "crooked", tail: "puzzled", legs: "awkward" },
    Daydreaming: { crest: "floaty", tail: "soft", legs: "drifty" },
    Bossy: { crest: "important", tail: "commanding", legs: "firm" }
  };

  return modifiers[energy]?.[part] || "";
}

function paletteWord(palette) {
  return palette.name.split(" ")[0];
}

function birdName(bird) {
  return `${bird.birdEnergy} ${paletteWord(bird.colorPalette)} Bird`;
}

function expressionPhrase(expression) {
  const value = lower(expression);
  if (value === "blank stare" || value === "side glance") {
    return `with a ${value}`;
  }

  return `with ${articleFor(expression)} ${value} expression`;
}

function eyePhrase(bird) {
  return `${lower(bird.eyeSize)} ${lower(bird.eyeStyle)} eyes ${expressionPhrase(bird.eyeExpression)} placed ${lower(bird.eyePlacement)} and ${lower(bird.eyeSpacing)}`;
}

function quirkPhrase(quirk) {
  const value = lower(quirk);
  return /(glasses|sunglasses|socks|boots)$/.test(value) ? value : `${articleFor(quirk)} ${value}`;
}

function modifiedPart(energy, part, value) {
  const modifier = energyModifier(energy, part);
  return modifier ? `${modifier} ${lower(value)}` : lower(value);
}

function constructionPhrase(bird) {
  const wingText = wingPromptPhrase(bird);
  const wingSegment = wingText ? `, ${wingText}` : "";
  const crestText = modifiedPart(bird.birdEnergy, "crest", bird.crest);
  const tailText = modifiedPart(bird.birdEnergy, "tail", bird.tail);
  const legLead = energyModifier(bird.birdEnergy, "legs");
  const legsText = legLead ? `${legLead} ${lower(bird.legType)} legs` : `${lower(bird.legType)} legs`;

  if (bird.constructionType === "One-Part Bird") {
    return `It has one simple ${lower(bird.singleShapeSize)} ${lower(bird.singleShape)} shape${wingSegment}, a ${crestText}, a ${tailText}, and ${legsText} in a ${lower(bird.legPose)} pose.`;
  }

  return `It has a ${lower(bird.headSize)} ${withSuffix(bird.headShape, "head")}, a ${lower(bird.bodySize)} ${withSuffix(bird.bodyShape, "body")}${wingSegment}, a ${crestText}, a ${tailText}, and ${legsText} in a ${lower(bird.legPose)} pose.`;
}

function storyParagraph(bird) {
  if (hasValue(bird.critterFriend)) {
    return `${bird.storyCue} It appears to be reacting to ${articleFor(bird.critterFriend)} ${lower(bird.critterFriend)} nearby.`;
  }

  return bird.storyCue;
}

function birdPrompt(bird) {
  const paragraphs = [];

  paragraphs.push(`Draw a ${lower(bird.birdEnergy)} bird that looks like it is ${bird.attitude}. ${constructionPhrase(bird)}`);
  paragraphs.push(`Give it ${eyePhrase(bird)}, plus a ${withSuffix(bird.beak, "beak")} and ${lower(bird.footType)}.`);

  if (hasValue(bird.quirk)) {
    paragraphs.push(`Add ${quirkPhrase(bird.quirk)}.`);
  }

  paragraphs.push(storyParagraph(bird));
  paragraphs.push(`Use the ${bird.colorPalette.name} palette.`);

  return paragraphs;
}

function constructionDetails(bird) {
  if (bird.constructionType === "One-Part Bird") {
    return [
      ["Construction Type", bird.constructionType],
      ["Shape Size", bird.singleShapeSize, "", "singleShapeSize"],
      ["Shape", itemName(bird.singleShape), itemImage(bird.singleShape), "singleShape"],
      ["Wing", wingValue(bird), itemImage(bird.wingShape), "wingShape"],
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
    ["Wing", wingValue(bird), itemImage(bird.wingShape), "wingShape"],
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
    ["Story Cue", bird.storyCue, "", "storyCue"],
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
      `${bird.legPose} Legs`,
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
    `${bird.legPose} Legs`,
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
        <SketchLayer src={itemImage(bird.critterFriend)} className="sketch-critter" />
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
        const cue = randomStoryCue(nextEnergy);
        return {
          ...currentBird,
          birdEnergy: nextEnergy,
          attitude: randomAttitude(nextEnergy),
          storyCue: cue.text,
          critterFriend: randomCritterFriend(cue)
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "storyCue") {
      setBird((currentBird) => {
        const cues = tables.storyCues[currentBird.birdEnergy] || tables.storyCues.Curious;
        const choices = cues.filter((cueOption) => cueOption.text !== currentBird.storyCue);
        const cue = randomItem(choices.length > 0 ? choices : cues);
        return {
          ...currentBird,
          storyCue: cue.text,
          critterFriend: hasValue(currentBird.critterFriend) && cue.critter ? cue.critter : currentBird.critterFriend
        };
      });
      setCopyStatus("");
      return;
    }

    if (field === "critterFriend") {
      setBird((currentBird) => ({
        ...currentBird,
        critterFriend: randomCritterFriend(findStoryCueByText(currentBird.storyCue))
      }));
      setCopyStatus("");
      return;
    }

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
