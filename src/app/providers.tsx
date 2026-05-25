"use client";

import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { type Config, type State, WagmiProvider } from "wagmi";
import {
  arcTestnet,
  networks,
  projectId,
  wagmiAdapter,
} from "@/lib/web3/wagmi";

const queryClient = new QueryClient();

if (projectId) {
  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    defaultNetwork: arcTestnet,
    projectId,
    metadata: {
      name: "AGRA",
      description:
        "Autonomous committee-governed capital allocation, settled in USDC on Arc.",
      url: "https://agra-committee-grantmaker.vercel.app",
      icons: ["https://agra-committee-grantmaker.vercel.app/icon.svg"],
    },
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent": "#54d3a2",
      "--w3m-border-radius-master": "3px",
      "--w3m-font-family": "Sora, sans-serif",
    },
    // Wallet-native committee: no email/social custody, only real EVM wallets.
    features: { analytics: false, email: false, socials: [], swaps: false },
  });
}

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
