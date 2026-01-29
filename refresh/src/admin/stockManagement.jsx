import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://refresh-backend-v9ti.onrender.com/api";

const StockManagement = () => {
  const [stocks, setStocks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [hqStock, setHqStock] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("");

  const [hqForm, setHqForm] = useState({
    productId: "",
    quantity: ""
  });

  const [transferForm, setTransferForm] = useState({
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
    const res = await axios.get(`${API}/branch`);
    setBranches(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/products`);
    setProducts(res.data);
  };

  const fetchStocks = async () => {
    const res = await axios.get(`${API}/stock`);
    setStocks(res.data);

    const hq = res.data.filter(s => s.branch.isHQ === true);
    setHqStock(hq);
  };

  const filteredStocks = selectedBranch
    ? stocks.filter(s => s.branch.id === Number(selectedBranch))
    : stocks;

  // ---------- HQ STOCK ----------
  const handleHQStock = async (e) => {
    e.preventDefault();

    await axios.post(`${API}/stock/hq`, {
      productId: Number(hqForm.productId),
      quantity: Number(hqForm.quantity)
    });

    setHqForm({ productId: "", quantity: "" });
    fetchStocks();
  };

  // ---------- TRANSFER ----------
  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/stock/transfer`, {
        productId: Number(transferForm.productId),
        branchId: Number(transferForm.branchId),
        quantity: Number(transferForm.quantity)
      });

      setTransferForm({ productId: "", branchId: "", quantity: "" });
      fetchStocks();

    } catch (err) {
      alert(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div>
      <h2>Stock Management System</h2>

      {/* ---------- HQ TABLE ---------- */}
      <h3>HQ Warehouse</h3>
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
              <td>{stock.quantity < 5 ? "Low" : "OK"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- HQ FORM ---------- */}
      <h4>Stock HQ (Supplier → Warehouse)</h4>
      <form onSubmit={handleHQStock}>
        <select
          value={hqForm.productId}
          onChange={e => setHqForm({ ...hqForm, productId: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={hqForm.quantity}
          onChange={e => setHqForm({ ...hqForm, quantity: e.target.value })}
          required
        />

        <button type="submit">Stock HQ</button>
      </form>

      <hr />

      {/* ---------- TRANSFER FORM ---------- */}
      <h4>Transfer Stock (HQ → Branch)</h4>
      <form onSubmit={handleTransfer}>
        <select
          value={transferForm.branchId}
          onChange={e => setTransferForm({ ...transferForm, branchId: e.target.value })}
          required
        >
          <option value="">Select Branch</option>
          {branches.filter(b => !b.isHQ).map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={transferForm.productId}
          onChange={e => setTransferForm({ ...transferForm, productId: e.target.value })}
          required
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={transferForm.quantity}
          onChange={e => setTransferForm({ ...transferForm, quantity: e.target.value })}
          required
        />

        <button type="submit">Transfer</button>
      </form>

      {/* ---------- BRANCH TABLE ---------- */}
      <h3>Branch Stock</h3>
      <select
        value={selectedBranch}
        onChange={e => setSelectedBranch(e.target.value)}
      >
        <option value="">All Branches</option>
        {branches.filter(b => !b.isHQ).map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

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
            .filter(s => !s.branch.isHQ)
            .map(stock => (
              <tr key={stock.id}>
                <td>{stock.branch.name}</td>
                <td>{stock.product.name}</td>
                <td>{stock.quantity}</td>
                <td>{stock.quantity < 5 ? "Low" : "OK"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockManagement;
