# AGRA Hardening Report

Date: 2026-05-22 05:26 IST

Final status: `demo-ready`

## Summary

AGRA now has a hardened local and public demo path: grant intake, deterministic three-agent committee scoring, trace/replay output, Arc read proof, local contract tests, and browser proof at 375/768/1440. It is not `submit-ready` because live Arc write/payment proof is blocked by an unfunded test wallet and Circle faucet challenge, formal M2 `/polish` is blocked, and the submission still needs video plus real traction answers.

## Changes Made

- Replaced fake-live UI language: `Live intake` is now `Demo intake`, and the hero says AGRA prepares Arc payouts instead of implying payment was sent.
- Removed the clickable fixture Arcscan link for fake tx hashes. Fixture proof now renders as a non-clickable `Fixture tx hash, not broadcast` panel.
- Hardened `POST /api/applications` so malformed JSON returns HTTP 400 instead of an unhandled server error.
- Fixed the ambient canvas so it renders a nonblank static frame before animation, including reduced-motion/headless browser conditions.
- Added `public/icon.svg` and metadata icon wiring to remove the favicon 404 seen during browser QA.
- Added repeatable local visual proof script: `scripts/local-visual-qa.mjs`.
- Updated `FEATURE_MATRIX.md`, `INTEGRATION_MATRIX.md`, `TRUTH_AUDIT.md`, `QUALITY_GATE.md`, `STATE.json`, and demo/source docs with honest fixture and blocker language.
- Redeployed production to Vercel: `dpl_FuyoeN8fSxmgHkNYrrD82d8Aa1pj`, aliased to `https://agra-committee-grantmaker.vercel.app`.

## Checks Run

| Check | Result |
|---|---|
| `npm run typecheck` | passed |
| `npm test` | passed: 1 file, 3 tests |
| `npm run lint` | passed |
| `npm run build` | passed |
| `forge test` | passed: 2 Solidity tests |
| `npm run arc:check` | passed read checks; chain ID `5042002`, USDC decimals `6`, EURC decimals `6`, wallet balance `0`, `canBroadcast: false` |
| `npm run replay` | passed; canonical accepted decision replayed, broadcast skipped, proof status `fixture` |
| `GET /api/applications` | passed; returned 3 seeded applications with pending/rejected/accepted statuses |
| `POST /api/applications` | passed; returned accepted fixture decision for hardening API input |
| malformed `POST /api/applications` | passed; HTTP 400 `Invalid JSON body` |
| `POST /api/replay` | passed; returned canonical accepted fixture proof |
| Vercel deploy | passed; production READY and canonical alias updated |
| Public smoke | passed; canonical URL HTTP 200 and browser expect found title plus `Demo intake` |

## Visual Proof

Formal M2 `/polish`: blocked. `PLAYWRIGHT_CLI_REMOTE=m2worker` was set, but `npx playwright-cli-sessions@latest browser start` failed because SSH to `100.115.214.82:22` timed out. CLI report:

`/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-21T23-47-55-644-agra-hardening-m2-formal-polish-preflight-failed.md`

Local fallback visual QA: passed. Command:

```bash
env -u PLAYWRIGHT_CLI_REMOTE npx playwright-cli-sessions@latest exec scripts/local-visual-qa.mjs --channel=chrome
```

Evidence:

- `outputs/visual-qa-hardening/hardening-home-375.png`
- `outputs/visual-qa-hardening/hardening-after-submit-375.png`
- `outputs/visual-qa-hardening/hardening-home-768.png`
- `outputs/visual-qa-hardening/hardening-after-submit-768.png`
- `outputs/visual-qa-hardening/hardening-home-1440.png`
- `outputs/visual-qa-hardening/hardening-after-submit-1440.png`

Results: no horizontal overflow at any width, no browser/page errors after fixes, primary submit flow completed at all widths, and the canvas rendered nonblank.

Visual status: `local-visual-qa-passed; formal-polish-blocked-by-m2`.

## Real Integrations Proven

- Arc Testnet public RPC read access.
- Arc USDC and EURC ERC-20 decimal reads.
- Public Vercel deployment.
- Public GitHub repo from prior builder state: `https://github.com/gabrielantonyxaviour/agra-committee-grantmaker`.
- Local Foundry contract behavior for `DecisionRegistry`.
- Local/API replay path and encoded contract calldata.

## Fixtures And Mocks

- Seeded applications in `src/lib/agra/fixtures.ts` are fixture/demo data, not real traction.
- The grant intake store is in-memory process state, not durable public intake.
- Fixture tx hashes are demo values only. The UI now labels them as not broadcast and does not link to Arcscan.
- EURC is read-verified and represented as a gated option, but no EURC transfer is proven.
- Paymaster, Gateway, and USYC are not implemented and should not be claimed as live.

## Blockers

1. Circle faucet remains blocked by unusual-traffic / verification challenge from the builder run.
2. Test wallet `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` has native USDC gas balance `0`, so `canBroadcast` is `false`.
3. `DecisionRegistry` is not deployed to Arc Testnet and no `DecisionRecorded` transaction exists.
4. Formal M2 `/polish` cannot run while `m2worker` SSH times out.
5. Required submission video URL is missing.
6. Real traction count/quotes are missing.
7. No Google Form final submission was attempted or approved.

## Exact Next Actions

1. Fund `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` on Arc Testnet or clear the Circle faucet challenge.
2. Deploy `DecisionRegistry`, set `DECISION_REGISTRY_ADDRESS`, and run `npm run replay:broadcast`.
3. Add the real tx hash/explorer URL to the UI/docs only after broadcast proof exists.
4. Record and upload the sub-3-minute demo video.
5. Collect real tester/applicant traction answers, or explicitly submit as zero traction.
6. Rerun formal `/polish` when `m2worker` is reachable.
7. Fill the Google Form draft fields through browser automation and stop before final submit until Gabriel explicitly approves final submission.
