You are Kimi support for Gabriel's hackathon readiness phase.

Project: AGRA Committee Grantmaker
Workspace: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker

Goal: heavy grunt verification. Do not be the final architectural authority. Inventory every visible action, auth/integration dependency, test command, env var, fixture/mock, and blocker so Claude/GPT can build accurately.

Read first:
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/AUTH_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/E2E_TEST_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/READINESS_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/FEATURE_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/INTEGRATION_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/TRUTH_AUDIT.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/QUALITY_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/readiness-report.md if present

Tasks:
1. Search code for buttons, links, forms, handlers, placeholder hrefs, disabled states, mock/fixture/simulation labels, localStorage/sessionStorage, wallet/auth references, env vars, and test scripts.
2. Produce a no-dummy-action audit: each action is working, disabled-with-reason, removed-needed, or blocker.
3. Produce an auth-readiness audit: web3 wallet auth or regular/platform auth requirement, current implementation, test evidence, and exact gap.
4. Produce an integration-readiness audit: each external service/protocol, real proof command/browser proof, and blocker.
5. Run safe read-only commands where useful: package script inventory, rg scans, npm scripts that do not mutate external systems if quick.
6. You may update AUTH_PLAN.md, E2E_TEST_PLAN.md, READINESS_GATE.md, and PROGRESS.md with audit findings only. Do not edit product code unless explicitly instructed later by GPT/Claude.
7. Write /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/kimi-readiness-inventory.md with exact findings and file references.

Do not final-submit, accept legal attestations, mutate billing, bypass CAPTCHA, invent credentials, or mark anything real without evidence. Start now.