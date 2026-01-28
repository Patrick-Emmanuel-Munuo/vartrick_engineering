/* require modules */
//import moment from "moment"
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

/* requiring dependencies */
import { serverUrl, storage, decrypt, encrypt, enable_encryption } from "./functions"
 class FUNCTIONS {
    constructor(state, dispatch) {
        this.state = state
        this.dispatch = dispatch
    }
    /* default headers for all requests */
    get headers() {
        return {
            'Content-Type': 'application/json',
            'Authorization': storage.retrieve("token") ? `Bearer ${storage.retrieve("token")}` : "",
            "Accept": "application/json",
           // "Cache-Control": "no-cache",
            //"Pragma": "no-cache",
            //"X-Platform": "Web",
            //"User-Agent": "VartrickApp/1.0 (ReactJS)"
        };
    }
/* server url */

/* all types of api request */
 api= async (options) =>{
    try {
        var headers, body, url, method;
        this.dispatch({ loading: true })
        url = options.url;
        headers = options.headers;
        body = options.body;
        method = options.method;
        let response = await fetch(url, {
            method,
            body,
            headers
        })

        response = await response;
        this.dispatch({ loading: false });
        //console.log(response);
        return response;
    } catch (error) {
        this.dispatch({loading: false})
        if (error instanceof Error){
            console.log(error.message)
        }else{
            console.error(error)
        }
        return { success: false, message: error }
    }
}
/* get request */
 get = async (options) => {
    try {
        var route, parameters;
        this.dispatch({ loading: true })
        route = options.route;
        parameters = options.parameters;
        let response = await fetch(`${serverUrl}/${route}?${parameters}`, {
            method: 'GET',
            mode: 'cors',
            headers:this.headers
        })
       //check for authorization
        if (response.status === 401) { // Unauthorized
            this.dispatch({ notification: 'Session expired. Please log in again.' });
            this.authenticate('logout');
        }
        response = await response.json()
        this.dispatch({loading: false})
        // returning response
        if (enable_encryption) {
            response = decrypt(response)
        }
        return response
    } catch (error) {
        this.dispatch({loading: false})
        if (error instanceof Error){
            console.log(error.message)
        }else{
            console.error(error)
        }
        return { success: false, message: error }
    }
}
/* all post request */
 post= async (options) =>{
    try {
        var route, body;
        this.dispatch({ loading: true })
        route = options.route;
        body = options.body;
        let response = await fetch(`${serverUrl}/${route}`, {
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(encrypt(body)), // send JSON
            headers:this.headers
        })
        //console.log({headers: this.headers})
        //check for authorization
        if (response.status === 401) { // Unauthorized
            this.dispatch({ notification: 'Session expired. Please log in again.' });
            this.authenticate('logout');
        }
        response = await response.json();
        this.dispatch({ loading: false });
        if (enable_encryption && response.encrypted) {
            response = decrypt(response.encrypted);
        }
        return response;
    } catch (error) {
        this.dispatch({loading: false})
        if (error instanceof Error){
            console.log(error.message)
        }else{
            console.error(error)
        }
        return { success: false, message: error }
    }
}
/* all put request */
put= async (options) =>{
    try {
        var route, body;
        this.dispatch({ loading: true })
        route = options.route;
        body = options.body;
        let response = await fetch(`${serverUrl}/${route}`, {
            mode: 'cors',
            method: 'PUT',
            body: JSON.stringify(body),
            headers:this.headers
        })
        //check for authorization
        if (response.status === 401) { // Unauthorized
            this.dispatch({ notification: 'Session expired. Please log in again.' });
            this.authenticate('logout');
        }
        response = await response.json()
        this.dispatch({loading: false})
        // returning response
        if (enable_encryption) {
            response = decrypt(response)
        }
        return response
    } catch (error) {
        this.dispatch({loading: false})
        if (error instanceof Error){
            console.log(error.message)
        }else{
            console.error(error)
        }
        return { success: false, message: error }
    }
}
// Component unmounting
unMount = () => {
    this.dispatch({ unMount: { ...this.state } })
}
/* Handle input change */
handleInputChange = (event) => {
    try {
        const { name, value } = event?.target ?? {}
        if (name) this.dispatch({ [name]: value })
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* File handling */
handleFileChange = (event) => {
    try {
        const files = event?.target?.files
        if (files?.length) {
            this.dispatch({ files, file: files[0], filesError: "" })
            if (files[0]?.type?.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                this.excelToArray(files[0])
            } else if (files[0]?.type?.includes("image/")) {
                this.dispatch({ image: files[0]?.name })
            }
        } else {
            this.dispatch({ files: null, filesError: "File is required" })
        }
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Authentication login/logout */
authenticate = (action, data) => {
    try {
        if (action === 'login' && data) {
            storage.store("user", data)
            this.dispatch({ authenticated: true })
            window.location.href = "/dashboard"
        } else {
            storage.remove('user')
            storage.remove('roles')
            storage.remove('token')
            this.dispatch({ authenticated: false })
            window.location.href = "/"
        }
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Retrieve user from local storage */
retrieveUserAndAuthenticate = () => {
    try {
        const user = storage.retrieve("user")
        if (user) {
            this.dispatch({ authenticated: true })
            return user
        } else {
            this.dispatch({ authenticated: false })
            storage.remove('user')
            storage.remove('roles')
            storage.remove('token')
            return null
        }
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Toggle sidebar */
toggleSidebar = () => {
    try {
        const body = document?.querySelector("body")
        body?.classList.toggle("toggle-sidebar")
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Close sidebar on smaller screens */
closeSidebar = () => {
    try {
        const body = document?.querySelector("body")
        body?.classList.remove("toggle-sidebar")
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Toggle component visibility */
toggleComponent = (name) => {
    try {
        const component = document?.querySelector(`.${name}`)
        component?.classList.toggle("show")
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Open confirmation dialog */
openDialog = (delate_options) => {
    try {
        this.toggleComponent("dialog")
        this.dispatch({ delate_options })
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Unknown error' })
        console.error(error)
    }
}
/* Update dialog action */
updateDialogue = async () => {
  try {
    const { delate_options = {} } = this.state ?? {};
    const { id, table, status = 1, filter_data } = delate_options;

    if (!id || !table) return;

    this.dispatch({ notification: `Updating status to ${status}...` });
    this.toggleComponent?.("dialog");

    // Perform update request
    const response = await this.post({
      route: "update",
      body: {
        table,
        condition: { id },
        data: { delated: status },
      },
    });
    // Clear dialog options
    this.dispatch({ delate_options: {} });
    if (response?.success) {
      this.dispatch({
        notification: `Successfully ${status === 1 ? "deleted" : "restored"} the record.`,
      });
      // Update local state: use filter_data if provided, else default filter
      // Determine which state key to filter
      const state_key = filter_data ?? table;
      // Update local state by filtering out the deleted item
      const updated_data =
        this.state?.[state_key]?.filter((item) => item?.id !== id) ?? [];
      this.dispatch({ [state_key]: updated_data });
    } else {
      this.dispatch({ notification: "Failed to update record status!" });
    }
  } catch (error) {
    this.dispatch({ notification: error?.message ?? "Unknown error" });
    console.error("Error updating dialogue:", error);
  }
};
 
/* Convert Excel file to JSON array */
excelToArray = (file) => {
    try {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json_data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            if (!json_data.length) {
                this.dispatch({ files_error: "No data found in file" });
                return;
            }
            this.dispatch({ file_data: json_data, filesError: "" });
        };
        reader.readAsBinaryString(file);
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Error reading Excel file' });
        console.log(error.message);
    }
}
/* Convert JSON to Excel and download using FileSaver */
jsonToExcel = (jsonData, fileName = "download.xlsx") => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        FileSaver.saveAs(data, fileName);
    } catch (error) {
        this.dispatch({ notification: error?.message ?? 'Error generating Excel file' });
        console.error(error);
    }
}



    
}
/* export API class for global accessibility */
export default FUNCTIONS