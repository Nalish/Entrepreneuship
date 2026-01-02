import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Products from "./pages/Products";
import Branches from "./pages/Branches";
import { CartProvider } from "./Context/CartContext";

export default function App() {
  return (

     
      <CartProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/products/:branchId" element={<Products />} />
        </Routes>
      </CartProvider>
    


  );
}
