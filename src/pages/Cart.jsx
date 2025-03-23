import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const userEmail = localStorage.getItem("email"); // Retrieve email from localStorage

  useEffect(() => {
    if (userEmail) {
      fetchCart();
    }
  }, [userEmail]);

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart?email=${userEmail}`);
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Remove from Cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${productId}?email=${userEmail}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {cart.map((item) => (
              <div key={item.productId} className="border p-4 rounded-md shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-700">${item.price}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
