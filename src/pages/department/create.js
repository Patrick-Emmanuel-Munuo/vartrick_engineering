/* Required Modules */
import React, { useEffect, useMemo } from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation, useNavigate } from 'react-router-dom';
import { permission, getInfo } from '../../helpers/functions';

/* Create/Edit Department Component */
const CreateDepartment = React.memo((props) => {
  const { state, unMount, dispatch, handleInputChange } = props.application;
  const pathname = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(pathname.state?.id);

  /* Component Mount */
  useEffect(() => {
    if ((isEditMode && permission(1001)) || (!isEditMode && permission(1003))) {
      document.title = isEditMode ? 'Edit Department' : 'Create Department';
      if (isEditMode) populateForm(pathname.state);
      fetchInitialData();
    } else {
      navigate("/not-found", { replace: true });
    }

    return () => unMount();
    // eslint-disable-next-line
  }, []);

  /* Populate form for edit mode */
  const populateForm = (data) => {
    dispatch({
      department_name: data.department_name,
      department_description: data.description,
      hod: data.hod,
      assist_hod: data.assist_hod,
      department_location: data.location,
      department_phone: data.phone,
      department_status: data.status,
      department_code: data.department_code,
    });
  };

/* Fetch Departments and Users */
const fetchInitialData = async () => {
  try {
    // Fetch departments
    const deptResponse = await props.application.post({
      route: 'read',
      body: { table: 'departments', condition: { delated: 0 } }
    });
    if (deptResponse.success) {
      dispatch({ departments_lists: deptResponse.message });
    } else {
      dispatch({ departments_lists: [] });
      dispatch({ notification: `Failed to fetch departments: ${deptResponse.message}` });
    }
    // Fetch users
    const usersResponse = await props.application.post({
      route: 'read',
      body: { 
        table: 'users',
        condition: { delated: 0 },
        select: { id: "", full_name: "" } 
      }
    });
    if (usersResponse.success) {
      dispatch({ users: usersResponse.message });
    } else {
      dispatch({ users: [] });
      dispatch({ notification: `Failed to fetch users: ${usersResponse.message}` });
    }
  } catch (error) {
    dispatch({ notification: error instanceof Error ? error.message : 'Error fetching data' });
  }
};


  /* Unified Submit Function for Create & Update */
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const errors = [];
      // Validation
      if (!state.department_name) { errors.push("Department name required"); dispatch({ department_name_error: "Department name required" }); }
      if (!state.department_description) { errors.push("Department description required"); dispatch({ department_description_error: "Department description required" }); }
      if (!state.hod) { errors.push("Department head required"); dispatch({ hod_error: "Department head required" }); }
      if (!state.assist_hod) { errors.push("Department assistant required"); dispatch({ assist_hod_error: "Department assistant required" }); }
      if (!state.department_location) { errors.push("Department location required"); dispatch({ department_location_error: "Department location required" }); }
      if (!state.department_phone) { errors.push("Department phone required"); dispatch({ department_phone_error: "Department phone required" }); }
      if (!state.department_status) { errors.push("Department status required"); dispatch({ department_status_error: "Department status required" }); }

      if (errors.length) return;
      const payload = {
        department_name: state.department_name,
        department_code: state.department_code,
        description: state.department_description,
        hod: state.hod,
        assist_hod: state.assist_hod,
        phone: state.department_phone,
        location: state.department_location,
        status: state.department_status
      };

      let response;
      if (isEditMode) {
        payload.updated_by = getInfo("user", "id");
        response = await props.application.post({
          route: 'update',
          body: { table: 'departments', condition: { id: pathname.state.id }, data: payload }
        });
      } else {
        payload.created_by = getInfo("user", "id");
        response = await props.application.post({
          route: 'create',
          body: { table: 'departments', data: payload }
        });
      }
      if (response.success) {
        dispatch({ notification: isEditMode ? "Department updated successfully!" : "Department created successfully!" });
        navigate("/department/list", { replace: true });
      } else {
        dispatch({ notification: `Operation failed: ${response.message}` });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'Error during operation' });
    }
  };
  /* Render Users Options */
  const renderUsers = useMemo(() => {
    return state.users?.map((user, idx) => <Option value={user.id} label={user.full_name} key={idx} />);
  }, [state.users]);

  /* Component JSX */
  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 col-12">
                    <Input type="text" label="Department Name" name="department_name" value={state.department_name} error={state.department_name_error} onChange={handleInputChange} placeholder="Enter department name" />
                  </div>
                  <div className="col-md-6 col-12">
                    <Input type="text" label="department_code" name="department_code" value={state.department_code} error={state.department_code_error} onChange={handleInputChange} placeholder="Enter department name" />
                  </div>
                  <div className="col-md-6 col-12">
                    <Input type="text" label="Department Description" name="department_description" value={state.department_description} error={state.department_description_error} onChange={handleInputChange} placeholder="Enter department description" />
                  </div>
                  <div className="col-md-6 col-12">
                    <Select name="hod" value={state.hod || ""} onChange={handleInputChange} label="Department Head" error={state.hod_error}>
                      <Option value="" label="Select Department Head" />
                      {renderUsers}
                    </Select>
                  </div>
                  <div className="col-md-6 col-12">
                    <Select name="assist_hod" value={state.assist_hod || ""} onChange={handleInputChange} label="Department Assistant" error={state.assist_hod_error}>
                      <Option value="" label="Select Department Assistant" />
                      {renderUsers}
                    </Select>
                  </div>
                  <div className="col-md-6 col-12">
                    <Input type="text" label="Department Location" name="department_location" value={state.department_location} error={state.department_location_error} onChange={handleInputChange} placeholder="Enter department location" />
                  </div>
                  <div className="col-md-6 col-12">
                    <Input type="text" label="Department Phone" name="department_phone" value={state.department_phone} error={state.department_phone_error} onChange={handleInputChange} placeholder="Enter department phone" />
                  </div>
                  <div className="col-md-6 col-12">
                    <Select name="department_status" value={state.department_status || ""} onChange={handleInputChange} label="Department Status" error={state.department_status_error}>
                      <Option value="" label="Select Department Status" />
                      <Option value="active" label="Active" />
                      <Option value="inactive" label="Inactive" />
                    </Select>
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button className="btn btn-info" loading={state.loading} disabled={state.disabled} title={isEditMode ? "Edit" : "Save"} />
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

export default CreateDepartment;
