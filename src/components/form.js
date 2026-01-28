/* requiring dependencies */
import React from "react"

/* form element  */
export const Form = React.memo((props) => (
    <form action="#" onSubmit={props.onSubmit}>
        {props.children}
    </form>
))

/* input field */
export const Input = React.memo((props) => (
    <div className="input-container">
        <label htmlFor={props.name}>{props.label}</label>
        <input
            id={props.name}
            type={props.type}
            name={props.name}
            value={props.value}
            placeholder={props.placeholder}
            onChange={props.onChange}
            onBlur={props.onBlur}
            min={props.min}
            max={props.max}
            disabled={props.disabled}
            readOnly={props.readOnly}
            multiple={props.multiple}
            pattern={props.pattern}
            accept={props.accept}
            autoComplete = {props.autoComplete?props.autoComplete:"new-password"}
            onClick={props.onClick}
            onKeyUp={props.onKeyUp}
        />
        {
        props.rightIcon && (
        <span
          className="material-icons right-icon "
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            textAlign:"center",
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#888'
          }}
          onClick={props.rightIcon.onClick}
        >
          {props.rightIcon.icon}
        </span>
      )}
        <span className="helper-text">{props.error}</span>
    </div>
))

/* checkbox */
export const Checkbox = React.memo((props) => (
    <div className="checkbox">
        <input
            type="checkbox"
            id={props.name}
            name={props.name}
            onChange={props.onChange}
            checked={props.checked}
            value={props.value}
            disabled={props.disabled}
        />
        {props.onTable ? null : <label htmlFor={props.name}>{props.label}</label>}
    </div>
))

/* radion button */
export const Radio = React.memo((props) => (
    <div>
        <label htmlFor={props.name}>
            <input
                type="radio"
                id={props.name}
                name={props.name}
                onChange={props.onChange}
                checked={props.checked}
                value={props.value}
            />
            <span>{props.label}</span>
        </label>
    </div>
))

/* select */
export const Select = React.memo((props) => (
    <>
        <label htmlFor={props.name}>{props.label}</label>
        <select
            className={`selectpicker ${props.className}`}
            data-live-search="true"
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            id={props.name}
            multiple={props.multiple}
            disabled={props.disabled}
            onBlur={props.onBlur}
            onClick={props.onClick}
        >
            {props.children}
        </select>
        <span className="helper-text">{props.error}</span>
    </>
))

/* option */
export const Option = React.memo((props) => (
    <option
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        selected={props.selected}
        onSelect={props.onSelect}
        className={props.image ? props.class : ""}
        data-icon={props.image ? props.image : ""}
        onChange={props.onChange}
        onClick={props.onClick}
        
    >
        {props.label}
    </option>
))

/* textarea */
export const Textarea = React.memo((props) => (
    <>
        <label htmlFor={props.name}>{props.label}</label>
        <textarea
            name={props.name}
            value={props.value}
            id={props.name}
            placeholder={props.placeholder}
            onChange={props.onChange}
            readOnly={props.readOnly}
            disabled={props.disabled}
            onKeyUp={props.onKeyUp}
            onBlur={props.onBlur}
        />
        <span className="helper-text">{props.error}</span>
    </>
))
