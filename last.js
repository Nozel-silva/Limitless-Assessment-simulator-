const ACCESS_KEY = 'last_paystack_access';

  // ── Check referrer OR existing session flag ──
  // Referrer only works on the very first landing from Paystack.
  // Once granted, we store a session flag so reloads within the
  // same browser tab session keep working without redirecting.
  function hasValidAccess() {
    const fromReferrer = document.referrer.includes('https://paystack.shop/pay/pts');
    const fromSession   = sessionStorage.getItem(ACCESS_KEY) === 'true';

    if (fromReferrer) {
      sessionStorage.setItem(ACCESS_KEY, 'true');
      return true;
    }
    return fromSession;
  }

  // ── Animate progress bar ──
  function animateProgress(fillId, statusId, messages, onComplete) {
    const fill   = document.getElementById(fillId);
    const status = document.getElementById(statusId);
    let   pct    = 0;

    const interval = setInterval(() => {
      pct += Math.random() * 3 + 1;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        onComplete();
      }
      fill.style.width = pct + '%';
      const match = [...messages].reverse().find(m => pct >= m.at);
      if (match) status.innerHTML = match.msg;
    }, 120);
  }

  // ── Trigger download ──
  function triggerDownload(url, filename) {
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── Mark done ──
  function markDone(badgeId, spinnerId, textId, doneClass, doneText) {
    const badge   = document.getElementById(badgeId);
    const spinner = document.getElementById(spinnerId);
    const text    = document.getElementById(textId);
    spinner.style.display = 'none';
    badge.className = `status-badge ${doneClass}`;
    text.textContent = doneText;
  }

  // ── Main logic ──
  if (!hasValidAccess()) {
    window.location.href = 'https://paystack.shop/pay/pts';
  } else {
    window.addEventListener('DOMContentLoaded', () => {

      const videoMessages = [
        { at: 0,   msg: 'Connecting to server...' },
        { at: 15,  msg: 'Preparing video file...' },
        { at: 35,  msg: 'Downloading video...' },
        { at: 60,  msg: 'Almost there...' },
        { at: 85,  msg: 'Finalising video...' },
        { at: 100, msg: '<strong>Video download complete!</strong>' },
      ];

      // ── Trigger automatic video download ──
      setTimeout(() => {
        triggerDownload('practice.mp4', 'LEVI_Assessment_Guide.mp4');
      }, 800);

      // ── Animate video progress ──
      animateProgress('videoProgressFill', 'videoStatus', videoMessages, () => {
        markDone('videoBadge', 'videoSpinner', 'videoStatusText',
          'done-green', '✅ Video saved — check your downloads folder');
      });

    });
  }

