import React, { useEffect, useState } from 'react';
import "./FileGrid.css";
import UserFile from "./../../Classes/UserFile";
import Validate from "./../../Classes/Validate";
import LoadingAnimation from "./../LoadingAnimation/LoadingAnimation";

// SVG
import fileBackgroundSvg from "./imgs/fileBackground.svg";
import { ReactComponent as StarSvg } from "./imgs/star.svg";
import { ReactComponent as StarSvgActive } from "./imgs/star-full.svg";
import { ReactComponent as DotsSvg } from "./imgs/3-dots.svg";
import { ReactComponent as DownloadSvg } from "./imgs/download.svg";
import { ReactComponent as ShareSvg } from "./imgs/share.svg";
import { ReactComponent as DeleteSvg } from "./imgs/delete.svg";
import { ReactComponent as PreviewSvg } from "./imgs/preview.svg";

export default function FileGrid(props) {

    const [file, setFile] = useState(null);
    useEffect(() => {
        setFile(props.file);
    }, [props.file]);
    function addToFavorites() {
        if (file instanceof UserFile) {
            setLoadingAnimationState(true);
            file.toggleFavorites(
                (response) => {
                    setLoadingAnimationState(false)
                    const fileObj = UserFile.castToUserFile(response.data);
                    setFile(fileObj);
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
            () => {

            }
        );

    }

    return <>
        {file == null ? "" : (
            <div className='file-grid'>
                <div className='file-icon' style={{ backgroundImage: `url(${fileBackgroundSvg})` }}>
                    <img
                        className={`file-type-img ${file.fileTypeIconExists ? "" : "hidden"}`}
                        src={file.fileTypeIconExists ? `${window.BACKEND_BASE_URL}${file.fileTypeIconLink}` : ""}
                    />
                    <span className='file-extention'>{file.extension}</span>
                </div>
                <span className='file-name'>{file.name}</span>
                <span className='file-size'>{file.size}</span>
                <span >{file.fileTypeImageLink}</span>
                <button className="file-favorites" onClick={addToFavorites}>
                    {file.favorite ? <StarSvgActive /> : <StarSvg />}
                </button>
                <button className="file-menu" onClick={openFileMenu}>
                    <DotsSvg />
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
                </button>
                {dropdownState ? (
                    <div className="file-dropdown-filter" onClick={closeFileMenu}></div>
                ) : ""}

                <LoadingAnimation state={loadingAnimationState} />
            </div>
        )}
    </>
}