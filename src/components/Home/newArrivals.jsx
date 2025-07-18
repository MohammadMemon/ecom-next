import { headers } from "next/headers";
import ClientNewArrivals from "./ClientNewArrivals";

export const fetchCache = "force-cache";

export default async function NewArrivals() {
  const host = await headers().get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/api/v1/products/new-arrivals`;

  const res = await fetch(url, {
    next: { tags: ["new-arrivals"] },
  });

  if (!res.ok) {
    return <p className="text-center">Failed to load new arrivals.</p>;
  }

  const data = await res.json();
  return <ClientNewArrivals products={data.products} />;
}
