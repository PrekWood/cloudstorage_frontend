import React, { useEffect, useState } from 'react';
import './CountryCodeSelector.css';
import arrowSvg from './imgs/arrow.svg';
// import Select from './../../../../../../SharedCompnents/Select/Select'

export default function CountryCodeSelector(props) {
    const [countryCodesList, setCountryCodesList] = useState([]);
    const [dropDownState, setDropDownState] = useState("closed");
    const [selectedCountryCode, setSelectedCountryCode] = useState({
        code: "",
        country: "",
        svg: "",
        id: "",
    });

    useEffect(() => {
        setCountryCodesList(props.countryCodesList);

        if (props.countryCodesList != undefined) {
            props.countryCodesList.forEach(countryCode => {
                if (countryCode.country == "GR") {
                    setSelectedCountryCode(countryCode);
                }
            });
        } else {
            setSelectedCountryCode({
                code: "",
                country: "",
                svg: "",
                id: "",
            });
        }
    }, [props.countryCodesList]);

    function openDropDownList() {
        setDropDownState("open");
    }

    function closeDropDownList() {
        setDropDownState("closed");
    }

    function selectCountryCode(countryCode) {
        setSelectedCountryCode(countryCode)
        setDropDownState("closed");

        const event = {
            "target": {
                "id": "otp_country_code_id",
                "value": countryCode.id
            }
        }
        const state = {
            "isValid": true
        }
        props.callback(event, state);
    }

    return (
        <>
            <div className={`country-code-selector-container ${dropDownState}`}>
                <select className="hidden-custom-country-code-selector" id="register_phone_number"
                    value={selectedCountryCode == null ? 1 : selectedCountryCode.id}
                >
                    {countryCodesList == undefined ? "" : countryCodesList.map((countryCode) => (
                        <option
                            key={countryCode.id}
                            value={countryCode.id}
                        // selected={countryCode.code == "GR" ? "selected" : ""}
                        >{countryCode.code}</option>
                    ))}
                </select>
                <div className="custom-country-code-selector" >
                    <div className="country-code-selected" onClick={openDropDownList}>
                        <div className="country-codes-selected-inner" >
                            <img src={selectedCountryCode.svg == "" ? "" : `${window.BACKEND_BASE_URL}/imgs/country_flags/${selectedCountryCode.svg}`} />
                            <span>{selectedCountryCode.code}</span>
                        </div>
                        <img className="country-codes-arrow" src={arrowSvg} />
                    </div>
                    <div className="country-code-list">
                        {countryCodesList == undefined ? "" : countryCodesList.map((countryCode) => (
                            <div className="country-code" key={countryCode.id} onClick={() => { selectCountryCode(countryCode); }}>
                                <img src={`${window.BACKEND_BASE_URL}/imgs/country_flags/${countryCode.svg}`} />
                                <span>{countryCode.code}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`country-code-selector-container-filter ${dropDownState}`} onClick={closeDropDownList}></div>


            {/* <Select options={countryCodesList} /> */}
        </>
    );
}