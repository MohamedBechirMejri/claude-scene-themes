import { expect, mock, test } from 'claude-code/testing'
import type { On, ThemeSetArgs } from 'claude-code'

import { LOOKS, LOOK_NAMES } from '../hooks/looks'
import { SCENES } from '../hooks/scenes'

type Calls = { sets: ThemeSetArgs[]; clears: number; store: Map<string, unknown> }

/** Stands in for the engine beneath the mod: a store in memory and a theme that draws. */
function engine(on: On, seed: Record<string, unknown> = {}): Calls {
  const calls: Calls = { sets: [], clears: 0, store: new Map(Object.entries(seed)) }

  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('store.get', (_, e) => ({ value: calls.store.get(e.key) }))
  on('store.set', (_, e) => {
    calls.store.set(e.key, e.value)

    return { value: undefined }
  })
  on('theme.set', (_, e) => {
    calls.sets.push(e)

    return { value: { isDrawn: true, requestId: 'backdrop' } }
  })
  on('theme.clear', () => {
    calls.clears += 1

    return { value: { isDrawn: false, reason: 'cleared' } }
  })
  on('ui.toast', () => ({ value: undefined }))

  return calls
}

const RUN = { origin: { kind: 'composer' }, presentation: { isFullscreen: false, columns: 80 } } as const

test('every look paints on Desktop and has a scene to draw', () => {
  for (const name of LOOK_NAMES) {
    const look = LOOKS[name]
    expect(look.problems.filter(line => line.startsWith("Desktop won't paint"))).toEqual([])
    expect(SCENES[name]?.source.length ?? 0).toBeGreaterThan(0)
    expect((SCENES[name]?.source.length ?? Infinity) < 131072).toBe(true)
  }
})

test('a new session starts on the default look', async ($, on) => {
  const calls = engine(on)

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(calls.sets.length).toBe(1)
  expect(calls.sets[0]?.backdrop).toEqual(LOOKS['starship-hud'].theme.backdrop)
})

test('/scene switches the look and remembers it', async ($, on) => {
  const calls = engine(on)

  const result = await $.command.run({ command: 'scene', args: ' Hacker-Mainframe ', ...RUN })

  expect(result.text).toBe('Theme set to Hacker mainframe.')
  expect(calls.store.get('look')).toBe('hacker-mainframe')
  expect(calls.sets.at(-1)?.backdrop).toEqual(LOOKS['hacker-mainframe'].theme.backdrop)
})

test('/scene with an unknown name changes nothing', async ($, on) => {
  const calls = engine(on, { look: 'arcade' })

  const result = await $.command.run({ command: 'scene', args: 'vaporwave', ...RUN })

  expect(result.text?.startsWith('No theme called "vaporwave".')).toBe(true)
  expect(calls.sets.length).toBe(0)
  expect(calls.store.get('look')).toBe('arcade')
})

test('/scene off clears the theme and the next session stays plain', async ($, on) => {
  const calls = engine(on)

  await $.command.run({ command: 'scene', args: 'off', ...RUN })
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(calls.clears).toBe(1)
  expect(calls.store.get('look')).toBe('off')
  expect(calls.sets.length).toBe(0)
})

test('a remembered look comes back in the next session', async ($, on) => {
  const calls = engine(on, { look: 'lava-lamp' })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(calls.sets[0]?.backdrop).toEqual(LOOKS['lava-lamp'].theme.backdrop)
})

const MINUTE = 60_000

function backdropScene(theme: ThemeSetArgs | undefined): string | undefined {
  const backdrop = theme?.backdrop

  return backdrop !== undefined && 'scene' in backdrop ? backdrop.scene : undefined
}

const START = { cwd: '/', surface: 'desktop', isInteractive: true } as const

test('/scene cycle rotates through every look on the session heartbeat', async ($, on) => {
  const clock = mock.clock(on)
  const calls = engine(on, { look: 'off' })

  await $.session.start(START)
  const result = await $.command.run({ command: 'scene', args: 'cycle', ...RUN })

  expect(result.text).toBe(`Rotating through all ${LOOK_NAMES.length} themes every 5 minutes, starting with Starship HUD.`)
  expect(calls.store.get('look')).toBe('cycle')
  expect(backdropScene(calls.sets.at(-1))).toBe('starship-hud')

  await clock.advance(4 * MINUTE)
  expect(backdropScene(calls.sets.at(-1))).toBe('starship-hud')

  await clock.advance(1 * MINUTE)
  expect(backdropScene(calls.sets.at(-1))).toBe('hacker-mainframe')

  await clock.advance((LOOK_NAMES.length - 1) * 5 * MINUTE)
  expect(backdropScene(calls.sets.at(-1))).toBe('starship-hud')
  expect(calls.sets.map(backdropScene)).toEqual([...LOOK_NAMES, 'starship-hud'])
})

test('/scene cycle takes its own interval and refuses a bad one', async ($, on) => {
  const clock = mock.clock(on)
  const calls = engine(on, { look: 'off' })

  await $.session.start(START)
  const bad = await $.command.run({ command: 'scene', args: 'cycle 0', ...RUN })
  expect(bad.text?.startsWith('Minutes must be a whole number')).toBe(true)
  expect(calls.sets.length).toBe(0)

  await $.command.run({ command: 'scene', args: 'cycle 10', ...RUN })
  await clock.advance(5 * MINUTE)
  expect(calls.sets.length).toBe(1)
  await clock.advance(5 * MINUTE)
  expect(calls.sets.length).toBe(2)
  expect(calls.store.get('cycle-minutes')).toBe(10)
})

test('picking one look stops the rotation', async ($, on) => {
  const clock = mock.clock(on)
  const calls = engine(on, { look: 'off' })

  await $.session.start(START)
  await $.command.run({ command: 'scene', args: 'cycle', ...RUN })
  await $.command.run({ command: 'scene', args: 'arcade', ...RUN })
  const setsAfterPick = calls.sets.length

  await clock.advance(30 * MINUTE)
  expect(calls.sets.length).toBe(setsAfterPick)
  expect(backdropScene(calls.sets.at(-1))).toBe('arcade')
})

test('a session started in cycle mode shows the shared look, then follows the rotation', async ($, on) => {
  const clock = mock.clock(on, { now: 2 * MINUTE })
  const calls = engine(on, { look: 'cycle', 'cycle-next': 4, 'cycle-current': 'lava-lamp', 'cycle-at': 0, 'cycle-minutes': 5 })

  await $.session.start(START)
  expect(calls.sets.map(backdropScene)).toEqual(['lava-lamp'])

  await clock.advance(3 * MINUTE)
  expect(backdropScene(calls.sets.at(-1))).toBe('arcade')
})

test('a session follows a switch another session made', async ($, on) => {
  const clock = mock.clock(on)
  const calls = engine(on, { look: 'cycle', 'cycle-next': 1, 'cycle-current': 'starship-hud', 'cycle-at': 0, 'cycle-minutes': 5 })

  await $.session.start(START)
  expect(backdropScene(calls.sets.at(-1))).toBe('starship-hud')

  calls.store.set('cycle-current', 'black-hole')
  calls.store.set('cycle-at', clock.now())
  await clock.advance(30_000)
  expect(backdropScene(calls.sets.at(-1))).toBe('black-hole')
})
