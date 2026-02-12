// 6th-grade-ish, medium difficulty, funny
const WORDS = [
  // Animals
  { word: "AXOLOTL", hint: "Smiling amphibian" },
  { word: "CAPYBARA", hint: "Chill giant rodent" },
  { word: "NARWHAL", hint: "Unicorn of the sea" },
  { word: "PLATYPUS", hint: "Egg-laying mammal" },
  { word: "MEERKAT", hint: "Desert lookout" },
  { word: "ORANGUTAN", hint: "Red-orange ape" },
  { word: "CHAMELEON", hint: "Color-changing lizard" },
  { word: "PORCUPINE", hint: "Spiky mammal" },
  { word: "HEDGEHOG", hint: "Tiny spiky friend" },
  { word: "JELLYFISH", hint: "No bones, all vibes" },
  { word: "BUTTERFLY", hint: "Glow-up insect" },
  { word: "PELICAN", hint: "Legendary beak" },

  // Plants / nature
  { word: "SUNFLOWER", hint: "Tall, sunny plant" },
  { word: "DANDELION", hint: "Wish-maker weed" },
  { word: "CACTUS", hint: "Spiky desert plant" },
  { word: "BAMBOO", hint: "Fast-growing grass" },
  { word: "MUSHROOM", hint: "Not a plant, still counts" },
  { word: "RAINFOREST", hint: "Mega-biodiversity biome" },
  { word: "VOLCANO", hint: "Spicy mountain" },
  { word: "HURRICANE", hint: "Huge storm system" },

  // Pop singers
  { word: "TAYLORSWIFT", hint: "Eras tour icon" },
  { word: "OLIVIARODRIGO", hint: "Sour / Guts" },
  { word: "BILLIEEILISH", hint: "Whisper-pop queen" },
  { word: "SABRINACARPENTER", hint: "Pop star" },
  { word: "ARIANAGRANDE", hint: "High notes" },
  { word: "THEWEEKND", hint: "Stage name" },
  { word: "DUALIPA", hint: "Dance-pop" },
  { word: "JUSTINBIEBER", hint: "Pop star" },
  { word: "HARRYSTYLES", hint: "Former boy band" },
  { word: "SHAWNMENDES", hint: "Singer-songwriter" },

  // School life / funny
  { word: "HOMEWORK", hint: "The classic villain" },
  { word: "DEODORANT", hint: "Middle school survival" },
  { word: "CAFETERIA", hint: "Where mysteries live" },
  { word: "BACKPACK", hint: "Portable chaos" },
  { word: "LOCKER", hint: "Tiny metal closet" },
  { word: "GROUPPROJECT", hint: "Friendship stress test" },
  { word: "DETENTION", hint: "Oops" },
  { word: "POPQUIZ", hint: "Academic jumpscare" },
  { word: "CRISPITOS", hint: "Best lunch" },
  { word: "SIXSEVEN", hint: "nonsense" },

  // Fruits & veggies
  { word: "POMEGRANATE", hint: "Tiny jewel seeds" },
  { word: "PINEAPPLE", hint: "Spiky on the outside" },
  { word: "STRAWBERRY", hint: "Not actually a berry (plot twist)" },
  { word: "RASPBERRY", hint: "Tiny bumpy snack" },
  { word: "AVOCADO", hint: "Green toast superstar" },
  { word: "BROCCOLI", hint: "Tiny tree veggie" },
  { word: "ZUCCHINI", hint: "Green summer squash" },
  { word: "CAULIFLOWER", hint: "Tries to be pizza crust" },

  // Band instruments
  { word: "SAXOPHONE", hint: "Jazz tube" },
  { word: "TROMBONE", hint: "The slidey one" },
  { word: "CLARINET", hint: "Squeaky-but-classy" },
  { word: "XYLOPHONE", hint: "Musical wooden stairs" },
  { word: "TUBA", hint: "Big brass = big power" },
  { word: "TRUMPET", hint: "The loud shiny one" }
];

// Flipped hangman: pole left, person right
const HANGMAN_FRAMES = [
`  +----+
  |
  |
  |
  |
  |
========`,
`  +----+
  |      O
  |
  |
  |
  |
========`,
`  +----+
  |      O
  |      |
  |
  |
  |
========`,
`  +----+
  |      O
  |     /|
  |
  |
  |
========`,
`  +----+
  |      O
  |     /|\\
  |
  |
  |
========`,
`  +----+
  |      O
  |     /|\\
  |     /
  |
  |
========`,
`  +----+
  |      O
  |     /|\\
  |     / \\
  |
  |
========`
];

const MAX_WRONG = 6;

// --- State ---
let answer = "";
let hint = "";
let guessed = new Set();
let wrong = 0;
let gameOver = false;
let wins = 0;
let played = 0;

// --- Elements ---
const elWord = document.getElementById("wordDisplay");
const elGuessed = document.getElementById("guessed");
const elWrong = document.getElementById("wrong");
const elLives = document.getElementById("lives");
const elHint = document.getElementById("hint");
const elMessage = document.getElementById("message");
const elKeyboard = document.getElementById("keyboard");
const elReset = document.getElementById("resetBtn");
const elHangmanArt = document.getElementById("hangmanArt");
const elScore = document.getElementById("score");
const elConfetti = document.getElementById("confetti");

// Win/Lose audio
const sfxWin = document.getElementById("sfxWin");
const sfxLose = document.getElementById("sfxLose");

function playClip(audioEl) {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {
    // mobile browsers may block until a user gesture; it will work after first tap/keypress
  });
}

function pickWord() {
  const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = choice.word.toUpperCase
