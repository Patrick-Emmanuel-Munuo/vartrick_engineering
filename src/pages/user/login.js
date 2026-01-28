import React, { useState } from 'react';
import { Form, Input } from "../../components/form";
import { Button } from "../../components/button";
import { encrypt, storage, getInfo } from "../../helpers/functions";
import { Link } from "react-router-dom";

const Login = React.memo((props) => {
    const { state, dispatch, handleInputChange, authenticate, unMount } = props.application;
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    React.useEffect(() => {
        document.title = "Login";
        //read_roles();
        return () => unMount();
    }, []);

    
    async function submitForm() {
        dispatch({ loading: true, disabled: true });
        try {
            const response = await props.application.post({
                route: 'login',
                body: {
                    table: 'users',
                    condition: {
                        //password: encrypt({password:state.password}).encrypted ||"",
                        user_name: state.user_name,
                        status: 'active',
                        delated: 0,
                    },
                    //select: { role_id: "", id: "" },
                },
            });
            //console.log(response)
            if (response.success) {
                const user = response.message;
                storage.store("token", user[0].token? user[0].token : "");
                const result = await props.application.post({
                  route: 'create',
                  body: {
                    table: 'login_history',
                    data: {
                        user_id: user[0].id,
                        created_by: user[0].id,
                        //created_date: time_now,
                        ip_address:user[0].user_browser.ip_address,
                        login_device:user[0].user_browser.os ,
                        browser_name: user[0].user_browser.browser_name ,
                        browser_version: user[0].user_browser.browser_version,
                        host:user[0].user_browser.host,
                        time_zone:Intl.DateTimeFormat().resolvedOptions().timeZone,
                    },
                },
                });
                if (result.success) {
                     const role_data = await props.application.post({
                       route: 'read',
                       body: {
                         table: 'roles',
                         condition: { delated: 0, status: 'active', id:user[0].role_id },
                         select: { name: "", id: "", data: "" },
                       },
                     });
                     //console.log({role_data: role_data.message[0].data})
                     if (role_data.success) {
                       storage.store("roles", role_data.message[0].data);
                     } else {
                       storage.remove('roles');
                     }
                 authenticate("login",user);
                 dispatch({ notification: 'Successful login' });  
                }else{
                  dispatch({ notification: 'Failed to record login. Please contact IT support.' });
                }
            }else{
                  dispatch({ notification: 'Incorrect username or password. Please contact Head of Department.' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                dispatch({ notification: "error in submitForm " + error.message });
            } else {
                console.error(error);
            }
        } finally {
            dispatch({ loading: false, disabled: false });
        }
    }

    function validateForm(event) {
        try {
        event.preventDefault();
        const errors = [];
        if (state.user_name.trim() === "") {
            errors.push("error");
            dispatch({ user_name_error: "Account username or phone number is required" });
        }
        if (state.password === "") {
            errors.push("error");
            dispatch({ password_error: "Account password is required" });
        } else if (state.password.length < 4) {
            errors.push("error");
            dispatch({ password_error: "Account password must have at least 4 characters" });
        }
        if (errors.length === 0) {
            submitForm();
        }
    } catch (error) {
        if (error instanceof Error) {
            dispatch({ notification: error.message });
        } else {
             console.error(error);
        }
    } finally {
            dispatch({ loading: false, disabled: false });
        }
    }

    return (
        <div className="guest">
            <div className="card">
                <div className="card-title center">Login Menu!</div>
                <div className="card-body">
                    <Form onSubmit={validateForm}>
                        <div className="row">
                            <div className="col s12">
                                <Input
                                    label="User Name"
                                    name="user_name"
                                    type="text"
                                    value={state.user_name}
                                    error={state.user_name_error}
                                    onChange={handleInputChange}
                                    placeholder="Enter your username"
                                    autoComplete="on"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name = 'password'
                                    value={state.password}
                                    error={state.password_error}
                                    onChange={handleInputChange}
                                    autoComplete="on"
                                    placeholder="Enter your account password"
                                    rightIcon={{
                                        icon: showPassword ? "visibility" : "visibility_off",
                                        onClick: togglePasswordVisibility,
                                    }}
                                />

                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m6 l6 left-align">
                                <Link to="/registration" className="guest-link right-link hide">
                                    Create Account
                                </Link>
                            </div>
                            <div className="col s12 m6 l6 right-align">
                                <Link to="/forgot-password" className="guest-link right-link">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 center">
                                <Button
                                    className="btn btn-info"
                                    title="Login"
                                    loading={state.loading}
                                    disabled={state.disabled}
                                    onClick={validateForm}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
});

export default Login;
