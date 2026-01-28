/* Required Modules */
import React, { useEffect } from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation } from 'react-router-dom';
import { permission, designations, encrypt } from '../../helpers/functions';

const Create = React.memo((props) => {
  const { state, dispatch, handleInputChange, unMount } = props.application;
  const pathname = useLocation();
  const isEditMode = pathname.state && pathname.pathname === "/user/create";

  useEffect(() => {
    if (isEditMode && permission(2001)) {
      document.title = 'Edit User';
      populateForm(pathname.state);
    } else if (!isEditMode && permission(2003)) {
      document.title = 'Create User';
      fetchInitialData();
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  const populateForm = (user) => {
    dispatch({
      full_name: user.full_name,
      user_name: user.user_name,
      phone_number: user.phone_number,
      address: user.address,
      gender: user.gender,
      designation: user.designation,
      role_id: user.role_id,
      status: user.status,
      email: user.email,
      department_id: user.department_id,
    });
    fetchInitialData();
  };

  const fetchInitialData = async () => {
    try {
      const deptRes = await props.application.post({
        route: 'read',
        body: { table: 'departments', condition: { delated: 0 }, select: { department_name: "", id: "" } }
      });
      console.log(deptRes)
      dispatch({ departments_lists: deptRes.success ? deptRes.message : [] });

      const roleRes = await props.application.post({
        route: 'read',
        body: { table: 'roles', condition: { delated: 0 }, select: { name: "", id: "" } }
      });
      dispatch({ roles: roleRes.success ? roleRes.message : [] });
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'Error fetching data' });
    }
  };

const validatePhoneNumber = (phone) => /^\+[1-9]\d{7,14}$/.test(phone);

const handleSubmit = async (event) => {
  try {
    event.preventDefault();
    const errors = [];
    // Validation rules
    [
      { field: 'full_name', message: 'Full name required' },
      { field: 'user_name', message: 'Username required' },
      { field: 'email', message: 'Email required' },
      { field: 'address', message: 'Address required' },
      { field: 'phone_number', message: 'Phone required', custom: validatePhoneNumber, customMessage: 'Invalid phone format +countrycodeXXXXXXXX' },
      { field: 'gender', message: 'Gender required' },
      { field: 'role_id', message: 'Role required' },
      { field: 'designation', message: 'Designation required' },
      { field: 'status', message: 'Status required' }
    ].forEach(({ field, message }) => {
      if (!(state[field] || "").trim()) {
        errors.push(field);
        dispatch({ [`${field}_error`]: message });
      } else {
        dispatch({ [`${field}_error`]: "" });
      }
    });
    if (errors.length) return;
    // Payload for user creation/update
    const payload = {
      full_name: state.full_name,
      user_name: state.user_name,
      phone_number: state.phone_number,
      email: state.email,
      address: state.address,
      gender: state.gender,
      role_id: state.role_id,
      designation: state.designation,
      department_id: state.department_id,
      status: state.status,
    };
    let response;
    if (isEditMode) {
      // Edit user
      response = await props.application.post({
        route: 'update',
        body: { table: 'users', condition: { user_name: pathname.state.user_name }, data: payload }
      });
    } else {
      // Single user creation (commented)
      //create user
      payload.password = encrypt({ password: "Bmh@2025" }).encrypted || "";
      response = await props.application.post({
        route: 'create',
        body: { table: 'users', data: payload }
      });
    }
    // Final response handling
    if (response?.success) {
      dispatch({ notification: isEditMode ? "User updated successfully!" : "All users created successfully!" });
      window.location.pathname = isEditMode ? '/user/list' : '/user/create';
    } else if (response) {
      dispatch({ notification: response.message });
    }
  } catch (error) {
    dispatch({ notification: error instanceof Error ? error.message : 'Error during operation' });
  }
};


const renderDepartments = () => state.departments_lists?.map((d, i) => <Option key={i} value={d.id} label={d.department_name} />);
const renderRoles = () => state.roles?.map((r, i) => <Option key={i} value={r.id} label={r.name} />);
const renderDesignations = () => designations.map((d, i) => <Option key={i} value={d.name} label={d.name} />);

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Input type="text" autoComplete="off" label="Full Name" name="full_name" value = {state.full_name} error={state.full_name_error} onChange={handleInputChange} placeholder="Enter full name" disabled={isEditMode}/>
                  </div></div>
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Input type="text" autoComplete="off" label="Username" name="user_name" value = {state.user_name} error={state.user_name_error} onChange={handleInputChange} placeholder="Enter username" disabled={isEditMode} />
                  </div></div>
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Input type="text" autoComplete="off" label="Address" name="address" value= {state.address} error={state.address_error} onChange={handleInputChange} placeholder="Enter address" disabled={isEditMode}/>
                  </div></div>
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Input type="text" autoComplete="off" label="Phone" name="phone_number" value ={state.phone_number} error={state.phone_number_error} onChange={handleInputChange} placeholder="Number e.g. +255712345678" />
                  </div></div>
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Input type="text" autoComplete="off" label="Email" name="email" value= {state.email} error={state.email_error} onChange={handleInputChange} placeholder="Enter email" disabled={isEditMode}/>
                  </div></div>
                  <div className="col-md-4 col-12"><div className="form-group">
                    <Select name="department_id" value={state.department_id || ""} onChange={handleInputChange} label="Department" error={state.department_error}>
                      <Option value="" label="Select department" />
                      {renderDepartments()}
                    </Select>
                  </div></div>

                  <div className="col-md-4 col-12"><div className="form-group">
                    <Select name="gender" value={state.gender || ""} onChange={handleInputChange} label="Gender" error={state.gender_error} disabled={isEditMode}>
                      <Option value="" label="Select Gender" />
                      <Option value="male" label="Male" />
                      <Option value="female" label="Female" />
                    </Select>
                  </div></div>

                  <div className="col-md-4 col-12"><div className="form-group">
                    <Select name="role_id" value={state.role_id || ""} onChange={handleInputChange} label="Role" error={state.role_id_error} disabled={!permission(3001)}>
                      <Option value="" label="Select role" />
                      {renderRoles()}
                    </Select>
                  </div></div>

                  <div className="col-md-4 col-12"><div className="form-group">
                    <Select name="designation" value={state.designation || ""} onChange={handleInputChange} label="Designation" error={state.designation_error}>
                      <Option value="" label="Select designation" />
                      {renderDesignations()}
                    </Select>
                  </div></div>

                  <div className="col-md-4 col-12"><div className="form-group">
                    <Select name="status" value={state.status || ""} onChange={handleInputChange} label="Status" error={state.status_error}>
                      <Option value="" label="Select status" />
                      <Option value="active" label="Active" />
                      <Option value="inactive" label="Inactive" />
                    </Select>
                  </div></div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button className="btn btn-info" loading={state.loading} title={isEditMode ? "Edit" : "Save"} />
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

export default Create;
