/* requiring dependencies */
import React, { useState, useEffect } from "react";
import { encrypt } from "../../helpers/functions";
import { Form, Input } from "../../components/form";
import { Button } from "../../components/button";
import { Link } from "react-router-dom";

/* creating memorized forgot password functional component */
const ForgotPassword = React.memo((props) => {
  // destructuring global helpers
  const { state, dispatch, handleInputChange, unMount } = props.application;

  // local state
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility1 = () => setShowPassword1((prev) => !prev);
  const togglePasswordVisibility2 = () => setShowPassword2((prev) => !prev);

  // countdown effect for resending OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // set page title
  useEffect(() => {
    document.title = "Forgot Password";
    return () => unMount();
  }, []);

  // --- functions ---

  // send OTP
  const sendOtp = async () => {
    try {
      const validation = await props.application.post({
        route: 'read',
        body: {
          table: "users",
          condition: {
            user_name: state.user_name || "",
            status: "active",
            delated: 0,
          },
        },
      });

      if (validation.success) {
        const results = await props.application.post({
          route: "send-otp",
          body: {
            email_address: validation.message[0].email || "",
            user: validation.message[0].full_name || "user",
          },
        });
        if (results.success) {
          dispatch({
            otp_sent: true,
            otp: results.otp, // for development/debug
            notification: "Verification code sent to your email.",
            user_name_error: "",
          });
          setResendCountdown(300);
        } else {
          dispatch({
            notification: "Failed to send verification code. Contact your admin.",
            user_name_error: "Failed to send verification code.",
          });
        }
      } else {
        dispatch({
          notification: "Account not found. Please contact your head of department.",
        });
      }
    } catch (error) {
      dispatch({ notification: error.message });
    }
  };

  // verify OTP
  const verifyOtp = (event) => {
    event.preventDefault();
    if ((state.entered_otp || "").trim() === state.otp) {
      dispatch({
        otp_verified: true,
        otp_error: "",
        notification: "OTP verified. Set your new password.",
        loading: false,
      });
    } else {
      dispatch({
        otp_error: "Incorrect OTP. Please try again.",
        loading: false,
      });
    }
  };

  // reset password in DB
  const resetPasswordInDb = async () => {
    try {
      const response = await props.application.post({
        route: 'update',
        body: {
          table: "users",
          data: {
            password: encrypt({ password: state.new_password }).encrypted || "",
          },
          condition: { user_name: state.user_name },
        },
      });

      if (response.success) {
        dispatch({ notification: "Password reset successfully." });
        //window.location.pathname = "/login";
      } else {
        dispatch({
          notification: "Failed to update password. Try again.",
          password_error: "Failed to update password. Try again.",
        });
      }
    } catch (error) {
      dispatch({
        notification:
          error instanceof Error
            ? "Something went wrong while updating the password."
            : "Unexpected error",
      });
      console.error(error);
    }
  };

  // validate and submit new password form
  const handleResetPassword = (event) => {
    event.preventDefault();
    const errors = [];
    const newPassword = (state.new_password || "").trim();
    const confirmPassword = (state.confirm_password || "").trim();

    if (!newPassword) {
      errors.push("error");
      dispatch({ new_password_error: "New password is required" });
    } else if (newPassword.length < 4) {
      errors.push("error");
      dispatch({ new_password_error: "New password must have at least 4 characters" });
    } else {
      dispatch({ new_password_error: "" });
    }

    if (!confirmPassword) {
      errors.push("error");
      dispatch({ confirm_password_error: "Password confirmation is required" });
    } else if (confirmPassword !== newPassword) {
      errors.push("error");
      dispatch({ confirm_password_error: "Passwords do not match" });
    } else {
      dispatch({ confirm_password_error: "" });
    }

    if (errors.length === 0) resetPasswordInDb();
  };

  // validate username form
  const handleValidateForm = (event) => {
    event.preventDefault();
    if (!(state.user_name || "").trim()) {
      dispatch({ user_name_error: "Username is required" });
    } else {
      dispatch({ user_name_error: "" });
      sendOtp();
    }
  };

  // --- component render ---
  return (
    <div className="guest">
      <div className="card">
        <div className="card-title center">Forgot Password?</div>
        <div className="card-body">
          <Form onSubmit={handleValidateForm}>
            <div className="row">
              <div className="col-12">
                <Input
                  label="Username"
                  name="user_name"
                  type="text"
                  value={state.user_name}
                  error={state.user_name_error}
                  onChange={handleInputChange}
                  autoComplete="on"
                  placeholder="Enter your username"
                />
              </div>

              {state.otp_sent && !state.otp_verified && (
                <>
                  <div className="col-12">
                    <Input
                      label="Enter OTP"
                      name="entered_otp"
                      type="text"
                      value={state.entered_otp}
                      error={state.otp_error}
                      onChange={handleInputChange}
                      placeholder="Check your email"
                    />
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-2">
                    <Button title="Verify OTP" type="button" onClick={verifyOtp} />
                  </div>

                  <div className="col-12 d-flex justify-content-center mt-1">
                    {resendCountdown > 0 ? (
                      <span className="text-muted">
                        Resend code in {resendCountdown}s
                      </span>
                    ) : (
                      <Link
                        to="#"
                        onClick={sendOtp}
                        className="resend-otp-link"
                      >
                        Resend OTP
                      </Link>
                    )}
                  </div>
                </>
              )}

              {state.otp_verified && (
                <>
                  <div className="col-12">
                    <Input
                      label="New Password"
                      name="new_password"
                      type={showPassword1 ? "text" : "password"}
                      value={state.new_password}
                      onChange={handleInputChange}
                      error={state.new_password_error}
                      placeholder="Enter new password"
                      rightIcon={{
                        icon: showPassword1 ? "visibility" : "visibility_off",
                        onClick: togglePasswordVisibility1,
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <Input
                      label="Confirm Password"
                      name="confirm_password"
                      type={showPassword2 ? "text" : "password"}
                      value={state.confirm_password}
                      onChange={handleInputChange}
                      error={state.confirm_password_error}
                      placeholder="Confirm new password"
                      rightIcon={{
                        icon: showPassword2 ? "visibility" : "visibility_off",
                        onClick: togglePasswordVisibility2,
                      }}
                    />
                  </div>
                  
                  <div className="col-12 d-flex justify-content-center mt-2">
                    <Button title="Reset Password" onClick={handleResetPassword} />
                  </div>
                </>
              )}

              {!state.otp_sent && (
                <div className="col-12 d-flex justify-content-center mt-2">
                  <Button
                    className="btn btn-info"
                    loading={state.loading}
                    disabled={state.disabled}
                    title="Send verification code"
                    onClick={handleValidateForm}
                  />
                </div>
              )}

              <div className="col-12 text-end mt-3">
                <Link to="/login" className="guest-link">
                  Already have an account?
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
});

/* exporting component */
export default ForgotPassword;
