import React, { useState } from "react";
import SalesProgress from "./salesProgress"
import "../assets/styles/AdminDashboard.css";
import StockManagement from './stockManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stocks");

  return (
    <div className="admin-dashboard">
      <h1>Admin Panel</h1>
      <div className="tabs">
        <button 
          className={activeTab === "stocks" ? "active" : ""} 
          onClick={() => setActiveTab("stocks")}>
          Stock Management
        </button>
        <button 
          className={activeTab === "sales" ? "active" : ""} 
          onClick={() => setActiveTab("sales")}>
          Sales Progress
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "stocks" && <StockManagement />}
        {activeTab === "sales" && <SalesProgress />}
      </div>
    </div>
  );
};

export default AdminDashboard;
