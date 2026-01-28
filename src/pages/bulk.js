import React from 'react';
import { Select, Option, Input } from "../components/form";
import Dialog from "../components/dialog";
import { Button } from "../components/button";
import { permission } from '../helpers/functions';

const Api = React.memo((props) => {
  const {
    state,
    handleInputChange,
    openDialog,
    updateDialogue,
    dispatch,
    unMount,
    toggleComponent,
  } = props.application;

  React.useEffect(() => {
    if (permission(2005) || permission(2004)) {
      document.title = "User Lists";
    } else {
      window.location.href = "/not-found";
    }
    return () => unMount();
  }, []);

  const handleTemplateOrUpload = () => {
    try {
      const errors = [];

      if (!state.select_name) {
        errors.push("error");
        dispatch({ select_name_error: "Please select a table" });
      }

      if (errors.length > 0) return;

      if (!state.upload_file) {
        export_data(); // No file selected — download template
      } else {
        submitForm(); // File selected — upload it
      }
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Unexpected error" });
    }
  };

  const submitForm = async () => {
    try {
      const response = await props.application.post({
        route: 'mysql/read',
        body: {
          table: state.select_name,
          data: {} // You can extend this to include uploaded file contents if needed
        }
      });

      dispatch({
        notification: response.success ? 'Successfully read data!' : response.message
      });
    } catch (error) {
      dispatch({ notification: error instanceof Error ? error.message : "Unexpected error" });
    }
  };

  const export_data = () => {
    try {
      dispatch({ notification: `Downloading ${state.select_name} template...` });
      // TODO: Add real template download logic here
    } catch (error) {
      dispatch({ notification: "Error during template export" });
    }
  };

  return (
    <>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="row">

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Select
                        name="select_name"
                        value={state.select_name || ""}
                        onChange={handleInputChange}
                        label="Select Table"
                        error={state.select_name_error}
                      >
                        <Option value={""} label="Select table name" />
                        <Option value={"users"} label="Users" />
                        <Option value={"departments"} label="Departments" />
                        <Option value={"jobs"} label="Jobs" />
                        <Option value={"messsages"} label="Messages" />
                        <Option value={"inventory"} label="Inventory" />
                        <Option value={"meetings"} label="Meetings" />
                      </Select>
                    </div>
                  </div>

                  <div className="col-md-4 col-12">
                    <div className="form-group">
                      <Input
                        type="file"
                        label="Upload File"
                        name="upload_file"
                        value={state.upload_file}
                        error={state.upload_file_error}
                        onChange={handleInputChange}
                        placeholder="Choose file to upload"
                      />
                    </div>
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-3">
                    <Button
                      className="btn btn-primary"
                      loading={state.loading}
                      disabled={state.disabled}
                      title="Template / Upload"
                      onClick={handleTemplateOrUpload}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        title="User confirmation"
        text="Are you sure you want to delete this user?"
        action={updateDialogue}
        toggleDialog={toggleComponent}
      />
    </>
  );
});

export default Api;
