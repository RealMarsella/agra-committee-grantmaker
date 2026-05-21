import { evaluateApplication } from "./committee";
import type { GrantApplication, GrantApplicationInput } from "./types";

const fixtureInputs: Array<
  GrantApplicationInput & { id: string; submittedAt: string }
> = [
  {
    id: "agra-001",
    submittedAt: "2026-05-21T00:58:12Z",
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
  },
  {
    id: "agra-002",
    submittedAt: "2026-05-21T01:02:38Z",
    applicantName: "Milo Hart",
    projectName: "Guaranteed Airdrop Autopilot",
    region: "Berlin, Europe",
    walletAddress: "0x3B453aaB8D01bb6f9b53aa7EF2A3E43c9A100d41",
    requestedAmount: 40,
    requestedCurrency: "EURC",
    impactStatement:
      "The project claims it can generate guaranteed return airdrop routes for private wallets and asks for money before releasing public proof.",
    proofUrl: "https://example.com/placeholder-proof",
    riskNotes:
      "Guaranteed return language and private key workflow mentioned in the request.",
  },
  {
    id: "agra-003",
    submittedAt: "2026-05-21T01:06:44Z",
    applicantName: "Dana Quill",
    projectName: "Public Agent Incident Notebook",
    region: "Toronto, Canada",
    walletAddress: "0xA569C62d7b54d5A38e6a6780bc5817D4b0c0d756",
    requestedAmount: 75,
    requestedCurrency: "USDC",
    impactStatement:
      "A public incident notebook for agent failures, prompt-injection examples, and wallet safety checklists. It is open source and designed for developer educators running community workshops.",
    proofUrl: "https://github.com/gabrielantonyxaviour",
    riskNotes:
      "Legitimate public-good target, but the first request is above the treasury cap.",
  },
];

export function createApplication(
  input: GrantApplicationInput,
  submittedAt = new Date().toISOString(),
): GrantApplication {
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
    decision: evaluateApplication(input),
  };
}

export function getSeedApplications(): GrantApplication[] {
  return fixtureInputs.map(({ id, submittedAt, ...input }) => ({
    id,
    submittedAt,
    ...input,
    decision: evaluateApplication(input),
  }));
}

export const canonicalApplication = fixtureInputs[0];
