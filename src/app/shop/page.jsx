import Shop from "./Shop";

async function getProducts() {
  const res = await fetch(
    "http://localhost:3000/api/v1/products?categorySlug=gears-and-chains",
    {
      cache: "force-cache",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
}

export default async function ShopPage() {
  const products = await getProducts();
  return <Shop initialProducts={products} />;
}
