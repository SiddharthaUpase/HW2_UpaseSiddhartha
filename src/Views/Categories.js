import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchCategories from '../Models/CategoriesModel';


const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchAndSetCategories = async () => {
            try {
                const categories = await fetchCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        fetchAndSetCategories();
    }, []);

    const navigate = useNavigate();

    //This function is for debugging purposes only
    const handleProductClick = async (product,category) => {
      // Navigate to /product/id
     navigate('/category/'+category.id+'/product/'+product.product_id);
    };

    return (
        <div className="categories">
            <ul className="categoryUl">
                {categories.map(category => (
                    <li key={category.id} className="category_li">
                        <span style={{ fontWeight: 'bold',color: "black", fontSize:20 }}>{category.name}</span>
                        <div className="product-list">
                            <ul>
                                {category.products.map(product => (
                                    <li key={product.id} className="product" onClick={() => handleProductClick(product,category) } >
                                        <span style={{fontSize:12}} >{product.product_name}</span>
                                        <img src={product.product_image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;

