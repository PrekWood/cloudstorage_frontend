import React, { useEffect, useState } from 'react';
import './PhoneNumberForm.css';
import CountryCodeSelector from './Components/CountryCodeSelector/CountryCodeSelector';
import InputField from '../../../../SharedCompnents/InputField/InputField';
import LoadingAnimation from '../../../../SharedCompnents/LoadingAnimation/LoadingAnimation';
import UserMiniature from '../../../../SharedCompnents/UserMiniature/UserMiniature';
import SubmitButton from '../../../../SharedCompnents/SubmitButton/SubmitButton';
import Validate from '../../../../Classes/Validate';
import CountryCodes from '../../../../Classes/CountryCodes';
import User from '../../../../Classes/User';

function PhoneNumberForm(props) {

    const [phoneNumberFormState, setPhoneNumberFormState] = useState("false");
    const [countryCodesList, setCountryCodesList] = useState([]);
    const [loggedInUser, setloggedInUser] = useState(null);
    const [showLoadingAnimation, setLoadingAnimation] = useState(false);
    const [errors, serErrors] = useState("");
    const [formData, setFormData] = useState({
        "otp_phone_number": null,
        "otp_country_code_id": {
            "value": 1,
            "isValid": true
        }
    });

    useEffect(() => {
        setCountryCodesList(props.countryCodesList);
    }, [props.countryCodesList]);

    useEffect(() => {
        if (props.isActive == null) {
            setPhoneNumberFormState("initial");
        } else if (props.isActive) {
            setPhoneNumberFormState("active");
            loadUserFromLocalStorage();
        } else {
            setPhoneNumberFormState("hidden");
        }

    }, [props.isActive]);
    useEffect(() => {
        // Make the form appear
        const phoneNumberForm = document.querySelector(".phone-number-form");
        const phoneNumberFormHeight = phoneNumberForm.clientHeight;
        phoneNumberForm.style.top = `calc(50vh - ${phoneNumberFormHeight / 2}px)`;

        // set CSS variable for the animation      
        const cssScript = `<style>:root{--phoneNumberFormTop: ${phoneNumberFormHeight / 2}px}</style>`;
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

    // Change data on update fields
    function changePhoneNumberFormData(event, state) {
        const changedField = event.target.id;
        const changedValue = event.target.value;
        if (!(changedField in formData)) {
            console.log(`Phone Number Error: ${changedField} not in formData`);
        }

        let formDataChanged = formData;
        formDataChanged[changedField] = {
            "value": changedValue,
            "isValid": state.isValid
        }
        setFormData(formDataChanged);
    }

    function shakeForm() {
        setPhoneNumberFormState("invalid");
        setTimeout(() => {
            setPhoneNumberFormState("active-no-animation");
        }, 300);
    }

    function sendSms() {
        if (loggedInUser == null) {
            shakeForm();
            return;
        }

        const authToken = loggedInUser.token;
        const phoneNumberField = formData.otp_phone_number;
        if (
            authToken == null || authToken == "" || authToken == undefined ||
            phoneNumberField == null || !phoneNumberField.isValid ||
            phoneNumberField.value == null || phoneNumberField.value == "" || phoneNumberField.value == undefined
        ) {
            shakeForm();
            console.log(`authToken: ${authToken} phoneNumber: ${phoneNumberField.value}`);
            return;
        }

        setLoadingAnimation(true);

        loggedInUser.token = authToken;
        loggedInUser.phoneNumber = phoneNumberField.value;
        loggedInUser.countryCodeId = formData.otp_country_code_id.value;
        loggedInUser.saveUserToLocalStorage();
        loggedInUser.savePhoneNumberAndSendSms(sendSmsSuccess, sendSmsError);
    }

    function sendSmsSuccess() {
        console.log("phonenumberform sendSmsSuccess")

        setLoadingAnimation(false);
        props.switchToOtpValidation();
    }

    function sendSmsError(response) {
        console.log("sendSmsError");
        console.dir(response);
        setLoadingAnimation(false);
        serErrors(response.response.data);
    }

    function userLogout() {
        props.switchToRegister(true, false);
        setTimeout(() => {
            localStorage.setItem("loggedInUser", null);
            setloggedInUser(null);
        }, 1000)
    }

    return (
        <>
            <div className="form-container phone-number">
                <h1 className={`phone-number-h1 ${phoneNumberFormState == "active" ? "" : phoneNumberFormState}`}>One more<br />step to go</h1>
                <div className={`phone-number-form ${phoneNumberFormState}`}>
                    <h2>Phone Number</h2>
                    <span>In order to complete your account we need to verify your telephone.</span>
                    <UserMiniature user={loggedInUser} logout={userLogout} />
                    <div className="phone-number-container">
                        <CountryCodeSelector
                            countryCodesList={countryCodesList}
                            callback={changePhoneNumberFormData}
                        />
                        <InputField
                            id="otp_phone_number"
                            name="Phone Number"
                            validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has10Characters]}
                            callback={changePhoneNumberFormData}
                        />
                    </div>
                    <SubmitButton text="Send SMS" callback={sendSms} />
                    <span className={`errors ${errors == "" ? "hidden" : ""}`}>{errors}</span>
                    <LoadingAnimation state={showLoadingAnimation} />
                    <a className="form-link" onClick={props.switchToLogin}>
                        Already have an account? Log in here
                    </a>
                </div>
            </div>
        </>
    );
}

export default PhoneNumberForm;

