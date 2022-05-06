import React, { useEffect, useState } from 'react';
import "./FileListItem.css";
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

export default function FileListItem(props) {

    const [file, setFile] = useState(null);
    useEffect(() => {
        setFile(props.file);
    }, [props.file]);
    function addToFavorites() {
        if (file instanceof UserFile) {
            setLoadingAnimationState(true)
            file.toggleFavorites(
                (response) => {
                    setLoadingAnimationState(false)
                    const fileObj = UserFile.castToUserFile(response.data);
                    setFile(fileObj);
                },
                (request) => {
                    setLoadingAnimationState(false)
                    if (!Validate.isEmpty(request.response)) {
                        window.displayError(request.response.data.error);
                    } else {
                        window.displayError("Something went wrong. Please try again later");
                    }
                }
            );
        }
    }

    // Animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Dropdown
    const [dropdownState, setDropdownState] = useState(false);
    function openFileMenu() {
        setDropdownState(true)
    }
    function closeFileMenu() {
        setDropdownState(false)
    }

    // Actions
    function downloadFile() {
        setLoadingAnimationState(true)
        file.download(
            () => { setLoadingAnimationState(false) },
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
    function deleteFile() {
        window.displayWarning(
            "You're about to delete a file. Are you sure you want to continue?",
            () => {
                setLoadingAnimationState(true)
                file.delete(
                    () => { setLoadingAnimationState(false); props.reHydrateListing() },
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
            () => { }
        );

    }

    return <>
        {file == null ? "" : (
            <div className='file-list-item'>
                <div className='file-list-img'>
                    {file.fileTypeIconExists ? (
                        <img
                            className={`file-type-img ${file.fileTypeIconExists ? "" : "hidden"}`}
                            src={file.fileTypeIconExists ? `${window.BACKEND_BASE_URL}${file.fileTypeIconLink}` : ""}
                        />
                    ) :
                        <span className='file-extention'>{file.extension}</span>
                    }
                </div>
                <span className='file-list-name'>{file.name}</span>
                <span className='file-list-type'>{file.extension}</span>
                <span className='file-list-size file-size'>{file.size}</span>
                <span className='file-list-date'>{file.dateAdd}</span>

                <div className='file-list-download-dropdown'>
                    <button className="file-list-download" onClick={downloadFile}>
                        <DownloadSvg />
                        Download
                    </button>
                    <button className="file-list-dropdown-toggler" onClick={openFileMenu}>
                        <DropDownIcon />
                    </button>
                    {dropdownState ? (
                        <div className="file-dropdown-menu">
                            <a className="file-dropdown-links" onClick={downloadFile}>
                                <DownloadSvg />
                                <span>Download</span>
                            </a>
                            <a className="file-dropdown-links" onClick={downloadFile}>
                                <ShareSvg />
                                <span>Share</span>
                            </a>
                            <a className="file-dropdown-links" onClick={downloadFile}>
                                <PreviewSvg />
                                <span>Preview</span>
                            </a>
                            <a className="file-dropdown-links" onClick={deleteFile}>
                                <DeleteSvg />
                                <span>Delete</span>
                            </a>
                        </div>
                    ) : ""}
                    {dropdownState ? (
                        <div className="file-dropdown-filter" onClick={closeFileMenu}></div>
                    ) : ""}
                </div>

                <button className="file-favorites" onClick={addToFavorites}>
                    {file.favorite ? <StarSvgActive /> : <StarSvg />}
                </button>

                <LoadingAnimation state={loadingAnimationState} />
            </div>
        )}
    </>
}