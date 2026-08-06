// Game State Variables
const TARGET_SCORE = 5;
let playerScore = 0;
let computerScore = 0;
let roundNumber = 1;
let wins = 0;
let losses = 0;
let draws = 0;
let gameActive = true;
let isCountingDown = false;

const choices = {
  rock: { icon: '✊', beats: 'scissors' },
  paper: { icon: '✋', beats: 'rock' },
  scissors: { icon: '✌️', beats: 'paper' }
};

// DOM References
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const roundNumEl = document.getElementById('round-num');
const playerBadge = document.getElementById('player-badge');
const computerBadge = document.getElementById('computer-badge');
const statusText = document.getElementById('status-text');

const timerDisplay = document.getElementById('timer-display');
const vsLabel = document.getElementById('vs-label');
const choiceBtns = document.querySelectorAll('.choice-btn');

const statWins = document.getElementById('stat-wins');
const statLosses = document.getElementById('stat-losses');
const statDraws = document.getElementById('stat-draws');
const statWinrate = document.getElementById('stat-winrate');
const historyList = document.getElementById('history-list');

const modalOverlay = document.getElementById('modal-overlay');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');

// Theme Toggle
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('theme-icon').textContent = isLight ? '🌙' : '☀️';
  document.getElementById('theme-text').textContent = isLight ? 'Dark Mode' : 'Light Mode';
});

// Play Round Logic with 3-Second Timer
function startRoundSequence(playerChoice) {
  if (!gameActive || isCountingDown) return;

  isCountingDown = true;
  setButtonsState(false);

  // Reset badges and show player choice locked-in
  playerBadge.textContent = choices[playerChoice].icon;
  computerBadge.textContent = '❓';

  let countdown = 3;
  timerDisplay.textContent = countdown;
  timerDisplay.classList.remove('hidden');
  vsLabel.classList.add('hidden');

  statusText.textContent = `Get ready... Revealing choice in ${countdown}...`;
  statusText.style.color = 'var(--text-main)';

  const timerInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      timerDisplay.textContent = countdown;
      statusText.textContent = `Get ready... Revealing choice in ${countdown}...`;
    } else {
      clearInterval(timerInterval);
      timerDisplay.classList.add('hidden');
      vsLabel.classList.remove('hidden');
      isCountingDown = false;
      setButtonsState(true);
      evaluateRoundResult(playerChoice);
    }
  }, 1000);
}

function evaluateRoundResult(playerChoice) {
  const choiceKeys = Object.keys(choices);
  const computerChoice = choiceKeys[Math.floor(Math.random() * choiceKeys.length)];

  computerBadge.textContent = choices[computerChoice].icon;

  let result = '';
  if (playerChoice === computerChoice) {
    result = 'draw';
    draws++;
    statusText.textContent = `🤝 Round Draw! Both chose ${playerChoice.toUpperCase()}`;
    statusText.style.color = 'var(--accent-yellow)';
  } else if (choices[playerChoice].beats === computerChoice) {
    result = 'win';
    playerScore++;
    wins++;
    statusText.textContent = `🎉 You Win! ${playerChoice.toUpperCase()} beats ${computerChoice.toUpperCase()}`;
    statusText.style.color = 'var(--success-color)';
  } else {
    result = 'loss';
    computerScore++;
    losses++;
    statusText.textContent = `😞 You Lose! ${computerChoice.toUpperCase()} beats ${playerChoice.toUpperCase()}`;
    statusText.style.color = 'var(--danger-color)';
  }

  updateUI();
  addHistoryRecord(roundNumber, playerChoice, computerChoice, result);

  if (playerScore === TARGET_SCORE || computerScore === TARGET_SCORE) {
    gameActive = false;
    setTimeout(() => triggerMatchEnd(playerScore === TARGET_SCORE), 400);
  } else {
    roundNumber++;
    roundNumEl.textContent = roundNumber;
  }
}

function setButtonsState(enabled) {
  choiceBtns.forEach(btn => btn.disabled = !enabled);
}

function updateUI() {
  playerScoreEl.textContent = String(playerScore).padStart(2, '0');
  computerScoreEl.textContent = String(computerScore).padStart(2, '0');

  statWins.textContent = wins;
  statLosses.textContent = losses;
  statDraws.textContent = draws;

  const totalRounds = wins + losses + draws;
  const rate = totalRounds === 0 ? 0 : Math.round((wins / totalRounds) * 100);
  statWinrate.textContent = `${rate}%`;
}

function addHistoryRecord(round, pChoice, cChoice, outcome) {
  const row = document.createElement('div');
  row.className = 'history-row';

  let outcomeSymbol = '• Draw';
  let outcomeClass = 'outcome-draw';

  if (outcome === 'win') {
    outcomeSymbol = '✓ Win';
    outcomeClass = 'outcome-win';
  } else if (outcome === 'loss') {
    outcomeSymbol = '✕ Loss';
    outcomeClass = 'outcome-loss';
  }

  row.innerHTML = `
    <span>Round ${round}</span>
    <span>${choices[pChoice].icon} ${pChoice} ⚡ ${choices[cChoice].icon} ${cChoice}</span>
    <span class="${outcomeClass}">${outcomeSymbol}</span>
  `;

  historyList.prepend(row);
}

function triggerMatchEnd(isWinner) {
  if (isWinner) {
    modalIcon.textContent = '🏆';
    modalTitle.textContent = 'YOU ARE THE CHAMPION!';
    modalDesc.textContent = `You won the match ${playerScore} - ${computerScore}! Excellent gameplay.`;
    launchConfetti();
  } else {
    modalIcon.textContent = '🤖';
    modalTitle.textContent = 'GAME OVER!';
    modalDesc.textContent = `The computer won the match ${computerScore} - ${playerScore}. Better luck next time!`;
  }
  modalOverlay.classList.add('active');
}

function resetMatch() {
  playerScore = 0;
  computerScore = 0;
  roundNumber = 1;
  gameActive = true;
  isCountingDown = false;
  setButtonsState(true);
  
  roundNumEl.textContent = roundNumber;
  playerBadge.textContent = '❓';
  computerBadge.textContent = '❓';
  timerDisplay.classList.add('hidden');
  vsLabel.classList.remove('hidden');
  
  statusText.textContent = 'Choose Rock, Paper, or Scissors to Start!';
  statusText.style.color = 'var(--text-main)';
  modalOverlay.classList.remove('active');
  updateUI();
}

function resetAll() {
  resetMatch();
  wins = 0;
  losses = 0;
  draws = 0;
  historyList.innerHTML = '';
  updateUI();
}

// Event Listeners
choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.getAttribute('data-choice');
    startRoundSequence(choice);
  });
});

document.getElementById('new-match-btn').addEventListener('click', resetMatch);
document.getElementById('reset-score-btn').addEventListener('click', resetAll);
document.getElementById('modal-play-again').addEventListener('click', resetMatch);

// Keyboard Controls
document.addEventListener('keydown', (e) => {
  if (isCountingDown) return;
  const key = e.key.toLowerCase();
  if (key === 'r') startRoundSequence('rock');
  if (key === 'p') startRoundSequence('paper');
  if (key === 's') startRoundSequence('scissors');
});

// Confetti Engine
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function launchConfetti() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  particles = [];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      size: Math.random() * 6 + 4,
      color: ['#3b82f6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)],
      life: 100
    });
  }
  requestAnimationFrame(renderConfetti);
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let active = false;

  particles.forEach(p => {
    if (p.life > 0) {
      active = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  });

  if (active) requestAnimationFrame(renderConfetti);
}