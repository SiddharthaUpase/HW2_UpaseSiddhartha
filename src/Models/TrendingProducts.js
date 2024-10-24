const fetchProducts = async (filter) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/topProducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filter }),
        });

        const data = await response.json();


        if (filter === 'topRated') {
           return data.top_rated_products;
        } else if (filter === 'zipCode') {
            return data.top_zip_codes;
            
        } else if (filter === 'topSelling') {
            return data.top_selling_products;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};
export default fetchProducts;