import React, { useEffect } from "react";
import { Input, Select, Option, Textarea } from "../../components/form";
import { Button } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import { getInfo, time_now } from "../../helpers/functions";

const MorningInspection = React.memo((props) => {
  const { state, unMount, dispatch, handleInputChange, post } = props.application;
  const location = useLocation();
  const navigate = useNavigate();

  // ===== Effect: Page Setup & Edit Mode =====
  useEffect(() => {
    if (location.pathname === "/maintanance/inspection") {
      document.title = location.state
        ? "Edit Inspection"
        : "Create Inspection";
      onMount();

      // Populate form in edit mode
      if (location.state) {
        const data = location.state;
        dispatch({
          inspection_department_id: data.inspection_department_id,
          technical_finding: data.technical_finding,
          comments: data.comments,
          inspected_name: data.inspected_name,
          inspection_status: data.inspection_status,
          recommendations: data.recommendations,
        });
      }
    } else {
      navigate("/not-found");
    }

    return () => unMount();
    // eslint-disable-next-line
  }, []);

  // ===== Load Departments =====
  async function onMount() {
    try {
      dispatch({ loading: true });
      const deptRes = await post({
        route: "read",
        body: { table: "departments", condition: { delated: 0 } },
      });
      dispatch({
        departments: deptRes.success ? deptRes.message : [],
        loading: false,
      });
    } catch (error) {
      dispatch({
        notification: error.message || "Failed to load departments",
        loading: false,
      });
    }
  }

  // ===== Update Record =====
  async function updateInspection(event) {
    event.preventDefault();
    try {
      const response = await post({
        route: "update",
        body: {
          table: "inspections",
          condition: { id: location.state.id },
          data: {
            inspected_name: state.inspected_name,
            technical_finding: state.technical_finding,
            comments: state.comments,
            recommendations: state.recommendations,
            updated_by: getInfo("user", "id"),
            inspection_status: state.inspection_status,
            inspection_department_id: state.inspection_department_id,
            reported_department: getInfo("user", "department_id"),
          },
        },
      });

      if (response.success) {
        dispatch({ notification: "Inspection updated successfully" });
        navigate("/maintanance/inspection-report");
      } else {
        dispatch({ notification: response.message });
      }
    } catch (error) {
      dispatch({
        notification: error instanceof Error ? error.message : "Update error",
      });
    }
  }

  // ===== Create Record =====
  async function submit() {
    try {
      const response = await post({
        route: "create",
        body: {
          table: "inspections",
          data: {
            inspection_department_id: state.inspection_department_id,
            inspected_name: state.inspected_name,
            technical_finding: state.technical_finding,
            reported_department: getInfo("user", "department_id"),
            comments: state.comments,
            inspection_status: state.inspection_status,
            recommendations: state.recommendations,
            created_by: getInfo("user", "id")
          },
        },
      });

      if (response.success) {
        dispatch({ notification: "Morning inspection submitted successfully!" });
        unMount();
        navigate("/maintanance/inspection-report");
      } else {
        dispatch({ notification: `Error: ${response.message}` });
      }
    } catch (error) {
      dispatch({
        notification: error instanceof Error ? error.message : "Submission error",
      });
    }
  }

  // ===== Validation =====
  function validateForm(event) {
    event.preventDefault();
    const errors = [];
    if (!state.inspection_department_id) {
      errors.push("inspection_department_id");
      dispatch({ inspection_department_id_error: "Department is required" });
    } else {
      dispatch({ inspection_department_id_error: "" });
    }

    if (!state.inspected_name) {
      errors.push("inspected_name");
      dispatch({ inspected_name_error: "Inspection item name is required" });
    } else {
      dispatch({ inspected_name_error: "" });
    }

    if (!state.technical_finding) {
      errors.push("technical_finding");
      dispatch({ technical_finding_error: "Technical finding is required" });
    } else {
      dispatch({ technical_finding_error: "" });
    }

    if (!state.inspection_status) {
      errors.push("inspection_status");
      dispatch({ inspection_status_error: "Status is required" });
    } else {
      dispatch({ inspection_status_error: "" });
    }

    if (!state.recommendations) {
      errors.push("recommendations");
      dispatch({ recommendations_error: "Recommendations are required" });
    } else {
      dispatch({ recommendations_error: "" });
    }

    if (errors.length === 0) {
      submit();
    }
  }

  // ===== Render Departments =====
  function renderDepartments() {
    if (!Array.isArray(state.departments)) return null;
    return state.departments.map((dept, index) => (
      <Option value={dept.id} label={dept.department_name} key={index} />
    ));
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <form
                className="form"
                onSubmit={location.state ? updateInspection : validateForm}
              >
                <div className="row">
                  {/* Department */}
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

                  {/* Inspected Name */}
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

                  {/* Technical Finding */}
                  <div className="col-md-6 col-12">
                    <Textarea
                      label="Technical Finding"
                      name="technical_finding"
                      value={state.technical_finding || ""}
                      error={state.technical_finding_error}
                      onChange={handleInputChange}
                      placeholder="Describe technical finding"
                    />
                  </div>

                  {/* Comments */}
                  <div className="col-md-6 col-12">
                    <Textarea
                      label="Comments"
                      name="comments"
                      value={state.comments || ""}
                      error={state.comments_error}
                      onChange={handleInputChange}
                      placeholder="Enter any comments"
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-4 col-12">
                    <Select
                      name="inspection_status"
                      value={state.inspection_status || ""}
                      onChange={handleInputChange}
                      label="Status"
                      error={state.inspection_status_error}
                    >
                      <Option value="" label="Select status" />
                      <Option value="OK" label="✅ OK" />
                      <Option value="Needs Attention" label="⚠️ Needs Attention" />
                      <Option value="Critical" label="❌ Critical" />
                    </Select>
                  </div>

                  {/* Recommendations */}
                  <div className="col-md-8 col-12">
                    <Textarea
                      label="Recommendations"
                      name="recommendations"
                      value={state.recommendations || ""}
                      error={state.recommendations_error}
                      onChange={handleInputChange}
                      placeholder="Enter recommendations"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button
                      className="btn btn-success"
                      loading={state.loading}
                      disabled={state.disabled}
                      title={location.state ? "Update" : "Save"}
                      type="submit"
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

export default MorningInspection;
