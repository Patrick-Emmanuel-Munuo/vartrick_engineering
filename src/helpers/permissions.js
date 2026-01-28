/* menus */
export const Permissions = [
    // Dashboard menu
    {
        name: "view_dashboard",
        menu: "dashboard",
        id: 9000,
        description: "Allows viewing the dashboard"
    },


    // Departments menu
    {
        name: "view_menu",
        menu: "department",
        id: 1000,
        description: "Allows viewing department menus"
    },
    {
        name: "edit",
        menu: "department",
        id: 1001,
        description: "Allows editing department details"
    },
    {
        name: "delete",
        menu: "department",
        id: 1002,
        description: "Allows deleting department records"
    },
    {
        name: "create",
        menu: "department",
        id: 1003,
        description: "Allows creating new departments"
    },
    {
        name: "list",
        menu: "department",
        id: 1004,
        description: "Allows list department details"
    },


    
    // User menu
    {
        name: "view_menu",
        menu: "user",
        id: 2000,
        description: "Allows viewing user menu"
    },
    {
        name: "edit",
        menu: "user",
        id: 2001,
        description: "Allows editing user details"
    },
    {
        name: "delete",
        menu: "user",
        id: 2002,
        description: "Allows deleting user records"
    },
    {
        name: "create",
        menu: "user",
        id: 2003,
        description: "Allows creating new user"
    },
    {
        name: "list_all",
        menu: "user",
        id: 2004,
        description: "Allows list all user details"
    },
    {
        name: "list_department",
        menu: "user",
        id: 2005,
        description: "Allows list user department details"
    },
    {
        name: "reset_department_password",
        menu: "user",
        id: 2006,
        description: "Allows reset password user password"
    },
    {
        name: "change_own_password",
        menu: "user",
        id: 2007,
        description: "Allows user to change their own password"
    },
    {
        name: "view_login_history",
        menu: "users",
        id: 2008,
        description: "Allows viewing login history"
    },
    {
        name: "reset_all_password",
        menu: "users",
        id: 2009,
        description: "Allows reset password all users password"
    },
    //2001
    {
        name: "manage_all_users",
        menu: "users",
        id: 2010,
        description: "Allows view and reset all users"
    },
    {
        name: "view_online users",
        menu: "user",
        id: 2020,
        description: "Allows viewing user menu"
    },

    // Role menu
    {
        name: "view_menu",
        menu: "role",
        id: 3000,
        description: "Allows viewing role menu"
    },
    {
        name: "edit",
        menu: "role",
        id: 3001,
        description: "Allows editing user role details"
    },
    {
        name: "delete_user",
        menu: "role",
        id: 3002,
        description: "Allows deleting user role records"
    },
    {
        name: "create",
        menu: "role",
        id: 3003,
        description: "Allows creating user new role"
    },
    {
        name: "list",
        menu: "role",
        id: 3004,
        description: "Allows list all role details"
    },
    {
        name: "view",
        menu: "role",
        id: 3005,
        description: "Allows viewing role details"
    },





    // Job permissions
    {
        name: "view_menu",
        menu: "job",
        id: 4000,
        description: "Allows access to job menu"
    },
    {
        name: "request",
        menu: "job",
        id: 4001,
        description: "Allows job request creation"
    },

    //assign
    {
        name: "assign_departments",
        menu: "job",
        id: 4002,
        description: "Allows assign departments job"
    },

    //attempt jobs
    {
        name: "attempt_department",
        menu: "job",
        id: 4003,
        description: "Allows attempt_departments job"
    },
    {
        name: "approove_department",
        menu: "job",
        id: 4005,
        description: "Allows approove departments job"
    },

    //lists
    {
        name: "request_department_list",
        menu: "job",
        id: 4006,
        description: "Allows viewing job departments list"
    },
    {
        name: "assigned_department_list",
        menu: "job",
        id: 4007,
        description: "Allows viewing assigned department list jobs"
    },
    {
        name: "delete",
        menu: "job",
        id: 4008,
        description: "Allows deleted jobs"
    },

    //job report
    {
        name: "view_report",
        menu: "job",
        id: 4009,
        description: "Allows viewing job report"
    },





    // Maintenance permissions
    {
        name: "view_menu",
        menu: "maintenance",
        id: 5000,
        description: "Allows access to maintenance menu"
    },
    {
        name: "create_inventory",
        menu: "maintenance",
        id: 5001,
        description: "Allows inventory creation"
    },
    {
        name: "list_inventory",
        menu: "maintenance",
        id: 5002,
        description: "Allows inventory listing"
    },
    {
        name: "create_inspection",
        menu: "maintenance",
        id: 5003,
        description: "Allows inspection entry"
    },
    {
        name: "list_inspections",
        menu: "maintenance",
        id: 5004,
        description: "Allows viewing inspection list"
    },
    {
        name: "create_service",
        menu: "maintenance",
        id: 5005,
        description: "Allows creating service"
    }
];