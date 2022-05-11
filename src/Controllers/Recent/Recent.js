
import React, { useEffect, useState } from 'react';
import "./Recent.css";
import Nav from "../../SharedCompnents/Nav/Nav";
import FileListing from "../../SharedCompnents/FileListing/FileListing";
import WarningMessage from "../../SharedCompnents/WarningMessage/WarningMessage";
import User from '../../Classes/User';
import SortingPreferences from '../../Classes/SortingPreferences';

function Recent() {

    // Log in if not loged in
    const [loggedInUser, setloggedInUser] = useState(null);
    useEffect(() => {
        if (loggedInUser == null) {
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
            },
            (error) => {
                window.location.href = "/login";
            }
        )
    }

    // display warning
    const [warningState, setWarningState] = useState({
        active: false,
        type: "warning",
        message: "",
        confirmMethod: () => { },
        cancelMethod: () => { },
    });
    window.displayWarning = (msg, confirmMethod, cancelMethod) => {
        setWarningState({
            active: true,
            type: "warning",
            message: msg,
            confirmMethod: confirmMethod,
            cancelMethod: cancelMethod,
        });
    }
    window.displayError = (msg) => {
        console.log("weindow.displayerror")
        setWarningState({
            active: true,
            type: "error",
            message: msg,
            confirmMethod: () => { },
            cancelMethod: () => { },
        });
    }

    return (
        <>
            <div className="content-container">
                <FileListing
                    user={loggedInUser}
                    variation="recent"
                />
            </div>
            <Nav user={loggedInUser} />
            <WarningMessage state={warningState} />
        </>
    );
}

export default Recent;

