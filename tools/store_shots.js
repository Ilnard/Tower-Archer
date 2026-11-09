// Рендер графики для Google Play: node tools/store_shots.js <путь к index.html> <папка вывода>
const {chromium}=require('playwright');const SRC=process.argv[2], OUT=process.argv[3];
(async()=>{const b=await chromium.launch();const errs=[];
const prep=async(p)=>{await p.goto('file://'+SRC);await p.waitForTimeout(500);await p.evaluate(()=>{save.consent='basic';save.tutorialDone=true;Store.save(save);});await p.reload();await p.waitForTimeout(700);};
// скриншоты телефона 1080x1920
const p=await b.newPage({viewport:{width:360,height:640},deviceScaleFactor:3});p.on('pageerror',e=>errs.push(e.message));
await prep(p);
await p.evaluate(()=>{save.coins=48200;save.best=137;save.wave=138;Store.save(save);showMenu();document.getElementById('mVer').style.visibility='hidden';});await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/1_menu.png'});
const play=async(w,ups,fn)=>{await p.evaluate(([w,ups])=>{for(const k in save.ups)save.ups[k]=0;Object.assign(save.ups,ups);save.best=w;save.wave=w;save.coins=31500;S=Progress.stats(save.ups);showMenu();startGame();},[w,ups]);await p.waitForTimeout(300);await p.evaluate(()=>{if(state==='paused')resume();});};
const shoot=async(n)=>{for(let i=0;i<n;i++){await p.mouse.move(180,500);await p.mouse.down();await p.mouse.move(120+i*25,200,{steps:2});await p.mouse.up();await p.waitForTimeout(160);}};
await play(34,{damage:30,reload:18,volley:20,fire:4,meteor:3,rage:2,frost:2});await p.waitForTimeout(5500);
await p.evaluate(()=>{S.volley=1;});await shoot(3);await p.mouse.move(180,500);await p.mouse.down();await p.mouse.move(110,230,{steps:2});await p.waitForTimeout(80);await p.screenshot({path:OUT+'/2_battle.png'});await p.mouse.up();
await play(40,{damage:14,reload:18,volley:18,fire:4,meteor:3,rage:2,frost:2,type:1});await p.waitForTimeout(6500);await p.evaluate(()=>{if(run.boss){run.boss.y=Math.min(run.boss.y+180,L.wallY-260);}castSkill('meteor');});await shoot(3);await p.waitForTimeout(450);await p.screenshot({path:OUT+'/3_boss_night.png'});
await play(321,{damage:150,reload:30,volley:30,fire:8,meteor:6,rage:4,frost:4,type:5});await p.waitForTimeout(5500);await p.evaluate(()=>castSkill('frost'));await shoot(3);await p.waitForTimeout(300);await p.screenshot({path:OUT+'/4_forest.png'});
await p.evaluate(()=>{save.coins=86400;camp('pause','talents');});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/5_camp.png'});
await p.evaluate(()=>{closeOverlay();run.wave=80;showBossIntro(BOSSES[3]);});await p.waitForTimeout(300);await p.screenshot({path:OUT+'/6_boss_card.png'});
// баннер 1024x500
const f=await b.newPage({viewport:{width:1024,height:500},deviceScaleFactor:1});await prep(f);
await f.addStyleTag({content:'.menu-bottom{display:none!important}.logo{margin-top:6vh}'});await f.waitForTimeout(1800);await f.screenshot({path:OUT+'/feature_1024x500.png'});
console.log('errors',errs);await b.close()})();
