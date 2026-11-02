const {chromium}=require('playwright');const SP=process.argv[2];const HOURS=+process.argv[3]||3;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:393,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SP+'/t.html');await p.waitForTimeout(300);
await p.evaluate(()=>{save=Store.fresh();save.sound=false;S=Progress.stats(save.ups);
 window.BOT={t:0,marks:{},runs:0,log:[],deaths:{},farmUntil:0};
 window.botBuy=()=>{const ids=['damage','reload','volley','fire','type','loot','meteor','rage','frost','hp','repair','pierce'];
  const w={hp:2.5,repair:3,pierce:4,loot:1.3};
  for(let guard=0;guard<5000;guard++){let best=null,bc=Infinity;
   for(const id of ids){const c=Math.ceil(UP[id].cost(save.ups[id]))*(w[id]||1); if(c<bc){bc=c;best=id}}
   const real=Math.ceil(UP[best].cost(save.ups[best])); if(real>save.coins)break; save.coins-=real; save.ups[best]++;}
  const old=S.maxHp; S=Progress.stats(save.ups); if(run&&state!=='over')run.hp+=S.maxHp-old;};
 window.botStep=(secs)=>{const dt=1/30;let n=secs/dt;
  while(n-->0){
   if(state==='menu'||state==='over'){ if(run){BOT.runs++; BOT.deaths[run.wave]=(BOT.deaths[run.wave]||0)+1;} botBuy(); const w=run?run.wave:save.wave; if(run&&BOT.deaths[w]%3===0){save.farm=true;BOT.farmUntil=BOT.t+300;newRun(Math.max(1,w-1));} else newRun(w); BOT.t+=6; }
   if(save.farm&&BOT.t>BOT.farmUntil)save.farm=false;
   if(state==='paused'){resume();}
   if(!run)continue;
   const R=run;
   if(R.inBreak&&R.breakT>BAL.wave.breakTime-dt*1.5) botBuy();
   if(R.cd<=0&&R.enemies.length){const a=archerPos();let tg=null;for(const e of R.enemies){if(e.dead||e.invuln)continue;if(!tg||e.y>tg.y)tg=e;}
     if(tg){const d=Math.hypot(tg.x-a.x,tg.y-a.y),t=d/(BAL.arrow.speed*L.scale);fire(Math.atan2(tg.y+tg.speed*t-a.y,tg.x-a.x));}}
   if(R.enemies.length>=4)for(const id of SKILLS)if(S[id]&&R.sk[id]<=0)castSkill(id);
   if(R.rageT>0&&R.cd<=0&&R.enemies.length){} 
   update(dt); BOT.t+=dt;
   for(const m of [25,50,75,100,125,150,175,200,225,250,275,300,350,400,500]) if(save.best>=m&&!BOT.marks[m])BOT.marks[m]=(BOT.t/3600).toFixed(2)+'ч';
  }
  return {h:(BOT.t/3600).toFixed(2),best:save.best,runs:BOT.runs,marks:BOT.marks,deaths:BOT.deaths};};
});
let r;for(let i=0;i<HOURS*6;i++){r=await p.evaluate(()=>botStep(600)); if(i%6==5)console.log(JSON.stringify({h:r.h,best:r.best,runs:r.runs}));}
console.log(JSON.stringify(r));console.log('errors',errs.slice(0,3));await b.close()})();
