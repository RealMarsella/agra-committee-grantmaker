import { describe, expect, it } from "vitest";
import { evaluateApplication } from "./committee";
import { canonicalApplication } from "./fixtures";

describe("AGRA committee", () => {
  it("accepts the canonical public-good grant", () => {
    const decision = evaluateApplication(canonicalApplication);
    expect(decision.verdict).toBe("accepted");
    expect(decision.payoutAmount).toBeGreaterThan(0);
    expect(decision.traceHash).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it("rejects high-risk private-key requests", () => {
    const decision = evaluateApplication({
      ...canonicalApplication,
      riskNotes:
        "Needs private key access and guaranteed return withdrawal route.",
    });
    expect(decision.verdict).toBe("rejected");
    expect(decision.payoutAmount).toBe(0);
    expect(decision.refusalReason).toContain("Safety veto");
  });

  it("caps large accepted requests to the treasury policy", () => {
    const decision = evaluateApplication({
      ...canonicalApplication,
      requestedAmount: 90,
      riskNotes: "Public repo proof, no custody, no private keys.",
    });
    expect(decision.verdict).not.toBe("rejected");
    expect(decision.payoutAmount).toBeLessThanOrEqual(25);
  });
});
