import type { EngineInterface, Register, Timer } from 'claude-code'

import { DEFAULT_LOOK, LOOKS, LOOK_NAMES, isLookName } from './looks'
import type { LookName } from './looks'
import { SCENES } from './scenes'

/** Store key holding what the person picked last: a look name, `off` or `cycle`. */
const PICK_KEY = 'look'
/** Store key holding the cycle's interval in minutes. */
const CYCLE_MINUTES_KEY = 'cycle-minutes'
/** Store key holding the index of the look the cycle shows next. */
const CYCLE_NEXT_KEY = 'cycle-next'

const OFF = 'off'
const CYCLE = 'cycle'
const DEFAULT_CYCLE_MINUTES = 5
const MAX_CYCLE_MINUTES = 240

/** The running rotation, if any. A module reload drops it, and `session.start` starts it again. */
let cycleTimer: Timer | undefined

/**
 * Sets one look as the session's theme. Reports the first line that would stop
 * Desktop painting its colors, and says why when the attached client draws no theme.
 */
async function applyLook($: EngineInterface, name: LookName): Promise<string | undefined> {
  const look = LOOKS[name]
  const unpainted = look.problems.find(line => line.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    $.ui.toast(`${look.label}: ${unpainted}`)
  }
  const result = await $.theme.set(look.theme)

  return result.isDrawn ? undefined : result.reason
}

/** Shows the look the cycle is due to show, then moves the cycle on by one. */
async function showNextInCycle($: EngineInterface): Promise<LookName> {
  const stored = await $.store.get(CYCLE_NEXT_KEY)
  const index = typeof stored === 'number' && Number.isInteger(stored) ? stored % LOOK_NAMES.length : 0
  const name = LOOK_NAMES[index] ?? DEFAULT_LOOK

  await $.store.set(CYCLE_NEXT_KEY, (index + 1) % LOOK_NAMES.length)
  await applyLook($, name)

  return name
}

function stopCycle(): void {
  cycleTimer?.cancel()
  cycleTimer = undefined
}

function startCycle($: EngineInterface, minutes: number): void {
  stopCycle()
  cycleTimer = $.clock.every(minutes * 60_000, () => {
    void showNextInCycle($)
  })
}

async function cycleMinutes($: EngineInterface): Promise<number> {
  const stored = await $.store.get(CYCLE_MINUTES_KEY)

  return typeof stored === 'number' && stored >= 1 && stored <= MAX_CYCLE_MINUTES ? stored : DEFAULT_CYCLE_MINUTES
}

/** Reads `/scene cycle [minutes]`'s minutes: a whole number from 1 to 240, or undefined when invalid. */
function parseMinutes(raw: string | undefined): number | undefined {
  if (raw === undefined) {
    return DEFAULT_CYCLE_MINUTES
  }
  const minutes = Number(raw)

  return Number.isInteger(minutes) && minutes >= 1 && minutes <= MAX_CYCLE_MINUTES ? minutes : undefined
}

function usage(current: string): string {
  return `Current theme: ${current}. Use /scene <name> with one of: ${LOOK_NAMES.join(', ')}. Use /scene cycle [minutes] to rotate through all of them (every ${DEFAULT_CYCLE_MINUTES} minutes by default), or /scene off.`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'scene',
      description: 'Switch the custom theme, or rotate through all of them',
      argumentHint: `[${[...LOOK_NAMES, CYCLE, OFF].join('|')}]`,
    })
    const picked = await $.store.get(PICK_KEY)

    if (picked === CYCLE) {
      await showNextInCycle($)
      startCycle($, await cycleMinutes($))
    } else if (picked !== OFF) {
      const notDrawn = await applyLook($, isLookName(picked) ? picked : DEFAULT_LOOK)

      if (notDrawn !== undefined) {
        $.ui.status(notDrawn)
      }
    }

    return next(e)
  })

  on('command.run', { command: 'scene' }, async ($, e) => {
    const [wanted = '', extra] = e.args.trim().toLowerCase().split(/\s+/)
    const picked = await $.store.get(PICK_KEY)
    const current = picked === OFF || picked === CYCLE || isLookName(picked) ? picked : DEFAULT_LOOK

    if (wanted === '') {
      return { text: usage(current) }
    }
    if (wanted === OFF) {
      stopCycle()
      await $.store.set(PICK_KEY, OFF)
      await $.theme.clear()

      return { text: 'Custom theme off.' }
    }
    if (wanted === CYCLE) {
      const minutes = parseMinutes(extra)

      if (minutes === undefined) {
        return { text: `Minutes must be a whole number from 1 to ${MAX_CYCLE_MINUTES}, like /scene cycle 10.` }
      }
      await $.store.set(PICK_KEY, CYCLE)
      await $.store.set(CYCLE_MINUTES_KEY, minutes)
      const shown = await showNextInCycle($)
      startCycle($, minutes)

      return { text: `Rotating through all ${LOOK_NAMES.length} themes every ${minutes} minutes, starting with ${LOOKS[shown].label}.` }
    }
    if (!isLookName(wanted)) {
      return { text: `No theme called "${wanted}". ${usage(current)}` }
    }
    stopCycle()
    await $.store.set(PICK_KEY, wanted)
    const notDrawn = await applyLook($, wanted)

    return {
      text:
        notDrawn === undefined
          ? `Theme set to ${LOOKS[wanted].label}.`
          : `Theme saved as ${LOOKS[wanted].label}, but nothing draws here: ${notDrawn}`,
    }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const scene = SCENES[e.props.scene]

    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || scene === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={scene.source} alt={scene.alt} isInteractive />
  })
}
