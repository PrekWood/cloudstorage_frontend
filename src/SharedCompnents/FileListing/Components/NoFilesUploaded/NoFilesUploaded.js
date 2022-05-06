import { ReactComponent as UploadSvg } from "./imgs/upload.svg"
import "./NoFilesUploaded.css"

function NoFilesUploaded(props) {

    function uploadFile() {
        document.getElementById("fileUploadInputField").click();
    }

    return (
        <>
            <div className="no-files" onClick={uploadFile}>
                <span>It seems you don't have <br />any files yet</span>
                <div className="upload-icon">
                    <UploadSvg />
                </div>
            </div>
        </>
    );
}

export default NoFilesUploaded;
