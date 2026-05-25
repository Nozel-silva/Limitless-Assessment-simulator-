// ── Inactivity timeout ──
const INACTIVITY_LIMIT = 30 * 60 * 1000;
let inactivityTimer = null;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    localStorage.removeItem('pt_current_user');
    alert('⏰ You have been signed out due to inactivity.');
    window.location.href = 'index.html';
  }, INACTIVITY_LIMIT);
}

function startInactivityWatcher() {
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    .forEach(evt => document.addEventListener(evt, resetInactivityTimer));
  resetInactivityTimer();
}

// ── Session guard ──
function checkSession() {
  const email = localStorage.getItem('pt_current_user');
  if (!email) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('profileEmail').textContent = email;
  startInactivityWatcher();
}

function logout() {
  clearTimeout(inactivityTimer);
  localStorage.removeItem('pt_current_user');
  window.location.href = 'index.html';
}

// Run on load
checkSession();

// ── State ──
let selectedQuestions = 30;
let selectedMinutes   = 12;
let testQuestions     = [];
let currentQ          = 0;
let answers           = [];
let timerInterval     = null;
let secondsLeft       = 0;
let startTime         = null;

// ── Mode selection ──
function selectMode(questions, minutes) {
  selectedQuestions = questions;
  selectedMinutes   = minutes;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`mode-${questions}`).classList.add('selected');
  const btn = document.getElementById('startBtn');
  btn.disabled    = false;
  btn.textContent = `Start ${questions}-Question Test (${minutes} min) →`;
}

// ── Shuffle ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Start test ──
function startTest() {
  testQuestions = shuffle(QUESTION_BANK).slice(0, selectedQuestions);
  answers       = new Array(testQuestions.length).fill(null);
  currentQ      = 0;
  secondsLeft   = selectedMinutes * 60;
  startTime     = Date.now();

  showScreen('testScreen');
  document.getElementById('qTotal').textContent = testQuestions.length;
  renderQuestion();
  startTimer();
}

// ── Timer ──
function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimerDisplay();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const s = (secondsLeft % 60).toString().padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;

  const box = document.getElementById('timerBox');
  box.className = 'timer-box';
  if      (secondsLeft <= 60)                          box.classList.add('danger');
  else if (secondsLeft <= selectedMinutes * 60 * 0.25) box.classList.add('warning');
}

// ── Render question ──
function renderQuestion() {
  const q       = testQuestions[currentQ];
  const letters = ['A', 'B', 'C', 'D'];

  document.getElementById('qNum').textContent     = `Question ${currentQ + 1}`;
  document.getElementById('qCurrent').textContent = currentQ + 1;
  document.getElementById('qText').textContent    = q.question;
  document.getElementById('progressFill').style.width =
    `${(currentQ / testQuestions.length) * 100}%`;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn     = document.createElement('button');
    btn.className = 'option-btn' + (answers[currentQ] === i ? ' selected' : '');
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span>${opt}`;
    btn.onclick   = () => selectAnswer(i);
    container.appendChild(btn);
  });

  const nextBtn       = document.getElementById('nextBtn');
  nextBtn.disabled    = answers[currentQ] === null;
  const isLast        = currentQ === testQuestions.length - 1;
  nextBtn.textContent = isLast ? 'Finish ✓' : 'Next →';
}

function selectAnswer(idx) {
  answers[currentQ] = idx;
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === idx);
  });
  document.getElementById('nextBtn').disabled = false;
}

function skipQuestion() {
  answers[currentQ] = null;
  nextQuestion();
}

function nextQuestion() {
  if (currentQ < testQuestions.length - 1) {
    currentQ++;
    const card = document.getElementById('qCard');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
    renderQuestion();
  } else {
    submitTest();
  }
}

function confirmSubmit() {
  if (confirm('Are you sure you want to submit the test now?')) submitTest();
}

function autoSubmit() {
  alert('⏰ Time is up! Your test has been submitted automatically.');
  submitTest();
}

// ── Submit & Results ──
function submitTest() {
  clearInterval(timerInterval);
  const timeUsed = Math.floor((Date.now() - startTime) / 1000);
  const usedMins = Math.floor(timeUsed / 60);
  const usedSecs = timeUsed % 60;

  let correct = 0, wrong = 0, skipped = 0;
  testQuestions.forEach((q, i) => {
    if      (answers[i] === null)      skipped++;
    else if (answers[i] === q.answer)  correct++;
    else                               wrong++;
  });

  const pct  = Math.round((correct / testQuestions.length) * 100);
  const ring = document.getElementById('scoreRing');
  ring.className = 'score-ring ' + (pct >= 70 ? 'great' : pct >= 50 ? 'good' : 'poor');

  document.getElementById('scoreNum').textContent = `${correct}/${testQuestions.length}`;
  document.getElementById('scorePct').textContent = `${pct}%`;

  let emoji, title, sub;
  if      (pct >= 80) { emoji = '🏆'; title = 'Outstanding!';      sub = "You're well prepared. Keep this up!"; }
  else if (pct >= 60) { emoji = '👍'; title = 'Good Job!';          sub = "Solid performance. A little more and you'll ace it."; }
  else if (pct >= 40) { emoji = '📚'; title = 'Keep Practising!';   sub = "You're getting there. Review below and retake."; }
  else                { emoji = '💪'; title = "Don't Give Up!";      sub = "Every attempt makes you better. Try again!"; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent   = sub;
  document.getElementById('rCorrect').textContent    = correct;
  document.getElementById('rWrong').textContent      = wrong;
  document.getElementById('rSkipped').textContent    = skipped;
  document.getElementById('rTime').textContent       = `${usedMins}m ${usedSecs}s`;

  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  testQuestions.forEach((q, i) => {
    const userAns   = answers[i];
    const isCorrect = userAns === q.answer;
    const isSkipped = userAns === null;
    const cls       = isSkipped ? 'skipped-r' : isCorrect ? 'correct-r' : 'wrong-r';

    const item = document.createElement('div');
    item.className = `review-item ${cls}`;

    let html = `<div class="review-q">Q${i + 1}. ${q.question}</div><div class="review-answers">`;

    if (isSkipped) {
      html += `<div class="review-ans skipped-ans">⏭ You skipped this question</div>`;
      html += `<div class="review-ans correct-ans">✅ Correct answer: ${letters[q.answer]}. ${q.options[q.answer]}</div>`;
    } else if (isCorrect) {
      html += `<div class="review-ans your-ans ok">✅ Your answer: ${letters[userAns]}. ${q.options[userAns]}</div>`;
    } else {
      html += `<div class="review-ans your-ans">❌ Your answer: ${letters[userAns]}. ${q.options[userAns]}</div>`;
      html += `<div class="review-ans correct-ans">✅ Correct: ${letters[q.answer]}. ${q.options[q.answer]}</div>`;
    }

    html += '</div>';
    item.innerHTML = html;
    reviewList.appendChild(item);
  });

  showScreen('resultsScreen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Navigation ──
function retakeTest() {
  startTest();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSelect() {
  showScreen('selectScreen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
