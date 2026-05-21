# SPONSOR_ACCESS_PLAN

Date: 2026-05-21

## Official Surfaces

- Hackathon page: `https://agora.thecanteenapp.com/`
- Submission form: `https://forms.gle/ok3Gr9zhmHnApvK48`
- Arc docs: `https://docs.arc.network` / `https://docs.arc.io`
- Arc Testnet RPC: `https://rpc.testnet.arc.network`
- Arc explorer: `https://testnet.arcscan.app`
- Circle faucet: `https://faucet.circle.com`
- Circle developer docs: `https://developers.circle.com`
- Circle Paymaster docs: `https://developers.circle.com/stablecoins/paymaster-addresses`
- Circle Gateway: `https://www.circle.com/gateway`

## Sponsor Primitives For AGRA

- Required MVP primitive: Arc Testnet with USDC-native gas and public tx/explorer proof.
- Required MVP token path: USDC on Arc Testnet via ERC-20 interface `0x3600000000000000000000000000000000000000` with 6 decimals.
- Strong optional primitive: EURC on Arc Testnet at `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a`, only if read/transfer proof works.
- Strong optional primitive: Circle Paymaster, only if a real user-operation path is executed or clearly documented as blocked. Current public Paymaster address docs list supported chains; Arc-specific Paymaster support must be verified live before claiming.
- Optional/future primitive: Gateway/Nanopayments for cross-chain or sub-cent agent commerce. AGRA does not depend on it for MVP.

## Access Attempts To Run

1. Read-only RPC proof: confirm Arc chain ID and USDC/EURC decimals from the public RPC.
2. Faucet attempt: generate or reuse a non-committed test wallet address, use `agent-browser` with Gabriel's `Default` profile on `faucet.circle.com`, and record whether faucet funding succeeds.
3. Contract proof: deploy `DecisionRegistry` or run a real write only after wallet funding exists and no private key is committed or logged.
4. Submission portal prep: open the Google Form through `agent-browser` with `Default`, identify fields, and stop before irreversible/legal/final actions.

## Real State Transition The Demo Must Prove

An applicant submits a grant request; AGRA's three-agent committee evaluates it without a human approval click; the app shows accepted and rejected outcomes; the accepted grant receives either a real Arc Testnet decision event/payment transaction or a clearly labeled fixture while the exact real broadcast path remains available through `scripts/replay-demo.ts`.

## Fallback Policy

- If Arc write/payment is blocked by faucet, wallet, CAPTCHA, passkey, or missing funds, the app must label tx hashes as fixture/demo data and the report must list the exact blocker.
- If EURC cannot be verified, remove EU/EURC payment claims and keep only USDC.
- If Paymaster cannot be proven, keep Paymaster as a documented future module and do not imply it ran.
- No mainnet funds or real applicant payout claims without explicit approval.

## Access Evidence From This Run

- Arc public RPC read succeeded: chain ID `5042002`.
- Arc USDC ERC-20 decimals read succeeded: `6`.
- Generated local test wallet address: `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`; private key is stored only in untracked `.env.local`.
- Circle faucet browser request was attempted in session `agra-faucet-inspect`, but the site returned: "We detect unusual traffic from your request. Please verify that you are not a bot and submit again." A second click did not clear the blocker.
- Current wallet balance after faucet attempt: `0`; live writes remain blocked until funding is available.
- Current verification after script fix: `npm run arc:check` loads `.env.local`, reports wallet `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13`, chain ID `5042002`, USDC decimals `6`, EURC decimals `6`, native gas balance `0`, and `canBroadcast: false`.
- Official docs rechecked on 2026-05-21: Arc Testnet RPC/chain/explorer/faucet, Arc USDC/EURC addresses, Circle Paymaster Arc Testnet address, and Gateway/Nanopayments docs all match the MVP gating policy.
