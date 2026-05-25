import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { type AppKitNetwork, defineChain } from "@reown/appkit/networks";
import { cookieStorage, createStorage } from "wagmi";
import {
  ARC_EXPLORER,
  ARC_RPC_URL,
  ARC_TESTNET_CHAIN_ID,
} from "@/lib/agra/constants";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

// Arc Testnet — stablecoin-native chain (USDC is the gas/native asset).
// Mirrors viem's built-in arcTestnet definition so client (wagmi) and
// server (viem) agree on chain id, native currency, and explorer.
export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  caipNetworkId: `eip155:${ARC_TESTNET_CHAIN_ID}`,
  chainNamespace: "eip155",
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: { http: [ARC_RPC_URL] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: ARC_EXPLORER },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 0,
    },
  },
  testnet: true,
});

export const networks = [arcTestnet] as [AppKitNetwork, ...AppKitNetwork[]];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [arcTestnet],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
