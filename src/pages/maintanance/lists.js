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
          route: 'read',
          body: {
            table: 'inventory',
            condition: { delated: 0 }
          }
        }),
        props.application.post({
          route: 'read',
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
        inventorys: inventoryRes.success ? inventoryRes.message : []
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
        map[dept.id] = dept.department_name
      })
    }
    return map
  }, [state.departments])

  /** Prepare data for datatable */
const inventory_filters = React.useMemo(() => {
  const departments = state.departments?.map(d => [d.id, d.name]) || [];
  const inventorys = state.inventory || [];
  //const users = Object.fromEntries(users);

  return inventorys?.map(inventory => ({
    ...inventory,

    id: inventory.id || 0,
    reported_department: departmentMap[inventory.reported_department] || "N/A",
    inspection_department_id: inventory.inspection_department_id || "N/A",
    inspection_status: inventory.inspection_status || "N/A",
    department_name: departmentMap[inventory.inspection_department_id] || "N/A",
    //inspector_name: usersMap[inventory.created_by] || "Unknown",
    role_id: inventory.role_id || "N/A",
    created_date: inventory.created_date,
  })) || [];
}, [state.department, state.inventory]);

  
  const columns = [
    {
      key: "id",
      text: "id",
      className: "center",
      align: "center",
      sortable: true,
    },
    {
      key: "created_department",
      text: "report",
      className: "center",
      align: "center",
      sortable: true,
    },
    { key: "item_name", text: "Name", className: "center", align: "center", sortable: true },
    { key: "descriptions", text: "Descriptions", className: "center", align: "center", sortable: true },
       {
      key: "user_department",
      text: "user",
      className: "center",
      align: "center",
      sortable: true,
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
          <Link state={record} to="/maintanance/create" className="edit" title="Edit">
            <Icon name="edit" type="round" />
          </Link>
          <Link
            to="#"
            className="delete"
            title="Delete"
            onClick={() => openDialog({ table: "inventory", id: record.id })}
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
                    records={inventory_filters}
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
