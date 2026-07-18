  // ── Cookie consent (self-contained, runs independently of index.js) ──
  function initCookieBanner() {
    const accepted = localStorage.getItem('pt_cookies_accepted');
    if (!accepted) {
      document.getElementById('cookieBanner').style.display = 'flex';
    }
  }

  function acceptCookies() {
    localStorage.setItem('pt_cookies_accepted', 'true');
    document.getElementById('cookieBanner').classList.add('hidden');
    document.getElementById('cookieBanner').style.display = 'none';
  }

  document.addEventListener('DOMContentLoaded', initCookieBanner);
