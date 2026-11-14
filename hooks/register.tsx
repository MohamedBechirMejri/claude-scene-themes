import type { EngineInterface, Register, Timer } from 'claude-code'

import { DEFAULT_LOOK, LOOKS, LOOK_NAMES, isLookName } from './looks'
import type { LookName } from './looks'
import { SCENES } from './scenes'

/** Store key holding what the person picked last: a look name, `off` or `cycle`. */
const PICK_KEY = 'look'
/** Store key holding the cycle's interval in minutes. */
const CYCLE_MINUTES_KEY = 'cycle-minutes'
/** Store key holding the index of the look the cycle moves to next. */
const CYCLE_NEXT_KEY = 'cycle-next'
/** Store key holding the look the cycle shows now, shared by every open session. */
const CYCLE_CURRENT_KEY = 'cycle-current'
/** Store key holding when the cycle last moved on, in milliseconds since the epoch. */
const CYCLE_AT_KEY = 'cycle-at'

const OFF = 'off'
const CYCLE = 'cycle'
const DEFAULT_CYCLE_MINUTES = 5
const MAX_CYCLE_MINUTES = 240
/** How often each session checks whether the cycle is due to move on. */
const HEARTBEAT_MS = 30_000

/**
 * The session's heartbeat. It starts at `session.start`, the one place work that
 * outlives a dispatch may begin; a module reload drops it and `session.start`
 * starts it again.
 */
let heartbeat: Timer | undefined
/** The look this session last set, so a tick only repaints when the cycle moved. */
let shownLook: LookName | undefined

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
  shownLook = name
  const result = await $.theme.set(look.theme)

  return result.isDrawn ? undefined : result.reason
}

/** Moves the shared cycle on to its next look and records when, without painting. */
async function advanceCycle($: EngineInterface, now: number): Promise<LookName> {
  const stored = await $.store.get(CYCLE_NEXT_KEY)
  const index = typeof stored === 'number' && Number.isInteger(stored) ? stored % LOOK_NAMES.length : 0
  const name = LOOK_NAMES[index] ?? DEFAULT_LOOK

  await $.store.set(CYCLE_NEXT_KEY, (index + 1) % LOOK_NAMES.length)
  await $.store.set(CYCLE_CURRENT_KEY, name)
  await $.store.set(CYCLE_AT_KEY, now)

  return name
}

async function cycleMinutes($: EngineInterface): Promise<number> {
  const stored = await $.store.get(CYCLE_MINUTES_KEY)

  return typeof stored === 'number' && stored >= 1 && stored <= MAX_CYCLE_MINUTES ? stored : DEFAULT_CYCLE_MINUTES
}

/**
 * One heartbeat while the person has picked `cycle`: moves the shared cycle on
 * when its interval has passed, then paints the cycle's look if this session
 * isn't showing it yet. Any open session may move the cycle; all of them follow.
 */
async function tick($: EngineInterface): Promise<void> {
  if ((await $.store.get(PICK_KEY)) !== CYCLE) {
    return
  }
  const now = await $.clock.now()
  const at = await $.store.get(CYCLE_AT_KEY)
  const current = await $.store.get(CYCLE_CURRENT_KEY)
  const isDue = typeof at !== 'number' || now - at >= (await cycleMinutes($)) * 60_000
  const look = isDue || !isLookName(current) ? await advanceCycle($, now) : current

  if (look !== shownLook) {
    await applyLook($, look)
  }
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
    // A session often starts before the desktop client attaches, so "not drawn"
    // here is expected: the theme stands and draws once a client attaches.
    // Clear any status line an earlier version of this mod left behind.
    $.ui.status(undefined)

    heartbeat?.cancel()
    heartbeat = $.clock.every(HEARTBEAT_MS, () => {
      void tick($)
    })

    const picked = await $.store.get(PICK_KEY)

    if (picked === CYCLE) {
      await tick($)
    } else if (picked !== OFF) {
      await applyLook($, isLookName(picked) ? picked : DEFAULT_LOOK)
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
      await $.store.set(PICK_KEY, OFF)
      shownLook = undefined
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
      const shown = await advanceCycle($, await $.clock.now())
      await applyLook($, shown)

      return { text: `Rotating through all ${LOOK_NAMES.length} themes every ${minutes} minutes, starting with ${LOOKS[shown].label}.` }
    }
    if (!isLookName(wanted)) {
      return { text: `No theme called "${wanted}". ${usage(current)}` }
    }
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
