import type { ThemeBackdropGlass, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

type Seeds = {
  label: string
  /** Hex anchors for the dark palette, darkest surface first. */
  surfaces: { s0: string; s1: string; s2: string; s3: string }
  text: { primary: string; secondary: string; muted: string }
  roles: { accent: string; danger: string; success: string; warning: string; pro: string }
  glass: ThemeBackdropGlass
}

type Look = {
  label: string
  theme: ThemeSetArgs
  /** Contrast and paint warnings from `makeColors`, shown while developing. */
  problems: string[]
}

/** Builds a dark-only look whose backdrop is the scene of the same name. */
function defineLook(scene: string, seeds: Seeds): Look {
  const { theme, problems } = makeColors({
    label: seeds.label,
    only: 'dark',
    roles: seeds.roles,
    dark: {
      gray: {
        anchors: {
          'surface-0': seeds.surfaces.s0,
          'surface-1': seeds.surfaces.s1,
          'surface-2': seeds.surfaces.s2,
          'surface-3': seeds.surfaces.s3,
          'text-primary': seeds.text.primary,
          'text-secondary': seeds.text.secondary,
          'text-muted': seeds.text.muted,
        },
      },
    },
  })

  return {
    label: seeds.label,
    problems,
    theme: { colors: theme, backdrop: { scene, glass: seeds.glass }, overrideColorScheme: 'dark' },
  }
}

export const LOOKS = {
  'starship-hud': defineLook('starship-hud', {
    label: 'Starship HUD',
    surfaces: { s0: '#06121a', s1: '#0a1922', s2: '#0d1f2a', s3: '#122733' },
    text: { primary: '#e3f6ff', secondary: '#a9c8d6', muted: '#86a7b6' },
    roles: { accent: '#22d3ee', danger: '#f2555a', success: '#3ddc97', warning: '#f5b84a', pro: '#8b7cf6' },
    glass: { blur: 18, tint: '#06121a', opacity: 0.62 },
  }),
  'hacker-mainframe': defineLook('hacker-mainframe', {
    label: 'Hacker mainframe',
    surfaces: { s0: '#050a07', s1: '#08110b', s2: '#0b160f', s3: '#0f1d14' },
    text: { primary: '#e2f5e6', secondary: '#a8c7b0', muted: '#86a58f' },
    roles: { accent: '#a3ff12', danger: '#ff5f56', success: '#4ade80', warning: '#f5c542', pro: '#b388ff' },
    glass: { blur: 16, tint: '#050a07', opacity: 0.66 },
  }),
  'mech-cockpit': defineLook('mech-cockpit', {
    label: 'Mech cockpit',
    surfaces: { s0: '#0e0f11', s1: '#15171a', s2: '#1b1e22', s3: '#22262b' },
    text: { primary: '#eef0f2', secondary: '#b9bec5', muted: '#959ba3' },
    roles: { accent: '#ff7a1a', danger: '#ff4d4d', success: '#5fd068', warning: '#ffc233', pro: '#9c8cff' },
    glass: { blur: 14, tint: '#0e0f11', opacity: 0.6 },
  }),
  'lava-lamp': defineLook('lava-lamp', {
    label: 'Lava lamp',
    surfaces: { s0: '#140812', s1: '#1b0c18', s2: '#22101e', s3: '#2a1425' },
    text: { primary: '#fdeef8', secondary: '#d9bccd', muted: '#b998ab' },
    roles: { accent: '#ff3d9a', danger: '#ff5a4f', success: '#5ee08a', warning: '#ffb020', pro: '#a78bfa' },
    glass: { blur: 28, tint: '#140812', opacity: 0.6 },
  }),
  arcade: defineLook('arcade', {
    label: 'Arcade',
    surfaces: { s0: '#120a0a', s1: '#1a0f0e', s2: '#211412', s3: '#291916' },
    text: { primary: '#fff3e3', secondary: '#dcc7ad', muted: '#b9a48b' },
    roles: { accent: '#ffd60a', danger: '#ff5470', success: '#6ee86e', warning: '#ff9f1c', pro: '#c084fc' },
    glass: { blur: 12, tint: '#120a0a', opacity: 0.64 },
  }),
} satisfies Record<string, Look>

export type LookName = keyof typeof LOOKS

export const LOOK_NAMES = Object.keys(LOOKS) as LookName[]

export const DEFAULT_LOOK: LookName = 'starship-hud'

export function isLookName(value: unknown): value is LookName {
  return typeof value === 'string' && Object.hasOwn(LOOKS, value)
}
