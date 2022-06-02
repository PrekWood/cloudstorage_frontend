
import React, { useEffect, useState } from 'react';

import UserFile from "./../../../../../../Classes/UserFile";
import Validate from "./../../../../../../Classes/Validate";
import { ReactComponent as UploadSvg } from "./imgs/upload.svg";


export default function FileUploader(props) {
    function submitForm() {
        document.getElementById("fileUploadSubmitButton").click();
    }

    function openFileUploader() {
        document.getElementById("fileUploadInputField").click();
    }


    function uploadFile(event) {
        event.preventDefault();

        const file = new UserFile();
        file.fileToUpload = event.target[0].files[0]
        file.uploadFile(
            props.contextName,
            (response) => {
                props.reHydrateListing()
            },
            (request) => {
                if (!Validate.isEmpty(request.response)) {
                    window.displayError(request.response.data.error);
                } else {
                    window.displayError("Something went wrong. Please try again later");
                }
            }
        );
    }

    return (
        <form onSubmit={uploadFile} className='file-upload-form'>
            <input type="file"
                name="fileToUpload"
                id="fileUploadInputField"
                onChange={submitForm}
                className="hidden"
            />
            <div className="listing-header-btn" onClick={openFileUploader}>
                <UploadSvg />
                Upload
            </div>
            <button type="submit" id="fileUploadSubmitButton" className="hidden"></button>
        </form>
    )
}