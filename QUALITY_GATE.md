# Quality Gate

Hackathon: Agora Agents Hackathon
Idea: AGRA Committee-Governed Grantmaker

Final status: demo-ready

Hardening updated: 2026-05-22 05:26 IST

| Gate | Evidence | Status |
|---|---|---|
| Unit/type/build checks | `npm run typecheck` passed; `npm test` passed 1 file / 3 tests; `npm run lint` passed; `npm run build` passed | passed |
| Contract checks | `forge test` passed 2 Solidity tests for `DecisionRegistry` | passed |
| Integration/API/RPC smoke checks | `npm run arc:check` returned Arc chain ID `5042002`, USDC decimals `6`, EURC decimals `6`, wallet balance `0`, `canBroadcast: false`; `npm run replay` returned canonical accepted decision and fixture proof; curl verified `GET /api/applications`, `POST /api/applications`, `POST /api/replay`, and malformed JSON HTTP 400 | passed-with-live-write-blocked |
| Browser proof for primary flow | `scripts/local-visual-qa.mjs` filled and submitted the grant form at 375, 768, and 1440; screenshots: `outputs/visual-qa-hardening/hardening-after-submit-375.png`, `hardening-after-submit-768.png`, `hardening-after-submit-1440.png` | passed |
| Local visual QA at 375 / 768 / 1440 | `env -u PLAYWRIGHT_CLI_REMOTE npx playwright-cli-sessions@latest exec scripts/local-visual-qa.mjs --channel=chrome`; no horizontal overflow; no browser/page errors; canvas nonblank after hardening fix | local-visual-qa-passed |
| Formal /polish | M2 route attempted; `npx playwright-cli-sessions@latest browser start` failed with SSH timeout to `100.115.214.82:22`; CLI report: `~/.playwright-sessions/.reports/2026-05-21T23-47-55-644-agra-hardening-m2-formal-polish-preflight-failed.md` | formal-polish-blocked-by-m2 |
| Public deploy smoke | `npx vercel deploy --prod --yes` produced READY deployment `dpl_FuyoeN8fSxmgHkNYrrD82d8Aa1pj`, aliased to `https://agra-committee-grantmaker.vercel.app`; `curl -I -L` returned HTTP 200; browser expect passed title and `Demo intake` | passed |
| Hidden mock/fake claim audit | `TRUTH_AUDIT.md` updated; UI relabeled `Live intake` to `Demo intake`; fixture Arc tx is now non-clickable and says `not broadcast`; README/demo docs identify fixture data and blockers | passed |
| Repo/submission readiness | GitHub repo is public; Google Form fields inventoried; no final submission or legal attestation touched | blocked-for-submit |

## Final Status Rationale

`demo-ready`: AGRA has a working local/public demo, deterministic committee flow, API/contract tests, Arc read proof, replay proof, and browser visual proof. It is not `submit-ready` because live Arc write/payment proof is blocked by the unfunded test wallet/faucet challenge, formal M2 `/polish` is blocked, and the submission still needs video plus real traction answers.
