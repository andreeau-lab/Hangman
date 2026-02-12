// (word list + hangman frames unchanged for brevity)

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
const elConfetti = document.getElementById("confetti");

const sfxWin = document.getElementById("sfxWin");
const sfxLose = document.getElementById("sfxLose");

function playClip(el) {
  if (!el) return;
  el.pause();
  el.currentTime = 0;
  el.play().catch(() => {});
}

function burstConfetti() {
  elConfetti.innerHTML = "";
  const colors = ["#ff5fa2", "#7cdbff", "#ffd54d", "#7cf0b1", "#a78bfa"];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("div");
    p.className = "confettiPiece";
    p.style.left = `${Math.random() * 100}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    elConfetti.appendChild(p);
  }
  setTimeout(() => (elConfetti.innerHTML = ""), 1000);
}

function finalizeRound(win) {
  played++;
  if (win) {
    wins++;
    burstConfetti();
    playClip(sfxWin);
  } else {
    playClip(sfxLose);
  }
}

function resetGame() {
  const choice = WORDS[Math.floor(Math.random() * WORDS.length)];
  answer = choice.word;
  hint = choice.hint;
  guessed = new Set();
  wrong = 0;
  gameOver = false;
  render();
}

function render() {
  elWord.textContent = answer
    .split("")
    .map(l => (guessed.has(l) ? l : "_"))
    .join(" ");
  elGuessed.textContent = [...guessed].join(" ") || "—";
  elWrong.textContent = wrong;
  elLives.textContent = MAX_WRONG - wrong;
  elHint.textContent = hint;
  elScore.textContent = `${wins} of ${played}`;
  elHangmanArt.textContent = HANGMAN_FRAMES[wrong];
}

function guess(letter) {
  if (gameOver || guessed.has(letter)) return;
  guessed.add(letter);

  if (!answer.includes(letter)) {
    wrong++;
    if (wrong >= MAX_WRONG) {
      gameOver = true;
      finalizeRound(false);
    }
  } else if (!answer.split("").some(l => !guessed.has(l))) {
    gameOver = true;
    finalizeRound(true);
  }
  render();
}

function buildKeyboard() {
  ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach(row => {
    const r = document.createElement("div");
    r.className = "kbdRow";
    row.split("").forEach(l => {
      const b = document.createElement("button");
      b.className = "key";
      b.textContent = l;
      b.onclick = () => guess(l);
      r.appendChild(b);
    });
    elKeyboard.appendChild(r);
  });
}

elReset.onclick = resetGame;
buildKeyboard();
resetGame();


