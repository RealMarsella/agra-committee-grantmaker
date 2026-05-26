import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arcTestnet } from "viem/chains";
import {
  ARC_EXPLORER,
  ARC_RPC_URL,
  ARC_TESTNET_CHAIN_ID,
  DECISION_REGISTRY_ADDRESS,
  EURC_ADDRESS,
  REGISTRY_DEPLOY_BLOCK,
  USDC_ADDRESS,
} from "./constants";
import { sha256Hex } from "./hash";
import type { ArcProof, GrantApplication } from "./types";

// USDC is 6 decimals on Arc Testnet (verified live via `npm run arc:check`).
const USDC_DECIMALS = 6;

const erc20Abi = parseAbi(["function decimals() view returns (uint8)"]);

export const decisionRegistryAbi = parseAbi([
  "event DecisionRecorded(bytes32 indexed applicationId, string verdict, bytes32 evidenceHash, bytes32 traceHash, address indexed applicant, uint256 amount, address token)",
  "function recordDecision(bytes32 applicationId, string verdict, bytes32 evidenceHash, bytes32 traceHash, address applicant, uint256 amount, address token)",
  "function traces(bytes32) view returns (bytes32)",
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

function registryAddress(): `0x${string}` | undefined {
  return DECISION_REGISTRY_ADDRESS
    ? (DECISION_REGISTRY_ADDRESS as `0x${string}`)
    : undefined;
}

function amountUnits(application: GrantApplication): bigint {
  return BigInt(
    Math.round(application.decision.payoutAmount * 10 ** USDC_DECIMALS),
  );
}

function tokenAddress(application: GrantApplication): `0x${string}` {
  return application.decision.payoutCurrency === "EURC"
    ? EURC_ADDRESS
    : USDC_ADDRESS;
}

/**
 * Autonomously record a committee decision on-chain with the server treasury
 * key (no human click). Returns a real ArcProof — never a fabricated hash.
 */
export async function recordDecisionOnChain(
  application: GrantApplication,
): Promise<ArcProof> {
  const token = tokenAddress(application);
  const base: ArcProof = {
    status: "pending",
    chainId: ARC_TESTNET_CHAIN_ID,
    registryAddress: DECISION_REGISTRY_ADDRESS || undefined,
    tokenAddress: token,
    tokenSymbol: application.decision.payoutCurrency,
    note: "",
  };

  const privateKey = process.env.ARC_PRIVATE_KEY as `0x${string}` | undefined;
  const registry = registryAddress();
  if (!privateKey || !registry) {
    return {
      ...base,
      status: "failed",
      note: "ARC_PRIVATE_KEY or DECISION_REGISTRY_ADDRESS not configured; decision was not recorded on-chain.",
    };
  }

  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: arcTestnet,
    transport: http(ARC_RPC_URL),
  });

  const args = [
    applicationIdBytes32(application),
    application.decision.verdict,
    application.decision.evidenceHash,
    application.decision.traceHash,
    application.walletAddress as `0x${string}`,
    amountUnits(application),
    token,
  ] as const;

  try {
    const { request } = await publicClient.simulateContract({
      address: registry,
      abi: decisionRegistryAbi,
      functionName: "recordDecision",
      args,
      account,
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return {
      ...base,
      status: receipt.status === "success" ? "recorded" : "failed",
      transactionHash: hash,
      explorerUrl: `${ARC_EXPLORER}/tx/${hash}`,
      blockNumber: Number(receipt.blockNumber),
      note:
        receipt.status === "success"
          ? "Committee decision recorded on Arc Testnet by the autonomous treasury signer."
          : "Decision transaction reverted on-chain.",
    };
  } catch (error) {
    const message =
      (error as { shortMessage?: string }).shortMessage ??
      (error as Error).message;
    if (/already recorded/i.test(message)) {
      return {
        ...base,
        status: "recorded",
        note: "Decision was already recorded on-chain for this application id.",
      };
    }
    return {
      ...base,
      status: "failed",
      note: `On-chain record failed: ${message.split("\n")[0]}`,
    };
  }
}

export interface OnChainDecision {
  applicationId: `0x${string}`;
  verdict: string;
  evidenceHash: `0x${string}`;
  traceHash: `0x${string}`;
  applicant: `0x${string}`;
  amount: bigint;
  token: `0x${string}`;
  transactionHash: `0x${string}`;
  blockNumber: bigint;
}

const CHUNK_SIZE = 9_999n;

/** Read every recorded decision straight from the registry's event log. */
export async function readDecisionEvents(): Promise<OnChainDecision[]> {
  const registry = registryAddress();
  if (!registry) return [];

  const latest = await publicClient.getBlockNumber();
  const all: OnChainDecision[] = [];

  for (
    let from = REGISTRY_DEPLOY_BLOCK;
    from <= latest;
    from += CHUNK_SIZE + 1n
  ) {
    const to = from + CHUNK_SIZE > latest ? latest : from + CHUNK_SIZE;
    const logs = await publicClient.getContractEvents({
      address: registry,
      abi: decisionRegistryAbi,
      eventName: "DecisionRecorded",
      fromBlock: from,
      toBlock: to,
    });
    for (const log of logs) {
      all.push({
        applicationId: log.args.applicationId as `0x${string}`,
        verdict: log.args.verdict as string,
        evidenceHash: log.args.evidenceHash as `0x${string}`,
        traceHash: log.args.traceHash as `0x${string}`,
        applicant: log.args.applicant as `0x${string}`,
        amount: (log.args.amount ?? 0n) as bigint,
        token: log.args.token as `0x${string}`,
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
      });
    }
  }
  return all;
}
