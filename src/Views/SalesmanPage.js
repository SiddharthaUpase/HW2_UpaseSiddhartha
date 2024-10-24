import React, { useState, useEffect } from 'react';
//import alert dialog from material ui
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



const SalesmanPage = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    //error handling
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [openOrder, setOpenOrder] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);


    const handleDeleteOrder = (order) => {
        setCurrentOrder(order);
        setOpen(true);
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/getCustomers');
            const data = await response.json();
            const customers = data.customers;
            setCustomers(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // Fetch customers when the component mounts
    useEffect(() => {
        fetchCustomers();
    }, []);

    const createCustomer = async (customerData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/createAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });
            
            const result = await response.json();

            if (result.error) {
                setError(result.error);
            }
            else {
                
                    alert('Customer created successfully');
                    //call the fetchCustomers function to update the customers
                    fetchCustomers();
                
            }


        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };


    //delete customer
    const deleteCustomer = async (customer_name) => {
        console.log('Deleting customer:', customer_name);
        try {
            const response = await fetch('http://127.0.0.1:8000/deleteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: customer_name,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            //call the fetchCustomers function to update the customers
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleDeleteCustomer = (customer) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(customer);
        }

    };


    //endpoint to get all the orders
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/getAllOrders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Fetch orders when the component mounts
    useEffect(() => {
        fetchOrders();
    }, []); 

    const addOrder = async (orderData) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
            const newOrder = await response.json();
            setOrders([...orders, newOrder]);
        } catch (error) {
            console.error('Error adding order:', error);
        }
    };

    const deleteOrder = async (orderId) => {
        console.log('Cancelling order:', orderId);
        try {
            const response = await fetch('http://127.0.0.1:8000/cancelOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    order_id: orderId,
                }),
            });
            console.log('Order_id:', orderId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            //call the fetchOrders function to update the orders
            fetchOrders();

            
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };


    const updateOrder = async (orderId, updatedData) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const updatedOrder = await response.json();
            setOrders(orders.map(order => (order.id === orderId ? updatedOrder : order)));
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };




    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#333' }}>Salesman Page</h1>
            <div>
                <h2 style={{ color: '#555' }}>Customers</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {customers.map(customer => (
                        <li key={customer} style={{ padding: '5px 0' }}>{customer}
                        
                        <button onClick={() => handleDeleteCustomer(customer)} style={{ marginLeft: '10px', padding: '5px 10px' }}>Delete</button>

                        </li>
                    ))}
                </ul>

                <h2 style={{ color: '#555' }}>Create Customer</h2>
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const customerData = Object.fromEntries(formData.entries());
                    //add role to customerData
                    customerData.role = 'customer';
                    await createCustomer(customerData);
                    e.target.reset();
                }} style={{ marginBottom: '20px' }}>
                    <input name="username" placeholder="UserName" required style={{ marginRight: '10px', padding: '5px' }} />
                    <input name="password" type='password' placeholder="Password" required style={{ marginRight: '10px', padding: '5px' }} />
                    <button type="submit" style={{ padding: '5px 10px' }}>Create</button>
                </form>

                <h2 style={{ color: '#555' }}>Add Order</h2>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const orderData = Object.fromEntries(formData.entries());
                    await addOrder(orderData);
                    e.target.reset();
                }} style={{ marginBottom: '20px' }}>
                    <input name="customerId" placeholder="Customer ID" required style={{ marginRight: '10px', padding: '5px' }} />
                    <input name="product" placeholder="Product" required style={{ marginRight: '10px', padding: '5px' }} />
                    <input name="quantity" placeholder="Quantity" required style={{ marginRight: '10px', padding: '5px' }} />
                    <button type="submit" style={{ padding: '5px 10px' }}>Add Order</button>
                </form>

                <h2 style={{ color: '#555' }}>Orders</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {orders.map(order => (
                        <li key={order.order_id} style={{ padding: '5px 0' }}>
                            {order.order_id} - {order.customer_name}
                            <button onClick={() => handleDeleteOrder(order)} style={{ marginLeft: '10px', padding: '5px 10px' }}>Delete</button>
                            <button onClick={() => {
                                const updatedData = { ...order, quantity: order.quantity + 1 };
                                updateOrder(order.order_id, updatedData);
                            }} style={{ marginLeft: '10px', padding: '5px 10px' }}>Update</button>
                        </li>
                    ))}
                </ul>
            </div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to cancel order for <strong>{currentOrder?.customer_name}</strong>  with order  <strong> ID:{currentOrder?.order_id}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={() => setOpen(false)} style={{ padding: '5px 10px' }}>No</button>
                    <button onClick={() => {
                        deleteOrder(currentOrder.order_id);
                        setOpen(false);
                    }} style={{ padding: '5px 10px' }}>Yes</button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SalesmanPage;