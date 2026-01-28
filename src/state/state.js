import { socketURL } from "../helpers/functions";

/* application initial state */

const initialState = {
  /* user initial state */
  socket: require("socket.io-client")(socketURL, {}),
  loading: false,
  disabled: false,
  id: "",
  ids: [],
  online_users: [],
  authenticated: false,
  database: "vartrick",
  table: "users",
  files: [],
  file: null,
  filesError: "",
  options: {},
  notification: "",

  //tables lists
  users: [],
  roles: [],
  departments: [],
  jobs: [],

// ============================
// User Menu
// ============================
// login
  user_name: "",
  user_name_error: "",
  showPassword: false,
  password: "",
  password_error: "",
//change password 
  old_password: "",
  old_password_error: "",
  new_password: "",
  new_password_error: "",
  password_confirmation: "",
  password_confirmation_error: "",
//reset password
  search_text: "",
  search_data: [],

//register user
check_number:"",
ess_password:"",

//create user
full_name: "",
full_name_error: "",
email: "",
email_error: "",
address: "",
address_error: "",
phone_number: "",
phone_number_error: "",
gender: "",
gender_error: "",
role_id: "",
role_id_error: "",
designation: "",
designation_error: "",
department_id: "",
department_error: "",
status: "",
status_error: "",



// Department Menu
//Create department
department_name: "",
department_name_error: "",
department_description: "",
department_description_error: "",
hod: "",              // Department Head (user id)
hod_error: "",
assist_hod: "",       // Assistant Head (user id)
assist_hod_error: "",
department_location: "",
department_location_error: "",
department_phone: "",
department_phone_error: "",
department_status: "",  // "active" / "inactive"
department_status_error: "",


  // ============================
  // Jobs Menu
  // ============================
  // create job
  assigned_department: "",
  job_id: "",
  descriptions: "",
  location: "",
  instrument: "",
  emergency: "",
  saved_job_id: null,
  assigned_department_error: "",
  job_subsection_id_error: "",
  descriptions_error: "",
  location_error: "",
  instrument_error: "",
  emergency_error: "",

//jobs menu
// create job

//assign job
 
//attempt job

//list job


    


}

/* export initial state for global accessibility */
export default initialState