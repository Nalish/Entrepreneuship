import React, { useEffect, useState } from "react";
import axios from "axios";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ product_name: "", quantity: "", price: "" });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/stock");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/stock", form);
      setForm({ product_name: "", quantity: "", price: "" });
      fetchStocks(); // Refresh table
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Stock Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
        <button type="submit">Add / Update Stock</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.product_name}</td>
              <td>{stock.quantity}</td>
              <td>{stock.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;
