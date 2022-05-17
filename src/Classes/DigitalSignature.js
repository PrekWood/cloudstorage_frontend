import Model from "./Model";
import User from "./User";
import axios from "axios";
import FileManager from "./FileManager";

export default class DigitalSignature {
    static validate(downloadResponse, successMethod, errorMethod){
        const loggedInUser = User.loadUserFromLocalStorage();
        axios({
            method: 'post',
            url: `${window.API_URL}/validate-signature`,
            headers: Model.getHeaders(),
            data: {
                //digitalSignature: "test_"+downloadResponse.digitalSignature,
                //file: "test_"+FileManager.base64ToHex(downloadResponse.file),
                digitalSignature: downloadResponse.digitalSignature,
                file: FileManager.base64ToHex(downloadResponse.file),
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}
