import type { Metadata } from "next";
import HairAnalysisClient from "@/components/hair-analysis/HairAnalysisClient";

// Halaman rahasia — hanya bisa diakses lewat link. Jangan diindeks mesin pencari.
export const metadata: Metadata = {
  title: "AI Hair Analysis",
  robots: { index: false, follow: false, nocache: true },
};

export default function HairAnalysisSecretPage() {
  return <HairAnalysisClient />;
}
