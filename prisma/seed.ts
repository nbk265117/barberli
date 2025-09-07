import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample barbershops
  const barbershops = [
    {
      name: "BarberShop Royal",
      description: "Salon de coiffure premium au cœur de Casablanca. Spécialisé dans les coupes modernes et les soins de barbe.",
      address: "123 Avenue Mohammed V",
      city: "Casablanca",
      postalCode: "20000",
      latitude: 33.5731,
      longitude: -7.5898,
      phone: "+212 5 22 12 34 56",
      email: "contact@barbershoproyal.ma",
      website: "https://barbershoproyal.ma",
      imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop",
      services: [
        { name: "Coupe homme", description: "Coupe moderne et tendance", duration: 45, price: 80 },
        { name: "Taille de barbe", description: "Taille et modelage de barbe", duration: 30, price: 60 },
        { name: "Coupe + Barbe", description: "Coupe complète avec taille de barbe", duration: 60, price: 120 },
        { name: "Soins du visage", description: "Nettoyage et soins du visage", duration: 40, price: 100 },
      ],
      workingHours: [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "18:00", isClosed: false },
      ],
    },
    {
      name: "Le Gentleman",
      description: "Barbershop traditionnel avec une touche moderne. Expertise dans les coupes classiques et les soins premium.",
      address: "45 Rue Hassan II",
      city: "Rabat",
      postalCode: "10000",
      latitude: 34.0209,
      longitude: -6.8416,
      phone: "+212 5 37 12 34 56",
      email: "info@legentleman.ma",
      website: "https://legentleman.ma",
      imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
      services: [
        { name: "Coupe classique", description: "Coupe traditionnelle et élégante", duration: 40, price: 70 },
        { name: "Rasage traditionnel", description: "Rasage au coupe-chou avec serviette chaude", duration: 35, price: 80 },
        { name: "Coupe + Rasage", description: "Service complet coupe et rasage", duration: 60, price: 130 },
        { name: "Soins capillaires", description: "Shampooing et soins des cheveux", duration: 25, price: 50 },
      ],
      workingHours: [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "17:00", isClosed: false },
        { dayOfWeek: 1, openTime: "08:30", closeTime: "18:30", isClosed: false },
        { dayOfWeek: 2, openTime: "08:30", closeTime: "18:30", isClosed: false },
        { dayOfWeek: 3, openTime: "08:30", closeTime: "18:30", isClosed: false },
        { dayOfWeek: 4, openTime: "08:30", closeTime: "18:30", isClosed: false },
        { dayOfWeek: 5, openTime: "08:30", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "17:00", isClosed: false },
      ],
    },
    {
      name: "Modern Cut",
      description: "Barbershop contemporain spécialisé dans les coupes tendance et les styles urbains.",
      address: "78 Avenue de France",
      city: "Marrakech",
      postalCode: "40000",
      latitude: 31.6295,
      longitude: -7.9811,
      phone: "+212 5 24 12 34 56",
      email: "hello@moderncut.ma",
      website: "https://moderncut.ma",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop",
      services: [
        { name: "Coupe moderne", description: "Coupe tendance et stylée", duration: 50, price: 90 },
        { name: "Fade", description: "Dégradé moderne et précis", duration: 45, price: 100 },
        { name: "Coupe + Fade", description: "Coupe complète avec fade", duration: 70, price: 150 },
        { name: "Coloration", description: "Coloration et highlights", duration: 60, price: 120 },
      ],
      workingHours: [
        { dayOfWeek: 0, openTime: "11:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "21:00", isClosed: false },
        { dayOfWeek: 6, openTime: "11:00", closeTime: "19:00", isClosed: false },
      ],
    },
    {
      name: "Barber Elite",
      description: "Salon haut de gamme offrant des services premium dans un cadre luxueux.",
      address: "12 Boulevard Zerktouni",
      city: "Casablanca",
      postalCode: "20100",
      latitude: 33.5951,
      longitude: -7.6188,
      phone: "+212 5 22 98 76 54",
      email: "reservation@barberelite.ma",
      website: "https://barberelite.ma",
      imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=600&fit=crop",
      services: [
        { name: "Coupe premium", description: "Coupe de luxe avec soins", duration: 60, price: 150 },
        { name: "Rasage premium", description: "Rasage traditionnel avec soins", duration: 45, price: 120 },
        { name: "Package VIP", description: "Service complet premium", duration: 90, price: 250 },
        { name: "Soins du cuir chevelu", description: "Traitement et soins spécialisés", duration: 40, price: 100 },
      ],
      workingHours: [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "18:00", isClosed: false },
      ],
    },
    {
      name: "Urban Style",
      description: "Barbershop urbain pour les hommes modernes. Spécialisé dans les coupes street et les styles contemporains.",
      address: "56 Rue de la Liberté",
      city: "Fès",
      postalCode: "30000",
      latitude: 34.0331,
      longitude: -5.0003,
      phone: "+212 5 35 12 34 56",
      email: "contact@urbanstyle.ma",
      website: "https://urbanstyle.ma",
      imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop",
      services: [
        { name: "Coupe urbaine", description: "Style street et moderne", duration: 45, price: 75 },
        { name: "Beard styling", description: "Modelage et entretien de barbe", duration: 35, price: 65 },
        { name: "Coupe + Beard", description: "Service complet urbain", duration: 65, price: 120 },
        { name: "Hair wash", description: "Shampooing et soins", duration: 20, price: 40 },
      ],
      workingHours: [
        { dayOfWeek: 0, openTime: "10:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "19:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isClosed: false },
        { dayOfWeek: 6, openTime: "10:00", closeTime: "18:00", isClosed: false },
      ],
    },
  ];

  for (const barbershopData of barbershops) {
    const { services, workingHours, ...barbershopInfo } = barbershopData;
    
    const barbershop = await prisma.barbershop.create({
      data: {
        ...barbershopInfo,
        services: {
          create: services,
        },
        workingHours: {
          create: workingHours,
        },
      },
    });

    console.log(`✅ Created barbershop: ${barbershop.name}`);
  }

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
