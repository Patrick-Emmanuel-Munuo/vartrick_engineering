import React from "react";
import { Input, Select, Option } from "../../components/form";
import { Button } from "../../components/button";
import { getInfo, encrypt, permission} from "../../helpers/functions";

  const AdminResetPassword = React.memo((props) => {
  const { state, dispatch, post, unMount, handleInputChange } = props.application;
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const togglePasswordVisibility1 = () => setShowPassword1((prev) => !prev);
  const togglePasswordVisibility2 = () => setShowPassword2((prev) => !prev);

  React.useEffect(() => {
    document.title = "Admin Reset User Password";
    return () => unMount();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (permission(2009) || permission(2006) ) {
      document.title = "Admin Reset User Password";
      //onMount()
    } else {
      window.location.href = "/not-found";
    }
    // component unmounting
    return () => unMount()
  }, []);
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page on submit
    try {
      // var request = permission(2009)?{}:{department_id: (getInfo("user","department_id"))}
      const response = await post({
        route: 'search',
        body: {
          table: "users",
          condition: {  //2009 all user and  2006 department
            full_name: state.search_text.trim()||"",
            status: "active",
            delated:0,
            //...request
          } // Use trimmed search text
        },
      });
      if (response.success) {
        dispatch({ search_data: response.message || [] });
      } else {
        dispatch({ search_data: [] });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: "Something went wrong while searching for users." });
      } else {
        console.error(error);
      }
    }
  };

  const handleReset = async (event) => {
    try {
      event.preventDefault(); // Prevent the form from reloading the page on submit
      // Clear previous errors
      dispatch({ password_error: "", confirm_password_error: "" });
      let errors = [];
      if (state.password !== state.confirm_password) {
        errors.push("error");
        dispatch({ password_error: "Passwords do not match" });
      }
      if (state.password.length < 4) {
        errors.push("error");
        dispatch({ password_error: "Password must be at least 4 characters" });
      }

      if (errors.length === 0) {
        const response = await post({
          route: 'update',
          body: {
            table: "users",
            condition: { id: state.user_id },
            data: {
              password: encrypt({password:state.password}).encrypted ||"",
              updated_by: getInfo("user", "id")
            },
          },
        });
        if (response.success) {
          dispatch({ notification: "Password reset successfully." });
          // Instead of reload, you can navigate or update the UI accordingly
          dispatch({ user_id: "", password: "", confirm_password: "" }); // Reset form
        } else {
          dispatch({ notification: "Password reset failed: " + response.message });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ notification: "Something went wrong while resetting the password." });
      } else {
        console.error(error);
      }
    }
  };

  const renderUsers = () => {
    return state.search_data.map((user, index) => (
      <Option value={user.id} label={user.full_name} key={index} />
    ));
  };

  return (
    <section className="section">
      <div className="row">
          <div className="card">
            <div className="card-body">
              <form className="form" onSubmit={handleSearch}>
                {/* Search row */}
                <div className="row">
                  <div className="col-md-4 col-12">
                    <Input
                      type="text"
                      name="search_text"
                      error={state.search_text_error}
                      label="Search User by Name"
                      value={state.search_text}
                      onChange={handleInputChange}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="col-12">
                    <Button
                      className="btn btn-info"
                      loading={state.loading}
                      disabled={state.disabled}
                      title="Search"
                      type="submit" // Use type="submit" for form submission
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    {state.search_data.length > 0 && (
                      <Select
                        name="user_id"
                        value={state.user_id || ""}
                        onChange={handleInputChange}
                        label="Select User"
                        error={state.user_id_error}
                      >
                        <Option value="" label="Select user" />
                        {renderUsers()}
                      </Select>
                    )}
                  </div>
                </div>

                {/* Reset password section */}
                {state.user_id && (
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <h5 className="center">Reset password for user</h5>
                      <Input
                        type={showPassword1 ? 'text' : 'password'}
                        name="password"
                        label="New Password"
                        value={state.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        error={state.password_error}
                        rightIcon={{
                          icon: showPassword1 ? "visibility" : "visibility_off",
                          onClick: togglePasswordVisibility1,
                        }}
                      />
                      <Input
                        type={showPassword2 ? 'text' : 'password'}
                        name="confirm_password"
                        label="Confirm Password"
                        value={state.confirm_password}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        error={state.confirm_password_error}
                        rightIcon={{
                          icon: showPassword2 ? "visibility" : "visibility_off",
                          onClick: togglePasswordVisibility2,
                        }}
                      />
                      <div className="col-md-4 mt-3 d-flex justify-content-center">
                        <Button
                          className="btn btn-info"
                          loading={state.loading}
                          disabled={state.disabled}
                          title="Reset"
                          onClick={handleReset}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
      </div>
    </section>
  );
});

export default AdminResetPassword;
