import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../Controllers/CartContext';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import fetchCategories from '../Models/CategoriesModel';

const NavBar = () => {
    const navigate = useNavigate();
    const { cartProducts } = useContext(CartContext);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchAndSetCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        fetchAndSetCategories();
    }, []);

    useEffect(() => {
        const allProducts = categories.flatMap(category => category.products);
        setProductsList(allProducts);
    }, [categories]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length === 0) {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = productsList
            .filter(product => product.product_name.toLowerCase().includes(query.toLowerCase()))
            .map(product => product.product_name);

        setSuggestions(filteredSuggestions);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setSuggestions([]);
        //iterate through the productsList to find the product that matches the suggestion
        const selectedProduct = productsList.find(product => product.product_name === suggestion);
        //You can use the selectedProduct to navigate to the product page or perform a search
         handleProductClick(selectedProduct.product_id,selectedProduct.category_id);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleLogout = () => {
        setOpen(false);
        localStorage.removeItem('username');
        navigate('/login');
    };
        //This function is for debugging purposes only
        const handleProductClick = async (product_id,category_id) => {
            // Navigate to /product/id
           navigate('/category/'+category_id+'/product/'+product_id);
          };

    return (
        <nav className="navbar">
            <div className="nav-container" style={{ width: '100%' }}>
                <div className="nav-logo" style={{ width: '10%' }}>
                    <Link to="/home" style={{ color: 'white' }}>Smart Site</Link>
                </div>

                <div className="navbar_center" style={{ width: '50%', paddingLeft: 10, paddingRight: 10, alignItems: "center", position: 'relative' }}>
                    <div className="search-bar" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            style={{ width: '90%', marginRight: '5px' }} 
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="search-button" style={{ width: '10%' }}>Search</div>
                    </div>
                    {suggestions.length > 0 && (
                        <div className="autocomplete-suggestions" style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', width: '90%', zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            {suggestions.map((suggestion, index) => (
                                <div 
                                    key={index} 
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }} 
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="trending" style={{ width: '15%', paddingLeft: 10, paddingRight: 10 }}>
                    <Link to="/trending" style={{ color: 'white' }}>TrendingPage</Link>
                </div>

                <div className="view-orders" style={{ width: '15%', paddingLeft: 10, paddingRight: 10 }}>
                    <Link to="/view_orders" style={{ color: 'white' }}>View Orders</Link>
                </div>

                <div className="navbar_right" style={{ width: '20%', paddingLeft: 10, paddingRight: 10 }}>
                    <div className="review-product" style={{ width: '20%', paddingLeft: 10, paddingRight: 10 }}>
                        <Link to="/review_product" style={{ color: 'white' }}>Review Product</Link>
                    </div>

                    <div className="cart-info" style={{ width: '20%', paddingLeft: 10, paddingRight: 10 }}>
                        <Link to="/cart" style={{ color: 'white' }}>Cart: </Link>
                        <span style={{color:'white'}} >{cartProducts.length}</span>
                    </div>

                    <div className="user-info" style={{ width: '20%', paddingLeft: 10, paddingRight: 10 }}>
                        <button onClick={handleClickOpen} style={{ color: 'white' }}>LogOut</button>
                        <Dialog
                            open={open}
                            onClose={() => setOpen(false)}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Are you sure you want to logout?"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    You will be logged out of your account.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <button onClick={() => setOpen(false)} style={{ color: 'black' }}>Cancel</button>
                                <button onClick={handleLogout} style={{ color: 'black' }}>Logout</button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;