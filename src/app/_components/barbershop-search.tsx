"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function BarbershopSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");

  const { data: barbershops, isLoading } = api.barbershop.getAll.useQuery({
    city: city || undefined,
    limit: 6,
  });

  const { data: searchResults, isLoading: isSearching } = api.barbershop.search.useQuery(
    {
      query: searchQuery,
      city: city || undefined,
      limit: 6,
    },
    {
      enabled: searchQuery.length > 0,
    }
  );

  const displayBarbershops = searchQuery ? searchResults : barbershops?.barbershops;
  const isLoadingResults = searchQuery ? isSearching : isLoading;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher un barbershop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Ville..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoadingResults ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      ) : displayBarbershops && displayBarbershops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBarbershops.map((barbershop) => (
            <Link
              key={barbershop.id}
              href={`/barbershops/${barbershop.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {barbershop.imageUrl && (
                <div className="h-48 bg-gray-200">
                  <Image
                    src={barbershop.imageUrl}
                    alt={barbershop.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {barbershop.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{barbershop.address}, {barbershop.city}</span>
                </div>

                {barbershop.phone && (
                  <div className="flex items-center text-gray-600 mb-3">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="text-sm">{barbershop.phone}</span>
                  </div>
                )}

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
                </div>

                {barbershop.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {barbershop.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{barbershop.services.length} services</span>
                  </div>
                  
                  <span className="text-blue-600 font-semibold">
                    Voir les détails →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchQuery ? "Aucun barbershop trouvé pour votre recherche." : "Aucun barbershop disponible pour le moment."}
          </p>
        </div>
      )}
    </div>
  );
}
