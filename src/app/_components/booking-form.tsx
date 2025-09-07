"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Calendar, Clock, Euro, User } from "lucide-react";

interface BookingFormProps {
  barbershopId: string;
}

export function BookingForm({ barbershopId }: BookingFormProps) {
  const { data: session } = useSession();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: barbershop } = api.barbershop.getById.useQuery({
    id: barbershopId,
  });

  const { data: availableSlots, isLoading: isLoadingSlots } = api.reservation.getAvailableSlots.useQuery(
    {
      barbershopId,
      serviceId: selectedService,
      date: selectedDate,
    },
    {
      enabled: !!selectedService && !!selectedDate,
    }
  );

  const createReservation = api.reservation.create.useMutation({
    onSuccess: () => {
      alert("Réservation créée avec succès !");
      // Reset form
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
    },
    onError: (error) => {
      alert(`Erreur: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("Veuillez vous connecter pour réserver");
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const reservationDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    createReservation.mutate({
      barbershopId,
      serviceId: selectedService,
      date: reservationDateTime.toISOString(),
      notes: notes || undefined,
    });
  };

  const selectedServiceData = barbershop?.services.find(s => s.id === selectedService);

  if (!session) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Connectez-vous pour réserver un rendez-vous
        </p>
        <button
          onClick={() => window.location.href = "/api/auth/signin"}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Service Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service *
        </label>
        <select
          value={selectedService}
          onChange={(e) => {
            setSelectedService(e.target.value);
            setSelectedTime(""); // Reset time when service changes
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Sélectionner un service</option>
          {barbershop?.services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.price.toFixed(2)} MAD ({service.duration} min)
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date *
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedTime(""); // Reset time when date changes
          }}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Time Selection */}
      {selectedService && selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heure *
          </label>
          {isLoadingSlots ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Chargement des créneaux...</p>
            </div>
          ) : availableSlots?.slots && availableSlots.slots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedTime(slot.time.split('T')[1]?.substring(0, 5) || "")}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    selectedTime === (slot.time.split('T')[1]?.substring(0, 5) || "")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {slot.time.split('T')[1]?.substring(0, 5)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Aucun créneau disponible pour cette date
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ajoutez des commentaires ou demandes spéciales..."
        />
      </div>

      {/* Service Summary */}
      {selectedServiceData && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Résumé de la réservation</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{selectedServiceData.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{selectedDate && new Date(selectedDate).toLocaleDateString("fr-FR")}</span>
            </div>
            {selectedTime && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{selectedTime}</span>
              </div>
            )}
            <div className="flex items-center">
              <Euro className="w-4 h-4 mr-2" />
              <span className="font-medium">{selectedServiceData.price.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedService || !selectedDate || !selectedTime || createReservation.isPending}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {createReservation.isPending ? "Réservation en cours..." : "Confirmer la réservation"}
      </button>
    </form>
  );
}
