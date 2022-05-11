import React, {useEffect, useState} from 'react';
import "./FolderGrid.css";
import UserFile from "./../../Classes/UserFile";
import Validate from "./../../Classes/Validate";
import LoadingAnimation from "./../LoadingAnimation/LoadingAnimation";

// SVG
import fileBackgroundSvg from "./imgs/fileBackground.svg";
import {ReactComponent as StarSvg} from "./imgs/star.svg";
import {ReactComponent as StarSvgActive} from "./imgs/star-full.svg";
import {ReactComponent as DotsSvg} from "./imgs/3-dots.svg";
import {ReactComponent as DownloadSvg} from "./imgs/download.svg";
import {ReactComponent as ShareSvg} from "./imgs/share.svg";
import {ReactComponent as DeleteSvg} from "./imgs/delete.svg";
import {ReactComponent as PreviewSvg} from "./imgs/preview.svg";
import {ReactComponent as RenameSvg} from "./imgs/edit.svg";
import {ReactComponent as SaveSvg} from "./imgs/save.svg";
import folderIcon from "./imgs/folder.svg";

export default function FolderGrid(props) {

    // File data
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
        /*file.download(
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
        );*/
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
            folder.setCurrentFolderInLocalStorage();
            props.reHydrateListing();
        }
    }

    if(folder == null){
        return <></>
    }
    return <>
        <div className='file-grid folder'>
            <div className='folder-container' onClick={navigateToFolder}>
                {/*Icon*/}
                <img
                    className="folder-icon"
                    src={folderIcon}
                />
                {/*Name and rename form*/}
                <form className={`rename-form ${renameState ? "open" : "closed"}`} onSubmit={renameFolder}>
                    <textarea
                        rows="2"
                        className='file-name'
                        id={`rename_folder_textarea_grid_${folder.id}`}
                        disabled={!renameState}
                        defaultValue={renameValue==null?"":renameValue}
                    />
                    <button type="submit">
                        <SaveSvg/>
                    </button>
                </form>
            </div>

            {/*dropdown*/}
            <div className="dropdown-container">
                <button className="file-menu" onClick={openFolderMenu}>
                    <DotsSvg/>
                </button>
                {dropdownState ? (
                    <div className="file-dropdown-menu">
                        <a className="file-dropdown-links" onClick={downloadFolder}>
                            <DownloadSvg/>
                            <span>Download</span>
                        </a>
                        <a className="file-dropdown-links" onClick={downloadFolder}>
                            <ShareSvg/>
                            <span>Share</span>
                        </a>
                        <a className="file-dropdown-links" onClick={openRenameForm}>
                            <RenameSvg/>
                            <span>Rename</span>
                        </a>
                        <a className="file-dropdown-links" onClick={deleteFolder}>
                            <DeleteSvg/>
                            <span>Delete</span>
                        </a>
                    </div>
                ) : ""}
            </div>
            {dropdownState ? (
                <div className="file-dropdown-filter" onClick={closeFolderMenu}></div>
            ) : ""}

            <LoadingAnimation state={loadingAnimationState}/>
        </div>
    </>
}