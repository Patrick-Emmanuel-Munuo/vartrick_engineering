/* dependencies */
import React from "react";
import { Button } from "../../components/button";
import { Input ,Form} from "../../components/form";
import { getInfo, encrypt } from '../../helpers/functions';

/* user password change functional component */
  const UserPassword = React.memo((props) => {
    // destructuring global variables
  const { state, unMount, dispatch, handleInputChange } = props.application;
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);
  const [showPassword3, setShowPassword3] = React.useState(false);
  const togglePasswordVisibility1 = () => setShowPassword1((prev) => !prev);
  const togglePasswordVisibility2 = () => setShowPassword2((prev) => !prev);
  const togglePasswordVisibility3 = () => setShowPassword3((prev) => !prev);

    // component mounting
    React.useEffect(() => {
        // defining document title
        document.title = "Change password";
        // component unmounting
        return () => unMount();

        // eslint-disable-next-line
    }, []);

    // validating old password
    async function validate_old_password() {
        if (!state.old_password.trim()) return; // Avoid making a request if no old password entered
        try {
            // making API request
            let response = await props.application.post({
                route: 'read',
                body: {
                    table: 'users',
                    condition: {
                        id: getInfo("user", "id"),
                        password: encrypt({password:state.old_password}).encrypted ||""
                    },
                }
            });
            if (response.success) {
                dispatch({ old_password_error: "" });
            } else {
                dispatch({ old_password_error: "Old password is not correct" });
            }
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ notification: "Something went wrong while validating your old password." });
            } else {
                console.error(error);
            }
        }
    }
    // form submission
    async function submitForm() {
        try {
            // making API request to update password
            let response = await props.application.post({
                route: 'update',
                body: {
                    table: 'users',
                    condition: {
                        id: getInfo("user", "id"),
                    },
                    data: {
                        updated_by: getInfo("user", "id"),
                        //updated_date: time_now,
                        password: encrypt({password:state.new_password}).encrypted ||""
                    }
                }
            });
            if (response.success) {
                unMount();
                dispatch({ notification: "Password has been successfully updated" });
                // redirecting to login page
                setTimeout(() => {
                    props.application.authenticate("logout");
                }, 2000);   
            } else {
                dispatch({ notification: response.message });
            }
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ notification: "Something went wrong while updating the password." });
            } else {
                console.error(error);
            }
        }
    }
    // form validation
    function validateForm(event) {
        try {
            event.preventDefault();
            const errors = [];
            const oldPassword = (state.old_password || "").trim();
            const newPassword = (state.new_password || "").trim();
            const confirmPassword = (state.password_confirmation || "").trim();
            // validating old password
            if (!oldPassword) {
                errors.push("old_password");
                dispatch({ old_password_error: "Old password is required" });
            } else if (oldPassword.length < 4) {
                errors.push("old_password");
                dispatch({ old_password_error: "Old password must have at least 4 characters" });
            } else {
                dispatch({ old_password_error: "" });
            }
            // validating new password
            if (!newPassword) {
                errors.push("new_password");
                dispatch({ new_password_error: "New password is required" });
            } else if (newPassword.length < 4) {
                errors.push("new_password");
                dispatch({ new_password_error: "New password must have at least 4 characters" });
            } else {
                dispatch({ new_password_error: "" });
            }
            // validating password confirmation
            if (!confirmPassword) {
                errors.push("password_confirmation");
                dispatch({ password_confirmation_error: "Password confirmation is required" });
            } else if (confirmPassword !== newPassword) {
                errors.push("password_confirmation");
                dispatch({ password_confirmation_error: "Passwords do not match" });
            } else {
                dispatch({ password_confirmation_error: "" });
            }
            // submitting form if no errors
            if (errors.length === 0 && state.old_password_error === "") {
                submitForm();
            }
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ notification: "Something went wrong while validating the password." });
            } else {
                console.error(error);
            }
        }
    }

    // returning component view
    return (
        <>
            <section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <Form onSubmit={validateForm}>
                                    <div className="row">
                                        <div className="col-md-4 col-12">
                                            <Input
                                                type={showPassword1 ? 'text' : 'password'}
                                                label="Old Password"
                                                name="old_password"
                                                value={state.old_password}
                                                error={state.old_password_error}
                                                onChange={handleInputChange}
                                                placeholder="Enter your old password"
                                                onBlur={validate_old_password}
                                                rightIcon={{
                                                    icon: showPassword1 ? "visibility" : "visibility_off",
                                                    onClick: togglePasswordVisibility1,
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <Input
                                                type={showPassword2 ? 'text' : 'password'}
                                                label="New Password"
                                                name="new_password"
                                                value={state.new_password}
                                                error={state.new_password_error}
                                                onChange={handleInputChange}
                                                placeholder="Enter your new password"
                                                rightIcon={{
                                                    icon: showPassword2 ? "visibility" : "visibility_off",
                                                    onClick: togglePasswordVisibility2,
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-4 col-12">
                                            <Input
                                                type={showPassword3 ? 'text' : 'password'}
                                                label="Confirm New Password"
                                                name="password_confirmation"
                                                value={state.password_confirmation}
                                                error={state.password_confirmation_error}
                                                onChange={handleInputChange}
                                                placeholder="Confirm your new password"
                                                rightIcon={{
                                                    icon: showPassword3 ? "visibility" : "visibility_off",
                                                    onClick: togglePasswordVisibility3,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-center">
                                        <Button
                                            loading={state.loading}
                                            disabled={state.disabled}
                                            title="Update Password"
                                            type="button"
                                            className="btn btn-info"
                                        />
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
});

/* exporting component */
export default UserPassword;
