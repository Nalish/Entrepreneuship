import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesProgress = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/sale");
      console.log("Sales API response:", res.data);
      setSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div>
      <h2>Sales Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity Sold</th>
            <th>Total Price</th>
            <th>Date</th>
            <th>Branch</th> {/* Added branch */}
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) =>
            sale.items.map((item) => (
              <tr key={`${sale.id}-${item.id}`}>
                <td>{item.product?.name || 'Unknown'}</td>
                <td>{item.quantity}</td>
                <td>{item.totalPrice || sale.totalAmount}</td>
                <td>{new Date(sale.saleDate).toLocaleString()}</td>
                <td>{sale.branch?.name || 'Unknown'}</td> {/* Display branch name */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesProgress;
