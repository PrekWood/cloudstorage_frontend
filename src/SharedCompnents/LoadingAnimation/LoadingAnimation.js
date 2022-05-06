import React, { useEffect, useState } from 'react';
import './LoadingAnimation.css';

function LoadingAnimation(props) {
    const [state, setState] = useState("inactive");

    useEffect(() => {
        setState(props.state ? "active" : "inactive")
    }, [props.state]);

    return <>
        <div className={`loading-animation ${state}`}>
            <div className="loadingio-spinner-dual-ball-l96bgipof6">
                <div className="ldio-tzqoa72rxz7">
                    <div></div><div></div><div></div>
                </div>
            </div>
        </div>
    </>
}
export default LoadingAnimation;