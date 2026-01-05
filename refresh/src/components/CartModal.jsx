import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { checkout } from "../services/checkoutService";
import "../assets/styles/CartModal.css";

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity,
    0
  );

  const branchId = 1; // Hardcoded for now
  const customerId = 4; // Hardcoded for now

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);

    try {
      const checkoutItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? item.price,
      }));

      const result = await checkout({
        branchId,
        customerId,
        items: checkoutItems,
      });

      // Update frontend stock immediately
      if (onCheckout) onCheckout(checkoutItems);

      clearCart();
      onClose();
      alert(`Checkout successful! Sale ID: ${result.saleId}`);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Checkout failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

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
              <div key={item.productId} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    KES {item.unitPrice ?? item.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}

            <div className="cart-footer">
              <h4>Total: KES {total}</h4>
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
