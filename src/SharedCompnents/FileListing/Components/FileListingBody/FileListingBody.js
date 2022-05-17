import React, {useEffect, useState} from 'react';
import "./FileListingBody.css";
import LoadingAnimation from "./../../../LoadingAnimation/LoadingAnimation";
import FileListingGrid from "../FileListingGrid/FileListingGrid";
import FileListingList from "../FileListingList/FileListingList";

function FileListingBody(props) {
    const [files, setFiles] = useState(null);
    const [folders, setFolders] = useState(null);
    const [layout, setLayout] = useState("grid");
    const [variation, setVariation] = useState(null);
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);
    useEffect(() => {
        setFiles(props.files)
    }, [props.files]);
    useEffect(() => {
        setLayout(props.layout)
    }, [props.layout]);
    useEffect(() => {
        setFolders(props.folders)
    }, [props.folders]);
    useEffect(() => {
        setLoadingAnimationState(props.loadingAnimationState)
    }, [props.loadingAnimationState]);
    useEffect(() => {
        setVariation(props.variation)
    }, [props.variation]);

    return (
        <>
            <div className={`file-list ${layout}`}>
                { layout === "grid" ?
                    <FileListingGrid
                        files={files}
                        folders={folders}
                        variation={variation}
                        currentFolder={props.currentFolder}
                        reHydrateListing={props.reHydrateListing}
                        // Preview
                        setPreviewFile={props.setPreviewFile}
                        setPreviewState={props.setPreviewState}
                        previewFile={props.previewFile}
                        // Sharing
                        setSharingState = {props.setSharingState}
                        contextName = {props.contextName}
                    />
                :
                    <FileListingList
                        files={files}
                        folders={folders}
                        reHydrateListing={props.reHydrateListing}
                        currentFolder={props.currentFolder}
                        variation={props.variation}
                        // Preview
                        setPreviewFile={props.setPreviewFile}
                        setPreviewState={props.setPreviewState}
                        previewFile={props.previewFile}
                        // Sharing
                        setSharingState = {props.setSharingState}
                        contextName = {props.contextName}
                    />
                }
                <LoadingAnimation state={loadingAnimationState}/>
            </div>
        </>
    );
}

export default FileListingBody;

