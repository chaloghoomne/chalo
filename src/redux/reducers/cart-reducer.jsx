const initialState = {
    cartItems: [],
  };
  
  export const CartReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_TO_CART":
        const item = action.payload;
        const existingItem = state.cartItems.find((i) => i.id === item.id);
  
        if (existingItem) {
          // If item exists, update quantity
          return {
            ...state,
            cartItems: state.cartItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        } else {
          // If new item, add to cart
          return {
            ...state,
            cartItems: [...state.cartItems, { ...item, quantity: 1 }],
          };
        }
  
      case "REMOVE_FROM_CART":
        return {
          ...state,
          cartItems: state.cartItems.filter((item) => item.id !== action.payload),
        };
  
      case "CLEAR_CART":
        return {
          ...state,
          cartItems: [],
        };
  
      default:
        return state;
    }
  };
  
  // Action creators
  export const addToCart = (item) => ({ type: "ADD_TO_CART", payload: item });
  export const removeFromCart = (id) => ({ type: "REMOVE_FROM_CART", payload: id });
  export const clearCart = () => ({ type: "CLEAR_CART" });
  