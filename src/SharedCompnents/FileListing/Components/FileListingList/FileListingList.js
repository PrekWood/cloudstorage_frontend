import React, {useEffect, useState} from 'react';
import {ReactComponent as NewFolderSvg} from "./imgs/add.svg";
import Validate from "../../../../Classes/Validate";
import FileListItem from "../../../FileListItem/FileListItem";
import {ReactComponent as PreviousSvg} from "../FileListingGrid/imgs/previous.svg";
import Folder from "../../../../Classes/Folder";
import FolderListItem from "../../../FolderListItem/FolderListItem";
import "./FileListingList.css";

export default function FileListingList(props) {

    // Files
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

    function createNewFolder() {
        const newFolder = new Folder();
        newFolder.name = "New Folder";
        newFolder.parentFolderId = Folder.loadFromLoalStorage().id;
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

    return (
        <>
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
                        <div className='file-list-item  go-back'  onClick={navigateToPreviousFolder}>
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
                files.map((file) => (
                    < FileListItem file={file} key={file.id} reHydrateListing={props.reHydrateListing}/>
                ))
            }

            {
                (Validate.isEmpty(props.variation) || props.variation !== "recent") ?
                    (
                        <div className="file-list-item new-folder" onClick={createNewFolder}>
                            <div className="file-icon">
                                <NewFolderSvg/>
                            </div>
                            <span>New Folder</span>
                        </div>
                    )
                    :
                    ""
            }
        </>
    )
}