"use client";

import { api } from "~/trpc/react";
import { Clock, Euro } from "lucide-react";

interface BarbershopServicesProps {
  barbershopId: string;
}

export function BarbershopServices({ barbershopId }: BarbershopServicesProps) {
  const { data: barbershop, isLoading } = api.barbershop.getById.useQuery({
    id: barbershopId,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!barbershop?.services || barbershop.services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Services</h2>
        <p className="text-gray-600">Aucun service disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Services disponibles</h2>
      
      <div className="space-y-4">
        {barbershop.services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {service.name}
                </h3>
                
                {service.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {service.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-1" />
                    <span className="font-medium text-gray-900">
                      {service.price.toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
