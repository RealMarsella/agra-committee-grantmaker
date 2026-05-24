const baseUrl = process.env.AGRA_QA_URL ?? "http://localhost:3003";
const outputDir =
  process.env.AGRA_QA_OUTPUT_DIR ?? "outputs/visual-qa-hardening";

await import("node:fs").then(({ mkdirSync }) =>
  mkdirSync(outputDir, { recursive: true }),
);

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

function qaInput(width) {
  return {
    applicantName: `Hardening QA ${width}`,
    projectName: `Hardening Visual QA ${width}`,
    region: "Austin, USA",
    walletAddress: "0x7a379b1f02D9618f917B5D268a81e3f6CDA220e5",
    proofUrl:
      "https://github.com/gabrielantonyxaviour/agra-committee-grantmaker",
    impactStatement:
      "A public open source grant proof desk for developer communities that turns agent decisions into readable public reports and reusable education material.",
    riskNotes: "Public repository proof, no custody request, no private keys.",
  };
}

export async function run({ page }) {
  const browserErrors = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      browserErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    browserErrors.push(`pageerror: ${error.message}`);
  });

  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator(".application-form").waitFor({ state: "visible" });
    await page.waitForTimeout(600);

    const homePath = `${outputDir}/hardening-home-${viewport.width}.png`;
    await page.screenshot({ path: homePath, fullPage: true });

    const input = qaInput(viewport.width);
    await page.getByLabel("Applicant").fill(input.applicantName);
    await page.getByLabel("Project").fill(input.projectName);
    await page.getByLabel("Region").fill(input.region);
    await page.getByLabel("Amount").fill("19");
    await page.getByLabel("Wallet").fill(input.walletAddress);
    await page.getByLabel("Proof URL").fill(input.proofUrl);
    await page.getByLabel("Impact").fill(input.impactStatement);
    await page.getByLabel("Risk notes").fill(input.riskNotes);
    await page.getByRole("button", { name: /run committee/i }).click();
    await page.getByRole("heading", { name: input.projectName }).waitFor();
    await page.waitForTimeout(300);

    const afterPath = `${outputDir}/hardening-after-submit-${viewport.width}.png`;
    await page.screenshot({ path: afterPath, fullPage: true });

    const checks = await page.evaluate(() => {
      const root = document.documentElement;
      const canvas = document.querySelector("canvas.trace-field");
      let canvasNonBlank = false;

      if (canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        const image = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (image) {
          for (let index = 3; index < image.data.length; index += 64) {
            if (image.data[index] > 0) {
              canvasNonBlank = true;
              break;
            }
          }
        }
      }

      return {
        documentWidth: root.scrollWidth,
        viewportWidth: root.clientWidth,
        horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
        canvasNonBlank,
      };
    });

    results.push({
      viewport,
      homePath,
      afterPath,
      ...checks,
    });
  }

  return {
    baseUrl,
    results,
    browserErrors,
  };
}
