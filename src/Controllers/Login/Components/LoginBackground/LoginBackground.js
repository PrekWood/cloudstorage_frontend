import userEvent from '@testing-library/user-event';
import React, { useEffect, useState } from 'react';
import BackGroundLayerSvg from './imgs/movingLayer.svg';
import './LoginBackground.css';


function LoginBackground(props) {

    let [backgroundWavePosition, setBackgroundWavePosition] = useState(0);

    useEffect(() => {
        setInterval(function () {
            setBackgroundWavePosition(backgroundWavePosition += 10);
        }, 50);
    }, []);

    return (
        < div className="login-background" >
            <div className="login-background-wave"
                style={{
                    backgroundImage: `url(${BackGroundLayerSvg})`,
                    backgroundPosition: `${backgroundWavePosition}px 0px`
                }}>
            </div>
        </div >
    );
}

export default LoginBackground;

