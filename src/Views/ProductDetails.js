import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CartContext } from '../Controllers/CartContext';
import { useUser } from '../Controllers/UserContext';
import fetchCategories from '../Models/CategoriesModel';
import { handleAddToCart } from '../Models/CartModel';

const ProductDetail = () => {
  const { username } = useUser();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);  // New state for quantity
  const { fetchCart } = useContext(CartContext);
  const { productId, categoryId } = useParams();
  const [open_confirm, setOpen_confirm] = useState(false);

  useEffect(() => {
   
    const fetchAndSetCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError(error.message);
      }
    };

    fetchAndSetCategories();
    
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      //iterate through categories and check if the category id matches the id in the url
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category.id === parseInt(categoryId)) {
          //iterate through the products in the category and check if the product id matches the id in the url
          for (let j = 0; j < category.products.length; j++) {
            const product = category.products[j];
            
            const product_id = product.product_id.toString();
            if (product_id === productId) {
              console.log('Product found:', product);
              //proint the image
              console.log(product.product_image);
              setMainImage(product.product_image);
              setProduct(product);
              setLoading(false);
              return;
            }
          }
        }
      }

      
    }
  }, [categories, categoryId, productId]);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMouseEnter = (image) => {
    setMainImage(image);
  };


  const handleQuantityChange = (change) => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity + change));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <NavBar />
      <div className="product-detail-content">
        {product.product_image && (
          <div className='product_img_list'>
            <img src={product.product_image} alt={product.product_name} style={{ width: '50px', height: '50px' }} onLoad={() => console.log('Image loaded successfully')} onError={() => console.error('Error loading image')} />
          </div>
        )}
        <div className='product_img'>
          {mainImage ? (
            <img src={mainImage} alt={product.product_name} style={{
              width: '300px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }} onLoad={() => console.log('Main image loaded successfully')} onError={() => console.error('Error loading main image')} />
          ) : (
            <div>No image available</div>
          )}
        </div>
        <div className='product_content'>
          <h1>{product.product_name}</h1>
          <p>{product.product_description}</p>
          <p>Price: ${product.product_price.toFixed(2)}</p>
          
          <div className="quantity-control">
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <span style={{ margin: '0 10px' }}></span>
            <span>{quantity}</span>
            <span style={{ margin: '0 10px' }}></span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
          <p style={{flexDirection: 'row', justifyContent: 'start',}}>
            <button className='addToCart' onClick={()=>{
              handleAddToCart(username, product, quantity, fetchCart);
              setOpen_confirm(true);
            }}>Add to Cart</button>
            <Dialog open={open_confirm} onClose={() => setOpen_confirm(false)}>
              <DialogTitle>Product Added</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {product.product_name} has been added to your cart with a quantity of {quantity}.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen_confirm(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;