Get Out Of My Lawn — 3D Game

Overview
Get onto the grumpy neighbor’s lawn, harvest grass, sell it at the shady shop, and buy power-ups. Avoid getting kicked off the property. Multiplayer lets friends invade together and compete for profits.

Core Loop
- Sneak or sprint onto the lawn
- Harvest grass to earn grass-currency
- Evade the Get-Off-My-Lawn guy (chases, pushes, stuns)
- Sell grass at the shady shop
- Buy power-ups to harvest faster, carry more, or escape better
- Repeat with escalating risk/reward

Key Features
- Third-person 3D movement and traversal
- Grass harvesting mini-loop with capacity and sell points
- Shady shop with power-ups and upgrades
- Reactive NPC: Get-Off-My-Lawn guy with patrol/chase
- Multiplayer: shared lawn, synced grass, friendly competition

Target Scope (MVP)
- One lawn map, one NPC, 3–5 power-ups, up to 4 players
- Simple HUD (grass carried, cash, stamina), minimal VFX/SFX

Next Steps
1) Confirm engine: Unity (Humanoid/Netcode), Godot (4.x), or Unreal (5.x)
2) Initialize project and import placeholder assets
3) Prototype movement + camera, grass collection, and sell loop
4) Add shop UI + power-ups, then basic multiplayer

Development Guide
- Requirements: Godot 4.2.x, Node 18+, npm.
- Godot gameplay: open the repo folder in Godot and play `res://scenes/Main.tscn`.
- Local web preview: `npm install`, then `npm run dev` to start the dev workflow (auto Web export + Express server + browser launch on http://localhost:5173).
- Configure Godot CLI: set the environment variable `GODOT_BIN` to your Godot executable (e.g. `/Applications/Godot.app/Contents/MacOS/Godot`) so the auto-export watcher can invoke it headlessly.
- The watcher triggers an export on start and on edits to `scenes/`, `scripts/`, or `project.godot`; no manual export steps required once Godot CLI is set.
- After configuring export templates once in the Godot GUI, you can close it; ongoing exports are handled by the CLI watcher.
- If exports fail, reopen Godot GUI once to install/verify the 4.2.x Web export templates (Project → Export → Install Export Templates…).

Web Export & GitHub Pages
- Web preset exports to `docs/index.html` plus companion `.js`, `.pck`, `.wasm`; GitHub Pages can serve directly from the `docs/` folder (Pages → Source: main /docs).
- Threads are disabled in the preset to satisfy GitHub Pages (no COOP/COEP headers).
- CI workflow `.github/workflows/deploy-pages.yml` downloads Godot headless 4.2.2, exports the Web build, and publishes to GitHub Pages.
- Manual export: in Godot choose Export → Web → `docs/index.html`; commit the updated `docs/` contents for a live update if not using CI.

