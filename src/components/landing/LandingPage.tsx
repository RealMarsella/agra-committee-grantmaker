"use client";

import {
  ArrowRight,
  GitBranch,
  Landmark,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { TraceField } from "@/components/TraceField";
import { ConnectButton } from "@/components/web3/ConnectButton";
import { ARC_EXPLORER, TREASURY_CAP_USDC } from "@/lib/agra/constants";

const committee = [
  {
    icon: <Landmark />,
    name: "Public Goods Agent",
    optimizes: "Impact per dollar",
    power: "Scores the public beneficiary and demands inspectable output.",
    accent: "var(--green)",
  },
  {
    icon: <ShieldCheck />,
    name: "Safety Agent",
    optimizes: "Refusal authority",
    power: "Holds a hard veto. One safety trigger blocks the whole payout.",
    accent: "var(--coral)",
  },
  {
    icon: <TimerReset />,
    name: "Treasury Agent",
    optimizes: "Capital discipline",
    power: `Caps any disbursement at ${TREASURY_CAP_USDC} USDC under policy.`,
    accent: "var(--amber)",
  },
];

export function LandingPage() {
  return (
    <main className="landing">
      <TraceField />
      <div className="landing-glow" aria-hidden />

      <nav className="landing-nav">
        <Link className="brand" href="/" aria-label="AGRA home">
          <span className="brand-mark">A</span>
          <span>AGRA</span>
        </Link>
        <div className="landing-nav-right">
          <Link className="nav-ghost" href="/console">
            Committee console
          </Link>
          <ConnectButton />
        </div>
      </nav>

      <header className="landing-hero">
        <span className="eyebrow">
          <Sparkles size={15} /> Autonomous public-goods capital allocation
        </span>
        <h1>
          Capital that allocates itself —<br />
          by committee, in the open.
        </h1>
        <p>
          AGRA is a standing committee of autonomous agents. It reviews each
          public-goods grant, argues over impact and risk, publishes its
          dissent, and settles approved payouts in USDC on Arc — with no human
          approval click in the loop.
        </p>
        <div className="hero-cta">
          <Link className="cta-primary" href="/console">
            Enter the committee console <ArrowRight size={16} />
          </Link>
          <a className="cta-ghost" href="#settlement">
            How payouts settle
          </a>
        </div>
        <div className="hero-proof">
          <span>
            <GitBranch size={14} /> Replayable committee trace
          </span>
          <span>
            <Wallet size={14} /> USDC settlement on Arc Testnet
          </span>
          <span>
            <ShieldCheck size={14} /> Veto + cap enforced on-policy
          </span>
        </div>
      </header>

      <section className="landing-section" id="committee">
        <span className="section-kicker">The committee</span>
        <h2>Three agents. One treasury. Public disagreement.</h2>
        <p className="section-lead">
          AGRA does not score a grant with one model and a rubber stamp. Three
          agents vote independently with conflicting mandates, and their
          disagreement is the product — not a bug to hide.
        </p>
        <div className="committee-bench">
          {committee.map((agent) => (
            <article
              className="bench-seat"
              key={agent.name}
              style={{ ["--seat" as string]: agent.accent }}
            >
              <div className="bench-icon">{agent.icon}</div>
              <h3>{agent.name}</h3>
              <span className="bench-optimizes">{agent.optimizes}</span>
              <p>{agent.power}</p>
            </article>
          ))}
          <div className="bench-arrow" aria-hidden>
            <ArrowRight size={20} />
          </div>
          <article className="bench-verdict">
            <span>Verdict</span>
            <strong>Accept · Cap · Refuse</strong>
            <p>
              Average score, dissent spread, and a trace hash — recorded before
              any USDC moves.
            </p>
          </article>
        </div>
      </section>

      <section className="landing-section settlement" id="settlement">
        <span className="section-kicker">Settlement</span>
        <h2>Approved grants settle in USDC on Arc.</h2>
        <p className="section-lead">
          The treasury action is a real USDC transfer to the grantee. The
          console runs a live <strong>read → simulate → write</strong> path
          against Arc Testnet — and stays honest when the wallet isn&apos;t
          funded.
        </p>
        <ol className="settle-flow">
          <li>
            <span className="step-no">01</span>
            <h3>Read</h3>
            <p>
              Live USDC decimals and the connected treasury balance, queried
              from the Arc Testnet token contract.
            </p>
          </li>
          <li>
            <span className="step-no">02</span>
            <h3>Simulate</h3>
            <p>
              The exact transfer to the grantee is simulated against live chain
              state. An unfunded wallet surfaces the revert reason instead of
              faking success.
            </p>
          </li>
          <li>
            <span className="step-no">03</span>
            <h3>Write</h3>
            <p>
              The live transaction is only enabled once the simulation passes.
              No transaction hash is shown unless the chain returns one.
            </p>
          </li>
        </ol>
        <p className="honest-note">
          Testnet demo. AGRA does not claim a production treasury, live users,
          or settled mainnet payouts — fixture and live states are labeled
          throughout the console.
        </p>
      </section>

      <section className="landing-band">
        <div>
          <h2>Open the room where the committee decides.</h2>
          <p>Submit a grant, watch the agents disagree, and settle on Arc.</p>
        </div>
        <Link className="cta-primary" href="/console">
          Enter the committee console <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="landing-footer">
        <span>AGRA — committee-governed grantmaker</span>
        <div>
          <a
            href="https://github.com/gabrielantonyxaviour/agra-committee-grantmaker"
            rel="noreferrer"
            target="_blank"
          >
            Repo
          </a>
          <a href={ARC_EXPLORER} rel="noreferrer" target="_blank">
            Arc explorer
          </a>
          <Link href="/console">Console</Link>
        </div>
      </footer>
    </main>
  );
}
