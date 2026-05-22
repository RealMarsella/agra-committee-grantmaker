# EXECUTION_PACKET

Date: 2026-05-21

## One-Sentence Product

AGRA is an autonomous public-goods grantmaker: it reviews micro-grant applications in a demo console with a three-agent committee, refuses unsafe requests, and prepares accepted decisions for Arc recording with USDC-ready proof.

## README Source Of Truth

- Product: AGRA Committee-Governed Grantmaker.
- Hackathon: Agora Agents Hackathon, Canteen x Circle, May 11-25, 2026.
- What the agent decides: accept, reject, or cap a grant request based on public-good impact, safety/proof, and treasury policy.
- Circle/Arc primitives: Arc Testnet, USDC, optional EURC, optional Paymaster when proven.
- Proof command: `npm run replay`.
- Real integration command: `npm run arc:check`, then `npm run replay:broadcast` after `ARC_PRIVATE_KEY` and `DECISION_REGISTRY_ADDRESS` are configured.

## Demo Script

1. Open with the current seeded decision: AGRA accepted one fixture grant and rejected another, with each vote visible.
2. Submit a new grant application in the first screen.
3. Show the three committee agents vote independently: Public Goods, Safety, Treasury.
4. Show the trace hash, payout currency, cap, and Arc proof status.
5. Run `npm run replay` to prove the same decision path is reproducible.
6. If broadcast Arc proof exists, click the Arcscan URL. If not, explicitly state the faucet/wallet blocker and show `npm run arc:check`.

## Video Script

"AGRA reviewed three fixture micro-grant applications without a human approval click. The public-goods agent wanted impact, the safety agent vetoed weak proof, and the treasury agent capped payout size. This accepted application is ready for USDC recording on Arc once the test wallet is funded, this one was rejected with a public reason, and every committee trace can be replayed from the repo."

## Judging Criteria Mapping

- Agentic sophistication: persistent committee roles, disagreement, vetoes, caps, and refusal path.
- Traction: public intake path plus application count/quotes when collected.
- Circle tool usage: Arc Testnet proof, USDC payment path, EURC/Paymaster only when proven.
- Innovation: off-RFB autonomous grant allocator with public reasoning traces and stablecoin-native micro-disbursement.

## Links

- Hackathon: `https://agora.thecanteenapp.com/`
- Submission: `https://forms.gle/ok3Gr9zhmHnApvK48`
- Repo: `https://github.com/gabrielantonyxaviour/agra-committee-grantmaker`
- Live app: `https://agra-committee-grantmaker.vercel.app`
- Video: pending.
- Arc tx: pending.

## Final Checklist

- [x] Plans written.
- [x] App implemented.
- [x] Arc read proof passed.
- [x] Contract/replay tests passed.
- [x] Browser/UI proof captured through `agent-browser` screenshots.
- [x] Public repo created.
- [x] Repo pushed.
- [x] Submission portal fields inventoried.
- [x] Public deploy URL.
- [x] Builder report written.
- [x] Hardening local visual QA captured.
