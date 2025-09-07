import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "BarberLi - Réservation de Barbershop au Maroc",
  description: "Trouvez et réservez votre barbershop au Maroc. Services de coiffure, barbe et soins pour hommes dans les meilleurs salons.",
  keywords: "barbershop, coiffure, barbe, salon homme, Maroc, Casablanca, Rabat, réservation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "BarberLi - Réservation de Barbershop au Maroc",
    description: "Trouvez et réservez votre barbershop au Maroc",
    type: "website",
    locale: "fr_MA",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${geist.variable}`}>
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
