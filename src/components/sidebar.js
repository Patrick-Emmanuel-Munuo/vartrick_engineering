import React from "react";
import { Icon } from "./elements"; // Ensure Icon is still available for React
import { Link } from "react-router-dom";
import menus from "../helpers/menu"; // Assume this holds your menu configuration
import {useLocation} from 'react-router-dom'

const Sidebar = React.memo((props) => {
    const pathname = useLocation()
    const [activeLink, setActiveLink] = React.useState(pathname.pathname);
    const [activeMenu, setActiveMenu] = React.useState(-1)

    const toggleMenu = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
        const currentPathname = pathname.pathname;
        setActiveLink(currentPathname);
        //console.log({activeLink})
    };
    const renderMenu = () => {
        return menus.map((menu, index) => {
            if (menu.visible) {
                return (
                    <li key={index} className="nav-item">
                        <Link
                            className={`nav-link collapsed ${activeLink.includes(menu.link) ? "active" : ""}`}
                            to={menu.link}
                            data-bs-toggle={menu.subMenu ? "collapse" : ""}
                            data-bs-target={`#${menu.title}-nav`}
                            onClick={() => toggleMenu(index)}
                        >
                            <Icon name={menu.icon} type="round"  />
                            <span>{menu.title}</span>
                            {menu.subMenu && <i className="bi bi-chevron-down ms-auto"></i>}
                        </Link>
                        {menu.subMenu && (
                            <ul id={`${menu.title}-nav`} className={`nav-content collapse  ${activeMenu === index ? "show" : ""}`} data-bs-parent="#sidebar-nav">
                                {menu.subMenu.map((subMenu, subIndex) => {
                                    if (subMenu.visible) {
                                        return (
                                            <li key={subIndex}>
                                                <Link to={subMenu.link} className={`${activeLink === subMenu.link ? "active" : ""}`}>
                                                    <Icon name="chevron_right" type="round" />
                                                    <span>{subMenu.title}</span>
                                                </Link>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                        )}
                    </li>
                );
            }
            return null;
        });
    };

    return (
        <aside id="sidebar" className="sidebar hide-on-print">
            <ul className="sidebar-nav" id="sidebar-nav">
                {/* Dynamic menu items */}
                {renderMenu()}
                {/* Logout link */}
                <li className="nav-item">
                    <Link to="#" className="nav-link" onClick={() => props.authenticate("logout")}>
                        <Icon name="logout" type="round" />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>

            <div className="version-container">
                <span className="title">v</span>
                <span className="version">1.0</span>
            </div>
        </aside>
    );
});

export default Sidebar;
