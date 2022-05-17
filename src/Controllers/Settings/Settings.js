
import React, {useEffect, useState} from 'react';
import "./Settings.css";
import Nav from "../../SharedCompnents/Nav/Nav";
import defaultUserIcon from "./imgs/default_user.png";
import SubmitButton from "../../SharedCompnents/SubmitButton/SubmitButton";
import SortingPreferences from "../../Classes/SortingPreferences";
import User from "../../Classes/User";
import InputField from "../../SharedCompnents/InputField/InputField";
import Validate from "../../Classes/Validate";
import UserFile from "../../Classes/UserFile";

function Settings() {

    const [loggedInUser, setloggedInUser] = useState(new User());
    useEffect(() => {
        if (loggedInUser == null || loggedInUser.isEmpty()) {
            loadUserFromLocalStorage();
            SortingPreferences.writeToLocalStorage(new SortingPreferences());
        }
    }, []);
    function loadUserFromLocalStorage() {
        const userObj = User.loadUserFromLocalStorage();
        if (userObj.isEmpty()) {
            window.location.href = "/login";
        }
        userObj.getUserDetails(
            (response) => {
                const userFilled = User.castToUser(response.data);
                userFilled.token = userObj.token;
                setloggedInUser(userFilled)
                userFilled.saveUserToLocalStorage()
            },
            (error) => {
                window.location.href = "/login";
            }
        )
    }

    function updateUser(e){
        e.preventDefault();

        // Get form fields
        let firstName = null;
        let lastName = null;
        let phoneNumber = null;
        const formFields = e.target.elements;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id == "settingsFirstName") {
                firstName = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id == "settingsLastName") {
                lastName = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id == "settingsPhoneNumber") {
                phoneNumber = formFields[formFieldIndex].value
            }
        }

        loggedInUser.firstName = firstName
        loggedInUser.lastName = lastName
        loggedInUser.phoneNumber = phoneNumber
        loggedInUser.update(
            ()=>{
                setMessage({
                    "msg":"The user was updated successfully",
                    "state":"success"
                })
            },
            (request)=>{
                if (!Validate.isEmpty(request.response)) {
                    setMessage({
                        "msg":request.response.data.error,
                        "state":"error"
                    })
                } else {
                    setMessage({
                        "msg":"Something went wrong. Please try again later",
                        "state":"error"
                    })
                }
            }
        );

    }

    function uploadUserImage(e){
        e.preventDefault();

        const fileToUpload = e.target[0].files[0]
        loggedInUser.updateImage(
            fileToUpload,
            (response) => {
                document.getElementById("user_image").src = `${window.API_URL}/user/${loggedInUser.id}/image?r=${Math.random()}`
            },
            () => { }
        );
    }

    //Erors
    const [message, setMessage] = useState({
        state:"error",
        msg:""
    });
    return (
        <>
            <Nav user={loggedInUser}/>
            <div className="content-container settings">
                <img
                    className="settings-user-icon"
                    id="user_image"
                    src={Validate.isEmpty(loggedInUser.imagePath) ? defaultUserIcon : `${window.API_URL}/user/${loggedInUser.id}/image`}
                    onClick={()=>{
                        document.getElementById("settings_hidden_file_uploader").click();
                    }}
                />
                <div className="settings-hidden-file-uploader">
                    <form id="settings_hidden_image_form" onSubmit={uploadUserImage}>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            id="settings_hidden_file_uploader"
                            onChange={()=>{
                                document.getElementById("settings_hidden_image_submit").click();
                            }}
                        />
                        <button type="submit" id="settings_hidden_image_submit">submit</button>
                    </form>
                </div>
                <div className="settings-form-container">
                    <form onSubmit={updateUser}>
                        <InputField
                            id="settingsFirstName"
                            name="First Name"
                            validation={[Validate.isNotEmpty, Validate.containsOnlyLetters]}
                            defaultValue={loggedInUser.firstName}
                        />
                        <InputField
                            id="settingsLastName"
                            name="Last Name"
                            validation={[Validate.isNotEmpty, Validate.containsOnlyLetters]}
                            defaultValue={loggedInUser.lastName}
                        />
                        <InputField
                            id="settingsPhoneNumber"
                            name="Phone Number"
                            validation={[Validate.isNotEmpty, Validate.containsOnlyNumbers, Validate.has10Characters]}
                            defaultValue={loggedInUser.phoneNumber}
                        />
                        <SubmitButton
                            id="settingsSubmit"
                            text="Update"
                        />
                        <span className={`${message.msg === "" ? "errors hidden" : message.state}`}>{message.msg}</span>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Settings;

