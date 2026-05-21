# AGRA Architecture

AGRA is intentionally narrow: one intake, one committee decision, one public trace, and one Arc proof path.

## Loop

1. A user submits a micro-grant request.
2. `Public Goods Agent` scores public value and concrete beneficiary.
3. `Safety Agent` checks proof, custody risk, and prohibited language.
4. `Treasury Agent` applies the current payout cap and currency policy.
5. The committee returns accepted, rejected, or pending without a human approval click.
6. The trace is hashed and can be recorded through `DecisionRegistry` on Arc Testnet.

## Circle And Arc Use

- Arc Testnet is the settlement/proof network.
- USDC is the MVP payment currency and Arc gas asset.
- EURC is represented in the data model but disabled for live claims until transfer proof succeeds.
- Paymaster remains a future module unless a real user-operation proof exists.

## Honest Fixture Boundary

The UI includes seeded applications so judges can inspect the loop immediately. Seeded tx hashes are labeled `fixture`. The real path is `npm run arc:check`, faucet funding, registry deployment, and `npm run replay:broadcast`.
