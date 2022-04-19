import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import LoginBackground from './Components/LoginBackground/LoginBackground';
import LoginLogo from './Components/LoginLogo/LoginLogo';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';

function Login() {


    function switchToLogin() {
        // Hide login form
        const registerForm = document.querySelector(".register-form");
        registerForm.className = "register-form hidding";
        setTimeout(() => {
            registerForm.className = "register-form hidden";
        }, 1200);

        // Hide register h1
        document.querySelector(".register-h1").className = "register-h1 hidden";

        // Show register Form
        setTimeout(() => {
            const loginForm = document.querySelector(".login-form");
            loginForm.className = "login-form";
        }, 500);

        // Hide register h1
        document.querySelector(".login-h1").className = "login-h1";
    }


    function switchToRegister() {
        // Hide login form
        const loginForm = document.querySelector(".login-form");
        loginForm.className = "login-form hidding";
        setTimeout(() => {
            loginForm.className = "login-form hidden";
        }, 1200);

        // Hide login h1
        document.querySelector(".login-h1").className = "login-h1 hidden";

        // Show register Form
        setTimeout(() => {
            const registerForm = document.querySelector(".register-form");
            registerForm.className = "register-form";
        }, 500);

        // Show register h1
        document.querySelector(".register-h1").className = "register-h1";
    }

    return (
        <>
            <div className="login-page">
                <LoginBackground />
                <LoginLogo />
                <LoginForm switchToRegister={switchToRegister} />
                <RegisterForm switchToLogin={switchToLogin} />
            </div>
        </>
    );
}

export default Login;

