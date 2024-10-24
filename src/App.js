// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Views/Login';
import Home from './Views/Home';
import './styles/product.css';
import ProductDetail from './Views/ProductDetails';
import './styles/categories.css';
import './styles/cart.css';
import './styles/login.css';
import './styles/signup.css';
import './styles/checkout.css';
import './styles/productdetails.css';
import './styles/ReviewProduct.css';
import './styles/trending.css';
import { CartProvider } from './Controllers/CartContext';
import { UserProvider } from './Controllers/UserContext';
import Cart from './Views/Cart';
import Roles from './Views/Roles';
import SalesmanPage from './Views/SalesmanPage';
import StoreManagerPage from './Views/StoreManagerPage';
import SignUp from './Views/SignUp';
import ViewOrders from './Views/ViewOrders';
import CheckoutPage from './Views/CheckoutPage';
import Confirmation from './Views/Confirmation';
import ReviewProduct from './Views/ReviewProduct';
import TrendingPage from './Views/TrendingPage';


function App() {
  return (
    <UserProvider>
    <CartProvider>
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/:categoryId/product/:productId" element={<ProductDetail />} />
           <Route path="/cart" element={<Cart/>} />
          <Route path="/roles" element={<Roles/>} />
          <Route path="/salesman_page" element={<SalesmanPage />} />
          <Route path = "/store_manager_page" element = {<StoreManagerPage />} />
          <Route path = "/signup" element = {<SignUp />} />
          <Route path = "/view_orders" element = {<ViewOrders />} />
          <Route path = "/checkout" element = {<CheckoutPage />} />
          <Route path = "/confirmation" element = {<Confirmation />} />
          <Route path = "/review_product" element = {<ReviewProduct />} />
          <Route path = "/trending" element = {<TrendingPage />} />
        </Routes>
      </div>
    </Router>
    </CartProvider>
    </UserProvider>
  );
}

export default App;
