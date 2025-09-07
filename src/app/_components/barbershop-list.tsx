"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Star, MapPin, Clock, Filter, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function BarbershopList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "name" | "city">("rating");

  const { data: barbershops, isLoading } = api.barbershop.getAll.useQuery({
    city: selectedCity || undefined,
    limit: 50,
  });

  const { data: searchResults, isLoading: isSearching } = api.barbershop.search.useQuery(
    {
      query: searchQuery,
      city: selectedCity || undefined,
      limit: 50,
    },
    {
      enabled: searchQuery.length > 0,
    }
  );

  const displayBarbershops = searchQuery ? searchResults : barbershops?.barbershops;
  const isLoadingResults = searchQuery ? isSearching : isLoading;

  // Sort barbershops
  const sortedBarbershops = displayBarbershops?.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "city":
        return a.city.localeCompare(b.city);
      default:
        return 0;
    }
  });

  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger", "Meknès", "Oujda"];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filtres et recherche</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un barbershop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rating" | "name" | "city")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Trier par note</option>
            <option value="name">Trier par nom</option>
            <option value="city">Trier par ville</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoadingResults ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      ) : sortedBarbershops && sortedBarbershops.length > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              {sortedBarbershops.length} barbershop{sortedBarbershops.length > 1 ? "s" : ""} trouvé{sortedBarbershops.length > 1 ? "s" : ""}
              {selectedCity && ` à ${selectedCity}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBarbershops.map((barbershop) => (
              <Link
                key={barbershop.id}
                href={`/barbershops/${barbershop.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                {barbershop.imageUrl ? (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={barbershop.imageUrl}
                      alt={barbershop.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {barbershop.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {barbershop.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{barbershop.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {barbershop.rating.toFixed(1)}
                      </span>
                      <span className="ml-1 text-sm text-gray-600">
                        ({barbershop.reviewCount} avis)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{barbershop.services.length} services</span>
                    </div>
                  </div>

                  {barbershop.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {barbershop.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {barbershop.services.slice(0, 2).map((service) => (
                        <span
                          key={service.id}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {service.name}
                        </span>
                      ))}
                      {barbershop.services.length > 2 && (
                        <span className="text-gray-500 text-xs">
                          +{barbershop.services.length - 2} autres
                        </span>
                      )}
                    </div>
                    
                    <span className="text-blue-600 font-semibold text-sm">
                      Voir les détails →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun barbershop trouvé
          </h3>
          <p className="text-gray-600">
            {searchQuery || selectedCity 
              ? "Essayez de modifier vos critères de recherche."
              : "Aucun barbershop disponible pour le moment."
            }
          </p>
        </div>
      )}
    </div>
  );
}
