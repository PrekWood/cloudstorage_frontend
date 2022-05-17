import React, {useEffect, useState} from 'react';
import "./ShareFileForm.css"
import UserMiniature from "../../../../SharedCompnents/UserMiniature/UserMiniature";
import FileGrid from "../../../../SharedCompnents/FileGrid/FileGrid";
import {ReactComponent as DownloadSvg} from "../../../../SharedCompnents/FileGrid/imgs/download.svg";
import FolderGrid from "../../../../SharedCompnents/FolderGrid/FolderGrid";
import Validate from "../../../../Classes/Validate";
import LoadingAnimation from "../../../../SharedCompnents/LoadingAnimation/LoadingAnimation";
import UserFile from "../../../../Classes/UserFile";
import DigitalSignature from "../../../../Classes/DigitalSignature";
import FileManager from "../../../../Classes/FileManager";

export default function ShareFileForm(props) {

    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    function downloadFile(file, type){
        setLoadingAnimationState(true)
            console.log(props);
            DigitalSignature.validate(
                {
                    digitalSignature:props.digitalSignature,
                    file:props.fileBytes,
                },
                (validationResponse) => {
                    setLoadingAnimationState(false)
                    const fileBytes = validationResponse.data.fileBytes;
                    const fileBlob = FileManager.createBlobFromFileBytes(fileBytes);
                    if(type === "file"){
                        FileManager.downloadBlob(fileBlob, file.name);
                    }else{
                        FileManager.downloadBlob(fileBlob, file.name+".zip");
                    }
                },
                ()=>{}
            )
    }

    return <>
        <div className="form-container shareable">
            <h1>
                Someone sent <br/>you something 🎁
            </h1>
            <div className={`login-form active`}>
                <h2>Shared files</h2>
                {props.fileType === "file" ?
                    <FileGrid
                        file={props.file}
                        variation="link"
                    />
                    :
                    <FolderGrid
                        folder={props.file}
                        variation="link"
                    />
                }
                <br />
                <UserMiniature user={props.sender} variation="no-logout"/>

                <button id="link_download" onClick={()=>{downloadFile(props.file, props.fileType)}}>
                    <DownloadSvg/>
                    Download
                </button>
            </div>
            <LoadingAnimation state={loadingAnimationState}/>
        </div>
    </>
}