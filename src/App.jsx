import React, { useMemo, useState } from "react";

const builderPrompts = {
  view: ["Straight on", "Profile"],
  body: [
    "Large body",
    "Small body",
    "Tall body",
    "Round body",
    "Wide body",
    "Wonky body"
  ],
  wings: [
    "Tiny wings",
    "Oversized wings",
    "Matching wings",
    "Mismatched wings",
    "Patterned wings",
    "Solid wings"
  ],
  crest: [
    "No crest",
    "One small feather",
    "Three feathers",
    "Tiny crest",
    "Matching crest",
    "Mismatched crest",
    "Use an unexpected shape"
  ],
  eyes: {
    front: [
      "Tiny eyes",
      "Oversized eyes",
      "Close together",
      "Far apart",
      "Looking up",
      "Looking down",
      "Looking sideways",
      "Looking straight ahead",
      "Close one eye",
      "Close both eyes",
      "Make the eyes different sizes",
      "Make each eye look in a different direction"
    ],
    profile: [
      "Tiny eye",
      "Oversized eye",
      "Close the eye"
    ]
  },
  emotion: ["Happy", "Curious", "Sleepy", "Grumpy", "Proud", "Surprised", "Excited", "Shy"],
  accessory: {
    always: ["No Accessory", "Glasses", "Sunglasses", "Headscarf"],
    crestReplacement: [
      "Replace the crest with a flower on a stem",
      "Replace the crest with a star on a stem",
      "Replace the crest with a swirly sprout",
      "Replace the crest with a feather crown",
      "Replace the crest with a crown",
      "Replace the crest with a hat",
      "Replace the crest with a feathered headpiece",
      "Replace the crest with a head scarf"
    ]
  },
  legsFeet: {
    noLegs: "No visible legs",
    pairedLegs: ["Tiny legs", "Long legs"],
    pairedFeet: ["boots", "shoes", "socks", "mismatched footwear", "simple bird feet"],
    singleLeg: "One leg showing",
    singleFoot: ["boot", "shoe", "sock", "simple bird foot"]
  },
  sillyDetail: [
    "Add a heart",
    "Add a star",
    "Add a feather",
    "Add a flower",
    "Add a belly shape",
    "Add enormous feet",
    "Add a worm in its beak."
  ]
};

const categoryConfig = [
  { key: "view", title: "View" },
  { key: "body", title: "Body" },
  { key: "wings", title: "Wings" },
  { key: "crest", title: "Crest" },
  { key: "eyes", title: "Eyes", note: "Optional: draw the eyes based on the Emotion." },
  {
    key: "emotion",
    title: "Emotion",
    note: "Use the Emotion Reference Sheet to draw the eyes, eyebrows, and mouth."
  },
  { key: "accessory", title: "Accessory" },
  { key: "legsFeet", title: "Legs & Feet" },
  { key: "sillyDetail", title: "Silly Detail" }
];

const initialLocks = Object.fromEntries(categoryConfig.map(({ key }) => [key, false]));

const legsFeetOptions = [
  builderPrompts.legsFeet.noLegs,
  ...builderPrompts.legsFeet.pairedLegs.flatMap((legs) =>
    builderPrompts.legsFeet.pairedFeet.map((feet) => `${legs} with ${feet}`)
  ),
  ...builderPrompts.legsFeet.singleFoot.map((foot) => `${builderPrompts.legsFeet.singleLeg} with a ${foot}`)
];

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomDifferentItem(items, currentItem) {
  if (items.length < 2) {
    return items[0];
  }

  let nextItem = randomItem(items);
  while (nextItem === currentItem) {
    nextItem = randomItem(items);
  }
  return nextItem;
}

function eyeOptionsForView(view) {
  return view === "Profile" ? builderPrompts.eyes.profile : builderPrompts.eyes.front;
}

function wingOptionsForView(view) {
  if (view !== "Profile") {
    return builderPrompts.wings;
  }

  return builderPrompts.wings.filter((wing) => wing !== "Matching wings" && wing !== "Mismatched wings");
}

function accessoryOptionsForBird(bird) {
  if (bird.crest && bird.crest !== "No crest") {
    return [...builderPrompts.accessory.always, ...builderPrompts.accessory.crestReplacement];
  }

  return builderPrompts.accessory.always;
}

function sillyDetailOptionsForBird(bird) {
  const options = [...builderPrompts.sillyDetail];

  if (bird.view === "Straight on") {
    options.push("Make the eyes different sizes.");
    options.push("Make the eyes look in different directions.");
  }

  if (bird.view === "Profile") {
    if (bird.eyes !== "Looking up") {
      options.push("Rotate the body so that the bird is looking down at something on the ground.");
    }

    if (bird.eyes !== "Looking down") {
      options.push("Rotate the body so that the bird is looking up at something above them.");
    }
  }

  if (bird.legsFeet && bird.legsFeet !== builderPrompts.legsFeet.noLegs) {
    options.push("Draw the legs in a funny pose.");
  }

  return options;
}

function promptOptionsForCategory(key, bird) {
  if (key === "eyes") {
    return eyeOptionsForView(bird.view);
  }

  if (key === "wings") {
    return wingOptionsForView(bird.view);
  }

  if (key === "legsFeet") {
    return legsFeetOptions;
  }

  if (key === "accessory") {
    return accessoryOptionsForBird(bird);
  }

  if (key === "sillyDetail") {
    return sillyDetailOptionsForBird(bird);
  }

  return builderPrompts[key];
}

function normalizeEyesForView(view, eyes) {
  const options = eyeOptionsForView(view);

  if (options.includes(eyes)) {
    return eyes;
  }

  if (view === "Profile") {
    const profileMap = {
      "Two eyes": "Tiny eye",
      "Tiny eyes": "Tiny eye",
      "Oversized eyes": "Oversized eye",
      "Close together": "Tiny eye",
      "Far apart": "Tiny eye",
      "Close one eye": "Close the eye",
      "Close both eyes": "Close the eye"
    };

    return profileMap[eyes] || randomItem(options);
  }

  const frontMap = {
    "One visible eye": "Tiny eyes",
    "Tiny eye": "Tiny eyes",
    "Oversized eye": "Oversized eyes",
    "Close the eye": "Close one eye"
  };

  return frontMap[eyes] || randomItem(options);
}

function normalizeWingsForView(view, wings) {
  const options = wingOptionsForView(view);
  return options.includes(wings) ? wings : randomItem(options);
}

function normalizeSillyDetailForBird(bird) {
  const options = sillyDetailOptionsForBird(bird);
  return options.includes(bird.sillyDetail) ? bird.sillyDetail : randomItem(options);
}

function normalizeAccessoryForBird(bird) {
  const options = accessoryOptionsForBird(bird);
  return options.includes(bird.accessory) ? bird.accessory : randomItem(options);
}

function makeBird(currentBird = {}, locks = initialLocks) {
  const nextBird = {};

  categoryConfig.forEach(({ key }) => {
    if (locks[key] && currentBird[key]) {
      nextBird[key] = currentBird[key];
      return;
    }

    const options = promptOptionsForCategory(key, { ...currentBird, ...nextBird });
    nextBird[key] = currentBird[key] ? randomDifferentItem(options, currentBird[key]) : randomItem(options);
  });

  nextBird.eyes = normalizeEyesForView(nextBird.view, nextBird.eyes);
  nextBird.wings = normalizeWingsForView(nextBird.view, nextBird.wings);
  nextBird.accessory = normalizeAccessoryForBird(nextBird);
  nextBird.sillyDetail = normalizeSillyDetailForBird(nextBird);

  return nextBird;
}

function lower(value) {
  return value.toLowerCase();
}

function stripPrefix(value, prefix) {
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function bodyPhrase(body) {
  return lower(body).replace(" body", "");
}

function wingPhrase(wings, view) {
  const text = lower(wings);

  if (text === "one wing") {
    return view === "Profile" ? "one visible wing" : "one wing";
  }

  if (text === "two wings") {
    return "two wings";
  }

  return text;
}

function crestPhrase(crest) {
  if (crest === "No crest") {
    return "no crest";
  }

  if (crest === "One small feather") {
    return "a crest with one small feather";
  }

  if (crest === "Three feathers") {
    return "a three-feather crest";
  }

  if (crest === "Use an unexpected shape") {
    return "a crest made from an unexpected shape";
  }

  return `a ${lower(crest)}`;
}

function eyePhrase(eyes, view) {
  const direction = lower(eyes).replace("looking", "looking");

  if (view === "Profile") {
    if (eyes === "Tiny eye" || eyes === "Oversized eye") {
      return `its visible eye is ${lower(eyes).replace(" eye", "")}`;
    }

    if (eyes === "Close the eye") {
      return "its visible eye is closed";
    }

    return `its visible eye is ${direction}`;
  }

  if (eyes === "Close together" || eyes === "Far apart") {
    return `its eyes are ${direction}`;
  }

  if (eyes.startsWith("Looking")) {
    return `its eyes are ${direction}`;
  }

  if (eyes === "Close one eye") {
    return "it has one eye closed";
  }

  if (eyes === "Close both eyes") {
    return "both eyes are closed";
  }

  if (eyes === "Make the eyes different sizes") {
    return "its eyes are different sizes";
  }

  if (eyes === "Make each eye look in a different direction") {
    return "each eye looks in a different direction";
  }

  return `it has ${lower(eyes)}`;
}

function accessoryPhrase(accessory) {
  if (accessory === "No Accessory") {
    return "skip accessories";
  }

  if (accessory === "Glasses" || accessory === "Sunglasses") {
    return lower(accessory);
  }

  if (accessory.startsWith("Replace the crest")) {
    return lower(accessory);
  }

  return `a ${lower(accessory)}`;
}

function legsFeetPhrase(legsFeet) {
  if (legsFeet === "No visible legs") {
    return "no visible legs";
  }

  return lower(legsFeet);
}

function sillyDetailPhrase(sillyDetail) {
  const detailMap = {
    "Add a heart": "a heart",
    "Add a star": "a star",
    "Add a feather": "a feather",
    "Add a flower": "a flower",
    "Add a belly shape": "a belly shape",
    "Add enormous feet": "enormous feet",
    "Add a worm in its beak.": "a worm in its beak",
    "Make the eyes different sizes.": "eyes in different sizes",
    "Make the eyes look in different directions.": "eyes looking in different directions",
    "Draw the legs in a funny pose.": "legs in a funny pose",
    "Rotate the body so that the bird is looking down at something on the ground.":
      "a rotated body looking down at something on the ground",
    "Rotate the body so that the bird is looking up at something above them.":
      "a rotated body looking up at something above them"
  };

  if (detailMap[sillyDetail]) {
    return detailMap[sillyDetail];
  }

  return lower(stripPrefix(sillyDetail, "Add "));
}

function accessoryLegsSentence(bird) {
  const legsFeet = legsFeetPhrase(bird.legsFeet);

  if (bird.accessory === "No Accessory") {
    return `Add ${legsFeet}; skip accessories.`;
  }

  if (bird.accessory.startsWith("Replace the crest")) {
    return `${accessoryPhrase(bird.accessory)} and add ${legsFeet}.`;
  }

  return `Add ${accessoryPhrase(bird.accessory)} and ${legsFeet}.`;
}

function fullRecipe(bird) {
  const viewPhrase = bird.view === "Profile" ? "profile" : "straight-on";
  const eyeSentence = eyePhrase(bird.eyes, bird.view);

  return [
    `Build a ${bodyPhrase(bird.body)} ${viewPhrase} bird.`,
    `Give it ${wingPhrase(bird.wings, bird.view)} and ${crestPhrase(bird.crest)}.`,
    `${eyeSentence.charAt(0).toUpperCase()}${eyeSentence.slice(1)}, and it feels ${lower(bird.emotion)}.`,
    accessoryLegsSentence(bird),
    `Finish with ${sillyDetailPhrase(bird.sillyDetail)}.`
  ].join(" ");
}

function CategoryCard({ title, value, note, locked, onReroll, onToggleLock }) {
  return (
    <section
      className="shuffle-card"
      data-category={title}
      aria-labelledby={`${title.replaceAll(" ", "-").replace("&", "and").toLowerCase()}-heading`}
    >
      <div className="shuffle-card-header">
        <h2 id={`${title.replaceAll(" ", "-").replace("&", "and").toLowerCase()}-heading`}>{title}</h2>
        <div className="card-actions">
          <button
            type="button"
            className={locked ? "lock-button is-locked" : "lock-button"}
            onClick={onToggleLock}
            aria-pressed={locked}
            aria-label={`${locked ? "Unlock" : "Lock"} ${title}`}
          >
            {locked ? "Locked" : "Lock"}
          </button>
          <button type="button" className="shuffle-button" onClick={onReroll} aria-label={`Reroll ${title}`}>
            Reroll
          </button>
        </div>
      </div>
      <dl className="shuffle-card-content">
        <div className="card-field card-field-primary">
          <dd>{value}</dd>
        </div>
      </dl>
      {note && <p className="card-note">{note}</p>}
    </section>
  );
}

export default function App() {
  const [bird, setBird] = useState(() => makeBird());
  const [locks, setLocks] = useState(initialLocks);
  const [copyStatus, setCopyStatus] = useState("");
  const recipe = useMemo(() => fullRecipe(bird), [bird]);

  function generateBird() {
    setBird((currentBird) => makeBird(currentBird, locks));
    setCopyStatus("");
  }

  function rerollAll() {
    setBird((currentBird) => makeBird(currentBird, locks));
    setCopyStatus("");
  }

  function rerollCategory(key) {
    setBird((currentBird) => {
      const nextBird = { ...currentBird };
      const options = promptOptionsForCategory(key, currentBird);
      nextBird[key] = randomDifferentItem(options, currentBird[key]);

      if (key === "view") {
        nextBird.eyes = normalizeEyesForView(nextBird.view, nextBird.eyes);
        nextBird.wings = normalizeWingsForView(nextBird.view, nextBird.wings);
        nextBird.sillyDetail = normalizeSillyDetailForBird(nextBird);
      }

      if (key === "wings") {
        nextBird.wings = normalizeWingsForView(nextBird.view, nextBird.wings);
      }

      if (key === "eyes") {
        nextBird.eyes = normalizeEyesForView(nextBird.view, nextBird.eyes);
      }

      if (key === "crest" || key === "accessory") {
        nextBird.accessory = normalizeAccessoryForBird(nextBird);
      }

      if (key === "legsFeet" || key === "sillyDetail") {
        nextBird.sillyDetail = normalizeSillyDetailForBird(nextBird);
      }

      return nextBird;
    });
    setCopyStatus("");
  }

  function toggleLock(key) {
    setLocks((currentLocks) => ({
      ...currentLocks,
      [key]: !currentLocks[key]
    }));
  }

  async function copyRecipe() {
    const completeRecipe = `${recipe}\n\n${categoryConfig.map(({ key, title }) => `${title}: ${bird[key]}`).join("\n")}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(completeRecipe);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = completeRecipe;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopyStatus("Recipe copied.");
    } catch {
      setCopyStatus("Copy is blocked here. Select the recipe text to copy it.");
    }
  }

  return (
    <main className="page">
      <section className="sketchbook" aria-labelledby="bird-title">
        <header className="page-header">
          <h1 className="builder-title">Whimsical Bird Character Builder</h1>
          <p className="kicker">
            Create a playful bird character one choice at a time. Mix body shapes, wings, expressions,
            accessories, feet, and silly details to create a bird filled with personality.
          </p>
          <p className="instruction">
            Generate a complete bird, or reroll one detail at a time until your character feels just right.
          </p>
        </header>

        <div className="builder-actions">
          <button type="button" className="primary-action" onClick={generateBird}>
            Build My Bird
          </button>
          <button type="button" className="secondary" onClick={rerollAll}>
            Reroll All
          </button>
          <button type="button" className="secondary" onClick={copyRecipe}>
            Copy Recipe
          </button>
        </div>
        <p className="copy-status" role="status" aria-live="polite">{copyStatus}</p>

        <section className="result-hero">
          <h2 id="bird-title">{bird.emotion} {bird.view} Bird</h2>
        </section>

        <p className="pack-note">
          Use your Whimsical Bird Character Pack to choose printable bodies, wings, eyes, crests,
          accessories, and feet that match your recipe. You can also draw or invent your own pieces.
        </p>

        <div className="card-grid">
          {categoryConfig.map(({ key, title, note }) => (
            <CategoryCard
              key={key}
              title={title}
              value={bird[key]}
              note={note}
              locked={locks[key]}
              onReroll={() => rerollCategory(key)}
              onToggleLock={() => toggleLock(key)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
