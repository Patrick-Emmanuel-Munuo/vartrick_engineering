/* require modules */
import React from 'react'
import { Link } from "react-router-dom"
import Dialog from "../../components/dialog"
import { Icon } from "../../components/elements"
import ReactDatatable from '../../components/table';
import { config, getInfo } from '../../helpers/functions'

/* create a function component */
const MorningInspectionReport = React.memo((props) => {
    const {
        state,
        openDialog,
        updateDialogue,
        dispatch,
        toggleComponent
    } = props.application

    React.useEffect(() => {
        mount()
        return () => {
            document.title = "Morning Inspection Report"
        }
    }, [])

    async function mount() {
        try {
            let response = await props.application.post({
                route: 'mysql/read',
                body: {
                    table: 'morning_inspections',
                    condition: { 
                      delated: 0, 
                      department_id: getInfo("user", "department_id") 
                    }
                }
            })

            let result = await props.application.post({
                route: 'mysql/read',
                body: {
                    table: 'departments',
                    condition: { delated: 0 }
                }
            })
            let result2 = await props.application.post({
                route: 'mysql/read',
                body: {
                    table: 'users',
                    condition: { delated: 0 }
                }
            })
            dispatch({ users: result2.success ? result2.message : []})
            dispatch({departments: result.success ? result.message : [] })
            dispatch({ morning_inspections: response.success ? response.message : []})
            dispatch({ notification: response.success ? null : 'No inspection reports found' })
        } catch (error) {
            dispatch({
                notification: error instanceof Error ? error.message : 'Unexpected error'
            })
        }
    }

    var columns = [
        {
            key: "department_id",
            text: "report",
            className: "center",
            align: "center",
            sortable: true,
            cell: record => {
              return state.departments ?<label>{state.departments.find(dep => dep.unique_id === record.department_id)?.name || 'N/A'}</label>:<label>N/A</label>
            }
        },
        {
            key: "reported_department",//created_department
            text: "user",
            className: "center",
            align: "center",
            sortable: true,
            cell: record => {
              return state.departments ?<label>{state.departments.find(dep => dep.unique_id === record.reported_department)?.name || 'N/A'}</label>:<label>N/A</label>
            }
        },
        {
            key: "created_by",
            text: "Inspector",
            className: "center",
            align: "center",
            sortable: true,
            cell: record => {
              return state.users ?<label>{state.users.find(dep => dep.unique_id === record.created_by)?.full_name || 'N/A'}</label>:<label>N/A</label>
            }
        },
        {
            key: "created_date",
            text: "Date",
            className: "center",
            align: "center",
            sortable: true
        },
        {
            key: "inspected_name",
            text: "inspected_name",
            className: "center",
            align: "center",
            sortable: true
        },
        {
            key: "technical_finding",
            text: "technical_finding",
            className: "center",
            align: "center",
            sortable: true
        },
        {
            key: "comments",
            text: "comments",
            className: "center",
            align: "center",
            sortable: true
        },
        {
            key: "recommendations",
            text: "recommendations",
            className: "center",
            align: "center",
            sortable: true
        },
        {
            key: "status",
            text: "Status",
            className: "center",
            align: "center",
            sortable: true,
            cell: record => (
             <label className={`bg bg-pill ${record.status?.toLowerCase() === "ok" ? "bg-success" : "bg-warning"}`}>
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
                    <div className='btn-group'>
                        <Link state={record} to="/maintanance/morning-inspection" className="edit" title="Edit"><Icon name="edit" type="round" /></Link>
                        <Link onClick={() => openDialog({ table: "morning_inspections", unique_id: record.unique_id })} to="#" className="delete" title="Delete"><Icon name="delete" type="round" /></Link>
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
                                <div className='row responsive-table'>
                                    <ReactDatatable
                                        config={config}
                                        records={state.morning_inspections}
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
                text={`Are you sure you want to delete this inspection report?`}
                action={() => updateDialogue()}
                toggleDialog={toggleComponent}
            />
        </>
    )
})

/* export component */
export default MorningInspectionReport
