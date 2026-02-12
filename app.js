const WORDS = [
  { word: "AXOLOTL", hint: "Smiling amphibian" },
  { word: "CAPYBARA", hint: "Chill giant rodent" },
  { word: "NARWHAL", hint: "Unicorn of the sea" },
  { word: "CHAMELEON", hint: "Color-changing lizard" },
  { word: "SUNFLOWER", hint: "Tall, sunny plant" },
  { word: "POMEGRANATE", hint: "Tiny jewel seeds" },
  { word: "BROCCOLI", hint: "Tiny tree veggie" },
  { word: "ZUCCHINI", hint: "Green squash" },
  { word: "TAYLORSWIFT", hint: "Eras tour icon" },
  { word: "OLIVIARODRIGO", hint: "Sour / Guts" },
  { word: "BILLIEEILISH", hint: "Whisper-pop queen" },
  { word: "HOMEWORK", hint: "The classic villain" },
  { word: "CAFETERIA", hint: "Where mysteries live" },
  { word: "CRISPITOS", hint: "Best lunch" },
  { word: "SIXSEVEN", hint: "nonsense" },
  { word: "SAXOPHONE", hint: "Jazz tube" },
  { word: "TROMBONE", hint: "The slidey one" },
  { word: "CLARINET", hint: "Classy and squeaky" }
];

const HANGMAN_FRAMES = [
`  +----+
  |    
  |    
  |    
  |    
  |    
========`,
`  +----+
  |     O
  |    
  |    
  |    
  |    
========`,
`  +----+
  |     O
  |     |
  |    
  |    
  |    
========`,
`  +----+
  |     O
  |    /|
  |    
  |    
  |    
========`,
`  +----+
  |     O
  |    /|\\
  |    
  |    
  |    
========`,
`  +----+
  |     O
  |    /|\\
  |    / 
  |    
  |    
========`,
`  +----+
  |     O
  |    /|\\
  |    / \\
  |    
  |    
========`
];

const MAX_WRONG = 6;

let answer = "";
let hint = "";
let guessed = new Set();
let wrong = 0;
let gameOver = false;
let wins = 0;
let played = 0;

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

function playSound(good) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = good ? 800 : 220;
  g.gain.value = 0.15;
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.frequency.exponentialRampToValueAtTime(
    good ? 1200 : 120,
    ctx.currentTime + 0.25
  );
  o.stop(ctx.currentTime + 0.25);
}

function pickWord() {
  const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = choice.word;
  hint = choice.hint;
}

function maskedWord() {
  return answer
    .split("")
    .map(l => guessed.has(l) ? l : "_")
    .join(" ");
}

function render() {
  elWord.textContent = maskedWord();
  elGuessed.textContent = [...guessed].join(" ") || "—";
  elWrong.textContent = wrong;
  elLives.textContent = MAX_WRONG - wrong;
  elHint.textContent = hint;
  elScore.textContent = `${wins} of ${played}`;
  if (elHangmanArt) elHangmanArt.textContent = HANGMAN_FRAMES[wrong];
}

function endGame(win) {
  gameOver = true;
  played++;
  if (win) {
    wins++;
    elMessage.innerHTML = `<span class="win">You win!</span>`;
  } else {
    elMessage.innerHTML = `<span class="lose">You lose.</span> The word was ${answer}`;
  }
}

function guess(letter) {
  if (gameOver || guessed.has(letter)) return;
  guessed.add(letter);

  if (answer.includes(letter)) {
    playSound(true);
    if (!maskedWord().includes("_")) endGame(true);
  } else {
    playSound(false);
    wrong++;
    if (wrong >= MAX_WRONG) endGame(false);
  }
  render();
}

function resetGame() {
  pickWord();
  guessed = new Set();
  wrong = 0;
  gameOver = false;
  elMessage.textContent = "";
  render();
}

function buildKeyboard() {
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(l => {
    const b = document.createElement("button");
    b.textContent = l;
    b.className = "key";
    b.onclick = () => guess(l);
    elKeyboard.appendChild(b);
  });
}

window.addEventListener("keydown", e => {
  if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
    guess(e.key.toUpperCase());
  }
});

elReset.onclick = resetGame;

buildKeyboard();
resetGame();
