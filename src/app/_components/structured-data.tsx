"use client";

import { api } from "~/trpc/react";

interface StructuredDataProps {
  barbershopId?: string;
}

export function StructuredData({ barbershopId }: StructuredDataProps) {
  const { data: barbershop } = api.barbershop.getById.useQuery(
    { id: barbershopId! },
    { enabled: !!barbershopId }
  );

  if (!barbershop) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://barberli.ma/barbershops/${barbershop.id}`,
    name: barbershop.name,
    description: barbershop.description,
    url: `https://barberli.ma/barbershops/${barbershop.id}`,
    telephone: barbershop.phone,
    email: barbershop.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: barbershop.address,
      addressLocality: barbershop.city,
      postalCode: barbershop.postalCode,
      addressCountry: "MA",
    },
    geo: barbershop.latitude && barbershop.longitude ? {
      "@type": "GeoCoordinates",
      latitude: barbershop.latitude,
      longitude: barbershop.longitude,
    } : undefined,
    image: barbershop.imageUrl,
    aggregateRating: barbershop.reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: barbershop.rating,
      reviewCount: barbershop.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    openingHoursSpecification: barbershop.workingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ][hours.dayOfWeek],
      opens: hours.isClosed ? undefined : hours.openTime,
      closes: hours.isClosed ? undefined : hours.closeTime,
    })).filter(hours => hours.opens && hours.closes),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services de coiffure",
      itemListElement: barbershop.services.map((service, index) => ({
        "@type": "Offer",
        position: index + 1,
        name: service.name,
        description: service.description,
        price: service.price,
        priceCurrency: "MAD",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString().split('T')[0],
      })),
    },
    sameAs: barbershop.website ? [barbershop.website] : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
