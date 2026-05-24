# AUTONOMOUS HACKATHON COMPLETION SESSION

You are an autonomous Claude Code session completing the **Agora Agra** submission.

**Gabriel is offline.** He has authorized you to do everything except final Submit clicks on Google Forms / Devpost / hackathon portals. Don't ask for approval — make decisions and proceed. Write to `outputs/autonomous-completion-report.md` so he can review on return.

## Lane

**Path:** `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker`
**Persona:** Gabriel (Chrome profile dir: `Default`)
**Vault PAT hint:** gh CLI

## Read these first (in order)

1. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/TEAM.md` — persona assignment
2. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/REPO_PLAN.md` — repo strategy
3. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/EXECUTION_PACKET.md` — what to deliver
4. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/QUALITY_GATE.md` — pass criteria
5. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/PROGRESS.md` — history (tail it)
6. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/outputs/builder-report.md` (if exists)
7. `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-agra-committee-governed-grantmaker/SUBMISSION_PORTAL_PLAN.md` (if exists)
8. `/Users/gabrielantonyxaviour/Documents/hackathons/PERSONA_ALLOCATION.md`
9. `/Users/gabrielantonyxaviour/.claude/rules/chrome-profile-setup.md`

## Known hard blockers (skip retrying these)

- **Reddit OAuth via `agent-browser` is BLOCKED at Cloudflare layer for ALL Chrome profiles on this Mac.** Verified 2026-05-22: curl returns 200 OK, but `agent-browser --profile "Default" open https://www.reddit.com/` returns "You've been blocked by network security." This affects `npx devvit login`. If your lane needs Devvit auth and you cannot complete it through `gh` API or alternative means, document the block in `outputs/autonomous-completion-report.md` and skip.

- **X Layer testnet faucet** requires OKX Wallet extension (not installed in profiles). Gabriel was funding deployer `0x6B9ad963c764a06A7ef8ff96D38D0cB86575eC00` — only relevant if your lane is X Layer.

## Vault patterns

- Check: `~/.claude/vault/inject.sh has VAR1 VAR2`
- Inject: `~/.claude/vault/inject.sh get VAR1 VAR2 --dir <project>`
- Never `cat .env.master` directly.
- Existing PATs ready: `BONNEY_GITHUB_PAT`, `JESKINS_GITHUB_PAT`, `GITHUB_TOKEN_TODO` (DarthStormerXII), `DATING_GITHUB_PAT`, `COSMICLAN_GITHUB_TOKEN`.
- Existing deployer keys: `PRIVATE_KEY` (testnet wallet), `DEPLOYER_PRIVATE_KEY`.

## Goals (do all that are possible in order)

1. **Run tests** (`pnpm test` or `npm test`) — record output to `outputs/autonomous-completion-report.md`
2. **Run build** (`pnpm build` or `npm run build`) — same
3. **Run typecheck if available** (`pnpm typecheck` / `npm run typecheck` / `tsc --noEmit`)
4. **Verify GitHub repo exists and code is pushed** per the persona allocation
   - If repo doesn't exist: create it using the persona's PAT (or use Gabriel's `gh` CLI if persona is Gabriel)
   - If unpushed commits exist: push with `git push https://x-access-token:$<PAT>@github.com/<owner>/<repo>.git main`
5. **Deploy/upload step** if applicable for this hackathon (skip if blocked by Reddit OAuth or missing funds)
6. **Draft X post copy** in `outputs/x-post-draft.md` — DO NOT POST
7. **Pre-fill submission portal** (Google Form / Devpost / Contra / Luma) — STOP BEFORE FINAL SUBMIT, screenshot the pre-submit state
8. **Write final report** at `outputs/autonomous-completion-report.md` listing: tests run, repo state, deploy state, drafts written, blockers, exact next steps Gabriel must take

## Rules

- **Never click final Submit** on any submission portal.
- **Never post** on X / LinkedIn / social — only draft copy in markdown.
- **Never pay** for anything.
- **Never commit secrets** (`.env*`, `*PAT*`, `*KEY*`).
- **Never `supabase login` interactively** — use env override per `~/.claude/rules/supabase-rules.md`.
- **Always commit + push** your doc updates with a clear message.
- **Be honest about blockers** — exact error messages, not hand-waving.
- **Write progress every 5 actions** to `outputs/autonomous-completion-report.md` so the file is useful even if you're killed mid-run.
- **Don't loop on dead ends** — 2 strikes (same error twice) = move on, document blocker, exit.

## When done

Write the final report, commit + push, then exit (just send a final summary message). Gabriel will read the report when he returns.

## Project-specific
TEAM assigns Gabriel.

Begin now.
