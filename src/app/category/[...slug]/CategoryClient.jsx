"use client";
import ProductCard from "@/components/Product/ProductCard";

export default function CategoryClient({
  products,
  slugParts,
  currentCategoryLabel,
}) {
  const { categorySlug, subCategorySlug, subSubCategorySlug } = slugParts;

  const sortedProducts = [...products].sort((a, b) => {
    if (a.stock > 0 && b.stock <= 0) return -1;
    if (a.stock <= 0 && b.stock > 0) return 1;
    return 0;
  });

  return (
    <div className="container w-[95vw] px-0 xs:w-[90vw] xs:p-3 sm:w-[75vw] sm:p-6 mx-auto">
      <div>
        <h1>
          Showing: {categorySlug}
          {subCategorySlug && ` → ${subCategorySlug}`}
          {subSubCategorySlug && ` → ${subSubCategorySlug}`}
        </h1>
      </div>
      <h1 className="mb-6 text-2xl font-bold text-center underline">
        Browsing: {currentCategoryLabel}
      </h1>
      <div className="grid w-full grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product, index) => (
            <ProductCard key={product._id} index={index} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
