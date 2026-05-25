# ONE_HOUR_HANDOFF

Session: 2026-05-25 IST · Identity: DarthStormerXII (repo-local git config)

## Goal of the hour

Make AGRA feel like an autonomous capital-allocation product: a polished
landing page (not a dashboard dump), web3 sign-in, and a real Arc
read → simulate → write payout path. Honest fixture/live labels throughout.

## What shipped

1. **Landing page at `/`** (`src/components/landing/LandingPage.tsx`) — the
   console moved to `/console`. Institutional dark/cream aesthetic
   (Instrument Serif + Sora), animated trace-field + breathing radial glow,
   centered serif hero, "committee bench" showing the three agents with
   conflicting mandates flowing into a verdict, a `read → simulate → write`
   settlement explainer, honest testnet disclaimer, CTA band, footer.
2. **Reown AppKit + Wagmi + Viem sign-in** — custom Arc Testnet network,
   cookie-SSR config, themed connect modal, connect/wrong-chain/connected
   states, native USDC balance pill, DiceBear avatar.
3. **Live Arc USDC settlement panel** (`ArcPayoutPanel.tsx`) wired into the
   decision room: live `decimals()`/`balanceOf` reads, live `transfer`
   simulation, write gated on simulation success, full state machine. No
   fabricated tx hashes.

## Docs consulted

- Context7 `/reown-com/appkit` — Next.js App Router wagmi adapter, SSR,
  `defineChain` custom EVM network, `createAppKit`.
- `viem/_esm/chains/definitions/arcTestnet.js` — authoritative Arc chain def
  (id 5042002, native USDC 18-dec, explorer, multicall3).
- TEAM_PROFILE_SETUP.md, EXECUTION_PACKET.md, READINESS_GATE.md, AUTH_PLAN.md.
- Provided template references (Aethera / Prisma / Portal / Celestia). Portal's
  full-viewport cinematic hero + glass treatment informed the hero structure;
  final design reuses the repo's existing institutional token system rather
  than importing template markup.

## Template assets used

- Reused the in-repo `TraceField` canvas (flowing committee-trace lines) as the
  hero background; added a CSS radial glow. No external template files were
  copied verbatim — the aesthetic was adapted to AGRA's existing tokens.

## Auth choice

Reown AppKit + Wagmi + Viem (wallet-native, no email/social custody). Full
rationale + file map in `AUTH_AND_ARC_PLAN.md`.

## Arc integration status

- **Live:** chain reads, transfer simulation, connect/switch on chain 5042002.
- **Blocked from live write:** test wallet unfunded (`balance 0`); UI shows
  simulation + disables live write honestly. Faucet funding is the only blocker
  to a real settlement tx. No fake hashes anywhere.

## Commands run

```
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi @tanstack/react-query  # ok (222 pkgs)
npm run typecheck   # pass
npm test            # 3 passed
npm run build       # pass (Next 16 Turbopack, 6 routes)
npm run arc:check   # live: chainId 5042002, usdcDecimals 6, balance 0
PORT=3003 npm start # landing 200, console 200
# Playwright screenshots @375/768/1440 → /tmp/verify/agra/*.png
```

## Blockers

1. **Circle/Arc faucet funding** for `0x58374c…2b13` (or any connected wallet)
   — required for a real USDC settlement tx and `replay:broadcast`.
2. **`DecisionRegistry` not deployed** — `DECISION_REGISTRY_ADDRESS` unset;
   on-chain decision record stays fixture-labeled.
3. **Build config:** wagmi's optional Tempo connector does `import('accounts')`
   for an uninstalled package; aliased to `src/lib/web3/empty-module.ts` in
   `next.config.ts` (Turbopack `resolveAlias` + webpack alias). Safe — that
   connector is never instantiated.

## Verification proof

`/tmp/verify/agra/{landing,console}-{375,768,1440}.png` — landing and console
render cleanly at all three widths, no overlapping text. Console payout panel
shows the disconnected "connect a wallet to read live balances and simulate"
state (the headless screenshot browser has no injected wallet — correct
honest behavior).

## Next session tasks

1. Fund the Arc test wallet and capture a real settlement tx + Arcscan link to
   replace the simulation-only state in the demo video.
2. Deploy `DecisionRegistry`, set the address, run `npm run replay:broadcast`.
3. Optional: Circle App Kit Bridge / Unified Balance funding UX — only add if
   the docs/env support a real flow (do not stub it).
4. Team/repo: if AGRA is submitted under Marsella, create a fresh public repo in
   a verified Marsella session and import as a current handoff (no backdating,
   no history rewrite). This session committed honestly as DarthStormerXII.
5. Pushing to the public repo + submission-form clicks remain for Gabriel's
   approval (irreversible submission actions).
