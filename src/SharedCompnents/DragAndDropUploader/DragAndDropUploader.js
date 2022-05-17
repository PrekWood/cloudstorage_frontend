import React, {useEffect, useState} from 'react';
import './DragAndDropUploader.css';
import uploadSvg from "./imgs/upload.svg";
import UserFile from "../../Classes/UserFile";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import Validate from "../../Classes/Validate";

export default function DragAndDropUploader(props) {

    const [active, setActive] = useState(false);
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);
    const [triggerCounter, setTriggerCounter] = useState(0);

    function dragLeave(e) {
        console.log("dragLeave")
        hideDropZone();
    }

    function dragEnter(e) {
        e.preventDefault();
        setTriggerCounter(triggerCounter + 1);
    }

    function showDropZone() {
        setActive(true)
    }

    function hideDropZone() {
        setActive(false)
    }

    function uploadFile(e) {
        e.preventDefault();
        hideDropZone();

        // Get file to upload
        const fileToUpload = e.dataTransfer.files[0]

        // upload file
        const newFile = new UserFile();
        newFile.fileToUpload = fileToUpload;
        setLoadingAnimationState(true);
        newFile.uploadFile(
            props.contextName,
            () => {
                setLoadingAnimationState(false);
                props.reHydrateListing();
            },
            (request) => {
                setLoadingAnimationState(false)
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        )
    }

    window.addEventListener('dragenter', function (e) {
        setTriggerCounter(0);
        showDropZone();
    });

    return (
        <>
            <div id="dropzone"
                 style={{display: active ? "flex" : "none"}}
                 className="dropzone no-files"
                 onDragEnter={dragEnter}
                 onDragLeave={dragLeave}
                 onDrop={uploadFile}
                 onDragOver={(e) => {
                     e.preventDefault()
                 }}
            >
                <div>
                    <span>Drop it like it's hot!</span>
                    <div className="upload-icon">
                        <img src={uploadSvg}/>
                    </div>
                </div>
            </div>
            <LoadingAnimation state={loadingAnimationState} />
        </>
    );
}