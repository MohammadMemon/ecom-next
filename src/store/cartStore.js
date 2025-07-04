import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // STATE
      items: [],
      shippingDetails: null,

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

      clearCart: () => set({ items: [] }),

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

      // Complete order method (clears cart and shipping details)
      completeOrder: () => {
        set({
          items: [],
          shippingDetails: null,
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
