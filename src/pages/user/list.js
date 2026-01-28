import React from 'react';
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
//import Bulk from "./bulk";
import { Button } from "../../components/button";
import { Icon } from "../../components/elements";
import ReactDatatable from '../../components/table';
//import { Select,Option } from "../../components/form"
import { config, getInfo, permission, padStart, format_date } from '../../helpers/functions';

const User_list = React.memo((props) => {
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
    if (permission(2005) || permission(2004)) {
      document.title = "User lists";
      mount();
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  async function mount() {
    try {
      // Prepare condition based on permission
      const condition = permission(2004) ? {} : { department_id: getInfo("user", "department_id") };
      dispatch({ loading: true });
      // Parallel fetching roles, users, departments
      const [roles, users, departments] = await Promise.all([
        props.application.post({
          route: 'read',
          body: {
            table: 'roles',
            condition: { delated: 0 },
            select: { name: "", id: "" }
          }
        }),
        props.application.post({
          route: 'read',
          body: {
            table: 'users',
            condition: {...condition }
          }
        }),
        props.application.post({
          route: 'read',
          body: {
            table: 'departments',
            condition: { delated: 0 }
          }
        }),
      ]);
      dispatch({ loading: false });
      // Update state based on fetch results
      dispatch({ roles: roles.success ? roles.message : [] });
      dispatch({ users: users.success ? users.message : [] });
      dispatch({ departments: departments.success ? departments.message : [] });
      //dispatch({ notification: roles.success && users.success && departments.success ? 'Found data' : 'No data found' });
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
  // Memoize processed users with departments and roles mapped
const mappedUsers = React.useMemo(() => {
  if (!state.users || !state.departments || !state.roles) return [];
  const departmentMap = Object.fromEntries(state.departments.map(d => [d.id, d.department_name]));
  const roleMap = Object.fromEntries(state.roles.map(r => [r.id, r.name]));
  return state.users.map(user => ({
    ...user,
    user_id:user.id,
    id: padStart(user.id, 3),
    department_name: departmentMap[user.department_id] || 'N/A',
    role_name: roleMap[user.role_id] || 'N/A',
    role_id: user.role_id || 'N/A',
    created_date: format_date(user.created_date),

  }));
}, [state.users, state.departments, state.roles]);

const filteredUsers = React.useMemo(() => {
  let users = mappedUsers;
  if (state.views === "active") {
    users = users.filter(user => user.status?.toLowerCase() === "active");
  } else if (state.views === "inactive") {
    users = users.filter(user => user.status?.toLowerCase() === "inactive");
  } else if (state.views === "delated") {
    users = users.filter(user => user.delated === 1 || user.status?.toLowerCase() === "delated");
  }else if (state.views === "All"){
    users = mappedUsers
  }
  return users;
}, [mappedUsers, state.views]);

  const columns = [
    { key: "id", text: "Id", className: "center", width: "50px", sortable: true, cell: record => record.id },
    { key: "full_name", text: "Name", className: "center", width: "200px", sortable: true },
    { key: "user_name", text: "user_name", className: "center", width: "200px", sortable: true },
    
    { key: "department_name", text: "Department", className: "center", width: "180px", sortable: true, cell: record => <span>{record.department_name}</span> },
    { key: "designation", text: "Designation", className: "center", width: "150px", sortable: true },
    { key: "phone_number", text: "Phone", className: "center", width: "120px", sortable: true },
    { key: "role_name", text: "Role", className: "center", width: "150px", sortable: true, cell: record => <span>{record.role_name}</span> },
    
    { key: "created_date", text: "Created Date", className: "center", width: "150px", sortable: true },
    {
      key: "status", 
      text: "Status", 
      className: "center", 
      width: "100px", 
      sortable: true, 
      cell: record => (
      <span 
           className = {`badge rounded-pill ${
        record.status?.toLowerCase() === "active"
          ? "bg-success"
          : record.status?.toLowerCase() === "inactive"
          ? "bg-warning"
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
          {permission(2001) && (
            <Link state={record} to="/user/create" 
              className="edit" 
              title="Edit">
              <Icon name="edit" type="round" />
            </Link>
          )}
          {permission(2002) && (
            <Link
              to="#"
              className="delete"
              title="Delete"
              onClick={() => openDialog({ table: "users", id: record.user_id })}
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
                  {
                  permission(32010) && (
                   <div className="d-flex align-items-center mb-0" 
                   style={{ paddingTop: "5px", paddingLeft: "5px" }}
                   >
                    <span className="me-2 fw-semibold">Users</span>
                   <select
                   name="views"
                   className="form-select"
                   value={state.views || "active"}
                   onChange={handleInputChange}
                   style={{ width: "70px" }}
                   label="Manager Users Views"
                   error={state.views_error}
                   >
                    <option key={"all"} value="all" label="All" />
                    <option key={"active"} value="active" label="Active" />
                    <option key={"inactive"} value="inactive" label="Inactive" />
                    <option key={"delated"} value="delated" label="Delated" />
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
                    records={filteredUsers}
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
        title="User Confirmation"
        text="Are you sure you want to delete this user?"
        action={() => updateDialogue()}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default User_list;
