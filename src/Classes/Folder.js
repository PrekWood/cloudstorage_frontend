import Model from "./Model";
import axios from "axios";
import User from "./User";
import Validate from "./Validate";

export default class Folder extends Model {
    constructor() {
        super();
        this.id = null;
        this.name = null;
        this.parentFolderId = null;
        this.idUser = null;
        this.breadcrumb = null;
        this.dateAdd = null;
    }

    static castToFolder(folder) {
        const folderObj = new Folder();
        folderObj.id = folder.id;
        folderObj.name = folder.name;
        folderObj.parentFolderId = folder.parentFolderId;
        folderObj.idUser = folder.idUser;
        folderObj.breadcrumb = folder.breadcrumb;
        folderObj.dateAdd = folder.dateAdd;
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
                parentFolderId: this.parentFolderId,
            }
        }).then(function (response) {
            console.log("folder create success");
            successMethod(response);
        }).catch(function (error) {
            console.log("folder create error");
            errorMethod(error);
        });
    }

    static getFolders(successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        const currentFolder = Folder.loadFromLoalStorage();
        let urlParams = "";
        if(currentFolder.parentFolderId != null){
            urlParams = `?folderId=${currentFolder.id}`;
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

    static loadFromLoalStorage(){
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
    }

    setCurrentFolderInLocalStorage(){
        localStorage.setItem("currentFolder", JSON.stringify(this));
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
}