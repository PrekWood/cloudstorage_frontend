import React, {useEffect, useState} from 'react';
import {ReactComponent as ShareByMailSvg} from "../../imgs/share-by-mail.svg";
import InputField from "../../../../../InputField/InputField";
import Validate from "../../../../../../Classes/Validate";
import CheckBox from "../../../../../CheckBox/CheckBox";
import SubmitButton from "../../../../../SubmitButton/SubmitButton";
import addSvg from "../../imgs/add.svg";
import {ReactComponent as ShareByLinkSvg} from "../../imgs/share-by-link.svg";
import {ReactComponent as CopySvg} from "../../imgs/copy.svg";

export default function FileSharingByLink(props) {

    function copyLink(){
        var copyText = document.getElementById("shareable_link");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);

        const successMessage = document.getElementById("copy-to-clipboard-success");
        if(Validate.isEmpty(successMessage)){
            let successDiv = document.createElement("div")
            successDiv.id = "copy-to-clipboard-success"
            successDiv.className = "active"
            successDiv.append("Copy Successful!")
            document.getElementsByClassName("link-container")[0].append(successDiv)
        }else{
            successMessage.classList.add("active")
        }
        setTimeout(()=>{
            successMessage.classList.remove("active")
        }, 2000)
    }

    return (
        <div className="link-sharing-form sharing-container">
            <div className="header">
                <h3>
                    <ShareByLinkSvg/>
                    <span>Share by link</span>
                </h3>
                <button className="back-icon" onClick={() => {
                    props.setSharingType(null)
                }}>Back</button>

            </div>
            <div className="link-container">
                <input type="text" id="shareable_link" readOnly value={props.shareableLink == null ? "" : props.shareableLink}/>
                <button id="copy_link" onClick={()=>{copyLink()}}>
                    <CopySvg/>
                </button>
            </div>
        </div>
    )
}