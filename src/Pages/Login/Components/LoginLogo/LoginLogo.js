import React from 'react';
import { ReactComponent as LogoSvg } from './imgs/logo.svg';
import './LoginLogo.css';

function LoginLogo() {
    return (
        <>
            <div className="login-logo">
                <LogoSvg />
                <span>cloudstorage.tech</span>
            </div>
        </>
    );
}

export default LoginLogo;

