import { unstable_noStore as noStore } from "next/cache";
import { AgraConsole } from "@/components/AgraConsole";
import { listApplications } from "@/lib/agra/store";

export const dynamic = "force-dynamic";

export default function Home() {
  noStore();
  return <AgraConsole initialApplications={listApplications()} />;
}
