import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // STATE
      items: [],
      shippingDetails: null,
      stockValidationResult: null, // Store validation results

      // ACTIONS
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id
          );

          if (existingItem) {
            // If item exists, increase quantity
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // Add new item with quantity 1
            return {
              items: [
                ...state.items,
                { ...product, quantity: 1, addedAt: Date.now() },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },

      updateQuantity: (productId, newQuantity) => {
        set((state) => {
          if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            return {
              items: state.items.filter((item) => item._id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item._id === productId ? { ...item, quantity: newQuantity } : item
            ),
          };
        });
      },

      incrementQuantity: (productId) => {
        set((state) => {
          return {
            items: state.items.map((item) => {
              if (item._id === productId) {
                const newQuantity = item.quantity + 1;
                return newQuantity > item.stock
                  ? { ...item, quantity: item.stock }
                  : { ...item, quantity: newQuantity };
              }
              return item;
            }),
          };
        });
      },

      decrementQuantity: (productId) => {
        set((state) => {
          return {
            items: state.items.map((item) => {
              if (item._id === productId) {
                const newQuantity = item.quantity - 1;
                return newQuantity < 1
                  ? { ...item, quantity: 1 }
                  : { ...item, quantity: newQuantity };
              }
              return item;
            }),
          };
        });
      },

      clearCart: () => set({ items: [], stockValidationResult: null }),

      // STOCK VALIDATION METHODS
      validateCartStock: async () => {
        const { items } = get();

        if (items.length === 0) {
          set({ stockValidationResult: { isValid: true, issues: [] } });
          return { isValid: true, issues: [] };
        }

        try {
          // Get current stock for all products in cart
          const productIds = items.map((item) => item._id);
          const response = await fetch("/api/v1/products/stock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch stock data");
          }

          const stockData = await response.json();

          const issues = [];
          const updatedItems = [];

          items.forEach((item) => {
            const currentStock = stockData.find(
              (stock) => stock._id === item._id
            );

            if (!currentStock) {
              // Product no longer exists
              issues.push({
                type: "removed",
                productId: item._id,
                productName: item.name,
                message: `${item.name} is no longer available and has been removed from your cart.`,
              });
              return; // Don't add to updatedItems
            }

            if (currentStock.stock === 0) {
              // Product out of stock
              issues.push({
                type: "out_of_stock",
                productId: item._id,
                productName: item.name,
                message: `${item.name} is out of stock and has been removed from your cart.`,
              });
              return; // Don't add to updatedItems
            }

            if (item.quantity > currentStock.stock) {
              // Quantity reduced
              issues.push({
                type: "quantity_reduced",
                productId: item._id,
                productName: item.name,
                oldQuantity: item.quantity,
                newQuantity: currentStock.stock,
                message: `${item.name} quantity reduced from ${item.quantity} to ${currentStock.stock} due to limited stock.`,
              });

              updatedItems.push({
                ...item,
                quantity: currentStock.stock,
                stock: currentStock.stock, // Update stock info
              });
            } else {
              // No issues, just update stock info
              updatedItems.push({
                ...item,
                stock: currentStock.stock,
              });
            }
          });

          const validationResult = {
            isValid: issues.length === 0,
            issues,
            hasChanges: issues.length > 0,
          };

          // Update cart with validated items and store validation result
          set({
            items: updatedItems,
            stockValidationResult: validationResult,
          });

          return validationResult;
        } catch (error) {
          console.error("Stock validation failed:", error);
          const errorResult = {
            isValid: false,
            issues: [
              {
                type: "error",
                message:
                  "Unable to validate stock. Please refresh and try again.",
              },
            ],
            hasChanges: false,
          };

          set({ stockValidationResult: errorResult });
          return errorResult;
        }
      },

      // Get validation results without triggering new validation
      getStockValidationResult: () => {
        return get().stockValidationResult;
      },

      clearStockValidationResult: () => {
        set({ stockValidationResult: null });
      },

      // GETTERS (Computed values)
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemById: (id) => {
        const { items } = get();
        return items.find((item) => item._id === id);
      },

      isItemInCart: (productId) => {
        const { items } = get();
        return items.some((item) => item._id === productId);
      },

      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find((item) => item._id === productId);
        return item ? item.quantity : 0;
      },

      getCartSummary: () => {
        const { items } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return {
          totalItems,
          totalPrice,
          itemCount: items.length,
          isEmpty: items.length === 0,
        };
      },

      // New shipping details methods
      setShippingDetails: (details) => {
        set({ shippingDetails: details });
      },

      getShippingDetails: () => {
        return get().shippingDetails;
      },

      clearShippingDetails: () => {
        set({ shippingDetails: null });
      },

      completeOrder: () => {
        set({
          items: [],
          shippingDetails: null,
          stockValidationResult: null,
        });
      },

      getOrderData: () => {
        const cartSummary = get().getCartSummary();
        const shippingDetails = get().shippingDetails;

        const subtotal = cartSummary.totalPrice;

        let shipping = 149;
        if (subtotal >= 5000) {
          shipping = 0;
        } else if (subtotal >= 1000) {
          shipping = 99;
        }

        return {
          items: cartSummary.items,
          subtotal,
          shipping,
          total: subtotal + shipping,
          shippingDetails,
          orderDate: new Date().toISOString(),
        };
      },
    }),
    {
      name: "shopping-cart",
      partialize: (state) => ({
        items: state.items,
        shippingDetails: state.shippingDetails,
      }),
    }
  )
);

export default useCartStore;
