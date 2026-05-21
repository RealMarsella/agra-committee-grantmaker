# UI_TEMPLATE_PLAN

Date: 2026-05-21

## Selected Production Template

- Primary catalog inspiration: `saas-marketing` / `template-linear` for a clean SaaS/product operating surface.
- Direct local code reference: `/Users/gabrielantonyxaviour/Documents/templates/.grind/dist/template-saas-software`, especially its rounded full-viewport frame, clipped dashboard preview, soft background video treatment, and coded dashboard cards.
- Secondary catalog inspiration: `larinova-landing` for GSAP/Lenis polish, high-contrast trust details, and animated proof panels.

## Selected MotionSites Prompts

- Primary prompt: `nexora-automation` for a full-screen hero with a custom-coded dashboard preview, semantic token system, and strong first-screen product proof.
- Secondary prompt: `sentinel-ai` for a dark, high-stakes agent/security tone, bottom-left cinematic anchoring, and vivid status accents.

## Visual System

- Brand: `AGRA`, an autonomous public-goods grant committee on Arc.
- Tone: institutional, cinematic, precise; not a generic CRUD dashboard.
- Palette: charcoal/ink base, warm paper panels, vivid green for accepted committee votes, amber for treasury caution, coral for rejected/veto signals, and blue for Arc proof links.
- Typography: display serif for the AGRA name and high-drama proof numbers; geometric sans for dense app UI.
- Components: rounded app shell, live committee rail, grant application form, decision trace ledger, Arc proof strip, and visible accepted/rejected cards.

## First-Screen Judge Moment

The first viewport must show the actual product, not a marketing page: a judge can enter a grant request, watch three agents vote, and see an accepted/rejected trace with a fixture or live Arc proof label. The top statement is the product name and the live state transition, not generic value-prop copy.

## Motion And Interaction Rules

- Entrance: staggered fade/slide for heading, committee agents, and ledger rows.
- Interaction: form submit immediately runs the committee; no human approval button after submission.
- Trace: accepted/rejected state animates through reviewing -> voting -> final -> Arc proof.
- Reduced motion: CSS animation must degrade to static states.
- No feature-card grid; each core proof surface gets its own full-width operational section.

## Code/Design Patterns To Reuse Or Adapt

- Rounded clipped hero shell from `template-saas-software`.
- Coded dashboard preview instead of static screenshots.
- Inline proof/status pills from `nexora-automation`.
- Dark bottom-left authority and high-contrast status accents from `sentinel-ai`.
- Canvas/ambient motion treatment inspired by Larinova's `WarpField`, adapted as a lightweight committee trace field.

## Visual QA Acceptance Criteria

- Route `/` passes screenshots at 375, 768, and 1440 widths.
- No overlapping text, clipped controls, tiny tap targets, or generic placeholder content.
- Application form is usable on mobile without horizontal overflow.
- Arc proof state is visually distinguishable as `fixture`, `ready`, `broadcast`, or `blocked`.
- Marketing copy never implies real transaction/payment proof unless the proof exists.

## Visual QA Evidence

- Production screenshots captured through `agent-browser` at 1440, 768, and 375 widths under `outputs/visual-qa/`.
- The required `/polish` M2 Playwright workflow was attempted but blocked by SSH timeout to `m2worker`; see the saved Playwright CLI report path in `PROGRESS.md` and `outputs/builder-report.md`.
