import React from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation, useNavigate } from 'react-router-dom';
import { getInfo } from '../../helpers/functions';

const CreateInventory = React.memo((props) => {
  const { state, unMount, dispatch, handleInputChange, post } = props.application;
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = location.state ? "Edit Inventory Item" : "Create Inventory Item";
    onMount();

    if (location.state) {
      const data = location.state;
      dispatch({
        item_name: data.item_name ?? "",
        descriptions: data.descriptions ?? "",
        user_department: data.user_department ?? "",
        created_department: data.created_department ?? "",
        location: data.location ?? "",
        specifications: data.specifications ?? "",
        installed_date: data.installed_date ?? "",
        active: data.active ?? 0,
        inactive: data.inactive ?? 0,
        last_ppm: data.last_ppm ?? "",
        next_ppm: data.next_ppm ?? "",
        status: data.status ?? "active"
      });
    }

    return () => unMount();
    // eslint-disable-next-line
  }, []);

  async function onMount() {
    try {
      const response = await post({
        route: 'read',
        body: {
          table: 'departments',
          condition: { delated: 0 },
          select: { department_name: "", id: "" }
        }
      });
      if (response.success) {
        dispatch({ departments: response.message });
      } else {
        dispatch({ departments: [] });
        dispatch({ notification: response.message });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Submission error" });
    }
  }

  async function submit() {
    try {
      const response = await post({
        route: 'create',
        body: {
          table: 'inventory',
          data: {
            id: "",
            item_name: state.item_name ?? "",
            descriptions: state.descriptions ?? "",
            user_department: state.user_department ?? "",
            created_department: getInfo("user", "department_id") ?? "",
            location: state.location ?? "",
            specifications: state.specifications ?? "",
            installed_date: state.installed_date ?? "",
            active: state.active ?? 0,
            inactive: state.inactive ?? 0,
            last_ppm: state.last_ppm ?? "",
            next_ppm: state.next_ppm ?? "",
            status: state.status ?? "",
            created_by: getInfo("user", "id") ?? "",
            //created_date: time_now,
            delated: 0,
          }
        }
      });
      if (response.success) {
        dispatch({ notification: "Inventory item created successfully" });
        navigate("/maintanance/inventory-list");
      } else {
        dispatch({ notification: response.message || "Failed to create inventory item" });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Submission error" });
    }
  }

  async function updateInventory(event) {
    event.preventDefault();
    try {
      const response = await post({
        route: 'update',
        body: {
          table: 'inventory',
          condition: { id: location.state.id },
          data: {
            item_name: state.item_name ?? "",
            descriptions: state.descriptions ?? "",
            user_department: state.user_department ?? "",
            created_department: getInfo("user", "department_id") ?? "",
            location: state.location ?? "",
            specifications: state.specifications ?? "",
            installed_date: state.installed_date ?? "",
            active: state.active ?? 0,
            inactive: state.inactive ?? 0,
            last_ppm: state.last_ppm ?? "",
            next_ppm: state.next_ppm ?? "",
            status: state.status ?? "",
            updated_by: getInfo("user", "id") ?? "",
            //updated_date: time_now,
          }
        }
      });
      if (response.success) {
        dispatch({ notification: "Inventory item updated successfully" });
        navigate("/maintanance/inventory-list");
      } else {
        dispatch({ notification: response.message || "Failed to update inventory item" });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Update error" });
    }
  }

  function validateForm(event) {
    event.preventDefault();
    const errors = [];
    if (!state.item_name?.trim()) {
      errors.push("item_name");
      dispatch({ item_name_error: "Item name is required" });
    } else {
      dispatch({ item_name_error: "" });
    }
    if (!state.user_department?.trim()) {
      errors.push("user_department");
      dispatch({ user_department_error: "Department is required" });
    } else {
      dispatch({ user_department_error: "" });
    }
    if (!state.status?.trim()) {
      errors.push("status");
      dispatch({ status_error: "Status is required" });
    } else {
      dispatch({ status_error: "" });
    }

    if (errors.length === 0) {
      location.state ? updateInventory(event) : submit();
    }
  }

  function user_departments() {
    if (!Array.isArray(state.departments)) return null;
    return state.departments.map((department, index) => (
      <Option value={department.id} label={department.department_name} key={index} />
    ));
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={validateForm} noValidate>
                <div className="row">
                  <div className="col-md-4 col-12 mb-3">
                    <Select
                      name="user_department"
                      value={state.user_department ?? ""}
                      onChange={handleInputChange}
                      label="User Department"
                      error={state.user_department_error ?? ""}
                    >
                      <Option value="" label="Select item department" />
                      {user_departments()}
                    </Select>
                  </div>

                  {[
                    { name: "item_name", label: "Name" },
                    { name: "descriptions", label: "Descriptions" },
                    { name: "location", label: "Location" },
                    { name: "specifications", label: "Specifications" },
                    { name: "installed_date", label: "Installed Date", type: "date" },
                    { name: "last_ppm", label: "Last PPM", type: "date" },
                    { name: "next_ppm", label: "Next PPM", type: "date" },
                  ].map(({ name, label, type = "text" }) => (
                    <div key={name} className="col-md-4 col-12 mb-3">
                      <Input
                        type={type}
                        className="form-control"
                        name={name}
                        value={state[name] ?? ""}
                        label={label}
                        onChange={handleInputChange}
                        placeholder={`Enter ${label}`}
                        error={state[`${name}_error`] ?? ""}
                        required
                      />
                    </div>
                  ))}

                  <div className="col-md-4 col-12 mb-3">
                    <Input
                      type="number"
                      className="form-control"
                      label="Active Item Count"
                      name="active"
                      value={state.active ?? 0}
                      onChange={handleInputChange}
                      error={state.active_error ?? ""}
                      placeholder="Enter number of active items"
                      required
                    />
                  </div>

                  <div className="col-md-4 col-12 mb-3">
                    <Input
                      type="number"
                      className="form-control"
                      label="Inactive Item Count"
                      name="inactive"
                      value={state.inactive ?? 0}
                      onChange={handleInputChange}
                      error={state.inactive_error ?? ""}
                      placeholder="Enter number of inactive items"
                      required
                    />
                  </div>

                  <div className="col-md-4 col-12 mb-3">
                    <Select
                      name="status"
                      value={state.status ?? ""}
                      onChange={handleInputChange}
                      label="Item Status"
                      error={state.status_error ?? ""}
                    >
                      <Option value="" label="Select item status" />
                      <Option value="active" label="Active" />
                      <Option value="inactive" label="Inactive" />
                      <Option value="defective" label="Defective" />
                      <Option value="unused" label="Unused" />
                      <Option value="spare" label="Spare" />
                      <Option value="expired" label="Expired" />
                      <Option value="standby" label="Standby" />
                    </Select>
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button
                      className="btn btn-info"
                      loading={state.loading}
                      disabled={state.disabled}
                      title={location.state ? "Update" : "Save"}
                      onClick={validateForm}
                    />
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

export default CreateInventory;
