import {
  ARC_EXPLORER,
  ARC_TESTNET_CHAIN_ID,
  DEMO_REGISTRY_ADDRESS,
  DEMO_TX_HASH,
  EURC_ADDRESS,
  TREASURY_CAP_USDC,
  USDC_ADDRESS,
} from "./constants";
import { sha256Hex } from "./hash";
import type {
  ArcProof,
  CommitteeVote,
  GrantApplicationInput,
  GrantDecision,
  GrantVerdict,
} from "./types";

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

function publicGoodsVote(input: GrantApplicationInput): CommitteeVote {
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

function safetyVote(input: GrantApplicationInput): CommitteeVote {
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

function treasuryVote(input: GrantApplicationInput): CommitteeVote {
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

function chooseCurrency(input: GrantApplicationInput): "USDC" | "EURC" {
  const region = input.region.toLowerCase();
  const asksEurc =
    input.requestedCurrency === "EURC" || region.includes("europe");
  return asksEurc && process.env.AGRA_EURC_ENABLED === "1" ? "EURC" : "USDC";
}

function makeProof(
  decision: GrantVerdict,
  currency: "USDC" | "EURC",
): ArcProof {
  const tokenAddress = currency === "EURC" ? EURC_ADDRESS : USDC_ADDRESS;
  const registryAddress = process.env.DECISION_REGISTRY_ADDRESS;
  if (registryAddress) {
    return {
      status: "ready",
      chainId: ARC_TESTNET_CHAIN_ID,
      registryAddress,
      tokenAddress,
      tokenSymbol: currency,
      note: "Registry is configured; run npm run replay:broadcast after funding to emit the real event.",
    };
  }
  return {
    status: decision === "accepted" ? "fixture" : "blocked",
    chainId: ARC_TESTNET_CHAIN_ID,
    registryAddress: DEMO_REGISTRY_ADDRESS,
    transactionHash: decision === "accepted" ? DEMO_TX_HASH : undefined,
    explorerUrl:
      decision === "accepted"
        ? `${ARC_EXPLORER}/tx/${DEMO_TX_HASH}`
        : undefined,
    tokenAddress,
    tokenSymbol: currency,
    note:
      decision === "accepted"
        ? "Fixture tx hash shown as demo data; no Arc transaction exists until Circle faucet funding is available."
        : "No transaction is produced for rejected or blocked decisions.",
  };
}

export function evaluateApplication(
  input: GrantApplicationInput,
): GrantDecision {
  const started = Date.now();
  const votes = [
    publicGoodsVote(input),
    safetyVote(input),
    treasuryVote(input),
  ];
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
  const evidenceHash = sha256Hex({ input, votes });
  const traceHash = sha256Hex({
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
    wallClockSeconds: Math.max(
      1,
      Math.round((Date.now() - started) / 1000) + 11,
    ),
    votes,
    arcProof: makeProof(verdict, payoutCurrency),
  };
}
