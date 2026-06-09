# MayTiger.github.io

Personal portfolio site hosted on GitHub Pages. Built with plain HTML, CSS, and JavaScript — no frameworks or build tools.

## Concept

PS2-inspired aesthetic with a boot sequence, scanline effects, and a persistent audio experience. Navigation happens inside a shell `iframe` so background music never reloads between pages.

## Structure

```
index.html          — shell: boot screen, loader, iframe container, audio elements
menu.html           — main navigation
about.html          — bio, photo carousel, skills, CV download
experience.html     — SolarEdge work experience detail
projects.html       — project list
plugins.html        — plugin list
music.html          — music page with PS2 player and Web Audio visualizer
project-*.html      — individual project pages
plugin-*.html       — individual plugin pages
styles.css          — all styles, per-section color theming
scripts.js          — navigation, audio player, video sync, scroll animations
```

## Features

- **Iframe navigation** — pages swap inside a fixed shell; `bgMusic` never unloads
- **Per-section color identity** — each section has its own accent color applied to headings, buttons, tags, and UI controls
- **PS2 audio player** — custom scrubbar, time display, and volume control
- **Web Audio visualizer** — real-time frequency bars on the music page
- **Scroll animations** — Intersection Observer fades in cards and metrics as they enter the viewport
- **Custom cursor** — SVG crosshair that changes on hover

## Deployment

Deployed automatically via GitHub Actions on every push to `main`. See [`.github/workflows/static.yml`](.github/workflows/static.yml).
