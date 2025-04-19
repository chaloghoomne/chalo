"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { removeFromCart, clearCart } from "../../redux/reducers/cart-reducer"
import { FaTrash, FaShoppingBag, FaCreditCard } from "react-icons/fa"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import CheckoutForm from "./checkOutForm"
import { toast } from "react-toastify"
import axios from "axios"

const CartPage = () => {
  const dispatch = useDispatch()
  const [userCartIds, setUserCartIds] = useState([])
  const [backendCartItems, setBackendCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const cartItems = useSelector((state) => state.CartReducer.cartItems)

  // Fetch user cart IDs
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await fetchDataFromAPI("GET", `${BASE_URL}user-profile`)
        if (res.data && res.data.cart) {
          setUserCartIds(res.data.cart)
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const clearMyCart=async()=>{
    try{
      const token= localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}clear-cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(res.status === 200){toast("Cart Cleared");window.location.href = "/cart"}
    }catch(err){
      console.log("err",err);
      toast(err.message)
    }
  }

  // Fetch package details for each cart ID
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const fetchedItems = []
  
        for (const id of userCartIds) {
          if (!id) continue
          try {
            const response = await fetchDataFromAPI("GET", `${BASE_URL}visa-category/${id}`)
            const packageData = response?.data
            // console.log(packageData)
            if (packageData) {
              fetchedItems.push({
                id: packageData._id,
                name: packageData.visaTypeHeading || "Package",
                price: packageData.price || 0,
                image: packageData.image ,
                quantity: 1,
                description: packageData.description || "",
                document:packageData.documents
              })
            }
          } catch (innerError) {
            console.error(`Error fetching package with ID ${id}:`, innerError)
          }
        }
  
        setBackendCartItems(fetchedItems)
      } catch (error) {
        console.error("Error fetching packages:", error)
      } finally {
        setLoading(false)
      }
    }
  
    if (userCartIds && userCartIds.length > 0) {
      fetchPackages()
    }
  }, [userCartIds])
  

  // Combine items from Redux and backend
  const allCartItems = [...backendCartItems]

  // Calculate total price from both sources
  const totalPrice = allCartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0)

  const handleCheckout = () => {
    setShowCheckoutForm(true)
  }
  // console.log(backendCartItems)

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaShoppingBag className="mr-3 text-indigo-600" />
        Your Cart ({allCartItems.length} items)
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : allCartItems.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-10 text-center">
          <div className="text-gray-500 text-lg mb-4">
            Your cart is currently empty. Start adding items to fill it up! 🛒
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {allCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      
                    />
                    <div>
                      <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                      <p className="text-gray-600">
                        ₹{item.price.toLocaleString()} × {item.quantity || 1}
                      </p>
                      {item.description && <p className="text-gray-500 text-sm mt-1 max-w-md">{item.description}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700 transition mt-2 md:mt-0"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Total: ₹{totalPrice.toLocaleString()}</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>{ dispatch(clearCart());clearMyCart()}}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition flex items-center justify-center"
                >
                  <FaCreditCard className="mr-2" />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCheckoutForm && (
        <CheckoutForm onClose={() => setShowCheckoutForm(false)} totalPrice={totalPrice} cartItems={allCartItems} />
      )}
    </div>
  )
}

export default CartPage
