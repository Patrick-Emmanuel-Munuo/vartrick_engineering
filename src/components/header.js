import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./elements"; // Reusable Icon component
import { applicationName, getInfo } from "../helpers/functions";

const Header = React.memo((props) => {
  const user_name = getInfo("user", "full_name") || "Guest";

  return (
    <header className="header hide-on-print flex items-center">
      {/* Logo Section */}
      <div className="logo-container">
        <Link
          to="#"
          className="logo"
          style={{ backgroundImage: `url("/logo.png")` }}
        />
        <div>{applicationName || "Application"}</div>
      </div>

      {/* Sidebar Toggle Button */}
      <Icon
        className="toggle-sidebar-btn"
        name="grid_view"
        type="round"
        onClick={props.application.toggleSidebar}
      />

      {/* User Name Section */}
      <div className="ms-auto user-name">
        <span className="name">{user_name}</span>
      </div>
    </header>
  );
});

export default Header;
