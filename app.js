// --- Word list (edit this freely) ---
const WORDS = [
  { word: "monetization", hint: "Value capture strategy" },
  { word: "packaging", hint: "How you bundle features into plans" },
  { word: "pricing", hint: "What customers pay" },
  { word: "marketplace", hint: "Where buyers and sellers meet" },
  { word: "seattle", hint: "A city in Washington State" },
  { word: "keyboard", hint: "You are using one right now" },
  { word: "hangman", hint: "This game" },
  { word: "espresso", hint: "Strong coffee drink" },
  { word: "whistler", hint: "BC ski destination" },
  { word: "maui", hint: "Hawaiian island" },
];

// --- Game state ---
let answer = "";
let hint = "";
let guessed = new Set();
let wrong = 0;
const MAX_WRONG = 6;
const HANGMAN_FRAMES = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,

`  +---+
  |   |
  O   |
      |
      |
      |
=========`,

`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,

`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,

`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,

`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,

`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========` 
];

let gameOver = false;

// --- Elements ---
const elWord = document.getElementById("wordDisplay");
const elGuessed = document.getElementById("guessed");
const elWrong = document.getElementById("wrong");
const elLives = document.getElementById("lives");
const elMessage = document.getElementById("message");
const elHint = document.getElementById("hint");
const elKeyboard = document.getElementById("keyboard");
const elReset = document.getElementById("resetBtn");
const elHangmanArt = document.getElementById("hangmanArt");


function pickWord() {
  const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = choice.word.toUpperCase();
  hint = choice.hint;
}

function maskedWord() {
  // show underscores for A-Z letters; keep other chars (like hyphens) visible
  return answer
    .split("")
    .map((ch) => {
      if (ch >= "A" && ch <= "Z") return guessed.has(ch) ? ch : "_";
      return ch;
    })
    .join(" ");
}

function render() {
  elWord.textContent = maskedWord();
  elHangmanArt.textContent = HANGMAN_FRAMES[wrong];


  const guessedList = [...guessed].sort().join(" ");
  elGuessed.textContent = guessedList.length ? guessedList : "—";

  elWrong.textContent = String(wrong);
  elLives.textContent = String(MAX_WRONG - wrong);
  elHint.textContent = hint;

  // message
  elMessage.innerHTML = "";
  if (gameOver) {
    if (didWin()) {
      elMessage.innerHTML = `<span class="win">You win!</span> Press <b>New word</b> to play again.`;
    } else {
      elMessage.innerHTML = `<span class="lose">You lose.</span> The word was <b>${answer}</b>. Press <b>New word</b>.`;
    }
  } else {
    elMessage.textContent = "Type a letter to guess.";
  }

  // disable used keys (and everything if game over)
  const buttons = elKeyboard.querySelectorAll("button.key");
  buttons.forEach((btn) => {
    const letter = btn.dataset.letter;
    btn.disabled = gameOver || guessed.has(letter);
  });
}

function didWin() {
  // all letters revealed
  for (const ch of answer) {
    if (ch >= "A" && ch <= "Z" && !guessed.has(ch)) return false;
  }
  return true;
}

function endIfNeeded() {
  if (didWin()) gameOver = true;
  if (wrong >= MAX_WRONG) gameOver = true;
}

function guessLetter(raw) {
  if (gameOver) return;

  const letter = raw.toUpperCase();

  // Only A-Z single letters
  if (letter.length !== 1 || letter < "A" || letter > "Z") return;
  if (guessed.has(letter)) return;

  guessed.add(letter);

  if (!answer.includes(letter)) {
    wrong += 1;
  }

  endIfNeeded();
  render();
}

function buildKeyboard() {
  elKeyboard.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  for (const l of letters) {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.type = "button";
    btn.textContent = l;
    btn.dataset.letter = l;
    btn.addEventListener("click", () => guessLetter(l));
    elKeyboard.appendChild(btn);
  }
}

function resetGame() {
  pickWord();
  guessed = new Set();
  wrong = 0;
  gameOver = false;
  render();
}

// Physical keyboard support
window.addEventListener("keydown", (e) => {
  // Ignore if user is holding modifier keys
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  guessLetter(e.key);
});

// Wire up
elReset.addEventListener("click", resetGame);

buildKeyboard();
resetGame();


