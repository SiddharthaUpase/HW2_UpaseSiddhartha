import React, { useState, useEffect } from 'react';
import '../styles/trending.css'; // Import the CSS file
import NavBar from './NavBar';
import fetchProducts from '../Models/TrendingProducts';
const TrendingPage = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('topSelling');

    useEffect(() => {

        const fetchAndSetProducts = async () => {
            try {
                const products = await fetchProducts(filter);
                setProducts(products);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };

        fetchAndSetProducts();



    }, [filter]);



    return (
        <div className="trending-page">
            <NavBar />
            <h1 className="trending-title">Top Products</h1>
            <div className="filter-section">
                <label className="filter-option">
                    <input
                        type="radio"
                        value="topSelling"
                        checked={filter === 'topSelling'}
                        onChange={() => setFilter('topSelling')}
                    />
                    Top Selling
                </label>
                <label className="filter-option">
                    <input
                        type="radio"
                        value="topRated"
                        checked={filter === 'topRated'}
                        onChange={() => setFilter('topRated')}
                    />
                    Top Rated
                </label>
                <label className="filter-option">
                    <input
                        type="radio"
                        value="zipCode"
                        checked={filter === 'zipCode'}
                        onChange={() => setFilter('zipCode')}
                    />
                    By Zip Code
                </label>
            </div>
            <ul className="product-list">
                {products.map((product, index) => (
                    <li key={index} className="product-item">
                        {filter === 'zipCode' ? 
                        
                        <span>Zip Code: {product.zip_code} || Total Sales: {product.total_sold}</span>

                        : product.product_model_name}
                        {
                            filter === 'topRated' && (
                                <span> || Average Review: {product.average_rating}</span>
                            )
                        }
                        {
                            filter === 'topSelling' && (
                                <span> || Total Sales: {product.total_sold}</span>
                            )
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrendingPage;
