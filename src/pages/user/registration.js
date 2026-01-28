import React, { useState, useEffect } from 'react';
import { Form, Input } from "../../components/form";
import { Button } from "../../components/button";
import { encrypt, format_phone } from "../../helpers/functions";
import { Link } from "react-router-dom";

const Registation = React.memo((props) => {
   const { state, dispatch, handleInputChange } = props.application;
    const [showPassword, setShowPassword] = useState(false);
    //
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);
    //console.log(state.user_ess_data)
    useEffect(() => {
        document.title = "Registartion";
       // return () => unMount();
    }, []);

    // --- Fetch ESS user data ---
    async function read_user(token) {
        try {
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
                const user_data = result?.data?.personalEmployeeDetails; 
                if (user_data) {
                    dispatch({ notification: "Successfully loaded ESS user data" });
                    await create_user(user_data);
                } else {
                    dispatch({ notification: "No user data returned from ESS." });
                }
            } else {
                const errorText = await response.text();
                console.log('Failed to fetch ESS user response:', errorText);
                dispatch({ notification: `Failed to fetch ESS user data. Status: ${response.status}` });
            }
        } catch (error) {
            console.log('read_user error:'+ error.message);
            dispatch({ notification: error instanceof Error ? error.message : String(error) });
        }
    }
    // --- Submit login form to ESS ---
    async function submitForm() {
        //dispatch({ loading: true, disabled: true });
        try {
            const formBody = new URLSearchParams();
            formBody.append('username', state.check_number);
            formBody.append('password', state.ess_password);
            formBody.append('grant_type', 'password');
            const response = await props.application.api({
                url: "https://gateway.ess.utumishi.go.tz/ess-uaa/oauth/token",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authorization': 'Basic N2I5NGFjYzktMzRhMi00MTQ4LTlhMzAtNWJkOTk0Yzc1NDE3Ok81MngxM0NoWUdJanYpIWQ='
                },
                body: formBody.toString(),
            });
            if (!response.ok) {
                const text = await response.text();
                console.log(`Login failed: ${response.status} ${text}`);
            }
            const result = await response.json();
            const ess_token = result.access_token
            read_user(ess_token);
        } catch (error) {
            dispatch({ notification: 'fail to get account detailsa ' });
        } 
    }
    // --- Create local user in DB using ESS data ---
    async function create_user(ess_data) {
        try {
            if (!ess_data) {
                dispatch({ notification: "No ESS data available to create user" });
            }
            const payload = {
                full_name: `${ess_data.firstName || ''} ${ess_data.middleName || ''} ${ess_data.lastName || ''}`.trim(),
                user_name: ess_data.checkNumber || '',
                phone_number: format_phone(ess_data.mobileNumber) || '',
                email: ess_data.email || '',
                address: ess_data.workstationName || '',
                gender: ess_data.sex === "F"?"Female":"Male",
                role_id: state.role_id || 1, // default role_id
                designation: ess_data.designationName || '',
                job_code:ess_data.jobCode || '',
                //dateHired
                date_hired: ess_data.dateHired || null,
                retirement_date: ess_data.retirementDate || null,
                confirmation_date: ess_data.confirmationDate || null,
                department_code:ess_data.department?.departmentCode || null,
                //department_id: ess_data.department?.departmentCode || null,
                department_name: ess_data.department?.departmentName || '',
                status: "active",
                birth_date:ess_data.birthDate,
                national_id:ess_data.nationalId || '',
                password: encrypt({ password: state.ess_password }).encrypted || "", // encrypted default password
            };
            //console.log(payload)
            const response = await props.application.post({
                route: 'create',
                body: { table: 'users', data: payload }
            });
            if (response?.success) {
                dispatch({ notification: "Created successfully!" });
            } else if(response?.message && response.message.includes("ER_DUP_ENTRY: Duplicate entry")){
                dispatch({ notification: "User already exists!" });
            }else{
                dispatch({ notification: "Failed to create user. Contact Head of Department!" });
            }
        } catch (error) {
            console.error('Create user error:', error);
            dispatch({ notification: error instanceof Error ? error.message : String(error) });
        } 
    }
    // --- Form validation ---
    async function validateForm(event) {
        event.preventDefault();
        try {
            dispatch({ check_number_error: '', ess_password_error: '' });
            const errors = [];
            if (!state.check_number?.trim()) {
                errors.push("error");
                dispatch({ check_number_error: "Check number is required" });
            }
            if (!state.ess_password) {
                errors.push("error");
                dispatch({ ess_password_error: "Password is required" });
            }
            if (!errors.length) {
                await submitForm();
            }
        } catch (error) {
            dispatch({ notification: error instanceof Error ? error.message : String(error) });
        }
    }
    return (
        <div className="guest">
            <div className="card">
                <div className="card-title center">Create User Menu!</div>
                <div className="card-body">
                    <Form onSubmit={validateForm}>
                        <div className="row">
                            <div className="col s12">
                                <Input
                                    label="Check Number"
                                    name="check_number"
                                    type="text"
                                    value={state.check_number}
                                    error={state.check_number_error}
                                    onChange={handleInputChange}
                                    placeholder="Enter your check number"
                                    autoComplete="on"
                                    autoFocus
                                />
                            </div>
                        </div>
                     {state.check_number && (
                        <div className="row">
                            <div className="col s12">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="ess_password"
                                    value={state.ess_password}
                                    error={state.ess_password_error}
                                    onChange={handleInputChange}
                                    autoComplete="off"
                                    placeholder="Enter your account password"
                                    rightIcon={{
                                        icon: showPassword ? "visibility" : "visibility_off",
                                        onClick: togglePasswordVisibility,
                                    }}
                                />
                            </div>
                        </div>
                     )}
                        <div className="row">
                            <div className="col s12 m6 l6 left-align">
                                <Link to="/login" className="guest-link right-link">
                                    Already have an account
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

export default Registation;
