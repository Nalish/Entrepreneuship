import React, { useEffect, useState } from "react";
import axios from "axios";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [hqStock, setHqStock] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [form, setForm] = useState({
    id: null,
    productId: "",
    branchId: "",
    quantity: ""
  });

  useEffect(() => {
    fetchBranches();
    fetchProducts();
    fetchStocks();
  }, []);

  const fetchBranches = async () => {
    const res = await axios.get("https://refresh-backend-v9ti.onrender.com/api/branch");
    setBranches(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get("https://refresh-backend-v9ti.onrender.com/api/products");
    setProducts(res.data);
  };

  const fetchStocks = async () => {
    const res = await axios.get("https://refresh-backend-v9ti.onrender.com/api/stock");
    setStocks(res.data);

    // Extract HQ stock separately
    const hq = res.data.filter(s => s.branch.isHQ);
    setHqStock(hq);
  };

  const filteredStocks = selectedBranch
    ? stocks.filter(s => s.branch.id === Number(selectedBranch))
    : stocks;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      productId: form.productId,
      branchId: form.branchId,
      quantity: Number(form.quantity)
    };

    try {
      if (form.id) {
        await axios.put(`https://refresh-backend-v9ti.onrender.com/api/stock/${form.id}`, payload);
      } else {
        await axios.post("https://refresh-backend-v9ti.onrender.com/api/stock", payload);
      }

      setForm({ id: null, productId: "", branchId: "", quantity: "" });
      fetchStocks();
    } catch (error) {
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred while updating stock");
      }
    }
  };

  return (
    <div>
      <h2>Branch Stock Management</h2>

      <h3>HQ Stock</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {hqStock.map(stock => (
            <tr key={stock.id}>
              <td>{stock.product.name}</td>
              <td>{stock.quantity}</td>
              <td>{stock.quantity < 5 ? "Low Stock" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <select
        value={selectedBranch}
        onChange={(e) => setSelectedBranch(e.target.value)}
      >
        <option value="">All Branches</option>
        {branches.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <select
          value={form.branchId}
          onChange={(e) => setForm({ ...form, branchId: e.target.value })}
          required
        >
          <option value="">Select Branch</option>
          {branches
            .filter(b => !b.isHQ) // Can't restock HQ manually
            .map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
        </select>

        <select
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
          min="1"
        />

        <button type="submit">
          {form.id ? "Update Stock" : "Add Stock"}
        </button>
      </form>

      <h3>Branch Stocks</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStocks
            .filter(s => !s.branch.isHQ) // Don't duplicate HQ rows
            .map(stock => (
            <tr key={stock.id}>
              <td>{stock.branch.name}</td>
              <td>{stock.product.name}</td>
              <td>{stock.quantity}</td>
              <td>{stock.quantity < 5 ? "Low Stock" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;
