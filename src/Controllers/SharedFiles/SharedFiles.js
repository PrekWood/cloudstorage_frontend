
import React, { useEffect, useState } from 'react';
import "./SharedFiles.css";
import Nav from "../../SharedCompnents/Nav/Nav";
import FileListing from "../../SharedCompnents/FileListing/FileListing";
import WarningMessage from "../../SharedCompnents/WarningMessage/WarningMessage";
import User from '../../Classes/User';
import SortingPreferences from '../../Classes/SortingPreferences';
import Validate from "../../Classes/Validate";
import UserFile from "../../Classes/UserFile";
import Folder from "../../Classes/Folder";
import LayoutContext from "../../Classes/LayoutContext";

function SharedFiles() {

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
                userFilled.saveUserToLocalStorage()
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
        setWarningState({
            active: true,
            type: "error",
            message: msg,
            confirmMethod: () => { },
            cancelMethod: () => { },
        });
    }
    window.displaySuccess = (msg, cancelMethod) => {
        setWarningState({
            active: true,
            type: "success",
            message: msg,
            confirmMethod: () => { },
            cancelMethod: cancelMethod,
        });
    }

    // Files
    const [files, setFiles] = useState(null);
    function loadFiles(){
        UserFile.getFilesSharedWithUser(
            (response)=>{
                const filesList = response.data;
                if (Validate.isArrayEmpty(filesList)) {
                    setFiles([]);
                }

                let fileObjList = [];
                filesList.forEach(file => {
                    const fileObj = UserFile.castToUserFile(file);
                    fileObjList.push(fileObj);
                });

                setFiles(fileObjList);
            },
            (request)=>{
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        )
    }

    // Folders
    const [folders, setFolders] = useState(null);
    function loadFolders(){
        Folder.getFoldersSharedWithUser(
            (response)=>{
                const foldersList = response.data;
                if (Validate.isArrayEmpty(foldersList)) {
                    setFolders([]);
                }

                let folderObjList = [];
                foldersList.forEach(folder => {
                    const folderObj = Folder.castToFolder(folder);
                    folderObj.shared = true;
                    folderObjList.push(folderObj);
                });

                console.log(folderObjList);
                setFolders(folderObjList);
            },
            (request)=>{
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        )
    }

    return (
        <>
            <div className="shared-files">
                <FileListing
                    user={loggedInUser}
                    variation="shared-files"
                    defaultLayout="grid"
                    // No automatic reloading of files
                    files={files}
                    loadFiles={loadFiles}
                    // No automatic reloading of folders
                    folders={folders}
                    loadFolders={loadFolders}
                    // Local storage context name
                    localStorageContextName="sharedFilesContext"
                />
                <Nav user={loggedInUser} />
            </div>

            <WarningMessage state={warningState} />
        </>
    );
}

export default SharedFiles;

