import React, {useEffect, useState} from 'react';
import LoginBackground from "../Login/Components/LoginBackground/LoginBackground";
import LoginLogo from "../Login/Components/LoginLogo/LoginLogo";
import ShareFileForm from "./Components/ShareFileForm/ShareFileForm";
import Shareable from "../../Classes/Shareable";
import Validate from "../../Classes/Validate";
import "./Share.css"
import {ReactComponent as DownloadSvg} from "../../SharedCompnents/FileGrid/imgs/download.svg";
import WarningMessage from "../../SharedCompnents/WarningMessage/WarningMessage";

export default function Share(props) {

    const [file, setFile] = useState(null);
    const [sender, setSender] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [digitalSignature, setDigitalSignature] = useState(null);
    const [fileBytes, setFileBytes] = useState(null);

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("t");

        if(Validate.isEmpty("accessToken")){
            alert("something is wrong with the token")
        }

        Shareable.getFileByAccessToken(
            accessToken,
            (response)=>{
                if(Validate.isEmpty(response) || Validate.isEmpty(response.data)){
                    alert("something is wrong with the token")
                    return;
                }
                setFile(response.data.file);
                setSender(response.data.sender);
                setFileType(response.data.type);
                setDigitalSignature(response.data.digitalSignature);
                setFileBytes(response.data.fileBytes);
            },
            ()=>{

            }
        )
    },[])


    return <>
        <LoginBackground/>
        <LoginLogo/>
        <ShareFileForm
            file={file}
            sender={sender}
            fileType={fileType}
            digitalSignature={digitalSignature}
            fileBytes={fileBytes}
        />
    </>
}