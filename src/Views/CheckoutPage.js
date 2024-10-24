import React, {useContext, useState,useRef,useEffect } from 'react';
import { CartContext } from '../Controllers/CartContext';
import { useNavigate } from 'react-router-dom';
import {useUser} from '../Controllers/UserContext';
import { fetchStores } from '../Models/OrdersModel';
import {saveOrder} from '../Models/OrdersModel';


const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        email: '',
        phone: '',
        pickup: '',
        store: '',
        cardname: '',
        cardnumber: '',
        expmonth: '',
        expyear: '',
        cvv: ''
    });
    
    const { username } = useUser();
    const navigate = useNavigate();
    const {clearCart, cartProducts,totalPrice, adjustDeliveryFee } = useContext(CartContext);
    const [error, setError] = useState(null);
    const [confirmation, setConfirmation] = useState(false);
    const [homeDelivery, setHomeDelivery] = useState(false); // State to track home delivery selection
    const [storePickup, setStorePickup] = useState(false); // State to track store pickup selection
    const [originalTotalPrice, setOriginalTotalPrice] = useState(totalPrice); // State to track original total price
    const formRef = useRef(null); // Reference to the form element
    const [stores, setStores] = useState(''); // State to track store selection

    useEffect(() => {
        
        const fetchStoresData = async () => {
            const stores = await fetchStores();
            setStores(stores);
        };
        fetchStoresData();
    }, []);

    useEffect(() =>{
        console.log('Stores:', stores);
    }, [stores]);




    useEffect(() => {
        // Set the original total price when the component mounts
        setOriginalTotalPrice(totalPrice);
      }, [totalPrice]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstname || !formData.lastname || !formData.address || !formData.city || !formData.state || !formData.zip || !formData.email || !formData.phone || !formData.cardname || !formData.cardnumber || !formData.expmonth || !formData.expyear || !formData.cvv
            || (!homeDelivery && !storePickup) || (storePickup && !formData.store) || (homeDelivery && !formData.address)) {
            setError('Please fill in all fields');
            alert('Please fill in all fields');
            return;
        }
        setError(null);
        setConfirmation(true);

        const orderId = 
        Math.floor(1000 + Math.random() * 9000);

        const confirmationId =
        Math.floor(100000 + Math.random() * 900000);

        for(let  i =0; i<cartProducts.length; i++){
            const order = cartProducts[i];


            //calculat total price per product based on the quantity and warranty
            let total = order.product_price * order.quantity;
            if (order.hasWarranty) {
                total += order.product_price * 0.1 * order.quantity;
            }
            console.log('Total Price:', total.toFixed(2));

            clearCart();
        }

        //make an API call to the backend to save the order details
        await saveOrder(username, formData, homeDelivery, storePickup, stores, confirmationId, cartProducts, originalTotalPrice);
        navigate('/confirmation', { state: { orderId:orderId,confirmationId:confirmationId } });

    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        //log the event
        if(e.target.name === 'store'){
            //set the store as the store name
            formData.store = stores[e.target.value-1].store_name;
            console.log('Store:', formData.store);
        }
    };
    
    const handleStorePickup = (e) => {
        const isChecked = e.target.checked;
        setStorePickup(isChecked);
        if (isChecked) {
            if(homeDelivery){
                adjustDeliveryFee(false);
            }
          setHomeDelivery(false);

        }
        console.log('Store Pickup:', isChecked);
      };

      const handleHomeDelivery = (e) => {
        const isChecked = e.target.checked;
        setHomeDelivery(isChecked);
        if (isChecked) {
          setStorePickup(false);
            adjustDeliveryFee(true);
        }
        console.log('Home Delivery:', isChecked);
      };


    return (
        <div className="checkout-container" ref={formRef} >
            <h1>Checkout Page</h1>
            <form onSubmit={handleSubmit} className="checkout-form">
                <label htmlFor="fname">First Name</label>
                <input type="text" id="fname" name="firstname" placeholder="Your name.." value={formData.firstname} onChange={handleChange} />

                <label htmlFor="lname">Last Name</label>
                <input type="text" id="lname" name="lastname" placeholder="Your last name.." value={formData.lastname} onChange={handleChange} />

                <h2>Shipping Address</h2>
                <label htmlFor="adr">House Number</label>
                <input type="text" id="adr" name="address" placeholder="Your house number.." value={formData.address} onChange={handleChange} />

                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" placeholder="Your city.." value={formData.city} onChange={handleChange} />

                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" placeholder="Your state.." value={formData.state} onChange={handleChange} />

                <label htmlFor="zip">Zip Code</label>
                <input type="text" id="zip" name="zip" placeholder="Your zip code.." value={formData.zip} onChange={handleChange} />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Your email.." value={formData.email} onChange={handleChange} />

                <label htmlFor="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" placeholder="Your phone number.." value={formData.phone} onChange={handleChange} />

                <div className="pickup-options">
                    <h2>Pickup Options</h2>
                    <ul>
                        <li>
                            <input type="radio" id="store" name="pickup" className="small-radio" value="store" onChange={handleStorePickup} />
                            <label htmlFor="store">Store Pickup</label>
                        </li>
                        <li>
                            <input type="radio" id="home" name="pickup" className="small-radio" value="home" onChange={handleHomeDelivery} />
                            <label htmlFor="home">Home Delivery (+ $12) </label>
                        </li>
                    </ul>

                    {storePickup && (
                        <div className="store-select">
                            <label htmlFor="store">Store Location</label>
                            <select id="store" name="store" value={formData.store} onChange={handleChange}>
                                
                                {stores.map((store) => (
                                    <option key={store.store_id} value={store.store_id}>
                                        <p>{store.store_name}</p>
                                        <p>{store.store_address}</p>
                                    </option>
                                ))}

                            </select>
                        </div>
                    )}
                </div>

                <div className="payment-section">
                    <h2>Payment</h2>
                    <div className="payment-form">
                        <label htmlFor="cname">Name on Card</label>
                        <input type="text" id="cname" name="cardname" placeholder="John More Doe" value={formData.cardname} onChange={handleChange} />
                        
                        <label htmlFor="ccnum">Credit card number</label>
                        <input type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444" value={formData.cardnumber} onChange={handleChange} />
                        
                        <label htmlFor="expmonth">Exp Month</label>
                        <input type="text" id="expmonth" name="expmonth" placeholder="September" value={formData.expmonth} onChange={handleChange} />
                        
                        <div className="card-details">
                            <div className="card-detail">
                                <label htmlFor="expyear">Exp Year</label>
                                <input type="text" id="expyear" name="expyear" placeholder="2018" value={formData.expyear} onChange={handleChange} />
                            </div>
                            <div className="card-detail">
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv" placeholder="352" value={formData.cvv} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="total-price">
                    <h2>Total Price: ${originalTotalPrice.toFixed(2)}</h2>
                </div>

                <button type="submit">Submit</button>                    
            
            </form>
            
            
        </div>
    );
};

export default CheckoutPage;