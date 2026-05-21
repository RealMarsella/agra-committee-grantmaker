import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGRA Committee-Governed Grantmaker",
  description:
    "Autonomous micro-grant committee with Arc and USDC-ready decision proofs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
