import React, {useEffect, useState} from 'react';
import FileGrid from "./../../../FileGrid/FileGrid";
import {ReactComponent as NewFolderSvg} from "./imgs/add.svg";
import {ReactComponent as PreviousSvg} from "./imgs/previous.svg";
import Validate from "../../../../Classes/Validate";
import Folder from "../../../../Classes/Folder";
import LoadingAnimation from "../../../LoadingAnimation/LoadingAnimation";
import FolderGrid from "../../../FolderGrid/FolderGrid";
import LayoutContext from "../../../../Classes/LayoutContext";

export default function FileListingGrid(props) {

    const [files, setFiles] = useState(null);
    const [folders, setFolders] = useState(null);
    const [variation, setVariation] = useState(null);
    const [newFolderAnimationState, setNewFolderAnimationState] = useState(false);

    useEffect(() => {
        setFiles(props.files)
    }, [props.files]);
    useEffect(() => {
        setFolders(props.folders)
    }, [props.folders]);
    useEffect(() => {
        setVariation(props.variation)
    }, [props.variation]);


    function createNewFolder() {
        setNewFolderAnimationState(true);

        const context = LayoutContext.getContext(props.contextName);
        const currentFolder = context.currentFolder;

        const newFolder = new Folder();
        newFolder.name = "New Folder";
        newFolder.parentFolderId = currentFolder.id;
        newFolder.create(
            () => {
                setNewFolderAnimationState(false);
                props.reHydrateListing();
            },
            (request) => {
                setNewFolderAnimationState(false);
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        )
    }

    function navigateToPreviousFolder() {
        const context = LayoutContext.getContext(props.contextName);
        const currentFolder = context.currentFolder;

        // Patent so that it doesn't go to other users file when is shared
        if(Validate.isNotEmpty(currentFolder.shared) && currentFolder.shared){
            console.log("currentFolder.shared");
            const context = LayoutContext.getContext(props.contextName);
            context.currentFolder = new Folder();
            LayoutContext.saveContext(props.contextName, context)

            props.reHydrateListing();
            return;
        }

        Folder.getFolderDetails(
            currentFolder.parentFolderId,
            (response)=>{
                const folderToRedirect = Folder.castToFolder(response.data);

                const context = LayoutContext.getContext(props.contextName);
                context.currentFolder = folderToRedirect;
                LayoutContext.saveContext(props.contextName, context)

                props.reHydrateListing();
            },
            (request) => {
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
            {
                (Validate.isEmpty(props.variation) || props.variation !== "recent") &&
                (props.currentFolder != null && props.currentFolder.parentFolderId != null) ?
                    (
                        <div className="file-grid go-back" onClick={navigateToPreviousFolder}>
                            <div className="file-icon">
                                <PreviousSvg/>
                            </div>
                            <span>Wanna go back?</span>
                        </div>
                    )
                    :
                    ""
            }
            {
                !Validate.isArrayEmpty(folders) && (Validate.isEmpty(props.variation) || props.variation !== "recent") ?
                    (
                        folders.map((folder) => (
                            < FolderGrid
                                folder={folder}
                                key={`folder_grid_${folder.id}`}
                                reHydrateListing={props.reHydrateListing}
                                // Preview
                                setPreviewState={props.setPreviewState}
                                // Sharing
                                setSharingState = {props.setSharingState}
                                contextName = {props.contextName}
                                variation = {props.variation}
                            />
                        ))
                    )
                    :
                    ""
            }
            {
                Validate.isArrayEmpty(files) ? "" :
                (files.map((file) => (
                    < FileGrid
                        file={file}
                        key={`filer_grid_${file.id}`}
                        variation = {props.variation}
                        reHydrateListing={props.reHydrateListing}
                        // Preview
                        setPreviewFile={props.setPreviewFile}
                        setPreviewState={props.setPreviewState}
                        previewFile={props.previewFile}
                        // Sharing
                        setSharingState = {props.setSharingState}
                    />
                )))
            }
            {
                (Validate.isEmpty(props.variation) || (props.variation !== "recent" && props.variation !== "shared-files")) ?
                    (

                        <div className="file-grid new-folder" onClick={createNewFolder}>
                            <div className="file-icon">
                                <NewFolderSvg/>
                            </div>
                            <span>New Folder</span>
                            <LoadingAnimation state={newFolderAnimationState}/>
                        </div>
                    )
                :
                ""
            }
        </>
    )
}