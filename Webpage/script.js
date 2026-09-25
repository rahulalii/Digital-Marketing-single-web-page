/* ═══════════════════════════════════════════════════════════════════
   ASR DIGITALBOOST AND MUSIC PRIVATE LIMITED
   Premium Futuristic Corporate Website — script.js
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ── UTILITY ── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const isMobile = () => window.innerWidth <= 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ════════════════════════════════════════════════
   1. LOADING SCREEN
════════════════════════════════════════════════ */
function initLoader() {
  const loadingScreen = qs('#loadingScreen');
  const loadingBar    = qs('#loadingBar');
  const loadingPct    = qs('#loadingPct');
  let pct = 0;
  let raf;

  if (!loadingScreen) return Promise.resolve();

  return new Promise(resolve => {
    const tick = () => {
      const increment = pct < 70 ? Math.random() * 4 + 1 : Math.random() * 1.5 + 0.5;
      pct = Math.min(100, pct + increment);
      const display = String(Math.floor(pct)).padStart(2, '0');
      if (loadingPct) loadingPct.textContent = display;
      if (loadingBar)  loadingBar.style.width = pct + '%';

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        if (loadingPct) loadingPct.textContent = '100';
        if (loadingBar)  loadingBar.style.width = '100%';
        setTimeout(() => {
          loadingScreen.style.transition = 'opacity 0.6s ease';
          loadingScreen.style.opacity = '0';
          setTimeout(() => {
            loadingScreen.style.display = 'none';
            resolve();
          }, 600);
        }, 300);
      }
    };

    raf = requestAnimationFrame(tick);
  });
}

/* ════════════════════════════════════════════════
   2. INTRO CANVAS — Glowing sphere & particles
════════════════════════════════════════════════ */
let introAnimating = false;
let introAnimId;

function initIntroCanvas() {
  const canvas = qs('#introCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    o: Math.random() * 0.5 + 0.1,
  }));

  let sphereRadius = 0;
  let targetRadius = Math.min(canvas.width, canvas.height) * 0.18;
  let sphereOpacity = 0;
  let t = 0;

  introAnimating = true;
  const animate = () => {
    if (!introAnimating) return;
    introAnimId = requestAnimationFrame(animate);
    t += 0.008;

    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // Particles
    particles.forEach(p => {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.o * 0.4})`;
      ctx.fill();
    });

    // Grow sphere
    sphereRadius = lerp(sphereRadius, targetRadius, 0.04);
    sphereOpacity = lerp(sphereOpacity, 0.6, 0.04);

    const cx = W / 2, cy = H / 2;

    // Sphere glow
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sphereRadius * 2.5);
    grad.addColorStop(0, `rgba(26,111,255,${sphereOpacity * 0.25})`);
    grad.addColorStop(0.5, `rgba(0,212,255,${sphereOpacity * 0.08})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, sphereRadius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Sphere rings
    for (let ring = 0; ring < 4; ring++) {
      const ringR = sphereRadius * (0.4 + ring * 0.2);
      const alpha = (sphereOpacity * 0.5) * (1 - ring * 0.2);
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Animated data lines (digital effect)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t * 0.3;
      const x1 = cx + Math.cos(angle) * sphereRadius * 0.3;
      const y1 = cy + Math.sin(angle) * sphereRadius * 0.3;
      const x2 = cx + Math.cos(angle) * sphereRadius * 1.1;
      const y2 = cy + Math.sin(angle) * sphereRadius * 1.1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(26,111,255,${sphereOpacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  };

  animate();
}

function stopIntroCanvas() {
  introAnimating = false;
  if (introAnimId) cancelAnimationFrame(introAnimId);
}

/* ════════════════════════════════════════════════
   3. INTRO SEQUENCE — Greetings
════════════════════════════════════════════════ */
const GREETINGS = [
  'नमस्ते', 'Hello', 'Bonjour', 'Hola', 'Ciao',
  'こんにちは', '你好', 'مرحبا', 'Привет', '안녕하세요'
];

function runIntroSequence() {
  const introScreen    = qs('#introScreen');
  const greetingText   = qs('#greetingText');
  const introLogo      = qs('#introLogo');
  const introGreetings = qs('#introGreetings');
  const logoPathText   = qs('.logo-path-text');
  const skipBtn        = qs('#skipBtn');

  if (!introScreen || prefersReducedMotion) {
    if (introScreen) {
      introScreen.style.display = 'none';
    }
    return Promise.resolve();
  }

  return new Promise(resolve => {
    let skipped = false;

    const finish = () => {
      if (skipped) return;
      skipped = true;
      stopIntroCanvas();
      introScreen.style.transition = 'opacity 0.8s ease';
      introScreen.style.opacity = '0';
      setTimeout(() => {
        introScreen.style.display = 'none';
        resolve();
      }, 800);
    };

    if (skipBtn) {
      skipBtn.addEventListener('click', finish);
    }

    // Check returning visitor
    const hasVisited = localStorage.getItem('asr_visited');
    localStorage.setItem('asr_visited', '1');

    const delay = ms => new Promise(r => setTimeout(r, ms));

    const showGreeting = async (text) => {
      if (skipped) return;
      greetingText.textContent = text;
      greetingText.style.opacity = '0';
      greetingText.style.transform = 'translateY(30px)';
      greetingText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          greetingText.style.opacity = '1';
          greetingText.style.transform = 'translateY(0)';
        });
      });

      await delay(600);

      greetingText.style.opacity = '0';
      greetingText.style.transform = 'translateY(-20px)';
      await delay(300);
    };

    const showLogo = async () => {
      if (skipped) return;
      introGreetings.style.opacity = '0';
      introLogo.style.opacity = '0';
      introLogo.style.display = 'flex';
      introLogo.style.transition = 'opacity 0.8s ease';

      // Animate SVG stroke
      if (logoPathText) {
        logoPathText.style.strokeDashoffset = '1000';
        logoPathText.style.transition = 'stroke-dashoffset 1.5s ease';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            logoPathText.style.strokeDashoffset = '0';
          });
        });
      }

      introLogo.style.opacity = '1';
      await delay(2500);
    };

    const run = async () => {
      const greetings = hasVisited ? GREETINGS.slice(0, 4) : GREETINGS;

      for (const greeting of greetings) {
        if (skipped) return;
        await showGreeting(greeting);
        await delay(100);
      }

      if (skipped) return;
      await showLogo();
      if (!skipped) finish();
    };

    run();
  });
}

/* ════════════════════════════════════════════════
   4. CUSTOM CURSOR
════════════════════════════════════════════════ */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot   = qs('#cursorDot');
  const ring  = qs('#cursorRing');
  const label = qs('#cursorLabel');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  let raf;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;
  const tick = () => {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
    raf = requestAnimationFrame(tick);
  };
  tick();

  // Hover detection
  document.addEventListener('mouseover', e => {
    const target = e.target.closest('a, button, [data-cursor], .service-card, .work-card, .filter-btn, .testimonial-btn, .t-dot, .nav-toggle');
    if (target) {
      document.body.classList.add('cursor-hover');
      const cursorLabel = target.dataset.cursor || '';
      if (label) label.textContent = cursorLabel;
    }
  });

  document.addEventListener('mouseout', e => {
    if (!e.relatedTarget?.closest?.('a, button, [data-cursor], .service-card, .work-card, .filter-btn, .testimonial-btn, .t-dot, .nav-toggle')) {
      document.body.classList.remove('cursor-hover');
      if (label) label.textContent = '';
    }
  });

  document.addEventListener('mousedown', () => {
    dot.style.transform += ' scale(0.7)';
    ring.style.transform += ' scale(0.9)';
  });

  document.addEventListener('mouseup', () => {
    // reset handled by next mousemove
  });
}

/* ════════════════════════════════════════════════
   5. NAVIGATION
════════════════════════════════════════════════ */
function initNav() {
  const header     = qs('#siteHeader');
  const toggle     = qs('#navToggle');
  const mobileMenu = qs('#mobileMenu');
  const mobileLinks = qsa('.mobile-nav-link');

  // Scroll-based header style
  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    header?.classList.toggle('scrolled', scrolled);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggleMenu = (open) => {
    const isOpen = open ?? !mobileMenu?.classList.contains('open');
    toggle?.setAttribute('aria-expanded', String(isOpen));
    mobileMenu?.classList.toggle('open', isOpen);
    mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle?.addEventListener('click', () => toggleMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // Smooth scroll for nav links
  qsa('.nav-link, .mobile-nav-link, .footer-nav-link, .btn, .hero-cta-group a').forEach(link => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = qs(href);
        if (target) {
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }
  });
}

/* ════════════════════════════════════════════════
   6. HERO THREE.JS SPHERE
════════════════════════════════════════════════ */
function initHeroSphere() {
  const canvas = qs('#heroSphere');
  if (!canvas || typeof THREE === 'undefined' || isMobile()) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth || 480, canvas.offsetHeight || 480);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 3;

  // Sphere wireframe
  const geo   = new THREE.IcosahedronGeometry(1.2, 4);
  const mat   = new THREE.MeshBasicMaterial({ color: 0x1a6fff, wireframe: true, transparent: true, opacity: 0.15 });
  const mesh  = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Inner glow sphere
  const geoInner = new THREE.SphereGeometry(0.85, 32, 32);
  const matInner = new THREE.MeshBasicMaterial({
    color: 0x00d4ff, transparent: true, opacity: 0.05
  });
  scene.add(new THREE.Mesh(geoInner, matInner));

  // Orbiting particles
  const pts   = [];
  const count = 200;
  for (let i = 0; i < count; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r     = 1.3 + Math.random() * 0.4;
    pts.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
  }
  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const ptMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.018, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(ptGeo, ptMat));

  // Data rings
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.3 + i * 0.15, 0.003, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1a6fff, transparent: true, opacity: 0.3 - i * 0.08 });
    const ring    = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + i * 0.6;
    ring.rotation.y = i * 0.4;
    scene.add(ring);
  }

  let mx = 0, my = 0;
  let targetRotX = 0, targetRotY = 0;

  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.003;

    targetRotY = lerp(targetRotY, mx * 0.4, 0.05);
    targetRotX = lerp(targetRotX, my * 0.2, 0.05);

    mesh.rotation.y = t + targetRotY;
    mesh.rotation.x = t * 0.3 + targetRotX;

    renderer.render(scene, camera);
  };

  animate();

  const resizeObserver = new ResizeObserver(() => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h, false);
  });
  resizeObserver.observe(canvas);
}

/* ════════════════════════════════════════════════
   7. HERO CANVAS — Particle Field
════════════════════════════════════════════════ */
function initHeroCanvas() {
  const canvas = qs('#heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = isMobile() ? 40 : 100;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    o: Math.random() * 0.4 + 0.05,
  }));

  let mx = canvas.width / 2, my = canvas.height / 2;
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
  }, { passive: true });

  const animate = () => {
    requestAnimationFrame(animate);
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Radial gradient bg
    const grad = ctx.createRadialGradient(W * 0.6, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.6);
    grad.addColorStop(0, 'rgba(26,111,255,0.06)');
    grad.addColorStop(0.5, 'rgba(0,212,255,0.03)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Mouse repel
      const dx = p.x - mx, dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;
      }
      p.vx *= 0.99; p.vy *= 0.99;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.o})`;
      ctx.fill();

      // Draw connections
      particles.forEach(q => {
        const dx2 = p.x - q.x, dy2 = p.y - q.y;
        const d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        if (d2 < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(26,111,255,${0.08 * (1 - d2 / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  };

  animate();
}

/* ════════════════════════════════════════════════
   8. GSAP ANIMATIONS (when loaded)
════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero text reveals ──
  const heroLines = qsa('.hero-line');
  heroLines.forEach((line, i) => {
    gsap.from(line, {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      delay: 0.2 + i * 0.12,
      ease: 'power4.out',
    });
  });

  gsap.to('.hero-eyebrow', {
    opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out',
  });

  gsap.to('.hero-subtext', {
    opacity: 1, y: 0, duration: 0.9, delay: 0.7, ease: 'power3.out',
  });

  gsap.to('.hero-cta-group', {
    opacity: 1, y: 0, duration: 0.9, delay: 0.9, ease: 'power3.out',
  });

  gsap.to('.hero-stats', {
    opacity: 1, y: 0, duration: 0.9, delay: 1.1, ease: 'power3.out',
  });

  gsap.to('.hero-visual', {
    opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: 'power3.out',
  });

  gsap.to('.hero-scroll-cue', {
    opacity: 1, duration: 1, delay: 1.5, ease: 'power2.out',
  });

  // ── Hero rotating words ──
  const rotatingWords = ['NOTICED.', 'REMEMBERED.', 'CHOSEN.', 'TRUSTED.'];
  const heroRotating  = qs('#heroRotating');
  if (heroRotating) {
    let wordIdx = 0;
    setInterval(() => {
      wordIdx = (wordIdx + 1) % rotatingWords.length;
      gsap.to(heroRotating, {
        yPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.in',
        onComplete: () => {
          heroRotating.textContent = rotatingWords[wordIdx];
          gsap.fromTo(heroRotating,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
          );
        }
      });
    }, 2500);
  }

  // ── Philosophy section ──
  const philosWords = qsa('.philo-word');
  if (philosWords.length) {
    philosWords.forEach((word, i) => {
      gsap.to(word, {
        opacity: 1, y: 0,
        duration: 0.8,
        delay: parseFloat(word.dataset.delay) || 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.philosophy-section',
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  // ── Capabilities section ──
  const capItems = qsa('.cap-item');
  capItems.forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, y: 40,
      duration: 0.8,
      delay: parseFloat(item.dataset.delay) || 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.capabilities-section',
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ── Growth scrollytelling ──
  initGrowthScrollytelling();

  // ── Tech nodes orbit ──
  initTechCanvas();
}

/* ════════════════════════════════════════════════
   9. GROWTH SCROLLYTELLING
════════════════════════════════════════════════ */
function initGrowthScrollytelling() {
  const steps  = qsa('.growth-step');
  const label  = qs('#growthLabel');
  const canvas = qs('#growthCanvas');
  if (!canvas || !steps.length) return;

  const ctx = canvas.getContext('2d');
  let activeStage = 0;
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const stages = ['ATTENTION', 'ENGAGEMENT', 'CONVERSION', 'GROWTH', 'BRAND'];
  const colors = ['#1a6fff', '#00d4ff', '#7b2fff', '#00ff88', '#ffffff'];

  let nodes = [];
  let animT = 0;

  // Build nodes for current stage
  function buildNodes(stageIdx) {
    const count = Math.min(stageIdx + 1, stages.length);
    nodes = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const r = Math.min(W, H) * 0.28;
      nodes.push({
        x: W / 2 + Math.cos(angle) * r,
        y: H / 2 + Math.sin(angle) * r,
        label: stages[i],
        color: colors[i],
        t: 0,
        active: i <= stageIdx,
      });
    }
  }

  buildNodes(0);

  // Canvas animation
  const animateGrowth = () => {
    requestAnimationFrame(animateGrowth);
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = 'rgba(8,13,26,0.95)';
    ctx.fillRect(0, 0, W, H);

    // Grid
    const gridSize = 60;
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += gridSize) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += gridSize) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    animT += 0.01;

    // Draw connections
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i], b = nodes[i + 1];
      if (!a.active || !b.active) continue;

      const pct = Math.min(1, (b.t - 0.5) * 2);
      if (pct <= 0) continue;

      const x2 = lerp(a.x, b.x, pct);
      const y2 = lerp(a.y, b.y, pct);

      // Animated data stream particles along connection
      for (let p = 0; p < 5; p++) {
        const pt = ((animT * 0.5 + p * 0.2) % 1) * pct;
        const px = lerp(a.x, b.x, pt);
        const py = lerp(a.y, b.y, pt);
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = a.color + '99';
        ctx.fill();
      }

      const grad = ctx.createLinearGradient(a.x, a.y, x2, y2);
      grad.addColorStop(0, a.color + '80');
      grad.addColorStop(1, b.color + '20');
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Draw nodes
    nodes.forEach(node => {
      if (!node.active) return;
      node.t = Math.min(1, node.t + 0.03);

      const scale = node.t;
      const r = 36 * scale;
      const pulse = Math.sin(animT * 2) * 0.2 + 1;

      // Outer glow
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5 * pulse);
      grad.addColorStop(0, node.color + '25');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 2.5 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(8,13,26,0.9)';
      ctx.fill();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      if (node.t > 0.6) {
        ctx.font = `600 ${isMobile() ? 10 : 11}px 'Space Grotesk', sans-serif`;
        ctx.fillStyle = `rgba(255,255,255,${(node.t - 0.6) * 2.5})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
      }
    });
  };

  animateGrowth();

  // IntersectionObserver for step activation
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const step = entry.target;
      const idx  = steps.indexOf(step);
      if (idx < 0) return;

      activeStage = idx;
      buildNodes(idx);

      if (label) {
        label.textContent = step.dataset.desc || '';
        label.style.opacity = '1';
      }

      steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    });
  }, { threshold: 0.5 });

  steps.forEach(step => io.observe(step));
}

/* ════════════════════════════════════════════════
   10. TECH SECTION CANVAS
════════════════════════════════════════════════ */
function initTechCanvas() {
  const canvas = qs('#techCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const count = 60;
  const pts = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
  }));

  const animate = () => {
    requestAnimationFrame(animate);
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(26,111,255,0.4)';
      ctx.fill();

      pts.forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(26,111,255,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  };

  animate();
}

/* ════════════════════════════════════════════════
   11. CTA CANVAS
════════════════════════════════════════════════ */
function initCtaCanvas() {
  const canvas = qs('#ctaCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    const cx = W / 2, cy = H / 2;

    for (let ring = 0; ring < 4; ring++) {
      const r = 100 + ring * 70 + Math.sin(t + ring) * 15;
      const alpha = 0.15 - ring * 0.03;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(26,111,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Rotating arcs
    for (let i = 0; i < 3; i++) {
      const r = 80 + i * 40;
      const start = t * (1 + i * 0.3);
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + Math.PI * 0.4);
      ctx.strokeStyle = `rgba(0,212,255,${0.4 - i * 0.1})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  animate();
}

/* ════════════════════════════════════════════════
   12. REVEAL ON SCROLL (IntersectionObserver)
════════════════════════════════════════════════ */
function initReveal() {
  const elements = qsa('.reveal-fade, .reveal-up');
  if (!elements.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════════
   13. NUMBER COUNTERS
════════════════════════════════════════════════ */
function initCounters() {
  const counters = qsa('[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start  = performance.now();

      const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(ease(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════════
   14. 3D CARD TILT
════════════════════════════════════════════════ */
function initTilt() {
  if (isMobile() || prefersReducedMotion) return;

  const cards = qsa('[data-tilt]');
  cards.forEach(card => {
    let raf;
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetRY = ((x / rect.width) - 0.5) * 12;
      targetRX = -((y / rect.height) - 0.5) * 8;
    });

    card.addEventListener('mouseleave', () => {
      targetRX = 0; targetRY = 0;
    });

    const tick = () => {
      currentRX = lerp(currentRX, targetRX, 0.08);
      currentRY = lerp(currentRY, targetRY, 0.08);
      card.style.transform = `perspective(800px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) translateZ(4px)`;
      raf = requestAnimationFrame(tick);
    };

    card.addEventListener('mouseenter', () => { raf = requestAnimationFrame(tick); });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

/* ════════════════════════════════════════════════
   15. MAGNETIC BUTTONS
════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (isMobile() || prefersReducedMotion) return;

  qsa('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

/* ════════════════════════════════════════════════
   16. PORTFOLIO FILTERS
════════════════════════════════════════════════ */
function initWorkFilters() {
  const filterBtns = qsa('.filter-btn');
  const workCards  = qsa('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-selected', 'true');

      workCards.forEach(card => {
        const cats = card.dataset.category || '';
        const show = filter === 'all' || cats.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ════════════════════════════════════════════════
   17. TESTIMONIALS CAROUSEL
════════════════════════════════════════════════ */
function initTestimonials() {
  const track = qs('#testimonialsTrack');
  const dots  = qsa('.t-dot');
  const prev  = qs('#testPrev');
  const next  = qs('#testNext');
  if (!track) return;

  const total = qsa('.testimonial-card').length;
  let current = 0;
  let autoTimer;

  const goTo = idx => {
    current = (idx + total) % total;
    track.style.transform = `translateX(${-current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('t-dot--active', i === current);
      d.setAttribute('aria-selected', String(i === current));
    });
  };

  prev?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  next?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };

  resetAuto();

  // Touch/swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   18. CONTACT FORM
════════════════════════════════════════════════ */
function initContactForm() {
  const form    = qs('#contactForm');
  const success = qs('#formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const inputs = qsa('[required]', form);
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) { valid = false; input.focus(); return; }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        valid = false; input.focus(); return;
      }
    });

    if (!valid) return;

    // Honeypot protection
    const submitBtn = qs('[type="submit"]', form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'SENDING...';
    }

    // Simulate submission (replace with real endpoint)
    setTimeout(() => {
      form.style.display = 'none';
      if (success) success.hidden = false;
    }, 1200);
  });
}

/* ════════════════════════════════════════════════
   19. KEYBOARD NAV
════════════════════════════════════════════════ */
function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
}

/* ════════════════════════════════════════════════
   20. SMOOTH ANCHOR LINKS (fallback if no GSAP)
════════════════════════════════════════════════ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = qs(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = 72;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ════════════════════════════════════════════════
   21. LAZY IMAGE LOADING
════════════════════════════════════════════════ */
function initLazyLoading() {
  const imgs = qsa('img[loading="lazy"], img[data-src]');
  if (!imgs.length) return;

  if ('loading' in HTMLImageElement.prototype) return; // native support

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) { img.src = img.dataset.src; }
        io.unobserve(img);
      }
    });
  });

  imgs.forEach(img => io.observe(img));
}

/* ════════════════════════════════════════════════
   MAIN INIT
════════════════════════════════════════════════ */
async function init() {
  // Add keyframe for fadeInUp
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: none; }
    }
  `;
  document.head.appendChild(style);

  // 1. Loading screen
  await initLoader();

  // 2. Intro canvas (fire and forget — runs in parallel)
  document.body.classList.add('intro-active');
  initIntroCanvas();

  // 3. Intro sequence — wait for it
  await runIntroSequence();

  // 4. Main site
  document.body.classList.remove('intro-active');

  // 5. Init everything else
  initCursor();
  initNav();
  initHeroCanvas();
  initHeroSphere();
  initReveal();
  initCounters();
  initTilt();
  initMagneticButtons();
  initWorkFilters();
  initTestimonials();
  initContactForm();
  initKeyboardNav();
  initLazyLoading();
  initCtaCanvas();

  // 6. GSAP (defer until libs loaded)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initGSAP();
  } else {
    // Fallback: wait for scripts to load
    window.addEventListener('load', () => {
      if (typeof gsap !== 'undefined') initGSAP();
      else {
        // Graceful degradation — no GSAP
        initGrowthScrollytelling();
        initTechCanvas();
      }
    });
  }
}

/* ── BOOT ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
