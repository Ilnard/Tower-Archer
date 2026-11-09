# Башенный лучник

Мобильная игра «защита башни» для Android: HTML5-игра в нативной обёртке (WebView) с рекламой Yandex Mobile Ads.

**Релиз, сборки, что сделать перед публикацией — см. [RELEASE.md](RELEASE.md).**

- Игра: `app/src/main/assets/index.html` (единственный источник; веб-версия собирается `tools/build_web.py`)
- Android: `app/src/main/java/com/ilnard/towerarcher/` — `MainActivity` (WebView), `GameBridge` (мост JS↔Android), `AdsManager` (реклама)
- Баланс: `tools/economy_model.py`, `tools/balance_bot.js`
- Графика магазина: `tools/store_shots.js`, `tools/render_icon.js`
- Сайт и политика конфиденциальности: `docs/` (GitHub Pages)
