# Truth Audit

Hackathon: Agora Agents Hackathon
Idea: AGRA Committee-Governed Grantmaker
Hardening updated: 2026-05-22 05:26 IST

| Claim | Reality: real / fixture / mock / blocked / not attempted / removed | Evidence | User-facing label needed? | Action |
|---|---|---|---|---|
| Product has a working demo path | real | Local app built and started; API POST returned accepted decision; local visual QA clicked submit flow at 375/768/1440; public Vercel URL HTTP 200 and browser expect passed | no, but status must be `demo-ready`, not `submit-ready` | Keep. |
| Product is fully developed / submit-ready | blocked | `QUALITY_GATE.md` has final status `demo-ready`; live Arc write, video, traction, and formal polish are missing/blocked | yes | Do not use "fully developed" or "submit-ready" language. |
| Seeded applications are real applicant traction | fixture | `src/lib/agra/fixtures.ts`; `docs/traction.md` says no external applicants collected | yes | Keep fixtures only as demo examples. |
| User-submitted browser applications are durable production records | fixture / demo | `src/lib/agra/store.ts` is process memory; no database | yes | Label as demo/local intake; do not claim durable public intake. |
| Three-agent committee evaluates grants | real deterministic logic | `src/lib/agra/committee.ts`; `npm test` passed 3 tests; API/browser proof returned decisions | no | Keep, but do not imply remote LLM agents. |
| Arc Testnet integration works | real read-only | `npm run arc:check` returned chain ID `5042002`, USDC decimals `6`, EURC decimals `6` | specify read-only | Claim Arc read proof only. |
| Arc transaction / onchain decision event exists | blocked | Test wallet balance `0`, `canBroadcast: false`; no registry deployment tx; UI now says fixture tx hash is not broadcast | yes | Do not link fake Arcscan tx; keep non-clickable fixture hash. |
| USDC payout was paid/sent | blocked | No funded wallet and no broadcast tx | yes | Use "payout cap" or "prepared payout", not "paid". |
| EURC payment works | blocked / read-only | Decimals read succeeds, but transfer/broadcast not attempted | yes | Keep EURC as gated option only. |
| Paymaster, Gateway, USYC are integrated | removed / not implemented | No app/API code path; sponsor plan labels them optional/future | yes if mentioned | Keep out of submission claims unless proven later. |
| Public repo exists | real | `gh repo view` returned public `gabrielantonyxaviour/agra-committee-grantmaker`; remote origin matches | no | Keep. |
| Public deploy exists | real | Vercel production deployment `dpl_FuyoeN8fSxmgHkNYrrD82d8Aa1pj` READY; canonical URL HTTP 200; browser expect passed title + `Demo intake` | no | Keep as demo URL. |
| Formal `/polish` passed | blocked | M2 SSH timeout; report saved under `~/.playwright-sessions/.reports/2026-05-21T23-47-55-644-agra-hardening-m2-formal-polish-preflight-failed.md` | yes | State `formal-polish-blocked-by-m2`. |
| Local visual QA passed | real fallback | `scripts/local-visual-qa.mjs` passed 375/768/1440 with no overflow/errors and nonblank canvas; screenshots under `outputs/visual-qa-hardening/` | yes | State `local-visual-qa-passed`. |
| Submission form was submitted | not attempted | Builder inventory only; no form prefill/final submit | yes | Do not submit without explicit Gabriel approval and video/traction. |
| Video and traction are ready | blocked | `SUBMISSION_PORTAL_PLAN.md` lists missing video and traction | yes | Collect before final submission. |
