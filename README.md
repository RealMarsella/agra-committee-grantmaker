# AGRA — Autonomous Capital Allocation, Settled in USDC on Arc

AGRA is a standing committee of autonomous agents that allocates public-goods
capital. An applicant submits a grant; three agents with **conflicting
mandates** vote independently against a public rubric; the committee publishes
its dissent, accepts/caps/refuses, and prepares a **USDC payout settled on
Arc** — with no human approval click in the loop.

The winning idea is not "an AI scores a form." It is **autonomous capital
allocation with public, replayable disagreement and stablecoin-native
settlement.**

## What makes it agentic

Three agents, one treasury, on-the-record conflict:

| Agent | Optimizes for | Power |
|---|---|---|
| **Public Goods** | Impact per dollar | Scores the public beneficiary, demands inspectable output |
| **Safety** | Refusal authority | Hard **veto** — one safety trigger blocks the whole payout |
| **Treasury** | Capital discipline | **Caps** any disbursement at the policy limit (25 USDC demo) |

Each decision records average score, dissent spread, a trace hash, and the
votes — before any USDC moves.

## Product surface

- **Landing (`/`)** — institutional hero, the committee bench, and the
  read → simulate → write settlement explainer.
- **Console (`/console`)** — applicant intake, the three agents voting with
  reasons and conflict, the decision room, and the live Arc USDC settlement
  panel.

## Arc settlement — real read → simulate → write

The treasury action is a real USDC transfer to the grantee on Arc Testnet
(chain `5042002`):

1. **Read (live):** USDC `decimals()` and the connected wallet's `balanceOf`,
   from the live token contract.
2. **Simulate (live):** the exact `transfer(grantee, amount)` is simulated
   against live state. An unfunded wallet shows the revert reason — it does not
   fake success.
3. **Write (gated):** the live transaction only enables once the simulation
   passes. **No tx hash is shown unless the chain returns one.**

Honest status: chain reads and the transfer simulation are live now. The live
**write** is blocked only by Circle faucet funding for the test wallet; the UI
discloses this and disables the live settlement button. No fabricated
transaction hashes anywhere. Fixture and live states are labeled throughout.

## Demo Loop

1. Open `/` — the committee positioning and settlement story.
2. Click **Enter the committee console** and connect a wallet (Reown AppKit).
3. Submit the prefilled grant request or edit it.
4. Watch Public Goods, Safety, and Treasury vote independently — no human click.
5. The decision room shows score, dissent, payout cap, trace hash, and the Arc
   proof state.
6. In the **USDC settlement** panel, see live reads + the transfer simulation;
   the live write enables once a funded wallet is connected.
7. `npm run replay` reproduces the canonical accepted decision deterministically.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- **Reown AppKit + Wagmi + Viem** for wallet-native sign-in and the
  read/simulate/write flow (see `AUTH_AND_ARC_PLAN.md`)
- `zod` for input validation
- Foundry contract for `DecisionRegistry`
- Agent/browser verified visual evidence under `outputs/visual-qa/` and
  `/tmp/verify/agra/`

## Commands

```bash
npm install
npm run dev -- --port 3003
npm run typecheck
npm test
npm run lint
npm run build
npm run arc:check
npm run replay
forge test
```

Broadcast path after funding and deployment:

```bash
npm run replay:broadcast
```

Required env values stay local and uncommitted:

```bash
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
AGRA_TEST_WALLET_ADDRESS=
ARC_PRIVATE_KEY=
DECISION_REGISTRY_ADDRESS=
```

## Links

- Hackathon: https://agora.thecanteenapp.com/
- Public repo: https://github.com/gabrielantonyxaviour/agra-committee-grantmaker
- Live app: https://agra-committee-grantmaker.vercel.app
- Local production preview: http://localhost:3003
- Submission form: https://forms.gle/ok3Gr9zhmHnApvK48
