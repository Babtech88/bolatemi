import "dotenv/config";
import { PrismaClient, PriceMode } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "MS Pipes",
    slug: "ms-pipes",
    code: "CAT-01",
    description: "Mild steel pipes for industrial, construction and plumbing applications.",
    sortOrder: 1,
  },
  {
    name: "Stainless Steel",
    slug: "stainless-steel",
    code: "CAT-02",
    description: "Premium stainless steel pipes and fittings.",
    sortOrder: 2,
  },
  {
    name: "Elbows & Tees",
    slug: "elbows-tees",
    code: "CAT-03",
    description: "Industrial elbows, tees and pipe fittings.",
    sortOrder: 3,
  },
  {
    name: "Flanges",
    slug: "flanges",
    code: "CAT-04",
    description: "Industrial pipe flanges for reliable connections.",
    sortOrder: 4,
  },
  {
    name: "Water Pumps",
    slug: "water-pumps",
    code: "CAT-05",
    description: "Reliable water pumps for domestic and industrial applications.",
    sortOrder: 5,
  },
  {
    name: "Plumbing Items",
    slug: "plumbing-items",
    code: "CAT-06",
    description: "Quality plumbing components and accessories.",
    sortOrder: 6,
  },
  {
    name: "Safety Wear",
    slug: "safety-wear",
    code: "CAT-07",
    description: "Industrial safety clothing and protective equipment.",
    sortOrder: 7,
  },
  {
    name: "Safety Boots",
    slug: "safety-boots",
    code: "CAT-08",
    description: "Protective industrial safety footwear.",
    sortOrder: 8,
  },
];

// Every image path here is a real photo extracted from the client's own
// product flyer, bundled at build time in the frontend's
// public/images/products/ folder. These are relative paths (not absolute
// URLs) — the browser resolves them against whichever origin is serving
// the frontend, so this works in dev and in production without editing
// this file again, and without depending on the backend's own domain.
const products = [
  {
    name: "Mild Steel Pipe 2 Inch",
    slug: "mild-steel-pipe-2-inch",
    sku: "BOL-MS-002",
    categorySlug: "ms-pipes",
    description: "High-quality mild steel pipe suitable for plumbing, fabrication and industrial applications.",
    material: "Mild Steel",
    size: '2"',
    brand: "Bolatemi",
    price: 28500,
    stockQuantity: 150,
    image: "/images/products/black_pipe.png",
    specifications: {
      size: "2 inch",
      material: "Mild Steel",
      standard: "Industrial Grade",
      application: "Plumbing / Construction",
    },
    featured: true,
  },
  {
    name: "Galvanised Steel Pipe",
    slug: "galvanised-steel-pipe",
    sku: "BOL-MS-GLV-001",
    categorySlug: "ms-pipes",
    description: "Hot-dip galvanised steel pipe, rust-resistant, suitable for outdoor and water-supply installations.",
    material: "Galvanised Steel",
    size: 'Multiple sizes',
    brand: "Bolatemi",
    price: 32000,
    stockQuantity: 110,
    image: "/images/products/galvanised_pipe.png",
    specifications: {
      material: "Galvanised Steel",
      coating: "Hot-Dip Galvanised",
      application: "Outdoor / Water Supply",
    },
    featured: false,
  },
  {
    name: "Stainless Steel Pipe",
    slug: "stainless-steel-pipe",
    sku: "BOL-SS-001",
    categorySlug: "stainless-steel",
    description: "Premium stainless steel pipe designed for corrosion resistance and long-term industrial use.",
    material: "Stainless Steel",
    size: '2"',
    brand: "Bolatemi",
    price: 65000,
    stockQuantity: 80,
    image: "/images/products/stainless_pipe.png",
    specifications: {
      material: "Stainless Steel",
      finish: "Polished",
      application: "Industrial / Plumbing",
      corrosionResistance: "High",
    },
    featured: true,
  },
  {
    name: "Steel Elbow 90 Degree",
    slug: "steel-elbow-90-degree",
    sku: "BOL-ELB-090",
    categorySlug: "elbows-tees",
    description: "Heavy-duty 90-degree steel elbow for industrial piping systems.",
    material: "Carbon Steel",
    size: '2"',
    brand: "Bolatemi",
    price: 8500,
    stockQuantity: 200,
    image: "/images/products/elbow.png",
    specifications: {
      angle: "90 Degree",
      material: "Carbon Steel",
      size: "2 inch",
      application: "Industrial Piping",
    },
    featured: false,
  },
  {
    name: "Steel Tee Fitting",
    slug: "steel-tee-fitting",
    sku: "BOL-TEE-001",
    categorySlug: "elbows-tees",
    description: "Standard-specification tee fitting for branching pipe runs in plumbing and industrial installations.",
    material: "Carbon Steel",
    size: 'Multiple sizes',
    brand: "Bolatemi",
    price: 9500,
    stockQuantity: 180,
    image: "/images/products/tee.png",
    specifications: {
      type: "Tee Fitting",
      material: "Carbon Steel",
      application: "Industrial Piping",
    },
    featured: false,
  },
  {
    name: "Industrial Steel Flange",
    slug: "industrial-steel-flange",
    sku: "BOL-FLG-001",
    categorySlug: "flanges",
    description: "Heavy-duty industrial flange for secure pipe connections and pressure systems.",
    material: "Carbon Steel",
    size: '4"',
    brand: "Bolatemi",
    price: 18500,
    stockQuantity: 120,
    image: "/images/products/flange.png",
    specifications: {
      type: "Industrial Flange",
      material: "Carbon Steel",
      size: "4 inch",
      application: "Pipe Connection",
    },
    featured: true,
  },
  {
    name: "Industrial Water Pump",
    slug: "industrial-water-pump",
    sku: "BOL-PMP-001",
    categorySlug: "water-pumps",
    description: "Reliable high-performance surface water pump suitable for commercial and industrial applications.",
    material: "Cast Iron",
    brand: "Bolatemi",
    price: 185000,
    stockQuantity: 25,
    image: "/images/products/surface_pump.png",
    specifications: {
      type: "Centrifugal Pump",
      application: "Industrial / Commercial",
      power: "2HP",
      voltage: "220V",
    },
    featured: true,
  },
  {
    name: "Submersible Water Pump",
    slug: "submersible-water-pump",
    sku: "BOL-PMP-SUB-001",
    categorySlug: "water-pumps",
    description: "Submersible pump for boreholes and deep-well water supply, with power cable included.",
    material: "Stainless Steel",
    brand: "Bolatemi",
    price: 95000,
    stockQuantity: 18,
    image: "/images/products/submersible_pump.png",
    specifications: {
      type: "Submersible Pump",
      application: "Borehole / Deep Well",
      voltage: "220V",
    },
    featured: false,
  },
  {
    name: "Premium Plumbing Fittings Set",
    slug: "premium-plumbing-fittings-set",
    sku: "BOL-PLB-001",
    categorySlug: "plumbing-items",
    description: "Professional plumbing fittings suitable for installation, maintenance and repair work.",
    material: "PVC / Brass",
    brand: "Bolatemi",
    price: 32000,
    stockQuantity: 100,
    image: "/images/products/plumbing_material.png",
    specifications: {
      type: "Plumbing Fittings",
      material: "PVC / Brass",
      application: "Residential / Commercial",
    },
    featured: false,
  },
  {
    name: "Assorted Bolts and Nuts",
    slug: "assorted-bolts-and-nuts",
    sku: "BOL-FST-001",
    categorySlug: "plumbing-items",
    description: "Assorted galvanised bolts and nuts in standard sizes for flange, fitting and general fastening use.",
    material: "Galvanised Steel",
    size: "Assorted",
    brand: "Bolatemi",
    price: 3500,
    stockQuantity: 300,
    image: "/images/products/bolt_and_nuts.png",
    specifications: {
      type: "Fasteners",
      material: "Galvanised Steel",
      application: "Flange / General Fastening",
    },
    featured: false,
  },
  {
    name: "High Visibility Safety Jacket",
    slug: "high-visibility-safety-jacket",
    sku: "BOL-SFT-001",
    categorySlug: "safety-wear",
    description: "High-visibility reflective safety jacket for construction and industrial environments.",
    material: "Polyester",
    size: "XL",
    brand: "Bolatemi",
    price: 18000,
    stockQuantity: 75,
    image: "/images/products/safety_jacket.png",
    specifications: {
      type: "Reflective Safety Jacket",
      material: "Polyester",
      size: "XL",
      application: "Construction / Industrial",
    },
    featured: true,
  },
  {
    name: "Industrial Safety Boots",
    slug: "industrial-safety-boots",
    sku: "BOL-BOT-001",
    categorySlug: "safety-boots",
    description: "Durable industrial safety boots with reinforced protection for demanding work environments.",
    material: "Leather / Rubber",
    size: "42",
    brand: "Bolatemi",
    price: 35000,
    stockQuantity: 60,
    image: "/images/products/safety_boot.png",
    specifications: {
      type: "Safety Boot",
      material: "Leather / Rubber",
      size: "42",
      protection: "Reinforced Toe",
      application: "Industrial / Construction",
    },
    featured: true,
  },
];

async function main() {
  console.log("Starting Bolatemi catalog seed...");

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        code: category.code,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        code: category.code,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });

    categoryMap.set(category.slug, saved.id);
  }

  console.log(`Created/updated ${categoryMap.size} categories.`);

  // Each product is upserted independently inside its own try/catch — a
  // single bad record (bad category slug, a constraint violation, etc.)
  // must not silently take the other 11 down with it. The previous version
  // of this script let one failure throw all the way out of main(),
  // aborting the whole seed — including every product after the failing
  // one — with nothing but "Seeded 0 products" left to explain why.
  let successCount = 0;
  const failures: { name: string; error: string }[] = [];

  for (const product of products) {
    try {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Category not found: ${product.categorySlug}`);
      }

      const savedProduct = await prisma.product.upsert({
        where: { sku: product.sku },
        update: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId,
          material: product.material,
          brand: product.brand,
          size: product.size,
          specifications: product.specifications,
          priceMode: PriceMode.FIXED,
          price: product.price,
          currency: "NGN",
          stockQuantity: product.stockQuantity,
          isAvailable: true,
          isFeatured: product.featured,
        },
        create: {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          categoryId,
          material: product.material,
          brand: product.brand,
          size: product.size,
          specifications: product.specifications,
          priceMode: PriceMode.FIXED,
          price: product.price,
          currency: "NGN",
          stockQuantity: product.stockQuantity,
          isAvailable: true,
          isFeatured: product.featured,
        },
      });

      await prisma.productImage.deleteMany({ where: { productId: savedProduct.id } });
      await prisma.productImage.create({
        data: {
          productId: savedProduct.id,
          url: product.image,
          altText: product.name,
          sortOrder: 0,
        },
      });

      console.log(`✓ ${product.name}`);
      successCount++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✗ Failed to seed "${product.name}" (SKU ${product.sku}): ${message}`);
      failures.push({ name: product.name, error: message });
    }
  }

  console.log("");
  console.log(`Seeded ${successCount}/${products.length} products.`);
  if (failures.length > 0) {
    console.log("\nFailed products — fix these and re-run `npm run seed`:");
    failures.forEach((f) => console.log(`  - ${f.name}: ${f.error}`));
  } else {
    console.log("Bolatemi catalog seed completed successfully.");
  }

  const superAdminEmail = "admin@bolatemiglobal.com";
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: superAdminEmail } });
  if (!existingAdmin) {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
    await prisma.adminUser.create({
      data: { name: "Super Admin", email: superAdminEmail, passwordHash, role: "SUPER_ADMIN" },
    });
    console.log(`\nCreated super admin: ${superAdminEmail} / ChangeMe123!  <-- change this password immediately`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });