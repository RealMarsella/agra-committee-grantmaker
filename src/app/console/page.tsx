import { unstable_noStore as noStore } from "next/cache";
import { AgraConsole } from "@/components/AgraConsole";
import { listApplications } from "@/lib/agra/store";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  noStore();
  return <AgraConsole initialApplications={await listApplications()} />;
}
