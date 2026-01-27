import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";
import "../assets/styles/Products.css";
import CartModal from "../components/CartModal";

const Products = () => {
  const { branchId } = useParams();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const { user, loading: userLoading } = useUser();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const branchName = location.state?.branchName || "Branch";

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const fetchBranchStock = async () => {
    try {
      const response = await axios.get(
        `https://refresh-backend-v9ti.onrender.com/api/stock/branch/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStocks(response.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchStock();
  }, [branchId]);

  const handleAddToCart = (stock) => {
    if (stock.quantity <= 0) return;

    addToCart({
      productId: stock.product.id,
      name: stock.product.name,
      price: stock.product.price,
      stockId: stock.id,
      branchId: Number(branchId),
    });

    // Don't reduce stock locally here - let checkout handle it
  };

  const handleCheckoutUpdateStock = (checkoutItems) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) => {
        const item = checkoutItems.find((i) => i.productId === stock.product.id);
        if (item) {
          return { ...stock, quantity: stock.quantity - item.quantity };
        }
        return stock;
      })
    );
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className={`products-container ${isCartOpen ? "modal-open" : ""}`}>
      <header className="header">
        <div className="logo">REFRESH</div>
        <div className="welcome">Welcome, {userLoading ? "Loading..." : user?.fullName || "Guest"}</div>

        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          🛒 Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </header>

      <h2>Products Available at {branchName}</h2>

      <div className="products-grid">
        {stocks.length === 0 && <p>No products available.</p>}

        {stocks.map((stock) => (
          <div key={stock.id} className="product-card">
            <h3>{stock.product.name}</h3>
            <p><strong>Price:</strong> KES {stock.product.price}</p>
            <p><strong>Available:</strong> {stock.quantity}</p>

            <button
              className="buyBTN"
              disabled={stock.quantity === 0}
              onClick={() => handleAddToCart(stock)}
            >
              {stock.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckoutUpdateStock}
        branchId={Number(branchId)}
        customerId={user?.id}
      />
    </div>
  );
};

export default Products;
