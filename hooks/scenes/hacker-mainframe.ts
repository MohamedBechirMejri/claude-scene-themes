/**
 * Inside the machine: circuit traces along both edges with acid-green pulses
 * running along them, glowing nodes and columns of hex flickering at the margins.
 * The middle stays dark so the conversation reads cleanly.
 */
const TRACES = [
  'M0 120H120L160 160V340L200 380H270',
  'M0 220H80L120 260V520L90 550V700',
  'M0 420H40L70 450V820L110 860H230',
  'M60 0V60L100 100H210L240 130V260',
  'M0 900H150L190 860V640L230 600H300',
  'M180 1000V920L220 880H330',
  'M0 620H20L50 650V760',
  'M280 0V40L310 70H360',
]

const NODES: Array<[number, number]> = [
  [270, 380], [90, 700], [230, 860], [240, 260], [300, 600], [330, 880], [50, 760], [360, 70],
]

const HEX_LINES = ['0x8F3A', '0x21C9', '0x7E0D', '0xB4F0', '0x2E61', '0x9D17', '0x5C0B', '0xE6A2', '0x13F8', '0xA07C']

function hexColumn(x: number, y: number, anchor: 'start' | 'end', delay: number): string {
  const lines = HEX_LINES.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : 17}">${line}</tspan>`).join('')

  return `<text class="hex" x="${x}" y="${y}" text-anchor="${anchor}" style="animation-delay:${delay}s">${lines}</text>`
}

const paths = TRACES.map(d => `<path d="${d}"/>`).join('')
const nodes = NODES.map(([cx, cy], index) => `<circle class="node" cx="${cx}" cy="${cy}" r="4" style="animation-delay:${(index * 0.7) % 4}s"/>`).join('')
const side = `<g class="base">${paths}</g><g class="pulse">${paths}</g><g class="pulse late">${paths}</g><g fill="#a3ff12">${nodes}</g>`

export const HACKER_MAINFRAME = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <radialGradient id="bg" cx="50%" cy="50%" r="75%">
    <stop offset="0" stop-color="#07140b"/>
    <stop offset="1" stop-color="#020503"/>
  </radialGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<style>
  .base{fill:none;stroke:#1d6b33;stroke-opacity:.55;stroke-width:2}
  .pulse{fill:none;stroke:#a3ff12;stroke-width:2.5;stroke-linecap:round;stroke-dasharray:10 600;animation:run 6s linear infinite}
  .late{stroke-dasharray:6 900;animation-duration:9s;animation-delay:-4s}
  .node{animation:glow 4s ease-in-out infinite}
  .hex{font-family:ui-monospace,Menlo,monospace;font-size:12px;fill:#4ade80;fill-opacity:.35;animation:flicker 5s steps(3) infinite}
  @keyframes run{from{stroke-dashoffset:610}to{stroke-dashoffset:0}}
  @keyframes glow{0%,100%{opacity:.35}50%{opacity:1}}
  @keyframes flicker{0%,100%{fill-opacity:.35}40%{fill-opacity:.12}70%{fill-opacity:.5}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="url(#bg)"/>
<g filter="url(#glow)">
  <g>${side}</g>
  <g transform="translate(1600 0) scale(-1 1)">${side}</g>
  <g transform="translate(0 1000) scale(1 -1) translate(560 0)" opacity=".5">
    <path class="base" d="M0 0V40L30 70H120L150 40H330L360 70H480"/>
    <path class="pulse" d="M0 0V40L30 70H120L150 40H330L360 70H480"/>
  </g>
</g>
${hexColumn(20, 40, 'start', 0)}
${hexColumn(20, 720, 'start', 1.7)}
${hexColumn(1580, 720, 'end', 0.9)}
</svg>`
