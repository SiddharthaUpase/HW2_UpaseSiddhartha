import React, { useState, useEffect } from 'react';
import { useUser } from '../Controllers/UserContext';
import NavBar from './NavBar';
import { format, addWeeks, parseISO } from 'date-fns';
import { fetchOrders } from '../Models/OrdersModel';
import { cancelOrder } from '../Models/OrdersModel';
import { Dialog } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const { username } = useUser();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchOrdersData = async () => {
            await fetchOrders(username, setOrders);
        };
        

        fetchOrdersData();
    }, [username]);

    const handleCancelOrder = async (orderId) => {
        
        await cancelOrder(orderId, username, setOrders);
        setOpen(false);

    };

    return (
        <div>
            <NavBar />
            <h2>View Orders</h2>
            {orders.map((orderData, index) => {
                
                const estimatedArrival = addWeeks(parseISO(orderData.order_date), 2);
                return (
                    <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h3>Order ID: {orderData.order_id}</h3>
                        <p>Confirmation Number: {orderData.confirmation_number}</p>
                        <p>Order Date: {format(orderData.order_date, 'MMMM d, yyyy')}</p>
                        <p>Estimated Arrival: {format(estimatedArrival, 'MMMM d, yyyy')}</p>
                        <h4>Products:</h4>
                        {orderData.products.map((product, productIndex) => (
                            <div key={productIndex} style={{ marginLeft: '20px' }}>
                                <p>Name: {product.product_name}</p>
                                <p>Price: ${product.product_price.toFixed(2)}</p>
                                <p>Quantity: {product.quantity}</p>
                                <p>Warranty: {product.haswarranty ? 'Yes' : 'No'}</p>
                            </div>
                        ))}
                        <h5>Shipping: ${orderData.shipping_cost !== null ? orderData.shipping_cost.toFixed(2) : '0'}</h5>
                        <h5>Total: ${orderData.total_cost.toFixed(2)}</h5>
                        <button onClick={() => setOpen(true)}>Cancel Order</button>

                        {open && (
                            <Dialog open={open} onClose={() => setOpen(false)}>
                                <DialogTitle>Cancel Order</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to cancel this order?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)}>No</Button>
                                    <Button onClick={() => handleCancelOrder(orderData.order_id)} color="primary">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        )}

                    </div>
                );
            })}
        </div>
    );
};

export default ViewOrders;