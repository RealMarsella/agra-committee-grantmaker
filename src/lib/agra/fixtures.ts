import { evaluateApplication } from "./committee";
import type { GrantApplication, GrantApplicationInput } from "./types";

export async function createApplication(
  input: GrantApplicationInput,
  submittedAt = new Date().toISOString(),
): Promise<GrantApplication> {
  const id =
    "agra-" +
    Math.abs(
      Array.from(`${input.projectName}-${submittedAt}`).reduce(
        (acc, char) => (acc * 33 + char.charCodeAt(0)) | 0,
        5381,
      ),
    ).toString(16);
  return {
    id,
    submittedAt,
    ...input,
    decision: await evaluateApplication(input),
  };
}

// A single deterministic example used ONLY by the replay proof and the unit
// test (a test vector for reproducibility). It is never loaded into the live
// ledger — the ledger is sourced exclusively from on-chain events + R2.
export const canonicalApplication: GrantApplicationInput = {
  applicantName: "Priya Raman",
  projectName: "Open-source Tamil AI Safety Glossary",
  region: "Chennai, India",
  walletAddress: "0x9d45ad9A6e2B9BF74e64D4990fdd72851a4B8D21",
  requestedAmount: 18,
  requestedCurrency: "USDC",
  impactStatement:
    "We are publishing an open source glossary that helps local students and public-good builders understand AI safety, wallet hygiene, and agent automation in Tamil with reusable examples for developer clubs.",
  proofUrl: "https://github.com/gabrielantonyxaviour",
  riskNotes:
    "Small educational grant with public repository proof and no custody request.",
};
