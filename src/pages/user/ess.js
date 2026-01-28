import React, { useState } from 'react';
import { Form, Input } from "../../components/form";
import { Button } from "../../components/button";
import { time_now, encrypt } from "../../helpers/functions";
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

//const token = 'nNmH4Gpihm-qrUEECQRsqsrJeBU';
async function read_user() {
    dispatch({ loading: true, disabled: true });

    try {
        const token = sessionStorage.getItem('ess_token');
        const response = await props.application.api({
            url: `https://gateway.ess.utumishi.go.tz/ess-settings/graphql?access_token=${token}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                operationName: "personalEmployeeDetails",
                variables: {},
                query: `
                    query personalEmployeeDetails {
                        personalEmployeeDetails {
                            id
                            firstName
                            middleName
                            lastName
                            designationName
                            dutyPostName
                            checkNumber
                            sex
                            jobCode
                            workstationCode
                            nationalId
                            workstationName
                            birthDate
                            dateHired
                            retirementDate
                            confirmationDate
                            contractEndDate
                            contractStartDate
                            teachingLevelCode
                            teachingLevelName
                            workstationId {
                                id
                                street {
                                    id
                                    ward {
                                        id
                                        district {
                                            id
                                            districtCode
                                            districtName
                                            __typename
                                        }
                                        __typename
                                    }
                                    __typename
                                }
                                __typename
                            }
                            email
                            mobileNumber
                            organization {
                                id
                                organizationName
                                organizationCode
                                hasPerspectives
                                organizationType {
                                    organizationTypeCode
                                    organizationTypeName
                                    id
                                    __typename
                                }
                                __typename
                            }
                            department {
                                id
                                departmentCode
                                departmentName
                                isUnit
                                __typename
                            }
                            section {
                                id
                                sectionCode
                                sectionName
                                __typename
                            }
                            accountNumber
                            branchName
                            __typename
                        }
                    }
                `
            })
        });

        if (response.ok) {
            const result = await response.json();
            dispatch({data:result.data.personalEmployeeDetails}); // <-- Store to state
            console.log('User Details:', result);
            // You can dispatch or store result.data.personalEmployeeDetails as needed
        } else {
            const errorText = await response.text();
            console.error('GraphQL error response:', errorText);
            dispatch({ notification: `Failed to fetch user data. Status: ${response.status}` });
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

async function submitForm() {
    dispatch({ loading: true, disabled: true });
    try {
        const formBody = new URLSearchParams();
        formBody.append('username', state.user_name);//'113162465',
        formBody.append('password', state.password);//'Variable98@',
        formBody.append('grant_type', 'password');
        const response = await props.application.api({
                url:"https://gateway.ess.utumishi.go.tz/ess-uaa/oauth/token",
                method: 'POST',
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "authorization":"Basic N2I5NGFjYzktMzRhMi00MTQ4LTlhMzAtNWJkOTk0Yzc1NDE3Ok81MngxM0NoWUdJanYpIWQ="
                },
                body: formBody.toString(),
            });
        if (!response.ok) {
            const text = await response.text(); // Try to get error details
            throw new Error(`Login failed: ${response.status} ${text}`);
        }
        const result = await response.json();
        console.log('Login success:', result);
        dispatch({ notification: 'success' });
        dispatch({ ess_token:  result.access_token });
        sessionStorage.setItem('ess_token', result.access_token);
    } catch (error) {
        console.error('Login error:', error);
        dispatch({ notification: error.message });
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
                                    label="check_number"
                                    name="user_name"
                                    type="text"
                                    value={state.user_name}
                                    error={state.user_name_error}
                                    onChange={handleInputChange}
                                    placeholder="Enter your check_number"
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
                                <Button
                                    className="btn btn-info"
                                    title="Read"
                                    loading={state.loading}
                                    disabled={state.disabled}
                                    onClick={read_user}
                                />
                                <pre style={{
        backgroundColor: '#f4f4f4',
        padding: '1rem',
        borderRadius: '6px',
        fontSize: '14px',
        overflowX: 'auto'
      }}>{JSON.stringify(state.data, null, 2)}</pre>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
});

export default Login;
