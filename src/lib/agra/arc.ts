import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseAbi,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arcTestnet } from "viem/chains";
import { ARC_RPC_URL, EURC_ADDRESS, USDC_ADDRESS } from "./constants";
import { sha256Hex } from "./hash";
import type { GrantApplication } from "./types";

const erc20Abi = parseAbi(["function decimals() view returns (uint8)"]);

export const decisionRegistryAbi = parseAbi([
  "event DecisionRecorded(bytes32 indexed applicationId, string verdict, bytes32 evidenceHash, bytes32 traceHash, address indexed applicant, uint256 amount, address token)",
  "function recordDecision(bytes32 applicationId, string verdict, bytes32 evidenceHash, bytes32 traceHash, address applicant, uint256 amount, address token)",
]);

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(ARC_RPC_URL),
});

export async function checkArcReadiness() {
  const [chainId, usdcDecimals, eurcDecimals] = await Promise.all([
    publicClient.getChainId(),
    publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "decimals",
    }),
    publicClient.readContract({
      address: EURC_ADDRESS,
      abi: erc20Abi,
      functionName: "decimals",
    }),
  ]);

  return { chainId, usdcDecimals, eurcDecimals };
}

export function applicationIdBytes32(application: GrantApplication) {
  return sha256Hex({ applicationId: application.id });
}

export function encodeDecisionCall(application: GrantApplication) {
  return encodeFunctionData({
    abi: decisionRegistryAbi,
    functionName: "recordDecision",
    args: [
      applicationIdBytes32(application),
      application.decision.verdict,
      application.decision.evidenceHash,
      application.decision.traceHash,
      application.walletAddress as `0x${string}`,
      BigInt(Math.round(application.decision.payoutAmount * 1_000_000)),
      application.decision.payoutCurrency === "EURC"
        ? EURC_ADDRESS
        : USDC_ADDRESS,
    ],
  });
}

export async function broadcastDecision(application: GrantApplication) {
  const privateKey = process.env.ARC_PRIVATE_KEY as `0x${string}` | undefined;
  const registryAddress = process.env.DECISION_REGISTRY_ADDRESS as
    | `0x${string}`
    | undefined;

  if (!privateKey || !registryAddress) {
    return {
      status: "blocked" as const,
      reason: "Set ARC_PRIVATE_KEY and DECISION_REGISTRY_ADDRESS to broadcast.",
    };
  }

  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(ARC_RPC_URL),
  });

  const hash = await walletClient.writeContract({
    address: registryAddress,
    abi: decisionRegistryAbi,
    functionName: "recordDecision",
    args: [
      applicationIdBytes32(application),
      application.decision.verdict,
      application.decision.evidenceHash,
      application.decision.traceHash,
      application.walletAddress as `0x${string}`,
      BigInt(Math.round(application.decision.payoutAmount * 1_000_000)),
      application.decision.payoutCurrency === "EURC"
        ? EURC_ADDRESS
        : USDC_ADDRESS,
    ],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  return { status: "broadcast" as const, hash, receipt };
}
