import React, { useContext, useState } from 'react';
import { CartContext } from '../Controllers/CartContext';
import NavBar from './NavBar';
import { useUser } from '../Controllers/UserContext';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {handleWarrantyChange} from '../Models/CartModel';
import {handleRemoveFromCart} from '../Models/CartModel';
import { handleClearCart } from '../Models/CartModel';

const Cart = () => {
  const { cartProducts, fetchCart, clearCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const { username } = useUser();
  const navigate = useNavigate();

  const handleAddOrder = () => {
    navigate('/checkout');
  };

  const handleClose = () => {
    setOpen(false);
  };







  const calculateProductTotal = (product) => {
    let total = product.product_price * product.quantity;
    if (product.hasWarranty) {
      total += product.product_price * 0.1 * product.quantity;
    }
    return total;
  };

  const totalPrice = cartProducts.reduce((total, product) => total + calculateProductTotal(product), 0);

  return (
    <div className="home-container">
      <NavBar />
      <div className="cart">
        <h1>Your Cart</h1>
        <div className="cart-items">
          {cartProducts.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cartProducts.map((product) => (
                <div key={product.product_id} className="cart-item">
                  {product.product_image ? (
                    <img src={product.product_image} alt={product.product_name} style={{ width: '50px', height: '50px' }} />
                  ) : (
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#ccc' }}>No Image</div>
                  )}
                  <div>
                    <h3>{product.product_name}</h3>
                    <p>Price: ${product.product_price?.toFixed(2) ?? 'N/A'}</p>
                    <p>Quantity: {product.quantity}</p>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={product.hasWarranty || false}
                          onChange={(e) => handleWarrantyChange(username,product.product_id, e.target.checked,fetchCart)}
                        />
                      }
                      label="Add Warranty (+10%)"
                    />
                    <p>Total: ${calculateProductTotal(product).toFixed(2)}</p>
                  </div>
                  <button onClick={() => handleRemoveFromCart(username,product.product_id,fetchCart)}>Remove</button>
                </div>
              ))}
        
              <div className="cart-summary">
                <h2>Total: ${totalPrice.toFixed(2)}</h2>
                <button onClick={()=>{handleClearCart(username,clearCart)}}>Clear Cart</button>
                <br />
                <button onClick={handleAddOrder}>Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Order Confirmation</DialogTitle>
        <DialogContent>
          <p>Your order has been placed successfully!</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/view_orders')} color="primary">
            View Orders
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Cart;