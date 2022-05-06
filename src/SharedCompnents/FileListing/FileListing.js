
import React, { useDebugValue, useEffect, useState } from 'react';
import "./FileListing.css";
import UserFile from "./../../Classes/UserFile";
import User from "./../../Classes/User";
import Validate from "./../../Classes/Validate";
import FileListingBody from "./Components/FileListingBody/FileListingBody";
import FileListingHeader from "./Components/FileListingHeader/FileListingHeader";
import NoFilesUploaded from "./Components/NoFilesUploaded/NoFilesUploaded";
import SortingPreferences from '../../Classes/SortingPreferences';

function FileListing(props) {

    // Users
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(props.user);
        if (props.user != null && props.user instanceof User) {
            loadUserFiles(props.user);
        }
    }, [props.user])



    // Sorting prefs
    const [sortingPreferences, setSortingPreferences] = useState(new SortingPreferences());
    useEffect(() => {
        setSortingPreferences(SortingPreferences.loadFromLoalStorage());
    }, [])
    function updateSortingPrefs() {
        setSortingPreferences(SortingPreferences.loadFromLoalStorage());
    }

    // Files
    const [userFiles, setUserFiles] = useState(null);
    function loadUserFiles(user) {
        setLoadingAnimationState(true);
        user.getUserFiles(
            loadUserFilesSuccess,
            loadUserFilesError
        );
    }
    function loadUserFilesSuccess(response) {
        const filesList = response.data;
        if (Validate.isArrayEmpty(filesList)) {
            setLoadingAnimationState(false);
            setUserFiles([]);
        }

        let fileObjList = [];
        filesList.forEach(file => {
            const fileObj = UserFile.castToUserFile(file);
            fileObjList.push(fileObj);
        });

        setUserFiles(fileObjList);
        setLoadingAnimationState(false);
        return;
    }
    function loadUserFilesError(request) {
        setLoadingAnimationState(false);
        if (!Validate.isEmpty(request.response)) {
            window.displayError(request.response.data.error);
        } else {
            window.displayError("Something went wrong. Please try again later");
        }
    }
    function reHydrateListing(filesList) {
        if (filesList == undefined) {
            loadUserFiles(user);
            return;
        }

        setUserFiles(filesList);
    }


    // Layouts 
    const [layout, setLayout] = useState("grid");

    // Loading Animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    return (
        <>
            <div className="file-listing">
                <FileListingHeader
                    reHydrateListing={reHydrateListing}
                    updateSortingPrefs={updateSortingPrefs}
                    sortingPreferences={sortingPreferences}
                    setLayout={setLayout}
                    files={userFiles}
                    setLoadingAnimationState={setLoadingAnimationState}
                />
                <FileListingBody
                    reHydrateListing={reHydrateListing}
                    files={userFiles}
                    layout={layout}
                    loadingAnimationState={loadingAnimationState}
                />
                {(userFiles != null && userFiles.length == 0 && sortingPreferences.isEmpty()) ? <NoFilesUploaded /> : ""}
            </div>
        </>
    );
}

export default FileListing;
