import { permission } from "./functions";

const menus = [
  {
    title: "dashboard",
    link: "/dashboard",
    icon: "dashboard",
    visible: (9000),
  },

  {
    title: "Departments",
    link: "#",
    icon: "verified",
    visible: permission(1000),
    hasSubMenu: true,
    subMenu: [
      {
        title: "Create",
        link: "/department/create",
        visible: permission(1003),
      },
      {
        title: "lists",
        link: "/department/list",
        visible: permission(1004),
      },
    ],
  },

  {
    title: "user",
    link: "#",
    icon: "groups",
    visible: permission(2000),
    hasSubMenu: true,
    subMenu: [
      {
        title: "create",
        link: "/user/create",
        visible: permission(2003),
      },
      {
        title: "bulk-create",
        link: "/user/bulk",
        visible: permission(2003),
      },
      {
        title: "list",
        link: "/user/list",
        visible: permission(2004) || permission(2005),
      },
      {
        title: "password",
        link: "/user/password",
        visible: permission(2007), // newly added permission ID
      },
      {
        title: "reset-password",
        link: "/user/reset-password",
        visible: permission(2006)|| permission(2009),
      },
      {
        title: "login history",
        link: "/user/history",
        visible: permission(2008), // newly added permission ID
      },
    ],
  },

  {
    title: "Job",
    link: "#",
    icon: "home_repair_service",
    visible: permission(4000),
    hasSubMenu: true,
    subMenu: [
      {
        title: "Request",
        link: "/job/create",
        visible: permission(4001),
      },
      {
        title: "assign",
        link: "/job/assigned",
        visible: permission(4002),
      },
      {
        title: "job list",
        link: "/job/list",
        visible: permission(4006)||permission(4007)||permission(4008),
      },
      {
        title: "attempt",
        link: "/job/attempt",
        visible: permission(4003)||permission(4005),
      },/*
      {
        title: "create_task",
        link: "/job/task",
        visible: permission(4005),
      },
      {
        title: "task_attempt",
        link: "/job/task_attempt",
        visible: permission(4006),
      },*/
      {
        title: "Report",
        link: "/job/report",
        visible: permission(4009),
      },
    ],
  },

  {
    title: "maintanance",
    link: "#",
    icon: "home_repair_service",
    visible: permission(5000),
    hasSubMenu: true,
    subMenu: [
      {
        title: "inventory",
        link: "/maintanance/create",
        visible: permission(5001),
      },
      {
        title: "inventory-list",
        link: "/maintanance/list",
        visible: permission(5002),
      },
      {
        title: "inspection",
        link: "/maintanance/inspection",
        visible: true,//permission(5002),
      },
      {
        title: "inspection-report",
        link: "/maintanance/inspection-report",
        visible: true,//permission(5002),
      },
      {
        title: "service",
        link: "/maintanance/service",
        visible: permission(5005),
      },
    ],
  },

  {
    title: "Roles",
    link: "#",
    icon: "groups",
    visible: permission(3000),
    hasSubMenu: true,
    subMenu: [
      {
        title: "create",
        link: "/role/create",
        visible: permission(3003),
      },
      {
        title: "list",
        link: "/role/list",
        visible: permission(3004),
      },
    ],
  },
];

export default menus;
