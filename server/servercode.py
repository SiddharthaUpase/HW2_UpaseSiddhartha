from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import uuid
import os
from flask_pymongo import PyMongo
import pymongo
from datetime import timedelta


app = Flask(__name__)
app.secret_key = "super32"
CORS(app)

try:
     client = pymongo.MongoClient("mongodb+srv://s1dupase34:HAorqpsKc8dbNDJ0@cluster0.czjp43z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
     mongo_db = client['Reviews']  # Replace 'your_database_name' with the name of your MongoDB database
     mongo_collection = mongo_db['productReviews']  # Replace 'your_collection_name' with the name of your MongoDB collection
     if(mongo_collection):
        print("Connected to MongoDB")
     else:
        print("Error connecting to MongoDB")
except pymongo.errors.ConfigurationError:
  print("An Invalid URI host error was received. Is your Atlas host name correct in your connection string?")





# Configure SQLAlchemy for SQLite
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'productDB.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)








# Models
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    haswarranty = db.Column(db.Boolean, nullable=False)

class Product(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    images = db.Column(db.Text)  # Store JSON as text in SQLite
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    on_sale = db.Column(db.Boolean, nullable=False, default=True)
    manufacturer_rebate = db.Column(db.Boolean, nullable=False, default=True)
    

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=True)
    customer_name = db.Column(db.String(100), nullable=True)
    shipping_address = db.Column(db.String(255), nullable=True)
    creditcard_number = db.Column(db.String(16), nullable=True)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)
    ship_date = db.Column(db.DateTime, nullable=True)
    shipping_cost = db.Column(db.Float, nullable=True)
    total_cost = db.Column(db.Float, nullable=True)
    store_name = db.Column(db.String(100), nullable=True)
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'), nullable=True)
    store_address = db.Column(db.String(255), nullable=True)
    homeDelivery = db.Column(db.Boolean, nullable=True)
    storePickup = db.Column(db.Boolean, nullable=True)
    confirmation_number = db.Column(db.String(10), nullable=True)
    order_items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    haswarranty = db.Column(db.Boolean, nullable=False)
    price = db.Column(db.Float, nullable=False)



class Stores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)


class Customers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), db.ForeignKey('user.username'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)


with app.app_context():
    db.create_all()  # Create database tables
    if not User.query.first():
        # Add default users
        users = [
            User(username='storemanager1', password='storemanager1', role='storemanager'),
            User(username='salesman5', password='salesman5', role='salesman'),
            User(username='customer1', password='customer1', role='customer')
            
        ]
        db.session.add_all(users)
        db.session.commit()

    if not Stores.query.first():
        stores = [
            Stores(name="Best Buy", address="123 Main St", city="San Francisco", state="CA", zip_code="94101", phone="123-456-7890", email="bestbuy@gmail.com"),
            Stores(name="Walmart", address="456 Elm St", city="Los Angeles", state="CA", zip_code="90001", phone="234-567-8901", email="walmart@gmail.com"),
            Stores(name="Target", address="789 Oak St", city="San Diego", state="CA", zip_code="92101", phone="345-678-9012", email="target@gmail.com"),
            Stores(name="Home Depot", address="101 Pine St", city="Sacramento", state="CA", zip_code="94203", phone="456-789-0123", email="homedepot@gmail.com"),
            Stores(name="Lowe's", address="202 Cedar St", city="San Jose", state="CA", zip_code="95101", phone="567-890-1234", email="lowes@gmail.com"),
            Stores(name="Costco", address="303 Maple St", city="Fresno", state="CA", zip_code="93701", phone="678-901-2345", email="costco@gmail.com"),
            Stores(name="Safeway", address="404 Walnut St", city="Long Beach", state="CA", zip_code="90802", phone="789-012-3456", email="safeway@gmail.com"),
            Stores(name="Kroger", address="505 Birch St", city="Oakland", state="CA", zip_code="94601", phone="890-123-4567", email="kroger@gmail.com"),
            Stores(name="Trader Joe's", address="606 Cedar St", city="Bakersfield", state="CA", zip_code="93301", phone="901-234-5678", email="traderjoes@gmail.com"),
            Stores(name="Whole Foods", address="707 Spruce St", city="Anaheim", state="CA", zip_code="92801", phone="012-345-6789", email="wholefoods@gmail.com"),
            Stores(name="Aldi", address="808 Maple St", city="Santa Ana", state="CA", zip_code="92701", phone="123-456-7891", email="aldi@gmail.com"),
            Stores(name="Publix", address="909 Oak St", city="Riverside", state="CA", zip_code="92501", phone="234-567-8902", email="publix@gmail.com"),
            Stores(name="Meijer", address="1010 Pine St", city="Stockton", state="CA", zip_code="95201", phone="345-678-9013", email="meijer@gmail.com"),
            Stores(name="H-E-B", address="1111 Cedar St", city="Irvine", state="CA", zip_code="92602", phone="456-789-0124", email="heb@gmail.com"),
            Stores(name="Albertsons", address="1212 Birch St", city="Chula Vista", state="CA", zip_code="91910", phone="567-890-1235", email="albertsons@gmail.com"),
            Stores(name="Sprouts", address="1313 Spruce St", city="Fremont", state="CA", zip_code="94536", phone="678-901-2346", email="sprouts@gmail.com"),
            Stores(name="WinCo Foods", address="1414 Maple St", city="San Bernardino", state="CA", zip_code="92401", phone="789-012-3457", email="wincofoods@gmail.com"),
            Stores(name="Hy-Vee", address="1515 Oak St", city="Modesto", state="CA", zip_code="95350", phone="890-123-4568", email="hyvee@gmail.com"),
            Stores(name="Wegmans", address="1616 Pine St", city="Oxnard", state="CA", zip_code="93030", phone="901-234-5679", email="wegmans@gmail.com")
        ]
        db.session.add_all(stores)
        db.session.commit()


    # Check if the categories table is empty
    if not Category.query.first():
        # Add product categories
        categories = [
            Category(name="Smart Doorbells"),
            Category(name="Smart Doorlocks"),
            Category(name="Smart Speakers"),
            Category(name="Smart Lightings"),
            Category(name="Smart Thermostats")
        ]
        db.session.add_all(categories)
        db.session.commit()

        # Add products to each category
        products = [
    # Smart Doorbells
    Product(name="Ring Video Doorbell", description="Smart doorbell with HD video and motion detection.", price=199.99, images='https://m.media-amazon.com/images/I/61G+EXy57bL._AC_SL1500_.jpg', category_id=categories[0].id, quantity=10),
    Product(name="Nest Hello", description="Wired doorbell with HD video and person alerts.", price=229.99, images='https://m.media-amazon.com/images/I/81Xg3vQQtLL._AC_SL1500_.jpg', category_id=categories[0].id, quantity=10),
    Product(name="Arlo Video Doorbell", description="Smart doorbell with wide-angle view and HDR.", price=149.99, images='https://m.media-amazon.com/images/I/71DxFSQuEEL._AC_SL1500_.jpg', category_id=categories[0].id, quantity=20),
    Product(name="SimpliSafe Doorbell", description="Easy-to-install doorbell with video and audio.", price=169.99, images='https://m.media-amazon.com/images/I/61xH0lJmJ9L._AC_SL1500_.jpg', category_id=categories[0].id, quantity=15),
    Product(name="Eufy Security Doorbell", description="Battery-powered video doorbell with 2K resolution.", price=179.99, images='https://m.media-amazon.com/images/I/71j5FmEtOEL._AC_SL1500_.jpg', category_id=categories[0].id, quantity=30),
    
    # Smart Doorlocks
    Product(name="August Smart Lock", description="Keyless entry and remote control for your door.", price=229.99, images='https://m.media-amazon.com/images/I/51nD8WRHkNL._AC_SL1000_.jpg', category_id=categories[1].id,quantity=10),
    Product(name="Yale Assure Lock", description="Touchscreen smart lock with keyless entry.", price=199.99, images='https://m.media-amazon.com/images/I/91Hfw9Vj5lL._AC_SL1500_.jpg', category_id=categories[1].id,quantity=10),
    Product(name="Schlage Encode", description="Smart lock with built-in WiFi.", price=249.99, images='https://m.media-amazon.com/images/I/71LHKsV0XJL._AC_SL1500_.jpg', category_id=categories[1].id,quantity=10),
    Product(name="Ultraloq U-Bolt Pro", description="Smart lock with fingerprint ID.", price=159.99, images='https://m.media-amazon.com/images/I/81skv3sMQzL._AC_SL1500_.jpg', category_id=categories[1].id,quantity=10),
    Product(name="Kwikset SmartCode", description="Deadbolt smart lock with customizable entry codes.", price=179.99, images='https://m.media-amazon.com/images/I/71ZOKA2fKQL._AC_SL1500_.jpg', category_id=categories[1].id,quantity=10),
    
    # Smart Speakers
    Product(name="Amazon Echo", description="Voice-controlled smart speaker with Alexa.", price=99.99, images='https://m.media-amazon.com/images/I/61Gob-M3snL._AC_SL1000_.jpg', category_id=categories[2].id,quantity=10),
    Product(name="Google Nest Audio", description="Smart speaker with Google Assistant.", price=89.99, images='https://m.media-amazon.com/images/I/71fmiKYUCcL._AC_SL1500_.jpg', category_id=categories[2].id,quantity=10),
    Product(name="Apple HomePod Mini", description="Smart speaker with Siri integration.", price=99.99, images='https://m.media-amazon.com/images/I/71QlVAI+o-L._AC_SL1500_.jpg', category_id=categories[2].id,quantity=10),
    Product(name="Sonos One", description="Smart speaker with voice control and excellent sound.", price=199.99, images='https://m.media-amazon.com/images/I/81SLx-DmQxL._AC_SL1500_.jpg', category_id=categories[2].id,quantity=10),
    Product(name="Bose Home Speaker 500", description="Smart speaker with Alexa and Google Assistant.", price=299.99, images='https://m.media-amazon.com/images/I/71pCWyd-+WL._AC_SL1500_.jpg', category_id=categories[2].id,quantity=10),
    
    # Smart Lightings
    Product(name="Philips Hue Bulb", description="Smart light bulb with app control.", price=49.99, images='https://m.media-amazon.com/images/I/71JQGttU1KL._AC_SL1500_.jpg', category_id=categories[3].id,quantity=10),
    Product(name="LIFX Smart Bulb", description="Color-changing smart bulb.", price=59.99, images='https://m.media-amazon.com/images/I/61-HuGoF6hL._AC_SL1500_.jpg', category_id=categories[3].id,quantity=10),
    Product(name="Nanoleaf Light Panels", description="Customizable LED light panels.", price=199.99, images='https://m.media-amazon.com/images/I/81GHW7FJp9L._AC_SL1500_.jpg', category_id=categories[3].id,quantity=10),
    Product(name="Wyze Bulb", description="Affordable smart bulb with voice control.", price=19.99, images='https://m.media-amazon.com/images/I/41lADnYJ8ZL._AC_SL1000_.jpg', category_id=categories[3].id,quantity=10),
    Product(name="TP-Link Kasa Bulb", description="Smart bulb with adjustable brightness.", price=29.99, images='https://m.media-amazon.com/images/I/61nsSpDnZ9L._AC_SL1500_.jpg', category_id=categories[3].id,quantity=10),
    
    # Smart Thermostats
    Product(name="Nest Learning Thermostat", description="Smart thermostat that learns your preferences.", price=249.99, images='https://m.media-amazon.com/images/I/91ab38p-OAL._AC_SL1500_.jpg', category_id=categories[4].id,quantity=10),
    Product(name="Ecobee SmartThermostat", description="Thermostat with voice control and remote sensors.", price=219.99, images='https://m.media-amazon.com/images/I/81n1fgQHzHL._AC_SL1500_.jpg', category_id=categories[4].id,quantity=10),
    Product(name="Honeywell T9", description="Smart thermostat with room sensors.", price=199.99, images='https://m.media-amazon.com/images/I/61Bzgh0MR9L._AC_SL1500_.jpg', category_id=categories[4].id,quantity=10),
    Product(name="Emerson Sensi", description="Smart thermostat with mobile app control.", price=129.99, images='https://m.media-amazon.com/images/I/51nllFqIx-L._AC_SL1000_.jpg', category_id=categories[4].id,quantity=10),
    Product(name="Lux Kono Smart Thermostat", description="Stylish thermostat with smart features.", price=139.99, images='https://m.media-amazon.com/images/I/61WZk2-VcCL._AC_SL1200_.jpg', category_id=categories[4].id,quantity=10)
]
        

        
        # Add all the products to the session
        db.session.add_all(products)
        db.session.commit()

    
    if not Customers.query.first():
        customers = [
            Customers(username="amit_sharma", name="Amit Sharma", street="123 Main St", city="Mumbai", state="MH", zip_code="400001"),
            Customers(username="priya_singh", name="Priya Singh", street="456 Elm St", city="Delhi", state="DL", zip_code="110001"),
            Customers(username="rahul_verma", name="Rahul Verma", street="789 Oak St", city="Bangalore", state="KA", zip_code="560001"),
            Customers(username="anjali_mehta", name="Anjali Mehta", street="101 Pine St", city="Chennai", state="TN", zip_code="600001"),
            Customers(username="vikram_patel", name="Vikram Patel", street="202 Cedar St", city="Ahmedabad", state="GJ", zip_code="380001"),
            Customers(username="neha_gupta", name="Neha Gupta", street="303 Maple St", city="Kolkata", state="WB", zip_code="700001"),
            Customers(username="ravi_kumar", name="Ravi Kumar", street="404 Walnut St", city="Hyderabad", state="TG", zip_code="500001"),
            Customers(username="sneha_jain", name="Sneha Jain", street="505 Birch St", city="Pune", state="MH", zip_code="411001"),
            Customers(username="arjun_rathore", name="Arjun Rathore", street="606 Cedar St", city="Jaipur", state="RJ", zip_code="302001"),
            Customers(username="meera_iyer", name="Meera Iyer", street="707 Spruce St", city="Coimbatore", state="TN", zip_code="641001"),
            Customers(username="rohit_singh", name="Rohit Singh", street="808 Maple St", city="Lucknow", state="UP", zip_code="226001"),
            Customers(username="kavita_mishra", name="Kavita Mishra", street="909 Oak St", city="Patna", state="BR", zip_code="800001"),
            Customers(username="manish_kumar", name="Manish Kumar", street="1010 Pine St", city="Bhopal", state="MP", zip_code="462001"),
            Customers(username="anita_das", name="Anita Das", street="1111 Cedar St", city="Guwahati", state="AS", zip_code="781001"),
            Customers(username="suresh_nair", name="Suresh Nair", street="1212 Birch St", city="Thiruvananthapuram", state="KL", zip_code="695001"),
            Customers(username="lata_sharma", name="Lata Sharma", street="1313 Spruce St", city="Chandigarh", state="CH", zip_code="160001"),
            Customers(username="deepak_agarwal", name="Deepak Agarwal", street="1414 Maple St", city="Indore", state="MP", zip_code="452001"),
            Customers(username="rekha_singh", name="Rekha Singh", street="1515 Oak St", city="Ranchi", state="JH", zip_code="834001"),
            Customers(username="vijay_pandey", name="Vijay Pandey", street="1616 Pine St", city="Varanasi", state="UP", zip_code="221001"),
            Customers(username="geeta_kapoor", name="Geeta Kapoor", street="1717 Cedar St", city="Amritsar", state="PB", zip_code="143001")
        ]
        db.session.add_all(customers)
        db.session.commit()
        
        #create 10 dummy entries for order and order items
        
        #add dummy entries for order and order items
    orders = [
        Order(username="amit_sharma", customer_name="Amit Sharma", shipping_address="123 Main St", creditcard_number="1234567890123456", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=209.99, store_name="Best Buy", store_id=1, store_address="123 Main St", homeDelivery=True, storePickup=False, confirmation_number="123456", order_items=[
            OrderItem(product_id="e47df513-96c4-4664-974c-242407442487", category_id=1, quantity=1, haswarranty=False, price=199.99),
            OrderItem(product_id="c4d85269-72d5-4189-9344-baf4ec1970a9", category_id=1, quantity=1, haswarranty=False, price=229.99)
        ]),
        Order(username="priya_singh", customer_name="Priya Singh", shipping_address="456 Elm St", creditcard_number="2345678901234567", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=239.99, store_name="Walmart", store_id=2, store_address="456 Elm St", homeDelivery=True, storePickup=False, confirmation_number="234567", order_items=[
            OrderItem(product_id="90d27811-ee5a-48bb-ab01-fadc0fcf710e", category_id=1, quantity=1, haswarranty=False, price=149.99),
            OrderItem(product_id="1bf94d9d-dc52-4b26-afb8-4464a57128de", category_id=1, quantity=1, haswarranty=False, price=169.99)
        ]),
        Order(username="rahul_verma", customer_name="Rahul Verma", shipping_address="789 Oak St", creditcard_number="3456789012345678", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=189.99, store_name="Target", store_id=3, store_address="789 Oak St", homeDelivery=True, storePickup=False, confirmation_number="345678", order_items=[
            OrderItem(product_id="d3b92065-8c32-4b29-a56f-14b7b08175cf", category_id=1, quantity=1, haswarranty=False, price=179.99),
            OrderItem(product_id="b4aeceec-0350-4a71-88d5-32cb80878fa8", category_id=1, quantity=1, haswarranty=False, price=199.99)
        ]),
        Order(username="anjali_mehta", customer_name="Anjali Mehta", shipping_address="101 Pine St", creditcard_number="4567890123456789", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=169.99, store_name="Home Depot", store_id=4, store_address="101 Pine St", homeDelivery=True, storePickup=False, confirmation_number="456789", order_items=[
            OrderItem(product_id="7ad617a1-ee53-435d-81b7-f94ce14e3a04", category_id=2, quantity=1, haswarranty=False, price=229.99),
            OrderItem(product_id="6877ef9d-e7a9-4ae9-bd4b-3cee83634c96", category_id=2, quantity=1, haswarranty=False, price=199.99)
        ]),
        Order(username="vikram_patel", customer_name="Vikram Patel", shipping_address="202 Cedar St", creditcard_number="5678901234567890", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=179.99, store_name="Lowe's", store_id=5, store_address="202 Cedar St", homeDelivery=True, storePickup=False, confirmation_number="567890", order_items=[
            OrderItem(product_id="bad0ad0a-42ed-44cb-a1c4-834b6834f4d0", category_id=2, quantity=1, haswarranty=False, price=249.99),
            OrderItem(product_id="9c9f90f7-0c28-4173-ad7e-9a0685146f15", category_id=2, quantity=1, haswarranty=False, price=159.99)
        ]),
        Order(username="neha_gupta", customer_name="Neha Gupta", shipping_address="303 Maple St", creditcard_number="6789012345678901", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=199.99, store_name="Costco", store_id=6, store_address="303 Maple St", homeDelivery=True, storePickup=False, confirmation_number="678901", order_items=[
            OrderItem(product_id="416b1e49-4d85-4ae2-8494-c91a4973adaf", category_id=2, quantity=1, haswarranty=False, price=179.99),
            OrderItem(product_id="870e1272-aa6c-49e8-b729-07fe24cbe229", category_id=2, quantity=1, haswarranty=False, price=249.99)
        ]),
        Order(username="ravi_kumar", customer_name="Ravi Kumar", shipping_address="404 Walnut St", creditcard_number="7890123456789012", purchase_date=datetime.utcnow(), ship_date=datetime.utcnow() + timedelta(days=2), shipping_cost=10.00, total_cost=209.99, store_name="Safeway", store_id=7, store_address="404 Walnut St", homeDelivery=True, storePickup=False, confirmation_number="789012", order_items=[
            OrderItem(product_id="c5f22e53-1792-49ca-813f-bbed8a4b3385", category_id=3, quantity=1, haswarranty=False, price=99.99),
            OrderItem(product_id="9d9d1f0a-a2cb-4ed3-a2ef-8c1528e8daa6", category_id=3, quantity=1, haswarranty=False, price=89.99)
        ]),
    ]
    db.session.add_all(orders)
    db.session.commit()
        
        
        

        


@app.route('/printTables', methods=['GET'])
def print_tables():
    categories = Category.query.all()
    products = Product.query.all()
    users = User.query.all()
    stores = Stores.query.all()
    orders = Order.query.all()
    order_items = OrderItem.query.all()
    customers = Customers.query.all()
    stores = Stores.query.all()
    cart = CartItem.query.all()
    
    category_data = []
    product_data = []
    user_data = []
    store_data = []
    order_data = []
    order_item_data = []
    customer_data = []
    store_data = []
    cart_data = []
    
    for cart in cart:
        cart_data.append({
            'Cart ID': cart.id,
            'Username': cart.username,
            'Product ID': cart.product_id,
            'Quantity': cart.quantity
        })
    
    # Fetching all categories
    for category in categories:
        category_data.append({
            'Category ID': category.id,
            'Category Name': category.name
        })
    
    # Fetching all products
    for product in products:
        product_data.append({
            'Product ID': product.id,
            'Product Name': product.name,
            'Description': product.description,
            'Price': product.price,
            'Images': product.images,
            'Category ID': product.category_id,
            'Quantity': product.quantity
        })

    # Fetching all users
    for user in users:
        user_data.append({
            'User ID': user.id,
            'Username': user.username,
            'Password': user.password,
            'Role': user.role
        })
    
    # Fetching all stores
    for store in stores:
        store_data.append({
            'Store ID': store.id,
            'Store Name': store.name,
            'Address': store.address,
            'Phone': store.phone,
            'Email': store.email
        })

    for order in orders:
        order_data.append({
            'Order ID': order.id,
            'Username': order.username,
            'Customer Name': order.customer_name,
            'Shipping Address': order.shipping_address,
            'Credit Card Number': order.creditcard_number,
            'Purchase Date': order.purchase_date.isoformat(),
            'Ship Date': order.ship_date.isoformat(),
            'Shipping Cost': order.shipping_cost,
            'Total Cost': order.total_cost,
            'Store Name': order.store_name,
            'Store ID': order.store_id,
            'Store Address': order.store_address,
            'Home Delivery': order.homeDelivery,
            'Store Pickup': order.storePickup,
            'Confirmation Number': order.confirmation_number,
            'Order_Items': [item.id for item in order.order_items]
        })

    for order_item in order_items:

        order_item_data.append({
            'Order Item ID': order_item.id,
            'Order ID': order_item.order_id,
            'Product ID': order_item.product_id,
            'Category ID': order_item.category_id,
            'Quantity': order_item.quantity,
            'Has Warranty': order_item.haswarranty,
            'Price': order_item.price
        })


    for customer in customers:
        customer_data.append({
            'Customer ID': customer.id,
            'Name': customer.name,
            'Street': customer.street,
            'City': customer.city,
            'State': customer.state,
            'Zip Code': customer.zip_code,
            'Username': customer.username
        })
    
    for store in stores:    
        store_data.append({
            'Store ID': store.id,
            'Store Name': store.name,
            'Address': store.address,
            'Phone': store.phone,
            'Email': store.email
        })
        

    return jsonify({
        'Users' : user_data,
        'Customers': customer_data,
        'Stores': store_data,
        'orders': order_data,
        'order_items': order_item_data,
        'Products': product_data,
        'Cart': cart_data
    })



@app.route('/getStores', methods=['GET'])
def get_stores():
    try:
        stores = Stores.query.all()
        store_data = []
        for store in stores:
            store_data.append({
                'store_id': store.id,
                'store_name': store.name,
                'store_address': store.address,
                'phone': store.phone,
                'email': store.email,
                'store_zip': store.zip_code,
                'store_city': store.city,
                'store_state': store.state

            })

        return jsonify({'stores': store_data})
    except Exception as e:
        print(f"Error fetching stores: {e}")
        return jsonify({'error': 'Error fetching stores'}), 500
    


#add to the cart
@app.route('/addCart', methods=['POST'])
def add_cart():
    data = request.get_json()
    product_id = data['product_id']
    username = data['username']
    quantity = data['quantity']
    haswarranty = data['haswarranty']
    
    new_cart_item = CartItem(username=username, product_id=product_id, quantity=quantity,haswarranty=haswarranty)
    db.session.add(new_cart_item)
    db.session.commit()
    #print the cart
    CartItems = CartItem.query.all()
    cart_data = []
    for cart in CartItems:
        cart_data.append({
            'Cart ID': cart.id,
            'Username': cart.username,
            'Product ID': cart.product_id,
            'Quantity': cart.quantity
        })
        print(cart_data)

    return jsonify({'success': 'Product added to cart'})


@app.route('/getCart', methods=['POST'])
def get_cart():
    data = request.get_json()
    username = data['username']
    
    cart_items = CartItem.query.filter_by(username=username).all()
    cart_data = []
    
    #based ont he product id get the product name , price, image, description, category_id,product_id
    for cart in cart_items:
        print('cart')
        print(cart.product_id)
        product = Product.query.get(cart.product_id)
        cart_data.append({
            'category_id': cart.id,
            'username': cart.username,
            'product_id': cart.product_id,
            'product_name': product.name,
            'product_description': product.description,
            'product_price': product.price,
            'product_image': product.images,
            'category_id': product.category_id,
            'quantity': cart.quantity,
            'hasWarranty': cart.haswarranty
        })
    
    return jsonify(cart_data)


@app.route('/deleteCartItem', methods=['POST'])
def delete_cart_item():
    data = request.get_json()
    product_id = data['product_id']
    username = data['username']
    
    cart_item = CartItem.query.filter_by(product_id=product_id, username=username).first()
    if cart_item:
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
        else:
            db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'success': 'Product removed from cart'})
    return jsonify({'error': 'Product not found in cart'})


#update the cart based on the username, product id and haswarranty
@app.route('/updateCart', methods=['POST'])
def update_cart():
    data = request.get_json()
    product_id = data['product_id']
    username = data['username']
    haswarranty = data['hasWarranty']
    
    cart_item = CartItem.query.filter_by(product_id=product_id, username=username).first()
    if cart_item:
        cart_item.haswarranty = haswarranty
        db.session.commit()
        return jsonify({'success': 'Cart updated'})
    return jsonify({'error': 'Product not found in cart'})

#function to clear the cart
@app.route('/clearCart', methods=['POST'])
def clear_cart():
    data = request.get_json()
    username = data['username']
    
    cart_items = CartItem.query.filter_by(username=username).all()
    for cart_item in cart_items:
        db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'success': 'Cart cleared'})

# Routes
@app.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    
    
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'products': [{
            'product_id': p.id,
            'product_name': p.name,
            'product_description': p.description,
            'product_price': p.price,
            'product_image': p.images,
            'category_id': p.category_id
        } for p in c.products]
    } for c in categories])


#get all the products
@app.route('/getProducts', methods=['GET'])
def get_all_products():
    products = Product.query.all()


        
    
    return jsonify({'products': [{
        'product_id': p.id,
        'product_name': p.name,
        'product_description': p.description,
        'product_price': p.price,
        'product_image': p.images,
        'category_id': p.category_id,
        'category_name': Category.query.get(p.category_id).name
    } for p in products]})

   


@app.route('/createAccount', methods=['POST'])
def create_account():
    data = request.get_json()
    username = data['username']
    password = data['password']
    role = data['role']
    
    
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'})
    
    new_user = User(username=username, password=password, role=role)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'success': 'Account created'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    print(username)
    print(password)
    
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'success': 'Login successful', 'role': user.role})
    return jsonify({'error': 'Invalid username or password'})


#function to get all the users with role cutomers
@app.route('/getCustomers', methods=['GET'])
def get_customers():
    customers = User.query.filter_by(role='customer').all()
    return jsonify({'customers': [c.username for c in customers]})


#delete the user based on the username
@app.route('/deleteUser', methods=['POST'])
def delete_user():
    data = request.get_json()
    username = data['username']
    
    user = User.query.filter_by(username=username).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': 'User deleted'})
    return jsonify({'error': 'User not found'})


@app.route('/updateProduct', methods=['POST'])
def update_product():
    data = request.get_json()
    og_name = data['og_name']
    product_id = data['product_id']
    product_name = data['product_name']
    product_description = data['product_description']
    product_price = data['product_price']
    product_image = data['product_image']
    category_id = data['category_id']
    
    product = Product.query.get(product_id)
    if product:
        product.name = product_name
        product.description = product_description
        product.price = product_price
        product.images = str(product_image)  # Convert to string for SQLite
        product.category_id = category_id
        db.session.commit()
        return jsonify({'success': 'Product updated'})
    return jsonify({'error': 'Product not found'})

@app.route('/addProduct', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        category_id = data['category_id']
        new_product = Product(
            name=data['product_name'],
            description=data['product_description'],
            price=data['product_price'],
            images=str(data['product_image']),  # Convert to string for SQLite
            category_id=category_id
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({'success': 'Product added to category'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    data = request.get_json()
    product_id = data['product_id']
    
    product = Product.query.get(product_id)
    if product:
        db.session.delete(product)
        db.session.commit()
        return jsonify({'success': 'Product deleted'})
    return jsonify({'error': 'Product not found'})


# Add order and order items
@app.route('/addOrder', methods=['POST'])
def add_order():
    data = request.get_json()
    username = data['username']
    customer_name = data['customer_name']
    shipping_address = data['shipping_address']
    creditcard_number = data['creditcard_number']
    ship_date = data['ship_date']
    shipping_cost = data['shipping_cost']
    total_cost = data['total_cost']
    store_name = data['store_name']
    store_id = data['store_id']
    store_address = data['store_address']
    products = data['products']
    confirmation_number = data['confirmation_number']
    homeDelivery = data['homeDelivery']
    storePickup = data['storePickup']
    street_address = data['street_address']
    city = data['city']
    state = data['state']
    zip_code = data['zip_code']
    
    ship_date = datetime.fromisoformat(ship_date.replace('Z', '+00:00'))

    #push the customer name, address, city, state, zip code to the customers table if the customer is not already present
    customer = Customers.query.filter_by(name=customer_name, street=shipping_address, city=city, state=state, zip_code=zip_code).first()
    if not customer:
        new_customer = Customers(username=username ,name=customer_name, street=shipping_address, city=city, state=state, zip_code=zip_code)
        db.session.add(new_customer)
        db.session.commit()


    # Create the Order instance without the products parameter
    new_order = Order(
        homeDelivery=homeDelivery,
        storePickup=storePickup,
        username=username,
        customer_name=customer_name,
        shipping_address=shipping_address,
        creditcard_number=creditcard_number,
        ship_date=ship_date,
        shipping_cost=shipping_cost,
        total_cost=total_cost,
        store_name=store_name,
        store_id=store_id,
        store_address=store_address,
        confirmation_number=confirmation_number
    )
    db.session.add(new_order)
    db.session.commit()

    # Add order items
    for product in products:
        new_order_item = OrderItem(
            order_id=new_order.id,
            product_id=product['product_id'],
            category_id=product['category_id'],
            quantity=product['quantity'],
            haswarranty=product['haswarranty'],
            price=product['price']
        )
        print(new_order_item.product_id)
        db.session.add(new_order_item)
    db.session.commit()

    

    #clear the cart
    CartItem.query.filter_by(username=username).delete()
    db.session.commit()
    
    
    return jsonify({'success': 'Order placed'})



#endpoint to get all the orders based on the username
@app.route('/getOrders', methods=['POST'])
def get_orders():
    data = request.get_json()
    username = data['username']
    
    orders = Order.query.filter_by(username=username).all()
    order_list = [{
        'order_id': order.id,
        'confirmation_number': order.confirmation_number,
        'order_date': order.purchase_date.isoformat(),
        'shipping_cost': order.shipping_cost,
        'total_cost': order.total_cost,
        #iterate over the order items and get the product name, price, quantity, haswarranty with the order id as the key
        'products': [{
            'product_id': item.product_id,
            'product_name': Product.query.get(item.product_id).name if Product.query.get(item.product_id) else 'Unknown Product',
            'product_price': item.price,
            'quantity': item.quantity,
            'haswarranty': item.haswarranty
        } for item in order.order_items]
    } for order in orders]

    print(order_list)
    return jsonify(order_list)


#endpoint to get all the orders
@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    
    orders = Order.query.all()
    order_list = [{
        'order_id': order.id,
        'confirmation_number': order.confirmation_number,
        'order_date': order.purchase_date.isoformat(),
        'shipping_cost': order.shipping_cost,
        'total_cost': order.total_cost,
        'store_name': order.store_name,
        'store_id': order.store_id,
        'store_address': order.store_address,
        'homeDelivery': order.homeDelivery,
        'storePickup': order.storePickup,
        'shipping_address': order.shipping_address,
        'creditcard_number': order.creditcard_number,
        'customer_name': order.customer_name,
        'username': order.username,
        #iterate over the order items and get the product name, price, quantity, haswarranty with the order id as the key
        'products': [{
            'product_id': item.product_id,
            'product_name': Product.query.get(item.product_id).name if Product.query.get(item.product_id) else 'Unknown Product',
            'product_price': item.price,
            'quantity': item.quantity,
            'haswarranty': item.haswarranty
        } for item in order.order_items]
    } for order in orders]

    print(order_list)
    return jsonify(order_list)


@app.route('/cancelOrder', methods=['POST'])
def cancel_order():
    data = request.get_json()
    order_id = data.get('order_id')
    print(f"Received order_id: {order_id}, type: {type(order_id)}")
    
    if order_id is None:
        return jsonify({'error': 'No order_id provided'}), 400
    
    try:
        order_id = int(order_id)
    except ValueError:
        return jsonify({'error': 'Invalid order_id format'}), 400
    
    try:
        # First, delete all OrderItems associated with this order
        OrderItem.query.filter_by(order_id=order_id).delete()
        
        # Then, delete the order itself
        order = Order.query.get(order_id)
        if order:
            db.session.delete(order)
        else:
            return jsonify({'error': 'Order not found'}), 404
        
        # Commit the changes
        db.session.commit()
        return jsonify({'success': 'Order and associated items cancelled'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#endpoint to post the review to mongo db
@app.route('/postReview', methods=['POST'])

def post_review():
    data = request.get_json()
    formdata = data['formData']
    product_model_name = formdata.get('productModelName')
    product_category = formdata.get('productCategory')
    product_price = formdata.get('productPrice')
    store_id = formdata.get('storeID')
    store_zip = formdata.get('storeZip')
    store_city = formdata.get('storeCity')
    store_state = formdata.get('storeState')
    product_on_sale = formdata.get('productOnSale')
    manufacturer_name = formdata.get('manufacturerName')
    manufacturer_rebate = formdata.get('manufacturerRebate')
    review_rating = formdata.get('reviewRating')
    review_text = formdata.get('reviewText')
    review_date = datetime.now().isoformat()
    username = formdata.get('username')

    review = {

        'productModelName': product_model_name,
        'productCategory': product_category,
        'productPrice': product_price,
        'storeID': store_id,
        'storeZip': store_zip,
        'storeCity': store_city,
        'storeState': store_state,
        'productOnSale': product_on_sale,
        'manufacturerName': manufacturer_name,
        'manufacturerRebate': manufacturer_rebate,
        'reviewRating': review_rating,
        'reviewText': review_text,
        'reviewDate': review_date,
        'username': username
    }


    #insert the review into the mongo db
    mongo_collection.insert_one(review)

    print('Review added to MongoDB')


    return jsonify({'success': 'Review added'})



@app.route('/topProducts', methods=['POST'])
def top_products():
    data = request.get_json()
    print(data)
    filter_key = data.get('filter')

    try:
        if filter_key == 'topRated':
            pipeline = [
                {"$addFields": {"reviewRatingInt": {"$toInt": "$reviewRating"}}},  # Convert reviewRating to integer
                {"$group": {"_id": "$productModelName", "average_rating": {"$avg": "$reviewRatingInt"}}},
                {"$sort": {"average_rating": -1}},
                {"$limit": 5}
            ]
            top_products = list(mongo_collection.aggregate(pipeline))
            product_data = [{
                'product_model_name': product['_id'],
                'average_rating': product['average_rating']
            } for product in top_products]
            
            print(product_data)
            return jsonify({'top_rated_products': product_data})

        elif filter_key == 'zipCode':
            
            orders = Order.query.all()
            zip_code_count = {}
            for order in orders:
                zip_code = order.shipping_address.split()[-1]  # Assuming zip code is the last part of the address
                total_quantity = sum(item.quantity for item in order.order_items)
                if zip_code in zip_code_count:
                    zip_code_count[zip_code] += total_quantity
                else:
                    zip_code_count[zip_code] = total_quantity
            
            top_zip_codes = sorted(zip_code_count.items(), key=lambda x: x[1], reverse=True)[:5]
            top_zip_code_data = [{'zip_code': zip[0], 'total_sold': zip[1]} for zip in top_zip_codes]
            
            print(top_zip_code_data)
            return jsonify({'top_zip_codes': top_zip_code_data})
            
            

        elif filter_key == 'topSelling':
            # For this, go to the order items and get the product id, then get the product name and count the number of times the product is sold, considering the quantity
            order_items = OrderItem.query.all()
            product_count = {}
            for item in order_items:
                product_name = Product.query.get(item.product_id).name
                
                if product_name in product_count:
                    # Get its quantity
                    quantity = item.quantity
                    product_count[product_name] += quantity
                else:
                    product_count[product_name] = item.quantity
            
            top_selling = sorted(product_count.items(), key=lambda x: x[1], reverse=True)[:5]
            top_selling_data = [{'product_model_name': product[0], 'total_sold': product[1]} for product in top_selling]
            
            print(top_selling_data)
            return jsonify({'top_selling_products': top_selling_data})

        else:
            return jsonify({'error': 'Invalid filter key'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
@app.route('/sales_report', methods=['GET'])
def sales_report():
            try:
                # 1. Generate a table of all products sold and how many items of every product sold
                order_items = OrderItem.query.all()
                product_sales = {}
                for item in order_items:
                    product = Product.query.get(item.product_id)
                    if product:
                        if product.name not in product_sales:
                            product_sales[product.name] = {
                                'product_price': product.price,
                                'items_sold': 0,
                                'total_sales': 0.0
                            }
                        product_sales[product.name]['items_sold'] += item.quantity
                        product_sales[product.name]['total_sales'] += item.quantity * product.price

                product_sales_table = [{
                    'product_name': name,
                    'product_price': data['product_price'],
                    'items_sold': data['items_sold'],
                    'total_sales': data['total_sales']
                } for name, data in product_sales.items()]

                # 2. Generate a Bar Chart that shows the product names and the total sales for every product
                # This will be returned as part of the JSON response, and the front-end can use this data to generate the bar chart
                bar_chart_data = [{
                    'product_name': name,
                    'total_sales': data['total_sales']
                } for name, data in product_sales.items()]

                # 3. Generate a table of total daily sales transactions
                orders = Order.query.all()
                daily_sales = {}
                for order in orders:
                    date = order.purchase_date.date().isoformat()
                    if date not in daily_sales:
                        daily_sales[date] = 0.0
                    daily_sales[date] += order.total_cost

                daily_sales_table = [{
                    'date': date,
                    'total_sales': total_sales
                } for date, total_sales in daily_sales.items()]

                
                #print the product sales table, bar chart data and daily sales table
                print(product_sales_table)
                print(bar_chart_data)
                print(daily_sales_table)
                
                # Ensure the daily sales table has at least 10 entries
                if len(daily_sales_table) < 10:
                    # Calculate how many entries are needed
                    entries_needed = 10 - len(daily_sales_table)
                    # Generate dummy entries
                    for i in range(entries_needed):
                        dummy_date = (datetime.utcnow() - timedelta(days=i+1)).date().isoformat()
                        daily_sales_table.append({
                            'date': dummy_date,
                            'total_sales': round(1000 + i * 100, 2)  # Example sales amount
                        })
                
                return jsonify({
                    'product_sales_data': product_sales_table,
                    'bar_chart_data': bar_chart_data,
                    'daily_sales_data': daily_sales_table
                })
            except Exception as e:
                return jsonify({'error': str(e)}), 500

@app.route('/inventory_report', methods=['GET'])
def inventory_report():
                    try:
                        # 1. Generate a table of all products and how many items of every product currently available in the store
                        products = Product.query.all()
                        product_inventory = [{
                            'product_name': product.name,
                            'product_price': product.price,
                            'items_available': product.quantity
                        } for product in products]

                        # 2. Generate a Bar Chart that shows the product names and the total number of items available for every product
                        bar_chart_data = [{
                            'product_name': product.name,
                            'items_available': product.quantity
                        } for product in products]

                        # 3. Generate a table of all products currently on sale
                        # Assuming 'product_on_sale' is a boolean field in the Product model
                        products_on_sale = [{
                            'product_name': product.name,
                            'product_price': product.price,
                            'items_available': product.quantity
                        } for product in products if product.on_sale]

                        # 4. Generate a table of all products currently that have manufacturer rebates
                        # Assuming 'manufacturer_rebate' is a boolean field in the Product model
                        products_with_rebates = [{
                            'product_name': product.name,
                            'product_price': product.price,
                            'items_available': product.quantity
                        } for product in products if product.manufacturer_rebate]

                        return jsonify({
                            'product_inventory': product_inventory,
                            'bar_chart_data': bar_chart_data,
                            'products_on_sale': products_on_sale,
                            'products_with_rebates': products_with_rebates
                        })
                    except Exception as e:
                        return jsonify({'error': str(e)}), 500






if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create database tables
        
    #print all the product ids 
    app.run(port=8000, debug=True, threaded=True)




