// ==========================================================================
// MOURAD DO REGO — PORTFOLIO — script.js
// ==========================================================================

/* ---------- Tab navigation ---------- */
function showPage(pageId) {
  document.querySelectorAll('section.page').forEach(function (el) {
    el.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function (el) {
    el.classList.remove('active');
  });

  var target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  var btn = document.querySelector('.tab-btn[data-page="' + pageId + '"]');
  if (btn) btn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', '#' + pageId);
}

/* Load page from URL hash on first visit */
window.addEventListener('DOMContentLoaded', function () {
  var hash = window.location.hash.replace('#', '');
  if (hash) showPage(hash);
});

/* ---------- Experience accordion ---------- */
function toggleExpCard(btn) {
  var card = btn.closest('.exp-card');
  if (!card) return;
  var open = card.classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* ---------- Skill icon fallback (page Compétences) ---------- */
function iconFallback(img, mono) {
  var span = document.createElement('span');
  span.className = 'skill-badge-icon skill-badge-icon--mono';
  span.textContent = mono;
  img.replaceWith(span);
}

/* ---------- Hero particle field ---------- */
(function () {
  var canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var hero = canvas.closest('.hero');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var particles = [];
  var width, height, dpr;

  // Densité volontairement faible (1 point / ~9000px²) : l'effet doit
  // rester discret, en arrière-plan, sans concurrencer la lisibilité du
  // texte du hero au premier plan.
  var DENSITY = 9000;
  // Couleurs tirées de la palette existante (Field Paper / Ankara Gold),
  // en faible opacité pour rester subtil sur le fond Ink du hero.
  var COLORS = ['rgba(238,240,239,0.5)', 'rgba(238,240,239,0.25)', 'rgba(201,138,46,0.45)'];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.round((width * height) / DENSITY);
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      // Ressort de l'autre côté plutôt que de rebondir : donne une
      // sensation de dérive continue, sans à-coups.
      if (p.x < -2) p.x = width + 2;
      if (p.x > width + 2) p.x = -2;
      if (p.y < -2) p.y = height + 2;
      if (p.y > height + 2) p.y = -2;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    // Une seule image fixe plutôt qu'une animation : on respecte la
    // préférence d'accessibilité du visiteur sans supprimer l'effet.
    step_once();
  } else {
    requestAnimationFrame(step);
  }

  function step_once() {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Lueur qui suit le curseur : désactivée si prefers-reduced-motion,
  // pour la même raison que l'animation des particules ci-dessus.
  if (!reduceMotion) {
    var glow = document.getElementById('heroCursorGlow');
    if (glow) {
      hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
      });
    }
  }
})();

/* ---------- Language toggle ---------- */
function setLang(lang) {
  document.body.classList.remove('lang-fr', 'lang-en');
  document.body.classList.add('lang-' + lang);
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('#langToggle span[data-lang]').forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-lang') === lang);
  });

  // Placeholders bilingues du formulaire de contact : on utilise un seul
  // champ (pas de doublon FR/EN comme pour le texte statique), pour éviter
  // qu'un attribut "name" dupliqué ne pose problème à la soumission du
  // formulaire. On met simplement à jour le placeholder visible.
  document.querySelectorAll('[data-placeholder-fr]').forEach(function (el) {
    var text = lang === 'fr'
      ? el.getAttribute('data-placeholder-fr')
      : el.getAttribute('data-placeholder-en');
    el.setAttribute('placeholder', text);
  });

  localStorage.setItem('portfolio-lang', lang);
}

document.getElementById('langToggle').addEventListener('click', function () {
  var current = document.body.classList.contains('lang-en') ? 'en' : 'fr';
  setLang(current === 'fr' ? 'en' : 'fr');
});

/* Restore saved language preference (or initialize default) */
(function () {
  var saved = localStorage.getItem('portfolio-lang');
  setLang(saved === 'en' ? 'en' : 'fr');
})();

/* ==========================================================================
   CHATBOT — front-end interaction layer
   Connecté à l'API FastAPI + RAG déployée sur Render (étape 7).
   ========================================================================== */

var CHAT_API_URL = 'https://mon-assistant-rag.onrender.com/chat';

function isEnglish() {
  return document.body.classList.contains('lang-en');
}

function appendMessage(text, sender) {
  var container = document.getElementById('chatMessages');
  var bubble = document.createElement('div');
  bubble.className = 'chat-bubble ' + sender;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

/* Bulle "en train d'écrire" pendant l'appel API. Le tier gratuit de
   Render met le service en veille après ~15 min d'inactivité : le
   premier appel après une veille peut prendre 30-60s (cold start).
   Après 6s d'attente, on remplace le message par un indice explicite
   plutôt que de laisser le visiteur face à un silence ambigu. */
var typingTimeoutId = null;

function setTyping(isTyping) {
  var container = document.getElementById('chatMessages');
  var existing = document.getElementById('typingBubble');

  if (isTyping) {
    if (existing) return;
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot typing';
    bubble.id = 'typingBubble';
    bubble.textContent = '···';
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

    typingTimeoutId = setTimeout(function () {
      var b = document.getElementById('typingBubble');
      if (!b) return;
      b.textContent = isEnglish()
        ? 'Waking up the server, this can take up to a minute after a period of inactivity...'
        : "Réveil du serveur en cours, ça peut prendre jusqu'à une minute après une période d'inactivité...";
    }, 6000);
  } else {
    clearTimeout(typingTimeoutId);
    if (existing) existing.remove();
  }
}

function sendChatMessage() {
  var inputFr = document.querySelector('#chatInput');
  var inputEn = document.querySelector('.chat-input-row input.lang-en');
  var activeInput = isEnglish() ? inputEn : inputFr;
  var text = activeInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  activeInput.value = '';

  setTyping(true);
  getBotReply(text).then(function (reply) {
    setTyping(false);
    appendMessage(reply, 'bot');
  });
}

function askSuggestion(btnEl) {
  var text = btnEl.textContent.trim();
  appendMessage(text, 'user');
  setTyping(true);
  getBotReply(text).then(function (reply) {
    setTyping(false);
    appendMessage(reply, 'bot');
  });
}

document.getElementById('chatInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendChatMessage();
});

/**
 * getBotReply — appelle le vrai backend RAG (FastAPI sur Render).
 * En cas d'échec (réseau coupé, erreur serveur, timeout implicite),
 * renvoie un message de repli clair plutôt que de planter
 * silencieusement, et redirige vers le formulaire de contact.
 */
function getBotReply(userText) {
  return fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText }),
  })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      return data.reply;
    })
    .catch(function (err) {
      console.error('Chat API error:', err);
      return isEnglish()
        ? "Sorry, the assistant is temporarily unavailable. Please try again in a moment, or reach out directly using the contact form below."
        : "Désolé, l'assistant est momentanément indisponible. Réessayez dans un instant, ou écrivez-moi directement via le formulaire de contact ci-dessous.";
    });
}
