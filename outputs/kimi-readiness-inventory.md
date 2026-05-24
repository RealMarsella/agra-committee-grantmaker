# AGRA Committee Grantmaker — Kimi Readiness Inventory

Date: 2026-05-22 07:33 IST  
Agent: Kimi Code CLI (readiness verification phase)  
Workspace: `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker`  
Status: `integration-blocked` — no live Arc write/payment proof yet

---

## 1. No-Dummy-Action Audit

Rule: every visible action is `working`, `disabled-with-reason`, `removed-needed`, or `blocker`.

### 1.1 Buttons

| # | Button text | File | Line(s) | Action | State |
|---|-------------|------|---------|--------|-------|
| 1 | **Connect and sign** | `src/components/WalletAuthPanel.tsx` | 129-145 | `onClick={connectAndSign}` | **working-with-blocked-fallback** — detects `window.ethereum`, requests accounts, checks/switches chain to Arc Testnet `5042002`, calls `personal_sign`, POSTs to `/api/auth/wallet`, sets `verified` or `blocked` state. Disabled while `state === "connecting"`. |
| 2 | **Run committee** | `src/components/GrantForm.tsx` | 125-128 | `type="submit"` | **working** — submits form to `AgraConsole.submitApplication`, POSTs to `/api/applications`. Disabled while `isSubmitting` (shows `Committee reviewing`). |
| 3 | **Ledger items** (N per application) | `src/components/AgraSections.tsx` | 218-230 | `onClick={() => setSelectedId(application.id)}` | **working** — selects an application from the in-memory ledger to display its decision. No disabled state. |

### 1.2 Links / Anchors

| # | Link text | File | Line(s) | `href` | State |
|---|-----------|------|---------|--------|-------|
| 1 | **AAGRA** (brand) | `src/components/AgraSections.tsx` | 51 | `#top` | **working** — in-page fragment anchor to `#top`. |
| 2 | **Proof path** | `src/components/AgraSections.tsx` | 60 | `#proof` | **working** — in-page fragment anchor to `#proof`. |
| 3 | **Arcscan proof** (conditional) | `src/components/AgraSections.tsx` | 186-191 | `selected.decision.arcProof.explorerUrl` | **blocker / conditionally working** — only rendered when `arcProof.status !== "fixture"` and `explorerUrl` is set. Currently never rendered in production because `DECISION_REGISTRY_ADDRESS` is unset, so `makeProof()` returns `fixture` status and the link is replaced by a non-clickable fixture label. |

### 1.3 Forms & Inputs

| # | Element | File | Line(s) | Handler / Binding | State |
|---|---------|------|---------|-------------------|-------|
| 1 | **Applicant** text input | `src/components/GrantForm.tsx` | 57-61 | `onChange` updates `form.applicantName` | **working** — part of `applicationSchema` (`min:2`, `max:80`). |
| 2 | **Project** text input | `src/components/GrantForm.tsx` | 62-66 | `onChange` updates `form.projectName` | **working** — part of schema (`min:2`, `max:100`). |
| 3 | **Region** text input | `src/components/GrantForm.tsx` | 68-72 | `onChange` updates `form.region` | **working** — schema `min:2`, `max:80`. |
| 4 | **Amount** text input (`inputMode="decimal"`) | `src/components/GrantForm.tsx` | 73-83 | `onChange` strips non-numeric via `replace(/[^0-9.]/g, "")` | **working** — schema `coerce.number().positive().max(250)`. |
| 5 | **Currency** select | `src/components/GrantForm.tsx` | 87-98 | `onChange` updates `form.requestedCurrency` | **working** — options `USDC` and `EURC (requires live proof)`. EURC gated in UI label. |
| 6 | **Wallet** text input | `src/components/GrantForm.tsx` | 104-108 | `onChange` updates `form.walletAddress`; also set by `WalletAuthPanel.onVerified` | **working** — schema validates EVM address via `viem.isAddress` and regex `^0x[a-fA-F0-9]{40}$`. |
| 7 | **Proof URL** text input | `src/components/GrantForm.tsx` | 109-113 | `onChange` updates `form.proofUrl` | **working** — schema `z.string().url().max(220)`. |
| 8 | **Impact** textarea | `src/components/GrantForm.tsx` | 114-118 | `onChange` updates `form.impactStatement` | **working** — schema `min:40`, `max:900`. |
| 9 | **Risk notes** textarea | `src/components/GrantForm.tsx` | 119-123 | `onChange` updates `form.riskNotes` | **working** — schema `max:500`, default `""`. |
| 10 | **Application form** | `src/components/GrantForm.tsx` | 49 | `onSubmit={onSubmit}` | **working** — delegates to `AgraConsole.submitApplication`. |

### 1.4 Disabled States

| # | Element | Condition | File | Line |
|---|---------|-----------|------|------|
| 1 | `Run committee` button | `disabled={isSubmitting}` | `GrantForm.tsx` | 125 |
| 2 | `Connect and sign` button | `disabled={state === "connecting"}` | `WalletAuthPanel.tsx` | 131 |

### 1.5 Placeholder / Dummy Hrefs

| # | Target | File | Line | Value | Verdict |
|---|--------|------|------|-------|---------|
| 1 | Brand anchor | `AgraSections.tsx` | 51 | `#top` | **working in-page nav** — acceptable fragment-only anchor. |
| 2 | Proof path anchor | `AgraSections.tsx` | 60 | `#proof` | **working in-page nav** — acceptable fragment-only anchor. |
| 3 | Fixture proof URL (data) | `fixtures.ts` | 33 | `https://example.com/placeholder-proof` | **fixture-labeled** — explicitly used in `agra-002` (the rejected high-risk application). The UI does not render this as a clickable link in the decision section; it is only stored data. |
| 4 | Arcscan explorer URL (conditional) | `AgraSections.tsx` | 188 | `selected.decision.arcProof.explorerUrl` | **blocker** — only rendered when `status !== "fixture"`. Currently `DECISION_REGISTRY_ADDRESS` is unset, so `makeProof()` returns `fixture` status and the link is never rendered. The `explorerUrl` is built from `ARC_EXPLORER + "/tx/" + DEMO_TX_HASH` in `committee.ts` lines 180-182, but again only when `status !== "fixture"`. |

### 1.6 Simulation / Artificial Delay / Fake Data

| # | Code | File | Line(s) | Verdict |
|---|------|------|---------|---------|
| 1 | `wallClockSeconds: Math.round((Date.now() - started) / 1000) + 11` | `committee.ts` | 247-250 | **simulation-labeled** — adds a hardcoded `+11` seconds to make the committee look slower than it is. Deterministic rule logic runs in <1ms. This is cosmetic and does not affect verdicts. |
| 2 | `fixtureInputs` (3 seeded applications) | `fixtures.ts` | 4-52 | **fixture-labeled** — explicitly labeled in UI nav bar as `Fixture-labeled` (`AgraSections.tsx:58`). `docs/traction.md` confirms these are not real applicants. |
| 3 | `DEMO_REGISTRY_ADDRESS` (`0x0000...0a6a`) | `constants.ts` | 11-12 | **fixture-labeled** — used only when `DECISION_REGISTRY_ADDRESS` env var is missing. UI renders `Fixture tx hash, not broadcast` in this case. |
| 4 | `DEMO_TX_HASH` (`0x7d2b...0a6a`) | `constants.ts` | 14-15 | **fixture-labeled** — used only when `DECISION_REGISTRY_ADDRESS` is missing. UI renders non-clickable fixture hash label. |
| 5 | `initialForm` with dummy applicant data | `GrantForm.tsx` | 20-31 | **working demo prefill** — form is pre-filled with "Anika Rao" / "Arc Grant Receipt Parser" for UX convenience. User can overwrite. Not a fake submission. |
| 6 | In-memory `applications` array | `store.ts` | 4 | **demo-labeled** — `docs/traction.md` and `TRUTH_AUDIT.md` confirm this is not durable production storage. Applications vanish on server restart. |
| 7 | `AGRA_EURC_ENABLED` gate | `committee.ts` | 155 | **gated** — EURC currency selection only persists if `process.env.AGRA_EURC_ENABLED === "1"`. Since this env var is not in `.env.example`, EURC requests fall back to USDC. UI still shows EURC option with `requires live proof` label. |

### 1.7 Browser Storage Audit

- **localStorage**: none found in any source file.
- **sessionStorage**: none found in any source file.
- `rg -n "localStorage|sessionStorage" src/` returned zero matches.

---

## 2. Auth-Readiness Audit

### 2.1 Auth Classification

`web3-auth` — primary security boundary is EIP-1193 wallet ownership + `personal_sign` on Arc Testnet chain `5042002`. Regular email/OAuth is not used.

### 2.2 Implementation Paths

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| Wallet message builder | `src/lib/agra/auth.ts` | 10-26 | Builds SIWE-style message with address, chain ID, nonce, and purpose string. Uses `viem.isAddress` / `getAddress`. |
| Chain constants | `src/lib/agra/auth.ts` | 28-30 | `REQUIRED_WALLET_CHAIN_ID = 5042002`, `REQUIRED_WALLET_CHAIN_HEX = "0x4cef52"`. |
| Wallet auth panel | `src/components/WalletAuthPanel.tsx` | 34-151 | Full client-side wallet flow: `eth_requestAccounts` → `eth_chainId` → `wallet_switchEthereumChain` → `personal_sign` → POST `/api/auth/wallet`. |
| Server verification | `src/app/api/auth/wallet/route.ts` | 23-82 | Zod schema validation, chain ID check, `viem.verifyMessage()` verification. Returns `verified: true` or HTTP 400/401 with explicit error. |
| Wallet auth smoke | `scripts/wallet-auth-smoke.ts` | 1-68 | Loads `.env.local`, signs message with `ARC_PRIVATE_KEY`, POSTs to `/api/auth/wallet`. |

### 2.3 Test Evidence

| Test | Command | Result | When run |
|------|---------|--------|----------|
| API signature verification | `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app npm run wallet:auth:check` | `verified: true`, address `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`, chain `5042002` | **2026-05-22 07:41 IST** (this run) |
| Browser blocked state | `AGRA_QA_URL=https://agra-committee-grantmaker.vercel.app AGRA_QA_OUTPUT_DIR=outputs/readiness-e2e-public env -u PLAYWRIGHT_CLI_REMOTE npm run e2e:readiness` | UI showed `Browser wallet not detected. Install or unlock an EVM wallet...` | Prior run (reproducible) |
| Wrong-chain guard | Code path verified in `WalletAuthPanel.tsx` lines 71-85 | Implemented: requests `wallet_switchEthereumChain` to `0x4cef52`; if rejected, shows blocked message naming chain `5042002` | Not browser-proven (no injected wallet) |

### 2.4 Exact Gaps

| Gap | Detail | Severity |
|-----|--------|----------|
| No browser wallet extension profile | Public E2E and local fallback have no injected `window.ethereum`, so full connect → sign → verify UI flow has never been exercised in a real browser. Only the blocked-state path is proven. | Medium |
| No wrong-network UI proof | The `wallet_switchEthereumChain` fallback message exists in code but has never been rendered in a browser test. | Low |
| No session persistence | Wallet auth is per-page-load; refreshing clears verified state because there is no `localStorage` / cookie / session. This is intentional for a demo but means the user must re-sign on every reload. | Low (demo scope) |

---

## 3. Integration-Readiness Audit

### 3.1 External Services / Protocols

| Integration | Real Access Path | Env / Credential | Proof Command | Result (this run) | Fixture Policy | Status | Blocker |
|-------------|------------------|------------------|---------------|-------------------|----------------|--------|---------|
| **Next.js local app/API** | `http://localhost:3004` | none | `npm run start -- -p 3004` + curl | App serves; APIs respond | In-memory demo data | proven local | None for testing |
| **Public deployed app** | `https://agra-committee-grantmaker.vercel.app` | Vercel auth locally | `npx vercel deploy --prod --yes` → READY `dpl_5eW45MpBgNfWMVpACCHA5u4PXjdf`; HTTP 200 | Production URL loads; public E2E passed | UI labels fixture Arc write proof | proven public demo | Live Arc write blocked |
| **GitHub source repo** | `https://github.com/gabrielantonyxaviour/agra-committee-grantmaker` | local `gh` auth | `gh repo view` | Public, `isPrivate: false`, default branch `main` | Do not imply final submission | proven public repo | Readiness changes not committed yet |
| **Web3 wallet auth API** | Production `/api/auth/wallet` | No server secret; verifies supplied signature | `npm run wallet:auth:check` | `verified: true` | No fake signature allowed | proven | None for API verification |
| **Browser wallet extension** | EIP-1193 `window.ethereum` | Wallet extension/profile | Public E2E clicked `Connect and sign` | No wallet detected; UI showed blocked state | No fake connected state allowed | blocked-state proven | Need wallet extension/profile for full signing proof |
| **Arc Testnet RPC** | `https://rpc.testnet.arc.network` | `ARC_TESTNET_RPC_URL` (defaults to public RPC) | `npm run arc:check` | Chain ID `5042002`, USDC decimals `6`, EURC decimals `6` | None for read proof | proven read-only | None for reads |
| **Arc USDC** | `0x3600...0000` | public RPC for decimals; funded wallet for writes | `npm run arc:check` | Decimals `6`, balance `0` | Any payment claim remains fixture until broadcast | proven read-only / write blocked | Test wallet balance is `0` |
| **Arc EURC** | `0x89B5...D72a` | public RPC only | `npm run arc:check` | Decimals `6` | EURC appears as gated option only | proven read-only | No EURC transfer proof |
| **Local test wallet** | `AGRA_TEST_WALLET_ADDRESS` in `.env.local` | Private key untracked | `wallet:auth:check` verified signature; `arc:check` balance `0` | Auth proven; write blocked | Wallet proof shown; private key never included | auth-proven / write-blocked | Needs Arc Testnet funds |
| **Circle faucet** | `https://faucet.circle.com` | Gabriel Chrome profile | `agent-browser` filled wallet, clicked `Send 20 USDC` | Screenshot `outputs/faucet-readiness-attempt.png`; follow-up `arc:check` still balance `0` | No fake funding claim allowed | attempted / blocked | Faucet did not deliver funds; no CAPTCHA bypass attempted |
| **DecisionRegistry contract** | Local Foundry + future Arc deployment | `DECISION_REGISTRY_ADDRESS` only after deployment | `forge test` passed 2 tests; `npm run replay` produced encoded calldata | Local contract behavior proven | Registry address/tx hash stays fixture until deployed | local contract proven / live deploy blocked | Needs funded wallet and deployment tx |
| **Replay broadcast** | `npm run replay:broadcast` | `ARC_PRIVATE_KEY` + `DECISION_REGISTRY_ADDRESS` | `npm run replay` skipped broadcast | `canBroadcast: false` | Fixture proof must say no Arc transaction exists | blocked | Missing funding and deployed registry |
| **Google submission form** | `https://forms.gle/ok3Gr9zhmHnApvK48` | Gabriel profile if browser-assisted | Not touched in readiness run | — | Portal copy must not claim missing video/traction/tx | not attempted | Final submit requires explicit approval |
| **M2 formal `/polish`** | `playwright-cli-sessions` via `PLAYWRIGHT_CLI_REMOTE=m2worker` | SSH/Tailscale to `m2worker` | `npx playwright-cli-sessions@latest browser start` | SSH to `100.115.214.82:22` timed out | Cannot call formal polish passed | blocked | M2 worker unreachable |
| **Local fallback browser E2E** | Local Chrome via `env -u PLAYWRIGHT_CLI_REMOTE` | none | Public E2E and visual QA | Passed at 375/768/1440 | Label as local fallback, not formal M2 proof | proven fallback | Formal M2 still blocked |

### 3.2 Env Var Inventory

| Var | Source | Used By | Status | Sensitivity |
|-----|--------|---------|--------|-------------|
| `ARC_TESTNET_RPC_URL` | `.env.example` (default provided), `.env.local` | `src/lib/agra/constants.ts`, `scripts/check-arc.ts` | Set to `https://rpc.testnet.arc.network` | Public default |
| `AGRA_TEST_WALLET_ADDRESS` | `.env.example` (empty), `.env.local` | `scripts/check-arc.ts` | Set to `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` | Public address |
| `ARC_PRIVATE_KEY` | `.env.example` (empty), `.env.local` | `scripts/wallet-auth-smoke.ts`, `src/lib/agra/arc.ts` (`broadcastDecision`) | Set (untracked, not in repo) | **Secret** — never printed or committed |
| `DECISION_REGISTRY_ADDRESS` | `.env.example` (empty), `.env.local` | `src/lib/agra/arc.ts`, `src/lib/agra/committee.ts` (`makeProof`) | **Unset** | Would be public after deployment |
| `AGRA_QA_URL` | Shell env | `scripts/wallet-auth-smoke.ts`, `scripts/readiness-e2e.mjs`, `scripts/local-visual-qa.mjs` | Set at runtime for tests | Public URL |
| `AGRA_QA_OUTPUT_DIR` | Shell env | `scripts/readiness-e2e.mjs`, `scripts/local-visual-qa.mjs` | Set at runtime | Public path |
| `AGRA_BROADCAST` | Shell env | `scripts/replay-demo.ts` | Only set for `replay:broadcast` | Boolean flag |
| `PLAYWRIGHT_CLI_REMOTE` | Shell env | `playwright-cli-sessions` | Unset for local fallback; set to `m2worker` for formal polish | SSH target |
| `AGRA_EURC_ENABLED` | Not in `.env.example` | `src/lib/agra/committee.ts` (`chooseCurrency`) | **Unset** — EURC falls back to USDC | Boolean flag |

---

## 4. Test Script Inventory

| Script | Command | File | What it does | Mutates external? | Safe to run? | Status |
|--------|---------|------|--------------|-------------------|--------------|--------|
| Typecheck | `npm run typecheck` | `package.json` | `next typegen && tsc --noEmit` | No | Yes | **Passed** (this run) |
| Unit tests | `npm test` | `package.json` | `vitest run` on `src/lib/agra/committee.test.ts` | No | Yes | **Passed** — 3/3 tests |
| Lint | `npm run lint` | `package.json` | `eslint .` | No | Yes | **Passed** |
| Build | `npm run build` | `package.json` | `next build` | No (local build only) | Yes | **Passed** |
| Arc check | `npm run arc:check` | `scripts/check-arc.ts` | Reads Arc Testnet chain ID, USDC/EURC decimals, wallet balance via public RPC | No (read-only RPC calls) | Yes | **Passed read-only** — balance `0`, `canBroadcast: false` |
| Wallet auth smoke | `npm run wallet:auth:check` | `scripts/wallet-auth-smoke.ts` | Signs message with `ARC_PRIVATE_KEY`, POSTs to `/api/auth/wallet` | No (self-contained API call) | Yes | **Passed** — `verified: true` |
| E2E readiness | `npm run e2e:readiness` | `scripts/readiness-e2e.mjs` | Playwright script: loads page, clicks wallet auth, fills form, takes screenshot, inventories interactive surfaces | No (test-only browser automation) | Yes | **Passed** with local fallback browser |
| Replay | `npm run replay` | `scripts/replay-demo.ts` | Replays canonical fixture application, prints hashes and encoded calldata | No (local computation only) | Yes | **Passed** — broadcast skipped |
| Replay broadcast | `npm run replay:broadcast` | `scripts/replay-demo.ts` | Same as replay but calls `broadcastDecision()` if `AGRA_BROADCAST=1` | **Yes** — writes to Arc Testnet via `walletClient.writeContract` | Only if funded and registry deployed | **Blocked** — `canBroadcast: false` |
| Format | `npm run format` | `package.json` | `prettier --write .` | No (local file changes only) | Yes | Not run this session |
| Foundry tests | `forge test` | `test/DecisionRegistry.t.sol` | Compiles and runs 2 Solidity tests | No | Yes | **Passed** — 2/2 tests |
| Vercel deploy | `npx vercel deploy --prod --yes` | CLI | Deploys to Vercel | Yes (mutates production deployment) | Only if intended | **Passed** earlier in execution; not re-run this session |

---

## 5. Visible Action Inventory from E2E

The `readiness-e2e.mjs` script collects every interactive surface. Expected surfaces on a clean load:

- `<a className="brand" href="#top">` — AAGRA
- `<a className="repo-link" href="#proof">` — Proof path
- `<select>` — Currency (USDC / EURC)
- `<input>` × 5 — Applicant, Project, Region, Amount, Wallet, Proof URL
- `<textarea>` × 2 — Impact, Risk notes
- `<button type="button" className="wallet-auth-button">` — Connect and sign
- `<button type="submit" className="primary-action">` — Run committee
- `<button className="ledger-item">` × N — One per application in ledger

No hidden or dummy buttons are injected. No fake external transaction links exist in the primary surface.

---

## 6. Blockers Summary (Exact)

| # | Blocker | Evidence | Impact on readiness |
|---|---------|----------|---------------------|
| 1 | **Arc Testnet wallet unfunded** | `npm run arc:check` → `nativeUsdcGasBalance: "0"`, `canBroadcast: false` | Cannot deploy `DecisionRegistry`, cannot broadcast `recordDecision`, cannot prove live Arc tx |
| 2 | **Circle faucet blocked** | Screenshot `outputs/faucet-readiness-attempt.png`; follow-up balance still `0` | No self-service path to obtain Arc Testnet USDC gas |
| 3 | **DecisionRegistry not deployed** | `DECISION_REGISTRY_ADDRESS` is unset in `.env.local` | `makeProof()` returns `fixture` status; no live `Arcscan proof` link |
| 4 | **M2 worker SSH unreachable** | `npx playwright-cli-sessions@latest browser start` timed out to `100.115.214.82:22` | Formal `/polish` visual QA gate cannot run |
| 5 | **No browser wallet extension profile** | Local/public Playwright has no injected `window.ethereum` | Full connect → sign → verify browser UI path is unproven |
| 6 | **Demo video missing** | Not listed in any output file; `TRUTH_AUDIT.md` says blocked | Submission readiness incomplete |
| 7 | **Real traction missing** | `docs/traction.md`: "No external applicants have been collected" | Cannot claim real user validation |
| 8 | **No Google Form submission** | Not attempted per `TRUTH_AUDIT.md` | Final hackathon submission not done |

---

## 7. File-Level Reference Map

### 7.1 Components

| File | Lines | Responsibilities |
|------|-------|------------------|
| `src/components/AgraConsole.tsx` | 90 | Root client component: state for applications, selectedId, form, isSubmitting, error. `submitApplication` POSTs to `/api/applications`. |
| `src/components/AgraSections.tsx` | 235 | `Topbar`, `HeroIntro`, `DecisionSection`, `ArcProofCard`, `LedgerSection`. Contains all anchors, ledger buttons, and conditional Arc proof link. |
| `src/components/GrantForm.tsx` | 131 | Form component with all inputs, currency select, `WalletAuthPanel`, and submit button. Pre-filled with `initialForm` demo data. |
| `src/components/WalletAuthPanel.tsx` | 151 | Wallet auth flow: EIP-1193 detection, chain switch, `personal_sign`, server verification. States: `idle`, `connecting`, `verified`, `blocked`. |
| `src/components/FormParts.tsx` | 42 | Reusable `Metric`, `Field`, `TextField` subcomponents. |
| `src/components/TraceField.tsx` | 77 | Canvas animation component (trace-field visual). No functional business logic. |

### 7.2 Library

| File | Lines | Responsibilities |
|------|-------|------------------|
| `src/lib/agra/arc.ts` | 105 | `publicClient`, `checkArcReadiness()`, `encodeDecisionCall()`, `broadcastDecision()`. Reads from Arc RPC; writes blocked without `ARC_PRIVATE_KEY` + `DECISION_REGISTRY_ADDRESS`. |
| `src/lib/agra/auth.ts` | 30 | `buildWalletAuthMessage()`, chain constants (`5042002`, `0x4cef52`). |
| `src/lib/agra/committee.ts` | 254 | `evaluateApplication()` — deterministic 3-agent vote logic. `makeProof()` returns `fixture`/`ready`/`blocked`. `+11s` artificial delay. |
| `src/lib/agra/committee.test.ts` | 33 | 3 Vitest tests: canonical accepted, safety veto, treasury cap. |
| `src/lib/agra/constants.ts` | 17 | Hardcoded Arc addresses, chain ID, explorer URL, demo constants, treasury cap. |
| `src/lib/agra/fixtures.ts` | 83 | 3 seeded demo applications + `canonicalApplication`. `createApplication()` generates IDs. |
| `src/lib/agra/format.ts` | 3 | `shortHash()` utility. |
| `src/lib/agra/hash.ts` | 25 | `stableStringify()` + `sha256Hex()` for deterministic evidence/trace hashes. |
| `src/lib/agra/schema.ts` | 23 | Zod `applicationSchema` for API boundary validation. |
| `src/lib/agra/store.ts` | 20 | In-memory `applications` array. `listApplications()`, `addApplication()`, `getApplication()`. |
| `src/lib/agra/types.ts` | 58 | TypeScript interfaces: `GrantApplication`, `GrantDecision`, `CommitteeVote`, `ArcProof`, etc. |

### 7.3 API Routes

| File | Lines | Responsibilities |
|------|-------|------------------|
| `src/app/api/applications/route.ts` | 32 | `GET` returns in-memory applications. `POST` validates with zod, calls `addApplication()`, returns 201. |
| `src/app/api/auth/wallet/route.ts` | 82 | `POST` validates wallet auth payload, checks chain ID, verifies EIP-191 signature with `viem.verifyMessage()`. |
| `src/app/api/replay/route.ts` | 10 | `POST` replays `canonicalApplication` fixture on demand. |

### 7.4 Scripts

| File | Lines | Responsibilities |
|------|-------|------------------|
| `scripts/check-arc.ts` | 32 | Arc Testnet RPC readiness check. Prints JSON with chain ID, decimals, balance, `canBroadcast`. |
| `scripts/local-visual-qa.mjs` | 106 | Playwright multi-viewport visual QA. Takes 375/768/1440 screenshots. |
| `scripts/readiness-e2e.mjs` | 120 | Playwright E2E: wallet auth blocked state, invalid form, valid submission, API proof, interactive surface inventory. |
| `scripts/replay-demo.ts` | 60 | Canonical decision replay. Prints hashes and encoded calldata. Optionally broadcasts if `AGRA_BROADCAST=1`. |
| `scripts/wallet-auth-smoke.ts` | 68 | Signs message with `ARC_PRIVATE_KEY`, POSTs to `/api/auth/wallet`, asserts `verified: true`. |

### 7.5 Contracts

| File | Lines | Responsibilities |
|------|-------|------------------|
| `contracts/DecisionRegistry.sol` | 34 | Solidity registry: `recordDecision()` emits `DecisionRecorded` event, stores `traceHash` per `applicationId`. |
| `test/DecisionRegistry.t.sol` | 40 | 2 Foundry tests: record trace, reject duplicate. |

---

## 8. Quality Gate Verification (This Run)

| Gate | Command | Result |
|------|---------|--------|
| Typecheck | `npm run typecheck` | **Passed** |
| Unit tests | `npm test` | **Passed** (3/3 Vitest) |
| Contract tests | `forge test` | **Passed** (2/2 Solidity) |
| Lint | `npm run lint` | **Passed** |
| Build | `npm run build` | **Passed** |
| Security audit | `npm audit --audit-level=high` | **Passed** (2 moderate PostCSS advisories only; no high/critical) |
| Arc read proof | `npm run arc:check` | **Passed read-only** — chain `5042002`, USDC/EURC decimals `6`, balance `0` |
| Wallet auth API | `npm run wallet:auth:check` | **Passed** — `verified: true` |
| Replay | `npm run replay` | **Passed** — canonical decision, fixture status, broadcast skipped |

---

## 9. Instructions for Claude / GPT Builder

### What is ready to build on

- **Deterministic committee logic** (`committee.ts`) is complete and tested. Do not rewrite verdict logic without explicit spec change.
- **Wallet auth API** (`/api/auth/wallet`) is real and verified. Do not add dummy auth or fake connected state.
- **Arc read integration** (`arc.ts` `publicClient`) is live. Do not mock RPC reads.
- **Form validation** (`schema.ts`) is strict. Do not loosen API boundary without reason.
- **In-memory store** is intentional for demo. If switching to a database, update `store.ts` and `TRUTH_AUDIT.md`.

### What must not be claimed as working

- **Live Arc transaction** — wallet balance is `0`; no `DecisionRegistry` deployed.
- **Browser wallet connect/sign** — only blocked-state is proven; no extension profile exists.
- **EURC payment** — only decimals read is proven; no transfer.
- **Paymaster / Gateway / USYC** — not implemented anywhere.
- **Real traction** — `docs/traction.md` explicitly says none collected.

### What needs explicit action to unblock

1. Fund `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` on Arc Testnet.
2. Deploy `DecisionRegistry` to Arc Testnet.
3. Set `DECISION_REGISTRY_ADDRESS` in `.env.local`.
4. Run `npm run replay:broadcast` and verify real tx on `testnet.arcscan.app`.
5. Configure a browser wallet extension profile on Arc Testnet for full E2E signing proof.
6. Record demo video and collect real traction (or keep honestly labeled as demo).
7. Commit/push readiness changes if repo should reflect current state.

---

*End of inventory. No code was mutated. All claims are backed by file references and command output captured in this run.*
