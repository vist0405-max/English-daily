"use strict";
/* ================= English Daily — годовой курс ================= */
const SYL=["Знакомство и to be","Повседневные слова","Настоящее время","Прошлое и будущее","Разговор: работа и общение","Разговор: поездки и мнение","Числа, даты и календарь","Дом и быт","Одежда, цвета и покупки","Тело и здоровье","Погода и сравнения","Транспорт и город","Хобби и свободное время",
"Прошлое время: рассказы","Офис и совещания","Продажи и клиенты","Будущее: планы и прогнозы","Present Perfect: опыт","Путешествия: бронь и проблемы","Еда: готовка и количество","Письма и сообщения","Сравнения и выбор","Модальные глаголы: must, should","Деньги и банк","Технологии и телефон","Повторение полугодия",
"Past Continuous","Переговоры: предложения","Условия: if + will","Фразовые глаголы","Здоровье и спорт","Люди и характер","Present Perfect или Past Simple","Пассивный залог","Маркетинг и реклама","Культура и праздники","Условия: if + would","Фразовые глаголы для работы","Повторение 3-го квартала",
"Косвенная речь","Презентации","Переговоры: возражения","Who, which, that","-ing или to","Used to: как было раньше","Новости и экономика","Управление командой","Жалобы и решения","Small talk и нетворкинг","Собеседование и карьера","Планы и мечты","Итоги года"];
const MONTHS=[[1,4],[5,8],[9,13],[14,17],[18,21],[22,26],[27,30],[31,34],[35,39],[40,43],[44,47],[48,52]];
const LEVELS=["A0 → A1","A0 → A1","A0 → A1","A1 → A2","A1 → A2","A1 → A2","A2","A2","A2","A2 → B1","A2 → B1","A2 → B1"];
const TOTAL=365;
const WK={};(window.WEEKS||[]).forEach(w=>{WK[w.n]=w});
const TDEF={
 w:{n:"Новые слова",i:"📖",m:"5 мин"},r:{n:"Правило",i:"💡",m:"3 мин"},p:{n:"Тренировка",i:"✍️",m:"7 мин"},s:{n:"Говорение",i:"🎤",m:"10 мин"},
 rp:{n:"Повтор слов недели",i:"🔁",m:"10 мин"},rs:{n:"Фразы недели вслух",i:"🎤",m:"10 мин"},t:{n:"Разговорная практика",i:"💬",m:"15 мин"},
 fp:{n:"Итоговый тест",i:"🏆",m:"15 мин"},ft:{n:"Итоговый разговор",i:"💬",m:"15 мин"}};
const TYPES={L:["w","r","p","s"],R:["rp","rs"],T:["t"],F:["fp","ft"]};
const W=s=>{const a=s.split("|");return{en:a[0],tr:a[1],ru:a[2]}};
const P=s=>{const a=s.split("|");return{en:a[0],ru:a[1]}};
function info(d){
  if(d>=TOTAL)return{type:"F",week:52,title:"Итоговый экзамен года",ok:!!WK[52]};
  const n=Math.ceil(d/7),pos=(d-1)%7+1,wk=WK[n];
  if(pos<=5)return{type:"L",week:n,pos,ok:!!wk,les:wk&&wk.L[pos-1],title:wk?wk.L[pos-1].t:SYL[n-1]};
  if(pos===6)return{type:"R",week:n,ok:!!wk,title:"Повторение недели"};
  return{type:"T",week:n,ok:!!wk,title:"Разговорный день"};
}
const ALLW=[];
Object.keys(WK).map(Number).sort((a,b)=>a-b).forEach(n=>WK[n].L.forEach((l,i)=>l.w.forEach(s=>ALLW.push(Object.assign(W(s),{day:(n-1)*7+i+1})))));
function weekWords(n){const wk=WK[n];return wk?[].concat(...wk.L.map(l=>l.w.map(W))):[]}
function dayWords(d){const f=info(d);if(f.type==="L")return f.les.w.map(W);if(f.type==="R")return weekWords(f.week);if(f.type==="F")return ALLW.slice();return[]}
function dayPhrases(d){const f=info(d);if(f.type==="L")return f.les.ph.map(P);if(f.type==="R")return WK[f.week].L.map(l=>P(l.ph[1]||l.ph[0]));return[]}
function dayQuestions(d){const f=info(d);if(f.type==="T")return(WK[f.week].q||[]).map(P);if(f.type==="F"){const ws=Object.keys(WK).map(Number);return shuffle(ws).slice(0,6).map(n=>P(WK[n].q[0]))}return[]}
function dayTopic(d){const f=info(d);if(f.type==="L")return f.les.topic;if(f.type==="F")return"the learner's year of learning English, work, family, plans and dreams";return WK[f.week].topic}

/* ---------- Утилиты ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]+/g," ").replace(/\s+/g," ").trim();
const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>ymd(new Date());
function similarity(target,heard){const t=norm(target).split(" ").filter(Boolean),h=norm(heard).split(" ").filter(Boolean);if(!t.length)return 0;const pool=h.slice();let m=0;t.forEach(w=>{const k=pool.indexOf(w);if(k>-1){m++;pool.splice(k,1)}});return Math.round(m/t.length*100)}

/* ---------- Прогресс ---------- */
const KEY="english-daily-v2",OLD="english-daily-v1";
let S={v:2,done:{},act:[]};
function migrate(o){ // из 30-дневной версии
  if(!o||!o.done)return null;if(o.v===2)return o;
  const n={v:2,done:{},act:o.act||[]};
  Object.keys(o.done).forEach(k=>{const L=+k,wk=Math.ceil(L/5),pos=(L-1)%5+1;n.done[(wk-1)*7+pos]=o.done[k]});
  return n;
}
try{const raw=localStorage.getItem(KEY)||localStorage.getItem(OLD);if(raw){const o=migrate(JSON.parse(raw));if(o)S=o}}catch(e){}
if(!Array.isArray(S.act))S.act=[];
let dbRef=null,writing=false,pending=false;
function merge(o){o=migrate(o);if(!o)return;Object.keys(o.done).forEach(d=>{const a=S.done[d]||(S.done[d]={}),b=o.done[d]||{};Object.keys(TDEF).forEach(k=>{if(b[k])a[k]=1});a.score=Math.max(a.score||0,b.score||0);a.ai=Math.max(a.ai||0,b.ai||0);["ph","q"].forEach(f=>{if(Array.isArray(b[f])){a[f]=a[f]||[];b[f].forEach((v,i)=>{if(v)a[f][i]=true})}})});(o.act||[]).forEach(x=>{if(S.act.indexOf(x)<0)S.act.push(x)})}
async function pushDb(){if(!dbRef)return;if(writing){pending=true;return}writing=true;try{await dbRef.set(JSON.parse(JSON.stringify(S)))}catch(e){}writing=false;if(pending){pending=false;pushDb()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}pushDb()}
function dd(d){return S.done[d]||(S.done[d]={})}
function touch(){const t=today();if(S.act.indexOf(t)<0)S.act.push(t)}
function mark(d,k){dd(d)[k]=1;touch();save()}
const dayDone=d=>{const o=S.done[d];if(!o)return false;return TYPES[info(d).type].every(k=>o[k])};
const curDay=()=>{for(let d=1;d<=TOTAL;d++)if(!dayDone(d))return d;return TOTAL};
const doneCount=()=>{let c=0;for(let d=1;d<=TOTAL;d++)if(dayDone(d))c++;return c};
function streak(){const set=new Set(S.act);const x=new Date();if(!set.has(ymd(x)))x.setDate(x.getDate()-1);let n=0;while(set.has(ymd(x))){n++;x.setDate(x.getDate()-1)}return n}
const monthOf=n=>MONTHS.findIndex(m=>n>=m[0]&&n<=m[1]);

/* ---------- Озвучка, распознавание речи, ИИ ---------- */
const NATIVE=!!(window.Android&&typeof window.Android.speak==="function");
let tts=null,dict=null,sample=null,micDenied=false;
let listening=false,heard="",partial="",listenFor=null;
async function say(text){
  if(tts){try{await tts.speak(text,{language:"en",rate:0.85});return}catch(e){if(e&&e.code==="busy")return;if(e&&e.code==="not_granted")tts=null}}
  try{if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=0.85;const vs=speechSynthesis.getVoices();const v=vs.find(v=>/^en[-_]US/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}}catch(e){}
}
function wireDict(d){
  dict=d;if(!d)return;
  d.onPartial(({text})=>{partial=text||"";updateLive()});
  d.onFinal(({text})=>{if(text)heard=(heard+" "+text).trim();partial="";updateLive()});
  d.onState(({state})=>{if(state==="listening"){listening=true}else if(state==="idle"){if(listening){listening=false;finishListen()}}});
}
if(NATIVE){
  // Android-приложение: системная озвучка и распознавание речи Google
  tts={speak(text,o){try{window.Android.speak(String(text),(o&&o.rate)||0.85)}catch(e){}return Promise.resolve()}};
  const nd={_p:null,_f:null,_s:null,_st:null,
    onPartial(f){this._p=f},onFinal(f){this._f=f},onState(f){this._s=f},
    start(){return new Promise((res,rej)=>{this._st={res,rej};try{window.Android.startListening()}catch(e){this._st=null;rej({code:"error"})}})},
    stop(){try{window.Android.stopListening()}catch(e){}return Promise.resolve()}};
  window.__native=function(ev){
    if(typeof ev==="string"){try{ev=JSON.parse(ev)}catch(e){return}}
    if(ev.type==="partial"&&nd._p)nd._p({text:ev.text});
    else if(ev.type==="final"&&nd._f)nd._f({text:ev.text});
    else if(ev.type==="state"){if(ev.state==="listening"&&nd._st){nd._st.res();nd._st=null}if(nd._s)nd._s({state:ev.state})}
    else if(ev.type==="error"){if(nd._st){nd._st.rej({code:ev.code});nd._st=null}if(nd._s)nd._s({state:"idle"})}
  };
  wireDict(nd);
}else if(window.claude&&typeof window.claude.use==="function"){
  claude.use("tts").then(t=>{tts=t}).catch(()=>{});
  claude.use("dictation").then(d=>{wireDict(d);render()}).catch(()=>{});
  claude.use("sample").then(s=>{sample=s;render()}).catch(()=>{});
  Promise.all([claude.use("db"),claude.use("user")]).then(async([db,user])=>{
    if(!db||!user)return;const id=await user.id();if(!id)return;
    dbRef=db.doc("data/users/"+id+"/progress");
    const snap=await dbRef.get();
    if(snap.exists){merge(snap.data());try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}render()}
    if(Object.keys(S.done).length)pushDb();
  }).catch(()=>{});
}
function startMic(target){
  if(!dict)return;
  if(listening){dict.stop().catch(()=>{});return}
  listenFor=target;heard="";partial="";
  dict.start().catch(e=>{listening=false;listenFor=null;if(e&&e.code==="not_granted")micDenied=true;render()});
  listening=true;render();
}
function liveText(){return(heard+" "+partial).trim()}
function updateLive(){const el=document.getElementById("live");if(el)el.textContent=liveText()||"Говорите…";if(listenFor&&listenFor.kind==="chat"){const ta=document.getElementById("ta");if(ta)ta.value=(CH.draftBase+" "+liveText()).trim()}}
function finishListen(){
  const t=listenFor;listenFor=null;const said=liveText();
  if(!t){render();return}
  if(t.kind==="phrase"){
    const target=dayPhrases(t.day)[t.i].en,sc=said?similarity(target,said):0;
    SPres[t.day+":"+t.i]={score:sc,heard:said};
    if(sc>=70){const o=dd(t.day);o.ph=o.ph||[];o.ph[t.i]=true;touch();save();checkSpeak(t.day)}
  }else if(t.kind==="q"){
    const n=norm(said).split(" ").filter(Boolean).length;
    SPres["q"+t.day+":"+t.i]={heard:said,ok:n>=3};
    if(n>=3){const o=dd(t.day);o.q=o.q||[];o.q[t.i]=true;touch();save();checkTalk(t.day)}
  }else if(t.kind==="chat"){CH.draft=(CH.draftBase+" "+said).trim()}
  render();
}

/* ---------- Состояние экранов ---------- */
let V={tab:"home"},Q=null,SPres={},hideRu=false,dictQ="",CH=null,autoSpeak=true,openMonth=null;
function go(v){V=v;if(listening&&dict)dict.stop().catch(()=>{});render();window.scrollTo(0,0)}
function speakKey(d){return info(d).type==="L"?"s":"rs"}
function checkSpeak(d){const o=dd(d),ph=dayPhrases(d);if(ph.every((_,i)=>o.ph&&o.ph[i])){const k=speakKey(d);if(!o[k]){o[k]=1;touch();save()}}}
function checkTalk(d){const o=dd(d),k=info(d).type==="F"?"ft":"t",qs=dayQuestions(d);const okQ=qs.length&&qs.every((_,i)=>o.q&&o.q[i]);if((okQ||(o.ai||0)>=5)&&!o[k]){o[k]=1;touch();save()}}

/* ---------- Экраны ---------- */
function sayBtn(text){return`<button class="icon" data-act="say" data-say="${esc(text)}" aria-label="Слушать">🔊</button>`}
function taskRows(d){const f=info(d),o=S.done[d]||{};return TYPES[f.type].map(k=>{const t=TDEF[k],ok=!!o[k];return`<button class="task ${ok?"done":""}" data-act="task" data-d="${d}" data-k="${k}"><span class="ic">${t.i}</span><span class="tx"><b>${t.n}</b><span class="mute small">${t.m}</span></span><span class="chk">${ok?"✓":""}</span></button>`}).join("")}
function dayLabel(d){const f=info(d);return f.type==="F"?"День 365":`День ${d} · неделя ${f.week}`}
function vHome(){
  const c=curDay(),f=info(c),dc=doneCount(),mi=monthOf(f.week);
  let h=`<div class="card hero"><div class="row between"><div><div class="mute small">English Daily · курс на год</div><h1>Английский с нуля</h1></div><div style="font-size:34px">🇬🇧</div></div>
  <div class="stat"><div><b>🔥 ${streak()}</b><span class="small mute">дней подряд</span></div><div><b>${dc}/${TOTAL}</b><span class="small mute">дней пройдено</span></div></div>
  <div class="bar"><i style="width:${Math.max(1,Math.round(dc/TOTAL*100))}%"></i></div><p class="small mute" style="margin-top:8px">Месяц ${mi+1} из 12 · уровень ${LEVELS[mi]}</p></div>`;
  h+=`<div class="card"><span class="tag">Неделя ${f.week}: ${esc(SYL[f.week-1])}</span><h2 style="margin-top:8px">${dayLabel(c)}</h2><p style="font-weight:600;margin-top:2px">${esc(f.title)}</p>`;
  if(!f.ok){h+=`<div class="note">Уроки этого месяца скоро появятся в обновлении приложения.</div></div>`;return h+reminderCard()}
  h+=taskRows(c);
  const o=S.done[c]||{},next=TYPES[f.type].find(k=>!o[k]);
  h+=next?`<button class="btn" data-act="task" data-d="${c}" data-k="${next}">${Object.keys(o).length?"Продолжить":"Начать"} →</button>`:"";
  h+=`</div>`+reminderCard();
  if(!NATIVE)h+=`<div class="card"><details><summary>📲 Как поставить на главный экран Samsung</summary><p class="small">Откройте страницу в <b>Chrome</b> → меню <b>⋮</b> → <b>«Добавить на главный экран»</b>. В Chrome работают микрофон и озвучка.</p></details></div>`;
  return h;
}
function reminderCard(){
  if(NATIVE){let t="20:00";try{t=window.Android.getReminder()||"20:00"}catch(e){}
    return`<div class="card"><div class="row between"><div><h3>⏰ Напоминание</h3><p class="small mute">Каждый день в это время придёт уведомление</p></div><input type="time" id="rem" value="${esc(t)}" style="width:120px"></div></div>`}
  return`<div class="note">⏰ Ежедневное напоминание приходит из приложения English Daily на телефоне.</div>`;
}
function vPlan(){
  const c=curDay(),cm=monthOf(info(c).week);if(openMonth===null)openMonth=cm;
  let h=`<h1>План на год</h1><p class="mute">Каждая неделя: 5 уроков, повторение и разговорный день.</p>`;
  MONTHS.forEach((m,mi)=>{
    let doneM=0,allM=0;for(let n=m[0];n<=m[1];n++)for(let p=1;p<=7;p++){allM++;if(dayDone((n-1)*7+p))doneM++}
    h+=`<div class="card"><button class="day" style="border:0;padding:0" data-act="month" data-m="${mi}"><span style="flex:1"><h2>Месяц ${mi+1}</h2><span class="small mute">Уровень ${LEVELS[mi]} · ${doneM}/${allM}</span></span><span>${openMonth===mi?"▲":"▼"}</span></button>`;
    if(openMonth===mi){for(let n=m[0];n<=m[1];n++){h+=`<div class="wk">Неделя ${n}. ${esc(SYL[n-1])}</div>`;
      for(let p=1;p<=7;p++){const d=(n-1)*7+p,f=info(d),o=S.done[d]||{},cls=dayDone(d)?"ok":d===c?"cur":f.ok?"":"soon";
        h+=`<button class="day ${cls}" data-act="openday" data-d="${d}"><span class="num">${dayDone(d)?"✓":d}</span><span style="flex:1">${esc(f.title)}</span><span class="mini">${TYPES[f.type].map(k=>`<i class="${o[k]?"on":""}"></i>`).join("")}</span></button>`}}
      if(mi===11){const f=info(TOTAL);h+=`<div class="wk">Финал</div><button class="day ${dayDone(TOTAL)?"ok":""} ${f.ok?"":"soon"}" data-act="openday" data-d="${TOTAL}"><span class="num">🏆</span><span style="flex:1">${esc(f.title)}</span></button>`}}
    h+=`</div>`});
  return h;
}
function vDay(){
  const d=V.d,f=info(d);
  let h=`<div class="top"><button class="icon" data-act="back">←</button><h2>${dayLabel(d)}</h2></div><p style="font-weight:600">${esc(f.title)}</p>`;
  if(!f.ok)return h+`<div class="note">Этот день появится в следующем обновлении курса.</div>`;
  return h+`<div class="card">${taskRows(d)}</div>`;
}
function stepsBar(d,k){const o=S.done[d]||{};return`<div class="steps">${TYPES[info(d).type].map(x=>`<span class="${x===k?"on":o[x]?"ok":""}"></span>`).join("")}</div>`}
function head(d,k){const t=TDEF[k];return`<div class="top"><button class="icon" data-act="openday" data-d="${d}">←</button><h2>${t.i} ${t.n}</h2><span class="mute small">День ${d}</span></div>${stepsBar(d,k)}`}
function nextTask(d,k){const ks=TYPES[info(d).type],i=ks.indexOf(k);return ks[i+1]}
function vWords(){
  const d=V.d,ws=dayWords(d);
  let h=head(d,"w")+`<p class="mute small">Нажмите 🔊, послушайте и повторите каждое слово вслух 2–3 раза. Русские буквы подсказывают звучание.</p>`;
  h+=`<div class="card ${hideRu?"hide":""}">${ws.map(w=>`<div class="word">${sayBtn(w.en)}<div style="flex:1"><div class="en">${esc(w.en)}</div><div class="tr">[${esc(w.tr)}]</div></div><div class="ru" style="text-align:right;max-width:45%">${esc(w.ru)}</div></div>`).join("")}</div>`;
  h+=`<button class="btn ghost" data-act="hideru">${hideRu?"Показать перевод":"🙈 Скрыть перевод — проверь себя"}</button><button class="btn" data-act="donew" data-d="${d}">Слова выучены ✓</button>`;
  return h;
}
function vRule(){
  const d=V.d,les=info(d).les,ph=les.ph.map(P);
  let h=head(d,"r")+`<div class="card"><h2>${esc(les.r.h)}</h2><div class="rule" style="margin-top:10px">${les.r.p}</div></div>`;
  h+=`<div class="card"><h3 class="mute">Примеры</h3>${ph.slice(0,3).map(p=>`<div class="ex">${sayBtn(p.en)}<div><b>${esc(p.en)}</b><span class="mute small">${esc(p.ru)}</span></div></div>`).join("")}</div>`;
  return h+`<button class="btn" data-act="doner" data-d="${d}">Понятно ✓</button>`;
}
function buildQuiz(d,k){
  let src,count,phr=[];
  if(!d){const lim=curDay();src=shuffle(ALLW.filter(w=>w.day<=lim));count=10}
  else{src=dayWords(d);const f=info(d);count=f.type==="L"?8:f.type==="R"?12:20;phr=f.type==="F"?[]:shuffle(dayPhrases(d)).slice(0,2)}
  const items=shuffle(src).slice(0,count).map((w,i)=>{
    const others=shuffle(ALLW.filter(x=>x.en!==w.en&&x.ru!==w.ru)).slice(0,3);
    return{type:"mc",w,dir:i%2?"ru":"en",opts:shuffle([w].concat(others))}});
  phr.forEach(p=>{const toks=p.en.split(" ");let sh=shuffle(toks);if(toks.length>2&&sh.join(" ")===p.en)sh=shuffle(toks);items.push({type:"b",p,toks:sh})});
  return{d,k,items,i:0,score:0,ans:false,pick:null,built:[],right:false};
}
function vPractice(){
  const q=Q,d=q.d;
  let h=d?head(d,q.k):`<div class="top"><button class="icon" data-act="tab" data-t="dict">←</button><h2>Повторение слов</h2></div>`;
  if(q.i>=q.items.length){
    const pct=Math.round(q.score/q.items.length*100),pass=pct>=60;
    h+=`<div class="card" style="text-align:center"><div style="font-size:46px">${pass?"🎉":"💪"}</div><h2>${q.score} из ${q.items.length}</h2><p class="mute">${pass?"Отличный результат!":"Нужно 60%. Повторите слова и попробуйте ещё раз."}</p></div>`;
    h+=`<button class="btn ${pass?"ghost":""}" data-act="requiz">Пройти ещё раз</button>`;
    const nx=d&&nextTask(d,q.k);
    if(d&&pass&&nx)h+=`<button class="btn" data-act="task" data-d="${d}" data-k="${nx}">Дальше: ${TDEF[nx].n.toLowerCase()} →</button>`;
    if(d&&!pass&&q.k==="p")h+=`<button class="btn ghost" data-act="task" data-d="${d}" data-k="w">Повторить слова</button>`;
    return h;
  }
  const it=q.items[q.i];
  h+=`<p class="mute small">Вопрос ${q.i+1} из ${q.items.length}</p><div class="bar"><i style="width:${Math.round(q.i/q.items.length*100)}%"></i></div>`;
  if(it.type==="mc"){
    const prompt=it.dir==="en"?it.w.en:it.w.ru;
    h+=`<div class="card"><p class="mute small" style="text-align:center">${it.dir==="en"?"Выберите перевод":"Как это по-английски?"}</p><div class="q">${esc(prompt)}</div>${it.dir==="en"?`<div style="text-align:center">${sayBtn(it.w.en)}</div>`:""}</div>`;
    it.opts.forEach((o,k)=>{let cls="";if(q.ans){if(o.en===it.w.en)cls="good";else if(k===q.pick)cls="bad"}
      h+=`<button class="opt ${cls}" data-act="pick" data-k="${k}" ${q.ans?"disabled":""}>${esc(it.dir==="en"?o.ru:o.en)}</button>`});
    if(q.ans)h+=`<div class="fb ${q.right?"ok":"no"}">${q.right?"Верно!":"Правильно: "+esc(it.w.en)+" — "+esc(it.w.ru)}</div><button class="btn" data-act="nextq">Дальше →</button>`;
  }else{
    h+=`<div class="card"><p class="mute small">Соберите фразу по-английски</p><h2 style="font-family:Onest;font-weight:600">${esc(it.p.ru)}</h2>`;
    h+=`<div class="chips ans">${q.built.map((ti,k)=>`<button class="chip" data-act="unbuild" data-k="${k}" ${q.ans?"disabled":""}>${esc(it.toks[ti])}</button>`).join("")}</div>`;
    h+=`<div class="chips">${it.toks.map((t,ti)=>q.built.indexOf(ti)>-1?"":`<button class="chip" data-act="build" data-k="${ti}" ${q.ans?"disabled":""}>${esc(t)}</button>`).join("")}</div></div>`;
    if(q.ans)h+=`<div class="fb ${q.right?"ok":"no"}">${q.right?"Верно!":"Правильно: "+esc(it.p.en)}</div><button class="btn" data-act="nextq">Дальше →</button>`;
    else h+=`<button class="btn" data-act="checkb" ${q.built.length?"":"disabled"}>Проверить</button>`;
  }
  return h;
}
const micOn=()=>dict&&!micDenied;
function micNote(){return micOn()?"":`<div class="note">${micDenied?"Доступ к микрофону отклонён. Его можно включить в настройках телефона.":NATIVE?"Распознавание речи недоступно на этом телефоне.":"Проверка произношения работает, когда страница открыта в Chrome."} Пока тренируйтесь так: послушайте, повторите вслух 3 раза и отметьте ✓.</div>`}
function vSpeak(){
  const d=V.d,k=V.view,o=S.done[d]||{},ph=dayPhrases(d);
  let h=head(d,k)+(micOn()?`<p class="mute small">Послушайте 🔊, нажмите 🎤 и скажите фразу. Нажмите ■, когда закончите. Нужно совпадение от 70%.</p>`:micNote());
  h+=`<div class="card">`;
  ph.forEach((p,i)=>{const r=SPres[d+":"+i],passed=o.ph&&o.ph[i],isRec=listening&&listenFor&&listenFor.kind==="phrase"&&listenFor.day===d&&listenFor.i===i;
    h+=`<div class="phr"><div class="en">${esc(p.en)}</div><div class="mute small">${esc(p.ru)}</div><div class="ctrl">${sayBtn(p.en)}`;
    h+=micOn()?`<button class="icon ${isRec?"rec":""}" data-act="mic" data-d="${d}" data-i="${i}">${isRec?"■":"🎤"}</button>`:`<button class="icon" data-act="selfok" data-d="${d}" data-i="${i}">✓</button>`;
    if(passed)h+=`<span class="score ok">✓ Засчитано${r?" · "+r.score+"%":""}</span>`;else if(r)h+=`<span class="score no">${r.score}% — ещё раз</span>`;
    h+=`</div>`+(isRec?`<div class="live" id="live">${esc(liveText())||"Говорите…"}</div>`:r&&r.heard?`<div class="live">Распознано: «${esc(r.heard)}»</div>`:"")+`</div>`});
  h+=`</div>`;
  if(sample&&k==="s")h+=`<div class="card"><h2>💬 Бонус: диалог с ИИ</h2><p class="mute small">Поговорите на тему урока. ИИ задаёт простые вопросы и исправляет ошибки.</p><button class="btn sec" data-act="chat" data-d="${d}">Начать диалог</button></div>`;
  if(o[k]){const nx=nextTask(d,k);h+=nx?`<button class="btn" data-act="task" data-d="${d}" data-k="${nx}">Дальше →</button>`:dayDone(d)?`<div class="fb ok">День ${d} пройден! 🎉</div><button class="btn" data-act="tab" data-t="home">На главную</button>`:""}
  return h;
}
function vTalkDay(){
  const d=V.d,k=V.view,o=S.done[d]||{},qs=dayQuestions(d),f=info(d);
  if(!V.qs)V.qs=qs;const Qs=V.qs;
  let h=head(d,k)+`<p class="mute">Тема недели: <b>${esc(f.type==="F"?"итоги года":SYL[f.week-1])}</b>.</p>`;
  if(sample)h+=`<div class="card"><h2>💬 Диалог с ИИ</h2><p class="mute small">Ответьте собеседнику 5 раз — задание засчитано (сейчас ${Math.min(o.ai||0,5)}/5).</p><button class="btn sec" data-act="chat" data-d="${d}">Начать диалог</button></div><p class="mute small" style="text-align:center">или</p>`;
  h+=`<div class="card"><h2>🎤 Ответьте вслух</h2><p class="mute small">${micOn()?"Нажмите 🎤 и ответьте полным предложением (от 3 слов). Используйте слова недели.":"Ответьте вслух полным предложением и отметьте ✓."}</p>`;
  if(!micOn())h+=micNote();
  Qs.forEach((p,i)=>{const r=SPres["q"+d+":"+i],ok=o.q&&o.q[i],isRec=listening&&listenFor&&listenFor.kind==="q"&&listenFor.day===d&&listenFor.i===i;
    h+=`<div class="phr"><div class="en">${esc(p.en)}</div><div class="mute small">${esc(p.ru)}</div><div class="ctrl">${sayBtn(p.en)}`;
    h+=micOn()?`<button class="icon ${isRec?"rec":""}" data-act="qmic" data-d="${d}" data-i="${i}">${isRec?"■":"🎤"}</button>`:`<button class="icon" data-act="qok" data-d="${d}" data-i="${i}">✓</button>`;
    if(ok)h+=`<span class="score ok">✓ Ответ засчитан</span>`;else if(r)h+=`<span class="score no">Слишком коротко</span>`;
    h+=`</div>`+(isRec?`<div class="live" id="live">${esc(liveText())||"Говорите…"}</div>`:r&&r.heard?`<div class="live">«${esc(r.heard)}»</div>`:"")+`</div>`});
  h+=`</div>`;
  if(o[k]){const nx=nextTask(d,k);h+=nx?`<button class="btn" data-act="task" data-d="${d}" data-k="${nx}">Дальше →</button>`:`<div class="fb ok">День ${d} пройден! 🎉</div><button class="btn" data-act="tab" data-t="home">На главную</button>`}
  return h;
}
function vDict(){
  return`<h1>Словарь</h1><p class="mute">Слова из пройденных уроков.</p><button class="btn" data-act="review">🔁 Повторить 10 случайных слов</button><div style="margin-top:14px"><input type="search" id="dq" placeholder="Поиск по-английски или по-русски" value="${esc(dictQ)}"></div><div class="card" id="dlist">${dictList()}</div>`;
}
function dictList(){
  const lim=curDay(),q=dictQ.trim().toLowerCase();
  const ws=ALLW.filter(w=>w.day<=lim&&(!q||w.en.toLowerCase().indexOf(q)>-1||w.ru.toLowerCase().indexOf(q)>-1));
  if(!ws.length)return`<p class="mute">Ничего не найдено.</p>`;
  return ws.slice(0,400).map(w=>`<div class="word">${sayBtn(w.en)}<div style="flex:1"><div class="en" style="font-size:16px">${esc(w.en)}</div><div class="tr">[${esc(w.tr)}]</div></div><div class="ru" style="text-align:right;max-width:45%">${esc(w.ru)}<div class="small">день ${w.day}</div></div></div>`).join("");
}
function vTalk(){
  let h=`<h1>Разговор</h1>`;
  if(!sample)return h+`<p class="mute">Свободный диалог с ИИ-собеседником доступен в веб-версии English Daily внутри Claude.</p><div class="card"><h2>🎤 Практика здесь</h2><p class="mute small">В приложении разговорная практика — каждое воскресенье: вопросы недели, на которые нужно ответить вслух.</p><button class="btn" data-act="tab" data-t="plan">Открыть план</button></div>`;
  h+=`<p class="mute">Свободная практика с ИИ: он говорит просто, исправляет ошибки и переводит.</p><div class="card"><h3 class="mute" style="margin-bottom:10px">Темы пройденных недель</h3><div class="topics">`;
  const cw=info(curDay()).week;
  for(let n=1;n<=cw;n++)if(WK[n])h+=`<button data-act="chatw" data-w="${n}">${esc(SYL[n-1])}</button>`;
  return h+`<button data-act="chatw" data-w="0">✨ Свободная тема</button></div></div>`;
}
function vChat(){
  const c=CH;
  let h=`<div class="top"><button class="icon" data-act="chatback">←</button><h2>💬 ${esc(c.title)}</h2><button class="icon" data-act="autosp" title="Озвучка ответов">${autoSpeak?"🔊":"🔇"}</button></div>`;
  if(c.need)h+=`<p class="mute small">Ответов: ${Math.min(c.userCount,c.need)}/${c.need} для задания</p>`;
  h+=`<div class="chat" id="chat">`;
  c.msgs.forEach((m,i)=>{
    if(m.role==="ai")h+=`<div class="msg ai">${esc(m.en)}${m.showRu?`<div class="ru">${esc(m.ru)}</div>`:""}<div class="tools"><button data-act="say" data-say="${esc(m.en)}">🔊 Слушать</button><button data-act="tru" data-i="${i}">${m.showRu?"Скрыть":"Перевод"}</button></div></div>`;
    else{h+=`<div class="msg me">${esc(m.text)}</div>`;if(m.fix)h+=`<div class="fix">✏️ ${esc(m.fix)}</div>`}});
  if(c.busy)h+=`<div class="msg ai"><span class="typing"><i></i><i></i><i></i></span></div>`;
  if(c.err)h+=`<div class="note">${esc(c.err)} <button class="chip" data-act="retry">Повторить</button></div>`;
  h+=`</div>`;
  const isRec=listening&&listenFor&&listenFor.kind==="chat";
  h+=`<div class="compose"><textarea id="ta" rows="1" placeholder="Ответьте по-английски…">${esc(c.draft)}</textarea>${micOn()?`<button class="icon ${isRec?"rec":""}" data-act="chatmic">${isRec?"■":"🎤"}</button>`:""}<button class="icon" style="background:var(--acc);color:#fff;border-color:var(--acc)" data-act="send" ${c.busy?"disabled":""}>➤</button></div>`;
  return h+`<p class="mute small">Можно писать с ошибками или даже по-русски — ИИ подскажет, как сказать правильно.</p>`;
}

/* ---------- Чат с ИИ ---------- */
function lvlOf(week){if(week<=13)return["absolute beginner (A0–A1)","only the most common words, sentences of 4–8 words"];if(week<=26)return["beginner (A1–A2)","simple common words, sentences up to 12 words"];if(week<=39)return["elementary (A2)","everyday vocabulary, sentences up to 15 words"];return["pre-intermediate (A2–B1)","natural but clear English, sentences up to 18 words"]}
function openChat(opts){
  CH=Object.assign({msgs:[],busy:false,err:"",draft:"",draftBase:"",userCount:0},opts);
  go({tab:V.tab,view:"chat",from:V});aiTurn();
}
function sysPrompt(){
  const [lv,rule]=lvlOf(CH.week||info(curDay()).week);
  return `You are a warm, patient English conversation partner in a language-learning app. The learner is a Russian-speaking adult from Uzbekistan who works in sales. Level: ${lv}.
Topic of this conversation: ${CH.topic}.
Rules:
- Use ${rule}. Be friendly and encouraging.
- Each turn: react briefly to what the learner said, then ask exactly ONE question on the topic.
- If the learner's last message has English mistakes or is written in Russian, put in "fix" a short note in Russian that gives the correct English sentence, for example: «Правильно: I am a manager. Перед профессией нужен a.» If there are no mistakes, "fix" must be "".
- Reply ONLY with JSON: {"fix": string, "en": string, "ru": string}, where "en" is your reply in English and "ru" is its Russian translation.`;
}
function buildMsgs(){
  const out=[{role:"user",content:sysPrompt()+"\n\nStart now: greet the learner and ask one simple question about the topic. \"fix\" is \"\"."}];
  const hist=CH.msgs.slice(-16);
  if(hist.length&&hist[0].role!=="ai")out.push({role:"assistant",content:"Hello!"});
  hist.forEach(m=>out.push(m.role==="ai"?{role:"assistant",content:m.en}:{role:"user",content:m.text}));
  const last=out[out.length-1];
  if(last.role==="user"&&out.length>1)last.content+="\n\n(Reply with JSON {\"fix\",\"en\",\"ru\"} following the rules from the first message.)";
  if(last.role!=="user")out.push({role:"user",content:"(Continue the conversation with one question. JSON only.)"});
  return out;
}
async function aiTurn(){
  if(!sample||CH.busy)return;
  const ref=CH;CH.busy=true;CH.err="";render();scrollChat();
  try{
    let r=await sample.json(buildMsgs(),{modelTier:"quick"});
    if(typeof r==="string"){try{r=JSON.parse(r)}catch(e){r={en:r,ru:"",fix:""}}}
    if(!r||!r.en)throw{code:"bad"};
    if(ref!==CH)return;
    const lastMe=[...CH.msgs].reverse().find(m=>m.role==="me");
    if(lastMe&&r.fix&&!lastMe.fixed)lastMe.fix=r.fix;
    if(lastMe)lastMe.fixed=true;
    CH.msgs.push({role:"ai",en:String(r.en),ru:String(r.ru||""),showRu:(CH.week||1)<=8});
    CH.busy=false;render();scrollChat();
    if(autoSpeak)say(String(r.en));
  }catch(e){
    if(ref!==CH)return;CH.busy=false;
    if(e&&e.code==="not_granted"){sample=null;CH.err="Доступ к ИИ-собеседнику не разрешён."}
    else if(e&&e.code==="rate_limited")CH.err="Слишком много запросов. Подождите минуту.";
    else CH.err="Не удалось получить ответ.";
    render();scrollChat();
  }
}
function sendChat(){
  const ta=document.getElementById("ta");const text=(ta?ta.value:CH.draft).trim();
  if(!text||CH.busy)return;
  if(listening&&dict)dict.stop().catch(()=>{});
  CH.msgs.push({role:"me",text});CH.draft="";CH.draftBase="";CH.userCount++;
  if(CH.day){const o=dd(CH.day);o.ai=Math.max(o.ai||0,CH.userCount);touch();save();const t=info(CH.day).type;if(t==="T"||t==="F")checkTalk(CH.day)}
  aiTurn();
}
function scrollChat(){setTimeout(()=>window.scrollTo(0,document.body.scrollHeight),30)}

/* ---------- Рендер и события ---------- */
function render(){
  const app=document.getElementById("app");let h="";const v=V.view;
  if(v==="chat"&&CH)h=vChat();
  else if(v==="day")h=vDay();
  else if(v==="w")h=vWords();
  else if(v==="r")h=vRule();
  else if((v==="p"||v==="rp"||v==="fp"||v==="review")&&Q)h=vPractice();
  else if(v==="s"||v==="rs")h=vSpeak();
  else if(v==="t"||v==="ft")h=vTalkDay();
  else if(V.tab==="plan")h=vPlan();
  else if(V.tab==="dict")h=vDict();
  else if(V.tab==="talk")h=vTalk();
  else h=vHome();
  app.innerHTML=h;
  const tabs=[["home","🏠","Сегодня"],["plan","🗓️","План"],["dict","📚","Словарь"],["talk","💬","Разговор"]];
  document.getElementById("tabs").innerHTML=tabs.map(t=>`<button class="${V.tab===t[0]&&!v?"on":""}" data-act="tab" data-t="${t[0]}"><span>${t[1]}</span>${t[2]}</button>`).join("");
  const dq=document.getElementById("dq");if(dq)dq.oninput=()=>{dictQ=dq.value;document.getElementById("dlist").innerHTML=dictList()};
  const ta=document.getElementById("ta");if(ta){ta.oninput=()=>{CH.draft=ta.value};ta.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat()}}}
  const rem=document.getElementById("rem");if(rem)rem.onchange=()=>{const m=/^(\d{1,2}):(\d{2})/.exec(rem.value);if(m){try{window.Android.setReminder(+m[1],+m[2])}catch(e){}}};
}
document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const a=b.dataset.act,d=+b.dataset.d;
  switch(a){
    case"tab":go({tab:b.dataset.t});break;
    case"back":go({tab:V.tab});break;
    case"month":openMonth=openMonth===+b.dataset.m?-1:+b.dataset.m;render();break;
    case"openday":go({tab:V.tab,view:"day",d});break;
    case"task":{const k=b.dataset.k;if(!info(d).ok)break;if(k==="p"||k==="rp"||k==="fp")Q=buildQuiz(d,k);go({tab:V.tab,view:k,d});break}
    case"say":say(b.dataset.say);break;
    case"hideru":hideRu=!hideRu;render();break;
    case"donew":mark(d,"w");go({tab:V.tab,view:"r",d});break;
    case"doner":mark(d,"r");Q=buildQuiz(d,"p");go({tab:V.tab,view:"p",d});break;
    case"pick":{if(Q.ans)break;const it=Q.items[Q.i],k=+b.dataset.k;Q.pick=k;Q.ans=true;Q.right=it.opts[k].en===it.w.en;if(Q.right)Q.score++;if(it.dir==="ru")say(it.w.en);render();break}
    case"build":Q.built.push(+b.dataset.k);render();break;
    case"unbuild":Q.built.splice(+b.dataset.k,1);render();break;
    case"checkb":{const it=Q.items[Q.i];const s=Q.built.map(i=>it.toks[i]).join(" ");Q.ans=true;Q.right=norm(s)===norm(it.p.en);if(Q.right)Q.score++;say(it.p.en);render();break}
    case"nextq":{Q.i++;Q.ans=false;Q.pick=null;Q.built=[];Q.right=false;
      if(Q.i>=Q.items.length&&Q.d){const pct=Q.score/Q.items.length,o=dd(Q.d);o.score=Math.max(o.score||0,Math.round(pct*100));if(pct>=0.6)mark(Q.d,Q.k);else save()}
      render();window.scrollTo(0,0);break}
    case"requiz":Q=buildQuiz(Q.d,Q.k);render();break;
    case"review":Q=buildQuiz(null);go({tab:"dict",view:"review"});break;
    case"mic":startMic({kind:"phrase",day:d,i:+b.dataset.i});break;
    case"qmic":startMic({kind:"q",day:d,i:+b.dataset.i});break;
    case"selfok":{const o=dd(d);o.ph=o.ph||[];o.ph[+b.dataset.i]=true;touch();save();checkSpeak(d);render();break}
    case"qok":{const o=dd(d);o.q=o.q||[];o.q[+b.dataset.i]=true;touch();save();checkTalk(d);render();break}
    case"chat":{const f=info(d);const need=(f.type==="T"||f.type==="F")?5:0;openChat({day:d,week:f.week,topic:dayTopic(d),title:f.type==="L"?f.title:f.type==="F"?"Итоги года":SYL[f.week-1],need});break}
    case"chatw":{const n=+b.dataset.w;openChat({day:0,week:n||info(curDay()).week,topic:n?WK[n].topic:"any everyday topic the learner likes (work, family, travel, food, hobbies)",title:n?SYL[n-1]:"Свободная тема",need:0});break}
    case"chatback":{const f=V.from;if(listening&&dict)dict.stop().catch(()=>{});CH=null;go(f&&f.view?f:{tab:V.tab});break}
    case"tru":{const m=CH.msgs[+b.dataset.i];m.showRu=!m.showRu;render();break}
    case"send":sendChat();break;
    case"retry":aiTurn();break;
    case"autosp":autoSpeak=!autoSpeak;render();break;
    case"chatmic":{const ta=document.getElementById("ta");CH.draftBase=ta?ta.value.trim():CH.draft;startMic({kind:"chat"});break}
  }
});
// Кнопка «Назад» на Android
window.__back=function(){
  if(V.view==="chat"){const f=V.from;if(listening&&dict)dict.stop().catch(()=>{});CH=null;go(f&&f.view?f:{tab:V.tab});return true}
  if(V.view&&V.view!=="day"&&V.d){go({tab:V.tab,view:"day",d:V.d});return true}
  if(V.view){go({tab:V.tab});return true}
  if(V.tab!=="home"){go({tab:"home"});return true}
  return false;
};
render();
