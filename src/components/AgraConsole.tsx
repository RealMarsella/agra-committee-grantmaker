"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  DecisionSection,
  HeroIntro,
  LedgerSection,
  Topbar,
} from "./AgraSections";
import { GrantForm, initialForm, type FormState } from "./GrantForm";
import { TraceField } from "./TraceField";
import type { GrantApplication } from "@/lib/agra/types";

interface Props {
  initialApplications: GrantApplication[];
}

export function AgraConsole({ initialApplications }: Props) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialApplications.find(
      (application) => application.decision.verdict === "accepted",
    )?.id ?? initialApplications[0]?.id,
  );
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () =>
      applications.find((application) => application.id === selectedId) ??
      applications[0],
    [applications, selectedId],
  );

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        requestedAmount: Number.parseFloat(form.requestedAmount),
      }),
    });

    const payload = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(
        payload.error ?? "Application rejected before committee review.",
      );
      return;
    }

    setApplications((current) => [payload.application, ...current]);
    setSelectedId(payload.application.id);
  }

  return (
    <main className="agra-page">
      <TraceField />
      <section className="hero-shell">
        <Topbar />

        <div className="judge-grid" id="top">
          <HeroIntro />
          <GrantForm
            error={error}
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={submitApplication}
            setForm={setForm}
          />
        </div>
      </section>

      {selected ? <DecisionSection selected={selected} /> : null}
      <LedgerSection
        applications={applications}
        selectedId={selected?.id}
        setSelectedId={setSelectedId}
      />
    </main>
  );
}
