You are Claude Opus support for Gabriel's hackathon readiness phase.

Project: AGRA Committee Grantmaker
Workspace: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker

Goal: help turn the project from honest demo-ready into full end-to-end testing readiness. Focus on product code, auth UX, frontend state, E2E coverage, and removing dummy/non-working actions.

Read first:
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/AUTH_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/E2E_TEST_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/READINESS_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/QUALITY_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/TRUTH_AUDIT.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/readiness-report.md if present
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/execution-quality-runbook.md

Rules:
1. Implement improvements if they can be done without missing credentials, wallet funds, CAPTCHA/passkey, billing mutation, legal attestation, or final submission.
2. For web3 products, prioritize real wallet/auth affordances, network/account checks, and honest blocked states. No fake connected wallets.
3. For AI/web products, prioritize regular auth/platform auth and protected actions where appropriate. No fake login buttons.
4. Add or improve E2E/browser tests for auth, primary flow, and integration smoke.
5. Remove, disable with reason, or wire every dummy button/action you find.
6. Update AUTH_PLAN.md, E2E_TEST_PLAN.md, READINESS_GATE.md, and PROGRESS.md with concrete evidence.
7. Write your report to /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/claude-readiness-build.md with changed files, tests run, remaining blockers, and what GPT should accept/reject.

Do not final-submit, accept legal attestations, mutate billing, bypass CAPTCHA, invent credentials, or claim testing-ready without evidence. Start now.