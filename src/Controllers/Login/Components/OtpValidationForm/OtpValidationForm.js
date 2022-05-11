import React, { useEffect, useState } from 'react';
import './OtpValidationForm.css';
import InputField from '../../../../SharedCompnents/InputField/InputField';
import LoadingAnimation from '../../../../SharedCompnents/LoadingAnimation/LoadingAnimation';
import UserMiniature from '../../../../SharedCompnents/UserMiniature/UserMiniature';
import SubmitButton from '../../../../SharedCompnents/SubmitButton/SubmitButton';
import Validate from '../../../../Classes/Validate';
import User from '../../../../Classes/User';


function OtpValidationForm(props) {

    const [otpValidationFormState, setOtpValidationFormState] = useState("initial");
    const [showLoadingAnimation, setLoadingAnimation] = useState(false);
    const [loggedInUser, setloggedInUser] = useState(null);
    const [errors, setErrors] = useState("");

    // const [registerFormErrors, setRegisterFormErrors] = useState(null);
    const [formData, setFormData] = useState({
        "otp_pin_1": null,
        "otp_pin_2": null,
        "otp_pin_3": null,
        "otp_pin_4": null,
        "otp_pin_5": null,
    });

    // Hiding and showing component animation 
    useEffect(() => {
        if (props.isActive == null) {
            setOtpValidationFormState("initial");
        } else if (props.isActive) {
            setOtpValidationFormState("active");
            loadUserFromLocalStorage();
        } else {
            setOtpValidationFormState("hidden");
        }
    }, [props.isActive]);
    useEffect(() => {
        // Make the form appear
        const otpValidationForm = document.querySelector(".opt-validation-form");
        const otpValidationFormHeight = otpValidationForm.clientHeight;
        otpValidationForm.style.top = `calc(50vh - ${otpValidationFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--otpValidationFormTop: ${otpValidationFormHeight / 2}px}</style>`;
        document.querySelector(".extra-css").innerHTML += cssScript;
    }, []);

    function loadUserFromLocalStorage() {
        const userObj = User.loadUserFromLocalStorage();
        if (userObj.isEmpty()) {
            setloggedInUser(null)
        } else {
            setloggedInUser(userObj)
        }
    }

    function userLogout() {
        localStorage.setItem("loggedInUser", null);
        setloggedInUser(null);
        props.switchToRegister(false, true);
    }

    function changeFormData(event, state) {
        const changedField = event.target.id;
        const changedValue = event.target.value;
        if (!(changedField in formData)) {
            console.log(`OTP validation Error: ${changedField} not in formData`);
        }

        let formDataChanged = formData;
        formDataChanged[changedField] = {
            "value": changedValue,
            "isValid": state.isValid
        }
        setFormData(formDataChanged);
    }

    function changeFocusAndFormData(event, state) {
        const currentPinNumber = parseFloat(event.target.id.replace("otp_pin_", ""));
        if (state.isValid) {
            const nextInputField = document.getElementById(`otp_pin_${currentPinNumber + 1}`);
            nextInputField.select()
        }
        changeFormData(event, state);
    }

    // Form validation22
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

    function shakeForm() {
        setOtpValidationFormState("invalid");
        setTimeout(() => {
            setOtpValidationFormState("active-no-animation");
        }, 300);
    }

    function validateOtp(event) {
        event.preventDefault();

        if (!validateFields() || loggedInUser == null) {
            shakeForm();
        }

        const formFields = event.target.elements;
        let otpCode = "";
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id.includes("otp_pin_")) {
                otpCode += formFields[formFieldIndex]["value"];
            }
        }

        loggedInUser.validateOtp(otpCode, successValidateOtp, errorValidateOtp);
    }

    function switchToRegister() {
        props.switchToRegister(false, true)
    }

    function clearFields() {
        document.querySelectorAll(".form-field.pin input").forEach((inputField) => {
            inputField.value = "";
        });
    }

    function resendSms() {
        setLoadingAnimation(true);
        loggedInUser.resendSms(successResend, failResend);
    }

    function successValidateOtp() {
        setLoadingAnimation(false);
        window.location.href = "/";
    }

    function errorValidateOtp() {
        setLoadingAnimation(false);
        shakeForm();
        setErrors("The PIN is not correct. Please try again.")
    }

    function successResend() {
        clearFields();
        setLoadingAnimation(false);
    }

    function failResend() {
        clearFields();
        setLoadingAnimation(false);
    }

    return (
        <>
            <div className="form-container otp-validation">
                <h1 className={`opt-validation-h1 ${otpValidationFormState == "active" ? "" : otpValidationFormState}`}>Bring<br />out your 📱</h1>
                <div className={`opt-validation-form ${otpValidationFormState}`}>
                    <h2>PIN Validation</h2>
                    <span>Please input the PIN number that you received on your smartphone</span>
                    <UserMiniature user={loggedInUser} logout={userLogout} />
                    <form onSubmit={validateOtp}>
                        <div className="pin-number-fields">
                            <InputField
                                id="otp_pin_1"
                                name="1"
                                validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.isNotEmpty, Validate.has1Character]}
                                callback={changeFocusAndFormData}
                                variation="pin"
                            />
                            <InputField
                                id="otp_pin_2"
                                name="2"
                                validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has1Character]}
                                callback={changeFocusAndFormData}
                                variation="pin"
                            />
                            <InputField
                                id="otp_pin_3"
                                name="3"
                                validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has1Character]}
                                callback={changeFocusAndFormData}
                                variation="pin"
                            />
                            <InputField
                                id="otp_pin_4"
                                name="4"
                                validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has1Character]}
                                callback={changeFocusAndFormData}
                                variation="pin"
                            />
                            <InputField
                                id="otp_pin_5"
                                name="5"
                                validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has1Character]}
                                callback={changeFormData}
                                variation="pin"
                            />
                        </div>
                        <SubmitButton text="Submit" />
                    </form>
                    <span className={`errors ${errors == "" ? "hidden" : ""}`}>{errors}</span>
                    <LoadingAnimation state={showLoadingAnimation} />
                    <a className="form-link" onClick={resendSms}>Didn't get an SMS? Let us re resend it. </a>
                </div>
            </div>
        </>
    );
}

export default OtpValidationForm;

