import React, { useEffect, useState } from 'react';
import "./FolderListItem.css";
import UserFile from "./../../Classes/UserFile";
import Validate from "./../../Classes/Validate";
import LoadingAnimation from "./../LoadingAnimation/LoadingAnimation";

// SVG
import { ReactComponent as StarSvg } from "./imgs/star.svg";
import { ReactComponent as StarSvgActive } from "./imgs/star-full.svg";
import { ReactComponent as DotsSvg } from "./imgs/3-dots.svg";
import { ReactComponent as DownloadSvg } from "./imgs/download.svg";
import { ReactComponent as ShareSvg } from "./imgs/share.svg";
import { ReactComponent as DeleteSvg } from "./imgs/delete.svg";
import { ReactComponent as PreviewSvg } from "./imgs/preview.svg";
import { ReactComponent as DropDownIcon } from "./imgs/arrow_down.svg";
import {ReactComponent as RenameSvg} from "./imgs/edit.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import folderIcon from "./imgs/folder.svg";
import LayoutContext from "../../Classes/LayoutContext";
import Folder from "../../Classes/Folder";
import defaultUserIcon from "../UserMiniature/imgs/default_user.png";

export default function FolderListItem(props) {

    const [folder, setFolder] = useState(null);
    useEffect(() => {
        setFolder(props.folder);
    }, [props.folder]);

    // Animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Dropdown
    const [dropdownState, setDropdownState] = useState(false);
    function openFolderMenu() {
        setDropdownState(true)
    }
    function closeFolderMenu() {
        setDropdownState(false)
    }

    // Actions
    function downloadFolder() {
        setLoadingAnimationState(true)
        folder.download(
            () => {
                setLoadingAnimationState(false)
            },
            (request) => {
                setLoadingAnimationState(false);
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        );
    }
    function deleteFolder() {
        window.displayWarning(
            "You're about to delete a folder. Are you sure you want to continue?",
            () => {
                setLoadingAnimationState(true)
                folder.delete(
                    () => {
                        setLoadingAnimationState(false);
                        props.reHydrateListing()
                    },
                    (request) => {
                        setLoadingAnimationState(false);
                        if (!Validate.isEmpty(request.response)) {
                            window.displayError(request.response.data.error);
                        } else {
                            window.displayError("Something went wrong. Please try again later");
                        }
                    }
                );
            },
            () => {

            }
        );
    }

    // Renaming state
    const [renameState, setRenameState] = useState(false);
    const [renameValue, setRenameValue] = useState(null);
    useEffect(() => {
        if (folder != null) {
            setRenameValue(folder.name);
        }
    }, [folder]);
    function openRenameForm() {
        closeFolderMenu();
        setRenameState(true)
    }
    function renameFolder(e){
        e.preventDefault();
        const newName = e.target[0].value;
        if(Validate.isEmpty(newName)){
            document.getElementById(`rename_folder_textarea_grid_${folder.id}`).classList.add("invalid");
            return;
        }
        setLoadingAnimationState(true)
        folder.renameTo(
            newName,
            (response)=>{
                setLoadingAnimationState(false);
                setRenameState(false)
                props.reHydrateListing()
            },
            (request)=>{
                setLoadingAnimationState(false);
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        );
    }

    function navigateToFolder(){
        if(!renameState){
            const context = LayoutContext.getContext(props.contextName);
            context.currentFolder = Folder.castToFolder(folder);
            LayoutContext.saveContext(props.contextName, context)

            props.reHydrateListing();
        }
    }

    function openSharingModal(){
        closeFolderMenu()
        props.setPreviewState(false);
        props.setSharingState({
            isActive:true,
            type:"folder",
            object:folder
        });
    }

    return <>
        {folder == null ? "" : (
            <div className='file-list-item folder' >
                <div className='file-list-item-inner' onClick={navigateToFolder}>
                    <div className='file-list-img'>
                        <img
                            className="folder-icon"
                            src={folderIcon}
                        />
                    </div>
                    <form className={`rename-form file-list-name ${renameState ? "open" : "closed"}`} onSubmit={renameFolder}  onClick={navigateToFolder}>
                        <textarea
                            rows="1"
                            className='file-name'
                            id={`rename_folder_textarea_list_${folder.id}`}
                            disabled={!renameState}
                            defaultValue={renameValue==null?"":renameValue}
                        />
                        <button type="submit">
                            <SaveSvg/>
                            Save
                        </button>
                    </form>
                    <span className='file-list-type'>FOLDER</span>
                    {/*Shared with*/}
                    <div className="file-list-type-shared-with shared-with">
                        {Validate.isEmpty(folder.sharedWith) || folder.sharedWith.length === 1 ? "" : folder.sharedWith.map((sharedWithUser)=>(
                            <div className="shared-with-user" key={`shared_with_folder_list_${folder.id}_${sharedWithUser.userId}`}>
                                <img src={Validate.isEmpty(sharedWithUser.userImg) ? defaultUserIcon : `${window.API_URL}/user/${sharedWithUser.userId}/image`} />
                                <div className="tooltip">
                                    {sharedWithUser.userName}
                                </div>
                            </div>
                        ))}
                    </div>
                    <span className='file-list-size file-size'>-</span>


                    <span className='file-list-date'>{folder.dateAdd}</span>
                </div>
                <div className='file-list-download-dropdown'>
                    <button className="file-list-download" onClick={downloadFolder}>
                        <DownloadSvg />
                        Download
                    </button>
                    <button className="file-list-dropdown-toggler" onClick={openFolderMenu}>
                        <DropDownIcon />
                    </button>
                    {dropdownState ? (
                        <div className="file-dropdown-menu">
                            {props.variation === "shared-files" ? "" : (
                                <a className="file-dropdown-links" onClick={openSharingModal}>
                                    <ShareSvg />
                                    <span>Share</span>
                                </a>
                            )}
                            <a className="file-dropdown-links" onClick={openRenameForm}>
                                <RenameSvg/>
                                <span>Rename</span>
                            </a>
                            <a className="file-dropdown-links" onClick={deleteFolder}>
                                <DeleteSvg />
                                <span>Delete</span>
                            </a>
                        </div>
                    ) : ""}
                    {dropdownState ? (
                        <div className="file-dropdown-filter" onClick={closeFolderMenu}></div>
                    ) : ""}
                </div>

                <LoadingAnimation state={loadingAnimationState} />
            </div>
        )}
    </>
}