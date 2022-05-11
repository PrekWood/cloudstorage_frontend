import axios from "axios";
import Model from "./Model";

export default class CountryCodes {


    static getAllCountryCodes(successMethod, errorMethod) {

        axios({
            method: 'get',
            url: `${window.API_URL}/country-codes`,
            headers: {
                "Cache-Control": "no-cache",
                "Accept-Language": "en",
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}