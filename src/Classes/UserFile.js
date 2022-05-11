import axios from "axios";
import Model from "./Model";
import User from "./User";
import Validate from "./Validate";
import FileManager from "./FileManager";
import SortingPreferences from "./SortingPreferences";
import Folder from "./Folder";
import DigitalSignature from "./DigitalSignature";

export default class UserFile extends Model {

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
        return fileObj;
    }

    uploadFile(successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        const formData = new FormData()
        formData.append("file", this.fileToUpload);
        formData.append("folderId", Folder.loadFromLoalStorage().id);

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
            successMethod(response);
        }).catch((error) => {
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
            url: `${window.API_URL}/file/${this.id}`,
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


    // static search(searchQuery, successMethod, errorMethod) {
    //     const loggedInUser = User.loadUserFromLocalStorage();
    //     const authToken = loggedInUser.token;
    //     let ajaxUrl = `${window.API_URL}/files`;
    //     const sortingPrefs = SortingPreferences.loadFromLoalStorage();
    //     if (Validate.isNotEmpty(sortingPrefs.orderBy) && Validate.isNotEmpty(sortingPrefs.orderWay)) {
    //         ajaxUrl += `/${sortingPrefs.orderBy}/${sortingPrefs.orderWay}`;
    //     }
    //     ajaxUrl += `?searchQuery=${searchQuery}`;
    //     if (Validate.isNotEmpty(sortingPrefs.onlyFavorites) && sortingPrefs.onlyFavorites) {
    //         ajaxUrl += `&onlyFavorites=true`;
    //     }

    //     console.log(ajaxUrl);
    //     axios({
    //         method: 'get',
    //         url: ajaxUrl,
    //         headers: Model.getHeaders(authToken),
    //         data: {
    //             searchQuery: searchQuery
    //         }
    //     }).then(function (response) {
    //         successMethod(response)
    //     }).catch(function (error) {
    //         errorMethod(error);
    //     });
    // }



}