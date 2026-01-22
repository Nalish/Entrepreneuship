import React, { useState } from "react";
import "../assets/styles/Login.css";
import authService from "../services/authservice";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchUser } = useUser();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(formData);
      console.log("Login response:", data);

      // Store userId and token in localStorage
      if (data.user?.id) {
        localStorage.setItem("userId", data.user.id);
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert("Login successful!");
      
      // Refetch user data immediately
      await refetchUser();
      
      navigate("/branches");
    
    } catch (error) {
      console.error("Login error:", error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back 🍹</h2>
        <p>Log in and enjoy a refreshing experience</p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <span className="signup-text">
          Create an account:<Link to="/signup">Sign up</Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
