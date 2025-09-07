import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BarbershopDetails } from "~/app/_components/barbershop-details";
import { BarbershopServices } from "~/app/_components/barbershop-services";
import { BarbershopReviews } from "~/app/_components/barbershop-reviews";
import { BookingForm } from "~/app/_components/booking-form";
import { Header } from "~/app/_components/header";
import { StructuredData } from "~/app/_components/structured-data";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";

interface BarbershopPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BarbershopPage({ params }: BarbershopPageProps) {
  const session = await auth();
  const { id } = await params;
  
  try {
    const barbershop = await api.barbershop.getById({ id });
    
    return (
      <div className="min-h-screen bg-gray-50">
        <StructuredData barbershopId={barbershop.id} />
        <Header session={session} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Barbershop Info */}
            <div className="lg:col-span-2 space-y-6">
              <BarbershopDetails barbershop={barbershop} />
              
              <Suspense fallback={<div>Chargement des services...</div>}>
                <BarbershopServices barbershopId={barbershop.id} />
              </Suspense>
              
              <Suspense fallback={<div>Chargement des avis...</div>}>
                <BarbershopReviews barbershopId={barbershop.id} />
              </Suspense>
            </div>
            
            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Réserver un rendez-vous</h3>
                <Suspense fallback={<div>Chargement du formulaire...</div>}>
                  <BookingForm barbershopId={barbershop.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch {
    notFound();
  }
}

export async function generateMetadata({ params }: BarbershopPageProps) {
  try {
    const { id } = await params;
    const barbershop = await api.barbershop.getById({ id });
    
    return {
      title: `${barbershop.name} - BarberLi`,
      description: barbershop.description || `Réservez votre rendez-vous chez ${barbershop.name} à ${barbershop.city}`,
      keywords: `barbershop, ${barbershop.city}, coiffure, barbe, ${barbershop.name}`,
      openGraph: {
        title: `${barbershop.name} - BarberLi`,
        description: barbershop.description || `Réservez votre rendez-vous chez ${barbershop.name}`,
        images: barbershop.imageUrl ? [barbershop.imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Barbershop non trouvé - BarberLi",
    };
  }
}
