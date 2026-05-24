"use client";

import { ShieldCheck, WalletCards } from "lucide-react";
import { useState } from "react";
import {
  buildWalletAuthMessage,
  REQUIRED_WALLET_CHAIN_HEX,
  REQUIRED_WALLET_CHAIN_ID,
} from "@/lib/agra/auth";

type WalletAuthPanelProps = {
  walletAddress: string;
  onVerified: (address: string) => void;
};

type WalletState = "idle" | "connecting" | "verified" | "blocked";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Wallet proof failed.";
}

function getEthereumProvider(): EthereumProvider | undefined {
  if (typeof window === "undefined") return undefined;
  const candidate = (window as Window & { ethereum?: EthereumProvider })
    .ethereum;
  return candidate;
}

export function WalletAuthPanel({
  walletAddress,
  onVerified,
}: WalletAuthPanelProps) {
  const [state, setState] = useState<WalletState>("idle");
  const [message, setMessage] = useState(
    "No wallet proof recorded for this browser session.",
  );

  async function connectAndSign() {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      setState("blocked");
      setMessage(
        "Browser wallet not detected. Install or unlock an EVM wallet to verify the payout address.",
      );
      return;
    }

    setState("connecting");
    setMessage("Waiting for wallet connection and signature.");

    try {
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const address = accounts[0];

      if (!address) {
        throw new Error("Wallet did not return an account.");
      }

      let chainId = (await ethereum.request({
        method: "eth_chainId",
      })) as string;

      if (chainId.toLowerCase() !== REQUIRED_WALLET_CHAIN_HEX) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: REQUIRED_WALLET_CHAIN_HEX }],
          });
          chainId = REQUIRED_WALLET_CHAIN_HEX;
        } catch {
          setState("blocked");
          setMessage(
            `Wallet is not on Arc Testnet. Switch to chain ${REQUIRED_WALLET_CHAIN_ID} before signing.`,
          );
          return;
        }
      }

      const nonce = crypto.randomUUID();
      const authMessage = buildWalletAuthMessage({
        address,
        chainId: REQUIRED_WALLET_CHAIN_ID,
        nonce,
      });
      const signature = (await ethereum.request({
        method: "personal_sign",
        params: [authMessage, address],
      })) as string;

      const response = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          chainId: REQUIRED_WALLET_CHAIN_ID,
          nonce,
          signature,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.verified) {
        throw new Error(payload.error ?? "Wallet signature was not verified.");
      }

      onVerified(payload.address);
      setState("verified");
      setMessage(`Verified ${payload.address} on Arc Testnet.`);
    } catch (error) {
      setState("blocked");
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <section className={`wallet-auth-panel ${state}`}>
      <div>
        <span className="section-kicker">Wallet proof</span>
        <p>{message}</p>
      </div>
      <button
        className="wallet-auth-button"
        disabled={state === "connecting"}
        onClick={connectAndSign}
        type="button"
      >
        {state === "verified" ? (
          <ShieldCheck size={16} />
        ) : (
          <WalletCards size={16} />
        )}
        {state === "connecting"
          ? "Awaiting signature"
          : state === "verified"
            ? "Verified"
            : "Connect and sign"}
      </button>
      {walletAddress ? (
        <span className="wallet-auth-address">{walletAddress}</span>
      ) : null}
    </section>
  );
}
