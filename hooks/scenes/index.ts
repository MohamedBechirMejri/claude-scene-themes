import { ABYSS_JELLYFISH } from './abyss-jellyfish'
import { ARCADE } from './arcade'
import { BLACK_HOLE } from './black-hole'
import { HACKER_MAINFRAME } from './hacker-mainframe'
import { LAVA_LAMP } from './lava-lamp'
import { MECH_COCKPIT } from './mech-cockpit'
import { NIGHT_CITY } from './night-city'
import { ORBITAL_STATION } from './orbital-station'
import { STARSHIP_HUD } from './starship-hud'

type Scene = { source: string; alt: string }

/** Every backdrop scene this mod draws, by the scene name its look sets. */
export const SCENES: Partial<Record<string, Scene>> = {
  'starship-hud': { source: STARSHIP_HUD, alt: 'A starship HUD with a sweeping radar and a turning orbit' },
  'hacker-mainframe': { source: HACKER_MAINFRAME, alt: 'Circuit traces with green pulses running along the edges' },
  'mech-cockpit': { source: MECH_COCKPIT, alt: 'A mech cockpit with hazard-striped panels and turning reticles' },
  'lava-lamp': { source: LAVA_LAMP, alt: 'Glowing liquid blobs drifting slowly like a lava lamp' },
  arcade: { source: ARCADE, alt: 'Pixel sprites and stars over arcade scanlines' },
  'black-hole': { source: BLACK_HOLE, alt: 'A black hole with a spinning accretion disk over a nebula' },
  'night-city': { source: NIGHT_CITY, alt: 'A neon city at night with sweeping searchlights, flying cars and rain' },
  'orbital-station': { source: ORBITAL_STATION, alt: 'A ring station turning above a blue planet with ships streaking past' },
  'abyss-jellyfish': { source: ABYSS_JELLYFISH, alt: 'Glowing jellyfish drifting in the deep ocean' },
}
