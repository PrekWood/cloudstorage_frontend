import Model from "./Model";
import axios from "axios";

export default class Shareable extends Model {
    static getFileByAccessToken(accessToken, successMethod, errorMethod){
        axios({
            method: 'get',
            url: `${window.API_URL}/share?accessToken=${accessToken}`,
            headers: this.getHeaders(),
        }).then(function (response) {
            console.log("getFileByAccessToken  success");
            successMethod(response);
        }).catch(function (error) {
            console.log("getFileByAccessToken  error");
            errorMethod(error);
        });
    }

    generateShareableLink(successMethod, errorMethod){}

    shareWithUsers(userIds, successMethod, errorMethod){}
}