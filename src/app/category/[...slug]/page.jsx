import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CategoryClient from "./CategoryClient";

export const fetchCache = "force-cache";

async function getProductsData(slugParts) {
  const [categorySlug, subCategorySlug, subSubCategorySlug] = slugParts;
  const host = (await headers()).get("host");
  const isLocalhost = host?.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";

  const url = new URL(`${protocol}://${host}/api/v1/products`);
  url.searchParams.append("categorySlug", categorySlug);
  if (subCategorySlug)
    url.searchParams.append("subCategorySlug", subCategorySlug);
  if (subSubCategorySlug)
    url.searchParams.append("subSubCategorySlug", subSubCategorySlug);

  try {
    const res = await fetch(url.href, {
      next: { tags: [subSubCategorySlug || subCategorySlug || categorySlug] },
    });

    if (!res.ok) {
      console.error(`API fetch failed with status: ${res.status}`);
      return { products: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
}

export async function generateMetadata({ params }) {
  await params;
  const slugParts = params?.slug || [];
  const lastSegment = slugParts[slugParts.length - 1] || "Bicycles";

  const startTimeMetadata = process.hrtime.bigint();

  const data = await getProductsData(slugParts);
  const products = data.products || [];

  const endTimeMetadata = process.hrtime.bigint();
  const durationMetadataMs =
    Number(endTimeMetadata - startTimeMetadata) / 1_000_000;
  console.log(
    `[Scenario A - generateMetadata] Fetch duration: ${durationMetadataMs}ms`
  );

  let categoryLabelForTitle = lastSegment.replace(/-/g, " ");
  if (products.length > 0) {
    if (slugParts.length === 3 && products[0]?.subSubCategory) {
      categoryLabelForTitle = products[0].subSubCategory;
    } else if (slugParts.length === 2 && products[0]?.subCategory) {
      categoryLabelForTitle = products[0].subCategory;
    } else if (slugParts.length === 1 && products[0]?.category) {
      categoryLabelForTitle = products[0].category;
    }
  }

  const uniqueBrands = [...new Set(products.map((p) => p.brand))].filter(
    Boolean
  );
  const brandsText =
    uniqueBrands.length > 0 ? `from ${uniqueBrands.join(", ")}` : "";

  const title = `${categoryLabelForTitle} | ${
    slugParts.length > 1 ? "Collection" : "Category"
  } `;

  const description = `Explore our ${
    categoryLabelForTitle || "Premium Products"
  } collection ${brandsText} at Best prices in India with free shipping on orders ₹5000+.`;

  // Extract keywords
  const keywords = new Set();
  products.forEach((p) => {
    if (p.brand) keywords.add(p.brand);
    if (p.category) keywords.add(p.category);
    if (p.subCategory) keywords.add(p.subCategory);
    if (p.subSubCategory) keywords.add(p.subSubCategory);
  });

  return {
    title,
    description,
    keywords: Array.from(keywords).join(", "),
    alternates: {
      canonical: `/category/${slugParts.join("/")}`,
    },
    openGraph: {
      title: `${categoryLabelForTitle} `,
      description: `Shop ${
        categoryLabelForTitle || "quality bicycles"
      } online ${brandsText}`,
      url: `https://cycledaddy.in/category/${slugParts.join("/")}`,
      images: [
        {
          url: slugParts[0]
            ? `/category/${slugParts[0]}-banner.webp`
            : "/banner.webp",
          width: 1200,
          height: 630,
          alt: `${categoryLabelForTitle || "Product"} Collection`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const slugParts = params?.slug || [];

  const [categorySlug, subCategorySlug, subSubCategorySlug] = slugParts;

  if (!slugParts || slugParts.length === 0) {
    notFound();
  }

  const startTimePage = process.hrtime.bigint();

  const data = await getProductsData(slugParts);
  const products = data.products || [];

  const endTimePage = process.hrtime.bigint();
  const durationPageMs = Number(endTimePage - startTimePage) / 1_000_000;
  console.log(
    `[Scenario A - Page component] Fetch duration: ${durationPageMs}ms`
  );

  // const formattedIds = products.map((p) => `"${p._id}"`).join(",\n");
  // console.log(formattedIds);

  const currentCategoryLabel =
    slugParts.length === 1
      ? products[0]?.category
      : slugParts.length === 2
      ? products[0]?.subCategory
      : slugParts.length === 3
      ? products[0]?.subSubCategory
      : "Unknown";

  return (
    <>
      <CategoryClient
        products={products}
        slugParts={{ categorySlug, subCategorySlug, subSubCategorySlug }}
        currentCategoryLabel={currentCategoryLabel}
      />
    </>
  );
}
