/* Required Modules */
import React, { useEffect, useMemo } from 'react';
import { Form, Select, Option, Input } from "../../components/form";
import { Button } from "../../components/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReactDatatable from '../../components/table';
import { config, padStart, format_date, getInfo, permission } from '../../helpers/functions';

/* Report Component */
const Report = React.memo((props) => {
  const { state, unMount, dispatch, handleInputChange } = props.application;

  /* Component Mount */
  useEffect(() => {
    if (!permission(4009)) {
      window.location.href = "/not-found";
      return;
    }
    //initial load and rander today 
    dispatch({ time_range: "today" });
    document.title = 'Job Report';
    fetchInitialData();
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  /* Fetch Departments and Users */
  async function fetchInitialData() {
    try {
       // Parallel fetching users, departments
      const [userResult, deptResult] = await Promise.all([
        props.application.post({
          route: 'read',
          body: { 
            table: 'users', 
            condition: { delated: 0 } 
          }
        }),
        props.application.post({
          route: 'read',
          body: {
            table: 'departments',
            condition: { delated: 0 }
          }
        }),
      ]);
      dispatch({ loading: false });
      dispatch({ departments: deptResult.success ? deptResult.message : [] });
      dispatch({ users: userResult.success ? userResult.message : [] });
    } catch (error) {
      dispatch({ notification: error.message });
    }
  }

  /* Extended Input Handler for Time Range */
  const handleInputChangeExtended = (e) => {
    const { name, value } = e.target;
    if (name === "time_range") {
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
          firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
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
        case "manual":
          start = end = "";
          break;
        default:
          break;
      }
      dispatch({ 
        time_range: value, 
        startDate: start, 
        endDate: end 
      });
    } else {
      handleInputChange(e);
    }
  };

  /* Search Job Cards Between Dates */
  async function searchJobsBetween() {
    if (!state.startDate || !state.endDate) {
      dispatch({ notification: "Please select both start and end dates." });
      return;
    }
    try {
      const result = await props.application.post({
        route: 'search_between',
        body: {
          table: 'jobs',
          condition: { delated: 0 },
          start: `${state.startDate}T00:00:00`,
          end: `${state.endDate}T23:59:59`,
          column: 'created_date'
        }
      });
      dispatch({ job_cards: result.success ? result.message : [] });
    } catch (error) {
      dispatch({ notification: error.message });
    }
  }

  /* Render Job Card Options */
  const renderJobCards = () => {
    return state.job_cards?.map((job) => (
      <Option
        key={job.id}
        value={job.id.toString()}
        label={`${padStart(job.id, 4)} - ${job.location} - ${job.descriptions}`}
      />
    ));
  };

  /* Memoized Maps for Faster Lookups */
  const departmentsMap = useMemo(() => {
    const map = new Map();
    state.departments?.forEach(d => map.set(d.id, d.name));
    return map;
  }, [state.departments]);

  const usersMap = useMemo(() => {
    const map = new Map();
    state.users?.forEach(u => map.set(u.id, u.full_name));
    return map;
  }, [state.users]);

  const getUserName = (id) => usersMap.get(id) ?? "N/A";

  /* Prepare Job Card Table Data */
  const job_cards_lists = useMemo(() => {
    if (!state.job_cards) return [];
    return state.job_cards.map(job => ({ ...job }));
  }, [state.job_cards]);

  /* Table Columns */
  const columns = [
    { key: "id", text: "ID", className: "center", sortable: true },
    //{ key: "requested_department", text: "Requested Dept", className: "center", sortable: true },
   // { key: "assigned_department_name", text: "Assigned Dept", className: "center", sortable: true },
    { key: "descriptions", text: "Descriptions", className: "center", sortable: true },
    { key: "created_date", text: "Created Date", className: "center", sortable: true },
    { key: "created_by", text: "Requested By", className: "center", sortable: true },
    { key: "assigned_to_name", text: "Assigned To", className: "center", sortable: true },
    { key: "comment", text: "Comment", className: "center", sortable: true, width: 200 },
    { key: "location", text: "Location", className: "center", sortable: true },
    { key: "completed", text: "Completed", className: "center", sortable: true, cell: (record) => (record.completed ? "Yes" : "No") },
    { key: "customer_approve", text: "Customer Approved", className: "center", sortable: true, cell: (record) => (record.customer_approve ? "Yes" : "No") },
    { key: "attempt_by", text: "Attempted By", className: "center", sortable: true },
    { key: "attempt_date", text: "Attempt Date", className: "center", sortable: true, cell: (record) => format_date(record.attempt_date) },
  ];

  /* Print Job Cards to PDF then download */
/* Print Single Job Cards - One Page Per Job */

/* Print Job Cards Professionally */
const printJobCardsProfessional = () => {
  if (!state.job_cards || state.job_cards.length === 0) {
    dispatch({ notification: "No job cards available to print." });
    return;
  }

  try {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    state.job_cards.forEach((job, index) => {
      if (index !== 0) doc.addPage();
      let y = margin;

      // === HEADER ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("USER REQUESTION FORM", pageWidth / 2, y, { align: "center" });
      y += 8;

      // --- Section 1: Requestions Info ---
            doc.setFont("helvetica", "bold");
      doc.text("Job Card No:", pageWidth / 2, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.id.toString(), pageWidth / 2 + 30, y);
      y += 7;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Requested_Department:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.department_name || "N/A", 50, y);

      doc.setFont("helvetica", "bold");
      doc.text("Mobile:", pageWidth / 2 + 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.requester_mobile || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Date:   ", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(format_date(job.created_date), 20, y);

      doc.setFont("helvetica", "bold");
      doc.text("Location:", pageWidth / 2 + 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.location || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Requested_By:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(getUserName(job.created_by), 50, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Instrument:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.instrument_name || "N/A", 30, y);

      doc.setFont("helvetica", "bold");
      doc.text("Designation:", pageWidth / 2 + 10, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.instrument_designation || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Descriptions:", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(job.descriptions || "N/A", margin, y, { maxWidth: pageWidth - 2 * margin });
      y += 15;

      // --- Section 2: Engineering Dept Use ---
      //received_by, Assigned _by Assigned_date aassigned comment
      //job specifications required name,
      doc.setFont("helvetica", "bold");
      doc.text("FOR ENGINEERING DEPARTMENT USE", margin, y);
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.text("Instrument Name:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.instrument_name || "N/A", 40, y);

      doc.setFont("helvetica", "bold");
      doc.text("Received By:", pageWidth / 2, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.engineer_received || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Date:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(format_date(job.received_date), 20, y);
      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Assigned To:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.assigned_to_name || "N/A", 30, y);

      doc.setFont("helvetica", "bold");
      doc.text("Time:", pageWidth / 2, y);
      doc.setFont("helvetica", "normal");
      doc.text(format_date(job.assigned_date, "format", "HH:mm:ss"), pageWidth / 2 + 20, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Year of Installation:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.year_of_installation || "N/A", 50, y);

      doc.setFont("helvetica", "bold");
      doc.text("Serial Number:", pageWidth / 2, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.serial_number || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Model:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.model || "N/A", 20, y);

      doc.setFont("helvetica", "bold");
      doc.text("Next PPM Date:", pageWidth / 2, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.next_ppm_date || "N/A", pageWidth / 2 + 30, y);

      y += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Description Details:", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(job.technical_specifications || "N/A", margin, y, { maxWidth: pageWidth - 2 * margin });
      y += 15;

      // --- Section 3: Action Taken ---
      doc.setFont("helvetica", "bold");
      doc.text("Action Taken:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.action_taken || "N/A", margin, y + 6, { maxWidth: pageWidth - 2 * margin });
      y += 20;

      // --- Section 4: Status & Materials ---
      doc.setFont("helvetica", "bold");
      doc.text("Status of Instrument:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(job.instrument_status || "N/A", 50, y);

      // Materials Table
      const materials = job.materials || [];
      autoTable(doc, {
        startY: y + 6,
        head: [["No", "Needed", "Used"]],
        body: materials.map((m, i) => [i + 1, m.needed || "", m.used || ""]),
        theme: "grid",
        margin: { left: margin, right: margin },
      });

      y = doc.lastAutoTable.finalY + 10;

      //attempted by ,attempted_date and attempt_comment
      doc.text(`Engineer's Name: ${job.engineer_name || "N/A"}`, margin, y);
      doc.text(`Signature: ___________________`, pageWidth / 2, y);
      y += 10;
      doc.text(`Date: ___________________`, margin, y);
      y += 15;

      ////approved_by ,approved_date and approver_comment

      // --- Section 5: Customer Certification ---
      doc.setFont("helvetica", "bold");
      doc.text("CUSTOMER'S CERTIFICATION", margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${job.customer_name || ""}`, margin, y);
      y += 6;
      doc.text(`Title: ${job.customer_title || ""}`, margin, y);
      y += 6;
      doc.text(`Signature: ___________________`, margin, y);
      y += 6;
      doc.text(`Mobile Phone: ${job.customer_mobile || ""}`, margin, y);
      y += 6;
      doc.text(`Comments: ${job.customer_comment || ""}`, margin, y);

      // Footer at bottoms
      y = pageWidth - 15;
      doc.setFontSize(8);
      const now = new Date();
      doc.text(`Printed By: ${getUserName(getInfo("user", "id")) || "Unknown User"}`, margin, pageWidth - 10);
      doc.text(`Printed On: ${now.toLocaleString()}`, pageWidth - margin, pageWidth - 10, { align: "right" });
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    doc.save(`ProfessionalJobReport_${timestamp}.pdf`);
  } catch (error) {
    dispatch({ notification: "Error printing job report: " + error.message });
  }
};

/* Print All Job Cards to PDF */
const printAllJobCards = () => {
  if (!state.job_cards || state.job_cards.length === 0) {
    dispatch({ notification: "No job cards available to print." });
    return;
  }

  try {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    // --- HEADER ---
    doc.text("THE UNITED REPUBLIC OF TANZANIA", 105, 15, { align: "center" });
    doc.text("BENJAMIN MKAPA HOSPITAL", 105, 23, { align: "center" });
    doc.text("USER JOB REQUEST REPORT", 105, 31, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 34, 190, 34);

    // --- TABLE ---
    autoTable(doc, {
      startY: 38,
      head: [[
        "ID",
        "Description",
        "Created Date",
        "Requested By",
        "Assigned To",
        "Location",
        "Completed",
        "Customer Approved",
        "Attempt Date"
      ]],
      body: state.job_cards.map(job => [
        padStart(job.id, 4),
        job.descriptions,
        format_date(job.created_date),
        getUserName(job.created_by),
        job.assigned_to_name ?? "N/A",
        job.location,
        job.completed ? "Yes" : "No",
        job.customer_approve ? "Yes" : "No",
        format_date(job.attempt_date)
      ]),
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185] },
      didDrawPage: (data) => {
        // HEADER PER PAGE
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("BENJAMIN MKAPA HOSPITAL", 20, 10);
        doc.text(`Page ${doc.internal.getNumberOfPages()}`, 190, 10, { align: "right" });

        // FOOTER PER PAGE
        const printedBy = getUserName(getInfo("user", "id")) || "Unknown User";
        const now = new Date();
        const footerY = doc.internal.pageSize.height - 10;
        doc.text(`Printed By: ${printedBy}`, 20, footerY);
        doc.text(`Printed On: ${now.toLocaleString()}`, 190, footerY, { align: "right" });
      }
    });

    // --- SAVE FILE ---
    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    doc.save(`JobCards_Report_${timestamp}.pdf`);

  } catch (error) {
    dispatch({ notification: "Error printing report: " + error.message });
  }
};
  return (
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
                      error={state.time_range_error}
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
                  {state.time_range === 'manual' && (
                    <>
                      <div className="col-md-2 col-12">
                        <Input type="date" name="startDate" value={state.startDate || ""} onChange={handleInputChangeExtended} label="Start Date" />
                      </div>
                      <div className="col-md-2 col-12">
                        <Input type="date" name="endDate" value={state.endDate || ""} onChange={handleInputChangeExtended} label="End Date" />
                      </div>
                    </>
                  )}

                  {/* Search Button */}
                  <div className="col-md-3 col-12 center">
                    <Button
                      className="btn btn-info"
                      type="button"
                      title="Search Jobs"
                      loading={state.loading}
                      onClick={searchJobsBetween}
                    />
                  </div>

                  {/* Job Card Dropdown */}
                  <div className="col-md-12 mt-3">
                    <Select name="job_card_print" value={state.job_card_print || ""} onChange={handleInputChangeExtended} label="Select Job Card">
                      <Option value="" label="Select Job Card" />
                      {renderJobCards()}
                    </Select>
                  </div>

                  {/* Print Button */}
                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button
                      className="btn btn-info"
                      type="button"
                      title="Print Job"
                      disabled={!state.job_card_print}
                      onClick={printJobCardsProfessional}
                    />
                  </div>

                  {/* Job Card Table */}
                  <div className="col-12 center responsive-table mt-3">
                    <ReactDatatable
                      config={config}
                      records={job_cards_lists}
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
  );
});

export default Report;