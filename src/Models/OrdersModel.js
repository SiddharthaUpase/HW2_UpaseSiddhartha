export const fetchStores = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/getStores', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.stores;
    } catch (error) {
        console.error('Error getting stores:', error);
    }
};

export const saveOrder = async (username, formData, homeDelivery, storePickup, stores, confirmationId, cartProducts, originalTotalPrice) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/addOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                customer_name: formData.firstname + ' ' + formData.lastname,
                shipping_address: formData.address + ', ' + formData.city + ', ' + formData.state + ', ' + formData.zip,
                street_address: formData.address,
                city: formData.city,
                state: formData.state,
                zip_code: formData.zip,
                creditcard_number: formData.cardnumber,
                ship_date: new Date().toISOString(),
                shipping_cost: homeDelivery ? 12 : 0,
                total_cost: originalTotalPrice.toFixed(2),
                homeDelivery: homeDelivery,
                storePickup: storePickup,
                store_name: storePickup ? stores[formData.store].store_name : null,
                store_address: storePickup ? stores[formData.store].store_address : null,
                store_id: storePickup ? stores[formData.store].store_id : null,
                confirmation_number: confirmationId,
                products: cartProducts.map((product) => {
                    return {
                        product_id: product.product_id,
                        product_name: product.product_name,
                        price: product.product_price,
                        quantity: product.quantity,
                        product_image: product.product_image,
                        haswarranty: product.hasWarranty,
                        category_id: product.category_id,
                    };
                })
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Order saved:', data);
    } catch (error) {
        console.error('Error saving order:', error);
    }
};


export const fetchOrders = async (username, setOrders) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/getOrders', {
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
        setOrders(data);
        console.log('Orders:', data);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};


export const cancelOrder = async (orderId, username, setOrders) => {
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

        const updatedOrders = await fetch('http://127.0.0.1:8000/getOrders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!updatedOrders.ok) {
            throw new Error(`HTTP error! status: ${updatedOrders.status}`);
        }

        const updatedData = await updatedOrders.json();
        setOrders(updatedData);
        
    } catch (error) {
        console.error('Error cancelling order:', error);
    }
};

