/* require modules */
import React from 'react'
import { Input,Select,Option } from "../../components/form"
import { Button } from "../../components/button"
import {useLocation} from 'react-router-dom'
import {getInfo} from '../../helpers/functions'

/* create a function component */
const Api = React.memo((props) => {
    // destructuring global variables
    const {
      state,
      unMount,
      dispatch,
      //jsonToExcell,
      //handleFileChange,
     handleInputChange,
  } = props.application

  const pathname = useLocation()
  // component mounting
    React.useEffect(() => {
      // defining document page title
       document.title = 'Create maintanance'
      // component unmounting
      onMount()
      if (pathname.state && (pathname.pathname === "/maintanance/create")) {
        // updating document page title
        document.title = 'Edit maintanance'  
        // getting user from router state
        //console.log({pass:pathname})
          const data = pathname.state
          dispatch({ job_department_name : data.department })
          dispatch({ job_descriptions : data.descriptions })
          dispatch({ job_location : data.location })
          dispatch({ job_instrument : data.instrument })
          dispatch({ job_assigned_to:data.asigned_to })
          dispatch({ job_instrument : data.instrument })
          dispatch({ job_emergency : data.emergency })
          //
      }
      return () => {
        unMount()
      }

      // eslint-disable-next-line
  }, [])
  async function onMount(){
    try {
    let response = await props.application.post({
        route: 'read',
        body: {
            table: 'departments',
            condition:{delated:0}
        }
    })
    let result = await props.application.post({
      route: 'read',
      body: {
          table: 'users',
          condition:{delated:0}
      }
  })
  if(result.success){ 
    dispatch({ users : result.message })
  }else{
    dispatch({ users : [] })
  }
  if(response.success){
    dispatch({ departments : response.message })
  }else{
    dispatch({ departments : [] })
  }
  } catch (error) {
    dispatch({ notification: error.message })
  }
  }

  //update update_jobs
  async function update_jobs(){
    try {
      let response = await props.application.post({
        route: 'update',
        body: {
            table: 'jobs',
            condition:{id:pathname.state.id},
            data:{
              assigned_to:state.job_assigned_to,
              department_id:state.job_department_name,
              descriptions:state.job_descriptions,
              emergency:state.job_emergency,
              instrument:state.job_intrument,
              location:state.job_location,
              //status:"active",
              "updated_by": getInfo("user","user_name"),
              //"updated_date": time_now,
              "status":state.department_status,
            }
        }
    })
    if(response.success){
      dispatch({ notification: "sucsesfull update" })
      unMount()
    }else{
      dispatch({ notification: response.message })
    }
    } catch (error) {
      if (error instanceof Error){
        dispatch({ notification: error.message })
        }else{
          console.error(error)
        }
      }
    }


    // rendering users
   function users_rander(){
    return state.users.map((user, index) => (
      <Option value={user.id} label={user.full_name} key={index} />
     ))
   } 
   //rander departments
   function rander_departments(){
    return state.departments.map((data, index) => (
      <Option value={data.id} label={data.name} key={index} />
     ))
   } 
   
    //validate departmrnts
function validateForm(event){
  try {
    // preventing form default submit
    event.preventDefault()
    // errors store
    const errors = []
    if (state.job_department_name === "") {
      errors.push("error")
      dispatch({ job_department_name_error: "department name required" })
    }
    if (state.job_descriptions === "") {
      errors.push("error")
      dispatch({ job_descriptions_error: "job description required" })
    }
    if (state.job_location === "") {
      errors.push("error")
      dispatch({ job_location_error: "job location required" })
    }
    if (state.job_intrument === "") {
      errors.push("error")
      dispatch({ job_intrument_error: "instrument /imfrastructure required" })
    }
    // checking if there's no error occured
    if (errors.length === 0){
      submit()
     }
} catch (error) {
    if (error instanceof Error){
      dispatch({ notification: error.message })
      }else{
        console.error(error)
      }
}
}
async function submit(){
  try {
    let response = await props.application.post({
        route: 'create',
        body: {
            table: 'jobs',
            data:{
              department_id:state.job_department_name,
              descriptions:state.job_descriptions,
              emergency:(state.job_emergency===1)?1:0,
              instrument:state.job_intrument,
              location:state.job_location,
              //created_date:time_now,
              created_by:getInfo("user","user_name"),
              status:"active",
              delated:0
            }
        }
    })
    if (response.success){
      dispatch({notification: 'successfull create data!!'})
      unMount()
      window.location.reload();
    }else{
      dispatch({notification: response.message+' not create data!!'})
    }
} catch (error) {
    if (error instanceof Error){
      dispatch({ notification: error.message })
      }else{
        console.error(error)
      }
}
}
    return (
      <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
              <form className="form">
        <div className = "row">
          <div className="col-md-6 col-12">
            <div className="form-group">
            <Select
              name="job_department_name"
              value={state.job_department_name ? state.job_department_name : ""}
              onChange={handleInputChange}
              label="name"
              error={state.job_department_name_error}>
                <Option value={""} label="select department" defaultValue={""} />
                {rander_departments()}
            </Select>
            </div>
          </div>
          {/*
          <div className="col-md-6 col-12">
            <div className="form-group">
            <Select
              name="job_assigned_to"
              value={state.job_assigned_to ? state.job_assigned_to : ""}
              onChange={handleInputChange}
              label="job assigned to"
              error={state.job_assigned_to_error}>
                <Option value={""} label="select user to assigned job" defaultValue={""} />
                {users_rander()}
            </Select>
            </div>
          </div>*/}
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Input
                type="text"
                label="job location"
                name="job_location"
                value={state.job_location}
                error={state.job_location_error}
                onChange={handleInputChange}
                placeholder="Enter job location "
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
            <Input
                type="text"
                label="instrument/infrastructure"
                name="job_instrument"
                value={state.job_instrument}
                error={state.job_instrument_error}
                onChange={handleInputChange}
                placeholder="Enter name of instrument "
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
            <Input
                type="text"
                label="job request details"
                name="job_descriptions"
                value={state.job_descriptions ? state.job_descriptions : ""}
                error={state.job_descriptions_error}
                onChange={handleInputChange}
                placeholder="Enter job descriptions "
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
            <Select
              name="job_emergency"
              value={state.job_emergency ? state.job_emergency : ""}
              onChange={handleInputChange}
              label="job_emergency"
              error={state.job_emergency_error}>
                <Option value={0} label="select emergence status" defaultValue={""} />
                <Option value={1} label={"emergency"} defaultValue={""} />
                <Option value={0} label={"not emergency"} defaultValue={""} />
            </Select>
            </div>
          </div>

          <div className="col-md-6 col-12">
            <div className="form-group">
              
            </div>
          </div>

          <div className="col-12 d-flex justify-content-center">
            <Button
              className="btn btn-info"
              loading={state.loading}
              disabled={state.disabled}
              title={pathname.state?"Edit":"Save"}
              onClick={pathname.state?update_jobs:validateForm}
             />
          </div>
        </div>
      </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>

    )
})

/* export memorized Login component */
export default Api