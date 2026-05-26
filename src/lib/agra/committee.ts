import {
  ARC_TESTNET_CHAIN_ID,
  DECISION_REGISTRY_ADDRESS,
  EURC_ADDRESS,
  TREASURY_CAP_USDC,
  USDC_ADDRESS,
} from "./constants";
import { sha256Hex } from "./hash";
import { queryCommitteeAgent } from "./llm";
import type {
  ArcProof,
  CommitteeVote,
  GrantApplicationInput,
  GrantDecision,
  GrantVerdict,
} from "./types";

// ─── System Prompts ──────────────────────────────────────────────────────────

const PUBLIC_GOODS_PROMPT = `You are the Public Goods Agent on the AGRA grant committee. Your mandate is to maximize impact per dollar of public funding.

Score the grant application from 0 to 100 based on how well it serves a concrete public good.

SCORING CRITERIA (weight these):
- Specific beneficiary population identified (+15)
- Open-source commitment with inspectable repo (+15)
- Educational value or knowledge creation (+10)
- Measurable output or deliverable (+15)
- Developer/community benefit (+10)
- Clear timeline and scope (+10)

PENALTIES:
- Vague impact claims (-20)
- No clear audience or beneficiary (-15)
- Pure marketing with no public artifact (-25)
- No inspectable deliverable (-20)

VERDICT RULES:
- Score 72+ → verdict "accepted"
- Score 60-71 → verdict "pending"
- Below 60 → verdict "rejected"

For recommendedAmount: suggest the full requested amount if impact justifies it, or reduce proportionally if impact is weak. Never exceed ${TREASURY_CAP_USDC} USDC.

Respond ONLY with the JSON object.`;

const SAFETY_PROMPT = `You are the Safety Agent on the AGRA grant committee. Your mandate is refusal authority — you protect the treasury from fraud, exploits, and harmful uses.

HARD VETO (score 0, verdict "rejected", recommendedAmount 0):
These trigger IMMEDIATE rejection regardless of other factors:
- Requests involving private keys or seed phrases
- Promises of guaranteed returns or yield
- Withdrawal schemes or fund extraction patterns
- Airdrop farming or sybil activity
- Ponzi/pyramid/MLM language
- Token launches without substantive product
- Requests for custody of user funds

MEDIUM RISK (penalize 15-30 points but don't auto-veto):
- Anonymous team with no verifiable identity
- No proof URL or broken proof link
- Marketing-only project with no technical deliverable
- Speculative or unverifiable claims
- Unclear fund usage / no budget breakdown

POSITIVE SIGNALS (reward 10-20 points):
- HTTPS proof URL that resolves to a real repository or site
- Transparent team with verifiable identities
- Clear deliverables with timeline
- No custody of user funds
- Educational or research focus

BASE SCORE: Start at 65. Add/subtract based on signals above.

VERDICT RULES:
- Hard veto triggers → score 0, verdict "rejected"
- Score 72+ → verdict "accepted"
- Score 60-71 → verdict "pending"
- Below 60 → verdict "rejected"

YOUR REJECTION OVERRIDES ALL OTHER AGENTS. Be vigilant but fair.

Respond ONLY with the JSON object.`;

const TREASURY_PROMPT = `You are the Treasury Agent on the AGRA grant committee. Your mandate is capital discipline — you enforce spending caps and evaluate cost-reasonableness.

POLICY RULES:
- Maximum grant size: ${TREASURY_CAP_USDC} USDC (hard cap, never recommend more)
- If requested amount exceeds ${TREASURY_CAP_USDC} USDC → verdict "pending", recommendedAmount = ${TREASURY_CAP_USDC}
- EURC requests get extra scrutiny (EURC is gated until live proof exists) — penalize 8 points

COST-REASONABLENESS:
- Is the requested amount proportional to the proposed work?
- Would a reasonable person pay this amount for the described deliverable?
- Is the budget breakdown (if provided) sensible?
- For amounts under ${TREASURY_CAP_USDC} USDC: most small educational/open-source projects are reasonable

SCORING:
- Start at 82 if amount is within cap
- Start at 58 if amount exceeds cap (forces "pending")
- Adjust +/- 10 based on cost-reasonableness
- EURC penalty: -8

VERDICT RULES:
- Amount over cap → verdict "pending" (regardless of score)
- Score 72+ → verdict "accepted"
- Score 60-71 → verdict "pending"
- Below 60 → verdict "rejected"

For recommendedAmount: always cap at ${TREASURY_CAP_USDC} USDC maximum.

Respond ONLY with the JSON object.`;

// ─── Deterministic Fallbacks (original arithmetic logic) ─────────────────────

const positiveSignals = [
  "open source",
  "public",
  "education",
  "research",
  "developer",
  "local",
  "safety",
  "agent",
  "community",
  "grant",
];

const severeRiskSignals = [
  "private key",
  "guaranteed return",
  "withdrawal",
  "airdrop farm",
];
const mediumRiskSignals = [
  "unclear",
  "anonymous",
  "no proof",
  "marketing only",
  "speculative",
];

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function textScore(text: string): number {
  const lower = text.toLowerCase();
  const lengthBonus = Math.min(20, Math.floor(text.length / 35));
  const signalBonus = positiveSignals.reduce(
    (total, signal) => total + (lower.includes(signal) ? 4 : 0),
    0,
  );
  return clamp(42 + lengthBonus + signalBonus);
}

function isNegatedSignal(text: string, index: number): boolean {
  const prefix = text.slice(Math.max(0, index - 28), index);
  return (
    /\b(no|not|without|never)\s+$/.test(prefix) ||
    /\bdoes\s+not\s+(ask|request|need)\s+(for\s+)?$/.test(prefix)
  );
}

function hasRisk(text: string, signals: string[]): boolean {
  const lower = text.toLowerCase();
  return signals.some((signal) => {
    let index = lower.indexOf(signal);
    while (index !== -1) {
      if (!isNegatedSignal(lower, index)) return true;
      index = lower.indexOf(signal, index + signal.length);
    }
    return false;
  });
}

function voteVerdict(score: number, veto = false): GrantVerdict {
  if (veto) return "rejected";
  if (score >= 72) return "accepted";
  if (score >= 60) return "pending";
  return "rejected";
}

function fallbackPublicGoodsVote(input: GrantApplicationInput): CommitteeVote {
  const score = textScore(input.impactStatement);
  return {
    role: "public_goods",
    name: "Public Goods Agent",
    score,
    verdict: voteVerdict(score),
    reason:
      score >= 72
        ? "The request names a concrete public-good audience and an inspectable output."
        : "The impact case needs a sharper public beneficiary and proof of use.",
    concerns:
      score >= 72
        ? []
        : ["Impact is not yet specific enough for autonomous payout."],
    recommendedAmount: Math.min(input.requestedAmount, TREASURY_CAP_USDC),
  };
}

function fallbackSafetyVote(input: GrantApplicationInput): CommitteeVote {
  const severe = hasRisk(input.riskNotes, severeRiskSignals);
  const medium = hasRisk(input.riskNotes, mediumRiskSignals);
  const proofBonus = input.proofUrl.startsWith("https://") ? 22 : 4;
  const score = clamp(48 + proofBonus - (severe ? 70 : 0) - (medium ? 18 : 0));
  return {
    role: "safety",
    name: "Safety Agent",
    score,
    verdict: voteVerdict(score, severe),
    reason: severe
      ? "Safety veto: the notes contain a prohibited or high-risk funding signal."
      : "The request has a public proof link and no critical safety trigger.",
    concerns: [
      ...(medium ? ["Risk notes include ambiguity that needs follow-up."] : []),
      ...(severe ? ["Autonomous disbursement blocked by safety policy."] : []),
    ],
    recommendedAmount: severe
      ? 0
      : Math.min(input.requestedAmount, TREASURY_CAP_USDC),
  };
}

function fallbackTreasuryVote(input: GrantApplicationInput): CommitteeVote {
  const overCap = input.requestedAmount > TREASURY_CAP_USDC;
  const currencyPenalty = input.requestedCurrency === "EURC" ? 8 : 0;
  const score = clamp(82 - (overCap ? 24 : 0) - currencyPenalty);
  return {
    role: "treasury",
    name: "Treasury Agent",
    score,
    verdict: overCap ? "pending" : voteVerdict(score),
    reason: overCap
      ? `Requested amount exceeds the ${TREASURY_CAP_USDC} USDC demo cap, so the agent caps payout.`
      : "Requested amount fits the current treasury policy.",
    concerns: [
      ...(overCap ? ["Amount capped by policy."] : []),
      ...(input.requestedCurrency === "EURC"
        ? ["EURC remains gated until live Arc transfer proof exists."]
        : []),
    ],
    recommendedAmount: Math.min(input.requestedAmount, TREASURY_CAP_USDC),
  };
}

// ─── LLM-Backed Agent Functions ─────────────────────────────────────────────

function formatApplicationForLLM(input: GrantApplicationInput): string {
  return `GRANT APPLICATION:
- Applicant: ${input.applicantName}
- Project: ${input.projectName}
- Region: ${input.region}
- Wallet: ${input.walletAddress}
- Requested Amount: ${input.requestedAmount} ${input.requestedCurrency}
- Impact Statement: ${input.impactStatement}
- Proof URL: ${input.proofUrl}
- Risk Notes: ${input.riskNotes}`;
}

async function publicGoodsVote(
  input: GrantApplicationInput,
): Promise<CommitteeVote> {
  try {
    const response = await queryCommitteeAgent(
      "public_goods",
      PUBLIC_GOODS_PROMPT,
      formatApplicationForLLM(input),
    );
    return {
      role: "public_goods",
      name: "Public Goods Agent",
      score: response.score,
      verdict: response.verdict,
      reason: response.reason,
      concerns: response.concerns,
      recommendedAmount: Math.min(
        response.recommendedAmount,
        TREASURY_CAP_USDC,
      ),
    };
  } catch (err) {
    console.warn("[AGRA] Public Goods Agent LLM failed, using fallback:", err);
    return fallbackPublicGoodsVote(input);
  }
}

async function safetyVote(
  input: GrantApplicationInput,
): Promise<CommitteeVote> {
  try {
    const response = await queryCommitteeAgent(
      "safety",
      SAFETY_PROMPT,
      formatApplicationForLLM(input),
    );
    return {
      role: "safety",
      name: "Safety Agent",
      score: response.score,
      verdict: response.verdict,
      reason: response.reason,
      concerns: response.concerns,
      recommendedAmount:
        response.verdict === "rejected"
          ? 0
          : Math.min(response.recommendedAmount, TREASURY_CAP_USDC),
    };
  } catch (err) {
    console.warn("[AGRA] Safety Agent LLM failed, using fallback:", err);
    return fallbackSafetyVote(input);
  }
}

async function treasuryVote(
  input: GrantApplicationInput,
): Promise<CommitteeVote> {
  try {
    const response = await queryCommitteeAgent(
      "treasury",
      TREASURY_PROMPT,
      formatApplicationForLLM(input),
    );
    return {
      role: "treasury",
      name: "Treasury Agent",
      score: response.score,
      verdict: response.verdict,
      reason: response.reason,
      concerns: response.concerns,
      recommendedAmount: Math.min(
        response.recommendedAmount,
        TREASURY_CAP_USDC,
      ),
    };
  } catch (err) {
    console.warn("[AGRA] Treasury Agent LLM failed, using fallback:", err);
    return fallbackTreasuryVote(input);
  }
}

// ─── Currency Selection ──────────────────────────────────────────────────────

function chooseCurrency(input: GrantApplicationInput): "USDC" | "EURC" {
  const region = input.region.toLowerCase();
  const asksEurc =
    input.requestedCurrency === "EURC" || region.includes("europe");
  return asksEurc && process.env.AGRA_EURC_ENABLED === "1" ? "EURC" : "USDC";
}

// ─── Provisional Proof ───────────────────────────────────────────────────────

function provisionalProof(currency: "USDC" | "EURC"): ArcProof {
  return {
    status: "pending",
    chainId: ARC_TESTNET_CHAIN_ID,
    registryAddress: DECISION_REGISTRY_ADDRESS || undefined,
    tokenAddress: currency === "EURC" ? EURC_ADDRESS : USDC_ADDRESS,
    tokenSymbol: currency,
    note: "Awaiting on-chain record on Arc Testnet.",
  };
}

// ─── Main Evaluation (async, parallel LLM calls) ────────────────────────────

export async function evaluateApplication(
  input: GrantApplicationInput,
): Promise<GrantDecision> {
  const started = Date.now();

  // Run all 3 agents in parallel for speed
  const votes = await Promise.all([
    publicGoodsVote(input),
    safetyVote(input),
    treasuryVote(input),
  ]);

  const scores = votes.map((vote) => vote.score);
  const averageScore = clamp(
    scores.reduce((sum, score) => sum + score, 0) / scores.length,
  );
  const disagreement = Math.max(...scores) - Math.min(...scores);
  const safetyRejected = votes.some(
    (vote) => vote.role === "safety" && vote.verdict === "rejected",
  );
  const treasuryPending = votes.some(
    (vote) => vote.role === "treasury" && vote.verdict === "pending",
  );
  const verdict: GrantVerdict = safetyRejected
    ? "rejected"
    : averageScore >= 72
      ? "accepted"
      : treasuryPending || averageScore >= 60
        ? "pending"
        : "rejected";
  const payoutCurrency = chooseCurrency(input);
  const payoutAmount =
    verdict === "accepted"
      ? Math.min(...votes.map((vote) => vote.recommendedAmount))
      : 0;
  const refusalReason =
    verdict === "rejected"
      ? votes.find((vote) => vote.verdict === "rejected")?.reason
      : undefined;
  const evidenceHash = await sha256Hex({ input, votes });
  const traceHash = await sha256Hex({
    evidenceHash,
    verdict,
    payoutAmount,
    payoutCurrency,
    averageScore,
    disagreement,
  });

  return {
    verdict,
    payoutAmount,
    payoutCurrency,
    averageScore,
    disagreement,
    refusalReason,
    evidenceHash,
    traceHash,
    wallClockSeconds: Math.max(1, Math.round((Date.now() - started) / 1000)),
    votes,
    arcProof: provisionalProof(payoutCurrency),
  };
}
