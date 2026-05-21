import { createApplication, getSeedApplications } from "./fixtures";
import type { GrantApplication, GrantApplicationInput } from "./types";

const applications: GrantApplication[] = getSeedApplications();

export function listApplications(): GrantApplication[] {
  return [...applications].sort((a, b) =>
    a.submittedAt < b.submittedAt ? 1 : -1,
  );
}

export function addApplication(input: GrantApplicationInput): GrantApplication {
  const application = createApplication(input);
  applications.unshift(application);
  return application;
}

export function getApplication(id: string): GrantApplication | undefined {
  return applications.find((application) => application.id === id);
}
