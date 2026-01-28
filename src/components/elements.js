/* requiring dependencies */
import React from "react"


export const Icon = React.memo((props) => (
    <i 
      className = {`material-icons material-icons-${props.type} ${props.className} ${props.position} ${props.rotate ? "rotate" : ""} `}
      onClick={props.onClick}
     >{props.name}
    </i>
))


