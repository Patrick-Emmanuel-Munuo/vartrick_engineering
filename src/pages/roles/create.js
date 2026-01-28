import React from 'react';
import { Input, Select, Option, Textarea } from '../../components/form';
import { Button } from '../../components/button';
import { useLocation } from 'react-router-dom';
import { getInfo, permissions,permission } from '../../helpers/functions';

const RoleCreate = React.memo((props) => {
  const {
    state,
    unMount,
    dispatch,
    handleInputChange,
  } = props.application;

  const pathname = useLocation();
  const role_permissions = permissions.Permissions;

  React.useEffect(() => {
    document.title = 'Create Role';
    onMount();
    if (pathname.state && pathname.pathname === '/role/create' && permission(3001)) {
      document.title = 'Edit Role';
      const data = pathname.state;
      const parsedRoleData = data.data?.split(',').map((item) => item.trim()) || [];
      dispatch({ role_name: data.name });
      dispatch({ role_data: data.data }); 
      dispatch({ role_description: data.descriptions });
      dispatch({ role_status: data.status });
      dispatch({ role_permissions: parsedRoleData });
    }else if(pathname.pathname === "/role/create" && permission(3003)){
      document.title = 'create user' 
    }else{
        window.location.href = "/not-found";
    }
    return () => {
      unMount();
    };
    // eslint-disable-next-line
  }, []);

  async function onMount() {
    try {
      let response = await props.application.post({
        route: 'read',
        body: {
          table: 'roles',
          condition: { deleted: 0 },
        },
      });
      if (response.success) {
        dispatch({ role_lists: response.message });
      } else {
        dispatch({ role_lists: [] });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: 'Error failed to load roles.' });
      } else {
        console.error(error);
      }
    }
  }

  async function submit() {
    try {
      let response = await props.application.post({
        route: 'create',
        body: {
          table: 'roles',
          data: {
            name: state.role_name,
            data: state.role_data,
            descriptions: state.role_description,
            status: state.role_status,
            created_by: getInfo('user', 'id')
          },
        },
      });
      if (response.success) {
        dispatch({ notification: 'Successfully created role!' });
        window.location.reload();
      } else {
        dispatch({ notification: response.message + ' - Failed to create role' });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: 'Error failed to create role.' });
      } else {
        console.error(error);
      }
    }
  }

  async function update_roles() {
    try {
      let response = await props.application.post({
        route: 'update',
        body: {
          table: 'roles',
          condition: { id: pathname.state.id },
          data: {
            name: state.role_name,
            data: state.role_data,
            descriptions: state.role_description,
            status: state.role_status,
            updated_by: getInfo('user', 'id')
          },
        },
      });
      if (response.success) {
        dispatch({ notification: 'Successfully updated role!' });
        unMount();
        window.location.href = '/role/list';
      } else {
        dispatch({ notification: response.message });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: 'Error failed to update role.' });
      } else {
        console.error(error);
      }
    }
  }

  function validateForm(event) {
    event.preventDefault();
    const errors = [];
    if (!state.role_name) {
      errors.push('error');
      dispatch({ role_name_error: 'Role name is required' });
    }
    if (!state.role_data) {
      errors.push('error');
      dispatch({ role_data_error: 'Role data is required' });
    }
    if (!state.role_description) {
      errors.push('error');
      dispatch({ role_description_error: 'Description is required' });
    }
    if (!state.role_status) {
      errors.push('error');
      dispatch({ role_status_error: 'Status is required' });
    }
    if (errors.length === 0) {
      if (pathname.state) {
        update_roles();
      } else {
        submit();
      }
    }
  }

  function togglePermission(id) {
    try {
      const current = state.role_permissions || [];
      const idStr = String(id);
      let updated;
      if (current.includes(idStr)) {
        updated = current.filter((perm) => String(perm) !== idStr);
      } else {
        updated = [...current, idStr];
      }
      const uniquePermissions = [...new Set(updated)];
      dispatch({ role_permissions: uniquePermissions });
      dispatch({ role_data: uniquePermissions.join(',') });
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: 'Error caused while toggling permission: ' + error.message });
      } else {
        console.error(error);
      }
    }
  }

  function renderPermissionButtons() {
    const selected = state.role_permissions || [];
    return (
      <div className="d-flex flex-wrap gap-2">
        {role_permissions.map((perm, index) => {
          const isSelected = selected.includes(String(perm.id));
          return (
            <div key={index} className="">
              <button
                type="button"
                onClick={() => togglePermission(perm.id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-info'}`}
              >
                {perm.menu}-{perm.name}
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={validateForm}>
                <div className="row">
                  <div className="col-md-4 col-12">
                    <Input
                      type="text"
                      label="Role Name"
                      name="role_name"
                      value={state.role_name}
                      error={state.role_name_error}
                      onChange={handleInputChange}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="col-md-4 col-12">
                    <Textarea
                      type="text"
                      label="Description"
                      name="role_description"
                      value={state.role_description}
                      error={state.role_description_error}
                      onChange={handleInputChange}
                      placeholder="Enter role description"
                    />
                  </div>
                  <div className="col-md-4 col-12">
                    <Textarea
                      label="Role Data"
                      name="role_data"
                      value={state.role_data}
                      error={state.role_data_error}
                      onChange={handleInputChange}
                      placeholder="Enter role data"
                    />
                  </div>

                  <div className="col-md-12 col-12">
                    <label className="form-label"><strong>Select Role Permissions</strong></label>
                    {renderPermissionButtons()}
                  </div>

                  <div className="col-md-4 col-12">
                    <Select
                      name="role_status"
                      value={state.role_status}
                      onChange={handleInputChange}
                      label="Status"
                      error={state.role_status_error}
                    >
                      <Option value="" label="Select status" />
                      <Option value="active" label="Active" />
                      <Option value="inactive" label="Inactive" />
                    </Select>
                  </div>

                  <div className="col-12 d-flex justify-content-center">
                    <Button
                      className="btn btn-info"
                      loading={state.loading}
                      disabled={state.disabled}
                      title={pathname.state ? 'Update' : 'Save'}
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

export default RoleCreate;
