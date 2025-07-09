import { create } from "zustand";
import { persist } from "zustand/middleware";

const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const products = get().products;

        const filtered = products.filter((p) => p._id !== product._id);

        const updated = [
          { ...product, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, 8);

        set({ products: updated });

        // Call updateStock instead of refreshStock
        get().updateStock();
      },

      updateStock: async () => {
        const { products } = get();
        if (products.length === 0) return products;

        try {
          const productIds = products.map((p) => p._id);
          const res = await fetch("/api/v1/products/stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds }),
          });

          if (!res.ok) throw new Error("Failed to fetch stock");

          const stockData = await res.json();

          const updated = products.map((p) => {
            const stockEntry = stockData.find((s) => s._id === p._id);
            return { ...p, stock: stockEntry?.stock ?? 0 };
          });

          set({ products: updated });
          return updated;
        } catch (err) {
          console.error("Stock update failed:", err);
          return products;
        }
      },

      getProductsWithStock: async () => {
        const updated = await get().updateStock();
        return updated;
      },

      clear: () => set({ products: [] }),
    }),
    {
      name: "recently-viewed-products",
      partialize: (state) => ({
        products: state.products,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.updateStock) {
          setTimeout(() => {
            state.updateStock();
          }, 0);
        }
      },
    }
  )
);

export default useRecentlyViewedStore;
