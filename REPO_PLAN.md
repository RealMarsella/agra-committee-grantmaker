# REPO_PLAN

Date: 2026-05-21

## Public Repo

- Proposed name: `agra-committee-grantmaker`
- Proposed owner: Gabriel's GitHub account from Chrome profile directory `Default`.
- Visibility: public, required by the Agora rules.

## Creation Method

1. Verify GitHub account in `agent-browser` with `--profile "Default"` and `--allowed-domains "github.com,www.github.com"`.
2. Create the public repo through `agent-browser` if the verified browser account matches Gabriel.
3. Add the remote locally and push only after build/test basics pass.

## Visibility Proof To Capture

- Final GitHub repo URL.
- Browser URL after repo creation.
- `git remote -v` output.
- Public visibility shown in repo header or through GitHub page access.

## Push/Deploy Steps

- Push `main` to the created repo.
- Deploy to Vercel only after local build passes and repo is public, unless a faster static preview path is needed for portal prep.

## Current Status

GitHub account verification passed in `agent-browser` session `agra-github-create-0521`: Chrome profile directory `Default` is signed in as `Gabriel Antony Xaviour (gabrielantonyxaviour)` with public email `gabrielantony56@gmail.com`.

Public repo created: `https://github.com/gabrielantonyxaviour/agra-committee-grantmaker`.

Creation evidence:

- `gh repo view gabrielantonyxaviour/agra-committee-grantmaker --json nameWithOwner,visibility,url,isPrivate` returned `visibility: PUBLIC` and `isPrivate: false`.
- Browser session `agra-github-create-0521` opened the repo URL and showed the empty public repo quick-start page.
- Local remote is `origin https://github.com/gabrielantonyxaviour/agra-committee-grantmaker.git`.

Push is pending the final report commit.

Deployment proof:

- Vercel project linked as `rax-tech/agra-committee-grantmaker`.
- Production URL: `https://agra-committee-grantmaker.vercel.app`.
- `curl -I -L https://agra-committee-grantmaker.vercel.app` returned HTTP 200.
- Browser session `agra-public-verify` loaded the public app and captured `outputs/visual-qa/public-home-1440.png`.
