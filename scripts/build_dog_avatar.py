# /// script
# requires-python = ">=3.11"
# ///
"""Build the 臺灣黑狗 map avatar (standing + walking) from the designer's layered SVG.

Input : material/art/tw-black-dog/tw-black-dog_all.svg   (Illustrator export; each body part is one top-level group,
        the separate tw-black-dog_<part>.svg files are the same parts one by one)
Output: public/assets/ph/avatar-taiwan-dog.svg        standing pose (map avatar, picker, /me, tree focus view)
        public/assets/ph/avatar-taiwan-dog-walk.svg   walk cycle, CSS keyframes inside the SVG (works in <img>)

Both files share one viewBox, so swapping standing <-> walking does not move or resize the dog;
the feet sit on the bottom edge (the map marker is anchored at the bottom centre).
The walk cycle faces right; the page flips it with scaleX(-1) to walk left.

Run:   uv run scripts/build_dog_avatar.py
Check: uv run scripts/build_dog_avatar.py --check   (outputs match what the script would write)
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'material/art/tw-black-dog/tw-black-dog_all.svg'
OUT_STAND = ROOT / 'public/assets/ph/avatar-taiwan-dog.svg'
OUT_WALK = ROOT / 'public/assets/ph/avatar-taiwan-dog-walk.svg'

# Room around the 305.86 × 404.46 drawing for the swinging tail and lifted feet; 4 units under the feet
VIEWBOX = '-12 -14 330 422.46'
WIDTH, HEIGHT = 75, 96

# Top-level order in tw-black-dog_all.svg (back to front). None = an empty zero-size path, dropped.
PARTS = ['ear-r', 'ear-l', 'hand-r', 'leg-r', 'tail', None, 'belly', 'face', 'leg-l', 'hand-l']
LEGS = {'leg-r', 'leg-l'}

# One step = 0.9 s. 0→50 %: leg-l on the ground pushing back, leg-r lifted and swinging forward; 50→100 % the other way.
# Pivots are in the drawing's own units (hips, shoulders, tail base, neck, ear bases).
WALK_CSS = '''
      .p, .bob, .bob-leg, .sway { transform-box: view-box; }
      .sway { transform-origin: 182px 300px; animation: sway .9s ease-in-out infinite; }
      .bob { animation: bob .45s ease-in-out infinite; }
      .bob-leg { animation: bob-leg .45s ease-in-out infinite; }
      .leg-l { transform-origin: 140px 282px; animation: leg .9s ease-in-out infinite; }
      .leg-r { transform-origin: 224px 286px; animation: leg .9s ease-in-out infinite; animation-delay: -.45s; }
      .hand-l { transform-origin: 130px 202px; animation: arm .9s ease-in-out infinite; animation-delay: -.45s; }
      .hand-r { transform-origin: 214px 212px; animation: arm-r .9s ease-in-out infinite; }
      .tail { transform-origin: 112px 298px; animation: tail .45s ease-in-out infinite alternate; }
      .face { transform-origin: 180px 196px; animation: head .9s ease-in-out infinite; }
      .ear-l { transform-origin: 140px 118px; animation: ear .45s ease-in-out infinite alternate; }
      .ear-r { transform-origin: 222px 92px; animation: ear .45s ease-in-out infinite alternate; animation-delay: -.2s; }
      @keyframes bob { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-7px) } }
      @keyframes bob-leg { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-3px) } }
      /* 0→50% on the ground pushing back (no lift), 50→100% lifted and swinging forward */
      @keyframes leg {
        0%, 100% { transform: rotate(-13deg) }
        25% { transform: rotate(0deg) }
        50% { transform: rotate(13deg) }
        75% { transform: rotate(0deg) translateY(-10px) }
      }
      /* weight over the standing leg (left half, then right), leaning slightly forward */
      @keyframes sway {
        0%, 50%, 100% { transform: rotate(1.5deg) }
        25% { transform: translateX(-3px) rotate(.5deg) }
        75% { transform: translateX(3px) rotate(2.5deg) }
      }
      /* arms 8 units lower than drawn so the shoulders stay inside the body outline while swinging */
      @keyframes arm { 0%, 100% { transform: translateY(8px) rotate(-14deg) } 50% { transform: translateY(8px) rotate(14deg) } }
      @keyframes arm-r { 0%, 100% { transform: translateY(8px) rotate(10deg) } 50% { transform: translateY(8px) rotate(-12deg) } }
      @keyframes tail { from { transform: rotate(-9deg) } to { transform: rotate(9deg) } }
      @keyframes head { 0%, 100% { transform: rotate(-2deg) } 50% { transform: rotate(2deg) } }
      @keyframes ear { from { transform: rotate(-4deg) } to { transform: rotate(4deg) } }
      @media (prefers-reduced-motion: reduce) { .p, .bob, .bob-leg, .sway { animation: none } }
'''


def split_parts(body: str) -> list[str]:
    parts, depth, start = [], 0, 0
    for m in re.finditer(r'<g>|</g>|<path[^>]*/>', body):
        t = m.group(0)
        if t == '<g>':
            if depth == 0:
                start = m.start()
            depth += 1
        elif t == '</g>':
            depth -= 1
            if depth == 0:
                parts.append(body[start:m.end()])
        elif depth == 0:
            parts.append(t)
    return parts


def build() -> tuple[str, str]:
    s = SRC.read_text(encoding='utf-8')
    s = re.sub(r'<\?xml[^>]*>\s*', '', s)
    s = re.sub(r'\s*<!-- Generator.*?-->', '', s)
    head, body = s.split('</defs>', 1)
    body = body.rsplit('</svg>', 1)[0]
    parts = split_parts(body)
    assert len(parts) == len(PARTS), f'expected {len(PARTS)} top-level parts, got {len(parts)}'
    svg_open = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
                f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="{VIEWBOX}" role="img" aria-labelledby="title">\n'
                f'  <title id="title">A taiwan-dog</title>')
    old_open = re.match(r'<svg[^>]*>', head).group(0)
    defs = head[len(old_open):]

    stand = [p for name, p in zip(PARTS, parts) if name]
    walk = []
    for name, p in zip(PARTS, parts):
        if name is None:
            continue
        if name in LEGS:
            walk.append(f'  <g class="bob-leg"><g class="p {name}">\n{p}\n  </g></g>')
        else:
            walk.append(f'  <g class="sway"><g class="bob"><g class="p {name}">\n{p}\n  </g></g></g>')
    stand_svg = svg_open + defs + '</defs>\n  ' + '\n  '.join(stand) + '\n</svg>\n'
    walk_svg = svg_open + defs.replace('<style>', '<style>' + WALK_CSS, 1) + '</defs>\n' + '\n'.join(walk) + '\n</svg>\n'
    return stand_svg, walk_svg


def main() -> None:
    stand, walk = build()
    if '--check' in sys.argv:
        bad = [p for p, want in ((OUT_STAND, stand), (OUT_WALK, walk)) if not p.exists() or p.read_text(encoding='utf-8') != want]
        if bad:
            sys.exit('out of date: ' + ', '.join(str(p.relative_to(ROOT)) for p in bad) + ' (run uv run scripts/build_dog_avatar.py)')
        print('ok: avatar-taiwan-dog.svg, avatar-taiwan-dog-walk.svg')
        return
    OUT_STAND.write_text(stand, encoding='utf-8')
    OUT_WALK.write_text(walk, encoding='utf-8')
    print(f'{OUT_STAND.relative_to(ROOT)} {len(stand.encode()) // 1024} KB, {OUT_WALK.relative_to(ROOT)} {len(walk.encode()) // 1024} KB')


if __name__ == '__main__':
    main()
