/* require modules */
import React from 'react'
//import { Input } from "../../components/form"
//import { Button } from "../../components/button"
//import { Link } from 'react-router-dom'
//import ReactDatatable from '../../components/table';

/* create a function component */
const List = React.memo((props) => {
     var header = [ "#","receiver","user_name","text","phone_number","sender","time","status","action"]
   
    // destructuring global variables
    const {
      state,
      //unMount,
      //getRelativeTime,
      dispatch,
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
        document.title = "Message lists"
        //unMount()
      }
      //{ dispatch({projects:[ ]}) }
      
      // eslint-disable-next-line
  }, [])

  async function mount() {
    try {
        let response = await props.application.post({
            route: 'list-all',
            body: {
                table: 'message',
            }
        })
        //console.log(response.message)
        if (response.success){
          dispatch({notification: 'found data!!'})
          dispatch({messages:response.message})
        }else{
          dispatch({notification: response.message+' not found data!!'})
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
    function renderUsers(){
      try {
          return state.messages.map((data, index) => (
                <tr key={index}>
                    <td className='center' >{index + 1}</td>
                    <td className='center' >{data.receiver}</td>
                    <td className='center' ><a href={`tel:${data.receiver}`}>{data.receiver}</a></td>
                    <td className='center' >{data.text}</td>
                    <td className='center' >{data.receiver}</td>
                    <td className='center'>{data.sender}</td>
                    <td className='center' >{data.created_date}</td>
                    <td className='center' >{data.status}</td>
                    <td className='center' >{data.status}</td>

                </tr>
          ))
      } catch (error) {
        dispatch({notification: error.message})
      }
      // eslint-disable-next-line
  }

    return (
      <>
      {/*
        <div className='action-button'>
          <button className ="primary" onClick={() => jsonToExcell({data:state.projects,name:"projects_lists"})}>Excell</button>
          <button className ="warning">Pdf</button>
          <button className ="error" onclick={mount}>Csv</button>
      </div>*/
      }
      
    <div className='responsive-table'>
      <table>
        <thead className='text-center'>
          <tr>{ header?header.map((head,id) => <th key={id}>{head}</th>):null }</tr>
        </thead>
        <tbody>
          {renderUsers()}
        </tbody>
      </table>
    </div>
    <section className="dashboard">
      <div className="row">
      </div>
    </section>
      </>

    )
})

/* export memorized Login component */
export default List