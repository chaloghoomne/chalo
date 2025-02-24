import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../../redux/reducers/cart-reducer";
import { FaTrash } from "react-icons/fa";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.CartReducer.cartItems);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🛒 Your Cart ({cartItems.length} items)</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 p-4 bg-gray-200 rounded-lg">
            <h3 className="text-xl font-bold text-gray-800">Total: ₹{totalPrice}</h3>
            <button 
              onClick={() => dispatch(clearCart())} 
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
