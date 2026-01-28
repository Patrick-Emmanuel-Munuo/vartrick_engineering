import React from 'react';
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation } from 'react-router-dom';
import { getInfo, time_now } from '../../helpers/functions';

const MorningInspectionForm = React.memo((props) => {
  const { state, unMount, dispatch, handleInputChange } = props.application;
  const pathname = useLocation();

  React.useEffect(() => {
    if (pathname.pathname === "/maintanance/morning-inspection") {
      document.title = pathname.state ? "Edit Morning Inspection" : "Create Morning Inspection";
      onMount();

      // Populate form in edit mode
      if (pathname.state) {
        const data = pathname.state;
        dispatch({
          inspection_department_id: data.department_id,
          technical_finding: data.technical_finding,
          comments: data.comments,
          inspected_name:data.inspected_name,
          inspection_status: data.status,
          recommendations: data.recommendations
        });
      }
    } else {
      window.location.href = "/not-found";
    }

    return () => unMount();
    // eslint-disable-next-line
  }, []);

  async function onMount() {
    try {
      const deptRes = await props.application.post({
        route: 'mysql/read',
        body: { table: 'departments', condition: { delated: 0 } }
      });
      dispatch({ departments: deptRes.success ? deptRes.message : [] });
    } catch (error) {
      dispatch({ notification: error.message || "Failed to load departments" });
    }
  }

  async function updateInspection(event) {
    event.preventDefault();
    try {
      const response = await props.application.post({
        route: 'mysql/update',
        body: {
          table: 'morning_inspections',
          condition: { unique_id: pathname.state.unique_id },
          data: {
            department_id: state.inspection_department_id,
            inspected_name: state.inspected_name,
            technical_finding: state.technical_finding,
            comments: state.comments,
            status: state.inspection_status,
            recommendations: state.recommendations,
            updated_by: getInfo("user", "user_name"),
            updated_date: time_now,
          }
        }
      });

      if (response.success) {
        dispatch({ notification: "Inspection updated successfully" });
        window.location.href = "/maintanance/morning-report";
      } else {
        dispatch({ notification: response.message });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Update error" });
    }
  }

  async function submit() {
    try {
      const response = await props.application.post({
        route: 'mysql/create',
        body: {
          table: 'morning_inspections',
          data: {
            department_id: state.inspection_department_id,
            inspected_name: state.inspected_name,
            technical_finding: state.technical_finding,
            reported_department: getInfo("user", "department_id"),
            comments: state.comments,
            status: state.inspection_status,
            recommendations: state.recommendations,
            created_by: getInfo("user", "unique_id"),
            created_date: time_now,
            delated: 0
          }
        }
      });

      if (response.success) {
        dispatch({ notification: 'Morning inspection submitted successfully!' });
        unMount();
        window.location.href = "/maintanance/morning-report";
      } else {
        dispatch({ notification: `Error: ${response.message}` });
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Submission error" });
    }
  }

  function validateForm(event) {
    event.preventDefault();
    const errors = [];

    if (!state.inspection_department_id) {
      errors.push("inspection_department_id");
      dispatch({ inspection_department_id_error: "Department is required" });
    }else{
      dispatch({ inspection_department_id_error: "" });
    }
    if (!state.inspected_name) {
      errors.push("");
      dispatch({ inspected_name_error: "inspection item nameis required" });
    }else{
      dispatch({ inspected_name_error: "" });
    }
    if (!state.technical_finding) {
      errors.push("");
      dispatch({ technical_finding_error: "Technical finding is required" });
    }else{
      dispatch({ technical_finding_error: "" });
    }

    if (!state.inspection_status) {
      errors.push("");
      dispatch({ inspection_status_error: "Status is required" });
    }else{
      dispatch({ inspection_status_error: "" });
    }

    if (!state.recommendations) {
      errors.push("recommendations");
      dispatch({ recommendations_error: "Recommendations required" });
    }else{
      dispatch({ recommendations_error: "" });
    }

    if (errors.length === 0) {
      submit();
    }
  }

  function renderDepartments() {
    if (!Array.isArray(state.departments)) return null;
    return state.departments.map((dept, index) => (
      <Option value={dept.unique_id} label={dept.name} key={index} />
    ));
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={pathname.state ? updateInspection : validateForm}>
                <div className="row">

                  <div className="col-md-6 col-12">
                    <Select
                      name="inspection_department_id"
                      value={state.inspection_department_id || ""}
                      onChange={handleInputChange}
                      label="Department"
                      error={state.inspection_department_id_error}
                    >
                      <Option value="" label="Select department" />
                      {renderDepartments()}
                    </Select>
                  </div>
                  <div className="col-md-6 col-12">
                    <Input
                      type="text"
                      label="Inspected Name"
                      name="inspected_name"
                      value={state.inspected_name || ""}
                      error={state.inspected_name_error}
                      onChange={handleInputChange}
                      placeholder="Inspected Item Name"
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <Input
                      type="text"
                      label="Technical Finding"
                      name="technical_finding"
                      value={state.technical_finding || ""}
                      error={state.technical_finding_error}
                      onChange={handleInputChange}
                      placeholder="Describe technical finding"
                    />
                  </div>

                  <div className="col-md-6 col-12">
                    <Input
                      type="text"
                      label="Comments"
                      name="comments"
                      value={state.comments || ""}
                      error={state.comments_error}
                      onChange={handleInputChange}
                      placeholder="Enter any comments"
                    />
                  </div>

                  <div className="col-md-6 col-12">
                    <Select
                      name="inspection_status"
                      value={state.inspection_status || ""}
                      onChange={handleInputChange}
                      label="Status"
                      error={state.inspection_status_error}
                    >
                      <Option value="" label="Select status" />
                      <Option value="OK" label="OK" />
                      <Option value="Needs Attention" label="Needs Attention" />
                      <Option value="Critical" label="Critical" />
                    </Select>
                  </div>

                  <div className="col-12">
                    <Input
                      type="text"
                      label="Recommendations"
                      name="recommendations"
                      value={state.recommendations || ""}
                      error={state.recommendations_error}
                      onChange={handleInputChange}
                      placeholder="Enter recommendations"
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button
                      className="btn btn-success"
                      loading={state.loading}
                      disabled={state.disabled}
                      title={pathname.state ? "Update" : "Save"}
                      onClick={pathname.state ? updateInspection : validateForm}
                    />
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MorningInspectionForm;
