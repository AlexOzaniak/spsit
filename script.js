'use strict';

// ── CONFIG ──────────────────────────────────────────────
const CATS = {
  vyucovanie: 'Učenie',
  jedalen:    'Jedáleň',
  priestory:  'Priestory',
  pravidla:   'Pravidlá',
  pohoda:     'Pohoda',
  ine:        'Iné',
};

const MOODS = { 5:'😄', 4:'🙂', 3:'😐', 2:'😕', 1:'😞' };
// Use same-origin when served, but fall back to local Express when opened from disk.
const API = (window.location.protocol === 'file:' || window.location.origin === 'null')
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

// ── STATE ───────────────────────────────────────────────
let ideas = [];
let activeCat = 'all';
let selectedCat = null;

// ── API CALLS ───────────────────────────────────────────
async function loadIdeas() {
  try {
    const res = await fetch(`${API}/ideas`);
    if (!res.ok) throw new Error('Failed to load ideas');
    ideas = await res.json();
  } catch (err) {
    console.error('Error loading ideas:', err);
    ideas = [];
  }
  render();
}

async function addIdea(data) {
  try {
    const res = await fetch(`${API}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add idea');
    const newIdea = await res.json();
    ideas.unshift(newIdea);
    render();
    return true;
  } catch (err) {
    console.error('Error adding idea:', err);
    return false;
  }
}

async function likeIdea(id) {
  try {
    const res = await fetch(`${API}/ideas/${id}/like`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to like idea');
    const idea = ideas.find(i => i.id === id);
    if (idea) idea.likes++;
    render();
  } catch (err) {
    console.error('Error liking idea:', err);
  }
}

// ── UTILS ───────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ago(ts) {
  if (!ts) return 'nedávno';
  const time = new Date(ts).getTime();
  if (isNaN(time)) return 'nedávno';
  const s = (Date.now() - time) / 1000;
  if (s < 60)    return 'práve teraz';
  if (s < 3600)  return `pred ${Math.floor(s/60)} min`;
  if (s < 86400) return `pred ${Math.floor(s/3600)} hod`;
  if (isNaN(Math.floor(s/86400))) return 'nedávno';
  return `pred ${Math.floor(s/86400)} d`;
}

// ── RENDER ──────────────────────────────────────────────
function render() {
  const grid  = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const list = (activeCat === 'all' ? ideas : ideas.filter(i => i.category === activeCat)).slice(0, 4);
  
  document.getElementById('ideasSub').textContent = `${ideas.length} príspevkov`;
  document.getElementById('fstatNum').textContent  = ideas.length;

  if (!list.length) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = list.map((idea, i) => {
    const likes = isNaN(idea.likes) ? 0 : idea.likes;
    return `
    <article class="icard" style="animation-delay:${Math.min(i*50,300)}ms">
      <div class="icard-top">
        <span class="icard-cat">${esc(CATS[idea.category] || 'Iné')}</span>
        <span class="icard-mood">${MOODS[idea.mood] || ''}</span>
      </div>
      <p class="icard-text">${esc(idea.text)}</p>
      <div class="icard-foot">
        <span class="icard-who">🎓 ${esc(idea.nick || 'Anonymný')}${idea.grade ? ` · ${idea.grade}. roč.` : ''} · ${ago(idea.created_at)}</span>
        <button class="icard-like" data-id="${idea.id}" onclick="handleLike(${idea.id})">
          🤍 ${likes}
        </button>
      </div>
    </article>`;
  }).join('');
}

function handleLike(id) {
  likeIdea(id);
}

// ── FILTERS ─────────────────────────────────────────────
document.getElementById('cats').addEventListener('click', e => {
  const btn = e.target.closest('.cat');
  if (!btn) return;
  document.querySelectorAll('.cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCat = btn.dataset.cat;
  render();
});

// ── PILLS ───────────────────────────────────────────────
document.getElementById('pills').addEventListener('click', e => {
  const p = e.target.closest('.pill');
  if (!p) return;
  document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  selectedCat = p.dataset.cat;
});

// ── CHAR COUNT ──────────────────────────────────────────
document.getElementById('txt').addEventListener('input', function() {
  document.getElementById('chars').textContent = this.value.length;
});

// ── FORM SUBMIT ─────────────────────────────────────────
document.getElementById('form').addEventListener('submit', async e => {
  e.preventDefault();

  const txt   = document.getElementById('txt').value.trim();
  const grade = document.getElementById('grade').value;
  const nick  = document.getElementById('nick').value.trim();
  const moodEl = document.querySelector('input[name="mood"]:checked');

  if (!grade) { shake(document.getElementById('grade')); return; }
  if (!txt)   { shake(document.getElementById('txt'));   return; }

  const success = await addIdea({
    nick: nick || 'Anonymný',
    grade,
    category: selectedCat || 'ine',
    text: txt,
    mood: moodEl ? +moodEl.value : 3,
  });

  if (success) {
    // reset
    document.getElementById('form').reset();
    document.getElementById('chars').textContent = '0';
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    selectedCat = null;

    // Store last idea id for voting
    lastIdeaId = ideas[0]?.id;

    toast();
    setTimeout(() => showVoteModal(), 1000);
    document.querySelector('.ideas-section').scrollIntoView({ behavior: 'smooth' });
  }
});

// ── SHAKE ───────────────────────────────────────────────
function shake(el) {
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  el.focus();
}

// ── TOAST ───────────────────────────────────────────────
function toast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── VOTE MODAL ──────────────────────────────────────────
let lastIdeaId = null;

function showVoteModal() {
  const modal = document.getElementById('voteModal');
  modal.classList.add('show');
}

function createConfetti() {
  const confettiContainer = document.getElementById('confetti');
  confettiContainer.innerHTML = '';
  
  const colors = ['#e8ff47', '#22c55e', '#3b82f6', '#f87171', '#fbbf24'];
  
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    confettiContainer.appendChild(piece);
  }
}

async function submitVote(voteValue) {
  if (!lastIdeaId) return;
  
  // Show success state immediately
  document.getElementById('voteQuestion').style.display = 'none';
  document.getElementById('voteSuccess').style.display = 'block';
  
  // Set message and color based on vote
  const messageEl = document.getElementById('successMessage');
  if (voteValue) {
    messageEl.textContent = 'Ďakujeme za tvoj hlas a vážime si, že chceš podporovať túto školu ❤️';
    messageEl.classList.add('yes');
    messageEl.classList.remove('no');
    createConfetti();
    
    // Save to database
    try {
      await fetch(`${API}/ideas/${lastIdeaId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: true })
      });
    } catch (err) {
      console.error('Error submitting vote:', err);
    }
  } else {
    messageEl.textContent = 'Ďakujeme za tvoj hlas a čas.';
    messageEl.classList.add('no');
    messageEl.classList.remove('yes');
    // Don't save NO vote to database - no confetti either
  }
}

function closeVoteModal() {
  const modal = document.getElementById('voteModal');
  const question = document.getElementById('voteQuestion');
  const success = document.getElementById('voteSuccess');
  
  // Reset to question state
  question.style.display = 'block';
  success.style.display = 'none';
  
  // Close modal
  modal.classList.remove('show');
}

document.getElementById('voteYesBtn')?.addEventListener('click', () => submitVote(true));
document.getElementById('voteCloseBtn')?.addEventListener('click', closeVoteModal);

// ── INIT ────────────────────────────────────────────────
loadIdeas();