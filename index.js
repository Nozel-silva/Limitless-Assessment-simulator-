// ── Supabase config ──
const SUPABASE_URL      = 'https://ccmsjcnuyrngqxwrswfe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY ';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Session: 30 minutes in ms ──
const SESSION_DURATION = 30 * 60 * 1000;
let sessionInterval = null;

// ── On page load — check existing session ──
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
});

function checkSession() {
  const email     = localStorage.getItem('pt_current_user');
  const expiresAt = parseInt(localStorage.getItem('pt_session_expires') || '0');
  const now       = Date.now();

  if (email && expiresAt > now) {
    showProfileChip(email, expiresAt);
    document.getElementById('navGetStarted').style.display = 'none';
  } else if (email) {
    // Session expired
    clearSession();
  }
}

function showProfileChip(email, expiresAt) {
  const chip = document.getElementById('profileChip');
  chip.style.display = 'flex';
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('navGetStarted').style.display = 'none';
  startSessionCountdown(expiresAt);
}

function startSessionCountdown(expiresAt) {
  clearInterval(sessionInterval);
  updateCountdown(expiresAt);
  sessionInterval = setInterval(() => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) {
      clearInterval(sessionInterval);
      clearSession();
      alert('⏰ Your session has expired. Please sign in again.');
      location.reload();
    } else {
      updateCountdown(expiresAt);
    }
  }, 1000);
}

function updateCountdown(expiresAt) {
  const remaining = Math.max(0, expiresAt - Date.now());
  const m = Math.floor(remaining / 60000).toString().padStart(2, '0');
  const s = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');
  const el = document.getElementById('sessionTimer');
  if (el) el.textContent = `${m}:${s}`;
}

function clearSession() {
  localStorage.removeItem('pt_current_user');
  localStorage.removeItem('pt_session_expires');
  clearInterval(sessionInterval);
  const chip = document.getElementById('profileChip');
  if (chip) chip.style.display = 'none';
  const btn = document.getElementById('navGetStarted');
  if (btn) btn.style.display = 'inline-block';
}

function logout() {
  clearSession();
  location.reload();
}

// ── Modal ──
function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  setTimeout(() => document.getElementById('emailInput').focus(), 300);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  resetModal();
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function resetModal() {
  document.getElementById('emailInput').value = '';
  document.getElementById('emailInput').classList.remove('error');
  document.getElementById('emailError').classList.remove('show');
  document.getElementById('statusMsg').className = 'status-msg';
  document.getElementById('statusMsg').textContent = '';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('submitBtn').textContent = 'Continue to Practice →';
}

function clearError() {
  document.getElementById('emailInput').classList.remove('error');
  document.getElementById('emailError').classList.remove('show');
}

function handleEnter(e) {
  if (e.key === 'Enter') handleAuth();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleAuth() {
  const emailInput = document.getElementById('emailInput');
  const email      = emailInput.value.trim().toLowerCase();
  const statusMsg  = document.getElementById('statusMsg');
  const submitBtn  = document.getElementById('submitBtn');

  if (!isValidEmail(email)) {
    emailInput.classList.add('error');
    document.getElementById('emailError').classList.add('show');
    return;
  }

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Checking...';

  try {
    const { data: existing, error: selectError } = await db
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      statusMsg.className   = 'status-msg info';
      statusMsg.textContent = '👋 Welcome back! Redirecting you to practice...';
    } else {
      const { error: insertError } = await db
        .from('users')
        .insert({ email });
      if (insertError) throw insertError;
      statusMsg.className   = 'status-msg success';
      statusMsg.textContent = '✅ Account created! Redirecting you to practice...';
    }

    // Save session
    const expiresAt = Date.now() + SESSION_DURATION;
    localStorage.setItem('pt_current_user', email);
    localStorage.setItem('pt_session_expires', expiresAt.toString());

    setTimeout(() => { window.location.href = 'practice.html'; }, 1500);

  } catch (err) {
    console.error('Supabase error:', err);
    statusMsg.className   = 'status-msg error-s';
    statusMsg.textContent = '❌ Something went wrong. Check your connection and try again.';
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Continue to Practice →';
  }
}


// ── Cookie consent ──
function initCookieBanner() {
  const accepted = localStorage.getItem('pt_cookies_accepted');
  if (!accepted) {
    document.getElementById('cookieBanner').classList.remove('hidden');
  } else {
    document.getElementById('cookieBanner').classList.add('hidden');
  }
}

function acceptCookies() {
  localStorage.setItem('pt_cookies_accepted', 'true');
  document.getElementById('cookieBanner').classList.add('hidden');
}

// Call on DOM ready — add this inside your existing DOMContentLoaded
// or just call it directly at the bottom of index.js
document.addEventListener('DOMContentLoaded', () => {
  initCookieBanner();
  checkSession();
});
