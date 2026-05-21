import { config } from "dotenv";
import {
  applicationIdBytes32,
  broadcastDecision,
  encodeDecisionCall,
} from "../src/lib/agra/arc";
import {
  createApplication,
  canonicalApplication,
} from "../src/lib/agra/fixtures";
import { shortHash } from "../src/lib/agra/format";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const application = createApplication(
  canonicalApplication,
  canonicalApplication.submittedAt,
);
const encodedCall = encodeDecisionCall(application);

console.log("AGRA canonical replay");
console.log(
  JSON.stringify(
    {
      applicationId: application.id,
      onchainApplicationId: applicationIdBytes32(application),
      applicant: application.applicantName,
      project: application.projectName,
      verdict: application.decision.verdict,
      payoutAmount: application.decision.payoutAmount,
      payoutCurrency: application.decision.payoutCurrency,
      averageScore: application.decision.averageScore,
      traceHash: application.decision.traceHash,
      evidenceHash: application.decision.evidenceHash,
      traceShort: shortHash(application.decision.traceHash),
      encodedCall,
      proofStatus: application.decision.arcProof.status,
      proofNote: application.decision.arcProof.note,
    },
    null,
    2,
  ),
);

if (process.env.AGRA_BROADCAST === "1") {
  const result = await broadcastDecision(application);
  console.log("Broadcast result");
  console.log(
    JSON.stringify(
      result,
      (_, value) => (typeof value === "bigint" ? value.toString() : value),
      2,
    ),
  );
} else {
  console.log(
    "Broadcast skipped. Run npm run replay:broadcast after Arc funding and registry deployment.",
  );
}
