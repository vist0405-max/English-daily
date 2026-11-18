"use strict";
/* ================= English Daily — курсы языков ================= */
const COURSES={
 en:{id:"en",flag:"🇬🇧",name:"Английский",title:"Английский с нуля до B2",sub:"курс на год",plan:"План на год",goal:"B2 — комфортный разговор",
   lang:"en-US",langName:"English",inLang:"по-английски",weeks:window.WEEKS||[],keySuffix:"",
   syl:["Знакомство и to be","Повседневные слова","Настоящее время","Прошлое и будущее","О себе, друзья и приглашения","Поездки, мнение и любимые места","Числа, даты и календарь","Дом и быт","Одежда, цвета и покупки","Тело и здоровье","Погода и сравнения","Транспорт и город","Хобби и свободное время",
"Прошлое время: рассказы","Школа, учёба и навыки","Услуги: почта, аптека, ремонт","Будущее: планы и прогнозы","Present Perfect: опыт","Путешествия: бронь и проблемы","Еда: готовка и количество","Письма и сообщения","Сравнения и выбор","Модальные глаголы: must, should","Деньги и платежи","Технологии и телефон","Повторение полугодия",
"Past Continuous","Past Perfect: что было раньше","Условия: if + will","Фразовые глаголы","Здоровье, спорт и отдых","Люди и характер","Present Perfect или Past Simple","Пассивный залог","СМИ, соцсети и реклама","Культура и праздники","Условия: if + would","Фразовые глаголы и идиомы","Повторение 3-го квартала",
"Косвенная речь","Догадки: must have, might have","Дискуссии и аргументы","Who, which, that","-ing или to","Used to: как было раньше","Общество и экология","Сожаления: wish и смешанные условия","Жалобы и решения","Small talk и знакомства","Have something done и пассив B2","Планы и мечты","Итоги года"],
   months:[[1,4],[5,8],[9,13],[14,17],[18,21],[22,26],[27,30],[31,34],[35,39],[40,43],[44,47],[48,52]],
   levels:["A0 → A1","A0 → A1","A1","A1 → A2","A2","A2 → B1","B1","B1","B1 → B2","B1 → B2","B2","B2"]},
 uz:{id:"uz",flag:"🇺🇿",name:"Узбекский",title:"Узбекский с нуля до разговорного",sub:"курс на полгода",plan:"План на полгода",goal:"свободный бытовой разговор",
   lang:"uz-UZ",langName:"Uzbek",inLang:"по-узбекски",weeks:window.UZ_WEEKS||[],keySuffix:":uz",
   syl:window.UZ_SYL||[],
   months:[[1,4],[5,8],[9,13],[14,17],[18,21],[22,26]],
   levels:["A0 → A1","A1","A1 → A2","A2","A2","A2 → B1"]}
};
let C,SYL,MONTHS,LEVELS,TOTAL,NW,WK,ALLW;
function useCourse(id){
  C=COURSES[id]||COURSES.en;SYL=C.syl;MONTHS=C.months;LEVELS=C.levels;
  NW=MONTHS[MONTHS.length-1][1];TOTAL=NW*7+1;        // последний день — итоговый экзамен
  WK={};C.weeks.forEach(w=>{WK[w.n]=w});
  ALLW=[];Object.keys(WK).map(Number).sort((a,b)=>a-b).forEach(n=>WK[n].L.forEach((l,i)=>l.w.forEach(s=>ALLW.push(Object.assign(W(s),{day:(n-1)*7+i+1})))));
}
const TDEF={
 w:{n:"Новые слова",i:"📖",m:"5 мин"},r:{n:"Правило",i:"💡",m:"3 мин"},p:{n:"Тренировка",i:"✍️",m:"7 мин"},s:{n:"Говорение",i:"🎤",m:"10 мин"},
 rp:{n:"Повтор слов недели",i:"🔁",m:"10 мин"},rs:{n:"Фразы недели вслух",i:"🎤",m:"10 мин"},t:{n:"Разговорная практика",i:"💬",m:"15 мин"},
 fp:{n:"Итоговый тест",i:"🏆",m:"15 мин"},ft:{n:"Итоговый разговор",i:"💬",m:"15 мин"}};
const TYPES={L:["w","r","p","s"],R:["rp","rs"],T:["t"],F:["fp","ft"]};
// слово: "en|транскрипция|перевод" или "uz|перевод" (транскрипция строится автоматически)
const W=s=>{const a=s.split("|");if(a.length===2)return{en:a[0],tr:uzToRu(a[0]),ru:a[1]};return{en:a[0],tr:a[1],ru:a[2]}};
const P=s=>{const a=s.split("|");return{en:a[0],ru:a[1]}};
function info(d){
  if(d>=TOTAL)return{type:"F",week:NW,title:"Итоговый экзамен",ok:!!WK[NW]};
  const n=Math.ceil(d/7),pos=(d-1)%7+1,wk=WK[n];
  if(pos<=5)return{type:"L",week:n,pos,ok:!!wk,les:wk&&wk.L[pos-1],title:wk?wk.L[pos-1].t:SYL[n-1]};
  if(pos===6)return{type:"R",week:n,ok:!!wk,title:"Повторение недели"};
  return{type:"T",week:n,ok:!!wk,title:"Разговорный день"};
}
function weekWords(n){const wk=WK[n];return wk?[].concat(...wk.L.map(l=>l.w.map(W))):[]}
function dayWords(d){const f=info(d);if(f.type==="L")return f.les.w.map(W);if(f.type==="R")return weekWords(f.week);if(f.type==="F")return ALLW.slice();return[]}
function dayPhrases(d){const f=info(d);if(f.type==="L")return f.les.ph.map(P);if(f.type==="R")return WK[f.week].L.map(l=>P(l.ph[1]||l.ph[0]));return[]}
function dayQuestions(d){const f=info(d);if(f.type==="T")return(WK[f.week].q||[]).map(P);if(f.type==="F"){const ws=Object.keys(WK).map(Number);return shuffle(ws).slice(0,6).map(n=>P(WK[n].q[0]))}return[]}
function dayTopic(d){const f=info(d);if(f.type==="L")return f.les.topic;if(f.type==="F")return"everything the learner has studied in the "+C.langName+" course: everyday life, family, travel, opinions, plans and dreams";return WK[f.week].topic}

/* ---------- Утилиты ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s).toLowerCase().replace(/[’']/g,"'").replace(/[^a-z0-9' ]+/g," ").replace(/\s+/g," ").trim();
const ymd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>ymd(new Date());
/* ---------- Числа: распознавание речи пишет «5», «10:30», «2025», «1st» — переводим в слова ---------- */
const ONES=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function under100(n){return n<20?ONES[n]:TENS[Math.floor(n/10)]+(n%10?" "+ONES[n%10]:"")}
function under1000(n,and){const h=Math.floor(n/100),r=n%100;if(!h)return under100(r);return ONES[h]+" hundred"+(r?(and?" and ":" ")+under100(r):"")}
function cardinal(n,and){
  if(n===0)return"zero";const parts=[];
  [[1e9,"billion"],[1e6,"million"],[1e3,"thousand"]].forEach(([v,name])=>{if(n>=v){parts.push(under1000(Math.floor(n/v),and)+" "+name);n%=v}});
  if(n)parts.push((and&&parts.length&&n<100?"and ":"")+under1000(n,and));
  return parts.join(" ");
}
const ORD={one:"first",two:"second",three:"third",five:"fifth",eight:"eighth",nine:"ninth",twelve:"twelfth"};
function ordinal(n){const w=cardinal(n).split(" ");const l=w.pop();w.push(ORD[l]||(/y$/.test(l)?l.slice(0,-1)+"ieth":l+"th"));return w.join(" ")}
function yearWords(n){const a=Math.floor(n/100),b=n%100;if(b===0)return under100(a)+" hundred";return under100(a)+" "+(b<10?"oh "+ONES[b]:under100(b))}
function digitsWords(str){return str.split("").map(c=>c==="0"?"zero oh":ONES[+c]).join(" ")}
// rich=true (для распознанной речи): добавляем все варианты прочтения — лишние слова не мешают совпадению
function numToWords(str,rich){
  const n=parseInt(str,10);if(!isFinite(n))return str;
  if(str.length>1&&str[0]==="0"||str.length>9)return digitsWords(str);
  let out=cardinal(n,false);
  if(rich){
    out+=" "+cardinal(n,true);
    if(n>=1000&&n<=2099)out+=" "+yearWords(n);
    if(str.length>=2)out+=" "+digitsWords(str);
    if(/^1\d\d$|^1\d{3}$/.test(str))out+=" a";
  }
  return out;
}
const HOMO={for:"four",fore:"four",to:"two",too:"two",won:"one",ate:"eight",okay:"ok",mister:"mr",missus:"mrs"};
function spoken(s,rich){
  s=String(s).toLowerCase().replace(/[’']/g,"'");
  s=s.replace(/(\d),(?=\d{3}\b)/g,"$1");                     // 1,000 → 1000
  s=s.replace(/\b([ap])\.\s?m\.?/g,"$1m");                     // a.m. → am
  s=s.replace(/\b(\d{1,2}):(\d{2})\b/g,(_,h,m)=>{h=+h;const mm=+m;return " "+cardinal(h)+" "+(mm===0?"o'clock"+(rich?" hundred":""):(mm<10?"oh "+ONES[mm]+(rich?" zero":""):under100(mm)))+" "});
  s=s.replace(/\b(\d+)(st|nd|rd|th)\b/g,(_,d)=>" "+ordinal(+d)+" ");
  s=s.replace(/(\d+)\.(\d+)/g,(_,a,b)=>" "+numToWords(a,rich)+" point "+digitsWords(b).replace(/ oh/g,"")+" ");
  s=s.replace(/\$\s?(\d+)/g,"$1 dollars").replace(/€\s?(\d+)/g,"$1 euros").replace(/£\s?(\d+)/g,"$1 pounds");
  s=s.replace(/(\d+)\s?%/g,"$1 percent").replace(/&/g," and ").replace(/\+/g," plus ");
  s=s.replace(/\d+/g,d=>" "+numToWords(d,rich)+" ");
  return norm(s).split(" ").filter(Boolean).map(w=>HOMO[w]||w);
}
/* ---------- Узбекский: транскрипция, кириллица, числа ---------- */
const APOS=/[’‘ʻʼ`´']/g;
// латиница → русские буквы (подсказка чтения и озвучка русским голосом, если нет узбекского)
function uzToRu(t){
  let s=" "+String(t).replace(APOS,"'")+" ";
  const pairs=[["O'","У"],["o'","у"],["G'","Г"],["g'","г"],["Sh","Ш"],["sh","ш"],["Ch","Ч"],["ch","ч"],["Yo","Ё"],["yo","ё"],["Yu","Ю"],["yu","ю"],["Ya","Я"],["ya","я"],["Ye","Е"],["ye","е"]];
  pairs.forEach(([a,b])=>{s=s.split(a).join(b)});
  s=s.replace(/(^|[\s\-.,!?«"(])([Ee])/g,(m,p,e)=>p+(e==="E"?"Э":"э"));  // e в начале слова — э
  const M={a:"а",b:"б",d:"д",e:"е",f:"ф",g:"г",h:"х",i:"и",j:"дж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"к",r:"р",s:"с",t:"т",u:"у",v:"в",x:"х",y:"й",z:"з",c:"с",w:"в"};
  s=s.replace(/[a-zA-Z]/g,c=>{const r=M[c.toLowerCase()];if(!r)return c;return c===c.toLowerCase()?r:r[0].toUpperCase()+r.slice(1)});
  return s.replace(/'/g,"").trim();
}
// узбекская кириллица → латиница (распознавание иногда пишет кириллицей)
const UZC={"а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"x","ц":"ts","ч":"ch","ш":"sh","щ":"sh","ъ":"'","ь":"","ы":"i","э":"e","ю":"yu","я":"ya","ў":"o'","қ":"q","ғ":"g'","ҳ":"h"};
// «е» в начале слова и после гласной (или ъ) читается как «ye»: ер → yer, қаер → qayer
function uzCyrToLat(s){return String(s).toLowerCase().replace(/(^|[^а-яёўқғҳ]|[аеёиоуўэюяъ])е/g,"$1ye").replace(/[а-яёўқғҳ]/g,c=>UZC[c]!=null?UZC[c]:c)}
const UZ1=["nol","bir","ikki","uch","to'rt","besh","olti","yetti","sakkiz","to'qqiz"],UZ10=["","o'n","yigirma","o'ttiz","qirq","ellik","oltmish","yetmish","sakson","to'qson"];
function uzUnder1000(n){const h=Math.floor(n/100),t=Math.floor(n%100/10),o=n%10,w=[];if(h)w.push((h>1?UZ1[h]+" ":"")+"yuz");if(t)w.push(UZ10[t]);if(o)w.push(UZ1[o]);return w.join(" ")}
function uzCardinal(n){if(n===0)return"nol";const w=[];[[1e9,"milliard"],[1e6,"million"],[1e3,"ming"]].forEach(([v,nm])=>{if(n>=v){const k=Math.floor(n/v);w.push((k>1||v>1e3?uzUnder1000(k)+" ":"")+nm);n%=v}});if(n)w.push(uzUnder1000(n));return w.join(" ")}
function uzOrdinal(n){const c=uzCardinal(n);return c+(/[aeiou]$/.test(c)?"nchi":"inchi")}
function uzNum(str,rich){const n=parseInt(str,10);if(!isFinite(n))return str;if(str.length>1&&str[0]==="0"||str.length>9)return str.split("").map(c=>UZ1[+c]).join(" ");let o=uzCardinal(n);if(rich&&n>=1000&&n<2000)o+=" bir ming";if(rich&&n>=100&&n<200)o+=" bir yuz";return o}
function spokenUz(s,rich){
  s=uzCyrToLat(s).replace(APOS,"'");
  s=s.replace(/(\d)[ ,](?=\d{3}\b)/g,"$1");
  s=s.replace(/\b(\d{1,2}):(\d{2})\b/g,(_,h,m)=>" "+uzCardinal(+h)+(+m?" "+uzCardinal(+m):"")+(rich&&+m===30?" yarim":"")+" ");
  s=s.replace(/\b(\d+)\s?-?\s?(inchi|nchi|chi)\b/g,(_,d)=>" "+uzOrdinal(+d)+" ");
  s=s.replace(/(\d+)\s?%/g,"$1 foiz").replace(/\$\s?(\d+)/g,"$1 dollar");
  s=s.replace(/(\d+)\s?-\s?(?=[a-z])/g,"$1 ");
  s=s.replace(/\d+/g,d=>" "+uzNum(d,rich)+" ");
  // апострофы и h/x часто пишут по-разному — сравниваем без них
  return s.replace(/'/g,"").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim().split(" ").filter(Boolean).map(w=>w.replace(/h/g,"x"));
}
function spokenAny(s,rich){return C&&C.id==="uz"?spokenUz(s,rich):spoken(s,rich)}
function similarity(target,heard){const t=spokenAny(target,false),h=spokenAny(heard,true);if(!t.length)return 0;const pool=h.slice();let m=0;t.forEach(w=>{const k=pool.indexOf(w);if(k>-1){m++;pool.splice(k,1)}});return Math.round(m/t.length*100)}
function bestMatch(target,variants){let best={score:0,heard:variants[0]||""};variants.forEach(v=>{if(!v)return;const sc=similarity(target,v);if(sc>best.score)best={score:sc,heard:v}});return best}

/* ---------- Прогресс ---------- */
const KEY="english-daily-v2",OLD="english-daily-v1";
let S={v:2,done:{},act:[]};
function migrate(o){ // из 30-дневной версии
  if(!o||!o.done)return null;if(o.v===2)return o;
  const n={v:2,done:{},act:o.act||[]};
  Object.keys(o.done).forEach(k=>{const L=+k,wk=Math.ceil(L/5),pos=(L-1)%5+1;n.done[(wk-1)*7+pos]=o.done[k]});
  return n;
}
/* ---------- Семья: у каждого свой профиль и свой прогресс ---------- */
const PKEY="english-daily-profiles";
let PR={list:[{id:"p1",name:"Профиль 1",av:"🙂"}],cur:"p1"};
try{const r=localStorage.getItem(PKEY);if(r){const o=JSON.parse(r);if(o&&Array.isArray(o.list)&&o.list.length)PR=o}}catch(e){}
if(!PR.list.some(p=>p.id===PR.cur))PR.cur=PR.list[0].id;
const AVS=["🙂","👩","👨","👧","👦","👵","👴","🧑","🐱","🦊","🐻","🌟"];
// первый профиль английского хранится по старому ключу — прогресс не теряется; у каждого курса свой ключ
const pkey=(id,c)=>(id==="p1"?KEY:KEY+":"+id)+COURSES[c||(C&&C.id)||"en"].keySuffix;
const curProfile=()=>PR.list.find(p=>p.id===PR.cur)||PR.list[0];
const courseOf=p=>p&&COURSES[p.course]?p.course:"en";
useCourse(courseOf(curProfile()));
function saveProfiles(){try{localStorage.setItem(PKEY,JSON.stringify(PR))}catch(e){}}
function loadProgress(id){
  let o=null;
  try{const raw=localStorage.getItem(pkey(id))||(id==="p1"&&C.id==="en"?localStorage.getItem(OLD):null);if(raw)o=migrate(JSON.parse(raw))}catch(e){}
  S=o||{v:2,done:{},act:[]};if(!S.done)S.done={};if(!Array.isArray(S.act))S.act=[];
}
function progressOf(id,c){c=c||C.id;if(id===PR.cur&&c===C.id)return S;try{const raw=localStorage.getItem(pkey(id,c));if(raw)return migrate(JSON.parse(raw))||{done:{},act:[]}}catch(e){}return{done:{},act:[]}}
// сколько дней пройдено в курсе c (не переключая текущий курс)
function daysDoneIn(id,c){const o=progressOf(id,c),cc=COURSES[c],nw=cc.months[cc.months.length-1][1],tot=nw*7+1;let n=0;
  for(let d=1;d<=tot;d++){const x=o.done&&o.done[d];if(!x)continue;const pos=(d-1)%7+1,t=d>=tot?"F":pos<=5?"L":pos===6?"R":"T";if(TYPES[t].every(k=>x[k]))n++}return{n,tot}}
loadProgress(PR.cur);
let dbRef=null,writing=false,pending=false,dbRoot=null;
function merge(o){o=migrate(o);if(!o)return;Object.keys(o.done).forEach(d=>{const a=S.done[d]||(S.done[d]={}),b=o.done[d]||{};Object.keys(TDEF).forEach(k=>{if(b[k])a[k]=1});a.score=Math.max(a.score||0,b.score||0);a.ai=Math.max(a.ai||0,b.ai||0);["ph","q"].forEach(f=>{if(Array.isArray(b[f])){a[f]=a[f]||[];b[f].forEach((v,i)=>{if(v)a[f][i]=true})}})});(o.act||[]).forEach(x=>{if(S.act.indexOf(x)<0)S.act.push(x)})}
async function pushDb(){if(!dbRef)return;if(writing){pending=true;return}writing=true;try{await dbRef.set(JSON.parse(JSON.stringify(S)))}catch(e){}writing=false;if(pending){pending=false;pushDb()}}
function save(){try{localStorage.setItem(pkey(PR.cur),JSON.stringify(S))}catch(e){}pushDb()}
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
let listening=false,heard="",partial="",listenFor=null,heardAlts=[];
// Узбекский голос есть не на каждом телефоне — тогда читаем транскрипцию русским голосом
let uzVoice=null; // true / false / null (ещё не знаем)
function hasNativeVoice(lang){try{if(typeof window.Android.hasVoice!=="function")return false;const r=window.Android.hasVoice(lang);if(r==="wait")return null;return r==="yes"}catch(e){return false}}
function voiceFor(text){
  if(C.id!=="uz")return{text,lang:C.lang};
  if(NATIVE){if(uzVoice===null)uzVoice=hasNativeVoice("uz-UZ");if(uzVoice)return{text,lang:"uz-UZ"};return{text:uzToRu(text),lang:"ru-RU"}}
  try{const vs=("speechSynthesis" in window)?speechSynthesis.getVoices():[];if(vs.some(v=>/^uz/i.test(v.lang)))return{text,lang:"uz-UZ"}}catch(e){}
  return{text:uzToRu(text),lang:"ru-RU"};
}
async function say(text){
  const v=voiceFor(String(text));
  if(tts){try{await tts.speak(v.text,{language:v.lang.slice(0,2),rate:0.85});return}catch(e){if(e&&e.code==="busy")return;if(e&&e.code==="not_granted")tts=null}}
  try{if("speechSynthesis" in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(v.text);u.lang=v.lang;u.rate=0.85;const vs=speechSynthesis.getVoices();const re=new RegExp("^"+v.lang.slice(0,2),"i");const vc=vs.find(x=>x.lang.replace("_","-")===v.lang)||vs.find(x=>re.test(x.lang));if(vc)u.voice=vc;speechSynthesis.speak(u)}}catch(e){}
}
function wireDict(d){
  dict=d;if(!d)return;
  d.onPartial(({text})=>{partial=text||"";updateLive()});
  d.onFinal(({text,alts})=>{const base=heard;if(text)heard=(base+" "+text).trim();if(Array.isArray(alts))heardAlts=heardAlts.concat(alts.map(a=>(base+" "+a).trim()));partial="";updateLive()});
  d.onState(({state})=>{if(state==="listening"){listening=true}else if(state==="idle"){if(listening){listening=false;finishListen()}}});
}
if(NATIVE){
  // Android-приложение: системная озвучка и распознавание речи Google
  tts={speak(text,o){const rate=(o&&o.rate)||0.85,lang=o&&o.language==="uz"?"uz-UZ":o&&o.language==="ru"?"ru-RU":"en-US";
    try{if(typeof window.Android.speakIn==="function")window.Android.speakIn(String(text),rate,lang);else window.Android.speak(String(text),rate)}catch(e){}return Promise.resolve()}};
  const nd={_p:null,_f:null,_s:null,_st:null,
    onPartial(f){this._p=f},onFinal(f){this._f=f},onState(f){this._s=f},
    start(){return new Promise((res,rej)=>{this._st={res,rej};try{if(typeof window.Android.startListeningIn==="function")window.Android.startListeningIn(C.lang);else window.Android.startListening()}catch(e){this._st=null;rej({code:"error"})}})},
    stop(){try{window.Android.stopListening()}catch(e){}return Promise.resolve()}};
  window.__native=function(ev){
    if(typeof ev==="string"){try{ev=JSON.parse(ev)}catch(e){return}}
    if(ev.type==="partial"&&nd._p)nd._p({text:ev.text});
    else if(ev.type==="final"&&nd._f)nd._f({text:ev.text,alts:ev.alts});
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
    dbRoot={db,id};await attachDb();
  }).catch(()=>{});
}
async function attachDb(){
  if(!dbRoot)return;const pid=PR.cur;
  dbRef=dbRoot.db.doc("data/users/"+dbRoot.id+"/"+(pid==="p1"?"progress":"progress-"+pid)+(C.id==="en"?"":"-"+C.id));
  try{const snap=await dbRef.get();if(pid!==PR.cur)return;
    if(snap.exists){merge(snap.data());try{localStorage.setItem(pkey(pid),JSON.stringify(S))}catch(e){}render()}
    if(Object.keys(S.done).length)pushDb()}catch(e){}
}
function reloadState(){loadProgress(PR.cur);dbRef=null;attachDb();SPres={};Q=null;openMonth=null}
function switchProfile(id){if(id===PR.cur)return;PR.cur=id;saveProfiles();useCourse(courseOf(curProfile()));reloadState()}
function switchCourse(c){if(!COURSES[c]||c===C.id)return;curProfile().course=c;saveProfiles();useCourse(c);reloadState()}
function startMic(target){
  if(!dict)return;
  if(listening){dict.stop().catch(()=>{});return}
  listenFor=target;heard="";partial="";heardAlts=[];
  dict.start().catch(e=>{listening=false;listenFor=null;if(e&&e.code==="not_granted")micDenied=true;render()});
  listening=true;render();
}
function liveText(){return(heard+" "+partial).trim()}
function updateLive(){const el=document.getElementById("live");if(el)el.textContent=liveText()||"Говорите…";if(listenFor&&listenFor.kind==="chat"){const ta=document.getElementById("ta");if(ta)ta.value=(CH.draftBase+" "+liveText()).trim()}}
function finishListen(){
  const t=listenFor;listenFor=null;const said=liveText();
  if(!t){render();return}
  if(t.kind==="phrase"){
    const target=dayPhrases(t.day)[t.i].en,best=bestMatch(target,[said].concat(heardAlts)),sc=best.score;
    SPres[t.day+":"+t.i]={score:sc,heard:best.heard||said};
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
function dayLabel(d){const f=info(d);return f.type==="F"?`День ${TOTAL}`:`День ${d} · неделя ${f.week}`}
function vHome(){
  const c=curDay(),f=info(c),dc=doneCount(),mi=monthOf(f.week);
  const me=curProfile();
  let h=`<div class="whos"><button class="who" data-act="family"><span>${esc(me.av)}</span><b>${esc(me.name)}</b><span class="mute small">${PR.list.length>1?"▾":"👨‍👩‍👧"}</span></button><button class="who" data-act="langs"><span>${C.flag}</span><b>${esc(C.name)}</b><span class="mute small">▾</span></button></div>
  <div class="card hero"><div class="row between"><div><div class="mute small">English Daily · ${esc(C.sub)}</div><h1>${esc(C.title)}</h1></div><div style="font-size:34px">${C.flag}</div></div>
  <div class="stat"><div><b>🔥 ${streak()}</b><span class="small mute">дней подряд</span></div><div><b>${dc}/${TOTAL}</b><span class="small mute">дней пройдено</span></div></div>
  <div class="bar"><i style="width:${Math.max(1,Math.round(dc/TOTAL*100))}%"></i></div><p class="small mute" style="margin-top:8px">Месяц ${mi+1} из ${MONTHS.length} · уровень ${LEVELS[mi]}</p></div>`;
  h+=`<div class="card"><span class="tag">Неделя ${f.week}: ${esc(SYL[f.week-1])}</span><h2 style="margin-top:8px">${dayLabel(c)}</h2><p style="font-weight:600;margin-top:2px">${esc(f.title)}</p>`;
  if(!f.ok){h+=`<div class="note">Уроки этого месяца скоро появятся в обновлении приложения.</div></div>`;return h+reminderCard()}
  h+=taskRows(c);
  const o=S.done[c]||{},next=TYPES[f.type].find(k=>!o[k]);
  h+=next?`<button class="btn" data-act="task" data-d="${c}" data-k="${next}">${Object.keys(o).length?"Продолжить":"Начать"} →</button>`:"";
  h+=`</div>`+reminderCard();
  if(!NATIVE)h+=`<div class="card"><details><summary>📲 Как поставить на главный экран Samsung</summary><p class="small">Откройте страницу в <b>Chrome</b> → меню <b>⋮</b> → <b>«Добавить на главный экран»</b>. В Chrome работают микрофон и озвучка.</p></details></div>`;
  return h;
}
function vLangs(){
  const me=curProfile();
  let h=`<div class="top"><button class="icon" data-act="tab" data-t="home">←</button><h2>🌍 Язык обучения</h2></div><p class="mute small">${esc(me.name)}: выберите, какой язык учить. Можно учить оба — прогресс по каждому хранится отдельно, переключаться можно в любой момент.</p>`;
  Object.values(COURSES).forEach(c=>{const p=daysDoneIn(me.id,c.id),on=c.id===C.id,ready=c.weeks.length>0;
    h+=`<button class="card lang ${on?"on":""}" data-act="uselang" data-c="${c.id}" ${ready?"":"disabled"}><span class="fl">${c.flag}</span><span style="flex:1"><b>${esc(c.name)}</b><span class="mute small">${esc(c.title)} · ${esc(c.sub)}</span><span class="bar"><i style="width:${Math.max(1,Math.round(p.n/p.tot*100))}%"></i></span><span class="mute small">${p.n}/${p.tot} дней${on?" · учите сейчас":""}</span></span><span class="chk">${on?"✓":""}</span></button>`});
  return h;
}
let FAM={edit:null,av:"👩"};
function vFamily(){
  let h=`<div class="top"><button class="icon" data-act="tab" data-t="home">←</button><h2>👨‍👩‍👧 Семья</h2></div><p class="mute small">У каждого члена семьи свой профиль: свой прогресс, своя серия дней и свой текущий урок. Выберите, кто сейчас занимается.</p><div class="card">`;
  PR.list.forEach(p=>{const c=daysDoneIn(p.id,courseOf(p));
    const on=p.id===PR.cur;
    h+=`<div class="prof ${on?"on":""}"><button class="pick" data-act="useprof" data-p="${esc(p.id)}"><span class="av">${esc(p.av)}</span><span style="flex:1"><b>${esc(p.name)}</b><span class="mute small">${COURSES[courseOf(p)].flag} ${esc(COURSES[courseOf(p)].name)} · ${c.n}/${c.tot} дней${on?" · занимается сейчас":""}</span></span></button><button class="icon" data-act="editprof" data-p="${esc(p.id)}" aria-label="Изменить">✏️</button></div>`;
    if(FAM.edit===p.id)h+=profForm(p);
  });
  h+=`</div>`;
  if(FAM.edit==="new")h+=`<div class="card"><h3>Новый профиль</h3>${profForm(null)}</div>`;
  else if(PR.list.length<8)h+=`<button class="btn" data-act="addprof">+ Добавить члена семьи</button>`;
  return h+`<p class="mute small" style="margin-top:14px">Профили хранятся на этом телефоне. Каждый выбирает свой язык: 🇬🇧 английский до B2 или 🇺🇿 узбекский до разговорного. Прогресс по каждому языку хранится отдельно.</p>`;
}
function profForm(p){
  const av=FAM.av;
  let h=`<div class="pform"><input type="text" id="pname" maxlength="20" placeholder="Имя, например: Мама" value="${esc(p?p.name:"")}"><div class="avs">${AVS.map(a=>`<button class="${a===av?"on":""}" data-act="pav" data-a="${a}">${a}</button>`).join("")}</div>`;
  if(!p)h+=`<p class="mute small" style="margin:12px 0 0">Какой язык учить:</p><div class="avs">${Object.values(COURSES).filter(c=>c.weeks.length).map(c=>`<button class="wide ${FAM.course===c.id?"on":""}" data-act="pcourse" data-c="${c.id}">${c.flag} ${esc(c.name)}</button>`).join("")}</div>`;
  h+=`<button class="btn" data-act="saveprof" data-p="${p?esc(p.id):""}">Сохранить</button>`;
  if(p&&PR.list.length>1)h+=`<button class="btn ghost" data-act="delprof" data-p="${esc(p.id)}">🗑 Удалить профиль и его прогресс</button>`;
  return h+`</div>`;
}
function reminderCard(){
  if(NATIVE){let t="20:00";try{t=window.Android.getReminder()||"20:00"}catch(e){}
    return`<div class="card"><div class="row between"><div><h3>⏰ Напоминание</h3><p class="small mute">Каждый день в это время придёт уведомление</p></div><input type="time" id="rem" value="${esc(t)}" style="width:120px"></div></div>`}
  return`<div class="note">⏰ Ежедневное напоминание приходит из приложения English Daily на телефоне.</div>`;
}
function vPlan(){
  const c=curDay(),cm=monthOf(info(c).week);if(openMonth===null)openMonth=cm;
  let h=`<h1>${esc(C.plan)}</h1><p class="mute">Каждая неделя: 5 уроков, повторение и разговорный день.</p>`;
  MONTHS.forEach((m,mi)=>{
    let doneM=0,allM=0;for(let n=m[0];n<=m[1];n++)for(let p=1;p<=7;p++){allM++;if(dayDone((n-1)*7+p))doneM++}
    h+=`<div class="card"><button class="day" style="border:0;padding:0" data-act="month" data-m="${mi}"><span style="flex:1"><h2>Месяц ${mi+1}</h2><span class="small mute">Уровень ${LEVELS[mi]} · ${doneM}/${allM}</span></span><span>${openMonth===mi?"▲":"▼"}</span></button>`;
    if(openMonth===mi){for(let n=m[0];n<=m[1];n++){h+=`<div class="wk">Неделя ${n}. ${esc(SYL[n-1])}</div>`;
      for(let p=1;p<=7;p++){const d=(n-1)*7+p,f=info(d),o=S.done[d]||{},cls=dayDone(d)?"ok":d===c?"cur":f.ok?"":"soon";
        h+=`<button class="day ${cls}" data-act="openday" data-d="${d}"><span class="num">${dayDone(d)?"✓":d}</span><span style="flex:1">${esc(f.title)}</span><span class="mini">${TYPES[f.type].map(k=>`<i class="${o[k]?"on":""}"></i>`).join("")}</span></button>`}}
      if(mi===MONTHS.length-1){const f=info(TOTAL);h+=`<div class="wk">Финал</div><button class="day ${dayDone(TOTAL)?"ok":""} ${f.ok?"":"soon"}" data-act="openday" data-d="${TOTAL}"><span class="num">🏆</span><span style="flex:1">${esc(f.title)}</span></button>`}}
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
    h+=`<div class="card"><p class="mute small" style="text-align:center">${it.dir==="en"?"Выберите перевод":"Как это "+C.inLang+"?"}</p><div class="q">${esc(prompt)}</div>${it.dir==="en"?`<div style="text-align:center">${sayBtn(it.w.en)}</div>`:""}</div>`;
    it.opts.forEach((o,k)=>{let cls="";if(q.ans){if(o.en===it.w.en)cls="good";else if(k===q.pick)cls="bad"}
      h+=`<button class="opt ${cls}" data-act="pick" data-k="${k}" ${q.ans?"disabled":""}>${esc(it.dir==="en"?o.ru:o.en)}</button>`});
    if(q.ans)h+=`<div class="fb ${q.right?"ok":"no"}">${q.right?"Верно!":"Правильно: "+esc(it.w.en)+" — "+esc(it.w.ru)}</div><button class="btn" data-act="nextq">Дальше →</button>`;
  }else{
    h+=`<div class="card"><p class="mute small">Соберите фразу ${C.inLang}</p><h2 style="font-family:Onest;font-weight:600">${esc(it.p.ru)}</h2>`;
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
  h+=`<div class="compose"><textarea id="ta" rows="1" placeholder="Ответьте ${C.inLang}…">${esc(c.draft)}</textarea>${micOn()?`<button class="icon ${isRec?"rec":""}" data-act="chatmic">${isRec?"■":"🎤"}</button>`:""}<button class="icon" style="background:var(--acc);color:#fff;border-color:var(--acc)" data-act="send" ${c.busy?"disabled":""}>➤</button></div>`;
  return h+`<p class="mute small">Можно писать с ошибками или даже по-русски — ИИ подскажет, как сказать правильно.</p>`;
}

/* ---------- Чат с ИИ ---------- */
function lvlOf(week){
  if(C.id==="uz"){if(week<=8)return["absolute beginner (A0–A1)","only the most common Uzbek words, very short simple sentences"];if(week<=17)return["beginner (A1–A2)","simple everyday Uzbek, sentences up to 8 words"];return["elementary (A2–B1)","natural everyday spoken Uzbek, sentences up to 12 words"]}
  if(week<=13)return["absolute beginner (A0–A1)","only the most common words, sentences of 4–8 words"];if(week<=21)return["elementary (A1–A2)","simple common words, sentences up to 12 words"];if(week<=34)return["pre-intermediate (A2–B1)","everyday vocabulary, sentences up to 15 words"];if(week<=43)return["intermediate (B1–B2)","natural English with some idioms and phrasal verbs, sentences up to 20 words"];return["upper-intermediate (B2)","natural, fluent conversational English with idioms, phrasal verbs and complex grammar"]}
function openChat(opts){
  CH=Object.assign({msgs:[],busy:false,err:"",draft:"",draftBase:"",userCount:0},opts);
  go({tab:V.tab,view:"chat",from:V});aiTurn();
}
function sysPrompt(){
  const [lv,rule]=lvlOf(CH.week||info(curDay()).week);
  if(C.id==="uz")return `You are a warm, patient Uzbek conversation partner in a language-learning app. The learner is a Russian-speaking person learning spoken Uzbek from zero (the goal is comfortable everyday conversation). Write Uzbek ONLY in the official Latin alphabet (o', g', sh, ch, q, x, h). Do not assume anything about their job, city or personal life — ask instead. Level: ${lv}.
Topic of this conversation: ${CH.topic}.
Rules:
- Use ${rule}. Use the polite "siz" form. Be friendly and encouraging.
- Each turn: react briefly to what the learner said, then ask exactly ONE question on the topic.
- If the learner's last message has Uzbek mistakes or is written in Russian, put in "fix" a short note in Russian that gives the correct Uzbek sentence, for example: «Правильно: Men talabaman. Окончание -man ставится в конце.» If there are no mistakes, "fix" must be "".
- Reply ONLY with JSON: {"fix": string, "en": string, "ru": string}, where "en" is your reply in Uzbek (Latin script) and "ru" is its Russian translation.`;
  return `You are a warm, patient English conversation partner in a language-learning app. The learner is a Russian-speaking person learning general English (the goal is comfortable B2 conversation). Do not assume anything about their job, city or personal life — ask instead. Level: ${lv}.
Topic of this conversation: ${CH.topic}.
Rules:
- Use ${rule}. Be friendly and encouraging.
- Each turn: react briefly to what the learner said, then ask exactly ONE question on the topic.
- If the learner's last message has English mistakes or is written in Russian, put in "fix" a short note in Russian that gives the correct English sentence, for example: «Правильно: I am a teacher. Перед профессией нужен a.» If there are no mistakes, "fix" must be "".
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
    CH.msgs.push({role:"ai",en:String(r.en),ru:String(r.ru||""),showRu:(CH.week||1)<=(C.id==="uz"?17:13)});
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
  else if(v==="family")h=vFamily();
  else if(v==="langs")h=vLangs();
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
    case"family":FAM={edit:null,av:"👩"};go({tab:"home",view:"family"});break;
    case"langs":go({tab:"home",view:"langs"});break;
    case"uselang":switchCourse(b.dataset.c);go({tab:"home"});break;
    case"useprof":switchProfile(b.dataset.p);go({tab:"home"});break;
    case"addprof":FAM={edit:"new",av:AVS[PR.list.length%AVS.length],course:C.id};render();setTimeout(()=>{const i=document.getElementById("pname");if(i)i.focus()},30);break;
    case"editprof":{const p=PR.list.find(x=>x.id===b.dataset.p);FAM=FAM.edit===p.id?{edit:null,av:"👩"}:{edit:p.id,av:p.av};render();break}
    case"pcourse":{const i=document.getElementById("pname"),nm=i?i.value:"";FAM.course=b.dataset.c;render();const j=document.getElementById("pname");if(j)j.value=nm;break}
    case"pav":{const i=document.getElementById("pname"),nm=i?i.value:"";FAM.av=b.dataset.a;render();const j=document.getElementById("pname");if(j)j.value=nm;break}
    case"saveprof":{const i=document.getElementById("pname"),nm=(i&&i.value.trim())||"";if(!nm){if(i)i.focus();break}
      if(b.dataset.p){const p=PR.list.find(x=>x.id===b.dataset.p);p.name=nm;p.av=FAM.av;saveProfiles();FAM={edit:null,av:"👩"};render()}
      else{let n=PR.list.length+1;while(PR.list.some(x=>x.id==="p"+n))n++;const id="p"+n;PR.list.push({id,name:nm,av:FAM.av,course:FAM.course||"en"});saveProfiles();switchProfile(id);go({tab:"home"})}
      break}
    case"delprof":{const id=b.dataset.p,p=PR.list.find(x=>x.id===id);if(!p||PR.list.length<2)break;
      if(!confirm("Удалить профиль «"+p.name+"» и весь его прогресс?"))break;
      PR.list=PR.list.filter(x=>x.id!==id);try{Object.keys(COURSES).forEach(c=>localStorage.removeItem(pkey(id,c)))}catch(e){}
      if(PR.cur===id){PR.cur="";switchProfile(PR.list[0].id)}else saveProfiles();FAM={edit:null,av:"👩"};render();break}
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
    case"checkb":{const it=Q.items[Q.i];const s=Q.built.map(i=>it.toks[i]).join(" ");Q.ans=true;Q.right=spokenAny(s).join(" ")===spokenAny(it.p.en).join(" ");if(Q.right)Q.score++;say(it.p.en);render();break}
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
    case"chatw":{const n=+b.dataset.w;openChat({day:0,week:n||info(curDay()).week,topic:n?WK[n].topic:"any everyday topic the learner likes (family, travel, food, hobbies, films, news, plans)",title:n?SYL[n-1]:"Свободная тема",need:0});break}
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
  if(V.view==="family"||V.view==="langs"){go({tab:"home"});return true}
  if(V.view&&V.view!=="day"&&V.d){go({tab:V.tab,view:"day",d:V.d});return true}
  if(V.view){go({tab:V.tab});return true}
  if(V.tab!=="home"){go({tab:"home"});return true}
  return false;
};
render();
