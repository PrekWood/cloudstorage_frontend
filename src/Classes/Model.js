import axios from "axios";

export default class Model {
    constructor() {

    }

    getHeaders(authToken = null, fileUpload = false) {
        let headers = {
            "Cache-Control": "no-cache",
            "Accept-Language": "en",
            "Content-Type": 'application/json',
            "Access-Control-Allow-Origin": '*',
        };
        if (fileUpload) {
            headers = {}
        }
        if (authToken != null) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }
        return headers;
    }

    static getHeaders(authToken = null, fileUpload = false) {
        let headers = {
            "Cache-Control": "no-cache",
            "Accept-Language": "en",
            "Content-Type": 'application/json',
            "Access-Control-Allow-Origin": '*',
        };
        if (fileUpload) {
            headers = {}
        }
        if (authToken != null) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }
        return headers;
    }

    isEmpty() {
        if (Object.keys(this).length == 0) {
            return true;
        }

        let allNull = true;
        for (const property in this) {
            if (this[property] != null) {
                allNull = false;
            }
        }
        return allNull;
    }
}