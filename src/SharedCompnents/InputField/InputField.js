import React from 'react';
import './InputField.css';

function InputField(props) {

    if (!("id" in props) || !("name" in props)) {
        return <p>
            InputField needs id and name
        </p>
    }

    let inputType = "text";
    if ("type" in props) {
        inputType = props.type;
    }

    return (
        <>
            <div className="form-field">
                <input type={inputType} id={props.id} placeholder={props.name} />
                <label htmlFor={props.id}>{props.name}</label>
            </div>
        </>
    );
}

export default InputField;