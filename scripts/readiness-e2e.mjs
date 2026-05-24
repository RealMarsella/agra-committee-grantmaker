const baseUrl = process.env.AGRA_QA_URL ?? "http://localhost:3003";
const outputDir = process.env.AGRA_QA_OUTPUT_DIR ?? "outputs/readiness-e2e";

await import("node:fs").then(({ mkdirSync }) =>
  mkdirSync(outputDir, { recursive: true }),
);

const qaInput = {
  applicantName: "Readiness E2E Applicant",
  projectName: `Readiness E2E ${Date.now()}`,
  region: "Bengaluru, India",
  walletAddress: "0x7a379b1f02D9618f917B5D268a81e3f6CDA220e5",
  proofUrl: "https://github.com/gabrielantonyxaviour/agra-committee-grantmaker",
  impactStatement:
    "A public open source readiness proof desk that turns Arc grant decisions into readable reports for public-good builders and judge review.",
  riskNotes: "Public repository proof, no custody request, no private keys.",
};

export async function run({ page }) {
  const browserErrors = [];
  const expectedBrowserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = `${message.type()}: ${message.text()}`;
      if (text.includes("400")) {
        expectedBrowserErrors.push(text);
      } else {
        browserErrors.push(text);
      }
    }
  });
  page.on("pageerror", (error) => {
    browserErrors.push(`pageerror: ${error.message}`);
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator(".application-form").waitFor({ state: "visible" });

  await page.getByRole("button", { name: /connect and sign/i }).click();
  const walletStatus = await page
    .locator(".wallet-auth-panel")
    .innerText({ timeout: 5000 });
  const walletBlockedOrVerified =
    walletStatus.includes("Browser wallet not detected") ||
    walletStatus.includes("Verified") ||
    walletStatus.includes("Wallet is not on Arc Testnet");

  if (!walletBlockedOrVerified) {
    throw new Error(`Unexpected wallet auth state: ${walletStatus}`);
  }

  await page.getByLabel("Wallet").fill("0x123");
  await page.getByRole("button", { name: /run committee/i }).click();
  await page.getByText("Invalid application").waitFor();

  await page.getByLabel("Applicant").fill(qaInput.applicantName);
  await page.getByLabel("Project").fill(qaInput.projectName);
  await page.getByLabel("Region").fill(qaInput.region);
  await page.getByLabel("Amount").fill("21");
  await page.getByLabel("Wallet").fill(qaInput.walletAddress);
  await page.getByLabel("Proof URL").fill(qaInput.proofUrl);
  await page.getByLabel("Impact").fill(qaInput.impactStatement);
  await page.getByLabel("Risk notes").fill(qaInput.riskNotes);
  await page.getByRole("button", { name: /run committee/i }).click();
  await page.getByRole("heading", { name: qaInput.projectName }).waitFor();

  const screenshotPath = `${outputDir}/readiness-primary-flow.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const apiProof = await page.evaluate(async () => {
    const replay = await fetch("/api/replay", { method: "POST" });
    const replayPayload = await replay.json();
    const applications = await fetch("/api/applications");
    const applicationsPayload = await applications.json();

    return {
      replayStatus: replay.status,
      replayVerdict: replayPayload.application?.decision?.verdict,
      replayArcStatus: replayPayload.application?.decision?.arcProof?.status,
      applicationsStatus: applications.status,
      applicationCount: applicationsPayload.applications?.length ?? 0,
    };
  });

  const interactiveSurfaces = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a, button, input, textarea, select"))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text:
          element.textContent?.replace(/\s+/g, " ").trim() ||
          element.getAttribute("aria-label") ||
          element.getAttribute("name") ||
          element.getAttribute("type") ||
          "",
        href:
          element instanceof HTMLAnchorElement
            ? element.getAttribute("href")
            : null,
        disabled:
          element instanceof HTMLButtonElement ||
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
            ? element.disabled
            : false,
      }))
      .filter((item) => item.text || item.href),
  );

  return {
    baseUrl,
    walletStatus,
    apiProof,
    interactiveSurfaces,
    screenshotPath,
    expectedBrowserErrors,
    browserErrors,
  };
}
