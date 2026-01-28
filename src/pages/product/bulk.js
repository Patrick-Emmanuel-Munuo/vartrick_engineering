import React, { useEffect, useMemo } from "react";
import { Button } from "../../components/button";
import ReactDatatable from "../../components/table";
import { config } from "../../helpers/functions";
import { Input } from "../../components/form";

/* =========================
   REQUIRED EXCEL COLUMNS
========================= */
const REQUIRED_COLUMNS = [
  "product_name",
  "product_code",
  "maker",
  "available",
  "buying_price",
  "selling_price",
];

/* =========================
   VALIDATION HELPER
========================= */
const validateExcelData = (rows = []) => {
  if (!rows.length) {
    return { valid: false, message: "Excel file is empty" };
  }

  const columns = Object.keys(rows[0]).map((k) =>
    k.toString().trim().toLowerCase()
  );

  const missing = REQUIRED_COLUMNS.filter(
    (col) => !columns.includes(col)
  );

  if (missing.length) {
    return {
      valid: false,
      message: `Missing required columns: ${missing.join(", ")}`,
    };
  }

  const invalidRow = rows.find((row) =>
    REQUIRED_COLUMNS.some(
      (col) =>
        row[col] === null ||
        row[col] === undefined ||
        row[col] === ""
    )
  );

  if (invalidRow) {
    return {
      valid: false,
      message: "Some rows contain empty mandatory fields",
    };
  }

  return { valid: true };
};

const Bulk_Create_Product = React.memo((props) => {
  const {
    state,
    handleFileChange,
    dispatch,
    jsonToExcel,
    post,
  } = props.application;

  /* =========================
     INIT
  ========================== */
  useEffect(() => {
    document.title = "Bulk Create Products";
    dispatch({
      file_data: [],
      files: null,
      files_error: "",
      loading: false,
    });
  }, [dispatch]);

  /* =========================
     VALIDATE AFTER UPLOAD
  ========================== */
  useEffect(() => {
    if (!state.file_data || !state.file_data.length) return;

    const validation = validateExcelData(state.file_data);

    if (!validation.valid) {
      dispatch({
        file_data: [],
        files_error: validation.message,
      });
    } else {
      dispatch({ files_error: "" });
    }
  }, [state.file_data, dispatch]);

  /* =========================
     TABLE COLUMNS
  ========================== */
  const columns = [
    { key: "id", text: "No" },
    { key: "product_name", text: "Product Name" },
    { key: "product_code", text: "Product Code" },
    { key: "maker", text: "Manufacturer" },
    { key: "available", text: "Available Qty" },
    { key: "buying_price", text: "Buying Price" },
    { key: "selling_price", text: "Selling Price" },
    { key: "profit_rate", text: "Profit (%)" },
    { key: "status", text: "Status" },
    { key: "is_created", text: "Is Created" },
    { key: "feedback", text: "Feedback" },
  ];

  /* =========================
     TEMPLATE DOWNLOAD
  ========================== */
  const handleDownloadTemplate = () => {
    const template = [
      {
        product_name: "Laptop Dell",
        product_code: "DL-001",
        maker: "Dell",
        available: 10,
        buying_price: 800,
        selling_price: 950,
        discount: 5,
        unit_of_measure: "pcs",
        status: "active",
      },
    ];
    jsonToExcel(template, "products_template.xlsx");
  };

  /* =========================
     PREVIEW DATA
  ========================== */
  const filter_products = useMemo(() => {
    if (!state.file_data?.length) return [];

    return state.file_data.map((p, index) => {
      const buying = Number(p.buying_price) || 0;
      const selling = Number(p.selling_price) || 0;
      const discount = Number(p.discount || 0);

      const netSelling = selling - selling * (discount / 100);
      const profit_rate =
        buying > 0
          ? (((netSelling - buying) / buying) * 100).toFixed(2)
          : "0.00";

      return {
        id: index + 1,
        product_name: p.product_name,
        product_code: p.product_code,
        maker: p.maker,
        available: Number(p.available),
        buying_price: buying,
        selling_price: selling,
        profit_rate,
        status: p.status || "active",
        is_created: p.is_created || "null",
        feedback: p.feedback || "null",
      };
    });
  }, [state.file_data]);

  /* =========================
     SUBMIT
  ========================== */
  const handleBulkSubmit = async () => {
    if (!filter_products.length) {
      dispatch({ notification: "No valid data to submit" });
      return;
    }

    try {
      dispatch({ loading: true });

      const payload = filter_products.map((p) => ({
        product_name: p.product_name,
        product_code: p.product_code,
        maker: p.maker,
        available: p.available,
        buying_price: p.buying_price,
        selling_price: p.selling_price,
        profit_rate: p.profit_rate,
        status: p.status,
      }));

      const response = await post({
        route: "bulk-create",
        body: { table: "product", data: payload },
      });

      dispatch({ loading: false });

      if (Array.isArray(response?.message)) {
        const updated = filter_products.map((p, i) => {
          const r = response.message[i];
          return r?.success
            ? { ...p, is_created: "Yes", feedback: r.message }
            : { ...p, is_created: "No", feedback: r?.message || "Failed" };
        });

        dispatch({ file_data: updated });
        dispatch({
          notification: "Bulk product import completed",
        });
      }
    } catch (err) {
      dispatch({ loading: false });
      dispatch({ notification: "Bulk create failed" });
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <section className="section">
      <div className="card">
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <Button
              title="Download Template"
              className="btn btn-primary"
              onClick={handleDownloadTemplate}
            />

            <Input
              type="file"
              accept=".xlsx,.xls"
              label="Upload Excel"
              onChange={handleFileChange}
              error={state.files_error}
            />

            <Button
              title="Create Products"
              className="btn btn-success"
              onClick={handleBulkSubmit}
              disabled={!!state.files_error || !filter_products.length}
              loading={state.loading}
            />
          </div>

          {filter_products.length > 0 && (
            <ReactDatatable
              config={config}
              records={filter_products}
              columns={columns}
              loading={state.loading}
            />
          )}
        </div>
      </div>
    </section>
  );
});

export default Bulk_Create_Product;
