import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
import LoginBackground from './Components/LoginBackground/LoginBackground';
import LoginLogo from './Components/LoginLogo/LoginLogo';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegisterForm/RegisterForm';
import PhoneNumberForm from './Components/PhoneNumberForm/PhoneNumberForm';
import OtpValidationForm from './Components/OtpValidationForm/OtpValidationForm';
import CountryCodes from './../../Classes/CountryCodes';

function Login() {

    const [isLoginActive, setLoginActive] = useState(null);
    const [isRegisterActive, setRegisterActive] = useState(null);
    const [isPhoneNumberActive, setPhoneNumberActive] = useState(null);
    const [isOtpValidationFormActive, setOtpValidationFormActive] = useState(null);

    const [countryCodesList, setCountryCodesList] = useState([]);
    const [loadingCountryCodes, setLoadingCountryCodes] = useState(false);

    function switchToRegister(hidePhoneNumber = false, hideOtpForm = false) {
        console.log(`switchToRegister hidePhoneNumber:${hidePhoneNumber} hideOtpForm:${hideOtpForm}`);
        if (hidePhoneNumber) {
            setPhoneNumberActive(false);
        }
        if (hideOtpForm) {
            setOtpValidationFormActive(false);
        }
        setLoginActive(false);
        setRegisterActive(true);
    }

    function switchToLogin() {
        setRegisterActive(false);
        setLoginActive(true);
    }

    function switchToPhoneNumberForm() {
        setRegisterActive(false);
        setLoginActive(false);
        setPhoneNumberActive(true);
    }
    function switchToOtpValidation() {
        console.log("login switchToOtpValidation")
        setRegisterActive(false);
        setLoginActive(false);
        setPhoneNumberActive(false);
        setOtpValidationFormActive(true);
    }

    useEffect(() => {
        if (!loadingCountryCodes) {
            setLoadingCountryCodes(true);
            CountryCodes.getAllCountryCodes(getCountryCodesSuccess, getCountryCodesFail);
        }
    }, [])

    function getCountryCodesSuccess(response) {
        setLoadingCountryCodes(false);
        setCountryCodesList(response.data);
    }
    function getCountryCodesFail(error) {
        setLoadingCountryCodes(false);
        alert("something went wrong please try again")
    }

    return (
        <>
            <div className="login-page">
                <LoginBackground />
                <LoginLogo />
                <LoginForm isActive={isLoginActive} switchToRegister={switchToRegister} />
                <RegisterForm isActive={isRegisterActive} switchToLogin={switchToLogin} switchToPhoneNumberForm={switchToPhoneNumberForm} />
                <PhoneNumberForm isActive={isPhoneNumberActive} switchToRegister={switchToRegister} switchToOtpValidation={switchToOtpValidation} countryCodesList={countryCodesList} />
                <OtpValidationForm isActive={isOtpValidationFormActive} switchToRegister={switchToRegister} />
                <div className='extra-css'></div>
            </div>
        </>
    );
}

export default Login;

