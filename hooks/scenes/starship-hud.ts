/**
 * A starship bridge HUD: a radar sweeping on the left, an orbit turning on the
 * lower right, telemetry ticking in the corners and a slow scan line.
 * Subjects stay near the edges so the conversation in the middle stays clear.
 */
const TELEMETRY_FONT = `font-family="ui-monospace,Menlo,monospace" font-size="13" fill="#67e8f9"`

export const STARSHIP_HUD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <radialGradient id="bg" cx="50%" cy="42%" r="78%">
    <stop offset="0" stop-color="#0b2533"/>
    <stop offset="1" stop-color="#02070b"/>
  </radialGradient>
  <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="#22d3ee" stroke-opacity=".05"/>
  </pattern>
  <pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="1" fill="#000" fill-opacity=".22"/>
  </pattern>
  <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>
    <stop offset=".5" stop-color="#22d3ee" stop-opacity=".07"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="sweepFill" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(330 430) scale(240)">
    <stop offset="0" stop-color="#22d3ee" stop-opacity=".05"/>
    <stop offset="1" stop-color="#22d3ee" stop-opacity=".28"/>
  </radialGradient>
</defs>
<style>
  .radar{transform-box:view-box;transform-origin:330px 430px;animation:turn 7s linear infinite}
  .orbit{transform-box:view-box;transform-origin:1370px 790px;animation:turn 60s linear infinite}
  .orbit-back{transform-box:view-box;transform-origin:1370px 790px;animation:turn 90s linear infinite reverse}
  .blip{animation:ping 7s ease-out infinite}
  .tick{animation:blink 2.4s steps(2) infinite}
  .scan{animation:scan 11s linear infinite}
  @keyframes turn{to{transform:rotate(360deg)}}
  @keyframes ping{0%,8%{opacity:0}12%{opacity:1}60%,100%{opacity:0}}
  @keyframes blink{50%{opacity:.15}}
  @keyframes scan{from{transform:translateY(-200px)}to{transform:translateY(1100px)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="url(#bg)"/>
<rect width="1600" height="1000" fill="url(#grid)"/>

<g fill="none" stroke="#22d3ee">
  <circle cx="330" cy="430" r="240" stroke-opacity=".28"/>
  <circle cx="330" cy="430" r="180" stroke-opacity=".18" stroke-dasharray="2 6"/>
  <circle cx="330" cy="430" r="120" stroke-opacity=".18"/>
  <circle cx="330" cy="430" r="60" stroke-opacity=".14" stroke-dasharray="2 6"/>
  <path d="M90 430H570M330 190V670" stroke-opacity=".12"/>
  <circle cx="330" cy="430" r="262" stroke-opacity=".1" stroke-dasharray="1 9" stroke-width="6"/>
</g>
<g class="radar">
  <path d="M330 430L570 430A240 240 0 0 0 514 276Z" fill="url(#sweepFill)"/>
  <path d="M330 430H570" stroke="#67e8f9" stroke-opacity=".8" stroke-width="1.5"/>
</g>
<g fill="#67e8f9">
  <circle class="blip" cx="470" cy="360" r="4"/>
  <circle class="blip" cx="250" cy="560" r="3" style="animation-delay:3.1s"/>
  <circle class="blip" cx="410" cy="250" r="3" style="animation-delay:5.2s"/>
</g>

<g fill="none" stroke="#22d3ee">
  <ellipse cx="1370" cy="790" rx="190" ry="70" stroke-opacity=".22" transform="rotate(-18 1370 790)"/>
  <ellipse cx="1370" cy="790" rx="120" ry="44" stroke-opacity=".16" stroke-dasharray="3 7" transform="rotate(-18 1370 790)"/>
  <circle cx="1370" cy="790" r="14" fill="#22d3ee" fill-opacity=".25" stroke-opacity=".6"/>
</g>
<g class="orbit"><circle cx="1560" cy="790" r="5" fill="#a5f3fc"/></g>
<g class="orbit-back"><circle cx="1250" cy="790" r="3" fill="#67e8f9"/></g>

<g fill="none" stroke="#22d3ee" stroke-opacity=".14">
  <circle cx="820" cy="1330" r="420"/>
  <ellipse cx="820" cy="1330" rx="210" ry="420"/>
  <ellipse cx="820" cy="1330" rx="330" ry="420" stroke-dasharray="2 8"/>
  <path d="M400 1330H1240M440 1150H1200M520 1020H1120"/>
</g>

<g stroke="#22d3ee" stroke-opacity=".4">
  <path d="M40 380V620M40 380H52M40 440H48M40 500H56M40 560H48M40 620H52"/>
</g>
<g ${TELEMETRY_FONT} fill-opacity=".55">
  <text x="60" y="384">+60°</text><text x="60" y="504">0°</text><text x="60" y="624">-60°</text>
  <text x="24" y="40">NAV v3.7.4</text>
  <text x="24" y="58">SECTOR 7-419</text>
  <text x="24" y="76" class="tick">ORI 284.6°</text>
  <text x="24" y="940">VEL 0.704 c</text>
  <text x="24" y="958" class="tick" style="animation-delay:.8s">RNG 43.2 Gm</text>
  <text x="24" y="976">ETA 05:17:22</text>
  <text x="1576" y="40" text-anchor="end">α 14° 29′ 37.2″</text>
  <text x="1576" y="58" text-anchor="end" class="tick" style="animation-delay:1.3s">δ −62° 18′ 41″</text>
  <text x="1576" y="76" text-anchor="end">Z 7.440</text>
  <text x="1576" y="940" text-anchor="end">SOL 0.992 AU</text>
  <text x="1576" y="958" text-anchor="end">TRG 5.417 AU</text>
  <text x="1576" y="976" text-anchor="end" class="tick" style="animation-delay:.4s">CRS 284.6°</text>
</g>

<rect class="scan" y="0" width="1600" height="160" fill="url(#scan)"/>
<rect width="1600" height="1000" fill="url(#lines)"/>
</svg>`
