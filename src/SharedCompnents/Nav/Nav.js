
import React, { useEffect } from 'react';
import "./Nav.css";
import UserMiniature from "./../UserMiniature/UserMiniature";
import logoSvg from "./imgs/logo.svg";
import { ReactComponent as RecentSvg } from "./imgs/recent.svg";
import { ReactComponent as SettingsSvg } from "./imgs/settings.svg";

function Nav(props) {
    useEffect(() => {
        console.log("Nav user")
        console.log(props.user)
    }, [props.user]);
    return (
        <>
            <nav>
                <a href="/dashboard" className="nav-item logo-container">
                    <img src={logoSvg} />
                </a>
                <a href="/" className={`nav-item ${window.location.href == (window.FRONTEND_BASE_URL + "/") ? "active" : ""}`}>
                    <RecentSvg />
                    <span className="nav-text">RECENT</span>
                </a>
                <a href="/settings" className={`nav-item ${window.location.href == (window.FRONTEND_BASE_URL + "/settings") ? "active" : ""}`}>
                    <SettingsSvg />
                    <span className="nav-text">SETTINGS</span>
                </a>
                <UserMiniature user={props.user} variation="navigation" />
            </nav>
        </>
    );
}

export default Nav;

