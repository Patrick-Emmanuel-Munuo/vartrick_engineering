import React from 'react';
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
import { Icon } from "../../components/elements";
import ReactDatatable from '../../components/table';
import {permission, config, getInfo} from '../../helpers/functions'
//import { checkPermission } from '../../helpers/permissions'; // Import the checkPermission function



const List = React.memo((props) => {
  // destructuring global variables
  const {
    state,
    openDialog,
    updateDialogue,
    dispatch,
    toggleComponent,
     // Assuming this is part of the global state or props
  } = props.application;

 React.useEffect(() => {
    if (permission(1004)) { // Replace this with actual permission check if necessary
      document.title = "Departments List";
      mount();
    } else {
      window.location.href = "/not-found";
    }
  }, []);

  async function mount() {
    try {
     if(permission){
      //var request = permission(2004)?{}:{department_id: (getInfo("user","department_id"))}
      let response2 = await props.application.post({
            route: 'mysql/read',
            body: {
                table: 'users',
                condition:{
                  delated:0,
                 // ...request
                }
            }
        })
        if (response2.success){
          dispatch({ users : response2.message })
        }else{
          dispatch({ users : [] })
        }
      let response = await props.application.post({
        route: 'mysql/read',
        body: {
          table: 'departments',
          condition: { delated: 0 }
        }
      });
      if (response.success) {
        dispatch({ departments: response.message });
      } else {
        dispatch({ departments: [] });
      }
     }else{
      dispatch({ departments: [] });
      dispatch({ users: [] });
      dispatch({ notification: 'permission denied' });
     }

    } catch (error) {
      dispatch({ notification: error.message || 'An error occurred' });
    }
  }

  var columns = [
    {
      key: "id",
      text: "id",
      className: "center",
      align: "center",
      sortable: true,
    },
    {
      key: "name",
      text: "Name",
      className: "center",
      align: "center",
      sortable: true,
    },
    {
      key: "head",
      text: "Head",
      align: "center",
      className: "center",
      sortable: true,
      cell: record => {
      const user = state.users?.find(d => d.unique_id === record.head)
      return <label>{user ? user.full_name : 'N/A'}</label>
     }
    },
    {
      key: "assistance",
      text: "Assistance",
      className: "center",
      align: "center",
      sortable: true,
      cell: record => {
      const user = state.users?.find(d => d.unique_id === record.assistance)
      return <label>{user ? user.full_name : 'N/A'}</label>
     }
    },
    {
      key: "phone_number",
      text: "Phone",
      className: "center",
      sortable: true,
      align: "center"
    },
    {
      key: "location",
      text: "Location",
      className: "center",
      sortable: true,
      align: "center"
    },
    {
    key: "status",
    text: "Status",
    className: "center",
    sortable: true,
    align: "center",
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
      width: 80,
      align: "center",
      sortable: false,
      cell: record => {
        return (
            <div className="btn-group">
              {permission(1001) && (
                <Link state={record} to="/department/create" className="edit" title="Edit" data-toggle="tooltip">
                  <Icon name="edit" type="round" />
                </Link>
              )}
              {permission(1002) && (
                <Link state={record} to="#" className="delete" title="Delete" onClick={() => openDialog({ table: "departments", unique_id: record.unique_id })} data-toggle="tooltip">
                  <Icon name="delete" type="round" />
                </Link>
              )}
            </div>
        );
      }
    }
  ];

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className='row responsive-table'>
                  <ReactDatatable
                    config={config}
                    records={state.departments}
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
        text={`Are you sure you want to delete this data?`}
        action={() => updateDialogue()}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default List;
