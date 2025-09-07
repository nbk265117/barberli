import { Suspense } from "react";
import { Metadata } from "next";

import { BarbershopList } from "~/app/_components/barbershop-list";
import { Header } from "~/app/_components/header";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Barbershops au Maroc - BarberLi",
  description: "Découvrez tous les barbershops au Maroc. Trouvez le salon de coiffure parfait près de chez vous et réservez votre rendez-vous en ligne.",
  keywords: "barbershop, coiffure, barbe, salon homme, Maroc, Casablanca, Rabat, Marrakech, Fès, Agadir, Tanger, réservation",
  openGraph: {
    title: "Barbershops au Maroc - BarberLi",
    description: "Découvrez tous les barbershops au Maroc et réservez votre rendez-vous",
    type: "website",
    locale: "fr_MA",
  },
  alternates: {
    canonical: "https://barberli.ma/barbershops",
  },
};

export default async function BarbershopsPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Barbershops au Maroc
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Découvrez les meilleurs salons de coiffure pour hommes dans toutes les villes du Maroc. 
            Trouvez votre barbershop idéal et réservez votre rendez-vous en quelques clics.
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Chargement des barbershops...</p>
          </div>
        }>
          <BarbershopList />
        </Suspense>
      </main>
    </div>
  );
}
