import React, { useEffect } from 'react';
import './LoginForm.css';
import InputField from './../../../../SharedCompnents/InputField/InputField';
import SubmitButton from './../../../../SharedCompnents/SubmitButton/SubmitButton';


function LoginForm(props) {

    function logInSubmit() {
        console.log("logInSubmit");
    }

    useEffect(() => {
        // Make the form appear
        const loginForm = document.querySelector(".login-form");
        const loginFormHeight = loginForm.clientHeight;
        loginForm.style.top = `calc(50vh - ${loginFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--loginFormTop: ${loginFormHeight / 2}px}</style>`;
        document.querySelector(".extra-css").innerHTML = cssScript;
    }, []);

    return (
        <>
            <h1 className="login-h1">Welcome<br />back</h1>
            <div className="login-form-container">
                <div className="login-form">
                    <h2>Login</h2>
                    <InputField id="login_email" name="E-mail" />
                    <InputField id="login_password" name="Password" type="password" />
                    <SubmitButton callback={logInSubmit} text="Log in" />
                    <a className="form-link" onClick={props.switchToRegister}>
                        Dont't have an account? Sign up here
                    </a>
                </div>
            </div>
            <div className='extra-css'></div>
        </>
    );
}

export default LoginForm;

