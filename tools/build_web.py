#!/usr/bin/env python3
"""Единый источник игры — app/src/main/assets/index.html.
Скрипт собирает из него веб-версию для GitHub Pages (docs/play/index.html)
и, при --artifact ПУТЬ, фрагмент для предпросмотра в Claude.
--check: проверяет, что веб-версия совпадает с Android-версией и в игре нет устаревших меток."""
import sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'app/src/main/assets/index.html'
WEB = ROOT / 'docs/play/index.html'

GOOGLE_FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
                '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Russo+One&family=Nunito:wght@600;800;900&display=swap">')

def to_web(src):
    # в APK шрифты встроены (assets/fonts), в веб-версии — с Google Fonts
    i = src.index('<style id="fonts">'); j = src.index('</style>', i) + len('</style>')
    return src[:i] + GOOGLE_FONTS + src[j:]

def main():
    src = SRC.read_text(encoding='utf-8')
    if not src.startswith('<!doctype html>'):
        sys.exit('index.html должен быть полным документом')
    for bad in ('Прототип', 'BuildConfigHolder', 'Заглушка SDK'):
        if bad in src:
            sys.exit(f'В игре осталась устаревшая метка: {bad}')
    web = to_web(src)
    if '--check' in sys.argv:
        if not WEB.exists() or WEB.read_text(encoding='utf-8') != web:
            sys.exit('docs/play/index.html отличается от Android-версии: запустите python3 tools/build_web.py')
        print('ok: веб и Android используют один и тот же index.html'); return
    WEB.parent.mkdir(parents=True, exist_ok=True)
    WEB.write_text(web, encoding='utf-8')
    if '--artifact' in sys.argv:
        out = pathlib.Path(sys.argv[sys.argv.index('--artifact') + 1])
        body = web.split('\n', 2)[2].replace('</head><body>\n', '').rsplit('</body></html>', 1)[0]
        body = body.replace(':root{--sat:env(safe-area-inset-top,0px);--sab:env(safe-area-inset-bottom,0px);--z:1}', ':root{--sat:0px;--sab:0px;--z:1}')
        out.write_text(body, encoding='utf-8')
    print('собрано:', WEB)

main()
