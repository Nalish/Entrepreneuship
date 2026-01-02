import React from "react";
import { useCart } from "../Context/CartContext";
import "../assets/styles/Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return <h2 className="empty-cart">Your cart is empty 🛒</h2>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div key={item.stockId} className="cart-item">
          <div>
            <h4>{item.name}</h4>
            <p>Price: KES {item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.stockId)}
          >
            Remove
          </button>
        </div>
      ))}

      <h3 className="total">Total: KES {total}</h3>

      <button className="checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
