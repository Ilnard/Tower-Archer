// Рекламные скриншоты для магазина: заголовок + скриншот в рамке на фоне в стиле игры.
// node tools/store_compose.js <папка со скриншотами> <папка вывода> <папка со шрифтами>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [IN, OUT, FONTS] = process.argv.slice(2);
const SLIDES = [
  { file:'1_menu.png',       bg:'sunset', title:'Защити башню',          sub:'от бесконечных орд чудовищ' },
  { file:'2_battle.png',     bg:'sunset', title:'Стреляй одним пальцем', sub:'Веди к цели и отпускай —\nиногда лук бьёт веером из 5 стрел' },
  { file:'3_boss_night.png', bg:'night',  title:'Боссы каждые 20 волн',  sub:'Ночные битвы при свете факелов' },
  { file:'6_boss_card.png',  bg:'night',  title:'Пять грозных боссов',   sub:'У каждого свои умения —\nследи за подсказками' },
  { file:'5_camp.png',       bg:'gold',   title:'Улучшения без предела', sub:'Урон, залп, огонь, пробитие\nи боевые навыки' },
  { file:'4_forest.png',     bg:'forest', title:'Новые облики башни',    sub:'Лесной форт, цитадель\nи королевский бастион' },
];
(async () => {
  fs.mkdirSync(OUT, { recursive:true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{ width:1080, height:1920 } });
  const font = f => { try { return 'data:font/ttf;base64,' + fs.readFileSync(path.join(FONTS, f)).toString('base64'); } catch { return ''; } };
  await p.setContent(`<style>
    @font-face{font-family:'Russo One';src:url('${font('RussoOne-Regular.ttf')}')}
    @font-face{font-family:'Nunito';src:url('${font('Nunito.ttf')}');font-weight:200 1000}
    body{margin:0}</style><canvas id="c" width="1080" height="1920"></canvas><div style="font-family:'Russo One'">.</div><div style="font-family:Nunito;font-weight:800">.</div>`);
  await p.evaluate(() => document.fonts.ready);
  for (const [i, s] of SLIDES.entries()) {
    const img = 'data:image/png;base64,' + fs.readFileSync(path.join(IN, s.file)).toString('base64');
    const data = await p.evaluate(async ({ s, img }) => {
      const c = document.getElementById('c'), g = c.getContext('2d'), W = 1080, H = 1920;
      const pal = { sunset:['#2a2f78', '#8d4fa6', '#f08a5d', '#ffd58a'], night:['#0b1035', '#2b2a6e', '#4b3d7e', '#a58cff'],
                    gold:['#5a1f12', '#b4521f', '#f0a23e', '#ffe6a0'], forest:['#12301e', '#2f6e3c', '#7fae5a', '#e9f5b0'] }[s.bg];
      let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, pal[0]); gr.addColorStop(.45, pal[1]); gr.addColorStop(1, pal[2]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      // лучи из-за заголовка
      g.save(); g.translate(W / 2, 200); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.fillStyle = k % 2 ? 'rgba(255,255,255,.07)' : 'rgba(255,255,255,0)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, -1600); g.lineTo(90, -1600); g.fill(); } g.restore();
      gr = g.createRadialGradient(W / 2, 200, 10, W / 2, 200, 620); gr.addColorStop(0, 'rgba(255,240,200,.45)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 900);
      // искры
      let seed = s.title.length * 97; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 60; k++) { g.fillStyle = `rgba(255,236,170,${.15 + R() * .5})`; g.beginPath(); g.arc(R() * W, R() * H, 1.5 + R() * 4, 0, 6.28); g.fill(); } g.globalCompositeOperation = 'source-over';
      // заголовок
      g.textAlign = 'center'; g.lineJoin = 'round';
      let fs1 = 92; g.font = `400 ${fs1}px "Russo One", sans-serif`; while (g.measureText(s.title.toUpperCase()).width > W - 90) { fs1 -= 4; g.font = `400 ${fs1}px "Russo One", sans-serif`; }
      g.lineWidth = 16; g.strokeStyle = '#3a1608'; g.strokeText(s.title.toUpperCase(), W / 2, 170);
      gr = g.createLinearGradient(0, 100, 0, 180); gr.addColorStop(0, '#fff3c8'); gr.addColorStop(1, '#ffc14a'); g.fillStyle = gr; g.fillText(s.title.toUpperCase(), W / 2, 170);
      g.font = '800 46px Nunito, sans-serif'; g.fillStyle = '#fff6df'; g.lineWidth = 8; g.strokeStyle = 'rgba(30,15,40,.6)';
      s.sub.split('\n').forEach((line, k) => { g.strokeText(line, W / 2, 250 + k * 58); g.fillText(line, W / 2, 250 + k * 58); });
      // скриншот в рамке
      const im = new Image(); await new Promise(r => { im.onload = r; im.src = img; });
      const top = s.sub.includes('\n') ? 372 : 330, h = H - top - 70, w = Math.round(h * im.width / im.height), x = (W - w) / 2, rr = 46;
      const round = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
      g.save(); g.shadowColor = 'rgba(10,5,20,.6)'; g.shadowBlur = 50; g.shadowOffsetY = 18; round(x - 14, top - 14, w + 28, h + 28, rr + 12); g.fillStyle = '#2b1d2c'; g.fill(); g.restore();
      round(x - 14, top - 14, w + 28, h + 28, rr + 12); g.lineWidth = 6; g.strokeStyle = '#f3c35f'; g.stroke();
      g.save(); round(x, top, w, h, rr); g.clip(); g.drawImage(im, x, top, w, h); g.restore();
      return c.toDataURL('image/png');
    }, { s, img });
    fs.writeFileSync(path.join(OUT, `promo_${i + 1}.png`), Buffer.from(data.split(',')[1], 'base64'));
  }
  await b.close(); console.log('готово:', SLIDES.length);
})();
