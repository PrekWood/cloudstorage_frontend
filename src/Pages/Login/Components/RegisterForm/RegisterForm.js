import React, { useEffect } from 'react';
import './RegisterForm.css';
import InputField from '../../../../SharedCompnents/InputField/InputField';
import SubmitButton from '../../../../SharedCompnents/SubmitButton/SubmitButton';


function RegisterForm(props) {

    useEffect(() => {
        // Make the form appear
        const registerForm = document.querySelector(".register-form");
        const registerFormHeight = registerForm.clientHeight;
        registerForm.style.top = `calc(50vh - ${registerFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--registerFormTop: ${registerFormHeight / 2}px}</style>`;
        document.querySelector(".extra-css").innerHTML += cssScript;
    }, []);

    return (
        <>
            <h1 className="register-h1 hidden">Let's sign<br />you up!</h1>
            <div className="login-form-container">
                <div className="register-form hidden">
                    <h2>Sign up</h2>
                    <InputField id="login_email" name="E-mail" />
                    <InputField id="login_password" name="Password" type="password" />
                    <SubmitButton text="Log in" />
                    <a className="form-link" onClick={props.switchToLogin}>
                        Already have an account? Log in here
                    </a>
                </div>
            </div>
        </>
    );
}

export default RegisterForm;

