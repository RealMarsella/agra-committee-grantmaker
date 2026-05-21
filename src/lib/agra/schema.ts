import { isAddress } from "viem";
import { z } from "zod";

export const applicationSchema = z.object({
  applicantName: z.string().trim().min(2).max(80),
  projectName: z.string().trim().min(2).max(100),
  region: z.string().trim().min(2).max(80),
  walletAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Use an EVM wallet address")
    .refine(
      (value) => isAddress(value),
      "Use a valid checksummed or lowercase EVM wallet",
    ),
  requestedAmount: z.coerce.number().positive().max(250),
  requestedCurrency: z.enum(["USDC", "EURC"]).default("USDC"),
  impactStatement: z.string().trim().min(40).max(900),
  proofUrl: z.string().trim().url().max(220),
  riskNotes: z.string().trim().max(500).default(""),
});

export type ApplicationPayload = z.infer<typeof applicationSchema>;
