/**
 * A mech cockpit seen from the pilot seat: armored side panels with hazard
 * stripes, blinking indicator lights, and two targeting reticles turning slowly
 * in opposite corners. The center is the dark canopy glass.
 */
const RIVETS = [80, 240, 400, 560, 720, 880]
  .map(y => `<circle cx="70" cy="${y}" r="3"/><circle cx="150" cy="${y + 40}" r="3"/>`)
  .join('')

const LIGHTS = [
  [110, 190, 0], [110, 210, 0.6], [110, 650, 1.1], [130, 650, 1.9], [120, 470, 2.4],
]
  .map(([cx, cy, delay]) => `<circle class="lamp" cx="${cx}" cy="${cy}" r="5" style="animation-delay:${delay}s"/>`)
  .join('')

const PANEL = `
  <path d="M0 0H150L196 64V936L150 1000H0Z" fill="url(#plate)" stroke="#2c3036" stroke-width="2"/>
  <path d="M0 330H178M0 690H178M100 0V1000" stroke="#0a0b0d" stroke-opacity=".7" stroke-width="2"/>
  <rect x="0" y="0" width="38" height="1000" fill="url(#hazard)" opacity=".85"/>
  <path d="M38 0V1000" stroke="#000" stroke-opacity=".6" stroke-width="3"/>
  <g fill="#3a3f46">${RIVETS}</g>
  <g fill="#ff7a1a">${LIGHTS}</g>
  <rect x="58" y="420" width="96" height="104" rx="4" fill="#0b0c0e" stroke="#2c3036"/>
  <path class="gauge" d="M66 500H146" stroke="#ff7a1a" stroke-width="3"/>
  <path d="M66 470H120M66 450H136" stroke="#ff7a1a" stroke-opacity=".35" stroke-width="3"/>
`

function reticle(x: number, y: number, size: number, cls: string): string {
  const arm = size * 0.35

  return `<g class="${cls}" style="transform-origin:${x}px ${y}px">
    <circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="#ff7a1a" stroke-opacity=".35" stroke-dasharray="${size * 0.5} ${size * 0.25}"/>
    <circle cx="${x}" cy="${y}" r="${size * 0.55}" fill="none" stroke="#ff7a1a" stroke-opacity=".25"/>
    <path d="M${x - size - arm} ${y}H${x - size + arm}M${x + size - arm} ${y}H${x + size + arm}M${x} ${y - size - arm}V${y - size + arm}M${x} ${y + size - arm}V${y + size + arm}" stroke="#ff7a1a" stroke-opacity=".6" stroke-width="2"/>
    <circle cx="${x}" cy="${y}" r="3" fill="#ff7a1a" fill-opacity=".8"/>
  </g>`
}

export const MECH_COCKPIT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#17191d"/>
    <stop offset="1" stop-color="#0a0b0d"/>
  </linearGradient>
  <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#23262b"/>
    <stop offset="1" stop-color="#16181b"/>
  </linearGradient>
  <pattern id="hazard" width="38" height="38" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="38" height="38" fill="#121315"/>
    <rect width="19" height="38" fill="#e8690f"/>
  </pattern>
  <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".5" stop-color="#fff" stop-opacity=".035"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
</defs>
<style>
  .lamp{animation:lamp 3s steps(2) infinite}
  .gauge{transform-box:fill-box;transform-origin:left center;animation:gauge 4s ease-in-out infinite alternate}
  .turn{transform-box:view-box;animation:turn 24s linear infinite}
  .turn-back{transform-box:view-box;animation:turn 36s linear infinite reverse}
  @keyframes lamp{50%{opacity:.2}}
  @keyframes gauge{from{transform:scaleX(.4)}to{transform:scaleX(1)}}
  @keyframes turn{to{transform:rotate(360deg)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="url(#bg)"/>
<path d="M200 0H1400L1600 200V0ZM200 1000H1400L1600 800V1000Z" fill="#0d0e10" opacity=".6"/>
<path d="M420 0L980 1000H1180L620 0Z" fill="url(#glare)"/>
<rect x="0" y="0" width="1600" height="22" fill="#111215"/>
<g fill="#ff7a1a">
  <rect class="lamp" x="640" y="8" width="18" height="6" rx="2"/>
  <rect class="lamp" x="670" y="8" width="18" height="6" rx="2" style="animation-delay:.5s"/>
  <rect x="912" y="8" width="48" height="6" rx="2" opacity=".5"/>
</g>
${reticle(320, 790, 70, 'turn')}
${reticle(1290, 230, 54, 'turn-back')}
<g>${PANEL}</g>
<g transform="translate(1600 0) scale(-1 1)">${PANEL}</g>
</svg>`
