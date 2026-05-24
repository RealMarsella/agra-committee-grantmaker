# Readiness Gate

Hackathon: Agora Agents Hackathon
Idea: AGRA Committee-Governed Grantmaker
Readiness updated: 2026-05-22 07:18 IST

Final readiness status: `integration-blocked`

| Gate                                   | Evidence                                                                                                                                                                                                                                              | Status                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Auth classified                        | `AUTH_PLAN.md` classifies AGRA as `web3-auth` because wallet ownership and Arc payout proof are core product claims                                                                                                                                   | passed                               |
| Auth implemented and verified          | Wallet message builder, UI connect/sign panel, and `/api/auth/wallet` verification endpoint added; `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` returned `verified: true` on Arc chain `5042002`              | passed API proof                     |
| Browser auth blocked state             | Public E2E clicked `Connect and sign`; no injected wallet existed, so UI showed `Browser wallet not detected...` instead of a fake connected state                                                                                                    | passed blocked-state proof           |
| Primary E2E test                       | Public production E2E passed via `outputs/readiness-e2e-public/readiness-primary-flow.png`; local build E2E also passed via `outputs/readiness-e2e/readiness-primary-flow.png`                                                                        | passed                               |
| Failure path E2E                       | Public E2E invalid wallet submission produced expected HTTP 400; malformed JSON curl returned `Invalid JSON body`                                                                                                                                     | passed                               |
| Integration E2E/smoke                  | `npm run arc:check` proved Arc RPC, USDC decimals, and EURC decimals; `npm run replay` proved deterministic accepted decision and encoded calldata; `forge test` passed                                                                               | passed read-only / write blocked     |
| Arc write / tx proof                   | Test wallet `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` still has native USDC gas balance `0`; `canBroadcast: false`; no `DECISION_REGISTRY_ADDRESS` deployment                                                                                      | blocked                              |
| Missing credential/faucet self-service | Used `agent-browser --profile "Default"` on `https://faucet.circle.com`, selected Arc Testnet USDC, entered wallet, clicked `Send 20 USDC`, captured `outputs/faucet-readiness-attempt.png`; follow-up `npm run arc:check` still returned balance `0` | attempted / blocked                  |
| No dummy buttons / fake actions        | Public E2E enumerated anchors, buttons, select, textareas; every visible action either navigates in-page, submits real API, selects ledger state, or shows wallet blocked reason                                                                      | passed                               |
| No unlabeled mocks/simulations         | Fixture tx hash remains non-clickable and labeled `Fixture tx hash, not broadcast`; `TRUTH_AUDIT.md` updated                                                                                                                                          | passed                               |
| Public repo/deploy                     | `gh repo view` confirmed public repo; `npx vercel deploy --prod --yes` produced READY deployment `dpl_5eW45MpBgNfWMVpACCHA5u4PXjdf`, aliased to `https://agra-committee-grantmaker.vercel.app`                                                        | passed                               |
| Build/test checks                      | `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `forge test` all passed                                                                                                                                                             | passed                               |
| Security/dependency audit              | `npm audit --audit-level=high` exited cleanly for high severity; it reported moderate PostCSS advisory through Next with only a breaking `npm audit fix --force` path                                                                                 | passed high gate / moderate advisory |
| Manual/browser proof                   | M2 formal route failed with SSH timeout; CLI report saved to `~/.playwright-sessions/.reports/2026-05-22T01-42-50-540-agra-readiness-m2-preflight-failed-playwright-cl.md`; local fallback visual QA passed for production at 375/768/1440            | fallback passed / formal blocked     |

Inventory verification (Kimi run, 2026-05-22 07:33 IST):

- `npm run typecheck`, `npm test`, `npm run lint`, `npm run build`, `forge test`, `npm run arc:check`, `npm run replay`, `npm run wallet:auth:check` all re-run and passed on this session.
- `npm audit --audit-level=high` exited cleanly (2 moderate PostCSS advisories remain via Next).
- `rg` scan confirmed no `localStorage` / `sessionStorage`, no dummy auth state, no hidden mock buttons.
- File-level action audit written to `outputs/kimi-readiness-inventory.md` with exact line references for every button, link, form, handler, disabled state, placeholder href, fixture label, and simulation code.

Rationale:

AGRA is ready for serious local/public browser testing of the committee, wallet-auth API, no-wallet blocked state, failure path, Arc read proof, replay, and visual layout. It is not `testing-ready` under the strict contract because the central live Arc write/payment integration is still blocked by the unfunded wallet and missing deployed `DecisionRegistry`.
