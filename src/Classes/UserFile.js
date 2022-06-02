import axios from "axios";
import Model from "./Model";
import User from "./User";
import Validate from "./Validate";
import FileManager from "./FileManager";
import SortingPreferences from "./SortingPreferences";
import Folder from "./Folder";
import DigitalSignature from "./DigitalSignature";
import Shareable from "./Shareable";
import LayoutContext from "./LayoutContext";

export default class UserFile extends Shareable {

    constructor() {
        super();
        this.id = null;
        this.idUser = null;
        this.name = null;
        this.path = null;
        this.size = null;
        this.extension = null;
        this.fileToUpload = null;
        this.fileTypeIconExists = null;
        this.fileTypeIconLink = null;
        this.favorite = null;
        this.dateAdd = null;
        this.sharedWith = null;
        this.imagePath = null;
    }

    static castToUserFile(file) {
        const fileObj = new UserFile();
        fileObj.extension = file.extension;
        fileObj.fileTypeIconExists = file.fileTypeIconExists;
        fileObj.fileTypeIconLink = file.fileTypeIconLink;
        fileObj.id = file.id;
        fileObj.idUser = file.idUser;
        fileObj.name = file.name;
        fileObj.path = file.path;
        fileObj.size = file.size;
        fileObj.favorite = file.favorite;
        fileObj.dateAdd = file.dateAdd;
        fileObj.sharedWith = file.sharedWith;
        fileObj.imagePath = file.imagePath;
        return fileObj;
    }

    uploadFile(contextName, successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const formData = new FormData()

        const context = LayoutContext.getContext(contextName);
        const currentFolder = context.currentFolder;

        let folderId = -1;
        if(!Validate.isEmpty(currentFolder) &&
            !currentFolder.isEmpty() &&
            Validate.isNotEmpty(currentFolder.id)
        ){
            folderId = currentFolder.id
        }
        formData.append("folderId",folderId);
        formData.append("file", this.fileToUpload);

        axios.post(
            `${window.API_URL}/file`,
            formData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': `multipart/form-data`,
                }
            }
        ).then((response) => {
            console.log("file upload succes")
            successMethod(response);
        }).catch((error) => {
            console.log("file upload error")
            errorMethod(error);
        });
    }

    toggleFavorites(successMethod, errorMethod) {
        if (Validate.isEmpty(this.id)) {
            errorMethod();
            return;
        }

        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;

        axios({
            method: 'put',
            url: `${window.API_URL}/file/${this.id}/`,
            headers: this.getHeaders(authToken),
            data:{
                favorite:!this.favorite
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    download(successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const file = this;
        axios({
            method: 'get',
            url: `${window.API_URL}/file/${this.id}/download`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            DigitalSignature.validate(
                response.data,
                (validationResponse) => {
                    const fileBytes = validationResponse.data.fileBytes;
                    const fileBlob = FileManager.createBlobFromFileBytes(fileBytes);
                    FileManager.downloadBlob(fileBlob, file.name);
                    successMethod();
                },
                errorMethod
            )
        }).catch(function (error) {
            errorMethod(error);
        });

    }

    delete(successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const file = this;
        axios({
            method: 'delete',
            url: `${window.API_URL}/file/${this.id}/`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    renameTo(newName, successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const file = this;
        axios({
            method: 'put',
            url: `${window.API_URL}/file/${this.id}/`,
            headers: this.getHeaders(authToken),
            data:{
                fileName:`${newName}.${file.extension}`
            }
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }


    static getFileById(idFile, successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'get',
            url: `${window.API_URL}/file/${idFile}/`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            successMethod(UserFile.castToUserFile(response.data))
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    generateShareableLink(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'post',
            url: `${window.API_URL}/share/link`,
            headers: this.getHeaders(authToken),
            data:{
                objectId:this.id,
                type:"FILE"
            }
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    shareWithUsers(usersToShareWith, successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'post',
            url: `${window.API_URL}/share/users`,
            headers: this.getHeaders(authToken),
            data:{
                objectId:this.id,
                type:"FILE",
                users:usersToShareWith
            }
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getFilesSharedWithUser(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;

        const context = LayoutContext.getContext("sharedFilesContext");
        const sortingPrefs = context.sortingPreferences;
        const currentFolder = context.currentFolder;

        let ajaxUrl = `${window.API_URL}/files`;
        if (Validate.isNotEmpty(sortingPrefs.orderBy) && Validate.isNotEmpty(sortingPrefs.orderWay)) {
            ajaxUrl += `/${sortingPrefs.orderBy}/${sortingPrefs.orderWay}`;
        }
        if (Validate.isNotEmpty(currentFolder) && Validate.isNotEmpty(currentFolder.id)) {
            ajaxUrl += `?folderId=${currentFolder.id}`;
        }else{
            ajaxUrl += `?folderId=-1`;
        }
        ajaxUrl += `&onlyShared=true`;
        if (Validate.isNotEmpty(context.sortingPreferences.searchQuery)) {
            ajaxUrl += `&searchQuery=${context.sortingPreferences.searchQuery}`;
        }

        axios({
            method: 'get',
            url: ajaxUrl,
            headers: Model.getHeaders(authToken),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }


}