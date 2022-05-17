import React from 'react';
import './SubmitButton.css';
import Validate from "../../Classes/Validate";

function SubmitButton(props) {

    let onClickFunction = () => { };
    if ("callback" in props) {
        onClickFunction = props.callback;
    }

    return (
        <>
            <button
                type="submit"
                className="submit-button"
                onClick={onClickFunction}
            >
                {Validate.isEmpty(props.svg) ? "" : <img src={props.svg} />}
                {props.text}
            </button>
        </>
    );
}

export default SubmitButton;