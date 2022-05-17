
import React, { useEffect, useState } from 'react';
import "./WarningMessage.css";
import thinkingEmoji from "./imgs/thinking.png"
import sadEmoji from "./imgs/sad.png"
import happyEmoji from "./imgs/happy.png"
import { ReactComponent as CancelSvg } from "./imgs/cancel.svg"
import { ReactComponent as DeleteSvg } from "./imgs/delete.svg"

function WarningMessage(props) {
    const [state, setState] = useState({
        active: false,
        type: "warning",
        message: "",
        confirmMethod: () => { },
        cancelMethod: () => { },
    });

    useEffect(() => {
        setState(props.state)
    }, [props.state]);

    function closeMessage() {
        setState({
            active: false,
            type: "warning",
            message: "",
            confirmMethod: () => { },
            cancelMethod: () => { },
        })
    }

    function getEmoji(type){
        switch (type){
            case "warning":
                return thinkingEmoji;
            case "error":
                return sadEmoji;
            case "success":
                return happyEmoji;
        }
    }

    function getHeadline(type){
        switch (type){
            case "warning":
                return "Warning";
            case "error":
                return "Error";
            case "success":
                return "Success";
        }
    }

    return (
        <>
            <div className={`warning-message ${state.active ? "active" : "inactive"}`}>
                <div className="warning-info-container">
                    <img src={getEmoji(state.type)} />
                    <div className="waring-info">
                        <h3>{getHeadline(state.type)}</h3>
                        <span className="waring-desc">{state.message}</span>
                    </div>
                </div>
                {state.type === "warning" ? (
                    <div className="warining-buttons">
                        <button onClick={() => { closeMessage(); state.cancelMethod(); }}>
                            <CancelSvg />
                            <span>Cancel</span>
                        </button>
                        <button onClick={() => { closeMessage(); state.confirmMethod(); }} className='delete'>
                            <DeleteSvg />
                            <span>Delete</span>
                        </button>
                    </div>
                ) : (
                    <button className="warning-close" onClick={() => { closeMessage(); }}>
                        <CancelSvg />
                    </button>
                )}
            </div>
            <div
                className={`warning-message-filer ${state.active ? "active" : "inactive"}`}
                onClick={() => { closeMessage(); state.cancelMethod(); }}
            ></div>
        </>
    );
}

export default WarningMessage;