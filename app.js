// ═══════════════════════════════════════════
// Eesti Numbrid — Estonian Numbers Trainer
// Architecture: BLUEPRINT.md (pronoun-olema-drill pattern)
// ═══════════════════════════════════════════

// ── DATA ──
const NUMBERS = [
  {n:1, et:'üks', ru:'один', ord:'esimene', ordRu:'первый'},
  {n:2, et:'kaks', ru:'два', ord:'teine', ordRu:'второй'},
  {n:3, et:'kolm', ru:'три', ord:'kolmas', ordRu:'третий'},
  {n:4, et:'neli', ru:'четыре', ord:'neljas', ordRu:'четвёртый'},
  {n:5, et:'viis', ru:'пять', ord:'viies', ordRu:'пятый'},
  {n:6, et:'kuus', ru:'шесть', ord:'kuues', ordRu:'шестой'},
  {n:7, et:'seitse', ru:'семь', ord:'seitsmes', ordRu:'седьмой'},
  {n:8, et:'kaheksa', ru:'восемь', ord:'kaheksas', ordRu:'восьмой'},
  {n:9, et:'üheksa', ru:'девять', ord:'üheksas', ordRu:'девятый'},
  {n:10, et:'kümme', ru:'десять', ord:'kümnes', ordRu:'десятый'},
  {n:11, et:'üksteist', ru:'одиннадцать', ord:'üheteistkümnes', ordRu:'одиннадцатый'},
  {n:12, et:'kaksteist', ru:'двенадцать', ord:'kaheteistkümnes', ordRu:'двенадцатый'},
  {n:13, et:'kolmteist', ru:'тринадцать', ord:'kolmeteistkümnes', ordRu:'тринадцатый'},
  {n:14, et:'neliteist', ru:'четырнадцать', ord:'neljateistkümnes', ordRu:'четырнадцатый'},
  {n:15, et:'viisteist', ru:'пятнадцать', ord:'viieteistkümnes', ordRu:'пятнадцатый'},
  {n:16, et:'kuusteist', ru:'шестнадцать', ord:'kuueteistkümnes', ordRu:'шестнадцатый'},
  {n:17, et:'seitseteist', ru:'семнадцать', ord:'seitsmeteistkümnes', ordRu:'семнадцатый'},
  {n:18, et:'kaheksateist', ru:'восемнадцать', ord:'kaheksateistkümnes', ordRu:'восемнадцатый'},
  {n:19, et:'üheksateist', ru:'девятнадцать', ord:'üheksateistkümnes', ordRu:'девятнадцатый'},
  {n:20, et:'kakskümmend', ru:'двадцать', ord:'kahekümnes', ordRu:'двадцатый'},
  {n:30, et:'kolmkümmend', ru:'тридцать', ord:'kolmekümnes', ordRu:'тридцатый'},
  {n:40, et:'nelikümmend', ru:'сорок', ord:'neljakümnes', ordRu:'сороковой'},
  {n:50, et:'viiskümmend', ru:'пятьдесят', ord:'viiekümnes', ordRu:'пятидесятый'},
  {n:60, et:'kuuskümmend', ru:'шестьдесят', ord:'kuuekümnes', ordRu:'шестидесятый'},
  {n:70, et:'seitsekümmend', ru:'семьдесят', ord:'seitsmekümnes', ordRu:'семидесятый'},
  {n:80, et:'kaheksakümmend', ru:'восемьдесят', ord:'kaheksakümnes', ordRu:'восьмидесятый'},
  {n:90, et:'üheksakümmend', ru:'девяносто', ord:'üheksakümnes', ordRu:'девяностый'},
  {n:100, et:'sada', ru:'сто', ord:'sajas', ordRu:'сотый'},
];

// Nouns for sentences
// ruOne: "одно яблоко" (nom with correct gender of один)
// ruGen: genitive sg for 2-4 ("два яблока")
// ruGenPl: genitive pl for 5+ ("пять яблок")
const NOUNS = [
  {nom:'õun', part:'õuna', gender:'n', ruOne:'одно яблоко', ruGen:'яблока', ruGenPl:'яблок'},
  {nom:'raamat', part:'raamatut', gender:'f', ruOne:'одна книга', ruGen:'книги', ruGenPl:'книг'},
  {nom:'koer', part:'koera', gender:'f', ruOne:'одна собака', ruGen:'собаки', ruGenPl:'собак'},
  {nom:'kass', part:'kassi', gender:'f', ruOne:'одна кошка', ruGen:'кошки', ruGenPl:'кошек'},
];

const SAVE_KEY = 'numbrid_save';
const TOTAL = 50;
const UP = 2;
const MAXLVL = 2;

// ── HELPERS ──
function $(id){return document.getElementById(id);}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function unique(a){return[...new Set(a)];}
function normalize(s){return String(s||'').toLowerCase().replace(/[?.!,]/g,'').replace(/\s+/g,' ').trim();}
function showScr(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');}
function showToast(text){const t=$('toast');t.textContent=text;t.classList.add('show');clearTimeout(showToast._t);showToast._t=setTimeout(()=>t.classList.remove('show'),1600);}

// Number helpers
function getNum(n){return NUMBERS.find(x=>x.n===n);}
function hasOrd(num){return !!num.ord;}
function nums1to10(){return NUMBERS.filter(x=>x.n>=1&&x.n<=10);}
function nums11to19(){return NUMBERS.filter(x=>x.n>=11&&x.n<=19);}
function numsTens(){return NUMBERS.filter(x=>x.n>=20);}
function numsWithOrd(){return NUMBERS.filter(x=>!!x.ord);}
// Numbers suitable for sentences (1-19)
function numsSentence(){return NUMBERS.filter(x=>x.n>=1&&x.n<=19);}

// ── AUDIO ──
function getAudioFile(text){
  let name=text.toLowerCase().trim().replace(/[?.!,]/g,'').trim();
  name=name.replace(/[^a-zõäöü0-9\s]/g,'');
  name=name.replace(/\s+/g,'_').trim();
  return 'audio/'+name+'.mp3';
}
let currentAudio=null;
function playAudio(text){
  return new Promise(resolve=>{
    if(currentAudio){currentAudio.pause();currentAudio=null;}
    currentAudio=new Audio(getAudioFile(text));
    currentAudio.onended=resolve;
    currentAudio.onerror=resolve;
    currentAudio.play().catch(resolve);
  });
}
function stopAudio(){if(currentAudio){currentAudio.pause();currentAudio=null;}}

function getRuNumeral(num, noun) {
  if (num.n === 2) {
    return noun.gender === 'f' ? 'две' : 'два';
  }
  return num.ru;
}

// ── SENTENCE BUILDER ──
function makeSentence(num, noun) {
  const nounForm = num.n === 1 ? noun.nom : noun.part;
  const et = `Mul on ${num.et} ${nounForm}`;

  let ru;
  if (num.n === 1) {
    ru = `У меня ${noun.ruOne}`;
  } else if (num.n >= 2 && num.n <= 4) {
    ru = `У меня ${getRuNumeral(num, noun)} ${noun.ruGen}`;
  } else {
    ru = `У меня ${num.ru} ${noun.ruGenPl}`;
  }

  return { et, ru, words: ['Mul', 'on', num.et, nounForm] };
}

// ── SM-2 / SKILL STATE ──
let skillState = {};
let correct=0, wrong=0, streak=0, best=0, qNum=0, ans=false, curEx=null;

function initSkills(){
  skillState={};
  // Skills: each number has forms: cardinal, ordinal (if exists), sentence (if 1-19)
  NUMBERS.forEach(num=>{
    // Cardinal: "7 → seitse"
    skillState[`n${num.n}_card`]={level:0,streak:0,done:false,ef:2.5,interval:0,reps:0,nextReview:0,lastReview:0,totalCorrect:0,totalWrong:0};
    // Ordinal: "7th → seitsmes" (only 1-10)
    if(num.ord){
      skillState[`n${num.n}_ord`]={level:0,streak:0,done:false,ef:2.5,interval:0,reps:0,nextReview:0,lastReview:0,totalCorrect:0,totalWrong:0};
    }
    // Sentence: "Mul on seitse õuna" (only 1-19)
    if(num.n>=1 && num.n<=19){
      skillState[`n${num.n}_sent`]={level:0,streak:0,done:false,ef:2.5,interval:0,reps:0,nextReview:0,lastReview:0,totalCorrect:0,totalWrong:0};
    }
  });
}

function saveProgress(){
  try{localStorage.setItem(SAVE_KEY,JSON.stringify({skillState,correct,wrong,best,total:correct+wrong,ts:Date.now()}));}catch(e){}
}
function loadProgress(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(data.skillState){Object.values(data.skillState).forEach(sk=>{
      if(sk.ef===undefined)sk.ef=2.5;if(sk.interval===undefined)sk.interval=0;
      if(sk.reps===undefined)sk.reps=0;if(sk.nextReview===undefined)sk.nextReview=0;
      if(sk.lastReview===undefined)sk.lastReview=0;if(sk.totalCorrect===undefined)sk.totalCorrect=0;
      if(sk.totalWrong===undefined)sk.totalWrong=0;
    });}
    return data;
  }catch(e){return null;}
}
function hasSave(){const d=loadProgress();return d&&d.skillState&&Object.values(d.skillState).some(s=>s.lastReview>0);}

function checkSaved(){
  let contBtn=$('continueBtn');
  if(!contBtn){
    const primary=$('startBtn');
    contBtn=document.createElement('button');contBtn.id='continueBtn';
    contBtn.className='btn btn-secondary';
    contBtn.addEventListener('click',()=>startGame(true));
    primary.parentNode.insertBefore(contBtn,primary.nextSibling);
  }
  if(hasSave()){
    const d=loadProgress();const now=Date.now();
    const skills=Object.values(d.skillState);
    const mastered=skills.filter(s=>s.done).length;
    const due=skills.filter(s=>s.lastReview>0&&s.nextReview<=now).length;
    const fresh=skills.filter(s=>s.reps===0&&s.lastReview===0).length;
    contBtn.style.display='';
    if(due>0)contBtn.textContent=`Повторить (${due} на повторение)`;
    else if(fresh>0)contBtn.textContent=`Продолжить (${fresh} новых)`;
    else contBtn.textContent=`Продолжить (${mastered} освоено)`;
  }else{contBtn.style.display='none';}
}

// ── PICK SKILL (SM-2 aware) ──
function pickSkill(){
  const now=Date.now();
  const entries=Object.entries(skillState);
  const fresh=entries.filter(([_,s])=>s.reps===0&&s.lastReview===0);
  const overdue=entries.filter(([_,s])=>s.lastReview>0&&s.nextReview<=now).sort((a,b)=>a[1].nextReview-b[1].nextReview);
  const upcoming=entries.filter(([_,s])=>s.lastReview>0&&s.nextReview>now).sort((a,b)=>a[1].nextReview-b[1].nextReview);
  let pool=overdue.length?overdue:fresh.length?fresh:upcoming.length?upcoming:null;
  if(!pool)return null;
  const weighted=[];
  pool.slice(0,10).forEach(([key,s])=>{
    const w=Math.max(1,(3-s.level)+(s.ef<2?3:s.ef<2.5?2:1)+(s.totalWrong>s.totalCorrect?2:1));
    for(let i=0;i<w;i++)weighted.push(key);
  });
  return weighted[Math.floor(Math.random()*weighted.length)];
}

// ── EXERCISE GENERATORS ──

function parseSkillKey(key){
  // "n7_card" → {num: {n:7,...}, form: 'card'}
  const m=key.match(/^n(\d+)_(\w+)$/);
  if(!m)return null;
  return{num:getNum(parseInt(m[1])),form:m[2]};
}

// Choice: number → word
function makeChoiceNumToWord(num,key){
  const wrongs=shuffle(NUMBERS.filter(x=>x.et!==num.et)).slice(0,3).map(x=>x.et);
  return{type:'choice',label:'Как будет по-эстонски?',qText:`${num.n}`,qRu:`${num.ru}`,
    answer:num.et,options:shuffle([num.et,...wrongs]),reveal:num.et,_skillKey:key};
}

// Choice: word → number
function makeChoiceWordToNum(num,key){
  const wrongs=shuffle(NUMBERS.filter(x=>x.n!==num.n)).slice(0,3).map(x=>String(x.n));
  return{type:'choice',label:'Какое это число?',qText:num.et,qRu:'',
    answer:String(num.n),options:shuffle([String(num.n),...wrongs]),reveal:`${num.et} = ${num.n}`,_skillKey:key};
}

// Choice: ordinal
function makeChoiceOrdinal(num,key){
  const wrongs=shuffle(numsWithOrd().filter(x=>x.n!==num.n)).slice(0,3).map(x=>x.ord);
  return{type:'choice',label:'Порядковое числительное',qText:`${num.n}-й (${num.ordRu})`,qRu:'',
    answer:num.ord,options:shuffle([num.ord,...wrongs]),reveal:`${num.ordRu} = ${num.ord}`,_skillKey:key};
}

// Choice: sentence — pick the number word
function makeChoiceSentence(num,key){
  const noun=pick(NOUNS);
  const s=makeSentence(num,noun);
  const wrongs=shuffle(numsSentence().filter(x=>x.n!==num.n)).slice(0,3).map(x=>x.et);
  const nounForm=num.n===1?noun.nom:noun.part;
  return{type:'choice',label:'Вставь число',qText:`Mul on ___ ${nounForm}`,qRu:s.ru,
    answer:num.et,options:shuffle([num.et,...wrongs]),reveal:s.et,_skillKey:key};
}

// Build: sentence
function makeBuildSentence(num,key){
  const noun=pick(NOUNS);
  const s=makeSentence(num,noun);
  const distractors=[];
  const extra=pick(NUMBERS.filter(x=>x.n!==num.n));
  if(extra)distractors.push(extra.et);
  const wrongNoun=pick(NOUNS.filter(x=>x.nom!==noun.nom));
  if(wrongNoun)distractors.push(num.n===1?wrongNoun.nom:wrongNoun.part);
  return{type:'build',label:'Собери предложение',qRu:s.ru,answer:s.words,
    bank:shuffle([...s.words,...distractors.slice(0,2)]),reveal:s.et,_skillKey:key};
}

// Build: number word from hint
function makeBuildNumber(num,key){
  // Show the digit, build the word letter groups
  // Split word into chunks for building
  const word=num.et;
  let chunks=[];
  if(word.length<=5){chunks=[word];}
  else{
    // Split into 2-3 parts
    const mid=Math.ceil(word.length/2);
    chunks=[word.slice(0,mid),word.slice(mid)];
  }
  // Add distractor chunks
  const other=pick(NUMBERS.filter(x=>x.et!==num.et&&x.et.length>3));
  const otherChunks=other?[other.et.slice(0,Math.ceil(other.et.length/2))]:[];
  // Actually, for build let's use sentence building as it's more useful
  // Fall back to sentence
  const noun=pick(NOUNS);
  const s=makeSentence(num,noun);
  const extra=pick(NUMBERS.filter(x=>x.n!==num.n));
  const distractors=[extra?extra.et:'null'].filter(x=>x!=='null');
  return{type:'build',label:'Собери предложение',qRu:s.ru,answer:s.words,
    bank:shuffle([...s.words,...distractors]),reveal:s.et,_skillKey:key};
}

// Typing: digit → write word
function makeTypingNumToWord(num,key){
  return{type:'typing',label:'Напиши число словом',qText:`Напиши по-эстонски: ${num.n}`,qRu:num.ru,
    answer:normalize(num.et),reveal:num.et,_skillKey:key};
}

// Typing: ordinal
function makeTypingOrdinal(num,key){
  return{type:'typing',label:'Напиши порядковое',qText:`Напиши по-эстонски: ${num.n}-й`,qRu:num.ordRu,
    answer:normalize(num.ord),reveal:num.ord,_skillKey:key};
}

// Typing: translate sentence
function makeTypingSentence(num,key){
  const noun=pick(NOUNS);
  const s=makeSentence(num,noun);
  return{type:'typing',label:'Переведи на эстонский',qText:'Переведи:',qRu:s.ru,
    answer:normalize(s.et),reveal:s.et,_skillKey:key};
}

// Typing: RU word → ET word
function makeTypingRuToEt(num,key){
  return{type:'typing',label:'Переведи число',qText:`${num.ru} по-эстонски:`,qRu:'',
    answer:normalize(num.et),reveal:num.et,_skillKey:key};
}

// Dictation
function makeDictationNumber(num,key){
  return{type:'dictation',label:'Аудио-диктант',qText:'Послушай и напиши число:',
    audioSentence:num.et,answer:normalize(num.et),reveal:num.et,_skillKey:key};
}

function makeDictationSentence(num,key){
  const noun=pick(NOUNS);
  const s=makeSentence(num,noun);
  return{type:'dictation',label:'Аудио-диктант',qText:'Послушай и напиши:',
    audioSentence:s.et,answer:normalize(s.et),reveal:s.et,_skillKey:key};
}

// ── EXERCISE ROUTING ──
function makeExForSkill(skillKey){
  const parsed=parseSkillKey(skillKey);
  if(!parsed)return makeChoiceNumToWord(pick(NUMBERS),skillKey);
  const{num,form}=parsed;
  const roll=Math.random();

  // Progressive distribution
  let choiceP,buildP;
  if(qNum<=10){choiceP=0.80;buildP=0.95;}
  else if(qNum<=25){choiceP=0.40;buildP=0.65;}
  else{choiceP=0.15;buildP=0.30;}

  if(form==='card'){
    if(roll<choiceP){
      return Math.random()>0.5?makeChoiceNumToWord(num,skillKey):makeChoiceWordToNum(num,skillKey);
    }
    if(roll<buildP&&num.n<=19){
      return makeBuildSentence(num,skillKey);
    }
    // typing
    return pick([makeTypingNumToWord,makeTypingRuToEt,
      ...(num.n<=19?[makeDictationNumber]:[])
    ])(num,skillKey);
  }

  if(form==='ord'){
    if(roll<choiceP)return makeChoiceOrdinal(num,skillKey);
    if(roll<buildP)return makeBuildSentence(num,skillKey);
    return makeTypingOrdinal(num,skillKey);
  }

  if(form==='sent'){
    if(roll<choiceP)return makeChoiceSentence(num,skillKey);
    if(roll<buildP)return makeBuildSentence(num,skillKey);
    return pick([makeTypingSentence,makeDictationSentence])(num,skillKey);
  }

  return makeChoiceNumToWord(num,skillKey);
}

// ── GAME FLOW ──
function startGame(resume=false){
  if(resume&&hasSave()){
    const d=loadProgress();
    skillState=d.skillState;correct=d.correct||0;wrong=d.wrong||0;best=d.best||0;
  }else{
    initSkills();correct=0;wrong=0;best=0;
  }
  streak=0;qNum=0;ans=false;curEx=null;
  $('resultBarFill').style.width='0%';
  closePauseModal();
  showScr('gameScreen');
  nextQ();
}

function nextQ(){
  if(qNum>=TOTAL){showResults();return;}
  const sk=pickSkill();
  if(!sk){showResults();return;}
  curEx=makeExForSkill(sk);
  qNum++;
  renderEx();
}

function renderEx(){
  ans=false;
  const ex=curEx;
  const card=$('questionCard');
  card.classList.remove('animate-in');void card.offsetWidth;card.classList.add('animate-in');
  $('correctReveal').textContent='';
  $('nextBtn').style.display='none';
  $('qHint').textContent='';
  $('exerciseTypeLabel').textContent=ex.label||'Задание';
  $('qText').textContent=ex.qText||'';
  if(ex.qRu&&ex.qRu.length>0){$('qRu').textContent=ex.qRu;$('qRu').style.display='';}
  else{$('qRu').style.display='none';}
  $('exerciseArea').innerHTML='';
  stopAudio();hideReplayBtn();
  if(ex.type==='choice')renderChoice(ex);
  if(ex.type==='build')renderBuild(ex);
  if(ex.type==='typing')renderTyping(ex);
  if(ex.type==='dictation')renderDictation(ex);
  updStats();
}

// ── RENDERERS ──
function renderChoice(ex){
  const wrap=document.createElement('div');wrap.className='options';
  ex.options.forEach(opt=>{
    const b=document.createElement('button');b.className='option-btn';b.textContent=opt;b.dataset.value=opt;
    b.addEventListener('click',()=>{
      if(ans)return;ans=true;
      const ok=opt===ex.answer;
      wrap.querySelectorAll('.option-btn').forEach(btn=>{
        btn.disabled=true;
        if(btn.dataset.value===ex.answer)btn.classList.add('correct-answer');
        else if(btn===b&&!ok)btn.classList.add('wrong-answer');
        else btn.classList.add('dimmed');
      });
      proc(ok);
    });
    wrap.appendChild(b);
  });
  $('exerciseArea').appendChild(wrap);
}

function renderBuild(ex){
  $('qText').textContent='Собери предложение:';
  const target=document.createElement('div');target.className='build-target';
  const bank=document.createElement('div');bank.className='word-bank';
  const submit=document.createElement('button');submit.className='build-submit';submit.textContent='Проверить';submit.disabled=true;
  const selected=[];
  ex.bank.forEach((word,index)=>{
    const chip=document.createElement('span');chip.className='word-chip';chip.textContent=word;chip.dataset.idx=index;
    chip.addEventListener('click',()=>{
      if(ans||chip.classList.contains('used'))return;
      chip.classList.add('used');selected.push({word,index});renderTarget();
    });
    bank.appendChild(chip);
  });
  function renderTarget(){
    target.innerHTML='';submit.disabled=selected.length===0;
    selected.forEach((item,i)=>{
      const chip=document.createElement('span');chip.className='word-chip in-target';chip.textContent=item.word;
      chip.addEventListener('click',()=>{
        if(ans)return;selected.splice(i,1);
        const orig=bank.querySelector(`.word-chip[data-idx="${item.index}"]`);
        if(orig)orig.classList.remove('used');renderTarget();
      });
      target.appendChild(chip);
    });
  }
  submit.addEventListener('click',()=>{
    if(ans||selected.length===0)return;ans=true;
    const built=selected.map(i=>i.word).join(' ');
    const ok=built===ex.answer.join(' ');
    target.classList.add(ok?'correct':'wrong');
    if(!ok)$('correctReveal').textContent=`Правильный вариант: ${ex.reveal}`;
    bank.querySelectorAll('.word-chip').forEach(c=>c.style.pointerEvents='none');
    submit.style.display='none';proc(ok);
  });
  $('exerciseArea').appendChild(target);
  $('exerciseArea').appendChild(bank);
  $('exerciseArea').appendChild(submit);
}

function renderTyping(ex){
  if(ex.source){const src=document.createElement('div');src.className='transform-source';src.textContent=ex.source;$('exerciseArea').appendChild(src);}
  const wrap=document.createElement('div');wrap.className='typing-area';
  const inp=document.createElement('input');inp.type='text';inp.className='typing-input';inp.placeholder='Напиши по-эстонски...';inp.autocomplete='off';inp.spellcheck=false;
  const btn=document.createElement('button');btn.className='typing-submit';btn.textContent='Проверить';
  btn.addEventListener('click',()=>checkTyping(inp,ex,btn));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')checkTyping(inp,ex,btn);});
  wrap.appendChild(inp);wrap.appendChild(btn);$('exerciseArea').appendChild(wrap);
  setTimeout(()=>inp.focus(),80);
}

function checkTyping(inp,ex,btn){
  if(ans)return;const val=normalize(inp.value);if(!val){showToast('Сначала введи ответ');return;}
  ans=true;inp.disabled=true;if(btn)btn.style.display='none';
  const ok=val===normalize(ex.answer);
  inp.classList.add(ok?'correct':'wrong');
  if(!ok){inp.classList.add('shake');$('correctReveal').textContent=`Правильный вариант: ${ex.reveal}`;}
  proc(ok);
}

function renderDictation(ex){
  $('qRu').style.display='none';
  const area=$('exerciseArea');
  const playRow=document.createElement('div');playRow.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:16px;';
  const playBtn=document.createElement('button');playBtn.className='btn btn-secondary';
  playBtn.style.cssText='width:auto;padding:12px 20px;font-size:1.2rem;';playBtn.textContent='🔊 Послушать';
  playBtn.addEventListener('click',()=>playAudio(ex.audioSentence));
  playRow.appendChild(playBtn);area.appendChild(playRow);
  setTimeout(()=>playAudio(ex.audioSentence),300);
  const wrap=document.createElement('div');wrap.className='typing-area';
  const inp=document.createElement('input');inp.type='text';inp.className='typing-input';inp.placeholder='Напиши что услышал(а)...';inp.autocomplete='off';inp.spellcheck=false;
  const btn=document.createElement('button');btn.className='typing-submit';btn.textContent='Проверить';
  btn.addEventListener('click',()=>checkTyping(inp,ex,btn));
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')checkTyping(inp,ex,btn);});
  wrap.appendChild(inp);wrap.appendChild(btn);area.appendChild(wrap);
  setTimeout(()=>inp.focus(),400);
}

function showReplayBtn(sentence){
  hideReplayBtn();
  const row=document.createElement('div');row.id='audioReplayRow';
  row.style.cssText='display:flex;align-items:center;justify-content:center;gap:10px;margin-top:10px;';
  const btn=document.createElement('button');btn.className='btn btn-secondary';
  btn.style.cssText='width:auto;padding:8px 16px;font-size:0.85rem;';btn.textContent='🔊 Послушать';
  btn.addEventListener('click',()=>playAudio(sentence));
  row.appendChild(btn);$('nextBtn').parentNode.insertBefore(row,$('nextBtn'));
}
function hideReplayBtn(){const el=$('audioReplayRow');if(el)el.remove();}

// ── PROC (SM-2) ──
function proc(ok){
  const now=Date.now(),DAY=86400000;
  if(curEx._skillKey&&skillState[curEx._skillKey]){
    const sk=skillState[curEx._skillKey];sk.lastReview=now;
    let quality;
    if(ok){
      if(curEx.type==='typing'||curEx.type==='dictation')quality=5;
      else if(curEx.type==='build')quality=4;
      else quality=3;
    }else{quality=1;}

    if(ok){
      sk.totalCorrect++;sk.streak++;
      if(sk.streak>=UP){if(sk.level<MAXLVL){sk.level++;sk.streak=0;}else{sk.done=true;}}
      if(sk.reps===0)sk.interval=1;
      else if(sk.reps===1)sk.interval=3;
      else sk.interval=Math.round(sk.interval*sk.ef);
      sk.reps++;
      sk.ef=sk.ef+(0.1-(5-quality)*(0.08+(5-quality)*0.02));
      if(sk.ef<1.3)sk.ef=1.3;
      sk.nextReview=now+(sk.interval*DAY);
    }else{
      sk.totalWrong++;sk.streak=0;sk.reps=0;sk.interval=0;
      sk.nextReview=now+(10*60*1000);
      sk.ef=Math.max(1.3,sk.ef-0.2);
      if(sk.level>0)sk.level--;
    }
  }
  if(ok){correct++;streak++;if(streak>best)best=streak;}
  else{wrong++;streak=0;}

  gamifyOnAnswer(ok,curEx.type);
  updStats();saveProgress();

  const sentence=curEx.reveal||curEx.audioSentence||'';
  const nextBtn=$('nextBtn');
  nextBtn.textContent=qNum>=TOTAL?'Результаты':'Далее';
  if(sentence){
    showReplayBtn(sentence);
    setTimeout(()=>{playAudio(sentence).then(()=>{nextBtn.style.display='block';});},300);
  }else{nextBtn.style.display='block';}
}

// ── STATS ──
function updStats(){
  const answered=correct+wrong;
  const accuracy=answered?Math.round((correct/answered)*100):0;
  const pct=Math.round((qNum/TOTAL)*100);
  $('correctCount').textContent=correct;
  $('wrongCount').textContent=wrong;
  $('streakCount').textContent=streak;
  $('accuracyCount').textContent=`${accuracy}%`;
  $('progressTitle').textContent=`Вопрос ${Math.min(qNum,TOTAL)} из ${TOTAL}`;
  $('progressText').textContent=`${Math.min(qNum,TOTAL)} / ${TOTAL}`;
  $('progressPercent').textContent=`${pct}%`;
  $('progressFill').style.width=`${pct}%`;
  const now=Date.now();
  const due=Object.values(skillState).filter(s=>s.lastReview>0&&s.nextReview<=now).length;
  const mastered=Object.values(skillState).filter(s=>s.done).length;
  const totalSkills=Object.keys(skillState).length;
  $('sessionMeta').textContent=`Освоено: ${mastered}/${totalSkills} · На повторение: ${due}`;
  renderXpBar();
}

// ── PAUSE ──
function openPauseModal(){$('pauseModal').classList.add('show');}
function closePauseModal(){$('pauseModal').classList.remove('show');}
function restartFromPause(){closePauseModal();startGame(false);}
function goHomeFromPause(){closePauseModal();saveProgress();showScr('startScreen');checkSaved();renderStartScreenBadges();refreshHeatmaps();}

// ── RESULTS ──
function showResults(){
  showScr('resultScreen');
  const answered=correct+wrong;const pct=answered?Math.round((correct/answered)*100):0;
  $('resultCorrect').textContent=correct;$('resultWrong').textContent=wrong;
  $('resultBest').textContent=best;$('resultPercent').textContent=`${pct}% точность · ${answered} ответов`;
  let e='🎉',t='Отличный результат!',s='Ты уверенно считаешь по-эстонски!';
  if(pct<40){e='📚';t='Нужна практика';s='Числа запомнятся с повторением.';}
  else if(pct<70){e='💪';t='Хорошее начало';s='Ещё одна сессия — и числа улягутся.';}
  else if(pct<90){e='🔥';t='Очень хорошо!';s='Числа уже почти в автоматизме.';}
  $('resultEmoji').textContent=e;$('resultTitle').textContent=t;$('resultSubtitle').textContent=s;
  setTimeout(()=>{$('resultBarFill').style.width=`${pct}%`;},140);
  gamifyOnSessionEnd();renderResultBadges();refreshHeatmaps();checkSaved();
}

// ═══════════════════════════════════════════
// ── GAMIFICATION
// ═══════════════════════════════════════════
const GAMIFY_KEY='numbrid_gamify';
const XP_TABLE={choice:10,build:20,typing:30,dictation:35};
const BADGES=[
  {id:'first_session',icon:'🌱',name:'Первые шаги',desc:'Заверши первую сессию',check:g=>g.sessionsCompleted>=1},
  {id:'streak_5',icon:'🔥',name:'Разогрев',desc:'5 подряд',check:g=>g.bestSessionStreak>=5},
  {id:'streak_10',icon:'⚡',name:'Молния',desc:'10 подряд',check:g=>g.bestSessionStreak>=10},
  {id:'xp_100',icon:'⭐',name:'Сотня XP',desc:'Набери 100 XP',check:g=>g.xp>=100},
  {id:'xp_500',icon:'🌟',name:'Полтысячи',desc:'Набери 500 XP',check:g=>g.xp>=500},
  {id:'xp_1000',icon:'💎',name:'Тысячник',desc:'1000 XP',check:g=>g.xp>=1000},
  {id:'daily_3',icon:'📅',name:'3 дня подряд',desc:'Занимайся 3 дня',check:g=>g.dailyStreak>=3},
  {id:'daily_7',icon:'🏆',name:'Неделя!',desc:'7 дней подряд',check:g=>g.dailyStreak>=7},
  {id:'correct_50',icon:'📝',name:'Полсотни',desc:'50 верных',check:g=>g.totalCorrect>=50},
  {id:'correct_200',icon:'📚',name:'Книжный червь',desc:'200 верных',check:g=>g.totalCorrect>=200},
  {id:'perfect',icon:'💯',name:'Идеально!',desc:'Сессия без ошибок',check:g=>g.hadPerfectSession},
  {id:'all_card',icon:'🔢',name:'Все числа',desc:'Освой все количественные',check:g=>{
    return NUMBERS.every(num=>skillState[`n${num.n}_card`]?.done);
  }},
  {id:'all_ord',icon:'🏅',name:'Все порядковые',desc:'Освой все порядковые',check:g=>{
    return numsWithOrd().every(num=>skillState[`n${num.n}_ord`]?.done);
  }},
];

let gamifyState=null;
function initGamify(){
  const saved=loadGamify();
  gamifyState=saved||{xp:0,level:1,dailyStreak:0,lastPracticeDate:null,bestDailyStreak:0,sessionsCompleted:0,bestSessionStreak:0,totalCorrect:0,totalWrong:0,hadPerfectSession:false,earnedBadges:[]};
  updateDailyStreak();
}
function loadGamify(){try{const r=localStorage.getItem(GAMIFY_KEY);return r?JSON.parse(r):null;}catch(e){return null;}}
function saveGamify(){try{localStorage.setItem(GAMIFY_KEY,JSON.stringify(gamifyState));}catch(e){}}
function todayStr(){return new Date().toISOString().split('T')[0];}
function updateDailyStreak(){
  if(!gamifyState.lastPracticeDate)return;
  const today=todayStr();if(gamifyState.lastPracticeDate===today)return;
  const y=new Date();y.setDate(y.getDate()-1);
  if(gamifyState.lastPracticeDate<y.toISOString().split('T')[0])gamifyState.dailyStreak=0;
  saveGamify();
}
function recordPracticeToday(){
  const today=todayStr();
  if(gamifyState.lastPracticeDate!==today){
    gamifyState.dailyStreak++;
    if(gamifyState.dailyStreak>gamifyState.bestDailyStreak)gamifyState.bestDailyStreak=gamifyState.dailyStreak;
    gamifyState.lastPracticeDate=today;saveGamify();
  }
}
function getTotalXpForLevel(l){let t=0;for(let i=1;i<l;i++)t+=i*50+(i-1)*20;return t;}
function addXp(amount){
  gamifyState.xp+=amount;
  while(gamifyState.xp>=getTotalXpForLevel(gamifyState.level+1)){gamifyState.level++;showToast(`🎉 Уровень ${gamifyState.level}!`);}
  saveGamify();
}
function gamifyOnAnswer(ok,type){
  recordPracticeToday();
  if(ok){addXp((XP_TABLE[type]||10)+Math.min(streak,10)*2);gamifyState.totalCorrect++;}
  else{gamifyState.totalWrong++;}
  if(streak>gamifyState.bestSessionStreak)gamifyState.bestSessionStreak=streak;
  checkNewBadges();saveGamify();
}
function gamifyOnSessionEnd(){
  gamifyState.sessionsCompleted++;
  if(wrong===0&&correct>=10)gamifyState.hadPerfectSession=true;
  checkNewBadges();saveGamify();
}
function checkNewBadges(){
  BADGES.forEach(b=>{
    if(!gamifyState.earnedBadges.includes(b.id)&&b.check(gamifyState)){
      gamifyState.earnedBadges.push(b.id);showToast(`${b.icon} ${b.name}!`);
    }
  });
}

function renderXpBar(){
  let bar=$('xpBarWidget');
  if(!bar){bar=document.createElement('div');bar.id='xpBarWidget';
    bar.style.cssText='margin-bottom:14px;padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);';
    const stats=document.querySelector('.stats');if(stats)stats.parentNode.insertBefore(bar,stats.nextSibling);
  }
  const g=gamifyState;const cur=getTotalXpForLevel(g.level);const nxt=getTotalXpForLevel(g.level+1);
  const pct=nxt>cur?((g.xp-cur)/(nxt-cur))*100:100;
  bar.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
    <span style="font-size:.78rem;font-weight:800;">⭐ Уровень ${g.level}</span>
    <span style="font-size:.72rem;font-family:'DM Mono',monospace;color:var(--text-dim);">${g.xp} XP${g.dailyStreak>0?' · 🔥 '+g.dailyStreak+' д.':''}</span>
  </div><div style="height:6px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;">
    <div style="height:100%;width:${Math.min(pct,100)}%;border-radius:99px;background:linear-gradient(90deg,var(--accent),var(--accent-2));transition:width .4s;"></div></div>`;
}
function renderStartScreenBadges(){
  let c=$('startBadges');
  if(!c){c=document.createElement('div');c.id='startBadges';c.style.cssText='width:100%;margin-top:8px;';
    const info=document.querySelector('.start-info');if(info)info.parentNode.insertBefore(c,info);}
  const g=gamifyState;if(!g||g.xp===0){c.innerHTML='';return;}
  const earned=BADGES.filter(b=>g.earnedBadges.includes(b.id));
  c.innerHTML=`<div style="padding:14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);text-align:center;">
    <div style="display:flex;justify-content:center;gap:16px;margin-bottom:8px;">
      <span style="font-size:.78rem;font-weight:700;">⭐ Ур. ${g.level}</span>
      <span style="font-size:.78rem;font-weight:700;">${g.xp} XP</span>
      <span style="font-size:.78rem;font-weight:700;">🔥 ${g.dailyStreak} д.</span></div>
    ${earned.length?`<div style="margin-top:6px;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;">${earned.map(b=>`<span title="${b.name}" style="font-size:1.3rem;">${b.icon}</span>`).join('')}</div>`:''}
    <div style="margin-top:6px;font-size:.7rem;color:var(--text-dim);font-family:'DM Mono',monospace;">${earned.length}/${BADGES.length} достижений</div></div>`;
}
function renderResultBadges(){
  let c=$('resultBadges');
  if(!c){c=document.createElement('div');c.id='resultBadges';c.style.cssText='width:100%;margin-top:12px;';
    const rp=$('resultPercent');if(rp)rp.parentNode.insertBefore(c,rp.nextSibling);}
  const g=gamifyState;const earned=BADGES.filter(b=>g.earnedBadges.includes(b.id));
  c.innerHTML=`<div style="padding:14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);text-align:center;">
    <div style="font-size:.78rem;font-weight:700;margin-bottom:8px;">⭐ Уровень ${g.level} · ${g.xp} XP · 🔥 ${g.dailyStreak} д.</div>
    ${earned.length?`<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">${earned.map(b=>`<span title="${b.name}: ${b.desc}" style="font-size:1.5rem;">${b.icon}</span>`).join('')}</div>`:'<div style="font-size:.8rem;color:var(--text-dim);">Продолжай — первые достижения уже близко!</div>'}
  </div>`;
}

// ═══════════════════════════════════════════
// ── ANALYTICS (Heatmap)
// ═══════════════════════════════════════════
function getSkillStrength(sk){
  if(!sk||sk.lastReview===0)return-1;
  const ratio=sk.totalCorrect+sk.totalWrong>0?sk.totalCorrect/(sk.totalCorrect+sk.totalWrong):0;
  const efS=(sk.ef-1.3)/(2.5-1.3);const lvlS=sk.level/MAXLVL;const repS=Math.min(sk.reps/5,1);
  return Math.round(ratio*30+efS*25+lvlS*25+repS*20);
}
function sColor(s){
  if(s<0)return'rgba(255,255,255,.04)';if(s<25)return'rgba(255,107,122,.35)';
  if(s<50)return'rgba(255,204,102,.30)';if(s<75)return'rgba(14,165,233,.25)';return'rgba(6,214,160,.30)';
}
function sBorder(s){
  if(s<0)return'rgba(255,255,255,.06)';if(s<25)return'rgba(255,107,122,.4)';
  if(s<50)return'rgba(255,204,102,.35)';if(s<75)return'rgba(14,165,233,.3)';return'rgba(6,214,160,.35)';
}

function renderHeatmap(containerId){
  const c=$(containerId);if(!c)return;
  const anyReviewed=Object.values(skillState).some(s=>s.lastReview>0);
  if(!anyReviewed){c.innerHTML=`<div style="padding:16px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);text-align:center;">
    <div style="font-size:.82rem;color:var(--text-dim);">Пройди хотя бы одну сессию — и здесь появится карта знаний</div></div>`;return;}

  // Group: 1-10 (card+ord+sent), 11-19 (card+sent), tens (card only)
  let html=`<div style="padding:16px;border-radius:18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);">
    <div style="font-size:.78rem;font-weight:800;margin-bottom:12px;">📊 Карта знаний</div>
    <div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr;gap:4px 8px;font-family:'DM Mono',monospace;font-size:.72rem;">
    <div></div><div style="text-align:center;color:var(--text-dim);font-weight:600;font-size:.65rem;">Число</div>
    <div style="text-align:center;color:var(--text-dim);font-weight:600;font-size:.65rem;">Поряд.</div>
    <div style="text-align:center;color:var(--text-dim);font-weight:600;font-size:.65rem;">Предл.</div>`;

  nums1to10().forEach(num=>{
    const cs=getSkillStrength(skillState[`n${num.n}_card`]);
    const os=getSkillStrength(skillState[`n${num.n}_ord`]);
    const ss=getSkillStrength(skillState[`n${num.n}_sent`]);
    html+=`<div style="padding:6px 8px;font-weight:700;font-size:.8rem;">${num.n}</div>`;
    [cs,os,ss].forEach(s=>{
      html+=`<div style="padding:6px;text-align:center;border-radius:8px;background:${sColor(s)};border:1px solid ${sBorder(s)};font-weight:700;font-size:.78rem;">${s>=0?s:'—'}</div>`;
    });
  });
  html+=`</div>`;

  // 11-19 grid (card + ord + sent)
  html+=`<div style="margin-top:12px;font-size:.72rem;font-weight:700;color:var(--text-dim);margin-bottom:6px;">11–19:</div>
    <div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr;gap:4px 8px;font-family:'DM Mono',monospace;font-size:.72rem;">
    <div></div><div style="text-align:center;color:var(--text-dim);font-size:.6rem;">Число</div>
    <div style="text-align:center;color:var(--text-dim);font-size:.6rem;">Поряд.</div>
    <div style="text-align:center;color:var(--text-dim);font-size:.6rem;">Предл.</div>`;
  nums11to19().forEach(num=>{
    const cs=getSkillStrength(skillState[`n${num.n}_card`]);
    const os=getSkillStrength(skillState[`n${num.n}_ord`]);
    const ss=getSkillStrength(skillState[`n${num.n}_sent`]);
    html+=`<div style="padding:4px 6px;font-weight:700;font-size:.75rem;">${num.n}</div>`;
    [cs,os,ss].forEach(s=>{
      html+=`<div style="padding:4px;text-align:center;border-radius:6px;background:${sColor(s)};border:1px solid ${sBorder(s)};font-weight:700;font-size:.72rem;">${s>=0?s:'—'}</div>`;
    });
  });
  html+=`</div>`;

  // Tens grid (card + ord)
  html+=`<div style="margin-top:12px;font-size:.72rem;font-weight:700;color:var(--text-dim);margin-bottom:6px;">Десятки:</div>
    <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:4px 8px;font-family:'DM Mono',monospace;font-size:.72rem;">
    <div></div><div style="text-align:center;color:var(--text-dim);font-size:.6rem;">Число</div>
    <div style="text-align:center;color:var(--text-dim);font-size:.6rem;">Поряд.</div>`;
  numsTens().forEach(num=>{
    const cs=getSkillStrength(skillState[`n${num.n}_card`]);
    const os=getSkillStrength(skillState[`n${num.n}_ord`]);
    html+=`<div style="padding:4px 6px;font-weight:700;font-size:.75rem;">${num.n}</div>`;
    [cs,os].forEach(s=>{
      html+=`<div style="padding:4px;text-align:center;border-radius:6px;background:${sColor(s)};border:1px solid ${sBorder(s)};font-weight:700;font-size:.72rem;">${s>=0?s:'—'}</div>`;
    });
  });
  html+=`</div>`;

  // Legend
  html+=`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center;">
    <span style="font-size:.65rem;color:var(--text-dim);"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:rgba(255,107,122,.35);vertical-align:middle;"></span> Слабо</span>
    <span style="font-size:.65rem;color:var(--text-dim);"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:rgba(255,204,102,.30);vertical-align:middle;"></span> Средне</span>
    <span style="font-size:.65rem;color:var(--text-dim);"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:rgba(14,165,233,.25);vertical-align:middle;"></span> Хорошо</span>
    <span style="font-size:.65rem;color:var(--text-dim);"><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:rgba(6,214,160,.30);vertical-align:middle;"></span> Сильно</span>
  </div></div>`;

  c.innerHTML=html;
}

function injectHeatmapContainers(){
  if(!$('startHeatmap')){const el=document.createElement('div');el.id='startHeatmap';el.style.cssText='width:100%;margin-top:12px;';
    const sb=$('startBadges');if(sb)sb.parentNode.insertBefore(el,sb.nextSibling);
    else{const i=document.querySelector('.start-info');if(i)i.parentNode.insertBefore(el,i);}}
  if(!$('resultHeatmap')){const el=document.createElement('div');el.id='resultHeatmap';el.style.cssText='width:100%;margin-top:12px;';
    const rb=$('resultBadges');if(rb)rb.parentNode.insertBefore(el,rb.nextSibling);
    else{const rp=$('resultPercent');if(rp)rp.parentNode.insertBefore(el,rp.nextSibling);}}
}
function refreshHeatmaps(){injectHeatmapContainers();renderHeatmap('startHeatmap');renderHeatmap('resultHeatmap');}

// ═══════════════════════════════════════════
// ── LOOK-HIDE-WRITE DRILL (Testing Effect)
// ═══════════════════════════════════════════

let drillTimer = null;

function openDrill(word, audioText, label, sublabel) {
  stopAudio();
  const overlay = $('drillOverlay');
  const phase = $('drillPhase');
  overlay.classList.add('show');

  let correctInRow = 0;
  const NEEDED = 2;

  showPhase();

  function showPhase() {
    const showTime = correctInRow === 0 ? 4000 : 3000;

    phase.innerHTML = `
      <div class="drill-num">${label}</div>
      <div class="drill-ru">${sublabel}</div>
      <div class="drill-hint">Запоминай написание:</div>
      <div class="drill-word pulse">${word}</div>
      <div class="drill-timer"><div class="drill-timer-fill" id="drillTimerFill"></div></div>
      <div class="drill-streak-dots">
        ${Array.from({length: NEEDED}, (_, i) =>
          `<div class="drill-streak-dot ${i < correctInRow ? 'filled' : ''}"></div>`
        ).join('')}
      </div>
      <div style="font-size:.75rem;color:var(--text-dim);font-family:'DM Mono',monospace;">
        ${correctInRow > 0 ? `✓ ${correctInRow}/${NEEDED} — ещё ${NEEDED - correctInRow}!` : `Напиши правильно ${NEEDED} раза подряд`}
      </div>
    `;

    playAudio(audioText);

    const fill = $('drillTimerFill');
    if (fill) {
      fill.style.width = '100%';
      fill.style.transitionDuration = showTime + 'ms';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { fill.style.width = '0%'; });
      });
    }

    drillTimer = setTimeout(() => writePhase(), showTime);
  }

  function writePhase() {
    phase.innerHTML = `
      <div class="drill-num">${label}</div>
      <div class="drill-ru">${sublabel}</div>
      <div class="drill-hint">Напиши по памяти:</div>
      <div class="drill-streak-dots">
        ${Array.from({length: NEEDED}, (_, i) =>
          `<div class="drill-streak-dot ${i < correctInRow ? 'filled' : ''}"></div>`
        ).join('')}
      </div>
      <div style="margin-top:12px;">
        <input type="text" class="drill-input" id="drillInput" placeholder="..." autocomplete="off" spellcheck="false" />
      </div>
    `;

    const inp = $('drillInput');
    setTimeout(() => inp.focus(), 100);

    function check() {
      const val = normalize(inp.value);
      if (!val) return;

      const ok = val === normalize(word);
      inp.disabled = true;

      if (ok) {
        inp.classList.add('correct');
        correctInRow++;

        if (correctInRow >= NEEDED) {
          setTimeout(() => successPhase(), 500);
        } else {
          setTimeout(() => showPhase(), 800);
        }
      } else {
        inp.classList.add('wrong');
        correctInRow = 0;

        setTimeout(() => {
          phase.innerHTML = `
            <div class="drill-num">${label}</div>
            <div class="drill-hint" style="color:var(--danger);">Не совсем. Правильно:</div>
            <div class="drill-word">${word}</div>
            <div class="drill-streak-dots">
              ${Array.from({length: NEEDED}, () =>
                `<div class="drill-streak-dot"></div>`
              ).join('')}
            </div>
            <div style="font-size:.78rem;color:var(--text-dim);margin-top:8px;">Смотри внимательно...</div>
          `;
          playAudio(audioText);
          drillTimer = setTimeout(() => showPhase(), 3000);
        }, 600);
      }
    }

    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  }

  function successPhase() {
    playAudio(audioText);
    phase.innerHTML = `
      <div class="drill-num">${label}</div>
      <div class="drill-success">✓ Запомнил!</div>
      <div class="drill-word" style="color:var(--success);">${word}</div>
      <div class="drill-streak-dots">
        ${Array.from({length: NEEDED}, () =>
          `<div class="drill-streak-dot filled"></div>`
        ).join('')}
      </div>
      <div style="margin-top:16px;">
        <button class="btn btn-primary" id="drillDoneBtn" style="padding:14px 20px;">Отлично!</button>
      </div>
    `;
    $('drillDoneBtn').addEventListener('click', closeDrill);
  }
}

function closeDrill() {
  if (drillTimer) { clearTimeout(drillTimer); drillTimer = null; }
  stopAudio();
  $('drillOverlay').classList.remove('show');
  $('drillPhase').innerHTML = '';
}

// ═══════════════════════════════════════════
// ── STUDY MODE (interactive reference cards)
// ═══════════════════════════════════════════

function renderStudy() {
  const c = $('studyContent');
  c.innerHTML = '';

  // ── TAB BAR ──
  const tabs = [
    { id: 'tab1', label: '1–10' },
    { id: 'tab2', label: '11–19' },
    { id: 'tab3', label: '20–100' },
    { id: 'tab4', label: '💬' },
  ];

  const tabBar = document.createElement('div');
  tabBar.style.cssText = 'display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;';

  const panels = {};

  tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'study-tab';
    btn.textContent = tab.label;
    btn.dataset.tab = tab.id;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      stopAudio();
      tabBar.querySelectorAll('.study-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(panels).forEach(p => p.style.display = 'none');
      panels[tab.id].style.display = '';
    });
    tabBar.appendChild(btn);

    const panel = document.createElement('div');
    panel.style.display = i === 0 ? '' : 'none';
    panels[tab.id] = panel;
  });

  c.appendChild(tabBar);
  Object.values(panels).forEach(p => c.appendChild(p));

  // Helper: create a number card
  function makeCard(num, showOrd) {
    const card = document.createElement('div');
    card.className = 'study-card';
    card.innerHTML = `
      <div class="sc-num">${num.n}</div>
      <div class="sc-et">${num.et}</div>
      <div class="sc-ru">${num.ru}</div>
      ${showOrd && num.ord ? `<div class="sc-ord">${num.ord} (${num.ordRu})</div>` : ''}
    `;
    card.addEventListener('click', () => {
      openDrill(num.et, num.et, String(num.n), num.ru);
    });
    if (showOrd && num.ord) {
      card.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openDrill(num.ord, num.ord, `${num.n}-й`, num.ordRu);
      });
    }
    return card;
  }

  // Helper: create a sentence row
  function makeSentenceRow(num, noun) {
    const s = makeSentence(num, noun);
    const row = document.createElement('div');
    row.className = 'study-sentence';
    row.innerHTML = `<span class="ss-et">${s.et}</span><span class="ss-ru">${s.ru}</span>`;
    row.addEventListener('click', () => {
      openDrill(s.et, s.et, s.ru, '');
    });
    return row;
  }

  // ── TAB 1: 1–10 ──
  const p1 = panels['tab1'];
  const grid1 = document.createElement('div');
  grid1.className = 'study-grid';
  nums1to10().forEach(num => grid1.appendChild(makeCard(num, true)));
  p1.appendChild(grid1);

  const note1 = document.createElement('div');
  note1.className = 'study-note';
  note1.innerHTML = `<strong>Порядковые:</strong> esimene (1-й), teine (2-й), kolmas (3-й)... kümnes (10-й)<br>
    Образуются по-разному — нужно запоминать каждое.`;
  p1.appendChild(note1);

  // ── TAB 2: 11–19 ──
  const p2 = panels['tab2'];
  const grid2 = document.createElement('div');
  grid2.className = 'study-grid';
  nums11to19().forEach(num => grid2.appendChild(makeCard(num, true)));
  p2.appendChild(grid2);

  const note2 = document.createElement('div');
  note2.className = 'study-note';
  note2.innerHTML = `<strong>Количественные:</strong> корень + <strong>teist</strong><br>
    üks → üks<strong>teist</strong>, kaks → kaks<strong>teist</strong><br><br>
    <strong>Порядковые:</strong> корень + <strong>teistkümnes</strong><br>
    ühe<strong>teistkümnes</strong>, kahe<strong>teistkümnes</strong>... (обрати внимание — корень меняется!)`;
  p2.appendChild(note2);

  // ── TAB 3: 20–100 ──
  const p3 = panels['tab3'];
  const grid3 = document.createElement('div');
  grid3.className = 'study-grid';
  numsTens().forEach(num => grid3.appendChild(makeCard(num, true)));
  p3.appendChild(grid3);

  const note3 = document.createElement('div');
  note3.className = 'study-note';
  note3.innerHTML = `<strong>Количественные:</strong> корень + <strong>kümmend</strong><br>
    kaks<strong>kümmend</strong>, kolm<strong>kümmend</strong>...<br><br>
    <strong>Порядковые:</strong> корень + <strong>kümnes</strong><br>
    kahe<strong>kümnes</strong>, kolme<strong>kümnes</strong>...<br>
    Исключение: 100 = <strong>sada</strong> → <strong>sajas</strong>`;
  p3.appendChild(note3);

  // ── TAB 4: Sentences ──
  const p4 = panels['tab4'];

  const note4top = document.createElement('div');
  note4top.className = 'study-note';
  note4top.innerHTML = `<strong>Правило:</strong> после <strong>1</strong> — именительный падеж (õun, koer, raamat, kass)<br>
    После <strong>2+</strong> — партитив (õun<strong>a</strong>, koer<strong>a</strong>, raamat<strong>ut</strong>, kass<strong>i</strong>)<br>
    Как в русском: "одна книга" vs "пять книг"`;
  p4.appendChild(note4top);

  const sentWrap = document.createElement('div');
  sentWrap.className = 'study-sentence-grid';
  const examples = [
    { num: getNum(1), noun: NOUNS[0] },
    { num: getNum(3), noun: NOUNS[0] },
    { num: getNum(1), noun: NOUNS[2] },
    { num: getNum(5), noun: NOUNS[2] },
    { num: getNum(1), noun: NOUNS[1] },
    { num: getNum(7), noun: NOUNS[1] },
    { num: getNum(1), noun: NOUNS[3] },
    { num: getNum(12), noun: NOUNS[3] },
  ];
  examples.forEach(({ num, noun }) => sentWrap.appendChild(makeSentenceRow(num, noun)));
  p4.appendChild(sentWrap);
}

function openStudy() {
  renderStudy();
  showScr('studyScreen');
}

// ── EVENTS ──
function bindEvents(){
  $('startBtn').addEventListener('click',()=>startGame(false));
  $('studyBtn').addEventListener('click', openStudy);
  $('studyBackBtn').addEventListener('click', () => { stopAudio(); showScr('startScreen'); });
  $('drillClose').addEventListener('click', closeDrill);
  $('drillOverlay').addEventListener('click', e => { if (e.target.id === 'drillOverlay') closeDrill(); });
  $('pauseBtn').addEventListener('click',openPauseModal);
  $('resumeBtn').addEventListener('click',closePauseModal);
  $('restartBtn').addEventListener('click',restartFromPause);
  $('pauseHomeBtn').addEventListener('click',goHomeFromPause);
  $('retryBtn').addEventListener('click',()=>startGame(false));
  $('homeBtn').addEventListener('click',()=>{showScr('startScreen');checkSaved();renderStartScreenBadges();refreshHeatmaps();});
  $('nextBtn').addEventListener('click',nextQ);
  $('pauseModal').addEventListener('click',e=>{if(e.target.id==='pauseModal')closePauseModal();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if($('drillOverlay').classList.contains('show'))closeDrill();
      else if($('pauseModal').classList.contains('show'))closePauseModal();
      else if($('studyScreen').classList.contains('active')){stopAudio();showScr('startScreen');}
      else if($('gameScreen').classList.contains('active'))openPauseModal();
    }
    if(e.key==='Enter'&&$('nextBtn').style.display==='block')nextQ();
  });
}

// ── INIT ──
function init(){initSkills();initGamify();bindEvents();checkSaved();renderStartScreenBadges();injectHeatmapContainers();renderHeatmap('startHeatmap');}
init();