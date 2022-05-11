import React, { useEffect, useState } from 'react';
import './RegisterForm.css';
import InputField from '../../../../SharedCompnents/InputField/InputField';
import LoadingAnimation from '../../../../SharedCompnents/LoadingAnimation/LoadingAnimation';
import SubmitButton from '../../../../SharedCompnents/SubmitButton/SubmitButton';
import Validate from './../../../../Classes/Validate';
import User from './../../../../Classes/User';

function RegisterForm(props) {

    const [registerFormState, setRegisterFormState] = useState("active");
    const [showLoadingAnimation, setLoadingAnimation] = useState(false);
    const [registerFormErrors, setRegisterFormErrors] = useState(null);
    const [formData, setFormData] = useState({
        "register_first_name": null,
        "register_last_name": null,
        "register_email": null,
        "register_password": null
    });

    // Hiding and showing component animation 
    useEffect(() => {
        if (props.isActive == null) {
            setRegisterFormState("initial");
        } else if (props.isActive) {
            setRegisterFormState("active");
        } else {
            setRegisterFormState("hidden");
        }
    }, [props.isActive]);
    useEffect(() => {
        // Make the form appear
        const registerForm = document.querySelector(".register-form");
        const registerFormHeight = registerForm.clientHeight;
        registerForm.style.top = `calc(50vh - ${registerFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--registerFormTop: ${registerFormHeight / 2}px}</style>`;
        document.querySelector(".extra-css").innerHTML += cssScript;
    }, []);


    // Change data on update fields
    function changeRegisterFormData(event, state) {
        const changedField = event.target.id;
        const changedValue = event.target.value;
        if (!(changedField in formData)) {
            console.log(`Register Error: ${changedField} not in formData`);
        }

        let formDataChanged = formData;
        formDataChanged[changedField] = {
            "value": changedValue,
            "isValid": state.isValid
        }
        setFormData(formDataChanged);
    }

    // Form validation
    function validateFields() {
        const fields = Object.keys(formData);

        let areFieldsValid = true;
        fields.forEach((field, index) => {
            if (formData[field] == null || !formData[field].isValid) {
                areFieldsValid = false;
            }
        });

        return areFieldsValid;
    }

    // Form submit
    function signUp() {
        if (!validateFields()) {
            setRegisterFormState("form-error");
            setTimeout(() => {
                setRegisterFormState("active-no-animation");
            }, 500)
            return;
        }

        setLoadingAnimation(true);

        let user = new User();
        user.firstName = formData.register_first_name.value;
        user.lastName = formData.register_last_name.value;
        user.email = formData.register_email.value;
        user.password = formData.register_password.value;
        user.register(registerSuccess, registerErrorHandling);
    }

    function stopLoadingAnimation() {
        setLoadingAnimation(false);
    }
    function registerSuccess(response) {

        // Save user to localstorage
        let newUser = new User();
        newUser.email = response.registerResponse.data.email;
        newUser.firstName = response.registerResponse.data.firstName;
        newUser.idUser = response.registerResponse.data.id;
        newUser.lastName = response.registerResponse.data.lastName;
        newUser.token = response.data.token;
        newUser.saveUserToLocalStorage();

        stopLoadingAnimation();
        props.switchToPhoneNumberForm();
    }

    function registerErrorHandling(error) {
        stopLoadingAnimation();
        if (error.response.status == 409) {
            setRegisterFormErrors("The E-mail is already being used. Please use some other e-mail.");
        } else {
            console.log(error);
            setRegisterFormErrors("Something went wrong please try again");
        }
    }

    function switchToLogin(){
        props.switchToLogin(true);
    }

    return (
        <>
            <div className="form-container register">
                <h1 className={`register-h1 ${registerFormState == "active" ? "" : registerFormState}`}>Let's sign<br />you up!</h1>
                <div className={`register-form ${registerFormState}`}>
                    <h2>Sign up</h2>
                    <InputField
                        id="register_first_name"
                        name="First Name"
                        variation="half"
                        validation={[Validate.isNotEmpty, Validate.containsOnlyLetters]}
                        callback={changeRegisterFormData}
                    />
                    <InputField
                        id="register_last_name"
                        name="Last Name"
                        variation="half"
                        validation={[Validate.isNotEmpty, Validate.containsOnlyLetters]}
                        callback={changeRegisterFormData}
                    />
                    <InputField
                        id="register_email"
                        name="E-mail"
                        validation={Validate.isEmail}
                        callback={changeRegisterFormData}
                    />
                    <InputField
                        id="register_password"
                        name="Password"
                        type="password"
                        validation={[Validate.isNotEmpty, Validate.hasAtLeast8Chars, Validate.containsNumber]}
                        callback={changeRegisterFormData}
                    />
                    <SubmitButton text="Sign up" callback={signUp} />
                    <span className={`errors ${registerFormErrors == null ? "hidden" : ""}`}>{registerFormErrors}</span>
                    <a className="form-link" onClick={switchToLogin}>
                        Already have an account? Log in here
                    </a>


                    <LoadingAnimation state={showLoadingAnimation} />
                </div>
            </div>
        </>
    );
}

export default RegisterForm;

