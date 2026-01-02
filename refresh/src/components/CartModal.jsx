import React from "react";
import { useCart } from "../Context/CartContext";
import "../assets/styles/CartModal.css";

const CartModal = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart } = useCart();

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h3>Your Cart</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty">Cart is empty 🛒</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.stockId} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>KES {item.price} × {item.quantity}</p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.stockId)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="cart-footer">
              <h4>Total: KES {total}</h4>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
