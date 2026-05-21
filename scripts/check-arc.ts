import { config } from "dotenv";
import { formatUnits } from "viem";
import { checkArcReadiness, publicClient } from "../src/lib/agra/arc";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const wallet = process.env.AGRA_TEST_WALLET_ADDRESS;

const readiness = await checkArcReadiness();
const balance = wallet
  ? await publicClient.getBalance({ address: wallet as `0x${string}` })
  : undefined;

console.log(
  JSON.stringify(
    {
      rpc: process.env.ARC_TESTNET_RPC_URL ?? "https://rpc.testnet.arc.network",
      chainId: readiness.chainId,
      usdcDecimals: readiness.usdcDecimals,
      eurcDecimals: readiness.eurcDecimals,
      wallet: wallet ?? null,
      nativeUsdcGasBalance:
        balance !== undefined
          ? formatUnits(balance, readiness.usdcDecimals)
          : null,
      canBroadcast: Boolean(balance && balance > 0n),
    },
    null,
    2,
  ),
);
