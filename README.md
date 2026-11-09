# Башенный лучник

Мобильная игра «защита башни» для Android: HTML5-игра в нативной обёртке (WebView) с рекламой Yandex Mobile Ads.

**Обслуживание и обновления — [MAINTENANCE.md](MAINTENANCE.md).**

**Публикация: RuStore — [RUSTORE.md](RUSTORE.md) (основной магазин); Google Play — [RELEASE.md](RELEASE.md) (на будущее, там же устройство сборки).**

- Игра: `app/src/main/assets/index.html` (единственный источник; веб-версия собирается `tools/build_web.py`)
- Android: `app/src/main/java/com/ilnard/towerarcher/` — `MainActivity` (WebView), `GameBridge` (мост JS↔Android), `AdsManager` (реклама)
- Баланс: `tools/economy_model.py`, `tools/balance_bot.js`
- Графика магазина: `tools/store_shots.js`, `tools/render_icon.js`
- Сайт и политика конфиденциальности: `docs/` (GitHub Pages)
