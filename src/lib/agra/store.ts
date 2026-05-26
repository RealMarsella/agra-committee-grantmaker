import { formatUnits } from "viem";
import {
  applicationIdBytes32,
  readDecisionEvents,
  recordDecisionOnChain,
  type OnChainDecision,
} from "./arc";
import {
  ARC_EXPLORER,
  ARC_TESTNET_CHAIN_ID,
  DECISION_REGISTRY_ADDRESS,
  EURC_ADDRESS,
} from "./constants";
import { createApplication } from "./fixtures";
import { getRecord, putRecord } from "./r2";
import type { GrantApplication, GrantApplicationInput } from "./types";

const USDC_DECIMALS = 6;

/**
 * Submit a grant: run the committee, record the decision on-chain with the
 * autonomous treasury signer, then persist the off-chain supplement to R2.
 * The returned application carries the real, tx-backed ArcProof.
 */
export async function addApplication(
  input: GrantApplicationInput,
): Promise<GrantApplication> {
  const application = await createApplication(input);
  const arcProof = await recordDecisionOnChain(application);
  application.decision.arcProof = arcProof;
  await putRecord(await applicationIdBytes32(application), application);
  return application;
}

/** Ledger sourced from on-chain DecisionRecorded events, joined to R2 detail. */
export async function listApplications(): Promise<GrantApplication[]> {
  const events = await readDecisionEvents();
  const sorted = [...events].sort((a, b) =>
    Number(b.blockNumber - a.blockNumber),
  );
  const items = await Promise.all(
    sorted.map(async (event) => {
      const stored = await getRecord<GrantApplication>(event.applicationId);
      return stored ?? fromEvent(event);
    }),
  );
  return items;
}

// Minimal record reconstructed purely from an on-chain event when no R2
// supplement is found — keeps the ledger honest about on-chain truth.
function fromEvent(event: OnChainDecision): GrantApplication {
  const currency =
    event.token.toLowerCase() === EURC_ADDRESS.toLowerCase() ? "EURC" : "USDC";
  const amount = Number(formatUnits(event.amount, USDC_DECIMALS));
  return {
    id: event.applicationId,
    submittedAt: new Date(0).toISOString(),
    applicantName: "On-chain record",
    projectName: "Recorded decision",
    region: "",
    walletAddress: event.applicant,
    requestedAmount: amount,
    requestedCurrency: currency,
    impactStatement: "",
    proofUrl: "",
    riskNotes: "",
    decision: {
      verdict: event.verdict as GrantApplication["decision"]["verdict"],
      payoutAmount: amount,
      payoutCurrency: currency,
      averageScore: 0,
      disagreement: 0,
      evidenceHash: event.evidenceHash,
      traceHash: event.traceHash,
      wallClockSeconds: 0,
      votes: [],
      arcProof: {
        status: "recorded",
        chainId: ARC_TESTNET_CHAIN_ID,
        registryAddress: DECISION_REGISTRY_ADDRESS || undefined,
        transactionHash: event.transactionHash,
        explorerUrl: `${ARC_EXPLORER}/tx/${event.transactionHash}`,
        blockNumber: Number(event.blockNumber),
        tokenAddress: event.token,
        tokenSymbol: currency,
        note: "Reconstructed from the on-chain DecisionRecorded event.",
      },
    },
  };
}
