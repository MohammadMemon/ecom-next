import ProductDetails from "./ProductDetails";
import { headers } from "next/headers";
export const fetchCache = "force-cache";

export async function generateMetadata({ params }) {
  const host = headers().get("host");
  const isLocalhost = host?.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";
  const url = new URL(`${protocol}://${host}/api/v1/products/${params.id}`);

  const res = await fetch(url.href);
  const data = await res.json();
  const product = data.product;

  if (!product) {
    return {
      title: "Product Not Found | CycleDaddy",
      description: "This product is no longer available",
      robots: { index: false, follow: true },
    };
  }

  const price =
    data.product.price ||
    (data.product.variants?.length > 0
      ? Math.min(
          ...data.product.variants.flatMap((v) => v.options.map((o) => o.price))
        )
      : 0);

  const categoryPath = product.subSubCategory
    ? product.subSubCategory
    : product.subCategory;

  const title = `${product.name} | ${product.brand}${
    categoryPath ? ` | ${categoryPath}` : ""
  } | CycleDaddy`;

  const descriptionParts = [];
  if (product.description) descriptionParts.push(product.description);
  else descriptionParts.push(`${product.name} by ${product.brand}`);

  if (product.specification?.length) {
    descriptionParts.push(
      `Features: ${product.specification
        .slice(0, 3)
        .map((s) => s.title)
        .join(", ")}`
    );
  }

  descriptionParts.push(
    `Available for ₹${price} with free shipping on orders ₹5000+.`
  );
  const description = descriptionParts.join(". ");

  const openGraph = {
    title,
    description,
    url: `https://cycledaddy.in/product/${params.id}`,
    images: product.images?.length
      ? [
          {
            url: product.images[0].url,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ]
      : undefined,
    type: "website",
    ...(price > 0 && {
      siteName: "CycleDaddy",
      price: {
        amount: price,
        currency: "INR",
      },
    }),
  };

  return {
    title,
    description,
    alternates: { canonical: `/product/${params.id}` },
    openGraph,
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }) {
  const host = headers().get("host");
  const isLocalhost = host?.includes("localhost");
  const protocol = isLocalhost ? "http" : "https";
  const url = new URL(`${protocol}://${host}/api/v1/products/${params.id}`);

  const res = await fetch(url.href, { next: { tags: [params.id] } });
  const data = await res.json();

  if (!data.product) return notFound();

  const price =
    data.product.price ||
    (data.product.variants?.length > 0
      ? Math.min(
          ...data.product.variants.flatMap((v) => v.options.map((o) => o.price))
        )
      : 0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.product.name,
    image: data.product.images?.map((img) => img.url) || [],
    description:
      data.product.description ||
      `${data.product.name} by ${data.product.brand}`,
    brand: { "@type": "Brand", name: data.product.brand },
    sku: data.product.sku,
    offers: {
      "@type": "Offer",
      url: `https://cycledaddy.in/product/${params.id}`,
      priceCurrency: "INR",
      price: price.toString(),
      availability:
        data.product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: data.product.price >= 5000 ? "0" : "TBD",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
      },
    },
  };

  if (data.product.averageRating > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: data.product.averageRating,
      reviewCount: data.product.numOfReviews,
    };
  }

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <ProductDetails product={data.product} />
    </>
  );
}
