import { Header } from "~/app/_components/header";
import { auth } from "~/server/auth";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos - BarberLi",
  description: "Découvrez BarberLi, la plateforme de réservation de barbershops au Maroc. Notre mission est de connecter les clients aux meilleurs salons de coiffure.",
  keywords: "barbershop, Maroc, coiffure, barbe, réservation, à propos",
};

export default async function AboutPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              À propos de BarberLi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La première plateforme de réservation de barbershops au Maroc
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Notre Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                BarberLi révolutionne l'expérience de réservation de barbershops au Maroc. 
                Nous connectons les clients aux meilleurs salons de coiffure pour hommes, 
                offrant une expérience de réservation simple, rapide et fiable.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Notre objectif est de moderniser l'industrie de la coiffure masculine 
                en proposant une solution digitale complète qui bénéficie tant aux 
                clients qu'aux professionnels du secteur.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Notre Vision
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Devenir la référence incontournable pour la réservation de services 
                de coiffure au Maroc, en créant un écosystème digital qui valorise 
                l'excellence et l'innovation dans le secteur de la beauté masculine.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nous aspirons à connecter tous les barbershops du Maroc sur une 
                plateforme unique, facilitant ainsi l'accès aux services de qualité 
                pour tous les Marocains.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Nos Valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 text-2xl font-bold">Q</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Qualité</h3>
                <p className="text-gray-600 text-sm">
                  Nous sélectionnons uniquement les meilleurs barbershops pour garantir une expérience exceptionnelle.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-2xl font-bold">F</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fiabilité</h3>
                <p className="text-gray-600 text-sm">
                  Notre plateforme garantit des réservations sécurisées et des confirmations en temps réel.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 text-2xl font-bold">I</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Nous utilisons les dernières technologies pour offrir une expérience utilisateur moderne.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Rejoignez la Révolution BarberLi
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Que vous soyez un client à la recherche du barbershop parfait ou un professionnel 
              souhaitant développer votre activité, BarberLi est là pour vous accompagner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/barbershops"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Trouver un Barbershop
              </Link>
              <Link
                href="/contact"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
