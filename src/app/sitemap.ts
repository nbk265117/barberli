import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://barberli.ma";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/barbershops`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic barbershop pages
  let barbershopPages: MetadataRoute.Sitemap = [];
  try {
    const barbershops = await api.barbershop.getAll({ limit: 100 });
    barbershopPages = barbershops.barbershops.map((barbershop) => ({
      url: `${baseUrl}/barbershops/${barbershop.id}`,
      lastModified: barbershop.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching barbershops for sitemap:", error);
  }

  // City-specific pages
  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"];
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/barbershops?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...barbershopPages, ...cityPages];
}
