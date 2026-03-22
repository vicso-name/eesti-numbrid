const CACHE_NAME = 'numbrid-v6';
const STATIC = ['./', './index.html', './styles.css', './app.js', './manifest.json'];

// Generate audio file list
const nums = [
  {n:1,et:'üks',ord:'esimene'},{n:2,et:'kaks',ord:'teine'},{n:3,et:'kolm',ord:'kolmas'},
  {n:4,et:'neli',ord:'neljas'},{n:5,et:'viis',ord:'viies'},{n:6,et:'kuus',ord:'kuues'},
  {n:7,et:'seitse',ord:'seitsmes'},{n:8,et:'kaheksa',ord:'kaheksas'},{n:9,et:'üheksa',ord:'üheksas'},
  {n:10,et:'kümme',ord:'kümnes'},
  {n:11,et:'üksteist',ord:'üheteistkümnes'},{n:12,et:'kaksteist',ord:'kaheteistkümnes'},
  {n:13,et:'kolmteist',ord:'kolmeteistkümnes'},{n:14,et:'neliteist',ord:'neljateistkümnes'},
  {n:15,et:'viisteist',ord:'viieteistkümnes'},{n:16,et:'kuusteist',ord:'kuueteistkümnes'},
  {n:17,et:'seitseteist',ord:'seitsmeteistkümnes'},{n:18,et:'kaheksateist',ord:'kaheksateistkümnes'},
  {n:19,et:'üheksateist',ord:'üheksateistkümnes'},
  {n:20,et:'kakskümmend',ord:'kahekümnes'},{n:30,et:'kolmkümmend',ord:'kolmekümnes'},
  {n:40,et:'nelikümmend',ord:'neljakümnes'},{n:50,et:'viiskümmend',ord:'viiekümnes'},
  {n:60,et:'kuuskümmend',ord:'kuuekümnes'},{n:70,et:'seitsekümmend',ord:'seitsmekümnes'},
  {n:80,et:'kaheksakümmend',ord:'kaheksakümnes'},{n:90,et:'üheksakümmend',ord:'üheksakümnes'},
  {n:100,et:'sada',ord:'sajas'}
];
const nouns = [{nom:'õun',part:'õuna'},{nom:'raamat',part:'raamatut'},{nom:'koer',part:'koera'},{nom:'kass',part:'kassi'}];

const toFile = t => {
  let n = t.toLowerCase().trim().replace(/[?.!,]/g,'').trim().replace(/[^a-zõäöü0-9\s]/g,'').replace(/\s+/g,'_');
  return './audio/' + n + '.mp3';
};

const AUDIO = [];
nums.forEach(num => {
  AUDIO.push(toFile(num.et));
  if (num.ord) AUDIO.push(toFile(num.ord));
  if (num.n >= 1 && num.n <= 19) {
    nouns.forEach(noun => {
      const nf = num.n === 1 ? noun.nom : noun.part;
      AUDIO.push(toFile(`Mul on ${num.et} ${nf}`));
    });
  }
});

const ALL = [...STATIC, ...new Set(AUDIO)];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ALL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    if (r.ok) { const cl = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, cl)); }
    return r;
  })).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
});