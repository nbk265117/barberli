import { Header } from "~/app/_components/header";
import { auth } from "~/server/auth";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { User, Mail, Phone, MapPin, Bell, Shield, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paramètres - BarberLi",
  description: "Gérez vos paramètres de compte et préférences sur BarberLi.",
  keywords: "paramètres, compte, profil, préférences, BarberLi",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paramètres du compte
            </h1>
            <p className="text-gray-600">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informations personnelles
                </h2>
                
                <form className="space-y-6">
                  <div className="flex items-center mb-6">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Avatar"}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full mr-6"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-300 rounded-full mr-6 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Changer la photo
                      </button>
                      <p className="text-sm text-gray-600 mt-1">
                        JPG, PNG ou GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        defaultValue={session.user.name?.split(' ')[0] || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre prénom"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        defaultValue={session.user.name?.split(' ').slice(1).join(' ') || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={session.user.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      L'email ne peut pas être modifié. Connecté via Google.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre adresse"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sauvegarder les modifications
                    </button>
                  </div>
                </form>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Préférences
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications par email</h3>
                      <p className="text-sm text-gray-600">
                        Recevoir des confirmations et rappels par email
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notifications SMS</h3>
                      <p className="text-sm text-gray-600">
                        Recevoir des rappels par SMS
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Promotions et offres</h3>
                      <p className="text-sm text-gray-600">
                        Recevoir des offres spéciales et promotions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sauvegarder les préférences
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Account Security */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Sécurité du compte
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Mot de passe</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Connecté via Google OAuth
                    </p>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Modifier le mot de passe
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">Sessions actives</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Gérer les appareils connectés
                    </p>
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Voir les sessions
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Zone de danger
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Supprimer le compte
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Cette action est irréversible. Toutes vos données seront supprimées.
                    </p>
                    <button
                      type="button"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
