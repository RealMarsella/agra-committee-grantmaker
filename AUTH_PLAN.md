# Auth Plan

Hackathon: Agora Agents Hackathon
Idea: AGRA Committee-Governed Grantmaker
Readiness updated: 2026-05-22 07:18 IST

Auth classification: `web3-auth`

Decision evidence:

- The product asks for an EVM payout wallet and prepares Arc Testnet decision/payment proof.
- The readiness contract requires wallet connect/signature, connected account state, chain/network checks, tx/RPC proof, and a blocked state when wallet/faucet/key is unavailable.
- Regular email/OAuth auth is not the primary security boundary for this demo; applicant intake is public, and payout readiness depends on wallet ownership plus Arc integration status.

| Actor / role                          | Required auth                                                                      | Implementation path                                                                               | Real credential/profile/wallet                                                                                                          | Test proof                                                                                                                                                                            | Status                           | Blocker                                                                                             |
| ------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------- |
| Grant applicant / payout wallet owner | EIP-1193 wallet connect plus `personal_sign` proof on Arc Testnet chain `5042002`  | `src/components/WalletAuthPanel.tsx`, `src/lib/agra/auth.ts`, `src/app/api/auth/wallet/route.ts`  | Browser wallet extension when present; local test key signs for `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` without committing the key | `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` returned `verified: true`, address `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`, chain `5042002` | implemented and API-verified     | Browser E2E environment has no injected wallet, so UI proof shows explicit blocked no-wallet state. |
| Browser applicant without wallet      | Must fail visibly, not fake connection                                             | `WalletAuthPanel` checks `window.ethereum` before requesting accounts                             | No wallet in local Playwright/Chrome fallback run                                                                                       | Public E2E returned `Browser wallet not detected. Install or unlock an EVM wallet...` and still allowed demo committee intake without claiming payout auth                            | blocked-state verified           | Full browser connect/sign proof needs a wallet extension/profile configured.                        |
| Wrong network wallet                  | Must fail visibly or request switch to Arc Testnet                                 | `wallet_switchEthereumChain` to `0x4cef52` before signing; fallback message names chain `5042002` | Wallet extension required                                                                                                               | Code path implemented; not browser-proven because no injected wallet was available                                                                                                    | implemented / not browser-proven | Needs wallet extension profile to exercise wrong-network UI.                                        |
| Committee console / judge viewer      | No login required                                                                  | Public read-only UI and API routes                                                                | None                                                                                                                                    | Public E2E loaded production URL and selected ledger entries; no protected judge action exists                                                                                        | no-auth-required for viewer      | None.                                                                                               |
| Arc write/broadcast operator          | Private-key wallet plus funded Arc Testnet balance and `DECISION_REGISTRY_ADDRESS` | `scripts/replay-demo.ts`, `src/lib/agra/arc.ts`                                                   | `.env.local` has an untracked private key and wallet address; no registry address is set                                                | `npm run arc:check` returned balance `0`, `canBroadcast: false`; `npm run replay` skipped broadcast                                                                                   | integration-blocked              | Circle faucet did not fund wallet; registry not deployed.                                           |

Inventory findings (Kimi readiness run, 2026-05-22 07:33 IST):

- `src/components/WalletAuthPanel.tsx` lines 27-32: `getEthereumProvider()` reads `window.ethereum`; no polyfill or fake provider exists.
- `src/components/WalletAuthPanel.tsx` lines 46-52: explicit `blocked` state when `!ethereum` with message "Browser wallet not detected..."
- `src/components/WalletAuthPanel.tsx` lines 71-85: wrong-chain guard requests `wallet_switchEthereumChain` to `0x4cef52`; if rejected, shows blocked message naming chain `5042002`. Code path verified, not browser-proven.
- No `localStorage` / `sessionStorage` usage found anywhere in `src/`; wallet auth is per-page-load.
- `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` returned `verified: true` on this run.

Rules:

- No dummy login buttons, fake connected wallet state, or simulated sessions are treated as working auth.
- The visible `Connect and sign` action either verifies a real signature or shows a blocked reason.
- The demo committee path remains public, but any payout/auth readiness claim must cite wallet signature proof and Arc funding/deployment status.
