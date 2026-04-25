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

const BANNED_WORDS = [
  // Sexuální a erotické nadávky
  'jebnuty', 'vyjebany', 'dojebany', 'zajebany', 'ojebany', 'prijebany', 'najebany', 'prejebany', 'rozjebany', 'pojebany', 'ujebany', 'jeblina', 'jebal', 'jebnutost', 'jebak', 'jebanec', 'jebanica', 'jebenica', 'jebav', 'jebavac', 'jebavka', 'jebavost', 'jebavacka',
  'chuj', 'chujovina', 'chujov', 'vyhujeny', 'dochujeny', 'pachuj', 'chujovec', 'chujovka', 'chujo', 'chujac', 'chuják', 'chujácia', 'chujacka', 'chujakovity', 'chujicka', 'chujil', 'chujanici', 'chujicnik',
  'pica', 'pici', 'dopice', 'zapice', 'vypice', 'picovina', 'picus', 'vypicovany', 'dopicovany', 'zapicovany', 'rozpicovany', 'picisko', 'picovyna', 'pichac', 'pichač', 'pichať', 'spikat', 'spikať', 'pikal', 'pikať', 'piku', 'piku sa',
  'picha', 'pichanie', 'pichot', 'pichovacka', 'pichara', 'pichatko', 'pichavost',
  'sex', 'sexovat', 'sexovanie', 'sexovacka', 'sexovanka', 'sexovankova', 'sexovany', 'sexovana', 'sexovacko', 'sexista', 'sexistka', 'sexizmus', 'sexualny', 'sexualna', 'sexualita', 'sexualizacia', 'sexualizovanie',
  'prdel', 'prdla', 'prdlancka', 'prdlanica', 'prdlanek', 'prdlancok', 'prdlacka', 'prdlista', 'prdlistka', 'prdlistko', 'prdlistovy', 'prdlo', 'prdla',
  'rit', 'doriti', 'ritolezec', 'ritopich', 'ritny', 'ritista', 'ritistka', 'ritovacka', 'ritovacko', 'ritovany', 'ritovka', 'ritisko', 'ritalko', 'ritacik',
  'pinda', 'pindarella', 'pindolova', 'pindakovista', 'pindaka', 'pindalistka', 'pindalist',
  'flandra', 'flandrina', 'flandrinka', 'flandrista', 'flandristka', 'flandrovic',
  'cundra', 'cundrina', 'cundrista', 'cundristka', 'cundrovic', 'cundrina', 'cundralovska', 'cundralist',
  'prostitutka', 'prostitutnicka', 'prostitutny', 'prostitucia', 'prostituovanie',
  'stetka', 'slapka', 'kurvicka', 'kurvicka', 'kurva', 'kurvi', 'kurvina', 'kurvinstva', 'kurvit', 'kurvovanie', 'kurvovost', 'kurvovanka', 'kurvovana',
  'skurvysyn', 'skurveny', 'skurvysynsky', 'skurvit', 'dokurvit', 'zakurvit', 'vykurveny', 'prekurveny', 'rozkurveny', 'skurvovanie', 'skurvovacka', 'skurvovanka',
  
  // Telo a telové časti
  'kokot', 'kokotina', 'kokotsky', 'vykokoteny', 'skokoteny', 'kokotko', 'kokotisko', 'zakokotit', 'kokoticka', 'kokoticko', 'kokoticka', 'kokotnikova',
  
  // Kalom a fyzickejšie vulgarizmy
  'hovno', 'hovniar', 'hovniarstvo', 'hovniaren', 'posraty', 'vysraty', 'osraty', 'zesraty', 'nasraty', 'dosraty', 'srac', 'sracka', 'sracun', 'sracanka', 'sracko', 'sracnik', 'sracovista', 'sracovanie', 'sracavka', 'sracavost',
  'zmrd', 'zmrdisko', 'zmrdany', 'vymrdany', 'domrdany', 'namrdany', 'mrdnuty', 'zmrdovatko', 'zmrdovatost', 'zmrdun', 'zmrdko', 'zmrdovina', 'zmrducha', 'zmrdovyna',
  'hajzel', 'hajzlik', 'vychcanec', 'scat', 'ostany', 'vystany', 'stanka', 'stanicka', 'ostanstvo', 'stankovost', 'stankovanka', 'stankovana',
  
  // Duševne poruchy a intelekt
  'kreten', 'kretensky', 'kretenstvo', 'kretenka', 'kretenstvo', 'kretuska', 'kretunka', 'kretuska',
  'debil', 'debilny', 'debilný', 'debilska', 'debilstvo', 'debilka', 'debilacka', 'debilovacka', 'debiluvacka', 'debilka',
  'idiot', 'idiót', 'idiotsky', 'idiotstvo', 'idiotka', 'idiotka', 'iditicka', 'iditicko', 'iditovatko',
  'retard', 'retardovany', 'retardovaný', 'retardovacka', 'retardka', 'retardovina', 'retardovnost', 'retarduvacka',
  'mentalo', 'mentalak', 'mentalny', 'mentalna', 'mentalka', 'mentalnacka', 'mentalovacka',
  'postihnuty', 'postihnutost', 'postihnutacka', 'postihnutenosť',
  'mongol', 'mongolsky', 'mongolstva', 'mongolka', 'mongolacka', 'mongolovacka',
  
  // Hmyz a zvieratá - ako nadávka
  'vsa', 'vsacka', 'vsacko', 'vsatko', 'vsinka', 'vsilka', 'vsilko', 'vsovnik', 'vsovka',
  'parazit', 'parazitka', 'parazitny', 'parazitstvo', 'parazitacka', 'parazitovacka',
  'krysa', 'krysacka', 'krysacko', 'krysatko', 'krysinka', 'krysistka', 'krysitko',
  'potkan', 'potkanka', 'potkanstvo', 'potkansky', 'potkanacka', 'potkanck',
  'skor', 'skorminka', 'skormanka', 'skorinka', 'skoanka', 'skorovacka',
  'vrana', 'vranacka', 'vranacko', 'vranista', 'vranistka', 'vranika',
  'vranica', 'vranicka', 'vranicko', 'vranickova',
  
  // Socilne/etnicke
  'cigany', 'cigan', 'ciganka', 'cigáň', 'cigansky', 'ciganisko', 'ciganstvi', 'ciganstvo', 'ciganacka', 'ciganuckova', 'cigankovska', 'cigankovacka',
  'žid', 'židy', 'židovský', 'židostvi', 'židovstvo', 'židovka', 'židovska', 'židovacka', 'židovckova',
  'černoch', 'cernocha', 'cernochas', 'cernochovacka', 'cernochovanka', 'cernochovacko',
  'gadzo', 'gadzovacka', 'gadzovanka', 'gadzo', 'gadžo',
  'deges', 'degeško', 'degesstvo', 'degesovacka', 'degesovanka',
  
  // Fyzicke/zdravotne
  'kulhavec', 'kulhavka', 'kulhavost', 'kulhavacka', 'kulhavankova',
  'slepo', 'slepý', 'slepacka', 'slepacko', 'sleposta', 'slepovacka', 'slepovanka',
  'hluchý', 'hluchacka', 'hluchacko', 'hluchosta', 'hluchovacka', 'hluchovanost',
  'skap', 'skapaty', 'skapat', 'skaposť', 'skapovacka', 'skapovanka', 'skapovankova',
  'zdochnuty', 'zdochnuta', 'zdochost', 'zdochovacka', 'zdochovanka', 'zdochovankova',
  'mrtvola', 'mrvola', 'mrtvolan', 'mrtvoly', 'mrtvoly', 'mrvolan', 'mrvolanka',
  
  // Slang a prikryta
  'klucháč', 'klúcháč', 'kluchacka', 'kluchackova', 'kluchackost',
  'buran', 'buranacka', 'buranacko', 'buranista', 'buranistka', 'buranstvo',
  'budala', 'budalka', 'budalstvo', 'budalacka', 'budalacko', 'budalovatko',
  'skrota', 'skrotok', 'skrotacka', 'skrotacko', 'skrotovacka', 'skrotovanka',
  'trtko', 'trtkat', 'vytrtkat', 'dotrtkat', 'trtkovacka', 'trtkovanka', 'trtkovina',
  'suvix', 'suvixacka', 'suvixacko', 'suvixovacka', 'suvixovanka', 'suvixovina',
  'trulo', 'trulova', 'trulovska', 'trulovacka', 'trulovanka', 'trulovacko',
  'mamlas', 'mamlaska', 'mamlasko', 'mamlasacka', 'mamlasacko', 'mamlasin',
  'obuch', 'obucha', 'obuchy', 'obuchacka', 'obuchacko', 'obuchovina',
  'tenko', 'tenkovinacka', 'tenkovacka', 'tenkovanka', 'tenkovacko',
  
  // Razne
  'hovado', 'hovaď', 'hovädko', 'hovadoňa', 'hovadstvo', 'hovadacka', 'hovadacko', 'hovadovacka',
  'buzerant', 'buzna', 'teply', 'buzik', 'buzerantsky', 'buzerovat', 'buzovacka', 'buzovanka', 'buzovankova',
  'svinstvo', 'svinský', 'svinčí', 'svinčo', 'svinčota', 'svinacka', 'svinacko', 'svinacka', 'svinovacka',
  'smrada', 'smradoch', 'smradka', 'smrad', 'smradny', 'smradivost', 'smradovacka', 'smradovanka',
  'chudak', 'chudacka', 'chudacko', 'chuderák', 'chudacka', 'chudacko', 'chudovacka', 'chudovanka',
  'zebrak', 'zebrakov', 'vyzebrakovany', 'zebrakovacka', 'zebrakovanka', 'zebrakovina',
  'genital', 'genitalia', 'genitalna', 'genitalny', 'genitalova', 'genitalovna', 'genitalovinacka',
  'onanista', 'onanistka', 'onanizovanie', 'onanizovacka', 'onanizovanka', 'onanizovankova',
  'honibrk', 'honibrkacka', 'honibrkacko', 'honibrkovacka', 'honibrkovanka', 'honibrkovankova',
  
  // Viacslové nadávky
  'ty vole', 'ty kurva', 'ty svinstvo', 'ty zmrd', 'ty debile', 'ty idiote', 'ty kretene', 'ty hajzle',
  'do piče', 'do pice', 'do prdele', 'do piče tvoja', 'do piče tvojej matky', 'do piče vos',
  'kurva tvoja', 'svinstvo tvoje', 'zmrd jeden', 'hajzel jeden',
  'vy kurvi', 'vy svine', 'vy hovada', 'vy budali', 'vy skroty', 'vy chuderaky', 'vy chudinski', 'vy kravacci',
  'jaras sa', 'jebnem sa', 'pojebem sa', 'dojebem sa',
  
  // Anglicke nadavky a vulgarizmy
  'fuck', 'fucked', 'fucker', 'fucking', 'fuckwit', 'fuckhead', 'mindfuck', 'shithole', 'shitty', 'shit', 'asshole', 'bastard', 'bitch', 'bitches', 'bitchy', 'crap', 'crappy', 'dick', 'dicks', 'dickwad', 'dickhead', 'damn', 'damned', 'goddamn', 'hell', 'piss', 'pisses', 'pissed', 'pissant', 'cock', 'cocksucking', 'cocksucker', 'balls', 'ballbag', 'arse', 'arsehole', 'asshat', 'ass', 'sucks', 'suck',
  
  // Ďalšie slova s české/moravske nadavky
  'debilní', 'debilního', 'debilníka', 'debilnímu', 'debilník', 'debilníka', 'kretén', 'kretén', 'kretého', 'kreténu', 'hajzele',
  
  // Skratky a sleng
  'wft', 'wtf', 'stfu', 'lol', 'omfg'
];
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

function checkProfanity(text) {
  const lowerText = text.toLowerCase();
  for (const word of BANNED_WORDS) {
    if (lowerText.includes(word)) {
      return word;
    }
  }
  return null;
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

  const bannedWord = checkProfanity(txt);
  if (bannedWord) {
    showErrorMessage(bannedWord);
    shake(document.getElementById('txt'));
    return;
  }

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

// ── ERROR MESSAGE ───────────────────────────────────────
function showErrorMessage(word) {
  const container = document.getElementById('toast');
  const oldHTML = container.innerHTML;
  container.innerHTML = `<span>${word} nie je povolené</span>`;
  container.classList.add('show');
  setTimeout(() => {
    container.innerHTML = oldHTML;
    container.classList.remove('show');
  }, 3000);
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