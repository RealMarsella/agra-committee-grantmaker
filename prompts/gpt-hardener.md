Harden this existing hackathon execution run.

Execution workspace: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker
Report output: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/hardening-report.md

Required source files:
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/execution-quality-runbook.md
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/browser-execution-runbook.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/STATE.json
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/FEATURE_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/INTEGRATION_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/TRUTH_AUDIT.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/QUALITY_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/BUILD_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/UI_TEMPLATE_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/builder-report.md

Hardening contract:
1. Read the execution quality runbook first. Do not rely only on the earlier builder report.
2. Audit every product claim against code, tests, browser proof, repo/deploy state, contracts, APIs, and integration evidence.
3. Update FEATURE_MATRIX.md, INTEGRATION_MATRIX.md, TRUTH_AUDIT.md, and QUALITY_GATE.md before writing the hardening report.
4. Continue implementation if a feature is incomplete and can be completed without credentials, irreversible submission, or unsafe account mutation.
5. Run build/test/type/API/RPC/contract checks that fit the project. Fix failures and rerun.
6. Run browser proof for the primary demo path. If formal M2 /polish is unavailable, run local visual QA at 375, 768, and 1440 and record it as local-visual-qa-passed; formal-polish-blocked-by-m2.
7. Remove or relabel fake live claims. Fixtures may remain only if the UI, README/demo script, TRUTH_AUDIT.md, and QUALITY_GATE.md all label them honestly.
8. Do not final-submit, accept legal attestations, mutate billing, bypass CAPTCHA, or invent missing credentials.
9. Final status must be one of submit-ready, demo-ready, blocked, or prototype. Do not say fully developed unless QUALITY_GATE.md says submit-ready.
10. Write /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/hardening-report.md with changes made, checks run, visual proof, real integrations proven, fixtures/mocks, blockers, and exact next actions.

Start now.