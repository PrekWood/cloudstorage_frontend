import React, {useEffect, useState} from 'react';
import {ReactComponent as NewFolderSvg} from "./imgs/add.svg";
import Validate from "../../../../Classes/Validate";
import FileListItem from "../../../FileListItem/FileListItem";
import {ReactComponent as PreviousSvg} from "../FileListingGrid/imgs/previous.svg";
import Folder from "../../../../Classes/Folder";
import FolderListItem from "../../../FolderListItem/FolderListItem";
import "./FileListingList.css";
import LayoutContext from "../../../../Classes/LayoutContext";

export default function FileListingList(props) {

    // SharedFiles
    const [files, setFiles] = useState(null);
    useEffect(() => {
        setFiles(props.files)
    }, [props.files]);

    // Folders
    const [folders, setFolders] = useState(null);
    useEffect(() => {
        setFolders(props.folders)
    }, [props.folders]);

    function navigateToPreviousFolder() {
        const context = LayoutContext.getContext(props.contextName)

        // Patent so that it doesn't go to other users file when is shared
        if(Validate.isNotEmpty(context.currentFolder.shared) && context.currentFolder.shared){
            context.currentFolder = new Folder()
            LayoutContext.saveContext(props.contextName)
            props.reHydrateListing();
            return;
        }

        Folder.getFolderDetails(
            context.currentFolder.parentFolderId,
            (response) => {
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

    function createNewFolder() {
        const context = LayoutContext.getContext(props.contextName);
        const currentFolder = context.currentFolder;

        const newFolder = new Folder();
        newFolder.name = "New Folder";
        newFolder.parentFolderId = currentFolder.id;
        newFolder.create(
            () => {
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

    // Right click menu
    const [rightClickMenuState, setRightClickMenuState] = useState({
        isActive:false,
        top:0,
        left:0,
    });
    function showCustomRightClickMenu(e) {
        if (
            Validate.isNotEmpty(props.variation) &&
            (props.variation === "recent" || props.variation==="shared-files")
        ) {
            return;
        }
        e.preventDefault();
        setRightClickMenuState({
            isActive:true,
            top:`${e.clientY}px`,
            left:`${e.clientX}px`,
        })
    }
    function closeCustomRightClickMenu() {
        setRightClickMenuState({
            isActive:false,
            top:0,
            left:0,
        })
    }

    return (
        <>
            <div onContextMenu={showCustomRightClickMenu}>
                <div className='file-list-item file-list-headers'>
                    <div className='file-list-img'></div>
                    <div className='file-list-name'>Name</div>
                    <div className='file-list-type'>Type</div>
                    <div className='file-list-size'>File size</div>
                    <div className='file-list-date'>Date add</div>
                    <div className='file-list-actions'>Actions</div>
                </div>
                {
                    (Validate.isEmpty(props.variation) || props.variation !== "recent") &&
                    (props.currentFolder != null && props.currentFolder.parentFolderId != null) ?
                        (
                            <div className='file-list-item  go-back' onClick={navigateToPreviousFolder}>
                                <div className='file-list-img'>
                                    <PreviousSvg/>
                                </div>
                                <div className='file-list-name'>
                                <span className='file-name'>
                                    /..
                                </span>
                                </div>
                                <div className='file-list-type'></div>
                                <div className='file-list-size'></div>
                                <div className='file-list-date'></div>
                                <div className='file-list-actions'></div>
                            </div>
                        )
                        :
                        ""
                }
                {
                    !Validate.isArrayEmpty(folders) && (Validate.isEmpty(props.variation) || props.variation !== "recent") ?
                        (
                            folders.map((folder) => (
                                < FolderListItem
                                    folder={folder}
                                    key={`folder_list_${folder.id}`}
                                    reHydrateListing={props.reHydrateListing}
                                    // Preview
                                    setPreviewState={props.setPreviewState}
                                    // Sharing
                                    setSharingState={props.setSharingState}
                                    contextName = {props.contextName}
                                />
                            ))
                        )
                        :
                        ""
                }
                {
                    Validate.isArrayEmpty(files) ? "" :
                        files.map((file) => (
                            < FileListItem
                                file={file}
                                key={`file_list_${file.id}`}
                                reHydrateListing={props.reHydrateListing}
                                // Preview
                                setPreviewFile={props.setPreviewFile}
                                setPreviewState={props.setPreviewState}
                                previewFile={props.previewFile}
                                // Sharing
                                setSharingState={props.setSharingState}
                            />
                        ))
                }
            </div>

            <div
                className={`right-click-menu ${rightClickMenuState.isActive?"active":"inactive"}`}
                style={{
                    top:rightClickMenuState.top,
                    left:rightClickMenuState.left,
                }}
            >
                <div className="right-click-menu-item" onClick={()=>{closeCustomRightClickMenu();createNewFolder()}}>
                    <div className="file-icon">
                        <NewFolderSvg/>
                    </div>
                    <span>New Folder</span>
                </div>
            </div>
            <div
                className={`filter right-click-menu-filter ${rightClickMenuState.isActive?"active":"inactive"}`}
                onClick={closeCustomRightClickMenu}
            ></div>
        </>
    )
}