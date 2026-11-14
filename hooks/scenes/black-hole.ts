/**
 * A black hole off the right edge: a face-on accretion disk sprite spun and
 * squashed flat so it reads as a disk orbiting in perspective, its front half
 * drawn again over the event horizon, a lensed ring hugging the shadow, glints
 * orbiting in the disk plane and stars twinkling over a painted nebula.
 */
import { BLACKHOLE_PLATE, DISK_SPRITE } from './assets'

const CENTER = { x: 1330, y: 470 }
const HORIZON = 100
const DISK_SIZE = 940
/** How flat the disk lies: the vertical squash of the face-on sprite. */
const TILT = 0.24

function seeded(seed: number): () => number {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296

    return state / 4294967296
  }
}

const random = seeded(11)

const stars = Array.from({ length: 34 }, () => {
  const x = Math.round(random() * 1600)
  const y = Math.round(random() * 1000)
  const delay = (random() * 5).toFixed(1)
  const r = (0.8 + random() * 1.4).toFixed(1)

  return `<circle class="twinkle" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${delay}s"/>`
}).join('')

const glints = [260, 330, 400]
  .map(
    (radius, index) =>
      `<ellipse class="glint" rx="${radius}" ry="${Math.round(radius * TILT)}" style="animation-duration:${6 + index * 3}s;animation-delay:${-index * 2}s"/>`,
  )
  .join('')

/** The disk sprite is embedded once, as a unit square centered on the origin, and reused at any size. */
function disk(size: number): string {
  return `<g class="spin"><use href="#disk" transform="scale(${size})"/></g>`
}

export const BLACK_HOLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <image id="disk" href="${DISK_SPRITE}" x="-.5" y="-.5" width="1" height="1"/>
  <radialGradient id="haloFade" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="230">
    <stop offset="0" stop-color="#000"/>
    <stop offset=".42" stop-color="#000"/>
    <stop offset=".47" stop-color="#fff"/>
    <stop offset=".62" stop-color="#fff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#000"/>
  </radialGradient>
  <mask id="halo" maskUnits="userSpaceOnUse" x="-240" y="-240" width="480" height="480">
    <circle r="230" fill="url(#haloFade)"/>
  </mask>
  <clipPath id="front" clipPathUnits="userSpaceOnUse">
    <rect x="-600" y="0" width="1200" height="600"/>
  </clipPath>
  <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
    <stop offset=".8" stop-color="#000"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="calm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#07030a" stop-opacity=".5"/>
    <stop offset="1" stop-color="#07030a" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  use{mix-blend-mode:screen}
  .spin{transform-box:fill-box;transform-origin:center;animation:spin 40s linear infinite}
  .halo .spin{animation-duration:70s;animation-direction:reverse}
  .glint{fill:none;stroke:#fff3c4;stroke-width:2.5;stroke-linecap:round;stroke-dasharray:26 2200;opacity:.75;animation:orbit 8s linear infinite}
  .ring{animation:breathe 5s ease-in-out infinite}
  .twinkle{fill:#fff;animation:twinkle 4s ease-in-out infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes orbit{from{stroke-dashoffset:0}to{stroke-dashoffset:-2226}}
  @keyframes breathe{0%,100%{opacity:.65}50%{opacity:1}}
  @keyframes twinkle{0%,100%{opacity:.15}50%{opacity:.9}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="#07030a"/>
<image href="${BLACKHOLE_PLATE}" width="1600" height="1000" preserveAspectRatio="xMidYMid slice"/>
${stars}
<ellipse cx="760" cy="520" rx="560" ry="430" fill="url(#calm)"/>
<g transform="translate(${CENTER.x} ${CENTER.y})">
  <g class="halo" mask="url(#halo)" opacity=".9">${disk(520)}</g>
  <g transform="scale(1 ${TILT})">${disk(DISK_SIZE)}${glints}</g>
  <circle r="${HORIZON + 14}" fill="url(#shadow)"/>
  <circle class="ring" r="${HORIZON + 3}" fill="none" stroke="#ffd27a" stroke-width="1.6" opacity=".8"/>
  <g transform="scale(1 ${TILT})" clip-path="url(#front)">${disk(DISK_SIZE)}</g>
</g>
</svg>`
