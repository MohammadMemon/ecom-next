import ProductDetails from "./ProductDetails";
export const fetchCache = "force-cache";

import { headers } from "next/headers";

export default async function Page({ params }) {
  const resolvedParams = await params;

  const id = resolvedParams?.id;

  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const url = new URL(`${protocol}://${host}/api/v1/products/${id}`);

  const res = await fetch(url.href, {
    next: { tags: [id] },
  });
  const data = await res.json();

  return <ProductDetails product={data.product} />;
}
