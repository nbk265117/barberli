"use client";

import { api } from "~/trpc/react";
import { Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function FeaturedBarbershops() {
  const { data: barbershops, isLoading } = api.barbershop.getAll.useQuery({
    limit: 3,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!barbershops?.barbershops || barbershops.barbershops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun barbershop disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {barbershops.barbershops.map((barbershop) => (
        <Link
          key={barbershop.id}
          href={`/barbershops/${barbershop.id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
        >
          {barbershop.imageUrl ? (
            <div className="h-48 bg-gray-200 overflow-hidden relative">
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
            
            <div className="flex items-center text-gray-600 mb-3">
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
                Réserver →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
