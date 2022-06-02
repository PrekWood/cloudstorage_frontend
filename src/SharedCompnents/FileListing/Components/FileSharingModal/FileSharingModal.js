import React, {useEffect, useState} from 'react';
import "./FileSharingModal.css"
import {ReactComponent as ClosePreviewSvg} from "../PreviewModal/imgs/close_preview.svg";
import LoadingAnimation from "../../../LoadingAnimation/LoadingAnimation";
import sharingImg from "./imgs/sharing-icon.png";
import {ReactComponent as ShareByMailSvg} from "./imgs/share-by-mail.svg";
import {ReactComponent as ShareByLinkSvg} from "./imgs/share-by-link.svg";
import {ReactComponent as CopySvg} from "./imgs/copy.svg";
import Validate from "../../../../Classes/Validate";
import InputField from "../../../InputField/InputField";
import CheckBox from "../../../CheckBox/CheckBox";
import SubmitButton from "../../../SubmitButton/SubmitButton";
import addSvg from "./imgs/add.svg";
import FileSharingByEmail from "./Components/FileSharingByEmail/FileSharingByEmail";
import FileSharingByLink from "./Components/FileSharingByLink/FileSharingByLink";


export default function FileSharingModal(props) {


    // File
    const [object, setObject] = useState(false);
    useEffect(() => {
        setObject(props.sharingState.object)
        setSharingType(null);
    }, [props.sharingState]);

    // Loading animation
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);

    // Sharing type
    const TYPE_LINK = "link";
    const TYPE_EMAIL = "email";
    const [sharingType, setSharingType] = useState(null);

    // Link
    const [shareableLink, setShareableLink] = useState(null);

    function closeModal() {
        props.setSharingState({
            isActive: false,
            type: "file",
            object: null
        });
    }

    function generateLink(){
        if(Validate.isEmpty(object)){
            alert('error')
        }

        setLoadingAnimationState(true);
        object.generateShareableLink(
            (response)=>{
                setLoadingAnimationState(false);
                if(Validate.isEmpty(response.data)){
                    alert('error')
                }
                const accessToken = response.data.accessToken;
                setShareableLink(`http://localhost:3000/share?t=${accessToken}`)
            },
            (request)=>{
                setLoadingAnimationState(false);
            }
        );

        setSharingType(TYPE_LINK)
    }

    function startEmailSharing(){
        setSharingType(TYPE_EMAIL)
    }

    return (<>
        <div className={`sharing-modal ${props.sharingState.isActive ? "open" : ""} ${sharingType==null ? "starting" : sharingType}`}>
            {Validate.isEmpty(object) ? "" :
                <div className="preview-modal-inner ">
                    <button onClick={closeModal} className="close-modal">
                        Close
                        <ClosePreviewSvg/>
                    </button>
                    <div className="modal-header">
                        <h2>File Sharing</h2>
                    </div>
                    <div className="starting-sharing-modal sharing-container">
                        <div className="sharing-file-info">
                            <img src={sharingImg} className="sharing-img"/>
                            {/*Name*/}
                            <div className="file-name-container">
                                <textarea
                                    rows="1"
                                    className='file-name'
                                    defaultValue={object == null ? "" : object.name}
                                />
                            </div>
                            {/*size and datadd*/}
                            <div className="file-info">
                                {props.sharingState.type === "file" ?
                                    (
                                        <>
                                            <span className="file-size">{object.size}</span>
                                            <span className="file-size">{object.dateAdd}</span>
                                        </>
                                    ) :
                                    (
                                        <>
                                            <span className="file-size">{object.dateAdd}</span>
                                        </>
                                    )
                                }
                            </div>
                        </div>

                        <div className="sharing-option link">
                            <button className="modal-action-btn" onClick={generateLink}>
                                <ShareByLinkSvg/>
                                <span>Share by link</span>
                            </button>
                            <span className="small">Great option for sharing fil
                            es with users that don't use cloudstorage  </span>
                        </div>
                        <div className="sharing-option email">
                            <button className="modal-action-btn" onClick={startEmailSharing}>
                                <ShareByMailSvg/>
                                <span>Share by email</span>
                            </button>
                            <span className="small">Fits perfectly anyone that needs to share
                                their files to another cloudstorage user</span>
                        </div>
                    </div>


                    <FileSharingByLink
                        setSharingType={setSharingType}
                        shareableLink={shareableLink}
                    />

                    <FileSharingByEmail
                        sharingType={sharingType}
                        setSharingType={setSharingType}
                        file={object}
                        fileType={sharingType}
                    />

                </div>
            }
            <LoadingAnimation state={loadingAnimationState}/>
        </div>
    </>)
}