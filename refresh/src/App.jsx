import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import Products from "./pages/Products";

export default function App() {
  return (
    
      // <Routes>
      //   <Route path="/" element={<Login />} />
      //   <Route path="/signup" element={<SignUp />} />
      // </Routes>
      <Products />
    
  );
}
