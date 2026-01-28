/* dependencies */
import React from "react"
//import translate from "../helpers/translator"

/* dialog memorized functional component */
const Dialog = React.memo((props) => (
    <div className="dialog" id="dialog">
        <div className="dialog-content">
            <div className="dialog-title">
                {props.title}
            </div>
            <div className="dialog-body">
                <p className="dialog-text">
                    {props.text}
                </p>
            </div>
            <div className="dialog-action">
                <button className="btn btn-info" onClick={() => props.toggleDialog("dialog")}>Decline</button>
                <button className="btn btn-danger" onClick={props.action}>Accept</button>
            </div>

        </div>
    </div>
))

/* exporting component */
export default Dialog