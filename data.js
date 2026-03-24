// ═══════════════════════════════════════════
// data.js — Eesti Numbrid course data
// Swap this file to create a new trainer app.
// Engine helpers available: shuffle, pick, normalize, $
// ═══════════════════════════════════════════

// ══ WORDS ══
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

// ══ PHRASE PATTERNS (stages 5-8) ══
const PRONOUN_PATTERNS = [
  {et:'Sul on üks õun', ru:'У тебя одно яблоко', words:['Sul','on','üks','õun']},
  {et:'Sul on kolm koera', ru:'У тебя три собаки', words:['Sul','on','kolm','koera']},
  {et:'Sul on viis kassi', ru:'У тебя пять кошек', words:['Sul','on','viis','kassi']},
  {et:'Tal on kaks raamatut', ru:'У него две книги', words:['Tal','on','kaks','raamatut']},
  {et:'Tal on neli õuna', ru:'У него четыре яблока', words:['Tal','on','neli','õuna']},
  {et:'Tal on üks koer', ru:'У неё одна собака', words:['Tal','on','üks','koer']},
  {et:'Meil on kolm kassi', ru:'У нас три кошки', words:['Meil','on','kolm','kassi']},
  {et:'Meil on viis raamatut', ru:'У нас пять книг', words:['Meil','on','viis','raamatut']},
  {et:'Teil on kaks koera', ru:'У вас две собаки', words:['Teil','on','kaks','koera']},
  {et:'Neil on neli õuna', ru:'У них четыре яблока', words:['Neil','on','neli','õuna']},
  {et:'Neil on üks kass', ru:'У них одна кошка', words:['Neil','on','üks','kass']},
  {et:'Sul on kaks õuna', ru:'У тебя два яблока', words:['Sul','on','kaks','õuna']},
];

const AGE_PATTERNS = [
  {et:'Ma olen viis aastat vana', ru:'Мне 5 лет', words:['Ma','olen','viis','aastat','vana']},
  {et:'Ma olen seitse aastat vana', ru:'Мне 7 лет', words:['Ma','olen','seitse','aastat','vana']},
  {et:'Ma olen kümme aastat vana', ru:'Мне 10 лет', words:['Ma','olen','kümme','aastat','vana']},
  {et:'Sa oled viis aastat vana', ru:'Тебе 5 лет', words:['Sa','oled','viis','aastat','vana']},
  {et:'Sa oled kaheksa aastat vana', ru:'Тебе 8 лет', words:['Sa','oled','kaheksa','aastat','vana']},
  {et:'Ta on kolm aastat vana', ru:'Ему 3 года', words:['Ta','on','kolm','aastat','vana']},
  {et:'Ta on kuus aastat vana', ru:'Ей 6 лет', words:['Ta','on','kuus','aastat','vana']},
  {et:'Ta on üheksa aastat vana', ru:'Ему 9 лет', words:['Ta','on','üheksa','aastat','vana']},
  {et:'Ta on viisteist aastat vana', ru:'Ей 15 лет', words:['Ta','on','viisteist','aastat','vana']},
  {et:'Ta on kaheksateist aastat vana', ru:'Ему 18 лет', words:['Ta','on','kaheksateist','aastat','vana']},
  {et:'Kui vana sa oled', ru:'Сколько тебе лет?', words:['Kui','vana','sa','oled']},
  {et:'Kui vana ta on', ru:'Сколько ему/ей лет?', words:['Kui','vana','ta','on']},
];

const QA_PATTERNS = [
  {et:'Kas sul on kaks koera', ru:'У тебя есть две собаки?', words:['Kas','sul','on','kaks','koera']},
  {et:'Jah, mul on kaks koera', ru:'Да, у меня две собаки', words:['Jah','mul','on','kaks','koera']},
  {et:'Kas sul on kolm kassi', ru:'У тебя есть три кошки?', words:['Kas','sul','on','kolm','kassi']},
  {et:'Ei, mul ei ole kassi aga mul on üks koer', ru:'Нет, у меня нет кошек, но у меня одна собака', words:['Ei','mul','ei','ole','kassi','aga','mul','on','üks','koer']},
  {et:'Kas tal on viis raamatut', ru:'У него есть пять книг?', words:['Kas','tal','on','viis','raamatut']},
  {et:'Jah, tal on viis raamatut', ru:'Да, у него пять книг', words:['Jah','tal','on','viis','raamatut']},
  {et:'Mul ei ole ühtegi koera', ru:'У меня нет ни одной собаки', words:['Mul','ei','ole','ühtegi','koera']},
  {et:'Kas teil on neli õuna', ru:'У вас есть четыре яблока?', words:['Kas','teil','on','neli','õuna']},
  {et:'Jah, meil on neli õuna', ru:'Да, у нас четыре яблока', words:['Jah','meil','on','neli','õuna']},
  {et:'Ei, mul ei ole raamatut aga mul on kaks õuna', ru:'Нет, у меня нет книги, но у меня два яблока', words:['Ei','mul','ei','ole','raamatut','aga','mul','on','kaks','õuna']},
  {et:'Kas neil on seitse kassi', ru:'У них есть семь кошек?', words:['Kas','neil','on','seitse','kassi']},
  {et:'Jah, neil on seitse kassi', ru:'Да, у них семь кошек', words:['Jah','neil','on','seitse','kassi']},
];

const FAMILY_PATTERNS = [
  {et:'Mul on üks poeg', ru:'У меня один сын', words:['Mul','on','üks','poeg']},
  {et:'Mul on kaks poega', ru:'У меня два сына', words:['Mul','on','kaks','poega']},
  {et:'Mul on üks tütar', ru:'У меня одна дочь', words:['Mul','on','üks','tütar']},
  {et:'Mul on kolm tütart', ru:'У меня три дочери', words:['Mul','on','kolm','tütart']},
  {et:'Mul on kaks last', ru:'У меня двое детей', words:['Mul','on','kaks','last']},
  {et:'Tal on poeg ja tütar', ru:'У него сын и дочь', words:['Tal','on','poeg','ja','tütar']},
  {et:'Kas sul on lapsi', ru:'У тебя есть дети?', words:['Kas','sul','on','lapsi']},
  {et:'Mul ei ole lapsi', ru:'У меня нет детей', words:['Mul','ei','ole','lapsi']},
  {et:'Tal on kolm last', ru:'У него трое детей', words:['Tal','on','kolm','last']},
  {et:'Mul on poeg ja kaks tütart', ru:'У меня сын и две дочери', words:['Mul','on','poeg','ja','kaks','tütart']},
];

const PATTERN_MAP = { pron: PRONOUN_PATTERNS, age: AGE_PATTERNS, qa: QA_PATTERNS, family: FAMILY_PATTERNS };

// ══ HELPERS (data-specific) ══
function getNum(n){ return NUMBERS.find(x => x.n === n); }
function numsWithOrd(){ return NUMBERS.filter(x => !!x.ord); }
function numsSentence(){ return NUMBERS.filter(x => x.n >= 1 && x.n <= 19); }

function getRuNumeral(num, noun){
  return num.n === 2 ? (noun.gender === 'f' ? 'две' : 'два') : num.ru;
}

function makeSentence(num, noun){
  const nf = num.n === 1 ? noun.nom : noun.part;
  const et = `Mul on ${num.et} ${nf}`;
  let ru;
  if(num.n === 1) ru = `У меня ${noun.ruOne}`;
  else if(num.n <= 4) ru = `У меня ${getRuNumeral(num, noun)} ${noun.ruGen}`;
  else ru = `У меня ${num.ru} ${noun.ruGenPl}`;
  return { et, ru, words: ['Mul', 'on', num.et, nf] };
}

// Get numbers for current stage (used by exercise generators)
function stageNumbers(){
  const st = COURSE.stages.find(s => s.id === window.currentStage);
  return (st && st.nums || []).map(n => getNum(n)).filter(Boolean);
}

// ═══════════════════════════════════════════
// ══ EXERCISE GENERATORS — NUMBERS ══
// ═══════════════════════════════════════════
function makeChoiceNumToWord(num, key){
  const pool = stageNumbers(); const fb = pool.length > 1 ? pool : NUMBERS;
  const wr = shuffle(fb.filter(x => x.et !== num.et)).slice(0, 3).map(x => x.et);
  return { type:'choice', label:'Как будет по-эстонски?', qText:`${num.n}`, qRu:num.ru,
    answer:num.et, options:shuffle([num.et, ...wr]), reveal:num.et, _skillKey:key };
}

function makeChoiceWordToNum(num, key){
  const pool = stageNumbers(); const fb = pool.length > 1 ? pool : NUMBERS;
  const wr = shuffle(fb.filter(x => x.n !== num.n)).slice(0, 3).map(x => String(x.n));
  return { type:'choice', label:'Какое это число?', qText:num.et, qRu:'',
    answer:String(num.n), options:shuffle([String(num.n), ...wr]),
    reveal:`${num.et} = ${num.n}`, _audio:num.et, _skillKey:key };
}

function makeChoiceOrdinal(num, key){
  const pool = stageNumbers().filter(x => !!x.ord); const fb = pool.length > 1 ? pool : numsWithOrd();
  const wr = shuffle(fb.filter(x => x.n !== num.n)).slice(0, 3).map(x => x.ord);
  return { type:'choice', label:'Порядковое числительное', qText:`${num.n}-й (${num.ordRu})`, qRu:'',
    answer:num.ord, options:shuffle([num.ord, ...wr]),
    reveal:`${num.ordRu} = ${num.ord}`, _audio:num.ord, _skillKey:key };
}

function makeChoiceSentence(num, key){
  const noun = pick(NOUNS); const s = makeSentence(num, noun);
  const pool = stageNumbers().filter(x => x.n <= 19); const fb = pool.length > 1 ? pool : numsSentence();
  const wr = shuffle(fb.filter(x => x.n !== num.n)).slice(0, 3).map(x => x.et);
  const nf = num.n === 1 ? noun.nom : noun.part;
  return { type:'choice', label:'Вставь число', qText:`Mul on ___ ${nf}`, qRu:s.ru,
    answer:num.et, options:shuffle([num.et, ...wr]), reveal:s.et, _skillKey:key };
}

function makeBuildSentence(num, key){
  const noun = pick(NOUNS); const s = makeSentence(num, noun);
  const dist = [];
  const oth = stageNumbers().filter(x => x.n !== num.n);
  const extra = pick(oth.length ? oth : NUMBERS.filter(x => x.n !== num.n));
  if(extra) dist.push(extra.et);
  const wn = pick(NOUNS.filter(x => x.nom !== noun.nom));
  if(wn) dist.push(num.n === 1 ? wn.nom : wn.part);
  return { type:'build', label:'Собери предложение', qRu:s.ru,
    answer:s.words, bank:shuffle([...s.words, ...dist.slice(0, 2)]), reveal:s.et, _skillKey:key };
}

function makeTypingNumToWord(num, key){
  return { type:'typing', label:'Напиши число словом', qText:`Напиши по-эстонски: ${num.n}`,
    qRu:num.ru, answer:normalize(num.et), reveal:num.et, _skillKey:key };
}
function makeTypingOrdinal(num, key){
  return { type:'typing', label:'Напиши порядковое', qText:`Напиши по-эстонски: ${num.n}-й`,
    qRu:num.ordRu, answer:normalize(num.ord), reveal:num.ord, _skillKey:key };
}
function makeTypingSentence(num, key){
  const noun = pick(NOUNS); const s = makeSentence(num, noun);
  return { type:'typing', label:'Переведи на эстонский', qText:'Переведи:', qRu:s.ru,
    answer:normalize(s.et), reveal:s.et, _skillKey:key };
}
function makeTypingRuToEt(num, key){
  return { type:'typing', label:'Переведи число', qText:`${num.ru} по-эстонски:`, qRu:'',
    answer:normalize(num.et), reveal:num.et, _skillKey:key };
}
function makeTypingOrdRuToEt(num, key){
  return { type:'typing', label:'Напиши порядковое', qText:`«${num.ordRu}» по-эстонски:`, qRu:'',
    answer:normalize(num.ord), reveal:num.ord, _skillKey:key };
}

function makeDictationNumber(num, key){
  return { type:'dictation', label:'Аудио-диктант', qText:'Послушай и напиши число:',
    audioSentence:num.et, answer:normalize(num.et), reveal:num.et, _skillKey:key };
}
function makeDictationSentence(num, key){
  const noun = pick(NOUNS); const s = makeSentence(num, noun);
  return { type:'dictation', label:'Аудио-диктант', qText:'Послушай и напиши:',
    audioSentence:s.et, answer:normalize(s.et), reveal:s.et, _skillKey:key };
}
function makeDictationOrdinal(num, key){
  return { type:'dictation', label:'Аудио-диктант (порядковое)', qText:'Послушай и напиши порядковое:',
    audioSentence:num.ord, answer:normalize(num.ord), reveal:num.ord, _skillKey:key };
}

// ═══════════════════════════════════════════
// ══ EXERCISE GENERATORS — PATTERNS ══
// ═══════════════════════════════════════════
function makePatternChoice(pattern, key, allPatterns){
  const wrongs = shuffle(allPatterns.filter(p => p.et !== pattern.et)).slice(0, 3).map(p => p.et);
  return { type:'choice', label:'Выбери перевод', qText:pattern.ru, qRu:'',
    answer:pattern.et, options:shuffle([pattern.et, ...wrongs]),
    reveal:pattern.et, _audio:pattern.et, _skillKey:key };
}

function makePatternChoiceReverse(pattern, key, allPatterns){
  const wrongs = shuffle(allPatterns.filter(p => p.ru !== pattern.ru)).slice(0, 3).map(p => p.ru);
  return { type:'choice', label:'Что означает?', qText:pattern.et, qRu:'',
    answer:pattern.ru, options:shuffle([pattern.ru, ...wrongs]),
    reveal:pattern.et, _audio:pattern.et, _skillKey:key };
}

function makePatternBuild(pattern, key, allPatterns){
  const distractors = [];
  const other = pick(allPatterns.filter(p => p.et !== pattern.et));
  if(other){
    const diff = other.words.filter(w => !pattern.words.includes(w));
    if(diff.length) distractors.push(pick(diff));
  }
  const other2 = pick(allPatterns.filter(p => p.et !== pattern.et && p !== other));
  if(other2){
    const diff2 = other2.words.filter(w => !pattern.words.includes(w) && !distractors.includes(w));
    if(diff2.length) distractors.push(pick(diff2));
  }
  return { type:'build', label:'Собери предложение', qRu:pattern.ru,
    answer:pattern.words, bank:shuffle([...pattern.words, ...distractors]),
    reveal:pattern.et, _audio:pattern.et, _skillKey:key };
}

function makePatternTyping(pattern, key){
  return { type:'typing', label:'Переведи на эстонский', qText:'Переведи:', qRu:pattern.ru,
    answer:normalize(pattern.et), reveal:pattern.et, _audio:pattern.et, _skillKey:key };
}

// ═══════════════════════════════════════════
// ══ COURSE DEFINITION ══
// ═══════════════════════════════════════════
const COURSE = window.COURSE = {
  saveKey: 'numbrid_v3',
  sessionLen: 20,
  streakNeeded: 2,

  stages: [
    { id:1, label:'Числа 1–5',     nums:[1,2,3,4,5] },
    { id:2, label:'Числа 6–10',    nums:[6,7,8,9,10] },
    { id:3, label:'Числа 11–20',   nums:[11,12,13,14,15,16,17,18,19,20] },
    { id:4, label:'Десятки 30–100', nums:[30,40,50,60,70,80,90,100] },
    { id:5, label:'Местоимения',    patternType:'pron' },
    { id:6, label:'Возраст',        patternType:'age' },
    { id:7, label:'Вопросы',        patternType:'qa' },
    { id:8, label:'Семья',          patternType:'family' },
  ],

  getAllSkillKeys(){
    const keys = [];
    NUMBERS.forEach(num => {
      keys.push(`n${num.n}_card`);
      if(num.ord) keys.push(`n${num.n}_ord`);
      if(num.n >= 1 && num.n <= 19) keys.push(`n${num.n}_sent`);
    });
    Object.entries(PATTERN_MAP).forEach(([type, patterns]) => {
      patterns.forEach((_, i) => keys.push(`${type}_${i}`));
    });
    return keys;
  },

  getStageSkillKeys(stageId){
    const st = this.stages.find(s => s.id === stageId);
    if(!st) return [];
    const keys = [];
    if(st.nums){
      st.nums.forEach(n => {
        keys.push(`n${n}_card`);
        const num = getNum(n);
        if(num && num.ord) keys.push(`n${n}_ord`);
        if(n >= 1 && n <= 19) keys.push(`n${n}_sent`);
      });
    } else if(st.patternType){
      const patterns = PATTERN_MAP[st.patternType];
      if(patterns) patterns.forEach((_, i) => keys.push(`${st.patternType}_${i}`));
    }
    return keys;
  },

  makeExercise(skillKey, box){
    const roll = Math.random();
    let choiceP, buildP, typingP;
    if(box === 0)      { choiceP = 0.50; buildP = 0.65; typingP = 0.85; }
    else if(box === 1) { choiceP = 0.20; buildP = 0.35; typingP = 0.70; }
    else               { choiceP = 0.00; buildP = 0.10; typingP = 0.55; }

    // Number skills: n5_card, n5_ord, n5_sent
    const numMatch = skillKey.match(/^n(\d+)_(\w+)$/);
    if(numMatch){
      const num = getNum(parseInt(numMatch[1]));
      const form = numMatch[2];
      if(!num) return makeChoiceNumToWord(NUMBERS[0], skillKey);

      if(form === 'card'){
        if(roll < choiceP) return Math.random() > 0.5 ? makeChoiceNumToWord(num, skillKey) : makeChoiceWordToNum(num, skillKey);
        if(roll < buildP && num.n <= 19) return makeBuildSentence(num, skillKey);
        if(roll < typingP) return pick([makeTypingNumToWord, makeTypingRuToEt])(num, skillKey);
        return makeDictationNumber(num, skillKey);
      }
      if(form === 'ord'){
        if(roll < choiceP) return makeChoiceOrdinal(num, skillKey);
        if(roll < buildP && num.n <= 19) return makeBuildSentence(num, skillKey);
        if(roll < typingP) return pick([makeTypingOrdinal, makeTypingOrdRuToEt])(num, skillKey);
        return makeDictationOrdinal(num, skillKey);
      }
      if(form === 'sent'){
        if(roll < choiceP) return makeChoiceSentence(num, skillKey);
        if(roll < buildP) return makeBuildSentence(num, skillKey);
        if(roll < typingP) return makeTypingSentence(num, skillKey);
        return makeDictationSentence(num, skillKey);
      }
      return makeChoiceNumToWord(num, skillKey);
    }

    // Pattern skills: pron_3, age_0, qa_5, family_2
    const patMatch = skillKey.match(/^(\w+)_(\d+)$/);
    if(patMatch){
      const ptype = patMatch[1];
      const idx = parseInt(patMatch[2]);
      const patterns = PATTERN_MAP[ptype];
      if(patterns && patterns[idx]){
        const pattern = patterns[idx];
        if(roll < choiceP) return Math.random() > 0.5 ? makePatternChoice(pattern, skillKey, patterns) : makePatternChoiceReverse(pattern, skillKey, patterns);
        if(roll < buildP) return makePatternBuild(pattern, skillKey, patterns);
        return makePatternTyping(pattern, skillKey);
      }
    }

    return makeChoiceNumToWord(NUMBERS[0], skillKey);
  },

  faqHtml: `
    <div style="font-size:.88rem;line-height:1.65;color:var(--text-dim);">
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">🎯 Цель</div>
        Научиться использовать эстонские числа в живой речи — считать, говорить о возрасте, задавать вопросы, отвечать, рассказывать о семье. Уровень A1–A2.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">📦 Как учим</div>
        Каждая фраза или число — это навык. Навык проходит три ступени:<br>
        <span style="color:var(--danger);font-weight:700;">Новый</span> → <span style="color:var(--warning);font-weight:700;">Учу</span> → <span style="color:var(--success);font-weight:700;">Освоен</span><br>
        <strong>2 верных ответа подряд</strong> — навык идёт вперёд.<br>
        <strong>1 ошибка</strong> — возврат в начало. Жёстко, но эффективно.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">🔢 8 этапов</div>
        <strong>1–4:</strong> Числа от 1 до 100 — написание, порядковые, предложения с «Mul on»<br>
        <strong>5:</strong> Местоимения — sul on, tal on, meil on, teil on, neil on<br>
        <strong>6:</strong> Возраст — Ma olen ... aastat vana, Kui vana sa oled?<br>
        <strong>7:</strong> Вопросы — Kas sul on kaks koera? Jah / Ei + отрицания с числами<br>
        <strong>8:</strong> Семья — poeg, tütar, laps, Kas sul on lapsi?<br><br>
        Каждый следующий этап открывается когда <strong>все</strong> навыки текущего освоены.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">📝 Типы заданий</div>
        Для новых навыков — <strong>выбор из вариантов</strong> (помогаем запомнить).<br>
        Для продвинутых — <strong>сборка предложения</strong> из слов и <strong>ввод с клавиатуры</strong> (проверяем что реально знаешь).<br>
        Для чисел — ещё и <strong>аудио-диктант</strong>.
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">📖 Справочник</div>
        Кнопка «Изучить числа» — карточки всех чисел и фраз по этапам. Нажми на любую карточку — откроется мини-дрил: посмотри → запомни → напиши 3 раза.
      </div>
      <div>
        <div style="font-weight:800;color:var(--text);margin-bottom:4px;">💾 Прогресс</div>
        Сохраняется автоматически в браузере. Можно закрыть вкладку и вернуться в любой момент — всё на месте.
      </div>
    </div>`,

  renderStudy(container, helpers){
    const { openDrill, stopAudio } = helpers;
    const tabs = [
      { id:'tab1', label:'1–10' }, { id:'tab2', label:'11–19' },
      { id:'tab3', label:'20–100' }, { id:'tab4', label:'Примеры' }, { id:'tab5', label:'Фразы' }
    ];
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;justify-content:space-between;gap:6px;margin-bottom:16px;overflow-x:auto;-webkit-overflow-scrolling:touch;';
    const panels = {};

    tabs.forEach((tab, i) => {
      const btn = document.createElement('button'); btn.className = 'study-tab'; btn.textContent = tab.label;
      if(i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        stopAudio();
        tabBar.querySelectorAll('.study-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.values(panels).forEach(p => p.style.display = 'none');
        panels[tab.id].style.display = '';
      });
      tabBar.appendChild(btn);
      const panel = document.createElement('div'); panel.style.display = i === 0 ? '' : 'none';
      panels[tab.id] = panel;
    });

    container.appendChild(tabBar);
    Object.values(panels).forEach(p => container.appendChild(p));

    function makeCard(num, showOrd){
      const card = document.createElement('div'); card.className = 'study-card';
      card.innerHTML = `<div class="sc-num">${num.n}</div><div class="sc-et">${num.et}</div><div class="sc-ru">${num.ru}</div>${showOrd && num.ord ? `<div class="sc-ord">${num.ord} (${num.ordRu})</div>` : ''}`;
      card.addEventListener('click', () => openDrill(num.et, num.et, String(num.n), num.ru));
      if(showOrd && num.ord){
        card.addEventListener('contextmenu', e => { e.preventDefault(); openDrill(num.ord, num.ord, `${num.n}-й`, num.ordRu); });
      }
      return card;
    }

    function makeSentenceRow(num, noun){
      const s = makeSentence(num, noun);
      const row = document.createElement('div'); row.className = 'study-sentence';
      row.innerHTML = `<span class="ss-et">${s.et}</span><span class="ss-ru">${s.ru}</span>`;
      row.addEventListener('click', () => openDrill(s.et, s.et, s.ru, ''));
      return row;
    }

    function makePatternSection(title, patterns){
      const sec = document.createElement('div'); sec.style.marginBottom = '20px';
      const heading = document.createElement('div'); heading.className = 'study-note';
      heading.style.cssText = 'margin-bottom:10px;padding:10px 14px;';
      heading.innerHTML = `<strong>${title}</strong>`;
      sec.appendChild(heading);
      const grid = document.createElement('div'); grid.className = 'study-sentence-grid';
      patterns.forEach(p => {
        const row = document.createElement('div'); row.className = 'study-sentence';
        row.innerHTML = `<span class="ss-et">${p.et}</span><span class="ss-ru">${p.ru}</span>`;
        row.addEventListener('click', () => openDrill(p.et, p.et, p.ru, ''));
        grid.appendChild(row);
      });
      sec.appendChild(grid); return sec;
    }

    // Tab 1–3: Number cards
    const numGroups = [
      { panel: panels['tab1'], nums: NUMBERS.filter(x => x.n >= 1 && x.n <= 10), note: '<strong>Порядковые:</strong> esimene (1-й), teine (2-й), kolmas (3-й)... kümnes (10-й). Образуются по-разному — нужно запоминать каждое.' },
      { panel: panels['tab2'], nums: NUMBERS.filter(x => x.n >= 11 && x.n <= 19), note: '<strong>Количественные:</strong> корень+<strong>teist</strong><br>üks→üks<strong>teist</strong>, kaks→kaks<strong>teist</strong><br><br><strong>Порядковые:</strong> корень+<strong>teistkümnes</strong><br>ühe<strong>teistkümnes</strong>, kahe<strong>teistkümnes</strong>... (корень меняется!)' },
      { panel: panels['tab3'], nums: NUMBERS.filter(x => x.n >= 20), note: '<strong>Количественные:</strong> корень+<strong>kümmend</strong><br>kaks<strong>kümmend</strong>, kolm<strong>kümmend</strong>...<br><br><strong>Порядковые:</strong> корень+<strong>kümnes</strong><br>kahe<strong>kümnes</strong>, kolme<strong>kümnes</strong>...<br>Исключение: 100=<strong>sada</strong>→<strong>sajas</strong>' },
    ];
    numGroups.forEach(({ panel, nums, note }) => {
      const grid = document.createElement('div'); grid.className = 'study-grid';
      nums.forEach(n => grid.appendChild(makeCard(n, true)));
      panel.appendChild(grid);
      const noteEl = document.createElement('div'); noteEl.className = 'study-note'; noteEl.innerHTML = note;
      panel.appendChild(noteEl);
    });

    // Tab 4: Sentence examples
    const p4 = panels['tab4'];
    const n4 = document.createElement('div'); n4.className = 'study-note';
    n4.innerHTML = '<strong>Правило:</strong> после <strong>1</strong> — именительный падеж (õun, koer, raamat, kass). После <strong>2+</strong> — партитив (õun<strong>a</strong>, koer<strong>a</strong>, raamat<strong>ut</strong>, kass<strong>i</strong>)';
    p4.appendChild(n4);
    const sw = document.createElement('div'); sw.className = 'study-sentence-grid';
    [{n:1,noun:NOUNS[0]},{n:3,noun:NOUNS[0]},{n:1,noun:NOUNS[2]},{n:5,noun:NOUNS[2]},{n:1,noun:NOUNS[1]},{n:7,noun:NOUNS[1]},{n:1,noun:NOUNS[3]},{n:12,noun:NOUNS[3]}]
      .forEach(({n, noun}) => sw.appendChild(makeSentenceRow(getNum(n), noun)));
    p4.appendChild(sw);

    // Tab 5: Phrase patterns
    const p5 = panels['tab5'];
    p5.appendChild(makePatternSection('🗣 Местоимения (Stage 5)', PRONOUN_PATTERNS));
    p5.appendChild(makePatternSection('🎂 Возраст (Stage 6)', AGE_PATTERNS));
    p5.appendChild(makePatternSection('❓ Вопросы и ответы (Stage 7)', QA_PATTERNS));
    p5.appendChild(makePatternSection('👨‍👩‍👧‍👦 Семья (Stage 8)', FAMILY_PATTERNS));
  },
};

// ══ BOOT ══
init();