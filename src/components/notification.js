/* dependencies */
import React from "react"
import { Icon } from "./elements";

/* notification memorized functional component */
const Notification = React.memo((props) => {
    const { dispatch } = props.application;
    return (
    <div className="message hide-on-print">
        <div className="message-icon">
            
        </div>
        <div className="message-body">
            <p className="" >{props.message}</p>
        </div>
        {<div className="message-close js-messageClose">
            <Icon name="close" type="round" onClick={() => dispatch({notification:""})}     />
        </div>}
    </div>
)})

/* exporting component */
export default Notification