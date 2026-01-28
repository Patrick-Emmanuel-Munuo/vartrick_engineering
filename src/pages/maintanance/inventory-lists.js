import React, { Fragment } from 'react'
import { Link } from "react-router-dom"
import Dialog from "../../components/dialog"
import { Icon } from "../../components/elements"
import ReactDatatable from '../../components/table'
import { config, getInfo } from '../../helpers/functions'

const InventoryList = React.memo((props) => {
  const {
    state,
    openDialog,
    updateDialogue,
    dispatch,
    toggleComponent
  } = props.application

  // Set document title on mount
  React.useEffect(() => {
    document.title = "Inventory Lists"
    mount()
    // eslint-disable-next-line
  }, [])

  async function mount() {
    try {
      dispatch({ loading: true })
      const userDeptId = getInfo("user", "department_id")

      const [inventoryRes, deptRes] = await Promise.all([
        props.application.post({
          route: 'mysql/read',
          body: {
            table: 'inventory',
            condition: { delated: 0 }
          }
        }),
        props.application.post({
          route: 'mysql/read',
          body: {
            table: 'departments',
            condition: { delated: 0 }
          }
        })
      ])

      dispatch({
        departments: deptRes.success ? deptRes.message : []
      })

      dispatch({
        inventory: inventoryRes.success ? inventoryRes.message : []
      })

      if (!deptRes.success) {
        dispatch({ notification: 'No departments found.' })
      }

      if (!inventoryRes.success) {
        dispatch({ notification: 'No inventory items found.' })
      }
    } catch (error) {
      dispatch({
        notification: error instanceof Error ? error.message : "Unexpected error"
      })
    } finally {
      dispatch({ loading: false })
    }
  }

  // Create a department ID to name map for fast lookup
  const departmentMap = React.useMemo(() => {
    const map = {}
    if (state.departments) {
      state.departments.forEach(dept => {
        map[dept.unique_id] = dept.name
      })
    }
    return map
  }, [state.departments])

  const columns = [
    {
      key: "id",
      text: "id",
      className: "center",
      align: "center",
      sortable: true,
      cell: record => record.id ? String(record.id).padStart(5, '0') : 'N/A'
    },
    {
      key: "created_department",
      text: "report",
      className: "center",
      align: "center",
      sortable: true,
      cell: record => (
        <label>{departmentMap[record.created_department] || "Unknown"}</label>
      )
    },
    { key: "item_name", text: "Name", className: "center", align: "center", sortable: true },
    { key: "descriptions", text: "Descriptions", className: "center", align: "center", sortable: true },
       {
      key: "user_department",
      text: "user",
      className: "center",
      align: "center",
      sortable: true,
      cell: record => (
        <label>{departmentMap[record.user_department] || "Unknown"}</label>
      )
    },
    { 
      key: "location", 
      text: "Location", 
      className: "center", 
      align: "center", 
      sortable: true 
    },
    { key: "specifications", 
      text: "Specifications", 
      className: "center", 
      align: "center", 
      sortable: true 
    },
    { 
      key: "active", 
      text: "Active", 
      className: "center", 
      align: "center", 
      sortable: true 
    },
    { key: "inactive", 
      text: "Inactive", 
      className: "center", 
      align: "center", 
      sortable: true 
    },
    { key: "next_ppm", 
      text: "Next_PPM", 
      className: "center", 
      align: "center", 
      sortable: true,
      cell: record => record.next_ppm ? record.next_ppm : 'N/A'
    },
    { key: "status", 
      text: "Status", 
      className: "center", 
      align: "center", 
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
      width: 100,
      align: "center",
      sortable: false,
      cell: record => (
        <div className="btn-group">
          <Link state={record} to="/maintanance/inventory" className="edit" title="Edit">
            <Icon name="edit" type="round" />
          </Link>
          <Link
            to="#"
            className="delete"
            title="Delete"
            onClick={() => openDialog({ table: "inventory", unique_id: record.unique_id })}
          >
            <Icon name="delete" type="round" />
          </Link>
        </div>
      )
    }
  ]

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row responsive-table">
                  <ReactDatatable
                    config={config}
                    records={state.inventory}
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
  )
})

export default InventoryList
