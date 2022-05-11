import React, {useEffect, useState} from 'react';
import FileGrid from "./../../../FileGrid/FileGrid";
import {ReactComponent as NewFolderSvg} from "./imgs/add.svg";
import {ReactComponent as PreviousSvg} from "./imgs/previous.svg";
import Validate from "../../../../Classes/Validate";
import Folder from "../../../../Classes/Folder";
import LoadingAnimation from "../../../LoadingAnimation/LoadingAnimation";
import FolderGrid from "../../../FolderGrid/FolderGrid";

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

        const newFolder = new Folder();
        newFolder.name = "New Folder";
        newFolder.parentFolderId = Folder.loadFromLoalStorage().id;
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
        const currentFolder = Folder.loadFromLoalStorage();
        Folder.getFolderDetails(
            currentFolder.parentFolderId,
            (response)=>{
                const folderToRedirect = Folder.castToFolder(response.data);
                folderToRedirect.setCurrentFolderInLocalStorage();
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
                                key={`folder_${folder.id}`}
                                reHydrateListing={props.reHydrateListing}
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
                        key={`file_${file.id}`}
                        reHydrateListing={props.reHydrateListing}
                    />
                )))
            }
            {
                (Validate.isEmpty(props.variation) || props.variation !== "recent") ?
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