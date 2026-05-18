// ── localStorage "database" ──
function getUsers() {
  return JSON.parse(localStorage.getItem('pt_users') || '[]');
}

function saveUser(email) {
  const users = getUsers();
  if (!users.includes(email)) {
    users.push(email);
    localStorage.setItem('pt_users', JSON.stringify(users));
    return 'new';
  }
  return 'existing';
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

function handleAuth() {
  const emailInput = document.getElementById('emailInput');
  const email      = emailInput.value.trim().toLowerCase();
  const statusMsg  = document.getElementById('statusMsg');
  const submitBtn  = document.getElementById('submitBtn');

  if (!isValidEmail(email)) {
    emailInput.classList.add('error');
    document.getElementById('emailError').classList.add('show');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  setTimeout(() => {
    const status = saveUser(email);
    localStorage.setItem('pt_current_user', email);

    if (status === 'new') {
      statusMsg.className = 'status-msg success';
      statusMsg.textContent = '✅ Account created! Redirecting you to practice...';
    } else {
      statusMsg.className = 'status-msg info';
      statusMsg.textContent = '👋 Welcome back! Redirecting you to practice...';
    }

    setTimeout(() => { window.location.href = 'practice.html'; }, 1500);
  }, 800);
}
