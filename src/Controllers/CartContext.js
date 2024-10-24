import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useUser } from '../Controllers/UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { username } = useUser();
  const [deliveryFee] = useState(12);

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/getCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const consolidatedData = Object.values(data.reduce((acc, item) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = { ...item };
        } else {
          acc[item.product_id].quantity += item.quantity;
        }
        return acc;
      }, {}));
      setCartProducts(consolidatedData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [username]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const categories = await response.json();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const allProducts = categories.flatMap(category => category.products);
    const total = cartProducts.reduce((total, cartItem) => {
      const product = allProducts.find(p => p.product_id === cartItem.product_id);
      if (!product) return total;
      const productTotal = product.product_price * cartItem.quantity;
      const warrantyCost = cartItem.hasWarranty ? product.product_price * 0.1 * cartItem.quantity : 0;
      return total + productTotal + warrantyCost;
    }, 0);
    setTotalPrice(total);
  }, [cartProducts, categories]);

  const adjustDeliveryFee = (shouldAdd) => {
    setTotalPrice(prevTotal => shouldAdd ? prevTotal + deliveryFee : prevTotal - deliveryFee);
  };


  const addToCart = useCallback((productId, quantity = 1) => {
    setCartProducts(prevProducts => {
      const existingProduct = prevProducts.find(product => product.product_id === productId);
      if (existingProduct) {
        return prevProducts.map(product =>
          product.product_id === productId
            ? { ...product, quantity: product.quantity + quantity }
            : product
        );
      } else {
        return [...prevProducts, { product_id: productId, quantity, hasWarranty: false }];
      }
    });

    

  }, []);

  const updateCartItem = useCallback((productId, updates) => {
    setCartProducts(prevProducts => prevProducts.map(product =>
      product.product_id === productId
        ? { ...product, ...updates }
        : product
    ).filter(product => product.quantity > 0));
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartProducts(prevProducts => prevProducts.filter(product => product.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartProducts([]);
  }, []);

  return (
    <CartContext.Provider value={{ 
      cartProducts, 
      totalPrice, 
      fetchCart,
      addToCart, 
      removeFromCart, 
      clearCart, 
      updateCartItem,
      adjustDeliveryFee
    }}>
      {children}
    </CartContext.Provider>
  );
};