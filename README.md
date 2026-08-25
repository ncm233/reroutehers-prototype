# ReRouteHer — Iteration 1 Interactive Prototype

A framework-free, single-file HTML/CSS/JS click-through prototype for **ReRouteHer**, a career re-entry platform helping Malaysian mothers returning to work after a career break turn their experience into modern, AI-era workforce readiness.

**Live prototype:** [ReRouteHer — Skill Readiness Journey](https://prototype.curl.my/)

## Scope

Covers Iteration 1 only — Epics E1–E4 (Public Landing & Guest Entry, Career Break Profile & Context, Skill Snapshot & Career Reframing, Role Readiness & Skill Gap), built against the project's Epics & User Stories + Acceptance Criteria document. Guest-only by design: no accounts exist yet, since User Management (E5) is Iteration 2 scope.

Highlights:
- Progressive-disclosure intake (CV upload with real validation, a life-timeline widget, a 4-category preference accordion) instead of one long form
- A live-updating readiness gauge and a merged, capped-to-3, positively-framed skill-gap list per target role — never AI-only unless the role's real gap is AI-specific
- Snapshot screen with honest empty-states and a confidence badge, computed from what the user actually entered — nothing is fabricated
- Guest session + in-progress answers persisted to `localStorage` ("Save & Continue Later")
- Full GSAP + ScrollTrigger motion layer: masked headline reveals, staggered content entrances, scroll-driven reveals and parallax on the landing page, and real exit/enter transitions between screens — all gated behind `prefers-reduced-motion`

## Structure

```
assemble-app.mjs   # Node build script — generates site/index.html from the templates + tokens below
_merged.css        # Shared design tokens / component styles (colors, type, glass cards, stepper, chips, …)
site/index.html    # The built, deployable static site (served via static host or Docker)
server.mjs         # Zero-dependency Node HTTP server that serves site/ (used by the Docker image)
Dockerfile         # Multi-stage: builds site/index.html from source, then runs server.mjs
```

## Build

No dependencies beyond Node.js (the script only uses the `fs` built-in):

```bash
node assemble-app.mjs
```

Regenerates `site/index.html`. Deploy `site/` as-is to any static host, or run it dynamically with `node server.mjs` / Docker (below).

## Run with Docker

The image rebuilds `site/index.html` from source at *image build time* (not from a pre-committed static file) and serves it through a small running Node server rather than a static file host — so `docker build` always reflects the current `assemble-app.mjs` + `_merged.css`.

```bash
docker build -t reroutehers-prototype .
docker run --rm -p 3000:3000 reroutehers-prototype
# → http://localhost:3000
```

Override the port with `-e PORT=8080 -p 8080:8080`.

## Stack

Plain HTML/CSS/vanilla JS, no build tooling or framework. Motion via [GSAP](https://gsap.com/) + ScrollTrigger (loaded from a CDN in `site/index.html`). Fonts: Bricolage Grotesque (display) + Plus Jakarta Sans (UI), via Google Fonts.
