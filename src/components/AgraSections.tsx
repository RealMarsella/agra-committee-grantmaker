"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GitBranch,
  Landmark,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WalletCards,
  XCircle,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Metric } from "./FormParts";
import { shortHash } from "@/lib/agra/format";
import type {
  GrantApplication,
  GrantDecision,
  GrantVerdict,
} from "@/lib/agra/types";

function verdictIcon(verdict: GrantVerdict) {
  if (verdict === "accepted") return <CheckCircle2 size={16} />;
  if (verdict === "rejected") return <XCircle size={16} />;
  return <Clock3 size={16} />;
}

function verdictLabel(verdict: GrantVerdict) {
  return verdict.charAt(0).toUpperCase() + verdict.slice(1);
}

function decisionSummary(decision: GrantDecision) {
  if (decision.verdict === "accepted") {
    return "Approved within public rubric and treasury cap.";
  }
  if (decision.verdict === "pending") {
    return "Committee did not reject the grant, but treasury policy capped it for follow-up before payout.";
  }
  return (
    decision.refusalReason ??
    "Committee refused autonomous payout under the public rubric."
  );
}

export function Topbar() {
  return (
    <nav className="topbar">
      <a className="brand" href="#top" aria-label="AGRA home">
        <span className="brand-mark">A</span>
        <span>AGRA</span>
      </a>
      <div className="nav-links" aria-label="Status">
        <span>Arc Testnet</span>
        <span>USDC first</span>
        <span>Fixture-labeled</span>
      </div>
      <a className="repo-link" href="#proof">
        Proof path <ArrowRight size={15} />
      </a>
    </nav>
  );
}

export function HeroIntro() {
  return (
    <section className="intro-panel" aria-labelledby="hero-title">
      <div className="eyebrow">
        <Sparkles size={16} /> Autonomous public-goods capital allocator
      </div>
      <h1 id="hero-title">
        AGRA reviews grants, publishes dissent, and pays only when the committee
        clears the risk.
      </h1>
      <p>
        Submit a micro-grant. Three agents vote independently. The app returns a
        trace hash, payout cap, and Arc proof status without a human approval
        click.
      </p>
      <div className="proof-strip">
        <Metric label="Committee agents" value="3" />
        <Metric label="Demo cap" value="25 USDC" />
        <Metric label="Replay command" value="npm run replay" />
      </div>
    </section>
  );
}

export function DecisionSection({ selected }: { selected: GrantApplication }) {
  return (
    <section className="decision-section">
      <div className="decision-header">
        <div>
          <span className="section-kicker">Decision room</span>
          <h2>{selected.projectName}</h2>
        </div>
        <span className={`verdict-pill ${selected.decision.verdict}`}>
          {verdictIcon(selected.decision.verdict)}
          {verdictLabel(selected.decision.verdict)}
        </span>
      </div>
      <div className="decision-grid">
        <article className="trace-card">
          <h3>Committee trace</h3>
          <p>{decisionSummary(selected.decision)}</p>
          <div className="trace-metrics">
            <Metric
              label="Average score"
              value={`${selected.decision.averageScore}/100`}
            />
            <Metric
              label="Disagreement"
              value={`${selected.decision.disagreement} pts`}
            />
            <Metric
              label="Wall clock"
              value={`${selected.decision.wallClockSeconds}s`}
            />
          </div>
          <div className="hash-line">
            <GitBranch size={16} />
            <span>{shortHash(selected.decision.traceHash)}</span>
          </div>
        </article>
        <ArcProofCard selected={selected} />
      </div>
      <div className="agent-row">
        {selected.decision.votes.map((vote) => (
          <article className={`agent-card ${vote.verdict}`} key={vote.role}>
            <div className="agent-icon">
              {vote.role === "public_goods" ? (
                <Landmark />
              ) : vote.role === "safety" ? (
                <ShieldCheck />
              ) : (
                <TimerReset />
              )}
            </div>
            <div>
              <h3>{vote.name}</h3>
              <p>{vote.reason}</p>
              <span>
                {vote.score}/100 - {verdictLabel(vote.verdict)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArcProofCard({ selected }: { selected: GrantApplication }) {
  return (
    <article className="proof-card" id="proof">
      <div className="proof-title">
        <WalletCards size={18} />
        <h3>Arc proof</h3>
      </div>
      <p>{selected.decision.arcProof.note}</p>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{selected.decision.arcProof.status}</dd>
        </div>
        <div>
          <dt>Token</dt>
          <dd>{selected.decision.payoutCurrency}</dd>
        </div>
        <div>
          <dt>Payout</dt>
          <dd>
            {selected.decision.payoutAmount} {selected.decision.payoutCurrency}
          </dd>
        </div>
      </dl>
      {selected.decision.arcProof.explorerUrl ? (
        <a className="proof-link" href={selected.decision.arcProof.explorerUrl}>
          Fixture explorer link <ExternalLink size={15} />
        </a>
      ) : null}
    </article>
  );
}

type LedgerSectionProps = {
  applications: GrantApplication[];
  selectedId?: string;
  setSelectedId: Dispatch<SetStateAction<string | undefined>>;
};

export function LedgerSection({
  applications,
  selectedId,
  setSelectedId,
}: LedgerSectionProps) {
  return (
    <section className="ledger-section">
      <div className="decision-header">
        <div>
          <span className="section-kicker">Public ledger</span>
          <h2>Accepted, rejected, and capped examples</h2>
        </div>
      </div>
      <div className="ledger-list">
        {applications.map((application) => (
          <button
            className={`ledger-item ${application.id === selectedId ? "active" : ""}`}
            key={application.id}
            onClick={() => setSelectedId(application.id)}
          >
            <span className={`verdict-dot ${application.decision.verdict}`} />
            <strong>{application.projectName}</strong>
            <span>{application.applicantName}</span>
            <span>
              {application.decision.payoutAmount}{" "}
              {application.decision.payoutCurrency}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
