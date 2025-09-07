"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { env } from "~/env.js";

interface GoogleMapsAutocompleteProps {
  onPlaceSelect: (place: any) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function GoogleMapsAutocomplete({
  onPlaceSelect,
  placeholder = "Rechercher une adresse...",
  className = "",
  value,
  onChange,
}: GoogleMapsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (inputRef.current) {
        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "ma" }, // Restrict to Morocco
          fields: ["place_id", "formatted_address", "geometry", "name"],
        });

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.geometry) {
            onPlaceSelect(place);
          }
        });

        setIsLoaded(true);
      }
    }).catch((error) => {
      console.error("Error loading Google Maps:", error);
    });

    return () => {
      if (autocompleteRef.current) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onPlaceSelect]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        disabled={!isLoaded}
      />
      {!isLoaded && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
