# Quality Gate

Hackathon: Agora Agents Hackathon
Idea: AGRA Committee-Governed Grantmaker
Readiness updated: 2026-05-22 07:18 IST

Final status: `integration-blocked`

| Gate                                | Evidence                                                                                                                                                                                                                          | Status                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Unit/type/build checks              | `npm run typecheck` passed; `npm test` passed 1 file / 3 tests; `npm run lint` passed; `npm run build` passed                                                                                                                     | passed                                 |
| Contract checks                     | `forge test` passed 2 Solidity tests for `DecisionRegistry`                                                                                                                                                                       | passed                                 |
| Auth checks                         | `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` returned verified wallet signature for chain `5042002`; browser E2E verified no-wallet blocked state                                         | passed API proof / blocked-state proof |
| Integration/API/RPC smoke checks    | `npm run arc:check` returned chain ID `5042002`, USDC decimals `6`, EURC decimals `6`, wallet balance `0`, `canBroadcast: false`; `npm run replay` returned canonical accepted decision and fixture proof; curl verified app APIs | passed read-only / live-write-blocked  |
| Browser proof for primary flow      | Public E2E saved `outputs/readiness-e2e-public/readiness-primary-flow.png` and covered wallet blocked state, invalid application failure, valid grant submit, replay API, and visible action enumeration                          | passed                                 |
| Local visual QA at 375 / 768 / 1440 | Production fallback visual QA saved screenshots under `outputs/visual-qa-readiness-public/`; no horizontal overflow; no browser errors; canvas nonblank                                                                           | local-visual-qa-passed                 |
| Formal /polish                      | M2 route attempted; `npx playwright-cli-sessions@latest browser start` failed with SSH timeout to `100.115.214.82:22`; CLI report saved                                                                                           | formal-polish-blocked-by-m2            |
| Public deploy smoke                 | `npx vercel deploy --prod --yes` produced READY deployment `dpl_5eW45MpBgNfWMVpACCHA5u4PXjdf`, aliased to `https://agra-committee-grantmaker.vercel.app`; HTTP 200; public E2E passed                                             | passed                                 |
| Hidden mock/fake claim audit        | `TRUTH_AUDIT.md` updated; fixture Arc tx remains non-clickable and labeled; wallet connect does not fake state                                                                                                                    | passed                                 |
| Security/dependency audit           | `npm audit --audit-level=high` returned no high/critical failure; moderate PostCSS advisory remains via Next with breaking `npm audit fix --force` path                                                                           | passed high gate / moderate advisory   |
| Repo/submission readiness           | GitHub repo public; Google Form not touched; no final submission or legal attestation touched                                                                                                                                     | blocked-for-submit                     |

## Final Status Rationale

`integration-blocked`: AGRA is ready for serious local and public browser testing of the product flow, wallet-auth API, blocked no-wallet state, API failure path, replay, Arc read proof, and visual layout. It is not `testing-ready` under the strict readiness contract because the live Arc write/payment path is still blocked by the unfunded test wallet and missing deployed `DecisionRegistry`.
