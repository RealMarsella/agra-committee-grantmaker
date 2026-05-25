"use client";

import { useAppKit } from "@reown/appkit/react";
import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Loader2,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  ARC_EXPLORER,
  ARC_TESTNET_CHAIN_ID,
  USDC_ADDRESS,
} from "@/lib/agra/constants";
import { erc20Abi } from "@/lib/web3/erc20";
import type { GrantApplication } from "@/lib/agra/types";

function revertSummary(message?: string) {
  if (!message) return "Simulation failed.";
  if (/insufficient|exceeds balance|transfer amount/i.test(message)) {
    return "Insufficient USDC in the connected treasury wallet — live settlement is disabled, simulation only.";
  }
  return message.split("\n")[0];
}

export function ArcPayoutPanel({ selected }: { selected: GrantApplication }) {
  const { open } = useAppKit();
  const { address, isConnected, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const onArc = chainId === ARC_TESTNET_CHAIN_ID;

  const grantee = selected.walletAddress as `0x${string}`;
  const isPayout =
    selected.decision.verdict === "accepted" &&
    selected.decision.payoutAmount > 0;

  // LIVE read: USDC token decimals on Arc Testnet.
  const decimalsRead = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "decimals",
    chainId: ARC_TESTNET_CHAIN_ID,
  });
  const decimals = decimalsRead.data;

  // LIVE read: connected treasury wallet's USDC balance.
  const balanceRead = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: ARC_TESTNET_CHAIN_ID,
    query: { enabled: Boolean(address) && onArc },
  });

  const amount = useMemo(() => {
    if (decimals === undefined || !isPayout) return undefined;
    try {
      return parseUnits(selected.decision.payoutAmount.toString(), decimals);
    } catch {
      return undefined;
    }
  }, [decimals, isPayout, selected.decision.payoutAmount]);

  // SIMULATE: the real USDC transfer to the grantee, run against live state.
  const simulation = useSimulateContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: "transfer",
    args: amount !== undefined ? [grantee, amount] : undefined,
    account: address,
    chainId: ARC_TESTNET_CHAIN_ID,
    query: {
      enabled: Boolean(address) && onArc && amount !== undefined && isPayout,
    },
  });

  // WRITE: only ever fired when the simulation proves it will succeed.
  const { writeContract, data: txHash, isPending, reset } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash: txHash });

  const canWrite = Boolean(simulation.data?.request) && !isPending;

  if (!isPayout) {
    return (
      <article className="payout-panel idle" id="payout">
        <div className="payout-head">
          <CircleDashed size={18} />
          <h3>USDC settlement</h3>
        </div>
        <p>
          No payout to settle — the committee did not approve a disbursement for
          this application. Settlement only opens on an accepted decision.
        </p>
      </article>
    );
  }

  const balanceLabel =
    decimals !== undefined && balanceRead.data !== undefined
      ? `${Number(formatUnits(balanceRead.data, decimals)).toFixed(2)} USDC`
      : "—";

  return (
    <article className="payout-panel" id="payout">
      <div className="payout-head">
        <Wallet size={18} />
        <h3>USDC settlement on Arc</h3>
        <span className="live-tag">live read → simulate → write</span>
      </div>

      <div className="payout-reads">
        <div>
          <span>Payout</span>
          <strong>
            {selected.decision.payoutAmount} {selected.decision.payoutCurrency}
          </strong>
        </div>
        <div>
          <span>Grantee</span>
          <strong>
            {grantee.slice(0, 6)}…{grantee.slice(-4)}
          </strong>
        </div>
        <div>
          <span>USDC decimals (live)</span>
          <strong>{decimals ?? "…"}</strong>
        </div>
        <div>
          <span>Treasury balance (live)</span>
          <strong>{onArc ? balanceLabel : "—"}</strong>
        </div>
      </div>

      {!isConnected ? (
        <div className="payout-state disconnected">
          <p>Connect a wallet to read balances and simulate the USDC payout.</p>
          <button className="connect-btn" type="button" onClick={() => open()}>
            <Wallet size={16} /> Connect wallet
          </button>
        </div>
      ) : !onArc ? (
        <div className="payout-state warn">
          <p>
            Wallet is on chain {chainId}. Switch to Arc Testnet (
            {ARC_TESTNET_CHAIN_ID}) to read live state and simulate.
          </p>
          <button
            className="connect-btn wrong-chain"
            type="button"
            disabled={isSwitching}
            onClick={() => switchChain({ chainId: ARC_TESTNET_CHAIN_ID })}
          >
            {isSwitching ? "Switching…" : "Switch to Arc Testnet"}
          </button>
        </div>
      ) : (
        <div className="payout-state">
          {simulation.isLoading ? (
            <p className="sim-line">
              <Loader2 className="spin" size={15} /> Simulating USDC transfer
              against live Arc state…
            </p>
          ) : simulation.error ? (
            <p className="sim-line err">
              <ShieldAlert size={15} />{" "}
              {revertSummary(
                (simulation.error as { shortMessage?: string }).shortMessage ??
                  simulation.error.message,
              )}
            </p>
          ) : simulation.data ? (
            <p className="sim-line ok">
              <CheckCircle2 size={15} /> Simulation succeeded — a live transfer
              of {selected.decision.payoutAmount} USDC to the grantee is valid.
            </p>
          ) : null}

          {receipt.isSuccess && txHash ? (
            <a
              className="proof-link"
              href={`${ARC_EXPLORER}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
            >
              Settled on Arc — view tx <ExternalLink size={14} />
            </a>
          ) : receipt.isLoading && txHash ? (
            <p className="sim-line">
              <Loader2 className="spin" size={15} /> Waiting for Arc
              confirmation…
            </p>
          ) : (
            <button
              className="settle-btn"
              type="button"
              disabled={!canWrite}
              onClick={() => {
                if (simulation.data?.request) {
                  reset();
                  writeContract(simulation.data.request);
                }
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="spin" size={15} /> Confirm in wallet…
                </>
              ) : simulation.error ? (
                "Live settlement disabled — simulation only"
              ) : (
                `Settle ${selected.decision.payoutAmount} USDC payout`
              )}
            </button>
          )}

          {receipt.isError ? (
            <p className="sim-line err">
              <ShieldAlert size={15} /> Transaction failed on chain — no payout
              recorded.
            </p>
          ) : null}
        </div>
      )}
    </article>
  );
}
