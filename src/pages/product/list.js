import React from 'react';
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
import { Button } from "../../components/button";
import { Icon } from "../../components/elements";
import ReactDatatable from '../../components/table';
import { config, getInfo, permission, padStart } from '../../helpers/functions';

const Product_list = React.memo((props) => {
  const {
    state,
    handleInputChange,
    openDialog,
    updateDialogue,
    dispatch,
    toggleComponent,
    unMount,
  } = props.application;

  React.useEffect(() => {
    if (permission(3001) || permission(3002)) {
      document.title = "Product List";
      mount();
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  async function mount() {
    try {
      dispatch({ loading: true });
      // Fetch product list
      const products = await props.application.post({
        route: 'read',
        body: {
          table: 'product',
          condition: { deleted: 0 }
        }
      });
      dispatch({ loading: false });
      dispatch({ products: products.success ? products.message : [] });
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }

  // Memoize products (add formatted IDs if needed)
  const mappedProducts = React.useMemo(() => {
    if (!state.products) return [];
    return state.products.map(product => ({
      ...product,
      id: padStart(product.id, 3),
      available: parseFloat(product.available).toFixed(3),
      buying_price: parseFloat(product.buying_price).toFixed(3),
      selling_price: parseFloat(product.selling_price).toFixed(3),
      tax: parseFloat(product.tax).toFixed(3),
      profit_rate: parseFloat(product.profit_rate).toFixed(3),
      discount: parseFloat(product.discount).toFixed(3)
    }));
  }, [state.products]);

  // Columns configuration
  const columns = [
    { key: "id", text: "ID", className: "center", width: "50px", sortable: true },
    { key: "product_name", text: "Product Name", className: "center", width: "200px", sortable: true },
    { key: "product_code", text: "Code", className: "center", width: "100px", sortable: true },
    { key: "description", text: "Description", className: "center", width: "250px", sortable: false },
    { key: "location", text: "Location", className: "center", width: "150px", sortable: true },
    { key: "unit_of_measure", text: "Unit", className: "center", width: "100px", sortable: true },
    { key: "available", text: "Available", className: "center", width: "100px", sortable: true },
    { key: "buying_price", text: "Buying Price", className: "center", width: "120px", sortable: true },
    { key: "selling_price", text: "Selling Price", className: "center", width: "120px", sortable: true },
    { key: "tax", text: "Tax (%)", className: "center", width: "80px", sortable: true },
    { key: "profit_rate", text: "Profit Rate (%)", className: "center", width: "100px", sortable: true },
    { key: "discount", text: "Discount (%)", className: "center", width: "100px", sortable: true },
    {
      key: "status",
      text: "Status",
      className: "center",
      width: "100px",
      sortable: true,
      cell: record => (
        <span
          className={`badge rounded-pill ${
            record.status?.toLowerCase() === "active"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {record.status || "N/A"}
        </span>
      )
    },
    {
      key: "action",
      text: "Action",
      className: "center",
      width: "120px",
      sortable: false,
      cell: record => (
        <div className="btn-group">
          {permission(3003) && (
            <Link state={record} to="/product/create" className="edit" title="Edit">
              <Icon name="edit" type="round" />
            </Link>
          )}
          {permission(3004) && (
            <Link
              to="#"
              className="delete"
              title="Delete"
              onClick={() => openDialog({ table: "product", id: record.id })}
              data-toggle="tooltip"
            >
              <Icon name="delete" type="round" />
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <section className="section">
        <div className="list-manager form-group">
          {permission(32020) && (
            <div className="d-flex align-items-center mb-0" style={{ paddingTop: "5px", paddingLeft: "5px" }}>
              <span className="me-2 fw-semibold">Products</span>
              <select
                name="views"
                className="form-select"
                value={state.views || "active"}
                onChange={handleInputChange}
                style={{ width: "100px" }}
                label="Manager Product Views"
              >
                <option key={"all"} value="all" label="All" />
                <option key={"active"} value="active" label="Active" />
                <option key={"inactive"} value="inactive" label="Inactive" />
              </select>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="responsive-table">
                  <ReactDatatable
                    config={config}
                    records={mappedProducts}
                    columns={columns}
                    loading={state.loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        title="Product Confirmation"
        text="Are you sure you want to delete this product?"
        action={() => updateDialogue()}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default Product_list;
