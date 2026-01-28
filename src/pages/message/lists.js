/* require modules */
import React,{Fragment } from 'react'
import { Link } from "react-router-dom"
import Dialog from "../../components/dialog"
import { Icon } from "../../components/elements"
import ReactDatatable from '../../components/table';
import {config} from '../../helpers/functions'


/* create a function component */
const List = React.memo((props) => {
    // destructuring global variables
    const {
      state,
      //unMount,
      openDialog,
      updateDialogue,
      dispatch,
      toggleComponent
      ///jsonToExcell,
      //format,
      //date
     // handleInputChange,
  } = props.application
  // component mounting
    React.useEffect(() => {
      // defining document page title
      //document.title = "project lists"
      // initializing component data
      mount()
      // component unmounting
      return () => {
        document.title = "Departments lists"
        //unMount()
      }
      //{ dispatch({projects:[ ]}) }
      
      // eslint-disable-next-line
  }, [])





  async function mount() {
    try {
        let response = await props.application.post({
            route: 'read',
            body: {
                table: 'departments',
                condition:{delated:0}
            }
        })
        if (response.success){
          dispatch({departments:response.message})
        }else{
          dispatch({notification:'not found departiments'})
        }
    } catch (error) {
        if (error instanceof Error){
          dispatch({ notification: error.message })
          }else{
            console.error(error)
          }
    }
}


  
  var columns = [
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
        sortable: true
    },
    {
        key: "assistance",
        text: "assistance",
        className: "center",
        align: "center",
        sortable: true
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
      text: "location",
      className: "center",
      sortable: true,
      align: "center"
    },
    {
      key: "status",
      text: "status",
      className: "center",
      sortable: true,
      align: "center",
      cell: record => {
        return (
          <Fragment>
            {
              record.status?
               (record.status==="active" || record.status === "Active")?
                 <label className = "bg bg-pill bg-success">{record.status}</label>
                :
                <label className = "bg bg-pill bg-warning">{record.status}</label> 
              :
              <label className = "bg bg-pill bg-danger">null</label>
            }
          </Fragment>
        )
      }
      //badge rounded-pill bg-success
    },
    {
        key: "action",
        text: "action",
        className: "center",
        width: 100,
        align: "center",
        sortable: false,
        cell: record => { 
            return (
                <Fragment>
                  <div>
                  <Link state={record} to="/department/create" className="edit" title="Edit" data-toggle="tooltip"><Icon name="edit" type="round" /></Link>
                  <Link state={record} to="#" className="delete" title="delete" onClick={() => openDialog({table:"departments",id:record.id})} data-toggle="tooltip"><Icon name="delete" type="round" /></Link>
                  </div> 
                </Fragment>
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
        text={`Are you sure you what to delete this data`}
        action={()=>updateDialogue()}
        toggleDialog={toggleComponent}
    />
      </>

    )
})

/* export memorized departments component */
export default List