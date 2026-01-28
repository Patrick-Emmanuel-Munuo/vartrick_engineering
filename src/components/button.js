/* dependencies */
import React from "react"
import { Link } from "react-router-dom"
import { Icon } from "./elements"


/* button */
export const Button = React.memo((props) => (
    <button
        onClick={props.onClick}
        className={`${props.className}  ${props.disabled || props.loading ? "disabled" : ""}`}
        disabled = {props.disabled || props.loading}
        type= {props.type || "submit"}
    >
        {(props.loading ? "Loading" : props.disabled ? "Error" : props.title)}
    </button>
))

/* floating button */
export const FloatingButton = React.memo((props) => (
    <div className={`floating-button hide-on-print ${props.class}`}>
        <Link to={props.to} onClick={props.onClick} className="hide-on-print" data-tooltip={(props.tooltip)}>
            {<Icon name={props.icon} type="round" />}
        </Link>
    </div>
))



/* table action button */
export const ActionButton = React.memo((props) => (
    <Link
        to={props.to}
        state ={props.state}
        className={`${props.className} hide-on-print`}
        data-tooltip={(props.tooltip)}
        tooltip={(props.tooltip)}
        data-position={props.position}
        onClick={props.onClick}
        data-placement={props.placement}
        >{props.children}
    </Link>
))