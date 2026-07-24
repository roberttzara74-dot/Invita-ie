/* =========================================================
   ANDREEA — INVITAȚIE PREMIUM — script.js
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     0. EMAILJS CONFIG
     --------------------------------------------------------- */
  const EMAILJS_CONFIG = {
    SERVICE_ID:  'service_l3pfd98',
    TEMPLATE_ID: 'template_gmfrogc',
    PUBLIC_KEY:  'xC4V0Ids8yJLvw0AT',
    NOTIFY_EMAIL: 'roberttzara74@gmail.com'
  };

  const emailJsReady =
    typeof emailjs !== 'undefined' &&
    !EMAILJS_CONFIG.SERVICE_ID.startsWith('YOUR_') &&
    !EMAILJS_CONFIG.TEMPLATE_ID.startsWith('YOUR_') &&
    !EMAILJS_CONFIG.PUBLIC_KEY.startsWith('YOUR_');

  if (emailJsReady) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  } else {
    console.info(
      '[Andreea site] EmailJS nu este configurat încă — notificarea ' +
      'prin email va fi omisă.'
    );
  }

  function sendConfirmationEmail(choiceLabel) {
    if (!emailJsReady) return;
    
    const templateParams = {
      name: 'Andreea',
      title: 'Răspuns Invitație',
      message: `A ales opțiunea: "${choiceLabel}" la data de ${new Date().toLocaleString('ro-RO')}`,
      to_email: EMAILJS_CONFIG.NOTIFY_EMAIL
    };

    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
      .then((res) => {
        console.log('[Andreea site] Email trimis cu succes!', res.status, res.text);
      })
      .catch((err) => {
        console.warn('[Andreea site] Trimiterea emailului de notificare a eșuat:', err);
      });
  }

  /* ---------------------------------------------------------
     1. FLOATING 3D STRAWBERRIES
  --------------------------------------------------------- */
  const fruitField = document.getElementById('fruitField');
  const BERRY_COUNT = window.innerWidth < 640 ? 9 : 16;

  function spawnBerry() {
    const berry = document.createElement('div');
    berry.className = 'berry';

    const size = 26 + Math.random() * 28;
    const left = Math.random() * 100;
    const duration = 16 + Math.random() * 14;
    const delay = -Math.random() * duration;
    const drift = (Math.random() * 160 - 80) + 'px';

    berry.style.left = `${left}vw`;
    berry.style.width = `${size}px`;
    berry.style.height = `${size * 1.1}px`;
    berry.style.setProperty('--drift', drift);
    berry.style.animationDuration = `${duration}s, ${8 + Math.random() * 10}s`;
    berry.style.animationDelay = `${delay}s, ${delay}s`;
    berry.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);

    berry.innerHTML = `
      <div class="berry__body">
        <div class="berry__leaf"></div>
      </div>
    `;
    fruitField.appendChild(berry);
  }

  for (let i = 0; i < BERRY_COUNT; i++) spawnBerry();

  /* ---------------------------------------------------------
     2. INTRO SEAL → REVEAL → UNLOCK SITE (+ audio unlock)
  --------------------------------------------------------- */
  const intro = document.getElementById('intro');
  const introSeal = document.getElementById('introSeal');
  const introReveal = document.getElementById('introReveal');
  const introLine2 = document.querySelector('.intro__line--2');
  const site = document.getElementById('site');
  const bgAudio = document.getElementById('bgAudio');

  let unlocked = false;

  function tryAutoplay() {
    const p = bgAudio.play();
    if (p !== undefined) {
      p.catch(() => {
        /* autoplay blocked — will retry on first user interaction */
      });
    }
  }

  window.addEventListener('DOMContentLoaded', tryAutoplay);

  function openInvitation() {
    if (unlocked) return;
    unlocked = true;

    bgAudio.volume = 0.9;
    bgAudio.play().catch(() => {});

    introSeal.style.display = 'none';
    introReveal.classList.add('is-visible');
    setTimeout(() => introLine2.classList.add('is-visible'), 250);

    setTimeout(() => {
      intro.classList.add('is-hidden');
      site.classList.add('is-visible');
      document.body.style.overflow = 'auto';
      revealStopsOnScroll();
    }, 2400);
  }

  introSeal.addEventListener('click', openInvitation);
  introSeal.setAttribute('tabindex', '0');
  introSeal.setAttribute('role', 'button');
  introSeal.setAttribute('aria-label', 'Deschide invitația');
  introSeal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvitation(); }
  });

  document.body.addEventListener('pointerdown', () => {
    if (bgAudio.paused) bgAudio.play().catch(() => {});
  }, { once: true });

  /* ---------------------------------------------------------
     3. SCROLL REVEALS FOR STOPS
  --------------------------------------------------------- */
  function revealStopsOnScroll() {
    const stops = document.querySelectorAll('.stop');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    stops.forEach((s) => io.observe(s));
  }

  /* ---------------------------------------------------------
     4. FINAL CONFIRMATION + CELEBRATION
  --------------------------------------------------------- */
  const btnAccept = document.getElementById('btnAccept');
  const btnExcited = document.getElementById('btnExcited');
  const finalAsk = document.getElementById('finalAsk');
  const finalThanks = document.getElementById('finalThanks');

  function confirm(choiceLabel) {
    finalAsk.style.display = 'none';
    finalThanks.hidden = false;
    launchCelebration();
    sendConfirmationEmail(choiceLabel);
  }

  btnAccept.addEventListener('click', () => confirm('❤️ Da, accept.'));
  btnExcited.addEventListener('click', () => confirm('💖 Abia aștept.'));

  /* ---------------------------------------------------------
     5. CELEBRATION — confetti, hearts & strawberries on canvas
  --------------------------------------------------------- */
  const canvas = document.getElementById('celebrationCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let celebrationRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const CELEBRATION_GLYPHS = ['❤️', '💖', '🍓', '✨', '🌸'];
  const CELEBRATION_COLORS = ['#B22E4E', '#E8AFC0', '#C9A468', '#D68CA0'];

  function makeParticle() {
    const useGlyph = Math.random() < 0.55;
    return {
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 1.6,
      vy: 1.2 + Math.random() * 2.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.08,
      size: 14 + Math.random() * 16,
      glyph: useGlyph ? CELEBRATION_GLYPHS[Math.floor(Math.random() * CELEBRATION_GLYPHS.length)] : null,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      shape: Math.random() < 0.5 ? 'rect' : 'circle',
      life: 0,
      maxLife: 260 + Math.random() * 120
    };
  }

  function launchCelebration() {
    particles = [];
    for (let i = 0; i < 140; i++) particles.push(makeParticle());
    if (!celebrationRunning) {
      celebrationRunning = true;
      requestAnimationFrame(tickCelebration);
    }
    let spawnCount = 0;
    const spawner = setInterval(() => {
      for (let i = 0; i < 6; i++) particles.push(makeParticle());
      spawnCount++;
      if (spawnCount > 18) clearInterval(spawner);
    }, 220);
  }

  function tickCelebration() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const fade = Math.max(0, 1 - p.life / p.maxLife);
      ctx.globalAlpha = fade;

      if (p.glyph) {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.glyph, 0, 0);
      } else if (p.shape === 'rect') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter(
      (p) => p.life < p.maxLife && p.y < window.innerHeight + 60
    );

    if (particles.length > 0) {
      requestAnimationFrame(tickCelebration);
    } else {
      celebrationRunning = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  document.body.style.overflow = 'hidden';
})();
