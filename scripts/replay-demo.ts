import { config } from "dotenv";
import {
  applicationIdBytes32,
  recordDecisionOnChain,
} from "../src/lib/agra/arc";
import {
  canonicalApplication,
  createApplication,
} from "../src/lib/agra/fixtures";
import { shortHash } from "../src/lib/agra/format";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const application = await createApplication(canonicalApplication);

console.log("AGRA canonical replay");
console.log(
  JSON.stringify(
    {
      applicationId: application.id,
      onchainApplicationId: await applicationIdBytes32(application),
      applicant: application.applicantName,
      project: application.projectName,
      verdict: application.decision.verdict,
      payoutAmount: application.decision.payoutAmount,
      payoutCurrency: application.decision.payoutCurrency,
      averageScore: application.decision.averageScore,
      traceHash: application.decision.traceHash,
      evidenceHash: application.decision.evidenceHash,
      traceShort: shortHash(application.decision.traceHash),
    },
    null,
    2,
  ),
);

if (process.env.AGRA_BROADCAST === "1") {
  const proof = await recordDecisionOnChain(application);
  console.log("On-chain record result");
  console.log(
    JSON.stringify(
      proof,
      (_, value) => (typeof value === "bigint" ? value.toString() : value),
      2,
    ),
  );
} else {
  console.log(
    "Record skipped. Run npm run replay:broadcast to record this decision on Arc Testnet.",
  );
}
