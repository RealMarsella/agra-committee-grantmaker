Make this hackathon execution run ready for serious end-to-end testing.

Execution workspace: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker
Report output: /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/readiness-report.md

Required source files:
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/execution-quality-runbook.md
- /Users/gabrielantonyxaviour/Documents/agents/docs/hackathons/browser-execution-runbook.md
- /Users/gabrielantonyxaviour/Documents/hackathons/submission-profile-registry.json
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/STATE.json
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/FEATURE_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/INTEGRATION_MATRIX.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/TRUTH_AUDIT.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/QUALITY_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/AUTH_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/E2E_TEST_PLAN.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/READINESS_GATE.md
- /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/hardening-report.md

Readiness contract:
1. Read the execution quality runbook and browser execution runbook first. Do not rely on summaries only.
2. Treat the previous hardening report as the starting point, not the finish line.
3. Decide whether this product is web3-auth, regular-auth, platform-auth, or no-auth-required. Record the decision in AUTH_PLAN.md with evidence.
4. For web3 products, implement and verify a real wallet/auth path where possible: wallet connect/signature, connected account state, chain/network checks, tx/RPC proof, and a failing/blocked state when the wallet, faucet, or key is unavailable. Do not keep dummy connect buttons or fake connected state.
5. For AI/web products, implement and verify a proper regular auth path where the product needs users: email/password, OAuth, magic link, or the host platform auth. If using Better Auth or another auth library, configure real session persistence and protected routes/actions. If platform auth is required, verify the platform CLI/browser login or document the exact blocker.
6. Audit every visible button, form, link, menu, and primary action. Each must either work end to end, navigate to a real target, be deliberately disabled with a reason, or be removed. No dummy buttons.
7. Add or update E2E tests for the primary happy path, auth path, failure path, and at least one real integration proof. Prefer Playwright/browser automation and API/RPC/contract checks. Do not mock external integrations unless the test is explicitly a unit test and labeled as such.
8. Re-run unit/type/build/security checks. Fix failures that can be fixed without credentials, irreversible submission, billing mutation, CAPTCHA bypass, or unsafe account changes.
9. Try self-service for missing credentials or faucet/wallet/profile issues using the runbooks and logged-in browser/profile surfaces. Ask Gabriel only after documenting what was attempted and why it failed.
10. Update FEATURE_MATRIX.md, INTEGRATION_MATRIX.md, TRUTH_AUDIT.md, QUALITY_GATE.md, AUTH_PLAN.md, E2E_TEST_PLAN.md, and READINESS_GATE.md before writing the report.
11. Final readiness status must be one of testing-ready, integration-blocked, auth-blocked, or not-ready. Only use testing-ready when auth, primary E2E, integration smoke, build/test, and no-dummy-action audit all pass with evidence.
12. Do not final-submit, accept legal attestations, mutate billing, bypass CAPTCHA, or invent missing credentials.
13. Write /Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/readiness-report.md with: final readiness status, auth implementation/proof, E2E tests added/run, live integrations proven, blocked integrations with attempted self-service evidence, dummy/mock removals, exact commands, screenshots, and next actions.

Start now.