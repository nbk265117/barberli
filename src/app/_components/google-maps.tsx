"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { env } from "~/env.js";

interface GoogleMapsProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    infoWindow?: string;
  }>;
  className?: string;
}

export function GoogleMaps({
  center,
  zoom = 15,
  markers = [],
  className = "w-full h-64",
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        setIsLoaded(true);
      }
    }).catch((error) => {
      console.error("Error loading Google Maps:", error);
    });

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [center, zoom]);

  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach((markerData) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: mapInstanceRef.current,
          title: markerData.title,
        });

        if (markerData.infoWindow) {
          const infoWindow = new (window as any).google.maps.InfoWindow({
            content: markerData.infoWindow,
          });

          marker.addListener("click", () => {
            infoWindow.open(mapInstanceRef.current, marker);
          });
        }

        markersRef.current.push(marker);
      });
    }
  }, [markers, isLoaded]);

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-600">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
}
