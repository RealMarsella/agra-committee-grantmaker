import { NextResponse } from "next/server";
import { getAddress, isAddress, verifyMessage } from "viem";
import { z } from "zod";

export const runtime = "edge";
import {
  buildWalletAuthMessage,
  REQUIRED_WALLET_CHAIN_ID,
} from "@/lib/agra/auth";

const walletAuthSchema = z.object({
  address: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Use an EVM wallet address")
    .refine((value) => isAddress(value), "Use a valid EVM wallet address"),
  chainId: z.coerce.number().int().positive(),
  nonce: z.string().trim().min(8).max(120),
  signature: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]+$/, "Use a hex EVM signature"),
});

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", issues: null },
      { status: 400 },
    );
  }

  const parsed = walletAuthSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid wallet proof", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const address = getAddress(parsed.data.address);

  if (parsed.data.chainId !== REQUIRED_WALLET_CHAIN_ID) {
    return NextResponse.json(
      {
        error: `Wrong network. Switch to Arc Testnet chain ${REQUIRED_WALLET_CHAIN_ID}.`,
        expectedChainId: REQUIRED_WALLET_CHAIN_ID,
        receivedChainId: parsed.data.chainId,
      },
      { status: 400 },
    );
  }

  const message = buildWalletAuthMessage({
    address,
    chainId: parsed.data.chainId,
    nonce: parsed.data.nonce,
  });

  const verified = await verifyMessage({
    address,
    message,
    signature: parsed.data.signature as `0x${string}`,
  });

  if (!verified) {
    return NextResponse.json(
      { error: "Wallet signature does not match the applicant address." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    verified: true,
    address,
    chainId: parsed.data.chainId,
    nonce: parsed.data.nonce,
  });
}
