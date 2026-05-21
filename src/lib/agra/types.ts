export type GrantVerdict = "accepted" | "rejected" | "pending";

export type ProofStatus = "fixture" | "ready" | "broadcast" | "blocked";

export type CommitteeRole = "public_goods" | "safety" | "treasury";

export interface GrantApplicationInput {
  applicantName: string;
  projectName: string;
  region: string;
  walletAddress: string;
  requestedAmount: number;
  requestedCurrency: "USDC" | "EURC";
  impactStatement: string;
  proofUrl: string;
  riskNotes: string;
}

export interface GrantApplication extends GrantApplicationInput {
  id: string;
  submittedAt: string;
  decision: GrantDecision;
}

export interface CommitteeVote {
  role: CommitteeRole;
  name: string;
  score: number;
  verdict: GrantVerdict;
  reason: string;
  concerns: string[];
  recommendedAmount: number;
}

export interface ArcProof {
  status: ProofStatus;
  chainId: number;
  registryAddress?: string;
  transactionHash?: string;
  explorerUrl?: string;
  tokenAddress: string;
  tokenSymbol: "USDC" | "EURC";
  note: string;
}

export interface GrantDecision {
  verdict: GrantVerdict;
  payoutAmount: number;
  payoutCurrency: "USDC" | "EURC";
  averageScore: number;
  disagreement: number;
  refusalReason?: string;
  evidenceHash: `0x${string}`;
  traceHash: `0x${string}`;
  wallClockSeconds: number;
  votes: CommitteeVote[];
  arcProof: ArcProof;
}
