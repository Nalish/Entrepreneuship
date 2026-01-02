import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/Branches.css"; 
import { useNavigate } from "react-router-dom";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userName= "Jane"
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/branch",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // if your backend returns { branches: [...] }
        setBranches(response.data.branches || response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load branches");
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const navigate=useNavigate()
  const handleSelectedBranch = (branch) => {
    navigate(`/products/${branch.id}`, {
      state: {
        branchName: branch.name,
      },
    });
  };

  if (loading) return <p>Loading branches...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <header className="header">
        <div className="logo">REFRESH</div>
        <div className="welcome">Welcome, {userName}</div>
       
      </header>
    
    <div style={styles.container}>
      {branches.map((branch) => (
        <div key={branch.id} style={styles.card}>
          <h3>{branch.name}</h3>
          <p><strong>Location:</strong> {branch.location}</p>

          <p>
            <strong>Stock Items:</strong>{" "}
            {branch.stock ? branch.stock.length : 0}
          </p>

          <p>
            <strong>Sales Made:</strong>{" "}
            {branch.sales ? branch.sales.length : 0}
          </p>
          <p>
            <button className="branchBTN" onClick={() =>handleSelectedBranch(branch)}>Select Branch</button>
          </p>
        </div>
      ))}
    </div>
    </>
  );
};

export default Branches;

/* Inline styles (you can move these to CSS) */
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
};
