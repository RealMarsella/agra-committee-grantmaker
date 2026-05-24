import { getAddress, isAddress } from "viem";
import { ARC_TESTNET_CHAIN_ID } from "./constants";

export type WalletAuthMessageInput = {
  address: string;
  chainId: number;
  nonce: string;
};

export function buildWalletAuthMessage(input: WalletAuthMessageInput) {
  const address = isAddress(input.address)
    ? getAddress(input.address)
    : input.address;

  return [
    "AGRA Committee-Governed Grantmaker",
    "",
    "Sign to prove control of the applicant payout wallet.",
    `Address: ${address}`,
    `Chain ID: ${input.chainId}`,
    `Nonce: ${input.nonce}`,
    "Purpose: grant-intake-readiness",
    "",
    "This signature does not move funds or approve token spending.",
  ].join("\n");
}

export const REQUIRED_WALLET_CHAIN_ID = ARC_TESTNET_CHAIN_ID;
export const REQUIRED_WALLET_CHAIN_HEX =
  `0x${ARC_TESTNET_CHAIN_ID.toString(16)}` as const;
