import React, { useRef, useState } from 'react';
import './CheckBox.css';
import {ReactComponent as CheckSvg} from "./imgs/check.svg";


function CheckBox(props) {

    const [state, setState] = useState(false);

    if (!("id" in props) || !("text" in props)) {
        return <p>
            CheckBox needs id and name
        </p>
    }

    function change(e){
        setState(e.target.checked);
    }

    return (
        <>
            <div className={`form-checkbox checkbox-${state?"checked":"not-checked"}`} >
                <input
                    type="checkbox"
                    className="checkbox-hidden-input"
                    id={props.id}
                    onChange={change}
                />
                <div className={`checkbox-container ${state?"checked":"not-checked"}`} onClick={
                    ()=>{document.getElementById(props.id).click()}
                }>
                    <CheckSvg/>
                </div>
                <label htmlFor={props.id}>{props.text}</label>
            </div>
        </>
    );
}

export default CheckBox;