/* require modules */
import React from 'react'
import { Input,Select,Option } from "../../components/form"
import { Button } from "../../components/button"
import {useLocation} from 'react-router-dom'
import {getInfo, time_now} from '../../helpers/functions'
//import {CustomChart} from "../../components/chart"
//import { Form, Input } from "../components/form"
//import {Table} from "../../components/table"
//import { Link } from 'react-router-dom'

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
      // defining document page title
       document.title = 'Create department'
      // component unmounting
      onMount()
      if (pathname.state && (pathname.pathname === "/department/create")) {
        // updating document page title
        document.title = 'Edit department'  
        // getting user from router state
          const data = pathname.state
          //console.log(data)
          //display data in the fields
          dispatch({ department_name : data.name })
          dispatch({ department_description : data.description })
          dispatch({ department_head : data.head })
          dispatch({ department_assistance : data.assistance })
          dispatch({ department_location:data.location })
          dispatch({ department_phone:data.phone_number })
          dispatch({ department_status : data.status })
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
      dispatch({ departments_lists : response.message })
    }else{
      dispatch({ departments_lists : [] })
    }
  } catch (error) {
    dispatch({ notification: error.message })
  }
  }

  //update departments
  async function update_departments(){
    try {
      let response = await props.application.post({
        route: 'update',
        body: {
            table: 'departments',
            condition:{id:pathname.state.id},
            data:{
              name:state.department_name,
              description:state.department_description,
              head:state.department_head,
              assistance:state.department_assistance,
              phone_number:state.department_phone,
              location:state.department_location,
              "updated_by": getInfo("user","user_name"),
              "updated_date": time_now,
              "status":state.department_status,
            }
        }
    })
    if(response.success){
      dispatch({ notification: "succsesfull update" })
      unMount()
      window.location.href = "/department/list"
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
      <Option value={user.user_name} label={user.full_name} key={index} />
  ))
   }    
    //validate departmrnts
function validateForm(event){
  try {
    // preventing form default submit
    event.preventDefault()
    // errors store
    const errors = []
    if (state.department_name === "") {
      errors.push("error")
      dispatch({ department_name_error: "department name required" })
    }
    if (state.department_description === "") {
      errors.push("error")
      dispatch({ department_description_error: "department description required" })
    }
    if (state.department_head === "") {
      errors.push("error")
      dispatch({ department_head_error: "department head required" })
    }
    if (state.department_assistance === "") {
      errors.push("error")
      dispatch({ department_assistance_error: "department assistance required" })
    }
    if (state.department_location === "") {
      errors.push("error")
      dispatch({ department_location_error: "department location required" })
    }
    if (state.department_phone === "") {
      errors.push("error")
      dispatch({ department_phone_error: "department phone required" })
    }
    if (state.department_status === "") {
      errors.push("error")
      dispatch({ department_status_error: "department status required" })
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
            table: 'departments',
            data:{
              name:state.department_name,
              description:state.department_description,
              head:state.department_head,
              assistance:state.department_assistance,
              phone_number:state.department_phone,
              location:state.department_location,
              created_date:time_now,
              created_by:getInfo("user","user_name"),
              status:state.department_status,
            }
        }
    })
    if (response.success){
      dispatch({ project : response.message })
      dispatch({notification: 'successfull create data!!'})
      //unMount()
      window.location.reload();
    }else{
      dispatch({notification: response.message+'not create data!!'})
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
      <form className="form">
        <div className = "row">
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Input
              type="text"
              label="department_name"
              name="department_name"
              value={state.department_name}
              error={state.department_name_error}
              onChange={handleInputChange}
               placeholder="Enter department name"
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Input
               type="text"
               label="department_description"
               name="department_description"
               value={state.department_description}
               error={state.department_description_error}
               onChange={handleInputChange}
               placeholder="Enter department description "
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="">
              <Select
                className="choices"
                multiple=""
                name="department_head"
                value={state.department_head ? state.department_head : ""}
                onChange={handleInputChange}
                label="department_head"
                error={state.department_head_error}>
                <Option value={""} label="select department head" defaultValue={""} />
                   {users_rander()}
              </Select>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Select
                name="department_assistance"
                value={state.department_assistance ? state.department_assistance : ""}
                onChange={handleInputChange}
                label="department_assistance"
                error={state.department_assistance_error}>
                  <Option value={""} label="select department_assistance" defaultValue={""} />
                   {users_rander()}
              </Select>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Input
              type="text"
              label="department_location"
              name="department_location"
              value={state.department_location}
              error={state.department_location_error}
              onChange={handleInputChange}
              placeholder="Enter department location "
              />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Input
               type="text"
               label="department_phone"
               name="department_phone"
               value={state.department_phone}
               error={state.department_phone_error}
               onChange={handleInputChange}
               placeholder="Enter department phone "
               />
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="form-group">
              <Select
                name="department_status"
                value={state.department_status ? state.department_status : ""}
                onChange={handleInputChange}
                label="department_status"
                error={state.department_status_error}>
                  <Option value={""} label="select department status" defaultValue={""} />
                  <Option value={"active"} label={"active"}  />
                  <Option value={"inactive"} label={"inactive"}  />
                  <Option value={"blocked"} label={"blocked"}  />
              </Select>
            </div>
          </div>
          <div className="col-12 d-flex justify-content-center">
            <Button
             className="btn btn-info"
             loading={state.loading}
             disabled={state.disabled}
             title={pathname.state?"Edit":"Save"}
             onClick={pathname.state?update_departments:validateForm}
            />
          </div>
        </div>
      </form>
      </>

    )
})

/* export memorized create department component */
export default Api