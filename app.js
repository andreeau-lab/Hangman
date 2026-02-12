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
  "  +----+\n  |\n  |\n  |\n  |\n  |\n========",
  "  +----+\n  |      O\n  |\n  |\n  |\n  |\n========",
  "  +----+\n  |      O\n  |      |\n  |\n  |\n  |\n========",
  "  +----+\n  |      O\n  |     /|\n  |\n  |\n  |\n========",
  "  +----+\n  |      O\n  |     /|\\\n  |\n  |\n  |\n========",
  "  +----+\n  |      O\n  |     /|\\\n  |     /\n  |\n  |\n========",
  "  +----+\n  |      O\n  |     /|\\\n  |     / \\\n  |\n  |\n========"
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

// Win/Lose audio (.wav in repo root)
const sfxWin = document.getElementById("sfxWin");
const sfxLose = document.getElementById("sfxLose");

function playClip(audioEl) {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}

function pickWord() {
  const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = choice.word.toUpperCase();
  hint = choice.hint;
}

function maskedWord() {
  return answer
    .split("")
    .map((ch) => (ch >= "A" && ch <= "Z" ? (guessed.has(ch) ? ch : "_") : ch))
    .join(" ");
}

function didWin() {
  for (const ch of answer) {
    if (ch >= "A" && ch <= "Z" && !guessed.has(ch)) return false;
  }
  return true;
}

function endIfNeeded() {
  if (didWin()) gameOver = true;
  if (wrong >= MAX_WRONG) gameOver = true;
}

function updateMessage() {
  if (gameOver) {
    if (didWin()) {
      elMessage.innerHTML =
        `<span class="win">SLAY 💅 You got it!</span> Tap <b>New word</b> to keep going.`;
    } else {
      elMessage.innerHTML =
        `<span class="lose">Nooo 😭</span> The word was <b>${answer}</b>. Tap <b>New word</b>.`;
    }
  } else {
    elMessage.textContent = "Make a guess ✨";
  }
}

// Confetti burst on win
function burstConfetti() {
  if (!elConfetti) return;

  elConfetti.innerHTML = "";
  const pieces = 26;
  const width = elConfetti.clientWidth || 600;
  const colors = ["#ff5fa2", "#7cdbff", "#ffd54d", "#7cf0b1", "#a78bfa", "#ff8a5b"];

  for (let i = 0; i < pieces; i++) {
    const p = document.createElement("div");
    p.className = "confettiPiece";
    p.style.left = `${Math.floor(Math.random() * width)}px`;

    const w = 6 + Math.floor(Math.random() * 6);
    const h = 8 + Math.floor(Math.random() * 10);
    p.style.width = `${w}px`;
    p.style.height = `${h}px`;

    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    const dur = 650 + Math.floor(Math.random() * 350);
    p.style.animationDuration = `${dur}ms`;

    const drift = -40 + Math.floor(Math.random() * 80);
    p.animate(
      [
        { transform: "translateY(0) rotate(0deg)" },
        { transform: `translate(${drift}px, 520px) rotate(240deg)` }
      ],
      { duration: dur, easing: "ease-out", fill: "forwards" }
    );

    elConfetti.appendChild(p);
  }

  setTimeout(() => {
    elConfetti.innerHTML = "";
  }, 1100);
}

function render() {
  if (!elWord || !elKeyboard) return;

  elWord.textContent = maskedWord();
  elGuessed.textContent = [...guessed].sort().join(" ") || "—";
  elWrong.textContent = String(wrong);
  elLives.textContent = String(MAX_WRONG - wrong);
  elHint.textContent = hint;
  elScore.textContent = `${wins} of ${played}`;

  if (elHangmanArt) elHangmanArt.textContent = HANGMAN_FRAMES[wrong];

  const buttons = elKeyboard.querySelectorAll("button.key");
  buttons.forEach((btn) => {
    const letter = btn.dataset.letter;
    btn.disabled = gameOver || guessed.has(letter);
  });

  updateMessage();
}

function finalizeRoundIfNeeded(previousGameOver) {
  if (!previousGameOver && gameOver) {
    played += 1;

    if (didWin()) {
      wins += 1;
      burstConfetti();
      playClip(sfxWin);
    } else {
      playClip(sfxLose);
    }
  }
}

function guessLetter(raw) {
  if (gameOver) return;

  const letter = String(raw).toUpperCase();
  if (letter.length !== 1 || letter < "A" || letter > "Z") return;
  if (guessed.has(letter)) return;

  const wasGameOver = gameOver;

  guessed.add(letter);
  if (!answer.includes(letter)) wrong += 1;

  endIfNeeded();
  finalizeRoundIfNeeded(wasGameOver);
  render();
}

function resetGame() {
  pickWord();
  guessed = new Set();
  wrong = 0;
  gameOver = false;
  render();
}

// Tablet-friendly QWERTY keyboard
function buildKeyboard() {
  elKeyboard.innerHTML = "";
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  rows.forEach((rowStr, idx) => {
    const row = document.createElement("div");
    row.className = `kbdRow row${idx + 1}`;

    rowStr.split("").forEach((l) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "key";
      btn.textContent = l;
      btn.dataset.letter = l;
      btn.addEventListener("click", () => guessLetter(l), { passive: true });
      row.appendChild(btn);
    });

    elKeyboard.appendChild(row);
  });
}

// Physical keyboard support
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  guessLetter(e.key);
});

if (elReset) elReset.addEventListener("click", resetGame);

buildKeyboard();
resetGame();
