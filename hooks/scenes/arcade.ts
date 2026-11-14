/**
 * The glow of an arcade cabinet in a dark room: scanlines, a warm vignette,
 * twinkling pixel stars, and a few original pixel sprites (a little robot, a rocket,
 * a ringed planet) bobbing in the margins.
 */

/** Turns rows of `#` into one path of unit squares, so a sprite is a single element. */
function pixels(rows: string[]): string {
  return rows
    .flatMap((row, y) => [...row].map((cell, x) => (cell === '#' ? `M${x} ${y}h1v1h-1z` : '')))
    .join('')
}

const ROBOT = pixels([
  '.....#.....',
  '.....#.....',
  '..#######..',
  '.##.....##.',
  '.##.###.##.',
  '.##.....##.',
  '..#######..',
  '...#...#...',
  '..##...##..',
])

const ROCKET_BODY = pixels([
  '...#...',
  '..###..',
  '..#.#..',
  '..###..',
  '..###..',
  '.#####.',
  '##.#.##',
  '#..#..#',
])

const ROCKET_FLAME = pixels(['..#.#..', '...#...'])

const PLANET = pixels([
  '....####....',
  '..########..',
  '############',
  '.##########.',
  '..########..',
  '....####....',
])

const PLANET_RING = pixels(['##..........##', '.############.'])

const STARS: Array<[number, number, number]> = [
  [40, 90, 0], [120, 300, 1.2], [60, 520, 0.4], [150, 700, 2], [90, 900, 0.8],
  [1520, 120, 1.6], [1460, 340, 0.2], [1550, 560, 1], [1480, 760, 2.4], [1530, 930, 0.6],
  [700, 30, 1.4], [980, 50, 0.3],
]

const stars = STARS.map(
  ([x, y, delay]) => `<rect class="star" x="${x}" y="${y}" width="6" height="6" style="animation-delay:${delay}s"/>`,
).join('')

export const ARCADE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" shape-rendering="crispEdges">
<defs>
  <radialGradient id="room" cx="50%" cy="50%" r="72%">
    <stop offset="0" stop-color="#1a0b0a"/>
    <stop offset="1" stop-color="#070303"/>
  </radialGradient>
  <radialGradient id="warm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ff7a1a" stop-opacity=".22"/>
    <stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/>
  </radialGradient>
  <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="1.4" fill="#000" fill-opacity=".38"/>
  </pattern>
</defs>
<style>
  .star{fill:#ffe9a8;animation:twinkle 3s steps(2) infinite}
  .bob{animation:bob 1.6s steps(2) infinite}
  .float{animation:float 9s ease-in-out infinite alternate}
  .flame{animation:twinkle .4s steps(2) infinite}
  @keyframes twinkle{50%{opacity:.15}}
  @keyframes bob{50%{transform:translateY(-8px)}}
  @keyframes float{to{transform:translateY(-60px)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="url(#room)"/>
<ellipse cx="0" cy="500" rx="420" ry="620" fill="url(#warm)"/>
<ellipse cx="1600" cy="500" rx="420" ry="620" fill="url(#warm)"/>
${stars}
<g class="bob"><path transform="translate(36 300) scale(6)" d="${ROBOT}" fill="#ffd60a"/></g>
<g class="bob" style="animation-delay:.8s"><path transform="translate(1500 600) scale(6)" d="${ROBOT}" fill="#ff5470"/></g>
<g class="float">
  <path transform="translate(60 760) scale(7)" d="${ROCKET_BODY}" fill="#e8e1d4"/>
  <path class="flame" transform="translate(60 816) scale(7)" d="${ROCKET_FLAME}" fill="#ff9f1c"/>
</g>
<g class="float" style="animation-delay:-4s">
  <path transform="translate(1470 150) scale(7)" d="${PLANET}" fill="#c084fc"/>
  <path transform="translate(1463 164) scale(7)" d="${PLANET_RING}" fill="#ffd60a"/>
</g>
<rect width="1600" height="1000" fill="url(#scanlines)"/>
</svg>`
