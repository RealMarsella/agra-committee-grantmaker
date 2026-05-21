# API_PLAN

Date: 2026-05-21

## Data Model

- `GrantApplication`: applicant name, project name, region, requested amount, requested currency, wallet address, proof URL, public-good impact, urgency, risk notes, submitted timestamp.
- `CommitteeVote`: agent role, score, verdict, reason, concerns, recommended amount.
- `DecisionTrace`: application ID, final verdict, payout currency, payout amount, evidence hash, trace hash, committee disagreement score, refusal reason when rejected.
- `ArcProof`: chain ID, registry address, transaction hash, explorer URL, token address, proof status (`fixture`, `ready`, `broadcast`, `blocked`).

## Local APIs

- `GET /api/applications`: return seeded and runtime applications.
- `POST /api/applications`: validate input, run the committee, store the decision in server memory for the demo session, and return the trace.
- `POST /api/replay`: run the canonical seeded application through the same scoring function and return the replay result.

## Integration Scripts

- `scripts/check-arc.ts`: read Arc Testnet chain ID plus USDC/EURC decimals from public RPC.
- `scripts/replay-demo.ts`: reproduce the canonical grant decision; if `ARC_PRIVATE_KEY` and `DECISION_REGISTRY_ADDRESS` exist, broadcast the decision to Arc, otherwise print an honest fixture/blocked proof.
- `contracts/DecisionRegistry.sol`: compact registry for public decision events.
- `test/DecisionRegistry.t.sol`: event/contract test.

## Secrets And Environment

- `.env*` stays gitignored.
- `ARC_TESTNET_RPC_URL` defaults to `https://rpc.testnet.arc.network`.
- `ARC_PRIVATE_KEY` is optional and must never be committed or printed.
- `DECISION_REGISTRY_ADDRESS` is optional until deployment succeeds.

## Real Integration Proof Path

1. Run `scripts/check-arc.ts` to prove public Arc read access.
2. Obtain faucet funding for a local test wallet without committing secrets.
3. Deploy `DecisionRegistry` to Arc Testnet.
4. Run `scripts/replay-demo.ts` to emit a real decision event.
5. Paste the tx hash/explorer URL into the app seed data, README, and `EXECUTION_PACKET.md`.

## Current Verification

- `npm run arc:check` succeeds for Arc RPC, chain ID `5042002`, USDC decimals `6`, and EURC decimals `6`.
- Test wallet is loaded from `.env.local`, but balance is `0`, so `canBroadcast` is `false`.
- `npm run replay` now emits both the human application ID and a distinct bytes32 `onchainApplicationId` for `DecisionRegistry.recordDecision`.
- `POST /api/replay` returns the canonical accepted decision with fixture proof status.

## Fixture Policy

Fixture decisions are allowed only as labeled demo data. They must not be described as real Arc transactions, real user applications, real payments, or real traction.
