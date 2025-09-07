import { Header } from "~/app/_components/header";
import { auth } from "~/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { Calendar, Clock, MapPin, Star, User, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tableau de bord - BarberLi",
  description: "Gérez vos réservations et votre profil sur BarberLi. Consultez vos rendez-vous passés et à venir.",
  keywords: "dashboard, réservations, profil, barbershop, Maroc",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Fetch user reservations
  let reservations: any[] = [];
  try {
    const userReservations = await api.reservation.getMyReservations({ limit: 50 });
    reservations = userReservations?.reservations || [];
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }

  const upcomingReservations = reservations.filter(
    (reservation) => new Date(reservation.date) > new Date()
  );
  const pastReservations = reservations.filter(
    (reservation) => new Date(reservation.date) <= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Bienvenue, {session.user.name || session.user.email}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations à venir</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingReservations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations passées</p>
                  <p className="text-2xl font-bold text-gray-900">{pastReservations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Mon Profil
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Avatar"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.user.name || "Utilisateur"}
                      </p>
                      <p className="text-sm text-gray-600">{session.user.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres du compte
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/barbershops"
                    className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Nouvelle réservation
                  </Link>
                  <Link
                    href="/barbershops"
                    className="block w-full bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Explorer les barbershops
                  </Link>
                </div>
              </div>
            </div>

            {/* Reservations Section */}
            <div className="lg:col-span-2">
              {/* Upcoming Reservations */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Réservations à venir
                </h2>
                
                {upcomingReservations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {reservation.barbershop.name}
                            </h3>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(reservation.date).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {new Date(reservation.date).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {reservation.barbershop.address}, {reservation.barbershop.city}
                              </div>
                              
                              <div className="flex items-center">
                                <span className="font-medium">Service:</span>
                                <span className="ml-2">{reservation.service.name}</span>
                                <span className="ml-2 text-blue-600 font-semibold">
                                  {reservation.service.price} MAD
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === "CONFIRMED" 
                                ? "bg-green-100 text-green-800"
                                : reservation.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {reservation.status === "CONFIRMED" ? "Confirmé" : 
                               reservation.status === "PENDING" ? "En attente" : 
                               reservation.status === "CANCELLED" ? "Annulé" : "Complété"}
                            </span>
                          </div>
                        </div>
                        
                        {reservation.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {reservation.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aucune réservation à venir</p>
                    <Link
                      href="/barbershops"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Réserver maintenant
                    </Link>
                  </div>
                )}
              </div>

              {/* Past Reservations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Historique des réservations
                </h2>
                
                {pastReservations.length > 0 ? (
                  <div className="space-y-3">
                    {pastReservations.slice(0, 5).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {reservation.barbershop.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {reservation.service.name} - {reservation.service.price} MAD
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(reservation.date).toLocaleDateString("fr-FR")} à{" "}
                              {new Date(reservation.date).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reservation.status === "COMPLETED" 
                              ? "bg-green-100 text-green-800"
                              : reservation.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {reservation.status === "COMPLETED" ? "Terminé" : 
                             reservation.status === "CANCELLED" ? "Annulé" : "En cours"}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {pastReservations.length > 5 && (
                      <p className="text-center text-sm text-gray-600 mt-4">
                        Et {pastReservations.length - 5} autres réservations...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun historique de réservations</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
