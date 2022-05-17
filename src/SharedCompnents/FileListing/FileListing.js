
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
import PreviewModal from "./Components/PreviewModal/PreviewModal";
import FileSharingModal from "./Components/FileSharingModal/FileSharingModal";
import LayoutContext from "../../Classes/LayoutContext";

function FileListing(props) {

    // Current folder name
    const contextName = props.localStorageContextName;

    // Users
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    // Sorting prefs
    const [sortingPreferences, setSortingPreferences] = useState(new SortingPreferences());
    useEffect(() => {
        setSortingPreferences(SortingPreferences.loadFromLocalStorage(contextName));
    }, [])
    function updateSortingPrefs() {
        setSortingPreferences(SortingPreferences.loadFromLocalStorage(contextName));
    }

    // SharedFiles
    const [userFiles, setUserFiles] = useState(null);
    useEffect(() => {
        if (props.user != null && props.user instanceof User) {
            reHydrateListing(null, null, false, props.user);
        }
    }, [props.user])
    useEffect(() => {
        if (props.files != null) {
            setUserFiles(props.files)
        }
    }, [props.files])
    function loadUserFiles(user) {
        setLoadingAnimationState(true);
        user.getFiles(
            contextName,
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
    function reHydrateListing(
        filesList = null,
        foldersList = null,
        fileDeleted=false,
        userToLoad=null
    ) {

        if(userToLoad == null){
            userToLoad = user;
        }

        // current folder
        const context = LayoutContext.getContext(contextName);
        if(Validate.isEmpty(context.currentFolder)){
            setCurrentFolder(new Folder());
        }else{
            setCurrentFolder(Folder.castToFolder(context.currentFolder));
        }

        // Reload files
        if(Validate.isNotEmpty(props.loadFiles)){
            props.loadFiles()
            setLoadingAnimationState(false);
        }else{
            if (filesList == null) {
                loadUserFiles(userToLoad);
            }else{
                setUserFiles(filesList);
            }
        }

        // Reload folders
        if(Validate.isNotEmpty(props.loadFolders)){
            props.loadFolders()
        }else{
            if (foldersList == null) {
                loadFolders();
            }else{
                setFolders(foldersList);
            }
        }

        // Reload preview file
        if(previewState && Validate.isNotEmpty(previewFile) && Validate.isNotEmpty(previewFile.id) && !fileDeleted){
            UserFile.getFileById(
                previewFile.id,
                (reloadedFile)=>{
                    setPreviewFile(reloadedFile)
                },
                (request)=>{
                    setLoadingAnimationState(false);
                    if (!Validate.isEmpty(request.response)) {
                        window.displayError(request.response.data.error);
                    } else {
                        window.displayError("Something went wrong. Please try again later");
                    }
                }
            )
        }

    }

    // Folders
    const [folders, setFolders] = useState(null);
    const [currentFolder, setCurrentFolder] = useState(null);
    useEffect(() => {
        if (props.folders != null) {
            setFolders(props.folders)
        }
    }, [props.folders])

    function loadFolders(){
        Folder.getFolders(
            contextName,
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
    const [layout, setLayout] = useState(Validate.isNotEmpty(props.defaultLayout)?props.defaultLayout:"grid");

    // Loading Animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Variation
    const [variation, setVariation] = useState(null);
    useEffect(() => {
        setVariation(props.variation);
    }, [props.variation])

    // Preview Window
    const [previewState, setPreviewState] = useState(false);
    const [previewFile, setPreviewFile] = useState(false);

    // Sharing Window
    const [sharingState, setSharingState] = useState({
        isActive:false,
        type:"file",
        object:null
    });

    return (
        <>
            <div className={`content-container ${previewState || sharingState.isActive ? "preview" : ""}`}>
                <div className={`file-listing ${(
                    userFiles != null &&
                    userFiles.length === 0 &&
                    sortingPreferences.isEmpty() &&
                    currentFolder.parentFolderId == null &&
                    variation !== "shared-files"
                ) ? "empty" : ""} `}
                >
                    <FileListingHeader
                        files={userFiles}
                        reHydrateListing={reHydrateListing}
                        updateSortingPrefs={updateSortingPrefs}
                        sortingPreferences={sortingPreferences}
                        layout={layout}
                        setLayout={setLayout}
                        variation={variation}
                        currentFolder={currentFolder}
                        contextName = {contextName}
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
                        // Preview
                        setPreviewFile={setPreviewFile}
                        setPreviewState={setPreviewState}
                        previewFile={previewFile}
                        // Sharing
                        setSharingState={setSharingState}
                        contextName = {contextName}
                    />
                    {(
                        userFiles != null &&
                        userFiles.length === 0 &&
                        sortingPreferences.isEmpty() &&
                        currentFolder.parentFolderId == null &&
                        variation !== "shared-files"
                    ) ?
                        <NoFilesUploaded /> : ""
                    }
                    <DragAndDropUploader
                        reHydrateListing={reHydrateListing}
                        contextName = {contextName}
                    />

                    {(
                        userFiles != null &&
                        userFiles.length === 0 &&
                        folders != null &&
                        folders.length === 0 &&
                        sortingPreferences.isEmpty() &&
                        currentFolder.parentFolderId == null &&
                        variation === "shared-files"
                    ) ?
                        <div className="shared-files-no-files">
                            It seems you don't have any shared files yet.
                            <a href="/files">Start sharing here.</a>
                        </div>
                    : "" }

                </div>

                <PreviewModal
                    reHydrateListing={reHydrateListing}
                    previewState={previewState}
                    setPreviewState={setPreviewState}
                    previewFile={previewFile}
                    // Sharing
                    setSharingState={setSharingState}
                    variation={variation}
                />

                <FileSharingModal
                    reHydrateListing={reHydrateListing}
                    sharingState={sharingState}
                    setSharingState={setSharingState}
                    previewFile={previewFile}
                />



            </div>
        </>
    );
}

export default FileListing;
