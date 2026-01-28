import CryptoJS from "crypto-js"
import moment from "moment"
export  const permissions = require("./permissions")

// Environment configuration
export const enable_encryption = process.env.REACT_APP_ENCRIPTION === "true" ?? false;
const initialization_vector = process.env.REACT_APP_ENCRIPTION_INITIALIZE; // must be 16 chars
const encryption_key = process.env.REACT_APP_ENCRIPTION_KEY; // must be 16 chars


// Server URLs
export const url = "http://localhost:2000"//process.env.REACT_APP_BACKEND_SERVER ??"http://192.168.15.159:2000"
export const socketURL = "http://localhost:2000"
export const serverUrl = url + "/api/v1";
export const applicationName = process.env.REACT_APP_APP_NAME ?? "Vartrick System";

// Common date format
const date_format = "DD-MM-YYYY HH:mm:ss";

/*Handle predefined date ranges */
export const date_format_difference = (value) => {
  try {
    let start = "";
    let end = "";
    const today = moment();
    switch (value) {
      case "today":
        start = end = today.format("DD-MM-YYYY");
        break;
      case "yesterday":
        const yesterday = moment().subtract(1, "days");
        start = end = yesterday.format("DD-MM-YYYY");
        break;
      case "week":
        const firstDayOfWeek = moment().startOf("week"); // Sunday as first day
        start = firstDayOfWeek.format("DD-MM-YYYY");
        end = today.format("DD-MM-YYYY");
        break;
      case "month":
        const firstDayOfMonth = moment().startOf("month");
        start = firstDayOfMonth.format("DD-MM-YYYY");
        end = today.format("DD-MM-YYYY");
        break;
      case "last_month":
        const firstDayLastMonth = moment()
          .subtract(1, "month")
          .startOf("month");
        const lastDayLastMonth = moment().subtract(1, "month").endOf("month");
        start = firstDayLastMonth.format("DD-MM-YYYY");
        end = lastDayLastMonth.format("DD-MM-YYYY");
        break;
      case "year":
        const firstDayOfYear = moment().startOf("year");
        start = firstDayOfYear.format("DD-MM-YYYY");
        end = today.format("DD-MM-YYYY");
        break;
      case "manual":
        start = end = "";
        break;

      default:
        break;
    }
    return { start, end };
  } catch (error) {
    console.error("date_format_difference error:", error?.message ?? error);
    return { start: "", end: "" };
  }
};

/* Flexible date formatter */
export const format_date = (input, mode = "format", extra = null) => {
  try {
    const m = input ? moment(input) : moment();
    switch (mode) {
      case "format":
        return m.format(extra || date_format);

      case "year":
        return m.year();

      case "month":
        return m.month() + 1; // month is 0-indexed

      case "relative":
        return m.fromNow();

      case "now":
        return moment().format(extra || date_format);

      case "add":
        if (typeof extra === "number") {
          return moment().add(extra, "hours").format(date_format);
        }
        throw new Error("Extra must be number of hours for 'add' mode");

      default:
        return m.format(date_format);
    }
  } catch (error) {
    console.error("format_date error:", error?.message ?? error);
    return "N/A";
  }
};


export function format_phone(num) {
  if (!num) return "";
  let phone = num.trim();
  if (phone.startsWith("0")) {
    return "+255" + phone.slice(1);
  } else if (!phone.startsWith("+255")) {
    return "+255" + phone;
  }
  return phone;
};
// Permission Check
export function permission(id) {
  try {
    const role = storage.retrieve("roles") ?? "";
    const permissionList = role?.split(",")?.map((p) => p.trim()) ?? [];
    return permissionList.includes(id?.toString());
  } catch (error) {
    console.error(error?.message ?? "Permission check failed");
    sessionStorage.clear();
    return false;
  }
}
// Storage operations
export const storage = {
  clear: () => sessionStorage.clear(),
  retrieve: (key) => {
    try {
      const payload = sessionStorage.getItem(key);
      if (!payload) return null;
      const parsed = JSON.parse(payload);
      if (enable_encryption && parsed?.encrypted) {
        const decrypted = decrypt(parsed.encrypted);
        return decrypted ? decrypted : null;
      }
      return parsed;
    } catch (error) {
      console.log("Storage retrieve error:", error?.message ?? error);
      return null;
    }
  },
  store: (key, data) => {
    try {
      const toStore = enable_encryption ? JSON.stringify(encrypt(data)) : JSON.stringify(data);
      sessionStorage.setItem(key, toStore);
    } catch (error) {
      console.error("Storage store error:", error?.message ?? error);
    }
  },
  remove: (key) => sessionStorage.removeItem(key),
};
// Get info from stored object
export const getInfo = (key, info) => {
  try {
    const data = storage.retrieve(key);
    if (!data) return null;
    return info ? data?.[0]?.[info] ?? null : data;
  } catch (error) {
    console.error(error?.message ?? "getInfo failed");
    sessionStorage.clear();
    return null;
  }
};
// Encryption
export function encrypt(data) {
  try {
    if (!enable_encryption) return { data };
    if (!encryption_key || encryption_key.length !== 16)
      throw new Error("Encryption key must be 16 characters long");
    if (!initialization_vector || initialization_vector.length !== 16)
      throw new Error("Initialization vector must be 16 characters long");

    const key = CryptoJS.enc.Utf8.parse(encryption_key);
    const iv = CryptoJS.enc.Utf8.parse(initialization_vector);
    const encrypted_data = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    return { data: encrypted_data };
  } catch (error) {
    console.error("Encrypt function error:", error?.message ?? error);
    return { data: { success: false, message: error?.message ?? "Encrypt error" } };
  }
}
// Decryption
export function decrypt(data) {
  try {
    if (!enable_encryption) return data ;
    if (!encryption_key || encryption_key.length !== 16)
      throw new Error("Decryption key must be 16 characters long");
    if (!initialization_vector || initialization_vector.length !== 16)
      throw new Error("Initialization vector must be 16 characters long");

    const key = CryptoJS.enc.Utf8.parse(encryption_key);
    const iv = CryptoJS.enc.Utf8.parse(initialization_vector);

    const decrypted = CryptoJS.AES.decrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(result);
    //return { success: true, data: JSON.parse(result) };
  } catch (error) {
    console.error("Decrypt function error:", error?.message ?? error);
    return { success: false, message: error?.message ?? "Decrypt error" };
  }
}
// Number padStart
export function padStart(data, zero) {
  try {
    if (zero == null || isNaN(zero) || zero <= 0) return String(data);
    return String(data).padStart(zero, "0");
  } catch (error) {
    console.error("padStart function error:", error?.message ?? error);
    return "N/A";
  }
}

// Data table config
export const config = {
  no_data_text: "No data available!",
  page_size: 10,
  show_length_menu: true,
  show_filter: true,
  show_pagination: true,
  show_info: true,
  length_menu: [10, 20, 30, 50, 75, 100],
  button: { excel: false, print: false },
};

// Designations
export const designations = [
  { name: "Director" },
  { name: "Biomedical Engineer" },
  { name: "Electrical Engineer" },
  { name: "Civil Engineer" },
  { name: "IT" },
  { name: "Architect" },
  { name: "Quantity Surveyor" },
  { name: "Civil Technician" },
  { name: "Biomedical Technician" },
  { name: "Electrical Technician" },
  { name: "Mechanical Technician" },
  { name: "Water and Plumbing Technician" },
  { name: "Artisan" },
  { name: "HR Manager" },
  { name: "Doctor" },
  { name: "Nurse" },
  { name: "Medical Attendant" },
  { name: "Specialist" },
  { name: "Pharmacist" },
  { name: "Radiologist" },
  { name: "Procurement Officer" },
  { name: "Others" },
];