import React, { useEffect } from "react";
import { Button } from "../../components/button";
import ReactDatatable from "../../components/table";
import { config, encrypt } from '../../helpers/functions';
import { Input } from "../../components/form";

const Bulk_Create = React.memo((props) => {
  const { 
    state,
    handleFileChange, 
    dispatch, 
    jsonToExcel, 
    post 
} = props.application;

  useEffect(() => {
    document.title = "Bulk Create Users";
    dispatch({ file_data: [], files: null, files_error: "", loading: false });
  }, []);

  const columns = [
  { key: "id", className: "center", text: "No", sortable: true, reactKey: "col_full_name" },
  { key: "full_name", className: "center", text: "Full Name", sortable: true, reactKey: "col_full_name" },
  { key: "user_name", className: "center", text: "Username", sortable: true, reactKey: "col_user_name" },
  { key: "email", className: "center", text: "Email", sortable: true, reactKey: "col_email" },
  { key: "phone_number", className: "center", text: "Phone", sortable: true, reactKey: "col_phone_number" },
  { key: "address", className: "center", text: "Address", sortable: true, reactKey: "col_address" },
  { key: "gender", className: "center", text: "Gender", sortable: true, reactKey: "col_gender" },
  { key: "designation", className: "center", text: "Designation", sortable: true, reactKey: "col_designation" },
  { key: "department_id", className: "center", text: "Department", sortable: true, reactKey: "col_department_id" }, 
  { key: "is_created", className: "center", text: "Is_Created", sortable: true, reactKey: "col_is_created" },
  { key: "feedback", className: "center", text: "Feedback", sortable: true, reactKey: "col_feedback" },
];

  // Download Excel template
  const handleDownloadTemplate = () => {
    try {
    const template = [
      {
        full_name: "patrick munuo",
        user_name: "Bmh2025",
        email: "bmh@mail.com",
        phone_number: "+255760449295",
        address: "Dodoma makulu",
        gender: "male",
        designation: "",
        department_id: ""
      },
    ];
    jsonToExcel(template, "users_template.xlsx");
} catch (error) {
    dispatch({ notification: "Error while download Template" + error.message });
  }
  };

  // Submit bulk users
const handleBulkSubmit = async () => {
  try {
    if (!filter_users || !Array.isArray(filter_users) || filter_users.length === 0) {
      dispatch({ notification: "No data to submit!" });
      return;
    }
    dispatch({ loading: true });
    const body = filter_users.map(user => ({
      table: "users",
      data:{
        full_name: user.full_name,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        gender: user.gender || "",
        designation: user.designation || "",
        department_id: user.department_id || "",
        status: user.status || "",
        password: user.password
        },
      })
    )
    // Send bulk create request
    const response = await props.application.post({
      route: "bulk-create",
      body: body
    });

    dispatch({ loading: false });

    if (response?.message && Array.isArray(response.message)) {
      // Count successes and failures
      let totalCreated = 0;
      let totalFailed = 0;

      const updatedUsers = state.file_data.map((user, index) => {
        const result = response.message[index]; // assume same order as submitted
        if (result?.success) {
          totalCreated++;
          return { ...user, is_created: "Yes", feedback: "successfully " +result?.message  };
        } else {
          totalFailed++;
          //Duplicate entry 'jdoe3' for key 'user_name' write duplicated user data
          return { ...user, is_created: "No", feedback: result?.message || "Failed to create" };
        }
      });
      // Update state with creation results
      dispatch({ file_data: updatedUsers });
      // Notify user
      dispatch({
        notification: `Bulk Create Summary: ${totalCreated} users created, ${totalFailed} failed.`
      });
      //wait for 5 seconds and clear notification
    } else {
      dispatch({ notification: "No response from server "+ response.message });
    }
  } catch (error) {
    dispatch({ loading: false });
    dispatch({ notification: error?.message || "Unknown error during bulk create" });
  }
};

  //
// Memoize processed users with filters only required fields for users for preview table
const filter_users = React.useMemo(() => {
  // Ensure fileData exists
  const users = state.file_data || [];
  if (users.length === 0) return [];
  // Map and return users with only required fields
  // Optional: preprocess users if needed (e.g., pick only required fields)
  return users.map((user, index) => ({
        id: index + 1,
        full_name: user.full_name,
        user_name: user.user_name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address || "",
        gender: user.gender || "",
        designation: user.designation || "",
        department_id: user.department_id || "",
        //after create to server i need to add these fields
        is_created: user.is_created || "null",
        feedback :user.feedback || "null",
        status: "active",
        password: encrypt({ password: "Bmh@1234" }) || ""
  }));
}, [state.file_data]);

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {/* File upload and buttons */}
              <div className="row mb-3">
                <div className="col-12 d-flex gap-2 align-items-center">
                  <Button className="btn btn-primary" title="Download Template" onClick={handleDownloadTemplate} />
                  <Input
                    name="excell_files"
                    type="file"
                    label="Upload Excel File"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="form-control"
                    error={state.files_error}
                  />
                 <Button 
                   className="btn btn-success"
                   title="Create Users"
                   onClick={handleBulkSubmit}
                   loading={state.loading}
                 />
                </div>
              </div>

              {/* Preview table */}
              {state.file_data?.length > 0 && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h5>Preview Users</h5>
                    <div className="responsive-table">
                      <ReactDatatable
                        config={config}
                        records={filter_users}
                        columns={columns}
                        loading={state.loading}
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
export default Bulk_Create;
