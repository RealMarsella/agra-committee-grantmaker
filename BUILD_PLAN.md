# BUILD_PLAN

Date: 2026-05-21

## Stack

- Next.js App Router, TypeScript, Tailwind CSS, React client components where needed.
- `zod` for API boundary validation.
- `viem` for Arc RPC reads and optional tx writes.
- Foundry for the compact Arc decision registry contract and tests.
- Local in-memory demo store for the hackathon walkthrough; no production DB required for MVP.

## Product Scope

AGRA is a working grantmaker console:

1. Submit a micro-grant application.
2. Three autonomous committee agents score it with public rubric weights.
3. The committee returns accepted/rejected/pending, reasons, concerns, and payout cap.
4. The app hashes the trace and shows the Arc proof path.
5. Replay script reproduces the canonical decision for async judges.

## Timeboxed Milestones

- Phase 1: write execution docs, spec, access plan, template plan, and progress log.
- Phase 2: scaffold Next/Foundry project and implement core committee engine.
- Phase 3: build first-screen operating console and local API.
- Phase 4: add Arc read checks, contract, replay script, tests, and honest fixture labeling.
- Phase 5: browser verification, polish pass, repo/submission prep, final report.

## Demo Path

The canonical demo uses three applications: one accepted, one rejected by safety veto, and one pending due to treasury cap. The judge can submit a fourth application in the browser and watch the same committee pipeline run.

## Backend/API Choices

- Keep server storage deliberately small and transparent.
- Do not introduce Supabase/Postgres until the demo needs durable public intake.
- Arc proof is the source of truth for onchain claims; app state is just presentation.

## UI Direction

Borrow the rounded, clipped dashboard hero from Gabriel's templates catalog, but make the product screen an operating console rather than a landing page. The first viewport must make the judge understand: "the agent evaluated this grant and can prove its decision."

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run arc:check`
- `forge test`
- Local browser screenshots at three widths; full `/polish` if the M2 Playwright route is available.
