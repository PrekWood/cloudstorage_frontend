import React, {useEffect, useState} from 'react';
import "./FileSharingByEmail.css";
import {ReactComponent as ShareByMailSvg} from "../../imgs/share-by-mail.svg";
import InputField from "../../../../../InputField/InputField";
import Validate from "../../../../../../Classes/Validate";
import CheckBox from "../../../../../CheckBox/CheckBox";
import SubmitButton from "../../../../../SubmitButton/SubmitButton";
import addSvg from "../../imgs/add.svg";
import User from "../../../../../../Classes/User";
import defaultUserIcon from "../../../../../UserMiniature/imgs/default_user.png";
import {ReactComponent as CancelSvg} from "../../../../../WarningMessage/imgs/cancel.svg";
import {ReactComponent as ShareSvg} from "../../../../../FileGrid/imgs/share.svg";

export default function FileSharingByEmail(props) {

    const [addErrorsState, setAddErrorsState] = useState(false);
    const [addErrors, setAddErrors] = useState(null);
    const [usersToShare, setUsersToShare] = useState([]);

    // PRIVILEGES
    const ONLY_DOWNLOAD = -1;
    const DOWNLOAD_EDIT = -2;
    const DOWNLOAD_DELETE = -3;
    const ALL = -4;

    function displayAddError(msg) {
        setAddErrors(msg);
        setAddErrorsState(true)
        setTimeout(() => {
            setAddErrorsState(false)
        }, 3000)
    }

    function addUser(event) {
        event.preventDefault();

        // Get form fields
        let email = null;
        let can_delete = null;
        let can_edit = null;
        const formFields = event.target.elements;
        for (let formFieldIndex = 0; formFieldIndex < formFields.length; formFieldIndex++) {
            if (formFields[formFieldIndex].id == "share_email_field") {
                email = formFields[formFieldIndex].value
            }
            if (formFields[formFieldIndex].id == "can_delete") {
                can_delete = formFields[formFieldIndex].checked
            }
            if (formFields[formFieldIndex].id == "can_share") {
                can_edit = formFields[formFieldIndex].checked
            }
        }

        if (Validate.isEmpty(email)) {
            displayAddError("Plase add an email");
            return;
        }

        // Get current user
        const loggedInUser = User.loadUserFromLocalStorage();
        if(loggedInUser.email === email){
            displayAddError("You cannot share a file to yourself ");
            return;
        }

        User.getUserDetailsByEmail(
            email,
            (response) => {
                const user = response.data;
                const userObj = User.castToUser(user);
                const usersToShareTmp = [];

                let alreadyExists = false;
                usersToShare.map((userToSearch) => {
                    usersToShareTmp.push(userToSearch)
                    if (userToSearch.id === userObj.id) {
                        alreadyExists = true;
                    }
                })
                if (alreadyExists) {
                    displayAddError("The user is already added");
                    return;
                }

                // Add privileges
                userObj.privileges = ONLY_DOWNLOAD;
                if (can_delete && can_edit) {
                    userObj.privileges = ALL;
                } else if (can_delete) {
                    userObj.privileges = DOWNLOAD_DELETE;
                } else if (can_edit) {
                    userObj.privileges = DOWNLOAD_EDIT;
                }

                usersToShareTmp.push(userObj);
                setUsersToShare(usersToShareTmp);
            },
            (request) => {
                if (!Validate.isEmpty(request.response)) {
                    displayAddError(request.response.data.error);
                } else {
                    displayAddError("Something went wrong. Please try again later");
                }
            }
        )
    }

    function getPrivilegesText(privileges) {
        switch (privileges) {
            case ONLY_DOWNLOAD:
                return 'Only Download';
            case DOWNLOAD_EDIT:
                return 'Download and Edit';
            case DOWNLOAD_DELETE:
                return 'Download and Delete';
            case ALL:
                return 'Download, Edit and Delete';
            default:
                return '';
        }
    }

    function userRemove(idUserToRemove) {
        const usersToShareTmp = [];
        usersToShare.map((userToSearch) => {
            if (userToSearch.id !== idUserToRemove) {
                usersToShareTmp.push(userToSearch)
            }
        })
        setUsersToShare(usersToShareTmp)
    }

    function share(){
        const usersToShareWith = [];
        usersToShare.map((user) => {
            usersToShareWith.push({
                "id":user.id,
                "privileges":user.privileges,
            })
        })

        props.file.shareWithUsers(
            usersToShareWith,
            ()=>{
                window.displaySuccess("You have successfully shared the file")
            },
            (request)=>{
                if (!Validate.isEmpty(request.response)) {
                    displayAddError(request.response.data.error);
                } else {
                    displayAddError("Something went wrong. Please try again later");
                }
            }
        );
    }

    return (
        <div className="email-sharing-form sharing-container">
            <div className="header">
                <h3>
                    <ShareByMailSvg/>
                    <span>Share by email</span>
                </h3>
                <button className="back-icon" onClick={() => {
                    props.setSharingType(null)
                }}>
                    Back
                </button>
            </div>
            <div className="email-container">
                <form className={"share-with-user-form"} onSubmit={addUser}>
                    <InputField
                        name="Email"
                        id="share_email_field"
                        validation={Validate.isEmail}
                    />
                    <CheckBox
                        text="Can edit files"
                        id="can_edit"
                    />
                    <CheckBox
                        text="Can delete files"
                        id="can_delete"
                    />
                    <SubmitButton
                        text="Add"
                        svg={addSvg}
                        callback={() => {
                        }}
                    />
                    <div className={`add-errors ${!addErrorsState ? "inactive" : "active"}`}>
                        {addErrors}
                    </div>
                </form>
            </div>

            {Validate.isArrayEmpty(usersToShare) ? "" :
                <>
                    {usersToShare.map((user) => (
                        <div className="user-list" key={`user_to_share_${user.id}`}>
                            <div className="user-to-share-item">
                                <img src={defaultUserIcon}/>
                                <div className="user-to-share-info">
                                    <span className="user-to-share-name">{`${user.firstName} ${user.lastName}`}</span>
                                    <span
                                        className="user-to-share-privileges">{getPrivilegesText(user.privileges)}</span>
                                    <button className="user-to-share-remove" onClick={() => {
                                        userRemove(user.id)
                                    }}>
                                        <CancelSvg/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="share-with-users" onClick={share}>
                        <ShareSvg/> Share
                    </button>
                    <span className="small">
                        You can edit the users that have access to your files at any time
                    </span>
                </>
            }


        </div>
    )
}