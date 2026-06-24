// ── Supabase config ──
const SUPABASE_URL = 'https://ccmsjcnuyrngqxwrswfe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjbXNqY251eXJuZ3F4d3Jzd2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjU2MjgsImV4cCI6MjA2NzIwMTYyOH0.dkjCo2bgDMf923VKESkyMLsULo7IhmsYb6r-4Dn6SRY';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ── Inactivity timeout — 30 mins ──
const INACTIVITY_LIMIT = 30 * 60 * 1000;
let inactivityTimer = null;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    clearSession();
    alert('⏰ You have been signed out due to inactivity.');
    window.location.href = 'index.html';
  }, INACTIVITY_LIMIT);
}

function startInactivityWatcher() {
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    .forEach(evt => document.addEventListener(evt, resetInactivityTimer));
  resetInactivityTimer();
}

// ── Session ──
function checkSession() {
  const email = localStorage.getItem('pt_current_user');
  if (email) {
    showProfileChip(email);
    document.getElementById('navGetStarted').style.display = 'none';
    startInactivityWatcher();
  }
}

function showProfileChip(email) {
  const chip = document.getElementById('profileChip');
  chip.style.display = 'flex';
  document.getElementById('profileEmail').textContent = email;
  document.getElementById('navGetStarted').style.display = 'none';
}

function clearSession() {
  localStorage.removeItem('pt_current_user');
  clearTimeout(inactivityTimer);
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

    localStorage.setItem('pt_current_user', email);
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
    document.getElementById('cookieBanner').style.display = 'flex';
  }
}

function acceptCookies() {
  localStorage.setItem('pt_cookies_accepted', 'true');
  document.getElementById('cookieBanner').classList.add('hidden');
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  initCookieBanner();
});




const { data: { user } } = await supabase.auth.getUser();

await supabase
  .from('users')
  .update({ last_seen: new Date().toISOString() })
  .eq('id', user.id);
