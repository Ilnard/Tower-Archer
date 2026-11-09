// Значок приложения (лучник из игры на золотых лучах): node tools/render_icon.js <index.html> <папка вывода>
// icon512.png — для магазина и обычного значка; adaptive_bg.png — слой адаптивного значка с запасом по краям.
const {chromium}=require('playwright');const fs=require('fs');const [SRC,OUT]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SRC);await p.waitForTimeout(400);
const res=await p.evaluate(()=>{
 const S=512;
 const glowG=(g,x,y,r,c0,c1)=>{g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,c0);gr.addColorStop(1,c1);g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore();};
 const sparks=(g,x,y,n,spread,col,seed)=>{const R=rng(seed);g.save();g.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const a=R()*6.28,d=R()*spread,r=1.5+R()*3.5;g.fillStyle=col;g.globalAlpha=.4+R()*.6;g.beginPath();g.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,r,0,6.28);g.fill();}g.restore();};
 const stone=(g,x0,y0,x1,y1)=>{const gr=g.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,'#efdfc2');gr.addColorStop(1,'#9a866b');poly(g,[x0,y0,x1,y0,x1,y1,x0,y1],gr,6);g.fillStyle='rgba(255,250,235,.35)';g.fillRect(x0+4,y0+4,x1-x0-8,4);};
 const draw=(size,k)=>{const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');g.scale(size/S,size/S);
  let gr=g.createRadialGradient(256,230,20,256,256,380);gr.addColorStop(0,'#ffe6a0');gr.addColorStop(.45,'#f0a23e');gr.addColorStop(1,'#8a2f1c');g.fillStyle=gr;g.fillRect(0,0,S,S);
  g.save();g.translate(256,230);for(let i=0;i<16;i++){g.rotate(Math.PI/8);g.fillStyle=i%2?'rgba(255,240,190,.28)':'rgba(255,255,255,0)';g.beginPath();g.moveTo(0,0);g.lineTo(-60,-420);g.lineTo(60,-420);g.fill();}g.restore();
  g.save();g.translate(256,256);g.scale(k,k);g.translate(-256,-256);
  const top=392;stone(g,40,top,472,S+200);for(let i=0;i<4;i++){const x=40+i*118;stone(g,x,top-58,x+72,top+6);}
  g.fillStyle='rgba(50,38,30,.25)';for(let y=top+44;y<S+200;y+=44)g.fillRect(44,y,424,5);
  for(const bx of [118,394]){poly(g,[bx-34,top+16,bx+34,top+16,bx+34,top+120,bx,top+98,bx-34,top+120],rgrad(g,bx,top+50,70,'#e8524a','#8e1f22'),5);g.fillStyle='#f3c35f';g.fillRect(bx-34,top+16,68,9);poly(g,[bx,top+40,bx+14,top+58,bx,top+76,bx-14,top+58],'#f3c35f',3);}
  const sc=7.2,cx=222,cy=262,ang=-0.7;g.save();g.translate(cx,cy);g.scale(sc,sc);THEMES.classic.archer(g,0,0,1,ang,11,0);g.restore();
  const tx=cx+Math.cos(ang)*27*sc,ty=cy+2*sc+Math.sin(ang)*27*sc;glowG(g,tx,ty,60,'rgba(255,140,40,.95)','rgba(0,0,0,0)');glowG(g,tx,ty,26,'rgba(255,255,240,.95)','rgba(0,0,0,0)');
  sparks(g,360,170,22,60,'#fff3b0',7);g.restore();
  if(k<1){const wt=256+(top-256)*k+6*k;const gr2=g.createLinearGradient(0,0,S,0);gr2.addColorStop(0,'#e6d4b4');gr2.addColorStop(1,'#9a866b');g.fillStyle=gr2;g.fillRect(0,256+(S+200-256)*k-2,S,S);}
  gr=g.createRadialGradient(256,256,S*.3,256,256,S*.75);gr.addColorStop(0,'rgba(10,8,30,0)');gr.addColorStop(1,'rgba(10,8,30,.35)');g.fillStyle=gr;g.fillRect(0,0,S,S);
  return c.toDataURL('image/png');};
 return {icon512:draw(512,1), adaptive_bg:draw(432,.74)};
});
for(const [k,v] of Object.entries(res)) fs.writeFileSync(`${OUT}/${k}.png`,Buffer.from(v.split(',')[1],'base64'));
console.log('errors',errs);await b.close()})();
