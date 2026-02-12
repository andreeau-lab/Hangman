// --- Words (compact format: [WORD, HINT]) ---
const WORDS = [
  ["AXOLOTL","Smiling amphibian"],["CAPYBARA","Chill giant rodent"],["NARWHAL","Unicorn of the sea"],
  ["PLATYPUS","Egg-laying mammal"],["MEERKAT","Desert lookout"],["ORANGUTAN","Red-orange ape"],
  ["CHAMELEON","Color-changing lizard"],["PORCUPINE","Spiky mammal"],["HEDGEHOG","Tiny spiky friend"],
  ["JELLYFISH","No bones, all vibes"],["BUTTERFLY","Glow-up insect"],["PELICAN","Legendary beak"],

  ["SUNFLOWER","Tall, sunny plant"],["DANDELION","Wish-maker weed"],["CACTUS","Spiky desert plant"],
  ["BAMBOO","Fast-growing grass"],["MUSHROOM","Not a plant, still counts"],["RAINFOREST","Mega-biodiversity biome"],
  ["VOLCANO","Spicy mountain"],["HURRICANE","Huge storm system"],

  ["TAYLORSWIFT","Eras tour icon"],["OLIVIARODRIGO","Sour / Guts"],["BILLIEEILISH","Whisper-pop queen"],
  ["SABRINACARPENTER","Pop star"],["ARIANAGRANDE","High notes"],["THEWEEKND","Stage name"],
  ["DUALIPA","Dance-pop"],["JUSTINBIEBER","Pop star"],["HARRYSTYLES","Former boy band"],["SHAWNMENDES","Singer-songwriter"],

  ["HOMEWORK","The classic villain"],["DEODORANT","Middle school survival"],["CAFETERIA","Where mysteries live"],
  ["BACKPACK","Portable chaos"],["LOCKER","Tiny metal closet"],["GROUPPROJECT","Friendship stress test"],
  ["DETENTION","Oops"],["POPQUIZ","Academic jumpscare"],["CRISPITOS","Best lunch"],["SIXSEVEN","nonsense"],

  ["POMEGRANATE","Tiny jewel seeds"],["PINEAPPLE","Spiky on the outside"],["STRAWBERRY","Plot twist fruit"],
  ["RASPBERRY","Tiny bumpy snack"],["AVOCADO","Green toast superstar"],["BROCCOLI","Tiny tree veggie"],
  ["ZUCCHINI","Green summer squash"],["CAULIFLOWER","Tries to be pizza crust"],

  ["SAXOPHONE","Jazz tube"],["TROMBONE","The slidey one"],["CLARINET","Squeaky-but-classy"],
  ["XYLOPHONE","Musical wooden stairs"],["TUBA","Big brass = big power"],["TRUMPET","The loud shiny one"]
];

// --- Flipped hangman: pole left, person right ---
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

function playClip(a) {
  if (!a) return;
  a.pause();
  a.currentTime = 0;
  a.play().catch(() => {});
}

function pickWord() {
  const [w, h] = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = w.toUpperCase();
  hint = h;
}

function maskedWord() {
  return answer.split("").map(ch => (guessed.has(ch) ? ch : "_")).join(" ");
}

function didWin() {
  for (const ch of answer) if (!guessed.has(ch)) return false;
  return true;
}

function updateMessage() {
  if (!gameOver) {
    elMessage.textContent = "Make a guess ✨";
    return;
  }
  if (didWin()) {
    elMessage.innerHTML = `<span class="win">SLAY 💅 You got it!</span> Tap <b>New word</b> to keep going.`;
  } else {
    elMessage.innerHTML = `<span class="lose">Nooo 😭</span> The word was <b>${answer}</b>. Tap <b>New word</b>.`;
  }
}

function burstConfetti() {
  if (!elConfetti) return;
  elConfetti.innerHTML = "";
  const colors = ["#ff5fa2","#7cdbff","#ffd54d","#7cf0b1","#a78bfa","#ff8a5b"];
  const width = elConfetti.clientWidth || 600;
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("div");
    p.className = "confettiPiece";
    p.style.left = `${Math.floor(Math.random() * width)}px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = `${6 + Math.floor(Math.random()*6)}px`;
    p.style.height = `${8 + Math.floor(Math.random()*10)}px`;
    p.style.animationDuration = `${650 + Math.floor(Math.random()*350)}ms`;
    const drift = -40 + Math.floor(Math.random()*80);
    p.animate(
      [{ transform: "translateY(0) rotate(0deg)" },
       { transform: `translate(${drift}px, 520px) rotate(240deg)` }],
      { duration: 650 + Math.floor(Math.random()*350), easing: "ease-out", fill: "forwards" }
    );
    elConfetti.appendChild(p);
  }
  setTimeout(() => { elConfetti.innerHTML = ""; }, 1100);
}

function render() {
  elWord.textContent = maskedWord();
  elGuessed.textContent = [...guessed].sort().join(" ") || "—";
  elWrong.textContent = String(wrong);
  elLives.textContent = String(MAX_WRONG - wrong);
  elHint.textContent = hint;
  elScore.textContent = `${wins} of ${played}`;
  if (elHangmanArt) elHangmanArt.textContent = HANGMAN_FRAMES[wrong];
  updateMessage();

  // disable keys
  const buttons = elKeyboard.querySelectorAll("button.key");
  buttons.forEach(btn => {
    const l = btn.dataset.letter;
    btn.disabled = gameOver || guessed.has(l);
  });
}

function finalizeRoundIfNeeded(wasGameOver) {
  if (wasGameOver || !gameOver) return;
  played += 1;
  if (didWin()) {
    wins += 1;
    burstConfetti();
    playClip(sfxWin);
  } else {
    playClip(sfxLose);
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

  if (didWin() || wrong >= MAX_WRONG) gameOver = true;
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

function buildKeyboard() {
  elKeyboard.innerHTML = "";
  const rows = ["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
  rows.forEach((rowStr, idx) => {
    const row = document.createElement("div");
    row.className = `kbdRow row${idx + 1}`;
    rowStr.split("").forEach(l => {
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

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  guessLetter(e.key);
});

if (elReset) elReset.addEventListener("click", resetGame);

buildKeyboard();
resetGame();

console.log("Hangman loaded ✅");
