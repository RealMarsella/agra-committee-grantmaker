# CURRENT SPEC

## Goal

Build AGRA Committee-Governed Grantmaker for the Agora Agents Hackathon by May 25, 2026: an autonomous micro-grant app where a three-agent committee evaluates applications, publishes accepted/rejected reasoning traces, and records an Arc/Circle payment or refusal artifact.

## Decided

- Primary build loop: grant application -> autonomous three-agent committee -> public rubric trace -> accepted/rejected ledger -> Arc decision proof path.
- Primary submitter/repo owner: Gabriel using Chrome profile directory `Default`; GitHub repo creation was previously verified and pushed.
- MVP uses direct Arc Testnet USDC decision/payment proof first; Paymaster, EURC, Gateway, and live disbursement claims remain gated on real proof.
- UI direction borrows from the `saas-marketing`/Convix dashboard-preview template and MotionSites `nexora-automation` prompt, adapted into a dark, judge-facing operating console.

## Open

- Arc faucet funding and whether a real transaction can be broadcast in this run.
- Recorded demo video URL and real traction answers.
- Formal M2 `/polish` rerun when `m2worker` SSH is reachable.

## Out Of Scope

- Mainnet funds, real charity promises, or unlabeled production disbursements.
- Final submission click, legal attestations, eligibility checkboxes, wallet spending above testnet/demo limits, or social posting without Gabriel's exact approval.
- Paymaster/Gateway/EURC claims unless live integration proof exists.

## Done When

- Required execution docs exist and are updated with evidence.
- App builds, runs locally, and demonstrates the AGRA decision loop.
- `scripts/replay-demo.ts` reproduces the canonical decision and either broadcasts to Arc with configured secrets or clearly reports the missing real-integration prerequisite.
- Tests and visual QA evidence are captured.
- `outputs/builder-report.md` and `outputs/hardening-report.md` summarize repo, portal, API/plugin, UI/template, build, tests, visual QA, blockers, and next actions.
