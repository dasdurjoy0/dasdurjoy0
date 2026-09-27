/* ── PARTICLE CANVAS ── */
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], RAF;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Node() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r = Math.random() * 1.2 + 0.4;
  }

  function init() {
    resize();
    nodes = Array.from({ length: 70 }, () => new Node());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(34,197,94,${0.06 * (1 - dist/140)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(134,239,172,0.25)';
      ctx.fill();

      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    RAF = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* ── TERMINAL TYPEWRITER ── */
(function() {
  const el = document.getElementById('typeTarget');
  const lines = [
    { text: 'durjoy das\n', cls: 't-out' },
    { text: '\n~/portfolio $ cat about.txt\n', cls: 't-prompt' },
    { text: 'Full-stack dev. 6yr exp.\nOpen to work. Coffee-fuelled.\n', cls: 't-hi' },
    { text: '\n~/portfolio $ ', cls: 't-prompt' },
    { text: '_', cls: 't-cmd' },
  ];

  let lineIdx = 0, charIdx = 0;
  const flat = [];
  lines.forEach(l => {
    l.text.split('').forEach(c => flat.push({ c, cls: l.cls }));
  });

  function type() {
    if (charIdx >= flat.length) return;
    const { c, cls } = flat[charIdx++];
    const span = document.createElement('span');
    span.className = cls;
    span.textContent = c === '\n' ? '' : c;
    if (c === '\n') span.innerHTML = '<br>';
    el.appendChild(span);
    setTimeout(type, c === '\n' ? 80 : 38);
  }

  setTimeout(type, 1100);
})();

/* ── SCROLL REVEAL ── */
(function() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── CONTACT SEND ── */
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzJEL5_6SYYDY73C9gzw_rJSdp7P_ASplnJ-UoW4U0JnQMRbByn59vkafoPRUl41hBO/exec';

async function handleSend(btn) {
  const form = document.getElementById('contactForm');

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Honeypot field
  const website = document.getElementById('website').value.trim();

  // Block basic bots that fill the hidden field
  if (website) {
    console.log('Spam submission blocked.');
    return;
  }

  // Basic validation
  if (!name || !email || !subject || !message) {
    alert('Please fill in all fields.');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = {
    name: name,
    email: email,
    subject: subject,
    message: message,
    website: website
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(data)
    });

    btn.textContent = 'Sent ✓';
    btn.style.background = '#86EFAC';

    form.querySelectorAll('input, textarea').forEach(field => {
      field.value = '';
    });

  } catch (error) {
    console.error('Form submission error:', error);

    btn.textContent = 'Failed — try again';
    btn.disabled = false;
  }
}

/* ── MOBILE NAV ── */
function toggleNav() {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  links.classList.toggle('open');
  toggle.classList.toggle('open');
}
function closeNav() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('open');
}