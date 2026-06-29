import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// A simple rectangular-rooms floor plan the procedural extruder consumes later.
const sampleFloorPlan = (): Prisma.InputJsonValue => ({
  units: "m",
  rooms: [
    { name: "Living Room", polygon: [[0, 0], [6, 0], [6, 4.5], [0, 4.5]], height: 3 },
    { name: "Kitchen", polygon: [[6, 0], [9.5, 0], [9.5, 4.5], [6, 4.5]], height: 3 },
    { name: "Bedroom", polygon: [[0, 4.5], [4.5, 4.5], [4.5, 9], [0, 9]], height: 3 },
    { name: "Bathroom", polygon: [[4.5, 4.5], [6.5, 4.5], [6.5, 7], [4.5, 7]], height: 3 },
  ],
});

const samplePanoramas = (slug: string): Prisma.PanoramaCreateWithoutPropertyInput[] => [
  {
    name: "Living Room",
    imageUrl: `/panoramas/${slug}-living.jpg`,
    order: 0,
    hotspots: [{ label: "To Kitchen", yaw: 40, pitch: 0, target: 1 }],
  },
  {
    name: "Kitchen",
    imageUrl: `/panoramas/${slug}-kitchen.jpg`,
    order: 1,
    hotspots: [{ label: "Back to Living Room", yaw: -120, pitch: 0, target: 0 }],
  },
];

type Seed = {
  slug: string;
  title: string;
  description: string;
  type: "APARTMENT" | "VILLA" | "PLOT" | "COMMERCIAL";
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  city: string;
  locality: string;
  amenities: string[];
  featured?: boolean;
  immersive?: boolean;
};

const DATA: Seed[] = [
  {
    slug: "skyline-3bhk-bandra",
    title: "Skyline 3BHK with Sea View",
    description:
      "A light-filled 3BHK on the 18th floor with floor-to-ceiling glass, a wraparound balcony and uninterrupted Arabian Sea views. Premium fittings throughout.",
    type: "APARTMENT",
    price: 42500000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1650,
    city: "Mumbai",
    locality: "Bandra West",
    amenities: ["Gym", "Pool", "Parking", "Sea View", "Power Backup", "Clubhouse"],
    featured: true,
    immersive: true,
  },
  {
    slug: "garden-villa-koregaon",
    title: "Garden Villa with Private Lawn",
    description:
      "A 4BHK villa wrapped around a private courtyard, with a landscaped lawn, double-height living room and a home-office wing.",
    type: "VILLA",
    price: 68000000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqft: 3800,
    city: "Pune",
    locality: "Koregaon Park",
    amenities: ["Garden", "Parking", "Power Backup", "Smart Home", "Servant Room"],
    featured: true,
    immersive: true,
  },
  {
    slug: "tech-park-2bhk-whitefield",
    title: "Smart 2BHK near Tech Park",
    description:
      "Efficient 2BHK minutes from the IT corridor, with smart-home automation, a co-working lounge in the tower and EV charging.",
    type: "APARTMENT",
    price: 14500000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    city: "Bengaluru",
    locality: "Whitefield",
    amenities: ["Gym", "Parking", "EV Charging", "Co-working", "Power Backup"],
    featured: true,
    immersive: true,
  },
  {
    slug: "riverside-1bhk-pune",
    title: "Riverside 1BHK Starter Home",
    description:
      "A compact, well-lit 1BHK overlooking the river promenade — ideal first home or rental investment.",
    type: "APARTMENT",
    price: 6800000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 620,
    city: "Pune",
    locality: "Baner",
    amenities: ["Parking", "Power Backup", "Lift"],
  },
  {
    slug: "hill-view-villa-lonavala",
    title: "Hill-View Weekend Villa",
    description:
      "A 3BHK weekend retreat with an infinity-edge plunge pool and panoramic valley views from every room.",
    type: "VILLA",
    price: 52000000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqft: 2900,
    city: "Pune",
    locality: "Lonavala",
    amenities: ["Pool", "Garden", "Parking", "Valley View", "Fireplace"],
    immersive: true,
  },
  {
    slug: "downtown-commercial-bkc",
    title: "Grade-A Office Floor, BKC",
    description:
      "A full commercial floor in the business district — 6,000 sq ft of column-free space, raised flooring and dual lift cores.",
    type: "COMMERCIAL",
    price: 185000000,
    bedrooms: 0,
    bathrooms: 4,
    areaSqft: 6000,
    city: "Mumbai",
    locality: "Bandra Kurla Complex",
    amenities: ["Parking", "Power Backup", "Central AC", "24x7 Security"],
  },
  {
    slug: "lakefront-plot-hebbal",
    title: "Lakefront Residential Plot",
    description:
      "A rare 2,400 sq ft east-facing plot on the lake's edge in a gated layout, ready to build with all approvals in place.",
    type: "PLOT",
    price: 22000000,
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 2400,
    city: "Bengaluru",
    locality: "Hebbal",
    amenities: ["Gated", "Lake View", "Approved Plan"],
  },
  {
    slug: "heritage-4bhk-indiranagar",
    title: "Heritage 4BHK Bungalow",
    description:
      "A restored colonial-era bungalow blending period detail with modern services, set on a quiet tree-lined street.",
    type: "VILLA",
    price: 95000000,
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 4200,
    city: "Bengaluru",
    locality: "Indiranagar",
    amenities: ["Garden", "Parking", "Servant Room", "Study", "Power Backup"],
    immersive: true,
  },
  {
    slug: "compact-studio-andheri",
    title: "Compact Studio, Metro-Connected",
    description:
      "A smartly-zoned studio steps from the metro, with a Murphy bed, full kitchenette and a shared rooftop deck.",
    type: "APARTMENT",
    price: 5200000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 410,
    city: "Mumbai",
    locality: "Andheri East",
    amenities: ["Lift", "Power Backup", "Rooftop Deck"],
  },
  {
    slug: "penthouse-duplex-worli",
    title: "Duplex Penthouse with Terrace",
    description:
      "A 5BHK duplex penthouse crowning a sea-facing tower, with a private terrace garden, plunge pool and double-height atrium.",
    type: "APARTMENT",
    price: 320000000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 6800,
    city: "Mumbai",
    locality: "Worli",
    amenities: ["Pool", "Sea View", "Parking", "Private Terrace", "Smart Home", "Clubhouse"],
    featured: true,
    immersive: true,
  },
];

async function main() {
  console.log("Seeding…");

  const [demoHash, adminHash] = await Promise.all([
    bcrypt.hash("demo1234", 10),
    bcrypt.hash("admin1234", 10),
  ]);

  await prisma.user.upsert({
    where: { email: "demo@habitat.app" },
    update: {},
    create: { email: "demo@habitat.app", name: "Demo User", passwordHash: demoHash, role: "USER" },
  });
  await prisma.user.upsert({
    where: { email: "admin@habitat.app" },
    update: {},
    create: { email: "admin@habitat.app", name: "Admin", passwordHash: adminHash, role: "ADMIN" },
  });

  for (const d of DATA) {
    const gallery = [img(`${d.slug}-1`), img(`${d.slug}-2`), img(`${d.slug}-3`)];
    await prisma.property.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        slug: d.slug,
        title: d.title,
        description: d.description,
        type: d.type,
        price: d.price,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        areaSqft: d.areaSqft,
        city: d.city,
        locality: d.locality,
        amenities: d.amenities,
        heroImage: img(`${d.slug}-hero`, 1600, 1000),
        gallery,
        featured: d.featured ?? false,
        modelUrl: d.immersive ? `/models/${d.slug}.glb` : null,
        floorPlan: d.immersive ? sampleFloorPlan() : undefined,
        panoramas: d.immersive ? { create: samplePanoramas(d.slug) } : undefined,
      },
    });
  }

  const count = await prisma.property.count();
  console.log(`Seeded ${count} properties + 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
