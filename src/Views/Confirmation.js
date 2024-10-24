import React, {useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { CartContext } from '../Controllers/CartContext';

const Confirmation = () => {
    const [showConfetti, setShowConfetti] = useState(true);
    const location = useLocation();
    const { orderId, confirmationId } = location.state || {};
    const navigate = useNavigate();
    const { clearCart,cartProducts } = useContext(CartContext);

    const [orderdetails, setOrderdetails] = useState([]);

    useEffect(() => {
        setOrderdetails(cartProducts);
        for (let i = 0; i < orderdetails.length; i++) {
            const order = orderdetails[i];
            console.log(order);
            console.log(order.product_id);
            console.log(order.product_name);
            console.log(order.product_price);
            console.log(order.product_quantity);
            console.log(order.product_image);
            
        }

    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowConfetti(false);
        }, 10000); // Show confetti for 5 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleGoHome = () => {
        navigate('/home');
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {showConfetti && <Confetti />}
            <h1>Order Confirmation</h1>
            <p>Order ID: {orderId}</p>
            <p>Confirmation ID: {confirmationId}</p>
            <p>Thank you for shopping with us!</p>
            <button onClick={handleGoHome}>Go back to Home</button>
        </div>
    );
};

export default Confirmation;