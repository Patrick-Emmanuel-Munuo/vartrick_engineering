import React from 'react';
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
import { Icon } from "../../components/elements";
import ReactDatatable from '../../components/table';
import { config, format_date, permission } from '../../helpers/functions';

const List = React.memo((props) => {
  const {
    state,
    openDialog,
    updateDialogue,
    dispatch,
    toggleComponent,
  } = props.application;

  React.useEffect(() => {
    if (permission(1004)) { // Permission to view departments
      document.title = "Departments List";
      mount();
    } else {
      window.location.href = "/not-found";
    }
    // eslint-disable-next-line
  }, []);

  async function mount() {
    try {
      const [users, departments] = await Promise.all([
        props.application.post({
          route: 'read',
          body: { table: 'users', condition: {delated: 0 } }
        }),
        props.application.post({
          route: 'read',
          body: { table: 'departments', condition: { delated: 0 } }
        }),
      ]);
      dispatch({ users: users.success ? users.message : [] });
      dispatch({ departments: departments.success ? departments.message : [] });
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }

  // Map departments with users (head, assistance) to display their names
const mappedDepartments = React.useMemo(() => {
  if (!state?.departments?.length || !state?.users?.length) return [];
  return state.departments.map(dept => {
    const hod = state.users.find(u => u.id === dept?.hod);
    const assist_hod = state.users.find(u => u.id === dept?.assist_hod);
    return {
      ...dept,
      //id: dept?.id ?? 'N/A',
      hod_name: hod?.full_name ?? 'N/A',
      assist_hod_name: assist_hod?.full_name ?? 'N/A',
      created_date:  format_date(dept?.created_date) || 'N/A',
    };
  });
}, [state.departments, state.users]);


  const columns = [
    {
      key: "department_code",
      text: "dept code",
      className: "center",
      width: "100px",
      sortable: true,
    },
    {
      key: "department_name",
      text: "dept name",
      className: "center",
      width: "160px",
      sortable: true,
    },
    {
      key: "hod_name",
      text: "Head",
      className: "center",
      width: "180px",
      sortable: true,
    },
    {
      key: "assist_hod_name",
      text: "Assistance",
      className: "center",
      width: "180px",
      sortable: true,
    },
    {
      key: "phone",
      text: "Phone",
      className: "center",
      width: "120px",
      sortable: true,
    },
    {
      key: "location",
      text: "Location",
      className: "center",
      width: "150px",
      sortable: true,
    },
    {
      key: "created_date",
      text: "created_date",
      className: "center",
      width: "150px",
      sortable: true,
    },    

    {
      key: "status",
      text: "Status",
      className: "center",
      width: "100px",
      sortable: true,
      cell: record => (
        <label className={`bg bg-pill ${record.status?.toLowerCase() === "active" ? "bg-success" : "bg-warning"}`}>
          {record.status || "N/A"}
        </label>
      )
    },
    {
      key: "action",
      text: "Action",
      className: "center",
      sortable: false,
      cell: record => (
        <div className="btn-group">
          {permission(1001) && (
            <Link
              state={record}
              to="/department/create"
              className="edit"
              title="Edit"
              data-toggle="tooltip"
            >
              <Icon name="edit" type="round" />
            </Link>
          )}
          {permission(1002) && (
            <Link
              to="#"
              className="delete"
              title="Delete"
              onClick={() => openDialog({ table: "departments", id: record.id })}
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
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="responsive-table">
                  <ReactDatatable
                    config={config}
                    records={mappedDepartments}
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
        text="Are you sure you want to delete this data?"
        action={() => updateDialogue()}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default List;
