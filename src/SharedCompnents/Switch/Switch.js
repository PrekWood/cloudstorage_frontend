
import React, { useEffect, useState } from 'react';
import "./Switch.css";

export default function Switch(props) {

    const [selectedOption, changeSelectedOption] = useState(0);

    function toggleSwitch() {
        const newSelectedOption = (selectedOption + 1) % 2;
        props.callBack(newSelectedOption);
        changeSelectedOption((selectedOption + 1) % 2)
    }

    let options = null;
    if (!("options" in props) && props.options.length != 2) {
        return <p>
            Switch needs two options
        </p>
    }
    options = props.options;

    return <>
        <div className='switch' onClick={toggleSwitch}>
            <div className={`selected-option ${selectedOption == 0 ? 'left' : 'right'}`}>
                <img src={options[selectedOption].svg} />
            </div>
            <div className={`switch-option`} >
                <img src={options[0].svg} />
            </div>
            <div className={`switch-option`}>
                <img src={options[1].svg} />
            </div>
        </div>
    </>;
}