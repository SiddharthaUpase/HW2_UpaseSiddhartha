




export const handleWarrantyChange = async (username,product_id, hasWarranty,fetchCart) => {
    console.log(product_id, hasWarranty);
    try {
        const response = await fetch('http://127.0.0.1:8000/updateCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, product_id, hasWarranty }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchCart();
    } catch (error) {
        console.error('Error updating warranty:', error);
    }
};

export const handleRemoveFromCart = async (username, product_id, fetchCart) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/deleteCartItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, product_id }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchCart();
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};


export const handleClearCart = async (username, clearCart) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/clearCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await clearCart();
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
};


export const handleAddToCart = async (username, product, quantity, fetchCart) => {
    if (product) {
        try {
            const response = await fetch('http://127.0.0.1:8000/addCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    product_id: product.product_id,
                    quantity: quantity,
                    haswarranty: false,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const data = await response.json();
            console.log('Product added to cart:', data);
            await fetchCart();
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    }
};