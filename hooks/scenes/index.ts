import { ARCADE } from './arcade'
import { HACKER_MAINFRAME } from './hacker-mainframe'
import { LAVA_LAMP } from './lava-lamp'
import { MECH_COCKPIT } from './mech-cockpit'
import { STARSHIP_HUD } from './starship-hud'

type Scene = { source: string; alt: string }

/** Every backdrop scene this mod draws, by the scene name its look sets. */
export const SCENES: Partial<Record<string, Scene>> = {
  'starship-hud': { source: STARSHIP_HUD, alt: 'A starship HUD with a sweeping radar and a turning orbit' },
  'hacker-mainframe': { source: HACKER_MAINFRAME, alt: 'Circuit traces with green pulses running along the edges' },
  'mech-cockpit': { source: MECH_COCKPIT, alt: 'A mech cockpit with hazard-striped panels and turning reticles' },
  'lava-lamp': { source: LAVA_LAMP, alt: 'Glowing liquid blobs drifting slowly like a lava lamp' },
  arcade: { source: ARCADE, alt: 'Pixel sprites and stars over arcade scanlines' },
}
