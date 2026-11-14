/**
 * Orbit above a blue planet: a painted plate of the planet's limb and nebula,
 * a ring station sprite spun and tilted in the upper right so it turns in
 * perspective, ships streaking past at warp, a satellite crossing and the
 * atmosphere breathing.
 */
import { ORBIT_PLATE, STATION_SPRITE } from './assets'

type Streak = { y: number; length: number; seconds: number; delay: number; color: string }

const STREAKS: Streak[] = [
  { y: 150, length: 260, seconds: 9, delay: 0, color: '#bfe9ff' },
  { y: 420, length: 180, seconds: 14, delay: -5, color: '#c4b5fd' },
  { y: 610, length: 220, seconds: 19, delay: -11, color: '#bfe9ff' },
]

function seeded(seed: number): () => number {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296

    return state / 4294967296
  }
}

const random = seeded(23)

const stars = Array.from({ length: 30 }, () => {
  const x = Math.round(random() * 1600)
  const y = Math.round(random() * 640)
  const delay = (random() * 5).toFixed(1)

  return `<circle class="twinkle" cx="${x}" cy="${y}" r="1.3" style="animation-delay:${delay}s"/>`
}).join('')

const streaks = STREAKS.map(
  streak => `<g class="warp" style="animation-duration:${streak.seconds}s;animation-delay:${streak.delay}s">
    <path d="M0 ${streak.y}H${streak.length}" stroke="url(#streak)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="${streak.length}" cy="${streak.y}" r="2.6" fill="${streak.color}"/>
  </g>`,
).join('')

export const ORBITAL_STATION = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <image id="station" href="${STATION_SPRITE}" x="-.5" y="-.5" width="1" height="1"/>
  <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#bfe9ff" stop-opacity="0"/>
    <stop offset="1" stop-color="#bfe9ff" stop-opacity=".9"/>
  </linearGradient>
  <radialGradient id="atmosphere" cx="50%" cy="100%" r="70%">
    <stop offset=".55" stop-color="#38bdf8" stop-opacity="0"/>
    <stop offset=".72" stop-color="#38bdf8" stop-opacity=".22"/>
    <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="calm" cx="50%" cy="45%" r="50%">
    <stop offset="0" stop-color="#040914" stop-opacity=".5"/>
    <stop offset="1" stop-color="#040914" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  use{mix-blend-mode:screen}
  .spin{transform-box:fill-box;transform-origin:center;animation:spin 90s linear infinite}
  .warp{opacity:0;animation:warp 12s linear infinite}
  .breathe{animation:breathe 7s ease-in-out infinite alternate}
  .twinkle{fill:#fff;animation:twinkle 4s ease-in-out infinite}
  .satellite{animation:cross 70s linear infinite}
  .satellite circle{animation:twinkle 1.2s steps(2) infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes warp{0%{opacity:0;transform:translateX(-300px)}1%{opacity:1}7%{opacity:1;transform:translateX(1900px)}8%,100%{opacity:0;transform:translateX(1900px)}}
  @keyframes breathe{from{opacity:.55}to{opacity:1}}
  @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
  @keyframes cross{from{transform:translate(-40px,0)}to{transform:translate(1700px,-120px)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="#040914"/>
<image href="${ORBIT_PLATE}" width="1600" height="1000" preserveAspectRatio="xMidYMid slice"/>
${stars}
<rect class="breathe" x="-200" y="500" width="2000" height="700" fill="url(#atmosphere)"/>
<ellipse cx="800" cy="430" rx="540" ry="380" fill="url(#calm)"/>
<g transform="translate(1340 215) rotate(-16) scale(1 .42)">
  <g class="spin"><use href="#station" transform="scale(560)" opacity=".95"/></g>
</g>
${streaks}
<g class="satellite"><circle cx="0" cy="560" r="2" fill="#fde68a"/></g>
</svg>`
