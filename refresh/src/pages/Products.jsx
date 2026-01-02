import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "../assets/styles/Products.css";
import CartModal from "../components/CartModal";

const Products = () => {
  const { branchId } = useParams();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const branchName = location.state?.branchName || "Branch";
  const userName = "Jane";

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const fetchBranchStock = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/stock/branch/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStocks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

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
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className={`products-container ${isCartOpen ? "modal-open" : ""}`}>
      <header className="header">
        <div className="logo">REFRESH</div>
        <div className="welcome">Welcome, {userName}</div>

        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          🛒 Cart 
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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

      {/* ✅ ONE cart modal only */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Products;
