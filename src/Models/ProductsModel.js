export const fetchProducts = async (setProducts) => {
    try {
        const productsResponse = await fetch('http://127.0.0.1:8000/getProducts');
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

export const fetchStores = async (setStores) => {
    try {
        const storesResponse = await fetch('http://127.0.0.1:8000/getStores');
        const storesData = await storesResponse.json();
        setStores(storesData.stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
};