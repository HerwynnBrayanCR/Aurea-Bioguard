import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurea BioGuard — Ecological Intelligence Command Center",
  description: "Global real-time biodiversity monitoring platform. Identifies species, predicts ecological risks, and generates preventive alerts using AI and citizen science.",
  keywords: ["biodiversity", "ecology", "AI", "species identification", "conservation", "environmental monitoring"],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
