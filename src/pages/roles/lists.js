import React from 'react';
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
import { Icon } from "../../components/elements";
import ReactDatatable from '../../components/table';
import { permission, format_date, config } from '../../helpers/functions';

const RolesList = React.memo((props) => {
  const { state, dispatch, openDialog, updateDialogue, toggleComponent } = props.application;

  React.useEffect(() => {
    if (permission(3004)) {
      document.title = "Roles List";
      mount();
    } else {
      window.location.href = "/not-found";
    }
    // eslint-disable-next-line
  }, []);

  async function mount() {
    try {
      if (!permission(3004)) {
        dispatch({ roles: [], users: [], notification: 'Permission denied' });
        return;
      }
      dispatch({ loading: true });
      const [ rolesResp] = await Promise.all([
        //props.application.post({
        //route: 'read',
        //body: { table: 'users', condition: { delated: 0 } }
        //}),
        props.application.post({
          route: 'read',
          body: { table: 'roles', condition: { delated: 0 } }
        })
      ]);

      //dispatch({ users: usersResp.success ? usersResp.message : [] });
      dispatch({ roles: rolesResp.success ? rolesResp.message : [] });
      dispatch({ loading: false });
    } catch (error) {
      dispatch({ loading: false, notification: error.message || 'An error occurred' });
    }
  }

  // Memoize roles with formatted date
  const mapped_roles = React.useMemo(() => {
    if (!state.roles) return [];
    return state.roles.map(role => ({
      ...role,
      created_date: format_date(role.created_date),
      updated_date: format_date(role.updated_date),
      //created_by: role.created_by || 'N/A',
      status: role.status || 'inactive',
    }));
  }, [state.roles]);

  const columns = [
    { key: "id", text: "ID", className: "center", align: "center", sortable: true },
    { key: "name", text: "Name", className: "center", align: "center", sortable: true },
    {
      key: "descriptions",
      text: "Descriptions",
      className: "center",
      align: "center",
      sortable: true,
    },
    { key: "created_date", text: "created_date", className: "center", align: "center", sortable: true },
    { key: "updated_date", text: "updated_date", className: "center", align: "center", sortable: true },

    {
      key: "status",
      text: "Status",
      className: "center",
      align: "center",
      sortable: true,
      cell: record => (
        <label className={`badge rounded-pill ${record.status.toLowerCase() === "active" ? "bg-success" : "bg-warning"}`}>
          {record.status}
        </label>
      )
    },
    {
      key: "action",
      text: "Action",
      className: "center",
      width: 100,
      sortable: false,
      cell: record => (
        <div className="btn-group">
          {permission(3001) && <Link state={record} to="/role/create" className="edit"><Icon name="edit" type="round" /></Link>}
          {permission(3002) && <Link to="#" className="delete" onClick={() => openDialog({ table: "roles", id: record.id || record.id })}><Icon name="delete" type="round" /></Link>}
        </div>
      )
    }
  ];

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className='row'>
                  <ReactDatatable
                    config={config}
                    records={mapped_roles}
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
        text="Are you sure you want to delete this role?"
        action={updateDialogue}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default RolesList;
