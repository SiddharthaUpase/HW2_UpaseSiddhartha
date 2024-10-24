import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReviewProduct.css';
import NavBar from './NavBar';
import { fetchProducts } from '../Models/ProductsModel';
import { fetchStores } from '../Models/ProductsModel';
import { addReview } from '../Models/ReviewModel';


const ReviewProduct = () => {

    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [formData, setFormData] = useState({
        productModelName: '',
        productCategory: '',
        productPrice: '',
        storeID: '',
        storeZip: '',
        storeCity: '',
        storeState: '',
        productOnSale: '',
        manufacturerName: '',
        manufacturerRebate: '',
        userAge: '',
        userGender: '',
        userOccupation: '',
        reviewRating: '',
        reviewText: '',
        username: localStorage.getItem('username')
    });

    const navigate = useNavigate();


    useEffect(() => {
        const fetchProductsData = async () => {
            await fetchProducts(setProducts);
        };

        const fetchStoresData = async () => {
            await fetchStores(setStores);
        };

        fetchProductsData();
        fetchStoresData();
    }, []);

    useEffect(() => {
        //set the initial product category and price and store id
        if (products.length > 0) {
            const selectedProduct = products[0];
            setFormData({
                ...formData,
                productModelName: selectedProduct.product_name,
                productCategory: selectedProduct.category_name,
                productPrice: selectedProduct.product_price
            });
        }

        if (stores.length > 0) {
            const selectedStore = stores[0];
            setFormData({
                ...formData,
                storeID: selectedStore.store_name,
                storeZip: selectedStore.store_zip,
                storeCity: selectedStore.store_city,
                storeState: selectedStore.store_state
            });
        }
    }, [products, stores]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if(name === 'productModelName') {
            const selectedProduct = products.find(product => product.product_name === value);
            setFormData({
                ...formData,
                productModelName: selectedProduct.product_name,
                productCategory: selectedProduct.category_name,
                productPrice: selectedProduct.product_price,
            });
        }

        if(name === 'storeID') {

            const selectedStore = stores.find(store => store.store_name === value);
            setFormData({
                ...formData,
                storeID: selectedStore.store_name,
                storeZip: selectedStore.store_zip,
                storeCity: selectedStore.store_city,
                storeState: selectedStore.store_state
            });

            console.log(selectedStore);
        }
    };

    //async post request to add review
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        //check if all fields are filled
        for (const key in formData) {
            if (formData[key] === '') {
                alert('Please fill in'+key);
                //print the key that is empty
                console.log(key);
                return;
            }
        }

        await addReview(formData, setFormData, navigate);
    };

    return (
        <div>
            <NavBar />
            <nav className="productbar" style={{backgroundColor:'gray'}}>
                <h1>Product Review</h1>
            </nav>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>
                        Product Model Name:
                        <select name="productModelName" value={formData.productModelName} onChange={handleChange}>
                            {products.map(product => (
                                <option key={product.product_id} value={product.product_name}>{product.product_name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Product Category:
                        <input type="text" name="productCategory" value={formData.productCategory} onChange={handleChange} />
                    </label>
                    <label>
                        Product Price:
                        <input type="text" name="productPrice" value={formData.productPrice} onChange={handleChange} />
                    </label>
                    <label>
                        Store ID:
                        <select name="storeID" value={formData.storeID} onChange={handleChange}>
                            {stores.map(store => (
                                <option key={store.store_id} value={store.store_name}>{store.store_name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Store Zip:
                        <input type="text" name="storeZip" value={formData.storeZip} onChange={handleChange} />
                    </label>
                    <label>
                        Store City:
                        <input type="text" name="storeCity" value={formData.storeCity} onChange={handleChange} />
                    </label>
                    <label>
                        Store State:
                        <input type="text" name="storeState" value={formData.storeState} onChange={handleChange} />
                    </label>
                    <label>
                        Product On Sale:
                        <input type="text" name="productOnSale" value={formData.productOnSale} onChange={handleChange} />
                    </label>
                    <label>
                        Manufacturer Name:
                        <input type="text" name="manufacturerName" value={formData.manufacturerName} onChange={handleChange} />
                    </label>
                    <label>
                        Manufacturer Rebate:
                        <input type="text" name="manufacturerRebate" value={formData.manufacturerRebate} onChange={handleChange} />
                    </label>
                    
                    <label>
                        User Age:
                        <input type="text" name="userAge" value={formData.userAge} onChange={handleChange} />
                    </label>
                    <label>
                        User Gender:
                        <input type="text" name="userGender" value={formData.userGender} onChange={handleChange} />
                    </label>
                    <label>
                        User Occupation:
                        <input type="text" name="userOccupation" value={formData.userOccupation} onChange={handleChange} />
                    </label>
                    <label>
                        Review Rating:
                        <input type="text" name="reviewRating" value={formData.reviewRating} onChange={handleChange} />
                    </label>
                                        <label>
                        Review Rating:
                        <div className="star-rating">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="reviewRating"
                                            value={ratingValue}
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <span
                                            className={`star ${ratingValue <= formData.reviewRating ? 'filled' : ''}`}
                                            onClick={() => setFormData({ ...formData, reviewRating: ratingValue })}
                                        >
                                            &#9733;
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </label>
                    <label>
                        Review Text:
                        <textarea name="reviewText" value={formData.reviewText} onChange={handleChange}></textarea>
                    </label>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

export default ReviewProduct;