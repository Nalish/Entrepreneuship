import React, { useEffect, useState } from "react";
import "../assets/styles/Products.css";
import { useCart } from "../Context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false); // modal state

  const userName = "Jane";
  const { addToCart, cartItems, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="page">
      {/* HEADER */}
      <header className="header">
        <div className="logo">REFRESH</div>
        <div className="welcome">Welcome, {userName}</div>
        <button className="cart-button" onClick={openCart}>
          Cart ({cartItems.length})
        </button>
      </header>

      {/* CONTENT */}
      <main className="content">
        <h1 className="page-title">Available Products</h1>

        {loading && <p className="status">Loading products...</p>}
        {error && <p className="status error">{error}</p>}

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <p className="price">KES {Number(product.price).toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>

      {/* CART MODAL */}
      {isCartOpen && (
        <div className="cart-modal-overlay" onClick={closeCart}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity}{" "}
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="cart-actions">
              <button onClick={clearCart}>Clear Cart</button>
              <button onClick={closeCart}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
