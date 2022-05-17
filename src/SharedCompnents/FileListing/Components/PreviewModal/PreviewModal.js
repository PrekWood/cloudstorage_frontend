import React, { useEffect, useState } from 'react';
import "./PreviewModal.css"

// Svg
import {ReactComponent as StarSvg} from "./imgs/star.svg";
import {ReactComponent as StarFullSvg} from "./imgs/star-full.svg";
import Validate from "../../../../Classes/Validate";
import LoadingAnimation from "../../../LoadingAnimation/LoadingAnimation";
import fileBackgroundSvg from "../../../FileGrid/imgs/fileBackground.svg";
import {ReactComponent as SaveSvg} from "../../../FileGrid/imgs/save.svg";
import {ReactComponent as RenameSvg} from "../../../FileGrid/imgs/edit.svg";
import {ReactComponent as ClosePreviewSvg} from "./imgs/close_preview.svg";
import {ReactComponent as CloseRenameSvg} from "./imgs/close.svg";
import {ReactComponent as DownloadSvg} from "../../../FileGrid/imgs/download.svg";
import {ReactComponent as ShareSvg} from "../../../FileGrid/imgs/share.svg";
import {ReactComponent as DeleteSvg} from "../../../FileGrid/imgs/delete.svg";

export default function PreviewModal(props) {

    // File
    const [file, setFile] = useState(false);
    useEffect(() => {
        setFile(props.previewFile)
    }, [props.previewFile]);

    // Loading animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Renaming state
    const [renameState, setRenameState] = useState(false);
    const [renameValue, setRenameValue] = useState(null);
    useEffect(() => {
        if (file != null) {
            setRenameValue(file.name);
        }
    }, [file]);
    function openRenameForm() {
        let fileName = file.name;
        let extension = file.extension;
        if (fileName.substring(fileName.length - extension.length - 1, fileName.length) === "." + extension) {
            const fileNameWithoutExt = fileName.substring(0, fileName.length - extension.length - 1);
            setRenameValue(fileNameWithoutExt)
            document.getElementById(`rename_preview_file`).value = fileNameWithoutExt;
        }
        setRenameState(true)
    }
    function renameFile(e) {
        e.preventDefault();
        const newName = e.target[0].value;
        if (Validate.isEmpty(newName)) {
            document.getElementById(`rename_preview_file`).classList.add("invalid");
            return;
        }
        setLoadingAnimationState(true)
        file.renameTo(
            newName,
            (response) => {
                setLoadingAnimationState(false);
                setRenameValue(response.data.name)
                document.getElementById(`rename_preview_file`).classList.remove("invalid");
                document.getElementById(`rename_preview_file`).value = response.data.name;
                setRenameState(false)
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
    }

    // Actions
    // Favorite
    function toggleFavotite(){
        setLoadingAnimationState(true);
        file.toggleFavorites(()=>{
            setLoadingAnimationState(false);
            props.reHydrateListing();
        },(request)=>{
            setLoadingAnimationState(false);
            if (!Validate.isEmpty(request.response)) {
                window.displayError(request.response.data.error);
            } else {
                window.displayError("Something went wrong. Please try again later");
            }
        })
    }
    // Download
    function downloadFile() {
        setLoadingAnimationState(true)
        file.download(
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
    // Delete
    function deleteFile() {
        window.displayWarning(
            "You're about to delete a file. Are you sure you want to continue?",
            () => {
                setLoadingAnimationState(true)
                // const idFile = file.id;
                file.delete(
                    () => {
                        setLoadingAnimationState(false);
                        props.reHydrateListing(null, null, true)
                        if(props.previewFile != null && props.previewFile.id === file.id){
                            props.setPreviewState(false);
                        }
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

    function openShareModal(){
        props.setPreviewState(false);
        props.setSharingState({
            isActive:true,
            type:"file",
            object:file
        });
    }

    return (
        <>
            <div className={`preview-modal ${props.previewState?"open":""}`}>
                <div className="preview-modal-inner">

                    <button onClick={()=>{props.setPreviewState(false)}} className="close-modal">
                        Close
                        <ClosePreviewSvg />
                    </button>

                    <div className="modal-header">
                        <h2>File Preview</h2>
                        {/*favorite*/}
                        <button className="modal-favorite" onClick={toggleFavotite}>
                            {file.favorite ? <StarFullSvg /> : <StarSvg />  }
                        </button>
                    </div>

                    {/*File icon*/}
                    <div className='file-icon' style={{backgroundImage: `url(${fileBackgroundSvg})`}}>
                        <img
                            className={`file-type-img ${file.fileTypeIconExists ? "" : "hidden"}`}
                            src={file.fileTypeIconExists ? `${window.BACKEND_BASE_URL}${file.fileTypeIconLink}` : ""}
                        />
                        <span className='file-extention'>{file.extension}</span>
                    </div>

                    {/*Name and rename form*/}
                    <div className="file-name-container">
                        <form className={`rename-form ${renameState ? "open" : "closed"}`} onSubmit={renameFile}>
                        <textarea
                            rows="1"
                            className='file-name'
                            id={`rename_preview_file`}
                            disabled={!renameState}
                            defaultValue={renameValue == null ? "" : renameValue}
                        />
                            <span className="rename-file-extention">.{file.extension}</span>
                            <button type="submit">
                                <SaveSvg/>
                            </button>
                        </form>
                        <button className="rename-button" onClick={openRenameForm}>
                            <RenameSvg/>
                        </button>
                    </div>

                    {/*size and datadd*/}
                    <div className="file-info">
                        <span className="file-size">{file.size}</span>
                        <span className="file-size">{file.dateAdd}</span>
                    </div>

                    <button className="modal-action-btn" onClick={downloadFile}>
                        <DownloadSvg/>
                        <span>Download</span>
                    </button>

                    {props.variation === "shared-files" ? "" : (
                        <button className="modal-action-btn" onClick={openShareModal}>
                            <ShareSvg/>
                            <span>Share</span>
                        </button>
                    )}

                    <button className="modal-action-btn delete" onClick={deleteFile}>
                        <DeleteSvg/>
                        <span>Delete</span>
                    </button>

                </div>
                <LoadingAnimation state={loadingAnimationState}/>
            </div>
        </>
    )
}