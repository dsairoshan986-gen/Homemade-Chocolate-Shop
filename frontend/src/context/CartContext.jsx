import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ==============================
  // LOAD CART FROM LOCAL STORAGE
  // ==============================
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("chocolate_cart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // ==============================
  // SAVE CART TO LOCAL STORAGE
  // ==============================
  useEffect(() => {
    try {
      localStorage.setItem(
        "chocolate_cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems]);

  // ==============================
  // ADD TO CART
  // ==============================
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("Invalid product:", product);
      return;
    }

    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => Number(item.id) === Number(product.id)
      );

      // Product already exists
      if (existingItem) {
        const newQuantity =
          Number(existingItem.quantity) + safeQuantity;

        // Don't exceed stock
        const stock = Number(product.stock);

        const finalQuantity =
          stock > 0
            ? Math.min(newQuantity, stock)
            : newQuantity;

        return currentItems.map((item) =>
          Number(item.id) === Number(product.id)
            ? {
                ...item,
                quantity: finalQuantity,
              }
            : item
        );
      }

      // New product
      const stock = Number(product.stock);

      const finalQuantity =
        stock > 0
          ? Math.min(safeQuantity, stock)
          : safeQuantity;

      return [
        ...currentItems,
        {
          ...product,
          quantity: finalQuantity,
        },
      ];
    });
  };

  // ==============================
  // REMOVE FROM CART
  // ==============================
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => Number(item.id) !== Number(productId)
      )
    );
  };

  // ==============================
  // UPDATE QUANTITY
  // ==============================
  const updateQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (Number(item.id) !== Number(productId)) {
          return item;
        }

        const stock = Number(item.stock);

        const finalQuantity =
          stock > 0
            ? Math.min(newQuantity, stock)
            : newQuantity;

        return {
          ...item,
          quantity: finalQuantity,
        };
      })
    );
  };

  // ==============================
  // CLEAR CART
  // ==============================
  const clearCart = () => {
    setCartItems([]);
  };

  // ==============================
  // CART COUNT
  // ==============================
  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ==============================
  // CART TOTAL
  // ==============================
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ==============================
  // CONTEXT VALUE
  // ==============================
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ==============================
// USE CART HOOK
// ==============================
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
}