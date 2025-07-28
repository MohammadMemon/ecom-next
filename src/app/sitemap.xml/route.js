import { NextResponse } from "next/server";

const baseUrl = "https://cycledaddy.in";

const categoryPaths = [
  "/category/bike",
  "/category/gears-and-chains",
  "/category/gears-and-chains/drivetrain-components",
  "/category/gears-and-chains/drivetrain-components/chains",
  "/category/gears-and-chains/drivetrain-components/chainwheel-and-cranks",
  "/category/gears-and-chains/drivetrain-components/derailleurs",
  "/category/gears-and-chains/drivetrain-components/derailleur-dropouts",
  "/category/gears-and-chains/drivetrain-components/freewheels",
  "/category/gears-and-chains/drivetrain-components/groupset",
  "/category/gears-and-chains/shifters",
  "/category/gears-and-chains/pedals-and-cleats",
  "/category/gears-and-chains/b.b.-sets",
  "/category/wheels-and-suspension",
  "/category/wheels-and-suspension/wheels-and-hubs",
  "/category/wheels-and-suspension/wheels-and-hubs/alloy-hubs",
  "/category/wheels-and-suspension/wheels-and-hubs/rims",
  "/category/wheels-and-suspension/wheels-and-hubs/spokes",
  "/category/wheels-and-suspension/wheels-and-hubs/quick-release",
  "/category/wheels-and-suspension/wheels-and-hubs/hubs",
  "/category/wheels-and-suspension/suspension-systems",
  "/category/wheels-and-suspension/suspension-systems/suspension-forks",
  "/category/wheels-and-suspension/tyres-and-tubes",
  "/category/wheels-and-suspension/tyres-and-tubes/tyre",
  "/category/wheels-and-suspension/tyres-and-tubes/tubes",
  "/category/wheels-and-suspension/carbon-wheels-and-accessories",
  "/category/wheels-and-suspension/carbon-wheels-and-accessories/carbon-wheels",
  "/category/wheels-and-suspension/carbon-wheels-and-accessories/rim-tapes",
  "/category/brakes-and-safety",
  "/category/brakes-and-safety/braking-systems",
  "/category/brakes-and-safety/braking-systems/brake-set",
  "/category/brakes-and-safety/braking-systems/hydraulic-brake-set",
  "/category/brakes-and-safety/braking-systems/wires-and-cables",
  "/category/brakes-and-safety/braking-systems/brake-levers",
  "/category/frames-and-components",
  "/category/frames-and-components/frame-attachments",
  "/category/frames-and-components/frame-attachments/chain-guard",
  "/category/frames-and-components/frame-attachments/kick-stands",
  "/category/frames-and-components/frame-attachments/seat-post-and-clamps",
  "/category/frames-and-components/steering-components",
  "/category/frames-and-components/steering-components/handle-bar",
  "/category/frames-and-components/steering-components/handle-grips",
  "/category/frames-and-components/steering-components/handle-stem",
  "/category/frames-and-components/headsets",
  "/category/frames-and-components/saddles",
  "/category/accessories-and-essentials",
  "/category/accessories-and-essentials/riding-accessories",
  "/category/accessories-and-essentials/riding-accessories/handle-bar-tapes",
  "/category/accessories-and-essentials/riding-accessories/clothing-and-accessories",
  "/category/accessories-and-essentials/riding-accessories/cycling-shoes",
  "/category/accessories-and-essentials/riding-accessories/helmets",
  "/category/accessories-and-essentials/riding-accessories/lights",
  "/category/accessories-and-essentials/riding-accessories/mirrors",
  "/category/accessories-and-essentials/riding-accessories/locks",
  "/category/accessories-and-essentials/cycling-essentials",
  "/category/accessories-and-essentials/cycling-essentials/air-pumps",
  "/category/accessories-and-essentials/cycling-essentials/bottles-and-cages",
  "/category/accessories-and-essentials/cycling-essentials/mudguards",
  "/category/accessories-and-essentials/storage-and-travel",
  "/category/accessories-and-essentials/storage-and-travel/bags-and-travel-cases",
  "/category/accessories-and-essentials/storage-and-travel/carriers",
  "/category/accessories-and-essentials/storage-and-travel/baby-seats",
  "/category/accessories-and-essentials/tools-and-maintenance",
  "/category/accessories-and-essentials/tools-and-maintenance/bike-tools",
  "/category/accessories-and-essentials/tools-and-maintenance/maintenance",
  "/category/add-ons",
  "/category/add-ons/performance-equipment",
  "/category/add-ons/performance-equipment/indoor-trainers",
  "/category/add-ons/performance-equipment/speedometers",
  "/category/add-ons/miscellaneous",
  "/category/add-ons/miscellaneous/display-stands",
  "/category/add-ons/miscellaneous/mobile-consoles",
];

async function getProductPaths() {
  try {
    const res = await fetch(`${baseUrl}/api/v1/admin/product`, {
      cache: "force-cache",
    });
    const data = await res.json();
    if (!data.success) return [];

    return data.products.map((p) => `/product/${p._id}`);
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
}

export async function GET() {
  const productPaths = await getProductPaths();
  const allPaths = [...categoryPaths, ...productPaths];

  const urls = allPaths
    .map(
      (path) => `
  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "X-Robots-Tag": "index, follow",
    },
  });
}
