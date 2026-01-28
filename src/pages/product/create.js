/* Required Modules */
import React, { useEffect } from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation } from 'react-router-dom';
import { permission } from '../../helpers/functions';

const CreateProduct = React.memo((props) => {
  const { state, dispatch, handleInputChange, unMount } = props.application;
  const pathname = useLocation();
  const isEditMode = pathname.state && pathname.pathname === "/product/create";

  useEffect(() => {
    if ((isEditMode && permission(3003)) || (!isEditMode && permission(3001))) {
      document.title = isEditMode ? 'Edit Product' : 'Create Product';
      if (isEditMode) populateForm(pathname.state);
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  const populateForm = (product) => {
    dispatch({
      product_name: product.product_name,
      product_code: product.product_code,
      description: product.description,
      location: product.location,
      unit_of_measure: product.unit_of_measure,
      available: product.available,
      buying_price: product.buying_price,
      selling_price: product.selling_price,
      tax: product.tax,
      profit_rate: product.profit_rate,
      discount: product.discount,
      status: product.status,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const errors = [];

      // Validation rules
      [
        { field: 'product_name', message: 'Product name required' },
        { field: 'selling_price', message: 'Selling price required' },
        { field: 'status', message: 'Status required' }
      ].forEach(({ field, message }) => {
        if (!(state[field] || "").toString().trim()) {
          errors.push(field);
          dispatch({ [`${field}_error`]: message });
        } else {
          dispatch({ [`${field}_error`]: "" });
        }
      });

      if (errors.length) return;

      const payload = {
        product_name: state.product_name,
        product_code: state.product_code,
        description: state.description,
        location: state.location,
        unit_of_measure: state.unit_of_measure,
        available: parseFloat(state.available || 0).toFixed(3),
        buying_price: parseFloat(state.buying_price || 0).toFixed(3),
        selling_price: parseFloat(state.selling_price || 0).toFixed(3),
        tax: parseFloat(state.tax || 0).toFixed(3),
        profit_rate: parseFloat(state.profit_rate || 0).toFixed(3),
        discount: parseFloat(state.discount || 0).toFixed(3),
        status: state.status
      };

      let response;
      if (isEditMode) {
        // Update product
        response = await props.application.post({
          route: 'update',
          body: { table: 'product', condition: { id: pathname.state.id }, data: payload }
        });
      } else {
        // Create new product
        response = await props.application.post({
          route: 'create',
          body: { table: 'product', data: payload }
        });
      }

      if (response?.success) {
        dispatch({ notification: isEditMode ? "Product updated successfully!" : "Product created successfully!" });
        window.location.pathname = '/product/list';
      } else if (response) {
        dispatch({ notification: response.message });
      }

    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'Error during operation' });
    }
  };

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="text" autoComplete="off" label="Product Name" name="product_name" value={state.product_name} error={state.product_name_error} onChange={handleInputChange} placeholder="Enter product name" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="text" autoComplete="off" label="Product Code" name="product_code" value={state.product_code} error={state.product_code_error} onChange={handleInputChange} placeholder="Enter product code" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="text" autoComplete="off" label="Location" name="location" value={state.location} error={state.location_error} onChange={handleInputChange} placeholder="Enter location" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="text" autoComplete="off" label="Unit of Measure" name="unit_of_measure" value={state.unit_of_measure} error={state.unit_of_measure_error} onChange={handleInputChange} placeholder="e.g. pcs, kg" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Available Quantity" name="available" value={state.available} error={state.available_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Buying Price" name="buying_price" value={state.buying_price} error={state.buying_price_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Selling Price" name="selling_price" value={state.selling_price} error={state.selling_price_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Tax (%)" name="tax" value={state.tax} error={state.tax_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Profit Rate (%)" name="profit_rate" value={state.profit_rate} error={state.profit_rate_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input type="number" autoComplete="off" label="Discount (%)" name="discount" value={state.discount} error={state.discount_error} onChange={handleInputChange} placeholder="0.000" step="0.001" />
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Select name="status" value={state.status || ""} onChange={handleInputChange} label="Status" error={state.status_error}>
                        <Option value="" label="Select status" />
                        <Option value="active" label="Active" />
                        <Option value="inactive" label="Inactive" />
                      </Select>
                    </div>
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button className="btn btn-info" loading={state.loading} title={isEditMode ? "Update" : "Save"} />
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CreateProduct;
