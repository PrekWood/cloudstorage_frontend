
import React, { useEffect, useState } from 'react';
import "./FileListingBody.css";
import FileGrid from "./../../../FileGrid/FileGrid";
import FileListItem from "./../../../FileListItem/FileListItem";
import LoadingAnimation from "./../../../LoadingAnimation/LoadingAnimation";

function FileListingBody(props) {
    const [files, setFiles] = useState(null);
    const [layout, setLayout] = useState("grid");
    const [loadingAnimationState, setLoadingAnimationState] = useState(false);
    useEffect(() => {
        setFiles(props.files)
    }, [props.files]);
    useEffect(() => {
        setLayout(props.layout)
    }, [props.layout]);
    useEffect(() => {
        setLoadingAnimationState(props.loadingAnimationState)
    }, [props.loadingAnimationState]);


    return (
        <>
            <div className={`file-list ${layout}`}>
                {files == null ?
                    "" :
                    layout == "grid" ?
                        files.map((file) => (
                            < FileGrid
                                file={file}
                                key={file.id}
                                reHydrateListing={props.reHydrateListing}
                            />
                        ))
                        :
                        <>
                            <div className='file-list-item file-list-headers'>
                                <div className='file-list-img'></div>
                                <div className='file-list-name'>Name</div>
                                <div className='file-list-type'>Type</div>
                                <div className='file-list-size'>File size</div>
                                <div className='file-list-date'>Date add</div>
                                <div className='file-list-actions'>Actions</div>
                            </div>
                            {
                                files.map((file) => (
                                    < FileListItem file={file} key={file.id} reHydrateListing={props.reHydrateListing} />
                                ))
                            }
                        </>
                }
                <LoadingAnimation state={loadingAnimationState} />
            </div>
        </>
    );
}

export default FileListingBody;

