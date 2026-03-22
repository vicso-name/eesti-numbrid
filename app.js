// ═══════════════════════════════════════════
// Eesti Numbrid — Estonian Numbers Trainer
// Architecture: Leitner 3-box + linear stages
// ═══════════════════════════════════════════

// ══ DATA ══
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

const NOUNS = [
  {nom:'õun', part:'õuna', gender:'n', ruOne:'одно яблоко', ruGen:'яблока', ruGenPl:'яблок'},
  {nom:'raamat', part:'raamatut', gender:'f', ruOne:'одна книга', ruGen:'книги', ruGenPl:'книг'},
  {nom:'koer', part:'koera', gender:'f', ruOne:'одна собака', ruGen:'собаки', ruGenPl:'собак'},
  {nom:'kass', part:'kassi', gender:'f', ruOne:'одна кошка', ruGen:'кошки', ruGenPl:'кошек'},
];

// ══ STAGES ══
const STAGES = [
  { id:1, label:'Числа 1–5',     nums:[1,2,3,4,5] },
  { id:2, label:'Числа 6–10',    nums:[6,7,8,9,10] },
  { id:3, label:'Числа 11–20',   nums:[11,12,13,14,15,16,17,18,19,20] },
  { id:4, label:'Десятки 30–100', nums:[30,40,50,60,70,80,90,100] },
];

const SAVE_KEY = 'numbrid_v2';
const SESSION_LEN = 20;
const STREAK_NEEDED = 2;

// ══ HELPERS ══
function $(id){ return document.getElementById(id); }
function shuffle(a){ const b=[...a]; for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]; } return b; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function normalize(s){ return String(s||'').toLowerCase().replace(/[?.!,]/g,'').replace(/\s+/g,' ').trim(); }
function showScr(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function showToast(text){ const t=$('toast'); t.textContent=text; t.classList.add('show'); clearTimeout(showToast._t); showToast._t=setTimeout(()=>t.classList.remove('show'),1600); }
function getNum(n){ return NUMBERS.find(x=>x.n===n); }
function numsWithOrd(){ return NUMBERS.filter(x=>!!x.ord); }
function numsSentence(){ return NUMBERS.filter(x=>x.n>=1&&x.n<=19); }

// ══ AUDIO ══
let currentAudio=null, audioGen=0;
function getAudioFile(text){ let name=text.toLowerCase().trim().replace(/[?.!,]/g,'').trim().replace(/[^a-zõäöü0-9\s]/g,'').replace(/\s+/g,'_').trim(); return 'audio/'+name+'.mp3'; }
function playAudio(text){ stopAudio(); const gen=++audioGen; return new Promise(resolve=>{ const a=new Audio(getAudioFile(text)); currentAudio=a; const done=()=>{if(gen===audioGen)currentAudio=null;resolve();}; a.onended=done; a.onerror=done; a.play().catch(done); }); }
function stopAudio(){ if(currentAudio){currentAudio.onended=null;currentAudio.onerror=null;currentAudio.pause();currentAudio=null;} }

// ══ SENTENCE BUILDER ══
function getRuNumeral(num,noun){ return num.n===2?(noun.gender==='f'?'две':'два'):num.ru; }
function makeSentence(num,noun){ const nf=num.n===1?noun.nom:noun.part; const et=`Mul on ${num.et} ${nf}`; let ru; if(num.n===1)ru=`У меня ${noun.ruOne}`; else if(num.n<=4)ru=`У меня ${getRuNumeral(num,noun)} ${noun.ruGen}`; else ru=`У меня ${num.ru} ${noun.ruGenPl}`; return{et,ru,words:['Mul','on',num.et,nf]}; }

// ═══════════════════════════════════════════
// ══ LEITNER STATE ══
// Box 0=New → Box 1=Learning → Box 2=Mastered
// 2 correct in a row → advance. 1 wrong → back to 0.
// ═══════════════════════════════════════════
let skillState={}, currentStage=1;
let correct=0,wrong=0,streak=0,best=0,qNum=0,ans=false,curEx=null;

function makeSkill(){ return {box:0,streak:0,totalCorrect:0,totalWrong:0}; }
function initSkills(){ skillState={}; NUMBERS.forEach(num=>{ skillState[`n${num.n}_card`]=makeSkill(); if(num.ord)skillState[`n${num.n}_ord`]=makeSkill(); if(num.n>=1&&num.n<=19)skillState[`n${num.n}_sent`]=makeSkill(); }); }

// ══ STAGE HELPERS ══
function getStage(id){ return STAGES.find(s=>s.id===id)||STAGES[0]; }
function getStageSkillKeys(sid){ const st=getStage(sid||currentStage); const keys=[]; st.nums.forEach(n=>{keys.push(`n${n}_card`); const num=getNum(n); if(num&&num.ord)keys.push(`n${n}_ord`); if(n>=1&&n<=19)keys.push(`n${n}_sent`);}); return keys; }
function getStageSkills(sid){ return getStageSkillKeys(sid||currentStage).map(k=>[k,skillState[k]]).filter(([_,s])=>s); }
function getStageNumbers(sid){ return getStage(sid||currentStage).nums.map(n=>getNum(n)).filter(Boolean); }
function getStageMastered(sid){ return getStageSkills(sid).filter(([_,s])=>s.box>=2).length; }
function getStageTotal(sid){ return getStageSkillKeys(sid||currentStage).length; }
function isStageComplete(sid){ return getStageMastered(sid)===getStageTotal(sid); }
function getMaxUnlockedStage(){ for(let i=STAGES.length;i>=1;i--){ if(i===1)return 1; if(isStageComplete(i-1))return i; } return 1; }

// ══ SAVE / LOAD ══
function saveProgress(){ try{localStorage.setItem(SAVE_KEY,JSON.stringify({skillState,currentStage,ts:Date.now()}));}catch(e){} }
function loadProgress(){ try{ const raw=localStorage.getItem(SAVE_KEY); if(!raw)return null; const d=JSON.parse(raw); if(!d.skillState)return null; Object.values(d.skillState).forEach(sk=>{if(sk.box===undefined)sk.box=sk.level||0;if(sk.streak===undefined)sk.streak=0;if(sk.totalCorrect===undefined)sk.totalCorrect=0;if(sk.totalWrong===undefined)sk.totalWrong=0;}); return d; }catch(e){return null;} }
function hasSave(){ return !!loadProgress(); }

// ═══════════════════════════════════════════
// ══ SKILL PICKER ══
// Priority: Box 0 > Box 1 > Box 2
// ═══════════════════════════════════════════
function pickSkill(){
  const entries=getStageSkills();
  const box0=entries.filter(([_,s])=>s.box===0);
  const box1=entries.filter(([_,s])=>s.box===1);
  const box2=entries.filter(([_,s])=>s.box===2);
  const pool=box0.length?box0:box1.length?box1:box2.length?box2:null;
  if(!pool)return null;
  const weighted=[];
  pool.forEach(([key,s])=>{ const w=Math.max(1,1+s.totalWrong-s.totalCorrect); for(let i=0;i<w;i++)weighted.push(key); });
  return weighted[Math.floor(Math.random()*weighted.length)];
}

// ═══════════════════════════════════════════
// ══ EXERCISE GENERATORS ══
// ═══════════════════════════════════════════
function parseSkillKey(key){ const m=key.match(/^n(\d+)_(\w+)$/); if(!m)return null; return{num:getNum(parseInt(m[1])),form:m[2]}; }

function makeChoiceNumToWord(num,key){ const pool=getStageNumbers(); const fb=pool.length>1?pool:NUMBERS; const wr=shuffle(fb.filter(x=>x.et!==num.et)).slice(0,3).map(x=>x.et); return{type:'choice',label:'Как будет по-эстонски?',qText:`${num.n}`,qRu:num.ru,answer:num.et,options:shuffle([num.et,...wr]),reveal:num.et,_skillKey:key}; }
function makeChoiceWordToNum(num,key){ const pool=getStageNumbers(); const fb=pool.length>1?pool:NUMBERS; const wr=shuffle(fb.filter(x=>x.n!==num.n)).slice(0,3).map(x=>String(x.n)); return{type:'choice',label:'Какое это число?',qText:num.et,qRu:'',answer:String(num.n),options:shuffle([String(num.n),...wr]),reveal:`${num.et} = ${num.n}`,_audio:num.et,_skillKey:key}; }
function makeChoiceOrdinal(num,key){ const pool=getStageNumbers().filter(x=>!!x.ord); const fb=pool.length>1?pool:numsWithOrd(); const wr=shuffle(fb.filter(x=>x.n!==num.n)).slice(0,3).map(x=>x.ord); return{type:'choice',label:'Порядковое числительное',qText:`${num.n}-й (${num.ordRu})`,qRu:'',answer:num.ord,options:shuffle([num.ord,...wr]),reveal:`${num.ordRu} = ${num.ord}`,_audio:num.ord,_skillKey:key}; }
function makeChoiceSentence(num,key){ const noun=pick(NOUNS); const s=makeSentence(num,noun); const pool=getStageNumbers().filter(x=>x.n<=19); const fb=pool.length>1?pool:numsSentence(); const wr=shuffle(fb.filter(x=>x.n!==num.n)).slice(0,3).map(x=>x.et); const nf=num.n===1?noun.nom:noun.part; return{type:'choice',label:'Вставь число',qText:`Mul on ___ ${nf}`,qRu:s.ru,answer:num.et,options:shuffle([num.et,...wr]),reveal:s.et,_skillKey:key}; }

function makeBuildSentence(num,key){ const noun=pick(NOUNS); const s=makeSentence(num,noun); const dist=[]; const oth=getStageNumbers().filter(x=>x.n!==num.n); const extra=pick(oth.length?oth:NUMBERS.filter(x=>x.n!==num.n)); if(extra)dist.push(extra.et); const wn=pick(NOUNS.filter(x=>x.nom!==noun.nom)); if(wn)dist.push(num.n===1?wn.nom:wn.part); return{type:'build',label:'Собери предложение',qRu:s.ru,answer:s.words,bank:shuffle([...s.words,...dist.slice(0,2)]),reveal:s.et,_skillKey:key}; }

function makeTypingNumToWord(num,key){ return{type:'typing',label:'Напиши число словом',qText:`Напиши по-эстонски: ${num.n}`,qRu:num.ru,answer:normalize(num.et),reveal:num.et,_skillKey:key}; }
function makeTypingOrdinal(num,key){ return{type:'typing',label:'Напиши порядковое',qText:`Напиши по-эстонски: ${num.n}-й`,qRu:num.ordRu,answer:normalize(num.ord),reveal:num.ord,_skillKey:key}; }
function makeTypingSentence(num,key){ const noun=pick(NOUNS); const s=makeSentence(num,noun); return{type:'typing',label:'Переведи на эстонский',qText:'Переведи:',qRu:s.ru,answer:normalize(s.et),reveal:s.et,_skillKey:key}; }
function makeTypingRuToEt(num,key){ return{type:'typing',label:'Переведи число',qText:`${num.ru} по-эстонски:`,qRu:'',answer:normalize(num.et),reveal:num.et,_skillKey:key}; }
function makeTypingOrdRuToEt(num,key){ return{type:'typing',label:'Напиши порядковое',qText:`«${num.ordRu}» по-эстонски:`,qRu:'',answer:normalize(num.ord),reveal:num.ord,_skillKey:key}; }

function makeDictationNumber(num,key){ return{type:'dictation',label:'Аудио-диктант',qText:'Послушай и напиши число:',audioSentence:num.et,answer:normalize(num.et),reveal:num.et,_skillKey:key}; }
function makeDictationSentence(num,key){ const noun=pick(NOUNS); const s=makeSentence(num,noun); return{type:'dictation',label:'Аудио-диктант',qText:'Послушай и напиши:',audioSentence:s.et,answer:normalize(s.et),reveal:s.et,_skillKey:key}; }
function makeDictationOrdinal(num,key){ return{type:'dictation',label:'Аудио-диктант (порядковое)',qText:'Послушай и напиши порядковое:',audioSentence:num.ord,answer:normalize(num.ord),reveal:num.ord,_skillKey:key}; }

// ══ EXERCISE ROUTING (box-based) ══
function makeExForSkill(skillKey){
  const parsed=parseSkillKey(skillKey);
  if(!parsed)return makeChoiceNumToWord(pick(getStageNumbers()),skillKey);
  const{num,form}=parsed;
  const sk=skillState[skillKey];
  const box=sk?sk.box:0;
  const roll=Math.random();
  let choiceP,buildP,typingP;
  if(box===0)     {choiceP=0.50;buildP=0.65;typingP=0.85;}
  else if(box===1){choiceP=0.20;buildP=0.35;typingP=0.70;}
  else            {choiceP=0.00;buildP=0.10;typingP=0.55;}

  if(form==='card'){
    if(roll<choiceP)return Math.random()>0.5?makeChoiceNumToWord(num,skillKey):makeChoiceWordToNum(num,skillKey);
    if(roll<buildP&&num.n<=19)return makeBuildSentence(num,skillKey);
    if(roll<typingP)return pick([makeTypingNumToWord,makeTypingRuToEt])(num,skillKey);
    return makeDictationNumber(num,skillKey);
  }
  if(form==='ord'){
    if(roll<choiceP)return makeChoiceOrdinal(num,skillKey);
    if(roll<buildP&&num.n<=19)return makeBuildSentence(num,skillKey);
    if(roll<typingP)return pick([makeTypingOrdinal,makeTypingOrdRuToEt])(num,skillKey);
    return makeDictationOrdinal(num,skillKey);
  }
  if(form==='sent'){
    if(roll<choiceP)return makeChoiceSentence(num,skillKey);
    if(roll<buildP)return makeBuildSentence(num,skillKey);
    if(roll<typingP)return makeTypingSentence(num,skillKey);
    return makeDictationSentence(num,skillKey);
  }
  return makeChoiceNumToWord(num,skillKey);
}

// ═══════════════════════════════════════════
// ══ GAME FLOW ══
// ═══════════════════════════════════════════
function startGame(){
  correct=0;wrong=0;best=0;streak=0;qNum=0;ans=false;curEx=null;
  $('resultBarFill').style.width='0%';
  closePauseModal();showScr('gameScreen');nextQ();
}

function nextQ(){
  if(qNum>=SESSION_LEN){showResults();return;}
  const sk=pickSkill();
  if(!sk){showResults();return;}
  curEx=makeExForSkill(sk);qNum++;renderEx();
}

function renderEx(){
  ans=false; const ex=curEx;
  const card=$('questionCard'); card.classList.remove('animate-in'); void card.offsetWidth; card.classList.add('animate-in');
  $('correctReveal').textContent=''; $('nextBtn').style.display='none'; $('qHint').textContent='';
  $('exerciseTypeLabel').textContent=ex.label||'Задание';
  $('qText').textContent=ex.qText||'';
  if(ex.qRu&&ex.qRu.length>0){$('qRu').textContent=ex.qRu;$('qRu').style.display='';}else{$('qRu').style.display='none';}
  $('exerciseArea').innerHTML=''; stopAudio(); hideReplayBtn();
  if(ex.type==='choice')renderChoice(ex);
  if(ex.type==='build')renderBuild(ex);
  if(ex.type==='typing')renderTyping(ex);
  if(ex.type==='dictation')renderDictation(ex);
  updStats();
}

// ══ RENDERERS ══
function renderChoice(ex){
  const wrap=document.createElement('div');wrap.className='options';
  ex.options.forEach(opt=>{
    const b=document.createElement('button');b.className='option-btn';b.textContent=opt;b.dataset.value=opt;
    b.addEventListener('click',()=>{if(ans)return;ans=true;const ok=opt===ex.answer;
      wrap.querySelectorAll('.option-btn').forEach(btn=>{btn.disabled=true;if(btn.dataset.value===ex.answer)btn.classList.add('correct-answer');else if(btn===b&&!ok)btn.classList.add('wrong-answer');else btn.classList.add('dimmed');});
      proc(ok);});
    wrap.appendChild(b);});
  $('exerciseArea').appendChild(wrap);
}

function renderBuild(ex){
  $('qText').textContent='Собери предложение:';
  const target=document.createElement('div');target.className='build-target';
  const bank=document.createElement('div');bank.className='word-bank';
  const submit=document.createElement('button');submit.className='build-submit';submit.textContent='Проверить';submit.disabled=true;
  const selected=[];
  ex.bank.forEach((word,index)=>{const chip=document.createElement('span');chip.className='word-chip';chip.textContent=word;chip.dataset.idx=index;chip.addEventListener('click',()=>{if(ans||chip.classList.contains('used'))return;chip.classList.add('used');selected.push({word,index});rt();});bank.appendChild(chip);});
  function rt(){target.innerHTML='';submit.disabled=selected.length===0;selected.forEach((item,i)=>{const chip=document.createElement('span');chip.className='word-chip in-target';chip.textContent=item.word;chip.addEventListener('click',()=>{if(ans)return;selected.splice(i,1);const o=bank.querySelector(`.word-chip[data-idx="${item.index}"]`);if(o)o.classList.remove('used');rt();});target.appendChild(chip);});}
  submit.addEventListener('click',()=>{if(ans||selected.length===0)return;ans=true;const built=selected.map(i=>i.word).join(' ');const ok=built===ex.answer.join(' ');target.classList.add(ok?'correct':'wrong');if(!ok)$('correctReveal').textContent=`Правильный вариант: ${ex.reveal}`;bank.querySelectorAll('.word-chip').forEach(c=>c.style.pointerEvents='none');submit.style.display='none';proc(ok);});
  $('exerciseArea').appendChild(target);$('exerciseArea').appendChild(bank);$('exerciseArea').appendChild(submit);
}

function renderTyping(ex){
  const wrap=document.createElement('div');wrap.className='typing-area';
  const inp=document.createElement('input');inp.type='text';inp.className='typing-input';inp.placeholder='Напиши по-эстонски...';inp.autocomplete='off';inp.spellcheck=false;
  const btn=document.createElement('button');btn.className='typing-submit';btn.textContent='Проверить';
  btn.addEventListener('click',()=>checkTyping(inp,ex,btn));inp.addEventListener('keydown',e=>{if(e.key==='Enter')checkTyping(inp,ex,btn);});
  wrap.appendChild(inp);wrap.appendChild(btn);$('exerciseArea').appendChild(wrap);setTimeout(()=>inp.focus(),80);
}

function checkTyping(inp,ex,btn){if(ans)return;const val=normalize(inp.value);if(!val){showToast('Сначала введи ответ');return;}ans=true;inp.disabled=true;if(btn)btn.style.display='none';const ok=val===normalize(ex.answer);inp.classList.add(ok?'correct':'wrong');if(!ok){inp.classList.add('shake');$('correctReveal').textContent=`Правильный вариант: ${ex.reveal}`;}proc(ok);}

function renderDictation(ex){
  $('qRu').style.display='none';const area=$('exerciseArea');
  const playRow=document.createElement('div');playRow.style.cssText='display:flex;align-items:center;gap:12px;margin-bottom:16px;';
  const playBtn=document.createElement('button');playBtn.className='btn btn-secondary';playBtn.style.cssText='width:auto;padding:12px 20px;font-size:1.2rem;display:none;';playBtn.textContent='🔊 Послушать ещё раз';
  let isPlaying=false;
  playBtn.addEventListener('click',()=>{if(isPlaying)return;isPlaying=true;playBtn.disabled=true;playBtn.style.opacity='0.5';playAudio(ex.audioSentence).then(()=>{isPlaying=false;playBtn.disabled=false;playBtn.style.opacity='1';});});
  playRow.appendChild(playBtn);area.appendChild(playRow);
  setTimeout(()=>{playAudio(ex.audioSentence).then(()=>{playBtn.style.display='';});},300);
  const wrap=document.createElement('div');wrap.className='typing-area';
  const inp=document.createElement('input');inp.type='text';inp.className='typing-input';inp.placeholder='Напиши что услышал(а)...';inp.autocomplete='off';inp.spellcheck=false;
  const btn=document.createElement('button');btn.className='typing-submit';btn.textContent='Проверить';
  btn.addEventListener('click',()=>checkTyping(inp,ex,btn));inp.addEventListener('keydown',e=>{if(e.key==='Enter')checkTyping(inp,ex,btn);});
  wrap.appendChild(inp);wrap.appendChild(btn);area.appendChild(wrap);setTimeout(()=>inp.focus(),400);
}

function showReplayBtn(sentence){hideReplayBtn();const row=document.createElement('div');row.id='audioReplayRow';row.style.cssText='display:flex;align-items:center;justify-content:center;gap:10px;margin-top:10px;';const btn=document.createElement('button');btn.className='btn btn-secondary';btn.style.cssText='width:auto;padding:8px 16px;font-size:0.85rem;';btn.textContent='🔊 Послушать';btn.addEventListener('click',()=>playAudio(sentence));row.appendChild(btn);$('nextBtn').parentNode.insertBefore(row,$('nextBtn'));}
function hideReplayBtn(){const el=$('audioReplayRow');if(el)el.remove();}

// ═══════════════════════════════════════════
// ══ PROC (Leitner) ══
// ═══════════════════════════════════════════
function proc(ok){
  if(curEx._skillKey&&skillState[curEx._skillKey]){
    const sk=skillState[curEx._skillKey];
    if(ok){sk.totalCorrect++;sk.streak++;if(sk.streak>=STREAK_NEEDED&&sk.box<2){sk.box++;sk.streak=0;}}
    else{sk.totalWrong++;sk.box=0;sk.streak=0;}
  }
  if(ok){correct++;streak++;if(streak>best)best=streak;}else{wrong++;streak=0;}
  updStats();saveProgress();
  const sentence=curEx._audio||curEx.audioSentence||curEx.reveal||'';
  const nextBtn=$('nextBtn');nextBtn.textContent=qNum>=SESSION_LEN?'Результаты':'Далее';
  if(sentence){showReplayBtn(sentence);let shown=false;const show=()=>{if(shown)return;shown=true;nextBtn.style.display='block';};setTimeout(()=>{playAudio(sentence).then(show);},300);setTimeout(show,4000);}
  else{nextBtn.style.display='block';}
}

// ══ STATS ══
function updStats(){
  const answered=correct+wrong;const accuracy=answered?Math.round((correct/answered)*100):0;
  const pct=Math.round((qNum/SESSION_LEN)*100);
  $('correctCount').textContent=correct;$('wrongCount').textContent=wrong;$('streakCount').textContent=streak;$('accuracyCount').textContent=`${accuracy}%`;
  $('progressTitle').textContent=`Вопрос ${Math.min(qNum,SESSION_LEN)} из ${SESSION_LEN}`;
  $('progressText').textContent=`${Math.min(qNum,SESSION_LEN)} / ${SESSION_LEN}`;
  $('progressPercent').textContent=`${pct}%`;$('progressFill').style.width=`${pct}%`;
  const st=getStage(currentStage);const m=getStageMastered();const t=getStageTotal();
  $('sessionMeta').textContent=`Stage ${currentStage}: ${st.label} · ${m}/${t} освоено`;
}

// ═══════════════════════════════════════════
// ══ RESULTS ══
// ═══════════════════════════════════════════
function showResults(){
  showScr('resultScreen');
  const answered=correct+wrong;const pct=answered?Math.round((correct/answered)*100):0;
  $('resultCorrect').textContent=correct;$('resultWrong').textContent=wrong;$('resultBest').textContent=best;
  $('resultPercent').textContent=`${pct}% точность · ${answered} ответов`;
  setTimeout(()=>{$('resultBarFill').style.width=`${pct}%`;},140);

  const st=getStage(currentStage);const m=getStageMastered();const t=getStageTotal();const complete=m===t;
  $('resultEmoji').textContent='';
  $('resultTitle').textContent=`Stage ${currentStage}: ${st.label}`;
  $('resultSubtitle').textContent=complete?`Все ${t} навыков освоены!`:`Освоено: ${m} из ${t}`;
  renderResultProgress(m,t,complete);saveProgress();
}

function renderResultProgress(mastered,total,complete){
  let c=$('resultProgress');
  if(!c){c=document.createElement('div');c.id='resultProgress';c.style.cssText='width:100%;margin-top:16px;';const hb=$('homeBtn');if(hb)hb.parentNode.insertBefore(c,hb.nextSibling);}
  const skills=getStageSkills();
  const box0=skills.filter(([_,s])=>s.box===0).length;
  const box1=skills.filter(([_,s])=>s.box===1).length;
  const box2=skills.filter(([_,s])=>s.box===2).length;
  const pct=total>0?Math.round((mastered/total)*100):0;

  c.innerHTML=`<div style="padding:14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:.82rem;font-weight:800;">Прогресс Stage ${currentStage}</span>
      <span style="font-size:.78rem;font-family:'DM Mono',monospace;color:var(--text-dim);">${mastered}/${total}</span>
    </div>
    <div style="height:8px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;margin-bottom:12px;">
      <div style="height:100%;width:${pct}%;border-radius:99px;background:linear-gradient(90deg,var(--accent),var(--accent-2));transition:width .6s;"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;">
      <div style="padding:8px;border-radius:10px;background:rgba(255,107,122,.1);border:1px solid rgba(255,107,122,.18);">
        <div style="font-size:1.1rem;font-weight:900;color:var(--danger);">${box0}</div>
        <div style="font-size:.65rem;color:var(--text-dim);font-family:'DM Mono',monospace;">новых</div>
      </div>
      <div style="padding:8px;border-radius:10px;background:rgba(255,204,102,.1);border:1px solid rgba(255,204,102,.18);">
        <div style="font-size:1.1rem;font-weight:900;color:var(--warning);">${box1}</div>
        <div style="font-size:.65rem;color:var(--text-dim);font-family:'DM Mono',monospace;">учу</div>
      </div>
      <div style="padding:8px;border-radius:10px;background:rgba(6,214,160,.12);border:1px solid rgba(6,214,160,.2);">
        <div style="font-size:1.1rem;font-weight:900;color:var(--success);">${box2}</div>
        <div style="font-size:.65rem;color:var(--text-dim);font-family:'DM Mono',monospace;">освоено</div>
      </div>
    </div>
    ${complete&&currentStage<STAGES.length?`<div style="margin-top:12px;"><button class="btn btn-primary" id="nextStageBtn" style="font-size:.95rem;">Начать Stage ${currentStage+1}: ${getStage(currentStage+1).label}</button></div>`:''}
    ${complete&&currentStage>=STAGES.length?`<div style="margin-top:12px;text-align:center;font-size:.9rem;font-weight:700;color:var(--success);">Все этапы пройдены!</div>`:''}
  </div>`;
  const nsBtn=$('nextStageBtn');
  if(nsBtn)nsBtn.addEventListener('click',()=>{currentStage++;saveProgress();startGame();});
}

// ═══════════════════════════════════════════
// ══ START SCREEN ══
// ═══════════════════════════════════════════
function renderStartScreen(){
  const save=loadProgress();
  if(save){skillState=save.skillState;currentStage=save.currentStage||1;if(isStageComplete(currentStage)&&currentStage<STAGES.length)currentStage=getMaxUnlockedStage();}
  else{initSkills();currentStage=1;}
  const st=getStage(currentStage);const m=getStageMastered();const t=getStageTotal();
  $('startBtn').textContent=m>0?`Продолжить · ${m}/${t} освоено`:`Начать Stage ${currentStage}`;
  renderStageIndicator();
}

function renderStageIndicator(){
  let host=$('stageIndicator');
  if(!host){host=document.createElement('div');host.id='stageIndicator';host.style.cssText='width:100%;margin-top:4px;';const info=document.querySelector('.start-info');if(info)info.parentNode.insertBefore(host,info);}
  const maxU=getMaxUnlockedStage();
  let html='<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">';
  STAGES.forEach(stage=>{
    const locked=stage.id>maxU;const complete=isStageComplete(stage.id);const active=stage.id===currentStage;
    const m=getStageMastered(stage.id);const t=getStageTotal(stage.id);
    let bg,border,color;
    if(complete){bg='rgba(6,214,160,.15)';border='rgba(6,214,160,.3)';color='var(--success)';}
    else if(active){bg='rgba(14,165,233,.12)';border='rgba(14,165,233,.3)';color='var(--accent-2)';}
    else if(locked){bg='rgba(255,255,255,.02)';border='rgba(255,255,255,.06)';color='var(--text-dim)';}
    else{bg='rgba(255,255,255,.04)';border='rgba(255,255,255,.08)';color='var(--text)';}
    html+=`<div style="padding:8px 12px;border-radius:10px;background:${bg};border:1px solid ${border};text-align:center;min-width:65px;${locked?'opacity:.4;':''}">
      <div style="font-size:.72rem;font-weight:800;color:${color};">${locked?'🔒':complete?'✓':stage.id}</div>
      <div style="font-size:.6rem;color:var(--text-dim);font-family:'DM Mono',monospace;margin-top:2px;">${locked?'—':`${m}/${t}`}</div>
    </div>`;
  });
  html+='</div>';host.innerHTML=html;
}

// ══ PAUSE ══
function openPauseModal(){$('pauseModal').classList.add('show');}
function closePauseModal(){$('pauseModal').classList.remove('show');}
function goHomeFromPause(){closePauseModal();saveProgress();showScr('startScreen');renderStartScreen();}
function restartFromPause(){closePauseModal();startGame();}

// ═══════════════════════════════════════════
// ══ DRILL ══
// ═══════════════════════════════════════════
let drillTimer=null;
function openDrill(word,audioText,label,sublabel){
  stopAudio();$('drillOverlay').classList.add('show');const phase=$('drillPhase');
  let cir=0;const NEEDED=3;
  function showP(){const showTime=cir===0?4000:2500;
    phase.innerHTML=`<div class="drill-num">${label}</div><div class="drill-ru">${sublabel}</div><div class="drill-hint">Запоминай написание:</div><div class="drill-word">${word}</div><div class="drill-timer"><div class="drill-timer-fill" id="drillTimerFill"></div></div><div class="drill-streak-dots">${Array.from({length:NEEDED},(_,i)=>`<div class="drill-streak-dot ${i<cir?'filled':''}"></div>`).join('')}</div><div style="font-size:.75rem;color:var(--text-dim);font-family:'DM Mono',monospace;">${cir>0?`✓ ${cir}/${NEEDED}`:`Напиши правильно ${NEEDED} раза подряд`}</div>`;
    playAudio(audioText);const fill=$('drillTimerFill');if(fill){fill.style.width='100%';fill.style.transitionDuration=showTime+'ms';requestAnimationFrame(()=>requestAnimationFrame(()=>{fill.style.width='0%';}));}
    drillTimer=setTimeout(writeP,showTime);}
  function writeP(){
    phase.innerHTML=`<div class="drill-num">${label}</div><div class="drill-ru">${sublabel}</div><div class="drill-hint">Напиши по памяти:</div><div class="drill-streak-dots">${Array.from({length:NEEDED},(_,i)=>`<div class="drill-streak-dot ${i<cir?'filled':''}"></div>`).join('')}</div><div style="margin-top:12px;"><input type="text" class="drill-input" id="drillInput" placeholder="..." autocomplete="off" spellcheck="false"/></div><div style="margin-top:10px;"><button class="btn btn-primary" id="drillCheckBtn" style="padding:12px 20px;font-size:.95rem;">Проверить</button></div>`;
    const inp=$('drillInput');setTimeout(()=>inp.focus(),100);
    function chk(){const val=normalize(inp.value);if(!val)return;const ok=val===normalize(word);inp.disabled=true;$('drillCheckBtn').style.display='none';
      if(ok){inp.classList.add('correct');cir++;if(cir>=NEEDED)setTimeout(succP,500);else setTimeout(showP,800);}
      else{inp.classList.add('wrong');cir=0;setTimeout(()=>{phase.innerHTML=`<div class="drill-num">${label}</div><div class="drill-hint" style="color:var(--danger);">Не совсем. Правильно:</div><div class="drill-word">${word}</div><div class="drill-streak-dots">${Array.from({length:NEEDED},()=>`<div class="drill-streak-dot"></div>`).join('')}</div><div style="font-size:.78rem;color:var(--text-dim);margin-top:8px;">Смотри внимательно...</div>`;playAudio(audioText);drillTimer=setTimeout(showP,3000);},600);}}
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')chk();});
    $('drillCheckBtn').addEventListener('click',chk);}
  function succP(){playAudio(audioText);phase.innerHTML=`<div class="drill-num">${label}</div><div class="drill-success">✓ Запомнил!</div><div class="drill-word" style="color:var(--success);">${word}</div><div class="drill-streak-dots">${Array.from({length:NEEDED},()=>`<div class="drill-streak-dot filled"></div>`).join('')}</div><div style="margin-top:16px;"><button class="btn btn-primary" id="drillDoneBtn" style="padding:14px 20px;">Отлично!</button></div>`;$('drillDoneBtn').addEventListener('click',closeDrill);}
  showP();
}
function closeDrill(){if(drillTimer){clearTimeout(drillTimer);drillTimer=null;}stopAudio();$('drillOverlay').classList.remove('show');$('drillPhase').innerHTML='';}

// ═══════════════════════════════════════════
// ══ STUDY MODE ══
// ═══════════════════════════════════════════
function nums1to10(){return NUMBERS.filter(x=>x.n>=1&&x.n<=10);}
function nums11to19(){return NUMBERS.filter(x=>x.n>=11&&x.n<=19);}
function numsTens(){return NUMBERS.filter(x=>x.n>=20);}

function renderStudy(){
  const c=$('studyContent');c.innerHTML='';
  const tabs=[{id:'tab1',label:'1–10'},{id:'tab2',label:'11–19'},{id:'tab3',label:'20–100'},{id:'tab4',label:'Примеры'}];
  const tabBar=document.createElement('div');tabBar.style.cssText='display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;';
  const panels={};
  tabs.forEach((tab,i)=>{
    const btn=document.createElement('button');btn.className='study-tab';btn.textContent=tab.label;if(i===0)btn.classList.add('active');
    btn.addEventListener('click',()=>{stopAudio();tabBar.querySelectorAll('.study-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');Object.values(panels).forEach(p=>p.style.display='none');panels[tab.id].style.display='';});
    tabBar.appendChild(btn);const panel=document.createElement('div');panel.style.display=i===0?'':'none';panels[tab.id]=panel;});
  c.appendChild(tabBar);Object.values(panels).forEach(p=>c.appendChild(p));
  function makeCard(num,showOrd){const card=document.createElement('div');card.className='study-card';card.innerHTML=`<div class="sc-num">${num.n}</div><div class="sc-et">${num.et}</div><div class="sc-ru">${num.ru}</div>${showOrd&&num.ord?`<div class="sc-ord">${num.ord} (${num.ordRu})</div>`:''}`;card.addEventListener('click',()=>openDrill(num.et,num.et,String(num.n),num.ru));if(showOrd&&num.ord)card.addEventListener('contextmenu',e=>{e.preventDefault();openDrill(num.ord,num.ord,`${num.n}-й`,num.ordRu);});return card;}
  function makeSentenceRow(num,noun){const s=makeSentence(num,noun);const row=document.createElement('div');row.className='study-sentence';row.innerHTML=`<span class="ss-et">${s.et}</span><span class="ss-ru">${s.ru}</span>`;row.addEventListener('click',()=>openDrill(s.et,s.et,s.ru,''));return row;}

  const p1=panels['tab1'];const g1=document.createElement('div');g1.className='study-grid';nums1to10().forEach(n=>g1.appendChild(makeCard(n,true)));p1.appendChild(g1);
  const n1=document.createElement('div');n1.className='study-note';n1.innerHTML=`<strong>Порядковые:</strong> esimene (1-й), teine (2-й), kolmas (3-й)... kümnes (10-й). Образуются по-разному — нужно запоминать каждое.`;p1.appendChild(n1);

  const p2=panels['tab2'];const g2=document.createElement('div');g2.className='study-grid';nums11to19().forEach(n=>g2.appendChild(makeCard(n,true)));p2.appendChild(g2);
  const n2=document.createElement('div');n2.className='study-note';n2.innerHTML=`<strong>Количественные:</strong> корень+<strong>teist</strong><br>üks→üks<strong>teist</strong>, kaks→kaks<strong>teist</strong><br><br><strong>Порядковые:</strong> корень+<strong>teistkümnes</strong><br>ühe<strong>teistkümnes</strong>, kahe<strong>teistkümnes</strong>... (корень меняется!)`;p2.appendChild(n2);

  const p3=panels['tab3'];const g3=document.createElement('div');g3.className='study-grid';numsTens().forEach(n=>g3.appendChild(makeCard(n,true)));p3.appendChild(g3);
  const n3=document.createElement('div');n3.className='study-note';n3.innerHTML=`<strong>Количественные:</strong> корень+<strong>kümmend</strong><br>kaks<strong>kümmend</strong>, kolm<strong>kümmend</strong>...<br><br><strong>Порядковые:</strong> корень+<strong>kümnes</strong><br>kahe<strong>kümnes</strong>, kolme<strong>kümnes</strong>...<br>Исключение: 100=<strong>sada</strong>→<strong>sajas</strong>`;p3.appendChild(n3);

  const p4=panels['tab4'];const n4=document.createElement('div');n4.className='study-note';n4.innerHTML=`<strong>Правило:</strong> после <strong>1</strong> — именительный падеж (õun, koer, raamat, kass). После <strong>2+</strong> — партитив (õun<strong>a</strong>, koer<strong>a</strong>, raamat<strong>ut</strong>, kass<strong>i</strong>)`;p4.appendChild(n4);
  const sw=document.createElement('div');sw.className='study-sentence-grid';
  [{n:1,noun:NOUNS[0]},{n:3,noun:NOUNS[0]},{n:1,noun:NOUNS[2]},{n:5,noun:NOUNS[2]},{n:1,noun:NOUNS[1]},{n:7,noun:NOUNS[1]},{n:1,noun:NOUNS[3]},{n:12,noun:NOUNS[3]}].forEach(({n,noun})=>sw.appendChild(makeSentenceRow(getNum(n),noun)));p4.appendChild(sw);
}
function openStudy(){renderStudy();showScr('studyScreen');}

// ═══════════════════════════════════════════
// ══ FAQ ══
// ═══════════════════════════════════════════
function openFaq(){
  $('faqContent').innerHTML = `
    <div style="font-size:.88rem;line-height:1.65;color:var(--text-dim);">
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">🎯 Цель</div>
        Выучить эстонские числа от 1 до 100 — написание, произношение, порядковые формы и использование в предложениях.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">📦 Три коробки</div>
        Каждый навык проходит путь:<br>
        <span style="color:var(--danger);font-weight:700;">Новый</span> → <span style="color:var(--warning);font-weight:700;">Учу</span> → <span style="color:var(--success);font-weight:700;">Освоен</span><br>
        Ответь правильно <strong>2 раза подряд</strong> — навык переходит в следующую коробку. Одна ошибка — возврат в «Новый».
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">🔢 4 этапа</div>
        <strong>Stage 1:</strong> числа 1–5 (15 навыков)<br>
        <strong>Stage 2:</strong> числа 6–10 (15 навыков)<br>
        <strong>Stage 3:</strong> числа 11–20 (29 навыков)<br>
        <strong>Stage 4:</strong> десятки 30–100 (16 навыков)<br>
        Следующий этап открывается только когда <strong>все</strong> навыки текущего освоены.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">📝 Типы заданий</div>
        Новые навыки → больше <strong>выбора из вариантов</strong> (помогаем запомнить).<br>
        Освоенные навыки → только <strong>ввод и диктант</strong> (проверяем что знаешь).
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">🔊 Справочник</div>
        Нажми «Изучить числа» — откроются карточки. Клик по карточке запускает мини-дрил: посмотри → запомни → напиши 3 раза.
      </div>
      <div>
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">💾 Прогресс</div>
        Сохраняется автоматически в браузере. Можно закрыть вкладку и продолжить позже.
      </div>
    </div>`;
  $('faqModal').classList.add('show');
}

function closeFaq(){ $('faqModal').classList.remove('show'); }

// ═══════════════════════════════════════════
// ══ EVENTS ══
// ═══════════════════════════════════════════
function bindEvents(){
  $('startBtn').addEventListener('click',()=>startGame());
  $('studyBtn').addEventListener('click',openStudy);
  $('faqBtn').addEventListener('click',openFaq);
  $('faqCloseBtn').addEventListener('click',closeFaq);
  $('faqModal').addEventListener('click',e=>{if(e.target.id==='faqModal')closeFaq();});
  $('studyBackBtn').addEventListener('click',()=>{stopAudio();showScr('startScreen');renderStartScreen();});
  $('drillClose').addEventListener('click',closeDrill);
  $('drillOverlay').addEventListener('click',e=>{if(e.target.id==='drillOverlay')closeDrill();});
  $('pauseBtn').addEventListener('click',openPauseModal);
  $('resumeBtn').addEventListener('click',closePauseModal);
  $('restartBtn').addEventListener('click',restartFromPause);
  $('pauseHomeBtn').addEventListener('click',goHomeFromPause);
  $('retryBtn').addEventListener('click',()=>startGame());
  $('homeBtn').addEventListener('click',()=>{showScr('startScreen');renderStartScreen();});
  $('nextBtn').addEventListener('click',nextQ);
  $('pauseModal').addEventListener('click',e=>{if(e.target.id==='pauseModal')closePauseModal();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if($('faqModal').classList.contains('show'))closeFaq();else if($('drillOverlay').classList.contains('show'))closeDrill();else if($('pauseModal').classList.contains('show'))closePauseModal();else if($('studyScreen').classList.contains('active')){stopAudio();showScr('startScreen');renderStartScreen();}else if($('gameScreen').classList.contains('active'))openPauseModal();}
    if(e.key==='Enter'&&$('nextBtn').style.display==='block')nextQ();
  });
}

// ══ INIT ══
function init(){
  initSkills();
  const save=loadProgress();
  if(save){skillState=save.skillState;currentStage=save.currentStage||1;}
  bindEvents();renderStartScreen();
}
init();