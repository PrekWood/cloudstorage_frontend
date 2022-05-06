import React, { useEffect, useState } from 'react';
import './LoginForm.css';
import InputField from './../../../../SharedCompnents/InputField/InputField';
import SubmitButton from './../../../../SharedCompnents/SubmitButton/SubmitButton';
import LoadingAnimation from '../../../../SharedCompnents/LoadingAnimation/LoadingAnimation';
import Validate from './../../../../Classes/Validate';
import User from '../../../../Classes/User';


function LoginForm(props) {

    // Hiding and showing animation 
    const [loginFormState, setLoginFormState] = useState(true);
    const [loadingAnimationStatus, setLoadingAnimationStatus] = useState(false);
    const [errors, serErrors] = useState("");

    useEffect(() => {
        if (props.isActive == null) {
            setLoginFormState("initial");
        } else if (props.isActive) {
            setLoginFormState("active");
        } else {
            setLoginFormState("hidden");
        }
    }, [props.isActive]);

    // Register Submit
    function handleErrors(error) {
        console.log(error);
    }

    function registerSubmit() {
        // axios.get(`${window.API_URL}/user/all`, getHeaders())
        //     .then((res) => console.log(res))
        //     .catch(handleErrors)



        // axios.post(`${window.API_URL}/registration`, getHeaders())
        //     .then((res) => console.log(res))
        //     .catch(handleErrors)
    }

    // Dynamic calculation of top based on height
    useEffect(() => {
        // Make the form appear
        const loginForm = document.querySelector(".login-form");
        const loginFormHeight = loginForm.clientHeight;
        loginForm.style.top = `calc(50vh - ${loginFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--loginFormTop: ${loginFormHeight / 2}px}</style>`;
        document.querySelector(".extra-css").innerHTML = cssScript;
    }, []);

    function switchToRegister() {
        console.log("Login switchToRegister");
        props.switchToRegister(false, false);
    }

    function shakeForm() {
        setLoginFormState("invalid");
        setTimeout(() => {
            setLoginFormState("active-no-animation");
        }, 300);
    }

    function submitLogin(event) {
        event.preventDefault();

        // Get form fields
        let email = null;
        let password = null;
        const formFields = event.target.elements;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id == "login_email") {
                email = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id == "login_password") {
                password = formFields[formFieldIndex].value
            }
        }

        // Validation
        if (
            !Validate.isEmail(email) ||
            !Validate.isNotEmpty(password) || !Validate.hasAtLeast8Chars(password) || !Validate.containsNumber(password)
        ) {
            shakeForm();
            return;
        }

        // Loading animantion
        setLoadingAnimationStatus(true);

        const user = new User();
        user.email = email;
        user.password = password;
        user.login(successLogin, failLogin);
    }

    function successLogin(response) {
        // Save user to local storage
        let newUser = new User();
        newUser.token = response.data.token;
        newUser.saveUserToLocalStorage();

        // Close animation
        setLoadingAnimationStatus(false);

        // Redirect to dashboard
        window.location.href = "/";
    }

    function failLogin(error) {
        if (error.response.status == 403) {
            serErrors("E-mail and password don't match")
        } else {
            if (error.response.data != "") {
                serErrors(error.response.data)
            } else {
                serErrors("Something went wrong please try again")
            }
        }

        setLoadingAnimationStatus(false);
    }

    return (
        <>
            <div className="form-container login">
                <h1 className={`login-h1 ${loginFormState == "active" ? "" : loginFormState}`}>Welcome<br />back</h1>
                <div className={`login-form ${loginFormState}`}>
                    <h2>Login</h2>
                    <form onSubmit={submitLogin}>
                        <InputField
                            id="login_email"
                            name="E-mail"
                            validation={Validate.isEmail} />
                        <InputField
                            id="login_password"
                            name="Password"
                            type="password"
                            validation={[Validate.isNotEmpty, Validate.hasAtLeast8Chars, Validate.containsNumber]} />
                        <SubmitButton callback={registerSubmit} text="Log in" />
                        <span className={`errors ${errors == "" ? "hidden" : ""}`}>{errors}</span>
                    </form>

                    <a className="form-link" onClick={switchToRegister}>
                        Dont't have an account? Sign up here
                    </a>
                    <LoadingAnimation state={loadingAnimationStatus} />
                </div>
            </div>
        </>
    );
}

export default LoginForm;

