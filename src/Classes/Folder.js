import Model from "./Model";
import axios from "axios";
import User from "./User";
import Validate from "./Validate";
import FileManager from "./FileManager";
import DigitalSignature from "./DigitalSignature";
import Shareable from "./Shareable";
import SortingPreferences from "./SortingPreferences";
import LayoutContext from "./LayoutContext";

export default class Folder extends Shareable {

    constructor() {
        super();
        this.id = null;
        this.name = null;
        this.parentFolderId = null;
        this.idUser = null;
        this.breadcrumb = null;
        this.dateAdd = null;
        this.shared = false;
        this.sharedWith = false;
    }

    static castToFolder(folder) {
        const folderObj = new Folder();
        folderObj.id = folder.id;
        folderObj.name = folder.name;
        folderObj.parentFolderId = folder.parentFolderId;
        folderObj.idUser = folder.idUser;
        folderObj.breadcrumb = folder.breadcrumb;
        folderObj.dateAdd = folder.dateAdd;
        folderObj.shared = folder.shared;
        folderObj.sharedWith = folder.sharedWith;
        return folderObj;
    }

    create(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();

        axios({
            method: 'post',
            url: `${window.API_URL}/folder`,
            headers: this.getHeaders(loggedInUser.token),
            data: {
                name: this.name,
                parentFolderId: Validate.isEmpty(this.parentFolderId)? -1 : this.parentFolderId,
            }
        }).then(function (response) {
            console.log("folder create success");
            successMethod(response);
        }).catch(function (error) {
            console.log("folder create error");
            errorMethod(error);
        });
    }

    static getFolders(contextName, successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const context = LayoutContext.getContext(contextName);
        const currentFolder = context.currentFolder;

        let urlParams = "";
        let currentFolderId = -1;
        if(Validate.isNotEmpty(currentFolder) && Validate.isNotEmpty(currentFolder.id)){
            currentFolderId = currentFolder.id;
        }
        urlParams = `?folderId=${currentFolderId}`;
        if (Validate.isNotEmpty(context.sortingPreferences.searchQuery)) {
            urlParams += `&searchQuery=${context.sortingPreferences.searchQuery}`;
        }

        axios({
            method: 'get',
            url: `${window.API_URL}/folders${urlParams}`,
            headers: this.getHeaders(loggedInUser.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    /*static loadFromLoalStorage(contextName=null){
        let currentFolder = localStorage.getItem("currentFolder");
        if (Validate.isEmpty(currentFolder)) {
            return new Folder();
        }

        let currentFolderJson = null;
        try {
            currentFolderJson = JSON.parse(currentFolder);
        } catch (e) {
            return new Folder();
        }

        if (currentFolderJson == null) {
            return new Folder();
        }

        const folderToReturn = new Folder();
        for (const property in currentFolderJson) {
            folderToReturn[property] = currentFolderJson[property];
        }
        return folderToReturn;
    }*/

    setCurrentFolderInLocalStorage(contextName=null){
        if(contextName == null){
            localStorage.setItem("currentFolder", JSON.stringify(this));
        }else{
            const context = LayoutContext.getContext(contextName)
            context.currentFolder = this;
            LayoutContext.saveContext(contextName,context);
        }
    }

    renameTo(newName, successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'put',
            url: `${window.API_URL}/folder/${this.id}/`,
            headers: this.getHeaders(authToken),
            data:{
                name:`${newName}`
            }
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getFolderDetails(idFolder, successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'get',
            url: `${window.API_URL}/folder/${idFolder}/`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    delete(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'delete',
            url: `${window.API_URL}/folder/${this.id}/`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    download(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const folder = this;

        // First create zip and download it
        axios({
            method: 'get',
            url: `${window.API_URL}/folder/${this.id}/zip`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {

            // Then validate the digital signature
            DigitalSignature.validate(response.data,(validationResponse) => {

                    // Download The file
                    const fileBytes = validationResponse.data.fileBytes;
                    const fileBlob = FileManager.createBlobFromFileBytes(fileBytes);
                    FileManager.downloadBlob(fileBlob, folder.name+".zip");

                    // And finally delete the zip file
                    Folder.deleteZipFolder(
                        folder.id,
                        successMethod ,
                        errorMethod
                    )

                },(response)=>{
                    console.log("error with the validation")
                    errorMethod(response);
                }
            )
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static deleteZipFolder(idFolder, successMethod, errorMethod){
        console.log("deletezipfolder");
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'delete',
            url: `${window.API_URL}/folder/${idFolder}/zip`,
            headers: this.getHeaders(authToken),
        }).then(function (response) {
            console.log("delete success")
            successMethod(response)
        }).catch(function (error) {
            console.log("delete error")
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
                type:"FOLDER"
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
                type:"FOLDER",
                users:usersToShareWith
            }
        }).then(function (response) {
            successMethod(response)
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getFoldersSharedWithUser(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const context = LayoutContext.getContext("sharedFilesContext");
        const currentFolder = context.currentFolder;

        let ajaxUrl = `${window.API_URL}/folders?onlyShared=true`;
        if (Validate.isNotEmpty(currentFolder) && Validate.isNotEmpty(currentFolder.id)) {
            ajaxUrl += `&folderId=${currentFolder.id}`;
        }else{
            ajaxUrl += `&folderId=-1`;
        }
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