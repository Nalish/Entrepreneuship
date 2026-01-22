import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Products from "./pages/Products";
import Branches from "./pages/Branches";
import { CartProvider } from "./Context/CartContext";
import { UserProvider } from "./Context/UserContext";
import AdminDashboard from "./admin/adminDashboard";

export default function App() {
  return (

     
      <UserProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/products/:branchId" element={<Products />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </UserProvider>
    


  );
}
