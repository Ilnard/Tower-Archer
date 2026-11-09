// Значок приложения из графики игры: node tools/render_icon.js <index.html> <папка вывода>
// Выводит icon_512.png (Google Play), ic_launcher.png (обычный) и слои адаптивного значка fg/bg.
const {chromium}=require('playwright');const fs=require('fs');const [SRC,OUT]=process.argv.slice(2);
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+SRC);await p.waitForTimeout(400);
const res=await p.evaluate(()=>{
 const draw=(S,{bgOn=true,fgOn=true,zone=1})=>{const c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d');
  if(bgOn){let gr=g.createLinearGradient(0,0,0,S);gr.addColorStop(0,'#27306b');gr.addColorStop(.55,'#8a5aa0');gr.addColorStop(1,'#f39a5e');g.fillStyle=gr;g.fillRect(0,0,S,S);
   gr=g.createRadialGradient(S*.6,S*.42,S*.02,S*.6,S*.42,S*.55);gr.addColorStop(0,'rgba(255,226,150,.9)');gr.addColorStop(1,'rgba(255,190,120,0)');g.fillStyle=gr;g.fillRect(0,0,S,S);
   g.fillStyle='rgba(60,40,90,.55)';g.beginPath();g.moveTo(0,S*.78);for(let x=0;x<=S;x+=S/8)g.lineTo(x,S*(.74-.06*Math.sin(x/S*7)));g.lineTo(S,S);g.lineTo(0,S);g.fill();}
  if(fgOn){const C=S*zone,o=(S-C)/2,u=C/100;g.save();g.translate(o,o);
   // стена с зубцами
   const top=70*u; const st=(x0,y0,x1,y1)=>{const gr=g.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,'#e6d6ba');gr.addColorStop(1,'#8c7a62');poly(g,[x0,y0,x1,y0,x1,y1,x0,y1],gr,2.2*u);};
   st(16*u,top,84*u,C+10);
   for(let i=0;i<4;i++){const x=16*u+i*19.3*u;st(x,top-10*u,x+10.5*u,top+1*u);}
   g.fillStyle='rgba(60,45,35,.22)';for(let y=top+9*u;y<C;y+=9*u)g.fillRect(17*u,y,66*u,1.2*u);
   for(const s of [-1,1]){const bx=50*u+s*22*u;poly(g,[bx-6*u,top+3*u,bx+6*u,top+3*u,bx+6*u,top+24*u,bx,top+19*u,bx-6*u,top+24*u],rgrad(g,bx,top+12*u,14*u,'#e8524a','#8e1f22'),1.8*u);
     poly(g,[bx,top+8*u,bx+3*u,top+12*u,bx,top+16*u,bx-3*u,top+12*u],'#f3c35f',0);}
   // лучник, лук натянут вверх-вправо
   g.save();g.translate(46*u,50*u);g.scale(.82*u,.82*u);THEMES.classic.archer(g,0,0,1,-0.95,11,0);g.restore();
   g.restore();}
  return c.toDataURL('image/png');};
 return {icon512:draw(512,{zone:1}), legacy:draw(512,{zone:1}), fg:draw(432,{bgOn:false,zone:.62}), bg:draw(432,{fgOn:false})};
});
for(const [k,v] of Object.entries(res)) fs.writeFileSync(`${OUT}/${k}.png`,Buffer.from(v.split(',')[1],'base64'));
console.log('errors',errs);await b.close()})();
