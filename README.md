# scene-themes

Five dark themes with animated backdrops for Claude Code on desktop, switched with one command.

| Theme | Backdrop |
| --- | --- |
| `starship-hud` | A sweeping radar, a turning orbit and ticking telemetry |
| `hacker-mainframe` | Circuit traces with acid-green pulses along the edges |
| `mech-cockpit` | Hazard-striped panels, blinking lights and turning reticles |
| `lava-lamp` | Glowing liquid blobs drifting slowly |
| `arcade` | Pixel sprites and twinkling stars over scanlines |

## Usage

```
/scene <name>             switch to one theme
/scene cycle [minutes]    rotate through all themes (every 5 minutes by default)
/scene off                back to the app's own look
/scene                    show the current theme and the options
```

The last choice is remembered across sessions. Themes draw in local desktop sessions; the terminal keeps its own look. Animations stop when the system asks for reduced motion.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install scene-themes --marketplace MohamedBechirMejri/claude-scene-themes
```

Answer `y` to add the marketplace, then pick a scope (user scope makes it load in every session).

From a shell:

```
claude plugin install scene-themes --marketplace MohamedBechirMejri/claude-scene-themes
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `MohamedBechirMejri/claude-scene-themes`, then Add plugin.

Requires Claude Code 2.1.323 or newer.

## Development

```
claude plugin validate .
claude plugin test .
```
