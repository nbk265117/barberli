"use client";

import { Star, MapPin, Phone, Globe } from "lucide-react";
import Image from "next/image";

interface BarbershopDetailsProps {
  barbershop: {
    id: string;
    name: string;
    description: string | null;
    address: string;
    city: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    imageUrl: string | null;
    rating: number;
    reviewCount: number;
    workingHours: Array<{
      dayOfWeek: number;
      openTime: string;
      closeTime: string;
      isClosed: boolean;
    }>;
  };
}

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export function BarbershopDetails({ barbershop }: BarbershopDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {barbershop.imageUrl && (
        <div className="h-64 bg-gray-200">
          <Image
            src={barbershop.imageUrl}
            alt={barbershop.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {barbershop.name}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{barbershop.address}, {barbershop.city}</span>
            </div>

            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg font-medium text-gray-900">
                {barbershop.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-600">
                ({barbershop.reviewCount} avis)
              </span>
            </div>
          </div>
        </div>

        {barbershop.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{barbershop.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations de contact</h3>
            <div className="space-y-2">
              {barbershop.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${barbershop.phone}`} className="hover:text-blue-600">
                    {barbershop.phone}
                  </a>
                </div>
              )}
              
              {barbershop.email && (
                <div className="flex items-center text-gray-600">
                  <span className="w-4 h-4 mr-2">@</span>
                  <a href={`mailto:${barbershop.email}`} className="hover:text-blue-600">
                    {barbershop.email}
                  </a>
                </div>
              )}
              
              {barbershop.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <a 
                    href={barbershop.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    Site web
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Horaires d'ouverture</h3>
            <div className="space-y-1">
              {barbershop.workingHours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((hours) => (
                  <div key={hours.dayOfWeek} className="flex justify-between text-sm">
                    <span className="text-gray-600">{DAYS[hours.dayOfWeek]}</span>
                    <span className="text-gray-900">
                      {hours.isClosed ? "Fermé" : `${hours.openTime} - ${hours.closeTime}`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
