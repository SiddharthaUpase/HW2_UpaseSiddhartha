const fetchCategories = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/categories');
        
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Received non-JSON response");
        }

        const categories = await response.json();

        return categories;
        
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export default fetchCategories;

