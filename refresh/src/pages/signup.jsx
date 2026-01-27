import React, { useState } from "react";
import "../assets/styles/signup.css";
import authService from "../services/authService"
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
 
  const navigate =useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend-only validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // ONLY send fields your backend expects
      const userData = {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await authService.register(userData);

      setIsSubmitted(true);
     navigate("/")

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Register Error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Join us and enjoy great services ☕</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        {/* Frontend-only field */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        {isSubmitted && (
          <p className="success-message">
            Registration successful! Please log in.
          </p>
        )}

        <span className="login-text">
          Already have an account? <a href="/">Login</a>
        </span>
      </form>
    </div>
  );
}

export default Signup;
