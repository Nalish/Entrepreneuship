import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesProgress = () => {
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);
  const [report, setReport] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterAndReport();
  }, [selectedBranch, sales, items]);

  const fetchData = async () => {
    try {
      const [salesRes, itemsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/sale"),
        axios.get("http://localhost:3001/api/item")
      ]);

      setSales(salesRes.data);
      setItems(itemsRes.data);

      const uniqueBranches = [
        ...new Map(salesRes.data.map(s => [s.branch.id, s.branch])).values()
      ];
      setBranches(uniqueBranches);

    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const filterAndReport = () => {
    const brandMap = {};
    let total = 0;

    items.forEach((item) => {
      const sale = sales.find(s => s.id === item.sale.id);
      if (!sale) return;

      if (selectedBranch !== "All" && sale.branch.id !== Number(selectedBranch)) {
        return;
      }

      const brand = item.product?.name || "Unknown";
      const qty = item.quantity;
      const unit = parseFloat(item.unitPrice);
      const amount = qty * unit;

      if (!brandMap[brand]) {
        brandMap[brand] = { brand, quantity: 0, income: 0 };
      }

      brandMap[brand].quantity += qty;
      brandMap[brand].income += amount;
      total += amount;
    });

    setReport(Object.values(brandMap));
    setGrandTotal(total);
  };

  return (
    <div>
      <h2>Admin Sales Report</h2>

      <label>
        Filter by Branch:{" "}
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="All">All Branches</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </label>

      <table border="1" cellPadding="8" style={{ marginTop: "15px" }}>
        <thead>
          <tr>
            <th>Drink Brand</th>
            <th>Total Quantity Sold</th>
            <th>Total Income (Ksh)</th>
          </tr>
        </thead>
        <tbody>
          {report.map((row, index) => (
            <tr key={index}>
              <td>{row.brand}</td>
              <td>{row.quantity}</td>
              <td>{row.income.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>
        Grand Total: Ksh {grandTotal.toLocaleString()}
      </h3>
    </div>
  );
};

export default SalesProgress;
