/* Required Modules */
import React, { useEffect, useState } from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";

const CreateSellingProduct = React.memo((props) => {
  const { state, dispatch, handleInputChange, unMount } = props.application;

  // Local state
  const [cart, setCart] = useState([]);
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [taxRate, setTaxRate] = useState(18);

  // Default customer on load
  useEffect(() => {
    dispatch({
      customer_name: "Customer",
      customer_phone: "",
      customer_email: "",
      customer_address: ""
    });
    return () => unMount();
  }, []);

  // =========================
  // CUSTOMER SEARCH
  // =========================
  const searchCustomer = async (customer) => {
    if (!customer) return setCustomerSearchResults([]);
    try {
      const res = await props.application.post({
        route: 'search',
        body: {
          table: 'customer',
          condition: { full_name: customer },
          select: { full_name: "", phone_number: "", email: "", address: "" }
        }
      });
      if (res?.success) setCustomerSearchResults(res.message);
    } catch (error) {
      console.error(error);
    }
  };

  const selectCustomer = (customer) => {
    dispatch({
      customer_name: customer.full_name,
      customer_phone: customer.phone_number,
      customer_email: customer.email,
      customer_address: customer.address
    });
    setCustomerSearchResults([]);
  };

  // =========================
  // PRODUCT SEARCH
  // =========================
  const searchProduct = async (name) => {
    if (!name) return setProductSearchResults([]);
    try {
      const res = await props.application.post({
        route: 'search',
        body: {
          table: 'product',
          condition: { product_name: name },
          select: { id: "", product_name: "", product_code: "", selling_price: "", available: "" }
        }
      });
      if (res?.success) setProductSearchResults(res.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
    const product = productSearchResults.find(p => p.id === parseInt(productId));
    if (product) addProductToCart(product);
  };

  // =========================
  // CART MANAGEMENT
  // =========================
  const addProductToCart = (product) => {
    const exists = cart.find(item => item.product_id === product.id);
    if (exists) return; // prevent duplicate
    setCart([...cart, {
      product_id: product.id,
      product_name: product.product_name,
      product_code: product.product_code,
      qty: 1,
      unit_price: Number(product.selling_price),
      total: Number(product.selling_price)
    }]);
    setSelectedProductId("");
    setProductSearchResults([]);
  };

  const updateCartItem = (index, key, value) => {
    const updated = [...cart];
    updated[index][key] = key === "qty" || key === "unit_price" ? Number(value) : value;
    updated[index].total = updated[index].qty * updated[index].unit_price;
    setCart(updated);
  };

  const removeCartItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const calculateTotals = () => {
    const bill_amount = cart.reduce((sum, i) => sum + i.total, 0);
    const tax = (bill_amount * taxRate) / 100;
    return { bill_amount, tax, invoice_amount: bill_amount + tax };
  };

  // =========================
  // SUBMIT SELLING PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.customer_name) return dispatch({ notification: "Customer name required" });
    if (!cart.length) return dispatch({ notification: "Add at least one product" });

    const totals = calculateTotals();
    const payload = {
      customer_name: state.customer_name,
      customer_phone: state.customer_phone,
      customer_email: state.customer_email,
      customer_address: state.customer_address,
      invoice_number: state.invoice_number,
      items: JSON.stringify(cart),
      bill_amount: totals.bill_amount,
      tax_rate: taxRate,
      tax: totals.tax,
      invoice_amount: totals.invoice_amount,
      payment_method: state.payment_method,
      payment_comment: state.payment_comment,
      status: state.status || "pending"
    };

    try {
      dispatch({ loading: true });
      const response = await props.application.post({
        route: 'create',
        body: { table: 'selling_product', data: payload }
      });
      dispatch({ loading: false });
      if (response?.success) {
        dispatch({ notification: "Invoice created successfully!" });
        setCart([]);
      } else {
        dispatch({ notification: response?.message || "Operation failed!" });
      }
    } catch (error) {
      dispatch({ loading: false });
      dispatch({ notification: error.message || "Unknown error" });
    }
  };

  const totals = calculateTotals();

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* CUSTOMER SECTION */}
                <h5 className="mb-3">Customer Info</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <Input
                      type="text"
                      label="Customer Name"
                      name="customer_name"
                      value={state.customer_name}
                      onChange={(e) => { handleInputChange(e); searchCustomer(e.target.value); }}
                    />
                    {customerSearchResults.length > 0 && (
                      <div className="search-results border rounded p-2 bg-white shadow-sm">
                        {customerSearchResults.map((c, i) => (
                          <div
                            key={i}
                            className="search-item p-2 mb-1 rounded hover-bg cursor-pointer"
                            onClick={() => selectCustomer(c)}
                          >
                            {c.full_name} ({c.phone_number})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <Input type="text" label="Phone" name="customer_phone" value={state.customer_phone} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-6 mt-2">
                    <Input type="text" label="Email" name="customer_email" value={state.customer_email} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-6 mt-2">
                    <Input type="text" label="Address" name="customer_address" value={state.customer_address} onChange={handleInputChange} />
                  </div>
                </div>

                {/* PRODUCT SEARCH */}
                <h5 className="mb-3">Products</h5>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <Input
                      type="text"
                      label="Search Product"
                      placeholder="Enter product name or code"
                      onChange={(e) => searchProduct(e.target.value)}
                    />
                    <Select
                      name="product_id"
                      value={selectedProductId}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      label="Select Product"
                    >
                      <Option value="" label="Search or select product" />
                      {productSearchResults.map((p, i) => (
                        <Option
                          key={i}
                          value={p.id}
                          label={`${p.product_name} | ${p.product_code} | $${Number(p.selling_price).toFixed(2)}`}
                        />
                      ))}
                    </Select>
                  </div>
                </div>

                {/* CART ITEMS */}
                <h5 className="mb-3">Cart Items</h5>
                <div className="cart-container border p-3 rounded bg-light">
                  {cart.length === 0 && (
                    <div className="text-center text-muted py-3">No products added to the cart yet.</div>
                  )}

                  {cart.map((item, i) => (
                    <div key={i} className="cart-item d-flex align-items-center justify-content-between rounded shadow-sm">
                      <div className="flex-grow-1">
                        <strong>{item.product_name}</strong> <span className="text-muted">({item.product_code})</span>
                      </div>

                      <div className="mx-2" style={{ width: "80px" }}>
                        <Input
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) => updateCartItem(i, 'qty', e.target.value)}
                          label="Qty"
                        />
                      </div>

                      <div className="mx-2" style={{ width: "100px" }}>
                        <Input
                          type="number"
                          value={item.unit_price}
                          min={0}
                          onChange={(e) => updateCartItem(i, 'unit_price', e.target.value)}
                          label="Unit Price"
                        />
                      </div>

                      <div className="mx-2" style={{ width: "100px" }}>
                        <Input
                          type="number"
                          value={item.total.toFixed(2)}
                          disabled
                          label="Total"
                        />
                      </div>

                      <div className="mx-2" style={{ width: "40px" }}>
                        <Button
                          className="btn btn-danger"
                          title="🗑"
                          onClick={() => removeCartItem(i)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* TOTALS */}
                  {cart.length > 0 && (
                    <div className="cart-totals mt-4 p-3 bg-white rounded shadow-sm d-flex justify-content-end">
                      <div style={{ width: "250px" }}>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Bill Amount:</span>
                          <strong>${totals.bill_amount.toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax ({taxRate}%):</span>
                          <strong>${totals.tax.toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Invoice Total:</span>
                          <strong>${totals.invoice_amount.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-12 d-flex justify-content-center mt-4">
                  <Button className="btn btn-success" title="Save Invoice" loading={state.loading} />
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CreateSellingProduct;
