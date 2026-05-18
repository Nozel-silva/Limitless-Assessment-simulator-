// ── State ──
let parsedQuestions = [];
let currentQ        = 0;
let answers         = [];
let timerInterval   = null;
let secondsLeft     = 0;
let startTime       = null;
let customMinutes   = 30;
let hasAnswerKeys   = false;

// ── DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  setupDropZone();
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
});

// ── Drop zone setup ──
function setupDropZone() {
  const zone = document.getElementById('dropZone');

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  });

  zone.addEventListener('click', () => document.getElementById('fileInput').click());
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

// ── Process uploaded file ──
function processFile(file) {
  clearError();

  // Validate file type
  if (!file.name.endsWith('.docx')) {
    showError('❌ Invalid file type. Please upload a <strong>.docx</strong> file (Microsoft Word).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    mammoth.extractRawText({ arrayBuffer: e.target.result })
      .then((result) => {
        const raw = result.value;
        const questions = parseQuestions(raw);

        if (questions.length === 0) {
          showError(
            '❌ Could not find any questions in this file. ' +
            'Please check the format guide below and make sure your document follows the required structure.'
          );
          return;
        }

        parsedQuestions = questions;
        hasAnswerKeys   = questions.some(q => q.answer !== null);

        // Show file preview
        const preview = document.getElementById('filePreview');
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileMeta').textContent =
          `${questions.length} question${questions.length !== 1 ? 's' : ''} found  •  ${(file.size / 1024).toFixed(1)} KB`;
        preview.classList.add('visible');

        // Show timer & enable start
        document.getElementById('timerSetting').classList.add('visible');
        updateStartBtn();
      })
      .catch(() => {
        showError('❌ Could not read this file. Make sure it is a valid .docx Word document.');
      });
  };
  reader.readAsArrayBuffer(file);
}

// ── Parse questions from raw text ──
function parseQuestions(text) {
  const questions = [];

  // Normalise line endings and split into lines
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Detect question line: starts with number + dot  e.g. "1." "12."
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (!qMatch) { i++; continue; }

    const questionText = qMatch[2].trim();
    const options      = [];
    let   answerIndex  = null;

    i++;
    // Collect options and answer line
    while (i < lines.length) {
      const l = lines[i].trim();

      // Option line: A. B. C. D.
      const optMatch = l.match(/^([A-Da-d])\.\s+(.+)/);
      if (optMatch) {
        options.push(optMatch[2].trim());
        i++;
        continue;
      }

      // Answer line: "Answer: B"
      const ansMatch = l.match(/^Answer\s*:\s*([A-Da-d])/i);
      if (ansMatch) {
        answerIndex = 'ABCD'.indexOf(ansMatch[1].toUpperCase());
        i++;
        continue;
      }

      // Blank line — end of this question block
      if (l === '') { i++; break; }

      // Non-matching line that isn't blank — could be next question, stop
      break;
    }

    // Only add if we have a question and at least 2 options
    if (questionText && options.length >= 2) {
      questions.push({
        question: questionText,
        options:  options,
        answer:   answerIndex   // null if no Answer: line provided
      });
    }
  }

  return questions;
}

// ── Remove file ──
function removeFile() {
  parsedQuestions = [];
  document.getElementById('filePreview').classList.remove('visible');
  document.getElementById('timerSetting').classList.remove('visible');
  document.getElementById('fileInput').value = '';
  clearError();
  updateStartBtn();
}

// ── Timer controls ──
function adjustTimer(delta) {
  const input = document.getElementById('timerInput');
  let val = parseInt(input.value) + delta;
  val = Math.max(1, Math.min(180, val));
  input.value = val;
  customMinutes = val;
}

function setTimer(mins) {
  document.getElementById('timerInput').value = mins;
  customMinutes = mins;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('timerInput').addEventListener('input', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 180) val = 180;
    customMinutes = val;
  });
});

// ── Start button state ──
function updateStartBtn() {
  const btn = document.getElementById('startBtn');
  if (parsedQuestions.length > 0) {
    btn.disabled     = false;
    btn.textContent  = `Start Test — ${parsedQuestions.length} Questions →`;
  } else {
    btn.disabled     = true;
    btn.textContent  = 'Upload a file to begin';
  }
}

// ── Begin test ──
function beginTest() {
  customMinutes = parseInt(document.getElementById('timerInput').value) || 30;
  currentQ      = 0;
  answers       = new Array(parsedQuestions.length).fill(null);
  secondsLeft   = customMinutes * 60;
  startTime     = Date.now();

  document.getElementById('qTotal').textContent = parsedQuestions.length;
  showScreen('testScreen');
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
  else if (secondsLeft <= customMinutes * 60 * 0.25)   box.classList.add('warning');
}

// ── Render question ──
function renderQuestion() {
  const q       = parsedQuestions[currentQ];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  document.getElementById('qNum').textContent      = `Question ${currentQ + 1}`;
  document.getElementById('qCurrent').textContent  = currentQ + 1;
  document.getElementById('qText').textContent     = q.question;
  document.getElementById('progressFill').style.width =
    `${(currentQ / parsedQuestions.length) * 100}%`;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';

  q.options.forEach((opt, i) => {
    const btn      = document.createElement('button');
    btn.className  = 'option-btn' + (answers[currentQ] === i ? ' selected' : '');
    btn.innerHTML  = `<span class="option-letter">${letters[i]}</span>${opt}`;
    btn.onclick    = () => selectAnswer(i);
    container.appendChild(btn);
  });

  const nextBtn       = document.getElementById('nextBtn');
  nextBtn.disabled    = answers[currentQ] === null;
  const isLast        = currentQ === parsedQuestions.length - 1;
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
  if (currentQ < parsedQuestions.length - 1) {
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

// ── Submit & results ──
function submitTest() {
  clearInterval(timerInterval);
  const timeUsed = Math.floor((Date.now() - startTime) / 1000);
  const usedMins = Math.floor(timeUsed / 60);
  const usedSecs = timeUsed % 60;

  let correct = 0, wrong = 0, skipped = 0, noKey = 0;

  parsedQuestions.forEach((q, i) => {
    if (answers[i] === null) {
      skipped++;
    } else if (q.answer === null) {
      noKey++;
    } else if (answers[i] === q.answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  const gradeable = parsedQuestions.length - noKey;
  const pct = gradeable > 0 ? Math.round((correct / gradeable) * 100) : null;

  // Score ring
  const ring = document.getElementById('scoreRing');
  if (pct === null) {
    ring.className = 'score-ring none';
    document.getElementById('scoreNum').textContent = `${parsedQuestions.length - skipped}`;
    document.getElementById('scorePct').textContent = 'answered';
  } else {
    ring.className = 'score-ring ' + (pct >= 70 ? 'great' : pct >= 50 ? 'good' : 'poor');
    document.getElementById('scoreNum').textContent = `${correct}/${gradeable}`;
    document.getElementById('scorePct').textContent = `${pct}%`;
  }

  // Title & emoji
  let emoji, title, sub;
  if (pct === null) {
    emoji = '📋'; title = 'Test Complete!';
    sub   = 'No answer keys were found in the file — review your responses below.';
  } else if (pct >= 80) {
    emoji = '🏆'; title = 'Outstanding!';       sub = "You're well prepared. Keep it up!";
  } else if (pct >= 60) {
    emoji = '👍'; title = 'Good Job!';           sub = "Solid performance. A little more and you'll ace it.";
  } else if (pct >= 40) {
    emoji = '📚'; title = 'Keep Practising!';    sub = "You're getting there. Review below and retake.";
  } else {
    emoji = '💪'; title = "Don't Give Up!";       sub = "Every attempt makes you better. Try again!";
  }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent   = sub;
  document.getElementById('rCorrect').textContent    = pct !== null ? correct  : '—';
  document.getElementById('rWrong').textContent      = pct !== null ? wrong    : '—';
  document.getElementById('rSkipped').textContent    = skipped;
  document.getElementById('rTime').textContent       = `${usedMins}m ${usedSecs}s`;

  // No answer key note
  if (noKey > 0) {
    const note = document.getElementById('noAnswerNote');
    note.textContent = `ℹ️ ${noKey} question${noKey > 1 ? 's' : ''} had no answer key — ${noKey > 1 ? 'they were' : 'it was'} excluded from scoring.`;
    note.classList.add('visible');
  }

  // Review
  buildReview();
  showScreen('resultsScreen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function buildReview() {
  const list    = document.getElementById('reviewList');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  list.innerHTML = '';

  parsedQuestions.forEach((q, i) => {
    const userAns   = answers[i];
    const isSkipped = userAns === null;
    const noKey     = q.answer === null;
    const isCorrect = !isSkipped && !noKey && userAns === q.answer;
    const isWrong   = !isSkipped && !noKey && userAns !== q.answer;

    const cls = isSkipped ? 'skipped-r'
              : noKey     ? 'no-ans-r'
              : isCorrect ? 'correct-r'
              :              'wrong-r';

    const item = document.createElement('div');
    item.className = `review-item ${cls}`;

    let html = `<div class="review-q">Q${i + 1}. ${q.question}</div><div class="review-answers">`;

    if (isSkipped) {
      html += `<div class="review-ans skipped-ans">⏭ Skipped</div>`;
      if (!noKey) html += `<div class="review-ans correct-ans">✅ Correct: ${letters[q.answer]}. ${q.options[q.answer]}</div>`;
    } else if (noKey) {
      html += `<div class="review-ans no-ans">📝 Your answer: ${letters[userAns]}. ${q.options[userAns]}</div>`;
      html += `<div class="review-ans no-ans">⚠️ No answer key provided</div>`;
    } else if (isCorrect) {
      html += `<div class="review-ans your-ans ok">✅ ${letters[userAns]}. ${q.options[userAns]}</div>`;
    } else {
      html += `<div class="review-ans your-ans">❌ Your answer: ${letters[userAns]}. ${q.options[userAns]}</div>`;
      html += `<div class="review-ans correct-ans">✅ Correct: ${letters[q.answer]}. ${q.options[q.answer]}</div>`;
    }

    html += '</div>';
    item.innerHTML = html;
    list.appendChild(item);
  });
}

// ── Navigation ──
function retakeTest() {
  currentQ    = 0;
  answers     = new Array(parsedQuestions.length).fill(null);
  secondsLeft = customMinutes * 60;
  startTime   = Date.now();
  document.getElementById('noAnswerNote').classList.remove('visible');
  showScreen('testScreen');
  renderQuestion();
  startTimer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToUpload() {
  clearInterval(timerInterval);
  document.getElementById('noAnswerNote').classList.remove('visible');
  showScreen('uploadScreen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Guide toggle ──
function toggleGuide() {
  const body  = document.getElementById('guideBody');
  const arrow = document.getElementById('guideArrow');
  const open  = body.classList.toggle('open');
  arrow.textContent = open ? '▲' : '▼';
}

// ── Error helpers ──
function showError(msg) {
  const el = document.getElementById('parseError');
  el.innerHTML = msg;
  el.classList.add('visible');
}

function clearError() {
  const el = document.getElementById('parseError');
  el.innerHTML = '';
  el.classList.remove('visible');
}
