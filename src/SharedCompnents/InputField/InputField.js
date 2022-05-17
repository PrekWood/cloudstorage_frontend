import React, {useEffect, useRef, useState} from 'react';
import './InputField.css';
import visibleSvg from './imgs/visible.svg';
import hiddenSvg from './imgs/hidden.svg';


function InputField(props) {

    const [isValid, setValid] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [defaultValue, setDefaultValue] = useState(null);
    useEffect(()=>{
        setDefaultValue(props.defaultValue);
    },[props.defaultValue])

    if (!("id" in props) || !("name" in props)) {
        return <p>
            InputField needs id and name
        </p>
    }

    let inputType = "text";
    if ("type" in props) {
        inputType = props.type;
    }



    let variation = "";
    if ("variation" in props) {
        variation = props.variation;
    }

    let callback = () => { }
    if ("callback" in props) {
        callback = props.callback;
    }

    let validation = (value) => { return true }
    if ("validation" in props) {
        validation = props.validation;
    }

    function onKeyUp(event) {
        // Validation
        let isCurrentValueValid = null;
        if (typeof validation == "function") {
            isCurrentValueValid = validation(event.target.value)
        } else {
            validation.forEach(validationMethod => {
                if (validationMethod(event.target.value)) {
                    if (isCurrentValueValid == null || isCurrentValueValid) {
                        isCurrentValueValid = true;
                    } else {
                        isCurrentValueValid = false;
                    }
                } else {
                    isCurrentValueValid = false;
                }
            });
        }
        setValid(isCurrentValueValid ? "valid" : "invalid");

        callback(event, { "isValid": isCurrentValueValid });
    }

    function showPassword(e) {
        e.preventDefault();
        setPasswordVisible(!passwordVisible);
    }

    return (
        <>
            <div className={`form-field ${variation} ${isValid == null ? "" : isValid} ${inputType === "password"?"password":""}`}>
                <input
                    type={inputType === "password" && passwordVisible ? "text" : inputType}
                    className={`${isValid == null ? "" : isValid}`}
                    id={props.id}
                    placeholder={props.name}
                    defaultValue={defaultValue}
                    onKeyUp={onKeyUp}
                />
                <label htmlFor={props.id}>{props.name}</label>
                {inputType == "password" ?
                    <button className="show-password" onClick={showPassword}>
                        <img src={passwordVisible ? hiddenSvg : visibleSvg} />
                    </button>
                    :
                    <></>
                }
            </div>
        </>
    );
}

export default InputField;