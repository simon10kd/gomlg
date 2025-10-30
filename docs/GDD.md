Title: Get Out Of My Lawn — Game Design Doc (Draft)

High Concept
Arcade stealth-harvest game. Players trespass onto a cranky neighbor’s lawn to harvest grass, sell it at a shady shop, and buy power-ups to harvest faster and survive longer. Supports drop-in multiplayer.

Player Fantasy
Be a mischievous invader who min-maxes routes and upgrades to outsmart the lawn’s guardian and farm profits.

Core Loop
1) Enter lawn (risk begins)
2) Harvest grass (fill capacity; risk increases)
3) Evade NPC and hazards
4) Cash out at shop
5) Buy power-ups; repeat for bigger hauls

Primary Systems
- Movement & Camera: Third-person, sprint, stamina, crouch (stealth noise)
- Harvesting: Target grass patches; hold action to collect; capacity-limited
- Currency: Grass -> sell value -> cash; prices may fluctuate (optional)
- Shop & Power-Ups: Movement, harvesting, evasion, detection-reduction upgrades
- NPC (Lawn Guy): Patrol, detect (vision/noise), chase, shove-off boundary
- Multiplayer: Up to 4, shared resources, collision, anti-griefing timers
- Progression: Unlock higher-tier power-ups after milestones

Power-Up Examples (MVP)
- Sturdy Shears: +Harvest speed
- Bigger Bag: +Capacity
- Quiet Sneakers: -Noise, -Detection radius
- Energy Drink: +Sprint speed / +Stamina regen
- Smoke Bomb: Short stun/slow on NPC, limited charges

NPC Design (MVP)
- States: Idle/Patrol -> Alert -> Chase -> Reset
- Detection: FOV cone + noise radius (scaled by player movement)
- Behavior: Predictive chase with short burst; if player crosses boundary, chase ends

Map & Level
- Single suburban lawn: house front, flower beds, fence boundary, 1–2 sell points
- Grass patches with varying density; rare high-yield patches deeper inside

UI/HUD
- Display carried grass, cash, stamina, and detection hint (meter or vignette)
- Shop screen with simple list and upgrade tiers

Multiplayer Notes
- Authority: Host-authoritative (P2P) or server-authoritative (dedicated)
- Sync: Player transforms, carried grass, patch depletion, shop purchases
- Anti-exploit: Rate-limit sell; reconcile patch ownership

Technical Targets (to confirm)
- Engine: Unity (2022/2023 LTS with Netcode for GameObjects), Godot 4.x, or Unreal 5.x
- Platforms: macOS + Windows (MVP), optional WebGL if engine supports

Art & Audio (Placeholder First)
- Low-poly props, simple grass cards, basic footstep/bush rustle SFX

Milestones
M1: Movement + Camera + Lawn blockout
M2: Harvesting + Currency + Shop
M3: NPC Patrol/Chase + Balancing
M4: Multiplayer sync + First Playtest

Risks
- Multiplayer complexity; choose engine with stable netcode
- AI pathfinding around dense props
- Performance with many interactive patches

Definition of Done (MVP)
- 15-minute loop that’s fun with 1–4 players; stable 60 FPS; builds for macOS/Windows


