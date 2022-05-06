import React from 'react';
import './SubmitButton.css';

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
            >{props.text}</button>
        </>
    );
}

export default SubmitButton;