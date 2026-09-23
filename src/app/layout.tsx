import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.scss";

export const metadata: Metadata = {
  title: "Portfolio design system",
  description: "Design system foundations and layout primitives validation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
