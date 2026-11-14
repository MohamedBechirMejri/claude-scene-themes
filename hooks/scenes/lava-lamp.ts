/**
 * Glossy liquid blobs in orange, magenta and yellow drifting slowly, mostly
 * along the edges, with the middle kept darker so text stays readable.
 * Soft radial gradients stand in for blur filters to keep drawing cheap.
 */
type Blob = { cx: number; cy: number; r: number; fill: string; dx: number; dy: number; seconds: number }

const BLOBS: Blob[] = [
  { cx: 90, cy: 260, r: 300, fill: 'orange', dx: 60, dy: 140, seconds: 26 },
  { cx: 220, cy: 860, r: 340, fill: 'magenta', dx: -40, dy: -160, seconds: 31 },
  { cx: 1510, cy: 180, r: 320, fill: 'yellow', dx: -70, dy: 120, seconds: 29 },
  { cx: 1420, cy: 820, r: 360, fill: 'magenta', dx: 50, dy: -140, seconds: 34 },
  { cx: 800, cy: -120, r: 260, fill: 'violet', dx: 120, dy: 60, seconds: 38 },
  { cx: 760, cy: 1130, r: 280, fill: 'orange', dx: -110, dy: -50, seconds: 33 },
]

const keyframes = BLOBS.map(
  (blob, index) => `@keyframes drift${index}{to{transform:translate(${blob.dx}px,${blob.dy}px) scale(1.12)}}`,
).join('')

const circles = BLOBS.map(
  (blob, index) =>
    `<circle cx="${blob.cx}" cy="${blob.cy}" r="${blob.r}" fill="url(#${blob.fill})" style="transform-box:view-box;transform-origin:${blob.cx}px ${blob.cy}px;animation:drift${index} ${blob.seconds}s ease-in-out infinite alternate"/>`,
).join('')

function gradient(id: string, core: string, edge: string): string {
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%" fx="38%" fy="34%">
    <stop offset="0" stop-color="${core}"/>
    <stop offset=".45" stop-color="${edge}" stop-opacity=".85"/>
    <stop offset="1" stop-color="${edge}" stop-opacity="0"/>
  </radialGradient>`
}

export const LAVA_LAMP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  ${gradient('orange', '#ffd08a', '#ff5a1f')}
  ${gradient('magenta', '#ff9ccf', '#e0157a')}
  ${gradient('yellow', '#fff2a8', '#ffb400')}
  ${gradient('violet', '#c6a4ff', '#6a1fd1')}
  <radialGradient id="calm" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#0d040c" stop-opacity=".75"/>
    <stop offset="1" stop-color="#0d040c" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  ${keyframes}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="1600" height="1000" fill="#0d040c"/>
${circles}
<ellipse cx="800" cy="500" rx="620" ry="460" fill="url(#calm)"/>
</svg>`
