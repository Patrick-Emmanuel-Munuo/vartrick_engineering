/* requiring dependencies */
import React from "react"
import { FloatingButton } from "./button"
import Notification from "./notification"
import Sidebar from "./sidebar"
import Header from './header'
import Footer from './footer'
/* guest (unauthenticated) */
export const GuestLayout= React.memo((props) => (
    <main className="main-out">
        {props.application.state.notification ? <Notification application = {props.application} message={props.application.state.notification.toString()} /> : null}
        {props.children}
    </main>
))

/* authenticated */
export const AuthLayout = React.memo((props) => (
    <>
        <Sidebar application = {props.application} toggleSidebar ={props.application.toggleSidebar} authenticate={props.authenticate}/>
        <Header application={props.application} />
          {/*Application main menu components*/}
        {
        <main className="main" id="main">
        {props.application.state.notification ? <Notification application = {props.application} message={props.application.state.notification.toString()} /> : null}
            {props.children}
            <FloatingButton
                className="floating-button-menu"
                to="#"
                icon="menu"
                tooltip="menu"
                onClick={props.application.toggleSidebar}
            />
        </main>}
        <Footer/>
    </>
))