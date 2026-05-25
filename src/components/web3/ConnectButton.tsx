"use client";

import { useAppKit } from "@reown/appkit/react";
import { AlertTriangle, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { ARC_TESTNET_CHAIN_ID } from "@/lib/agra/constants";

function shortAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onArc = chainId === ARC_TESTNET_CHAIN_ID;
  const { data: balance } = useBalance({
    address,
    chainId: ARC_TESTNET_CHAIN_ID,
    query: { enabled: Boolean(address) && onArc },
  });

  if (!mounted) {
    return (
      <button className="connect-btn" type="button" disabled>
        <Wallet size={16} /> Connect wallet
      </button>
    );
  }

  if (!isConnected) {
    return (
      <button className="connect-btn" type="button" onClick={() => open()}>
        <Wallet size={16} /> Connect wallet
      </button>
    );
  }

  if (!onArc) {
    return (
      <button
        className="connect-btn wrong-chain"
        type="button"
        disabled={isSwitching}
        onClick={() => switchChain({ chainId: ARC_TESTNET_CHAIN_ID })}
      >
        <AlertTriangle size={16} />
        {isSwitching ? "Switching…" : "Switch to Arc Testnet"}
      </button>
    );
  }

  const balanceLabel = balance
    ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(3)} ${balance.symbol}`
    : "… USDC";

  return (
    <div className="wallet-cluster">
      <span className="balance-pill" title="Native USDC balance on Arc Testnet">
        {balanceLabel}
      </span>
      <button
        className="connect-btn connected"
        type="button"
        onClick={() => open({ view: "Account" })}
      >
        <img
          alt=""
          className="wallet-avatar"
          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${address}`}
        />
        {address ? shortAddress(address) : "Account"}
      </button>
    </div>
  );
}
