import { permission } from "./functions";

const menus = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: "dashboard",
    visible: permission(1000),
  },

  // ===== Users =====
  {
    title: "Users",
    link: "#",
    icon: "groups",
    visible: permission(2000),
    hasSubMenu: true,
    subMenu: [
      { title: "Create", link: "/user/create", visible: permission(2001) },
      { title: "Bulk Create", link: "/user/bulk", visible: permission(2002) },
      { title: "List", link: "/user/list", visible: permission(2004) || permission(2005) },
      { title: "Password", link: "/user/password", visible: permission(2007) },
      { title: "Reset Password", link: "/user/reset-password", visible: permission(2006) || permission(2009) },
      { title: "Login History", link: "/user/history", visible: permission(2008) },
    ],
  },

  // ===== Products =====
  {
    title: "Products",
    link: "#",
    icon: "inventory_2",
    visible: permission(4000),
    hasSubMenu: true,
    subMenu: [
      { title: "Create", link: "/product/create", visible: permission(4001) },
      { title: "Supply", link: "/product/supply", visible: permission(4002) },
      { title: "Bulk Create", link: "/product/bulk-create", visible: permission(4003) },
      { title: "Stock Update", link: "/product/stock-update", visible: permission(4004) },
      { title: "List", link: "/product/list", visible: permission(4005) },
    ],
  },

  // ===== Selling =====
  {
    title: "Selling",
    link: "#",
    icon: "shopping_cart",
    visible: permission(5000),
    hasSubMenu: true,
    subMenu: [
      { title: "Create Sale", link: "/selling/create", visible: permission(5001) },
      { title: "List Sales", link: "/selling/list", visible: permission(5002) },
      { title: "Customer", link: "/selling/customer", visible: permission(5003) },
      { title: "Invoice", link: "/selling/invoice", visible: permission(5004) },
      { title: "Report", link: "/selling/report", visible: permission(5005) },
    ],
  },

  // ===== Roles =====
  {
    title: "Roles",
    link: "#",
    icon: "admin_panel_settings",
    visible: permission(3000),
    hasSubMenu: true,
    subMenu: [
      { title: "Create", link: "/role/create", visible: permission(3003) },
      { title: "List", link: "/role/list", visible: permission(3004) },
    ],
  },
];

export default menus;
