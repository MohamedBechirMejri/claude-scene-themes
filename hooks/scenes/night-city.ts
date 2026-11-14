/**
 * A megacity at night: a painted skyline plate, searchlights sweeping up from
 * both sides, flying cars trailing light along curved lanes in the margins,
 * fine rain falling and the neon haze on the horizon breathing.
 */
import { CITY_PLATE } from './assets'

type Lane = { path: string; seconds: number; delay: number; color: string }

const LANES: Lane[] = [
  { path: 'M-80 330 C 120 300, 260 360, 470 300', seconds: 9, delay: 0, color: '#ff4fd8' },
  { path: 'M470 520 C 300 560, 140 500, -80 560', seconds: 11, delay: -4, color: '#7df9ff' },
  { path: 'M1680 280 C 1500 320, 1340 250, 1130 300', seconds: 10, delay: -2, color: '#7df9ff' },
  { path: 'M1130 600 C 1310 560, 1460 640, 1680 590', seconds: 12, delay: -7, color: '#ff4fd8' },
  { path: 'M-80 160 C 400 120, 1200 120, 1680 170', seconds: 22, delay: -9, color: '#ffffff' },
]

const cars = LANES.map(
  lane => `<g>
    <path d="M-90 0H0" stroke="${lane.color}" stroke-width="7" stroke-linecap="round" opacity=".18"/>
    <path d="M-80 0H0" stroke="url(#trail-${lane.color === '#ff4fd8' ? 'pink' : lane.color === '#7df9ff' ? 'cyan' : 'white'})" stroke-width="2.6" stroke-linecap="round"/>
    <circle r="3.2" fill="#fff"/>
    <animateMotion dur="${lane.seconds}s" begin="${lane.delay}s" repeatCount="indefinite" rotate="auto" path="${lane.path}"/>
  </g>`,
).join('')

/** A searchlight standing at `x`; it sweeps on its own side so it never leans into the chat. */
function beam(x: number, color: string, seconds: number, delay: number): string {
  const side = x < 800 ? 'left' : 'right'

  return `<path class="beam ${side}" d="M${x - 6} 1000L${x + 6} 1000L${x + 64} 60L${x - 64} 60Z" fill="url(#beam-${color})" style="animation-duration:${seconds}s;animation-delay:${delay}s"/>`
}

export const NIGHT_CITY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="beam-cyan" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#7df9ff" stop-opacity=".22"/>
    <stop offset="1" stop-color="#7df9ff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="beam-pink" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#ff4fd8" stop-opacity=".2"/>
    <stop offset="1" stop-color="#ff4fd8" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="trail-pink" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ff4fd8" stop-opacity="0"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient>
  <linearGradient id="trail-cyan" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#7df9ff" stop-opacity="0"/><stop offset="1" stop-color="#7df9ff"/></linearGradient>
  <linearGradient id="trail-white" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <pattern id="rain" width="40" height="120" patternUnits="userSpaceOnUse">
    <path d="M31 0L27 34M11 52L7 86M24 92L21 118" stroke="#cfd8ff" stroke-width="1" stroke-linecap="round"/>
  </pattern>
  <radialGradient id="haze-pink" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ff2fb3" stop-opacity=".35"/>
    <stop offset="1" stop-color="#ff2fb3" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="haze-cyan" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#22d3ee" stop-opacity=".3"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="calm" cx="50%" cy="45%" r="50%">
    <stop offset="0" stop-color="#0b0714" stop-opacity=".5"/>
    <stop offset="1" stop-color="#0b0714" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  .beam{mix-blend-mode:screen;transform-box:fill-box;transform-origin:50% 100%;animation:sweep 10s ease-in-out infinite alternate}
  .haze{animation:breathe 6s ease-in-out infinite alternate}
  .rain{animation:fall .9s linear infinite}
  .right{animation-name:sweep-right}
  @keyframes sweep{from{transform:rotate(-24deg)}to{transform:rotate(4deg)}}
  @keyframes sweep-right{from{transform:rotate(-4deg)}to{transform:rotate(24deg)}}
  @keyframes breathe{from{opacity:.5}to{opacity:1}}
  @keyframes fall{from{transform:translateY(-120px)}to{transform:translateY(0)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="#0b0714"/>
<image href="${CITY_PLATE}" width="1600" height="1000" preserveAspectRatio="xMidYMid slice"/>
${beam(120, 'cyan', 11, 0)}
${beam(330, 'pink', 14, -6)}
${beam(1480, 'pink', 13, -5)}
${beam(1270, 'cyan', 10, -2)}
<ellipse class="haze" cx="260" cy="930" rx="420" ry="160" fill="url(#haze-pink)"/>
<ellipse class="haze" cx="1360" cy="930" rx="420" ry="160" fill="url(#haze-cyan)" style="animation-delay:-3s"/>
<ellipse cx="800" cy="450" rx="540" ry="420" fill="url(#calm)"/>
${cars}
<rect class="rain" x="0" y="0" width="1600" height="1120" fill="url(#rain)" opacity=".09"/>
</svg>`
