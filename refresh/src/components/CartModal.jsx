import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { checkout } from "../services/checkoutService";
import { createPayment } from "../services/paymentService";
import "../assets/styles/CartModal.css";

const CartModal = ({ isOpen, onClose, onCheckout, branchId, customerId }) => {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [saleId, setSaleId] = useState(null);

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (!customerId) {
      alert("Please log in to checkout");
      return;
    }

    if (!branchId) {
      alert("Branch ID is missing");
      return;
    }

    setLoading(true);

    try {
      const checkoutItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice ?? item.price,
      }));

      // For M-Pesa, don't create sale yet - just show payment form
      if (paymentMethod === "mpesa") {
        setShowPaymentForm(true);
        setLoading(false);
        return;
      }

      // For Cash/Card, create sale immediately
      const result = await checkout({
        branchId,
        customerId,
        items: checkoutItems,
        paymentMethod,
      });

      // Save sale ID and show payment form
      setSaleId(result.saleId);
      setShowPaymentForm(true);
      
      // Update frontend stock immediately
      if (onCheckout) onCheckout(checkoutItems);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Checkout failed";
      alert(message);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === "mpesa" && !phoneNumber) {
      alert("Please enter your phone number for M-Pesa");
      return;
    }

    setLoading(true);

    try {
      let finalSaleId = saleId;

      // For M-Pesa, create the sale now before payment
      if (paymentMethod === "mpesa" && !saleId) {
        const checkoutItems = cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? item.price,
        }));

        const checkoutResult = await checkout({
          branchId,
          customerId,
          items: checkoutItems,
          paymentMethod: "cash", // Use cash endpoint to create sale
        });

        finalSaleId = checkoutResult.saleId;
        setSaleId(checkoutResult.saleId);

        // Update frontend stock immediately
        if (onCheckout) onCheckout(checkoutItems);
      }

      // Now process the payment
      const result = await createPayment({
        saleId: finalSaleId,
        amount: total,
        method: paymentMethod,
        phoneNumber: paymentMethod === "mpesa" ? phoneNumber : undefined,
      });

      clearCart();
      setShowPaymentForm(false);
      setSaleId(null);
      setPhoneNumber("");
      setPaymentMethod("mpesa");
      onClose();

      if (paymentMethod === "mpesa") {
        alert(`Payment initiated! Enter PIN on your phone. Sale ID: ${finalSaleId}`);
      } else {
        alert(`${paymentMethod.toUpperCase()} payment successful! Sale ID: ${finalSaleId}`);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Payment failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h3>{showPaymentForm ? "Payment" : "Your Cart"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!showPaymentForm ? (
          <>
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
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="payment-form">
            <div className="payment-summary">
              <p><strong>Sale Amount:</strong> KES {total}</p>
            </div>

            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  value="mpesa"
                  checked={paymentMethod === "mpesa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>M-Pesa</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Card</span>
              </label>
            </div>

            {paymentMethod === "mpesa" && (
              <div className="mpesa-input">
                <label>Phone Number</label>
                <input
                  type="text"
                  placeholder="254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}

            <div className="payment-actions">
              <button
                className="checkout-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Processing..." : `Pay with ${paymentMethod.toUpperCase()}`}
              </button>
              <button
                className="back-btn"
                onClick={() => {
                  setShowPaymentForm(false);
                  setSaleId(null);
                }}
                disabled={loading}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
