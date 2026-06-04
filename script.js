const traits = {
  moods: ["Curious", "Joyful", "Dreamy", "Bold", "Gentle", "Zippy", "Mischievous", "Cozy", "Wonderstruck", "Peppy"],
  headShapes: ["Gumdrop", "Teardrop", "Moonbean", "Button", "Pear", "Cloud Puff", "Acorn", "Marshmallow"],
  headSizes: ["Tiny", "Small", "Medium", "Large", "Grand"],
  bodyShapes: ["Puffy", "Round", "Bean-Shaped", "Pear-Bellied", "Fluffy", "Plump", "Oval", "Squishy"],
  bodySizes: ["Petite", "Compact", "Medium", "Chubby", "Grand"],
  crests: ["Fan Crest", "Sprout Crest", "Curly Crest", "Star Tuft", "Three-Feather Crest", "Pebble Tuft", "Loop Crest"],
  tails: ["Ribbon Tail", "Leaf Tail", "Forked Tail", "Pom-Pom Tail", "Banner Tail", "Teardrop Tail", "Wiggle Tail"],
  eyeSizes: ["Tiny", "Bright", "Wide", "Sleepy", "Sparkly", "Button"],
  eyePlacements: ["Close Together", "Wide Apart", "High Set", "Low Set", "Side Peek"],
  beaks: ["Tiny Triangle", "Seed Beak", "Curved Beak", "Little Scoop", "Pointy Beak", "Petal Beak"],
  legLengths: ["Short Stubby", "Medium Bouncy", "Tall Skinny", "Wobbly", "Long Tiptoe"],
  feet: ["Daisy Feet", "Tiny Toes", "Paddle Feet", "Curly Toes", "Star Feet", "Boot Feet"],
  palettes: [
    { name: "Berry Patch", colors: ["#8f5fd7", "#ff8fab", "#ffd166", "#4f9d69"] },
    { name: "Citrus Picnic", colors: ["#ffb703", "#fb8500", "#8ecae6", "#219ebc"] },
    { name: "Candy Garden", colors: ["#ffafcc", "#bde0fe", "#cdb4db", "#95d5b2"] },
    { name: "Sunlit Pond", colors: ["#ffd166", "#06d6a0", "#118ab2", "#fefae0"] },
    { name: "Storybook Sky", colors: ["#90dbf4", "#f1c0e8", "#cfbaf0", "#fbf8cc"] },
    { name: "Melon Meadow", colors: ["#ffcad4", "#b8e0d2", "#f4acb7", "#84a59d"] },
    { name: "Confetti Orchard", colors: ["#f94144", "#f9c74f", "#43aa8b", "#577590"] },
    { name: "Moonlit Sherbet", colors: ["#b8c0ff", "#ffc6ff", "#fffffc", "#caffbf"] }
  ]
};

const birdName = document.querySelector("#bird-name");
const birdFormula = document.querySelector("#bird-formula");
const birdPrompt = document.querySelector("#bird-prompt");
const copyStatus = document.querySelector("#copy-status");
const generateButton = document.querySelector("#generate-bird");
const copyButton = document.querySelector("#copy-prompt");
const birdVisual = document.querySelector(".bird-visual");

let currentBird;

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function lower(value) {
  return value.toLowerCase();
}

function buildBird() {
  const palette = randomItem(traits.palettes);

  return {
    mood: randomItem(traits.moods),
    headShape: randomItem(traits.headShapes),
    headSize: randomItem(traits.headSizes),
    bodyShape: randomItem(traits.bodyShapes),
    bodySize: randomItem(traits.bodySizes),
    crest: randomItem(traits.crests),
    tail: randomItem(traits.tails),
    eyeSize: randomItem(traits.eyeSizes),
    eyePlacement: randomItem(traits.eyePlacements),
    beak: randomItem(traits.beaks),
    legLength: randomItem(traits.legLengths),
    feet: randomItem(traits.feet),
    palette
  };
}

function createName(bird) {
  const paletteWord = bird.palette.name.split(" ")[0];
  return `${bird.mood} ${paletteWord} Bird`;
}

function createPrompt(bird) {
  const head = `${lower(bird.headSize)} ${lower(bird.headShape)} head`;
  const body = `${lower(bird.bodySize)} ${lower(bird.bodyShape)} body`;
  const eyes = `${lower(bird.eyeSize)} eyes placed ${lower(bird.eyePlacement)}`;
  const legs = `${lower(bird.legLength)} legs with ${lower(bird.feet)}`;

  return `Draw ${articleFor(bird.mood)} ${lower(bird.mood)} bird with a ${head}, ${articleFor(bird.bodySize)} ${body}, ${lower(bird.crest)}, ${lower(bird.tail)}, ${eyes}, a ${lower(bird.beak)} beak, and ${legs}. Use the ${bird.palette.name} palette.`;
}

function createFormulaRows(bird) {
  return [
    ["Mood", bird.mood],
    ["Head", `${bird.headSize} ${bird.headShape}`],
    ["Body", `${bird.bodySize} ${bird.bodyShape}`],
    ["Crest", bird.crest],
    ["Tail", bird.tail],
    ["Eyes", `${bird.eyeSize}, ${bird.eyePlacement}`],
    ["Beak", bird.beak],
    ["Legs", bird.legLength],
    ["Feet", bird.feet],
    ["Palette", bird.palette.name]
  ];
}

function renderFormula(bird) {
  birdFormula.replaceChildren();

  createFormulaRows(bird).forEach(([label, value]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = `${label}:`;
    description.textContent = value;
    birdFormula.append(term, description);
  });
}

function renderVisual(bird) {
  const [headColor, bodyColor, tailColor, crestColor] = bird.palette.colors;
  const headScale = {
    Tiny: 0.8,
    Small: 0.9,
    Medium: 1,
    Large: 1.12,
    Grand: 1.24
  }[bird.headSize];
  const bodyScale = {
    Petite: 0.85,
    Compact: 0.95,
    Medium: 1,
    Chubby: 1.1,
    Grand: 1.2
  }[bird.bodySize];
  const eyeSize = {
    Tiny: 7,
    Bright: 9,
    Wide: 12,
    Sleepy: 8,
    Sparkly: 10,
    Button: 11
  }[bird.eyeSize];
  const placement = {
    "Close Together": [23, 23],
    "Wide Apart": [12, 12],
    "High Set": [18, 18],
    "Low Set": [18, 18],
    "Side Peek": [28, 10]
  }[bird.eyePlacement];
  const legHeight = {
    "Short Stubby": 18,
    "Medium Bouncy": 27,
    "Tall Skinny": 40,
    Wobbly: 34,
    "Long Tiptoe": 46
  }[bird.legLength];

  birdVisual.style.setProperty("--bird-head", headColor);
  birdVisual.style.setProperty("--bird-body", bodyColor);
  birdVisual.style.setProperty("--bird-tail", tailColor);
  birdVisual.style.setProperty("--bird-crest", crestColor);
  birdVisual.style.setProperty("--eye-size", `${eyeSize}px`);
  birdVisual.style.setProperty("--eye-left", `${placement[0]}px`);
  birdVisual.style.setProperty("--eye-right", `${placement[1]}px`);
  birdVisual.style.setProperty("--leg-height", `${legHeight}px`);
  birdVisual.style.setProperty("--feet-offset", `${legHeight - 30}px`);

  birdVisual.querySelector(".head").style.transform = `scale(${headScale})`;
  birdVisual.querySelector(".body").style.transform = `scale(${bodyScale})`;
  birdVisual.querySelector(".crest").style.transform = bird.crest.includes("Curly") ? "rotate(-12deg)" : "rotate(0deg)";
  birdVisual.querySelector(".tail").style.borderRadius = bird.tail.includes("Ribbon") ? "0 80% 80% 0" : "0 18px 18px 0";
}

function renderBird() {
  currentBird = buildBird();
  birdName.textContent = createName(currentBird);
  birdPrompt.textContent = createPrompt(currentBird);
  renderFormula(currentBird);
  renderVisual(currentBird);
  copyStatus.textContent = "";
}

async function copyPrompt() {
  if (!currentBird) {
    return;
  }

  const promptText = birdPrompt.textContent;

  try {
    await navigator.clipboard.writeText(promptText);
    copyStatus.textContent = "Prompt copied.";
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "-9999px";
    document.body.append(textArea);
    textArea.select();

    const copied = document.execCommand("copy");
    textArea.remove();
    copyStatus.textContent = copied ? "Prompt copied." : "Select the prompt text to copy it.";
  }
}

generateButton.addEventListener("click", renderBird);
copyButton.addEventListener("click", copyPrompt);

renderBird();
