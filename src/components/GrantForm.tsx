"use client";

import { ArrowRight, CircleDollarSign } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Field, TextField } from "./FormParts";
import { WalletAuthPanel } from "./WalletAuthPanel";

export type FormState = {
  applicantName: string;
  projectName: string;
  region: string;
  walletAddress: string;
  requestedAmount: string;
  requestedCurrency: "USDC" | "EURC";
  impactStatement: string;
  proofUrl: string;
  riskNotes: string;
};

export const initialForm: FormState = {
  applicantName: "Anika Rao",
  projectName: "Arc Grant Receipt Parser",
  region: "Bengaluru, India",
  walletAddress: "0x7a379b1f02D9618f917B5D268a81e3f6CDA220e5",
  requestedAmount: "22",
  requestedCurrency: "USDC",
  impactStatement:
    "A public open source parser that converts Arc transaction receipts into readable grant reports for small public-good teams, with examples for developer clubs and agent builders.",
  proofUrl: "https://github.com/gabrielantonyxaviour",
  riskNotes: "Public repository proof, no custody request, no private keys.",
};

type GrantFormProps = {
  error: string | null;
  form: FormState;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setForm: Dispatch<SetStateAction<FormState>>;
};

export function GrantForm({
  error,
  form,
  isSubmitting,
  onSubmit,
  setForm,
}: GrantFormProps) {
  return (
    <form className="application-form" onSubmit={onSubmit}>
      <div className="form-head">
        <div>
          <span className="section-kicker">Demo intake</span>
          <h2>Submit a grant request</h2>
        </div>
        <CircleDollarSign size={22} />
      </div>
      <Field
        label="Applicant"
        value={form.applicantName}
        onChange={(v) => setForm({ ...form, applicantName: v })}
      />
      <Field
        label="Project"
        value={form.projectName}
        onChange={(v) => setForm({ ...form, projectName: v })}
      />
      <div className="form-row">
        <Field
          label="Region"
          value={form.region}
          onChange={(v) => setForm({ ...form, region: v })}
        />
        <Field
          inputMode="decimal"
          label="Amount"
          value={form.requestedAmount}
          onChange={(v) =>
            setForm({
              ...form,
              requestedAmount: v.replace(/[^0-9.]/g, ""),
            })
          }
        />
      </div>
      <label className="field">
        <span>Currency</span>
        <select
          value={form.requestedCurrency}
          onChange={(event) =>
            setForm({
              ...form,
              requestedCurrency: event.target.value as "USDC" | "EURC",
            })
          }
        >
          <option value="USDC">USDC</option>
          <option value="EURC">EURC (requires live proof)</option>
        </select>
      </label>
      <WalletAuthPanel
        walletAddress={form.walletAddress}
        onVerified={(address) => setForm({ ...form, walletAddress: address })}
      />
      <Field
        label="Wallet"
        value={form.walletAddress}
        onChange={(v) => setForm({ ...form, walletAddress: v })}
      />
      <Field
        label="Proof URL"
        value={form.proofUrl}
        onChange={(v) => setForm({ ...form, proofUrl: v })}
      />
      <TextField
        label="Impact"
        value={form.impactStatement}
        onChange={(v) => setForm({ ...form, impactStatement: v })}
      />
      <TextField
        label="Risk notes"
        value={form.riskNotes}
        onChange={(v) => setForm({ ...form, riskNotes: v })}
      />
      {error ? <p className="form-error">{error}</p> : null}
      <button className="primary-action" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Committee reviewing" : "Run committee"}
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
