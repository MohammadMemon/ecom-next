import CategoryClient from "./CategoryClient";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
export const fetchCache = "force-cache";

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slugParts = resolvedParams?.slug || [];

  if (!slugParts || slugParts.length === 0) {
    notFound();
  }

  const [categorySlug, subCategorySlug, subSubCategorySlug] = slugParts;

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = new URL(`${protocol}://${host}/api/v1/products`);
  url.searchParams.append("categorySlug", categorySlug);
  if (subCategorySlug)
    url.searchParams.append("subCategorySlug", subCategorySlug);
  if (subSubCategorySlug)
    url.searchParams.append("subSubCategorySlug", subSubCategorySlug);

  const res = await fetch(url.href, {
    next: { tags: [subSubCategorySlug || subCategorySlug || categorySlug] },
  });

  const data = await res.json();

  const products = data.products || [];

  const currentCategoryLabel =
    slugParts.length === 1
      ? products[0]?.category
      : slugParts.length === 2
      ? products[0]?.subCategory
      : slugParts.length === 3
      ? products[0]?.subSubCategory
      : "Unknown";

  return (
    <CategoryClient
      products={products}
      slugParts={{ categorySlug, subCategorySlug, subSubCategorySlug }}
      currentCategoryLabel={currentCategoryLabel}
    />
  );
}
