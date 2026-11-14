/**
 * The deep ocean abyss: a painted plate of dark water and light from above,
 * glowing jellyfish pulsing and drifting in the margins, marine snow rising
 * slowly and plankton blinking. The jellyfish are one embedded sprite reused,
 * blended with `screen` so its black ground disappears.
 */
import { ABYSS_PLATE, JELLYFISH_SPRITE } from './assets'

type Jelly = { x: number; y: number; width: number; floatSeconds: number; pulseSeconds: number; delay: number; opacity: number }

const JELLIES: Jelly[] = [
  { x: 30, y: 70, width: 250, floatSeconds: 13, pulseSeconds: 3.1, delay: 0, opacity: 0.95 },
  { x: 150, y: 600, width: 170, floatSeconds: 11, pulseSeconds: 2.6, delay: -4, opacity: 0.7 },
  { x: 1340, y: 40, width: 230, floatSeconds: 15, pulseSeconds: 3.4, delay: -7, opacity: 0.9 },
  { x: 1420, y: 560, width: 190, floatSeconds: 12, pulseSeconds: 2.9, delay: -2, opacity: 0.8 },
  { x: 1080, y: 760, width: 110, floatSeconds: 10, pulseSeconds: 2.3, delay: -5, opacity: 0.45 },
]

/** A small deterministic generator, so the scene is the same on every load. */
function seeded(seed: number): () => number {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296

    return state / 4294967296
  }
}

const random = seeded(7)

const snow = Array.from({ length: 46 }, () => {
  const x = Math.round(random() * 1600)
  const y = Math.round(random() * 1000)
  const r = (0.8 + random() * 1.8).toFixed(1)
  const seconds = Math.round(28 + random() * 30)
  const delay = -Math.round(random() * seconds)

  return `<circle cx="${x}" cy="${y}" r="${r}" style="animation:rise ${seconds}s linear ${delay}s infinite"/>`
}).join('')

const plankton = Array.from({ length: 18 }, () => {
  const side = random() < 0.5 ? random() * 340 : 1260 + random() * 340
  const y = Math.round(80 + random() * 840)
  const delay = (random() * 4).toFixed(1)
  const color = random() < 0.5 ? '#7dd3fc' : '#e879f9'

  return `<circle class="blink" cx="${Math.round(side)}" cy="${y}" r="2.2" fill="${color}" style="animation-delay:${delay}s"/>`
}).join('')

const jellies = JELLIES.map((jelly, index) => {
  const height = Math.round(jelly.width * 1.5)

  return `<g class="drift" style="animation-duration:${jelly.floatSeconds}s;animation-delay:${jelly.delay}s">
    <g class="pulse" style="transform-origin:${jelly.x + jelly.width / 2}px ${jelly.y}px;animation-duration:${jelly.pulseSeconds}s;animation-delay:${index * 0.4}s">
      <use href="#jelly" x="${jelly.x}" y="${jelly.y}" width="${jelly.width}" height="${height}" opacity="${jelly.opacity}"/>
    </g>
  </g>`
}).join('')

export const ABYSS_JELLYFISH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <symbol id="jelly" viewBox="0 0 100 150" preserveAspectRatio="xMidYMid meet">
    <image href="${JELLYFISH_SPRITE}" width="100" height="150" preserveAspectRatio="xMidYMid meet"/>
  </symbol>
  <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9ec5ff" stop-opacity=".16"/>
    <stop offset="1" stop-color="#9ec5ff" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="calm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#040815" stop-opacity=".55"/>
    <stop offset="1" stop-color="#040815" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  .drift{animation:drift 13s ease-in-out infinite alternate}
  .pulse{transform-box:view-box;animation:pulse 3s ease-in-out infinite}
  .rays path{animation:shimmer 9s ease-in-out infinite alternate}
  .snow circle{fill:#cfe3ff;opacity:.45}
  .blink{animation:blink 4s ease-in-out infinite}
  use{mix-blend-mode:screen}
  @keyframes drift{from{transform:translateY(18px)}to{transform:translateY(-34px)}}
  @keyframes pulse{0%,100%{transform:scale(1,1)}45%{transform:scale(1.04,.95)}}
  @keyframes shimmer{from{opacity:.35}to{opacity:1}}
  @keyframes rise{from{transform:translateY(0)}to{transform:translateY(-1100px)}}
  @keyframes blink{0%,100%{opacity:.1}50%{opacity:.9}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="#040815"/>
<image href="${ABYSS_PLATE}" width="1600" height="1000" preserveAspectRatio="xMidYMid slice"/>
<g class="rays">
  <path d="M520 -20L640 -20L470 760L330 760Z" fill="url(#ray)"/>
  <path d="M900 -20L960 -20L1010 700L900 700Z" fill="url(#ray)" style="animation-delay:-3s"/>
  <path d="M1120 -20L1200 -20L1360 640L1240 640Z" fill="url(#ray)" style="animation-delay:-6s"/>
</g>
<ellipse cx="800" cy="500" rx="560" ry="420" fill="url(#calm)"/>
<g class="snow">${snow}</g>
${plankton}
${jellies}
</svg>`
