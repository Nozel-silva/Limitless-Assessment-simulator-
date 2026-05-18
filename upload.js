// ── State ──
let parsedQuestions = [];
let currentQ        = 0;
let answers         = [];
let timerInterval   = null;
let secondsLeft     = 0;
let startTime       = null;
let customMinutes   = 30;

// ── DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  setupDropZone();
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  document.getElementById('timerInput').addEventListener('input', (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 180) val = 180;
    customMinutes = val;
  });
});

// ── Drop zone ──
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

// ── Process file — extract text then send to Claude ──
async function processFile(file) {
  clearError();

  if (!file.name.match(/\.(docx|doc|txt|pdf)$/i)) {
    showError('❌ Please upload a Word (.docx/.doc), plain text (.txt), or PDF (.pdf) file.');
    return;
  }

  // Show loading state on drop zone
  showLoadingState('📄 Reading file...');

  try {
    let rawText = '';

    if (file.name.match(/\.(docx|doc)$/i)) {
      // Use mammoth for Word docs
      const arrayBuffer = await file.arrayBuffer();
      const result      = await mammoth.extractRawText({ arrayBuffer });
      rawText           = result.value;
    } else if (file.name.match(/\.txt$/i)) {
      // Plain text — read directly
      rawText = await file.text();
    } else if (file.name.match(/\.pdf$/i)) {
      showError('❌ PDF parsing is not supported in browser mode. Please use a .docx or .txt file.');
      resetLoadingState();
      return;
    }

    if (!rawText.trim()) {
      showError('❌ The file appears to be empty or could not be read.');
      resetLoadingState();
      return;
    }

    // Send to Claude for parsing
    showLoadingState('🤖 AI is reading your questions...');
    const questions = await parseWithClaude(rawText);

    if (!questions || questions.length === 0) {
      showError('❌ No questions could be found in this file. Make sure it contains questions with answer options.');
      resetLoadingState();
      return;
    }

    parsedQuestions = questions;

    // Show file preview
    document.getElementById('filePreview').classList.add('visible');
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileMeta').textContent =
      `${questions.length} question${questions.length !== 1 ? 's' : ''} found  •  ${(file.size / 1024).toFixed(1)} KB`;

    // Show timer
    document.getElementById('timerSetting').classList.add('visible');
    resetLoadingState();
    updateStartBtn();

  } catch (err) {
    console.error(err);
    showError('❌ Something went wrong while processing the file. Please try again.');
    resetLoadingState();
  }
}

// ── Claude API parser ──
async function parseWithClaude(rawText) {
  const prompt = `You are a question parser. I will give you raw text extracted from a document. 
Your job is to find ALL the questions and their answer options inside it, no matter the format or layout.

The text may be messy, inconsistently formatted, use different numbering styles, bullet points, letters, numbers, or no markers at all. 
You must figure it out intelligently.

Return ONLY a valid JSON array, nothing else — no explanation, no markdown, no code fences.

Each item in the array must follow this exact shape:
{
  "question": "The question text here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "answer": 1
}

Rules:
- "options" is an array of strings (the answer choices). Include all options found, minimum 2.
- "answer" is the zero-based INDEX of the correct option (0 = first option, 1 = second, etc.)
- If no correct answer is indicated in the text, set "answer" to null
- Clean up any numbering or lettering from the option text itself (e.g. "A. Lagos" becomes "Lagos")
- Do not include any text that is not a question or option (instructions, headings, page numbers, etc.)
- If the document has no recognisable questions at all, return an empty array: []

Here is the raw text:
---
${rawText.slice(0, 12000)}
---`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages:   [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Claude API error');
  }

  const data       = await response.json();
  const textBlock  = data.content.find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text in Claude response');

  // Strip any accidental markdown fences just in case
  const clean = textBlock.text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(clean);
}

// ── Loading state helpers ──
function showLoadingState(msg) {
  const zone = document.getElementById('dropZone');
  zone.innerHTML = `
    <div class="drop-icon">⏳</div>
    <div class="drop-title">${msg}</div>
    <div class="drop-sub">Please wait...</div>
  `;
  zone.style.pointerEvents = 'none';
}

function resetLoadingState() {
  const zone = document.getElementById('dropZone');
  zone.style.pointerEvents = '';
  zone.innerHTML = `
    <div class="drop-icon">📄</div>
    <div class="drop-title">Drag & drop your file here</div>
    <div class="drop-sub">or</div>
    <label class="file-label" for="fileInput">Browse File</label>
    <input type="file" id="fileInput" accept=".docx,.doc,.txt" hidden />
    <div class="drop-hint">Word (.docx/.doc) or plain text (.txt) supported</div>
  `;
  // Re-attach file input listener since we rebuilt the DOM
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

// ── Remove file ──
function removeFile() {
  parsedQuestions = [];
  document.getElementById('filePreview').classList.remove('visible');
  document.getElementById('timerSetting').classList.remove('visible');
  clearError();
  updateStartBtn();
}

// ── Timer controls ──
function adjustTimer(delta) {
  const input = document.getElementById('timerInput');
  let val = parseInt(input.value) + delta;
  val = Math.max(1, Math.min(180, val));
  input.value   = val;
  customMinutes = val;
}

function setTimer(mins) {
  document.getElementById('timerInput').value = mins;
  customMinutes = mins;
}

// ── Start button ──
function updateStartBtn() {
  const btn = document.getElementById('startBtn');
  if (parsedQuestions.length > 0) {
    btn.disabled    = false;
    btn.textContent = `Start Test — ${parsedQuestions.length} Questions →`;
  } else {
    btn.disabled    = true;
    btn.textContent = 'Upload a file to begin';
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
  if      (secondsLeft <= 60)                        box.classList.add('danger');
  else if (secondsLeft <= customMinutes * 60 * 0.25) box.classList.add('warning');
}

// ── Render question ──
function renderQuestion() {
  const q       = parsedQuestions[currentQ];
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  document.getElementById('qNum').textContent     = `Question ${currentQ + 1}`;
  document.getElementById('qCurrent').textContent = currentQ + 1;
  document.getElementById('qText').textContent    = q.question;
  document.getElementById('progressFill').style.width =
    `${(currentQ / parsedQuestions.length) * 100}%`;

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
  nextBtn.textContent = currentQ === parsedQuestions.length - 1 ? 'Finish ✓' : 'Next →';
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
    if      (answers[i] === null)        skipped++;
    else if (q.answer === null)          noKey++;
    else if (answers[i] === q.answer)    correct++;
    else                                 wrong++;
  });

  const gradeable = parsedQuestions.length - noKey;
  const pct       = gradeable > 0 ? Math.round((correct / gradeable) * 100) : null;

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

  let emoji, title, sub;
  if      (pct === null) { emoji = '📋'; title = 'Test Complete!';    sub = 'No answer keys found — review your responses below.'; }
  else if (pct >= 80)    { emoji = '🏆'; title = 'Outstanding!';      sub = "You're well prepared. Keep it up!"; }
  else if (pct >= 60)    { emoji = '👍'; title = 'Good Job!';          sub = "Solid performance. A little more and you'll ace it."; }
  else if (pct >= 40)    { emoji = '📚'; title = 'Keep Practising!';   sub = "You're getting there. Review below and retake."; }
  else                   { emoji = '💪'; title = "Don't Give Up!";      sub = "Every attempt makes you better. Try again!"; }

  document.getElementById('resultEmoji').textContent = emoji;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent   = sub;
  document.getElementById('rCorrect').textContent    = pct !== null ? correct : '—';
  document.getElementById('rWrong').textContent      = pct !== null ? wrong   : '—';
  document.getElementById('rSkipped').textContent    = skipped;
  document.getElementById('rTime').textContent       = `${usedMins}m ${usedSecs}s`;

  if (noKey > 0) {
    const note = document.getElementById('noAnswerNote');
    note.textContent = `ℹ️ ${noKey} question${noKey > 1 ? 's' : ''} had no answer key and ${noKey > 1 ? 'were' : 'was'} excluded from scoring.`;
    note.classList.add('visible');
  }

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

function toggleGuide() {
  const body  = document.getElementById('guideBody');
  const arrow = document.getElementById('guideArrow');
  const open  = body.classList.toggle('open');
  arrow.textContent = open ? '▲' : '▼';
}

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
