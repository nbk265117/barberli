"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { GoogleMapsAutocomplete } from "./google-maps-autocomplete";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", { searchQuery, location });
  };

  const handlePlaceSelect = (place: any) => {
    if (place.formatted_address) {
      setLocation(place.formatted_address);
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trouvez votre barbershop idéal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Réservez facilement votre rendez-vous dans les meilleurs salons du Maroc
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <GoogleMapsAutocomplete
                placeholder="Ville ou adresse..."
                value={location}
                onChange={setLocation}
                onPlaceSelect={handlePlaceSelect}
                className="w-full py-3 text-gray-900"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Rechercher
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-100 mb-4">Villes populaires :</p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"].map((city) => (
                <button
                  key={city}
                  onClick={() => setLocation(city)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
