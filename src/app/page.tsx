import { Suspense } from "react";
import { Search, MapPin, Star, Clock, Scissors } from "lucide-react";

import { BarbershopSearch } from "~/app/_components/barbershop-search";
import { FeaturedBarbershops } from "~/app/_components/featured-barbershops";
import { Header } from "~/app/_components/header";
import { Hero } from "~/app/_components/hero";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main>
        <Hero />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trouvez votre barbershop idéal
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez les meilleurs salons de coiffure pour hommes au Maroc. 
                Réservez facilement votre rendez-vous en ligne.
              </p>
            </div>
            
            <Suspense fallback={<div className="text-center">Chargement...</div>}>
              <BarbershopSearch />
            </Suspense>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Barbershops populaires
              </h2>
              <p className="text-lg text-gray-600">
                Les salons les mieux notés par nos clients
              </p>
            </div>
            
            <Suspense fallback={<div className="text-center">Chargement...</div>}>
              <FeaturedBarbershops />
            </Suspense>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi choisir BarberLi ?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recherche facile</h3>
                <p className="text-gray-600">
                  Trouvez rapidement le barbershop le plus proche avec nos filtres avancés
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Réservation instantanée</h3>
                <p className="text-gray-600">
                  Réservez votre créneau en quelques clics, 24h/24 et 7j/7
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualité garantie</h3>
                <p className="text-gray-600">
                  Tous nos barbershops sont vérifiés et notés par nos clients
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
