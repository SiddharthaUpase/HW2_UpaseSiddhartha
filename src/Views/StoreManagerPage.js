import React, { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from "react-router-dom";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

const StoreManagerPage = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);


  useEffect(() => {
    fetchSalesReport();
  }, []);

  const [barChartData, setBarChartData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [productSalesData, setProductSalesData] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!currentCategory) {
      alert('No category selected');
      return;
    }

    const newProduct = {
      product_name: productName,
      product_description: productDescription,
      product_price: parseFloat(productPrice),
      product_image: [productImageUrl],
      category_id: currentCategory.id
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedProduct = await response.json();
      console.log('Product added:', addedProduct);

      // Refresh the categories to reflect the new product
      fetchCategories();

      // Close the dialog and reset the form
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) {
      alert('No product selected');
      return;
    }

    const updatedProduct = {
      product_id: currentProduct.product_id,
      product_name: productName,
      product_description: productDescription,
      product_price: parseFloat(productPrice),
      product_image: [productImageUrl],
      category_id: currentProduct.category_id,
      og_name: currentProduct.product_name,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/updateProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProductData = await response.json();
      console.log('Product updated:', updatedProductData);

      // Refresh the categories to reflect the updated product
      fetchCategories();

      // Close the dialog and reset the form
      setOpenProduct(false);
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) {
      alert('No product selected');
      return;
    }

    const productToDelete = {
      product_id: currentProduct.product_id,
      category_id: currentProduct.category_id,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/deleteProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToDelete),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const deletedProductData = await response.json();
      console.log('Product deleted:', deletedProductData);

      // Refresh the categories to reflect the deleted product
      fetchCategories();

      // Close the dialog and reset the form
      setOpenProduct(false);
      resetForm();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };
  const handleProductClick = (product) => {
    setCurrentProduct(product);
    setProductName(product.product_name);
    setProductDescription(product.product_description);
    setProductPrice(product.product_price.toString());
    setProductImageUrl(product.product_image[0]);
    setOpenProduct(true);
  };

  const resetForm = () => {
    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductImageUrl("");
    setCurrentProduct(null);
    setCurrentCategory(null);
  };
  const [inventoryData, setInventoryData] = useState({
    product_inventory: [],
    bar_chart_data: [],
    products_on_sale: [],
    products_with_rebates: []
  });

  useEffect(() => {
    fetchInventoryReport();
  }, []);

  const fetchInventoryReport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/inventory_report');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      alert('Failed to fetch inventory report. Please try again.');
    }
  };
  

  const fetchSalesReport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sales_report');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const salesReportData = await response.json();

      setBarChartData(salesReportData.bar_chart_data);
      setDailySalesData(salesReportData.daily_sales_data);
      setProductSalesData(salesReportData.product_sales_data);

      console.log('Bar Chart Data:', salesReportData.bar_chart_data.length);
      console.log('Daily Sales Data:', salesReportData.daily_sales_data.length);
      console.log('Product Sales Data:', salesReportData.product_sales_data.length);


      // You can add more logic here to display the sales report data in the UI
    } catch (error) {
      console.error('Error fetching sales report:', error);
      alert('Failed to fetch sales report. Please try again.');
    }
  };
  
  
  
  
  const [activeTab, setActiveTab] = useState('products');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="categories">
            <ul className="categoryUl">
              {categories.map(category => (
                <li key={category.id} className="category_li">
                  <span style={{ fontWeight: 'bold', color: "black", fontSize: 20 }}>{category.name}</span>
                  <div className="product-list">
                    <ul>
                      {category.products.map(product => (
                        <li key={product.product_id} className="product" onClick={() => handleProductClick(product)}>
                          <span style={{ fontSize: 12 }}>{product.product_name}</span>
                          <img src={product.product_image[0]} alt={product.product_name} style={{ width: '50px', height: '50px' }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentCategory(category);
                      setOpen(true);
                    }}
                    className="add-product-btn"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'inventory':
       

        const Inventory = () => {
          const [activeInventoryTab, setActiveInventoryTab] = useState('productInventory');

          const renderInventoryContent = () => {
            switch (activeInventoryTab) {
              case 'productInventory':
          return (
            <div style={{ width: '80%', }}>
              <h3 style={{ textAlign: 'center' }}>Product Inventory</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Items Available</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.product_inventory.map((product, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.items_available}</td>
                </tr>
              ))}
            </tbody>
                </table>
              </div>
            </div>
          );
              case 'inventoryBarChart':
          const barChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Inventory Bar Chart',
              },
            },
          };

          const barChartDataFormatted = {
            labels: inventoryData.bar_chart_data.map(item => item.product_name),
            datasets: [
              {
                label: 'Items Available',
                data: inventoryData.bar_chart_data.map(item => item.items_available),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          };

          return (
            <div style={{ width: '80%' }}>
              <h3 style={{ textAlign: 'center' }}>Inventory Bar Chart</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ height: '800px', width: '1000px' }}>
            <Bar options={barChartOptions} data={barChartDataFormatted} />
                </div>
              </div>
            </div>
          );
              case 'productsOnSale':
          return (
            <div style={{ width: '80%' }}>
              <h3 style={{ textAlign: 'center' }}>Products on Sale</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Items Available</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.products_on_sale.map((product, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.items_available}</td>
                </tr>
              ))}
            </tbody>
                </table>
              </div>
            </div>
          );
              case 'productsWithRebates':
          return (
            <div style={{ width: '80%' }}>
              <h3 style={{ textAlign: 'center' }}>Products with Manufacturer Rebates</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Items Available</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.products_with_rebates.map((product, index) => (
                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_price}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.items_available}</td>
                </tr>
              ))}
            </tbody>
                </table>
              </div>
            </div>
          );
              default:
          return null;
            }
          };

            return (
            <div>
              <h2 style={{ textAlign: 'center' }}>Inventory Report</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => setActiveInventoryTab('productInventory')}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeInventoryTab === 'productInventory' ? '#007BFF' : '#6C757D', color: 'white', cursor: 'pointer' }}
              >
                Product Inventory
              </button>
              <button 
                onClick={() => setActiveInventoryTab('inventoryBarChart')}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeInventoryTab === 'inventoryBarChart' ? '#007BFF' : '#6C757D', color: 'white', cursor: 'pointer' }}
              >
                Inventory Bar Chart
              </button>
              <button 
                onClick={() => setActiveInventoryTab('productsOnSale')}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeInventoryTab === 'productsOnSale' ? '#007BFF' : '#6C757D', color: 'white', cursor: 'pointer' }}
              >
                Products on Sale
              </button>
              <button 
                onClick={() => setActiveInventoryTab('productsWithRebates')}
                style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeInventoryTab === 'productsWithRebates' ? '#007BFF' : '#6C757D', color: 'white', cursor: 'pointer' }}
              >
                Products with Rebates
              </button>
              </div >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {renderInventoryContent()}
              </div>
            </div>
            );
        };

        return <Inventory />;
      case 'salesReport':
        ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

        const SalesReport = () => {
          const barChartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Product Sales',
              },
            },
          };

          const barChartDataFormatted = {
            labels: barChartData.map(item => item.product_name),
            datasets: [
              {
                label: 'Total Sales',
                data: barChartData.map(item => item.total_sales),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          };

          const [showBarChart, setShowBarChart] = useState(true);
          const [showDailySales, setShowDailySales] = useState(false);
          const [showProductSales, setShowProductSales] = useState(false);

            return (
            <div>
              <h2>Sales Report</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={() => { setShowBarChart(true); setShowDailySales(false); setShowProductSales(false); }}
                style={{ 
                padding: '10px 20px', 
                borderRadius: '5px', 
                backgroundColor: showBarChart ? '#007BFF' : '#6C757D', 
                color: 'white', 
                cursor: 'pointer' 
                }}
              >
                Bar Chart
              </button>
              <button 
                onClick={() => { setShowBarChart(false); setShowDailySales(true); setShowProductSales(false); }}
                style={{ padding: '10px 20px', borderRadius: '5px', border: 'none',backgroundColor: showDailySales ? '#007BFF' : '#6C757D',  color: 'white', cursor: 'pointer' }}
              >
                Daily Sales
              </button>
              <button 
                onClick={() => { setShowBarChart(false); setShowDailySales(false); setShowProductSales(true); }}
                style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: showProductSales ? '#007BFF' : '#6C757D',  color: 'white', cursor: 'pointer' }}
              >
                Product Sales
              </button>
              </div>
              {showBarChart && (
              <div style={{}}>
                <h3>Bar Chart</h3>
                <div style={{display:'flex', justifyContent:'center'}} >
                <div style={{ height: '800px', width: '1000px' }}>
                <Bar options={barChartOptions} data={barChartDataFormatted} />
                </div>
              </div>
              </div>
              )}
              {showDailySales && (
              <div>
                <h3>Daily Sales</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '80%', margin: '20px 0' }}>
                  <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Sales</th>
                  </tr>
                  </thead>
                  <tbody>
                  {dailySalesData.map((data, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.date}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.total_sales.toFixed(2)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                </div>
              </div>
              )}
              {showProductSales && (
              <div>
                <h3>Product Sales</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table style={{ borderCollapse: 'collapse', width: '80%', margin: '20px 0' }}>
                  <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product Price</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Items Sold</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Sales</th>
                  </tr>
                  </thead>
                  <tbody>
                  {productSalesData.map((product, index) => (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.product_price}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.items_sold}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.total_sales}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                </div>
              </div>
              )}
            </div>
            );
        };

        return <SalesReport />;



      default:
        return null;
    }
  };


  return (
    <div>
      <div style={{ display:'flex',  flexDirection: 'row', justifyContent: 'center', }}>
        <ul >
          <Link to="/login">LogOut</Link>
          <h1>Store Manager Page</h1>
        </ul>
      </div>

        <div className="tabs" style={{ display: 'flex', gap: '10px', justifyContent:'center' }}>
          <button onClick={() => setActiveTab('products')}>Products</button>
          <button onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button onClick={() => setActiveTab('salesReport')}>Sales Report</button>
        </div>

      {renderContent()}

      {/* Add Product Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add a Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a product to the category {currentCategory?.name}
          </DialogContentText>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Product Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Image URL"
            value={productImageUrl}
            onChange={(e) => setProductImageUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={() => {
            setOpen(false);
            resetForm();
          }}>Cancel</button>
          <button onClick={handleAddProduct}>Add</button>
        </DialogActions>
      </Dialog>

      {/* Update Product Dialog */}
      <Dialog open={openProduct} onClose={() => setOpenProduct(false)}
        PaperProps={{
          style: {
            width: '600px',
            maxWidth: '100%',
          },
        }}
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {productName}
          </DialogContentText>
          <br />
          <label>Product Name</label>
          <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <label>Product Description</label>
          <input type="text" placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
          <label>Product Price</label>
          <input type="number" placeholder="Product Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
          <label>Product Image URL</label>
          <input type="text" placeholder="Product Image URL" value={productImageUrl} onChange={(e) => setProductImageUrl(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <button onClick={() => {
            setOpenProduct(false);
            resetForm();
          }}>Cancel</button>
          <button onClick={handleUpdateProduct}>Update</button>
          <button onClick={handleDeleteProduct}>Delete</button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoreManagerPage;