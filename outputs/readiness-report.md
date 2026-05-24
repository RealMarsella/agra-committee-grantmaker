# AGRA Readiness Report

Date: 2026-05-22 07:18 IST

Final readiness status: `integration-blocked`

## Summary

AGRA is ready for serious local and public browser testing of the product loop: public grant intake, deterministic committee decisioning, wallet-auth API verification, explicit no-wallet blocked UI, invalid-input failure path, replay proof, Arc RPC read proof, and production visual fallback QA. It is not `testing-ready` because the core live Arc write/payment integration remains blocked by an unfunded Arc Testnet wallet and no deployed `DecisionRegistry`.

Production URL: `https://agra-committee-grantmaker.vercel.app`

Deployment: `dpl_5eW45MpBgNfWMVpACCHA5u4PXjdf`

## Auth Implementation And Proof

Auth decision: `web3-auth`.

Implemented:

- `src/lib/agra/auth.ts` builds the wallet-auth message and Arc Testnet chain constants.
- `src/app/api/auth/wallet/route.ts` verifies EVM signatures with `viem.verifyMessage`.
- `src/components/WalletAuthPanel.tsx` performs EIP-1193 wallet detection, account request, Arc Testnet chain check/switch, `personal_sign`, and server verification.
- No dummy connected state remains: no wallet extension shows a clear blocked message.

Proof:

```bash
AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check
```

Result: `verified: true`, address `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`, chain ID `5042002`.

Browser blocked-state proof:

```bash
AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app AGRA_QA_OUTPUT_DIR=outputs/readiness-e2e-public env -u PLAYWRIGHT_CLI_REMOTE npm run e2e:readiness
```

Result: `Connect and sign` returned `Browser wallet not detected...` in the local fallback browser instead of faking connection.

## E2E Tests Added And Run

Added:

- `scripts/wallet-auth-smoke.ts`
- `scripts/readiness-e2e.mjs`
- `npm run wallet:auth:check`
- `npm run e2e:readiness`

Primary public E2E:

```bash
AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app AGRA_QA_OUTPUT_DIR=outputs/readiness-e2e-public env -u PLAYWRIGHT_CLI_REMOTE npm run e2e:readiness
```

Covered:

- page load
- no-wallet auth blocked state
- invalid wallet failure path with expected HTTP 400
- valid grant submission
- decision room update
- `/api/replay` integration proof
- visible action inventory

Screenshot: `outputs/readiness-e2e-public/readiness-primary-flow.png`

Local verified-build E2E also passed against `http://localhost:3004` with screenshot `outputs/readiness-e2e/readiness-primary-flow.png`.

## Live Integrations Proven

- Public Vercel deployment at `https://agra-committee-grantmaker.vercel.app`.
- Public wallet-auth API signature verification.
- Arc Testnet RPC read access.
- Arc chain ID `5042002`.
- Arc USDC decimals `6`.
- Arc EURC decimals `6`.
- Deterministic replay and encoded `recordDecision` calldata.
- Local `DecisionRegistry` contract behavior via Foundry tests.
- Public GitHub repo: `https://github.com/gabrielantonyxaviour/agra-committee-grantmaker`.

## Blocked Integrations And Self-Service Evidence

Arc write/payment remains blocked.

Commands/evidence:

```bash
npm run arc:check
```

Result: wallet `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`, native USDC gas balance `0`, `canBroadcast: false`.

```bash
npm run replay
```

Result: canonical accepted decision replayed, proof status `fixture`, broadcast skipped.

Self-service faucet attempt:

- Used `agent-browser --profile "Default"` on `https://faucet.circle.com`.
- Selected Arc Testnet USDC.
- Entered `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`.
- Clicked `Send 20 USDC`.
- Captured `outputs/faucet-readiness-attempt.png`.
- Re-ran `npm run arc:check`; balance stayed `0`, `canBroadcast: false`.

No CAPTCHA bypass, billing mutation, legal attestation, or final submission was attempted.

## Dummy/Mock Removals And Action Audit

Added a real wallet-auth path and removed the last major dummy-auth gap. The visible `Connect and sign` button now either verifies a real signature or shows a blocked reason.

Public E2E action inventory found:

- `AAGRA` navigates to `#top`.
- `Proof path` navigates to `#proof`.
- `Currency` selects USDC/EURC, with EURC labeled as requiring live proof.
- `Connect and sign` performs wallet detection/signing or blocked-state handling.
- `Run committee` calls `/api/applications`.
- Ledger buttons select application records.

Fixture Arc transaction hashes remain non-clickable and labeled as not broadcast.

## Checks Run

| Command                                                                              | Result                                                           |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `npm run typecheck`                                                                  | passed                                                           |
| `npm test`                                                                           | passed: 1 file, 3 tests                                          |
| `npm run lint`                                                                       | passed                                                           |
| `npm run build`                                                                      | passed                                                           |
| `forge test`                                                                         | passed: 2 Solidity tests                                         |
| `npm audit --audit-level=high`                                                       | high gate passed; moderate PostCSS advisory remains through Next |
| `npm run arc:check`                                                                  | read proof passed; write blocked by zero balance                 |
| `npm run replay`                                                                     | passed; broadcast skipped                                        |
| `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` | passed                                                           |
| public `npm run e2e:readiness`                                                       | passed with local fallback browser                               |
| public local visual QA fallback                                                      | passed at 375/768/1440                                           |
| `npx vercel deploy --prod --yes`                                                     | passed; deployment READY and aliased                             |

## Screenshots

- `outputs/readiness-e2e-public/readiness-primary-flow.png`
- `outputs/readiness-e2e/readiness-primary-flow.png`
- `outputs/visual-qa-readiness-public/hardening-home-375.png`
- `outputs/visual-qa-readiness-public/hardening-after-submit-375.png`
- `outputs/visual-qa-readiness-public/hardening-home-768.png`
- `outputs/visual-qa-readiness-public/hardening-after-submit-768.png`
- `outputs/visual-qa-readiness-public/hardening-home-1440.png`
- `outputs/visual-qa-readiness-public/hardening-after-submit-1440.png`
- `outputs/faucet-readiness-attempt.png`

Formal M2 `/polish`: blocked. `npx playwright-cli-sessions@latest browser start` failed with SSH timeout to `100.115.214.82:22`.

CLI report: `~/.playwright-sessions/.reports/2026-05-22T01-42-50-540-agra-readiness-m2-preflight-failed-playwright-cl.md`

## Next Actions

1. Fund `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` on Arc Testnet.
2. Deploy `DecisionRegistry`, set `DECISION_REGISTRY_ADDRESS`, and run `npm run replay:broadcast`.
3. Verify a real Arc transaction/explorer URL before adding any live tx claim.
4. Run browser connect/sign proof with a wallet-extension profile on Arc Testnet.
5. Rerun formal `/polish` when `m2worker` SSH is reachable.
6. Record/upload the demo video and collect or honestly mark traction answers.
7. Commit/push readiness changes if the repo should mirror this execution state.
