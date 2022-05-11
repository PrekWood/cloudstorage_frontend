
import React, { useDebugValue, useEffect, useState } from 'react';
import "./FileListing.css";
import UserFile from "./../../Classes/UserFile";
import User from "./../../Classes/User";
import Validate from "./../../Classes/Validate";
import FileListingBody from "./Components/FileListingBody/FileListingBody";
import FileListingHeader from "./Components/FileListingHeader/FileListingHeader";
import NoFilesUploaded from "./Components/NoFilesUploaded/NoFilesUploaded";
import SortingPreferences from '../../Classes/SortingPreferences';
import DragAndDropUploader from "../DragAndDropUploader/DragAndDropUploader";
import Folder from "../../Classes/Folder";

function FileListing(props) {

    // Users
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(props.user);
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
    useEffect(() => {
        if (props.user != null && props.user instanceof User) {
            loadUserFiles(props.user);
        }
    }, [props.user])
    function loadUserFiles(user) {
        setLoadingAnimationState(true);
        user.getFiles(
            loadUserFilesSuccess,
            loadUserFilesError,
            variation==="recent"
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
    function reHydrateListing(filesList = null, foldersList = null) {

        // current folder
        setCurrentFolder(Folder.loadFromLoalStorage());

        // Reload files
        if (filesList == null) {
            loadUserFiles(user);
        }else{
            setUserFiles(filesList);
        }

        // Reload folders
        if (foldersList == null) {
            loadFolders();
        }else{
            setFolders(foldersList);
        }

    }

    // Folders
    const [folders, setFolders] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    useEffect(() => {
        if (props.user != null && props.user instanceof User) {
            loadFolders();
        }
    }, [props.user])
    useEffect(() => {
        setCurrentFolder(Folder.loadFromLoalStorage());
    }, [])

    function loadFolders(){
        Folder.getFolders(
            (response) => {
                const folders = response.data;
                const folderObjList = [];
                folders.map((folder)=>{
                    folderObjList.push(
                        Folder.castToFolder(folder)
                    )
                })
                setFolders(folderObjList);
            },
            (request) => {
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        );
    }

    // Layouts 
    const [layout, setLayout] = useState("grid");

    // Loading Animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Variation
    const [variation, setVariation] = useState(null);
    useEffect(() => {
        setVariation(props.variation);
    }, [props.variation])

    return (
        <>
            <div className={`file-listing ${(
                userFiles != null &&
                userFiles.length === 0 &&
                sortingPreferences.isEmpty() &&
                currentFolder.parentFolderId == null
            ) ? "empty" : ""}`}
            >
                <FileListingHeader
                    reHydrateListing={reHydrateListing}
                    updateSortingPrefs={updateSortingPrefs}
                    sortingPreferences={sortingPreferences}
                    setLayout={setLayout}
                    variation={variation}
                    files={userFiles}
                    currentFolder={currentFolder}
                    setLoadingAnimationState={setLoadingAnimationState}
                />
                <FileListingBody
                    reHydrateListing={reHydrateListing}
                    files={userFiles}
                    folders={folders}
                    layout={layout}
                    variation={variation}
                    currentFolder={currentFolder}
                    loadingAnimationState={loadingAnimationState}
                />
                {(
                    userFiles != null &&
                    userFiles.length === 0 &&
                    sortingPreferences.isEmpty() &&
                    currentFolder.parentFolderId == null
                ) ?
                    <NoFilesUploaded /> : ""
                }
                <DragAndDropUploader reHydrateListing={reHydrateListing}/>
            </div>
        </>
    );
}

export default FileListing;
