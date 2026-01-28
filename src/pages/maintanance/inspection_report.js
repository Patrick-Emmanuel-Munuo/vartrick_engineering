/* Required modules */
import React, { useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Dialog from "../../components/dialog";
import { Icon } from "../../components/elements";
import ReactDatatable from "../../components/table";
import { config, getInfo } from "../../helpers/functions";
import { Form, Select, Option, Input } from "../../components/form";
import { Button } from "../../components/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* Morning Inspection Report Component */
const MorningInspectionReport = React.memo(({ application }) => {
  const {
    state,
    openDialog,
    updateDialogue,
    dispatch,
    handleInputChange,
    toggleComponent,
    post,
  } = application;

  /** Set page title and fetch initial data */
  useEffect(() => {
    document.title = "Morning Inspection Report";
        //initial load and rander today 
    dispatch({ time_range: "today" });
    fetchInitialData();
    // eslint-disable-next-line
  }, []);

  /** Fetch inspections, departments, and users */
  async function fetchInitialData() {
    try {
      const [inspectionsRes, departmentsRes, usersRes] = await Promise.all([
        post({
          route: "read",
          body: {
            table: "inspections",
            condition: {
              delated: 0,
              reported_department: getInfo("user", "department_id"),
            },
          },
        }),
        post({
          route: "read",
          body: { 
            table: "departments", 
            condition: {
               delated: 0
              } 
            },
        }),
        post({
          route: "read",
          body: { 
            table: "users", 
            condition: { 
              delated: 0 
            } 
          },
        }),
      ]);
      dispatch({ loading: false });
      dispatch({ users: usersRes.success ? usersRes.message : [] });
      dispatch({ departments: departmentsRes.success ? departmentsRes.message : [] });
      dispatch({
        morning_inspections: inspectionsRes.success ? inspectionsRes.message : [],
      });
      dispatch({
        notification: inspectionsRes.success
          ? null
          : "No inspection reports found",
      });
    } catch (error) {
      dispatch({
        notification:
          error instanceof Error ? error.message : "Unexpected error occurred",
      });
    }
  }

  /** Extended Input Handler for Time Range */
  const handleInputChangeExtended = (e) => {
    const { name, value } = e.target;
    if (name !== "time_range") {
      handleInputChange(e);
      return;
    }

    let start = "";
    let end = "";
    const today = new Date();

    switch (value) {
      case "today":
        start = end = today.toISOString().split("T")[0];
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        start = end = yesterday.toISOString().split("T")[0];
        break;
      case "week":
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay());
        start = firstDayOfWeek.toISOString().split("T")[0];
        end = today.toISOString().split("T")[0];
        break;
      case "month":
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        start = firstDayOfMonth.toISOString().split("T")[0];
        end = today.toISOString().split("T")[0];
        break;
      case "last_month":
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        start = firstDayLastMonth.toISOString().split("T")[0];
        end = lastDayLastMonth.toISOString().split("T")[0];
        break;
      case "year":
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        start = firstDayOfYear.toISOString().split("T")[0];
        end = today.toISOString().split("T")[0];
        break;
      default:
        break;
    }
    dispatch({ time_range: value, start_date: start, end_date: end });
  };

  /** Search inspections between dates */
  async function searchInspectionsBetween(options) {
    if (!state.start_date || !state.end_date) {
      dispatch({ notification: "Please select both start and end dates." });
      return;
    }
    try {
      const result = await post({
        route: "search_between",
        body: {
          table: "inspections",
          condition: { delated: 0 },
          start: `${state.start_date}T00:00:00`,
          end: `${state.end_date}T23:59:59`,
          column: "created_date",
        },
      });
      dispatch({ morning_inspections: result.success ? result.message : [] });
      dispatch({ notification: result.success ? "Search completed" : "No records found at the given range" });
    } catch (error) {
      dispatch({ notification: error.message });
    }
  }

  /** Prepare data for datatable */
const morning_inspections_filters = React.useMemo(() => {
  const departments = state.departments?.map(d => [d.id, d.name]) || [];
  const users = state.users?.map(u => [u.id, u.full_name]) || [];
  const inspections = state.morning_inspections || [];
  const departmentMap = Object.fromEntries(departments);
  const usersMap = Object.fromEntries(users);

  return inspections?.map(insp => ({
    ...insp,
    user_id: insp.id,
    id: insp.id || 0,
    reported_department: departmentMap[insp.reported_department] || "N/A",
    inspection_department_id: insp.inspection_department_id || "N/A",
    inspection_status: insp.inspection_status || "N/A",
    department_name: departmentMap[insp.inspection_department_id] || "N/A",
    inspector_name: usersMap[insp.created_by] || "Unknown",
    role_id: insp.role_id || "N/A",
    created_date: insp.created_date,
  })) || [];
}, [state.morning_inspections, state.departments, state.users]);

  /** Print PDF */


  /** Render dropdown options */
  const renderInspectionOptions = () =>
    morning_inspections_filters?.map((insp) => (
      <Option
        key={insp?.id}
        value={insp?.id?.toString() || ""}
        label={`${insp?.inspected_name} - ${insp?.inspection_department_id}`}
      />
    ));

  /** Datatable columns */
  const columns = [
    { key: "id", text: "id", align: "center", sortable: true },
    { key: "department_name", text: "Department", align: "center", sortable: true },
    { key: "reported_department", text: "Reported Dept.", align: "center", sortable: true },
    { key: "inspector_name", text: "Inspector", align: "center", sortable: true },
    { key: "created_date", text: "Inspected Date", align: "center", sortable: true, cell: (r) => new Date(r.created_date).toLocaleString() },
    { key: "inspected_name", text: "Item Name", align: "center", sortable: true },
    { key: "technical_finding", text: "Technical Finding", align: "center", sortable: true },
    { key: "comments", text: "Comments", align: "center", sortable: true },
    { key: "recommendations", text: "Recommendations", align: "center", sortable: true },
    {
      key: "status",
      text: "Status",
      align: "center",
      sortable: true,
      cell: (record) => (
        <label
          className={`badge ${
            record.status?.toLowerCase() === "ok" ? "bg-success" : "bg-warning"
          }`}
        >
          {record.status || "N/A"}
        </label>
      ),
    },
    {
      key: "action",
      text: "Action",
      align: "center",
      cell: (record) => (
        <div className="btn-group">
          <Link
            state={record}
            to="/maintanance/inspection-inspection"
            className="edit"
            title="Edit"
          >
            <Icon name="edit" type="round" />
          </Link>
          <Link
            onClick={() =>
              openDialog({ table: "inspections", filter_data:"morning_inspections", id: record.id })
            }
            to="#"
            className="delete"
            title="Delete"
          >
            <Icon name="delete" type="round" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <Form className="form">
                  <div className="row">
                    {/* Time Range Selector */}
                    <div className="col-md-2 col-12">
                      <Select
                        name="time_range"
                        value={state.time_range || ""}
                        onChange={handleInputChangeExtended}
                        label="Time Range"
                      >
                        <Option value="" label="Select Range" />
                        <Option value="today" label="Today" />
                        <Option value="yesterday" label="Yesterday" />
                        <Option value="week" label="This Week" />
                        <Option value="month" label="This Month" />
                        <Option value="last_month" label="Last Month" />
                        <Option value="year" label="This Year" />
                        <Option value="manual" label="Manual Range" />
                      </Select>
                    </div>

                    {/* Manual Date Inputs */}
                    {state.time_range === "manual" && (
                      <>
                        <div className="col-md-2 col-12">
                          <Input
                            type="date"
                            name="start_date"
                            value={state.start_date || ""}
                            onChange={handleInputChangeExtended}
                            label="Start Date"
                          />
                        </div>
                        <div className="col-md-2 col-12">
                          <Input
                            type="date"
                            name="end_date"
                            value={state.end_date || ""}
                            onChange={handleInputChangeExtended}
                            label="End Date"
                          />
                        </div>
                      </>
                    )}

                    {/* Search Button */}
                    <div className="col-md-3 col-12 center">
                      <Button
                        className="btn btn-info"
                        type="button"
                        title="Search Inspections"
                        loading={state.loading}
                        onClick={searchInspectionsBetween}
                      />
                    </div>

                    {/* Inspection Dropdown */}
                    <div className="col-md-12 mt-3">
                      <Select
                        name="inspection_print"
                        value={state.inspection_print || ""}
                        onChange={handleInputChangeExtended}
                        label="Select Inspection"
                      >
                        <Option value="" label="Select inspection" />
                        {renderInspectionOptions()}
                      </Select>
                    </div>

                    {/* Print Button */}
                  {morning_inspections_filters.length>0 && (
                    <div className="col-12 d-flex justify-content-center mt-3">
                      <Button
                        className="btn btn-info"
                        type="button"
                        title="Print Inspection"
                        disabled={!state.inspection_print}
                        onClick={null}
                      />
                    </div>
                  )}
                    {/* Inspection Table */}
                    <div className="col-12 center responsive-table mt-3">
                      <ReactDatatable
                        config={config}
                        records={morning_inspections_filters}
                        columns={columns}
                        loading={state.loading}
                      />
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        title="User Confirmation"
        text="Are you sure you want to delete this inspection report?"
        action={() => updateDialogue()}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

/* Export component */
export default MorningInspectionReport;
