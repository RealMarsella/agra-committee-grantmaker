# AGRA Committee-Governed Grantmaker

AGRA is an autonomous public-goods micro-grant committee built for the Agora Agents Hackathon. A grant applicant submits a request, three deterministic agent roles vote independently against a public rubric, and the app returns an accepted, rejected, or capped decision with a trace hash and Arc proof status.

## Demo Loop

1. Open the console.
2. Submit the prefilled grant request or edit it.
3. AGRA runs the Public Goods, Safety, and Treasury agents without a human approval click.
4. The decision panel shows score, dissent, payout cap, trace hash, and Arc proof state.
5. `npm run replay` reproduces the canonical accepted decision.

The current live-write blocker is Circle faucet funding for the generated Arc test wallet. Fixture transaction hashes are labeled as fixture data until funding and `DecisionRegistry` deployment succeed.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- `zod` and `viem`
- Foundry contract for `DecisionRegistry`
- Agent/browser verified visual evidence under `outputs/visual-qa/`

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
