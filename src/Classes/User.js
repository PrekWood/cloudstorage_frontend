import axios from "axios";
import Validate from "./Validate";
import Model from "./Model";
import SortingPreferences from "./SortingPreferences";

export default class User extends Model {

    constructor() {
        super();
        this.idUser = null;
        this.email = null;
        this.token = null;
        this.password = null;
        this.phoneNumber = null;
        this.firstName = null;
        this.lastName = null;
        this.countryCodeId = null;
    }

    static castToUser(user) {
        const userObj = new User();
        userObj.idUser = user.idUser;
        userObj.email = user.email;
        userObj.token = user.token;
        userObj.password = user.password;
        userObj.phoneNumber = user.phoneNumber;
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.countryCodeId = user.countryCodeId;
        return userObj;
    }

    // getHeaders(authToken = null) {
    //     let headers = {
    //         "Cache-Control": "no-cache",
    //         "Accept-Language": "en",
    //         "Content-Type": 'application/json',
    //         "Access-Control-Allow-Origin": '*',
    //     };
    //     if (authToken != null) {
    //         headers["Authorization"] = `Bearer ${authToken}`;
    //     }
    //     return headers;
    // }

    login(successMethod, errorMethod, registerResponse = null) {
        console.log("user.login");
        axios({
            method: 'post',
            url: `${window.API_URL}/login?username=${this.email}&password=${this.password}`,
            headers: this.getHeaders(),
        }).then(function (response) {
            if (registerResponse != null) {
                response.registerResponse = registerResponse;
            }
            successMethod(response);
        }).catch(function (error) {
            console.log(error)
            errorMethod(error);
        });
    }

    register(successMethod, errorMethod) {
        console.log("user.register");
        const thisUser = this;

        // First Register
        axios({
            method: 'post',
            url: `${window.API_URL}/registration`,
            headers: this.getHeaders(),
            data: {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                phoneNumber: this.phoneNumber,
            }
        }).then(function (response) {
            // Then Login
            thisUser.login(successMethod, errorMethod, response)

        }).catch(function (error) {
            console.log(error);
            errorMethod(error);
        });
    }

    savePhoneNumberAndSendSms(successMethod, errorMethod) {
        console.log(`user.savePhoneNumberAndSendSms: ${this.token}, ${this.phoneNumber}`);

        axios({
            method: 'post',
            url: `${window.API_URL}/registration/otp`,
            headers: this.getHeaders(this.token),
            data: {
                phoneNumber: this.phoneNumber,
                idCountryCode: this.countryCodeId
            }
        }).then(function (response) {
            console.log("savePhoneNumberAndSendSms success");
            successMethod(response);
        }).catch(function (error) {
            console.log("savePhoneNumberAndSendSms error");
            errorMethod(error);
        });
    }

    static loadUserFromLocalStorage() {
        let logedInUser = localStorage.getItem("logedInUser");
        if (logedInUser == null || logedInUser == "" || logedInUser == undefined) {
            console.log("localStorage empty");
            return new User();
        }

        let logedInUserJson = null;
        try {
            logedInUserJson = JSON.parse(logedInUser);
        } catch (e) {
            console.log("cannot parse");
            return new User();
        }

        if (logedInUserJson == null) {
            return new User();
        }

        const userToReturn = new User();
        for (const property in logedInUserJson) {
            userToReturn[property] = logedInUserJson[property];
        }
        return userToReturn;
    }

    getUserDetails(successMethod, errorMethod) {
        axios({
            method: 'get',
            url: `${window.API_URL}/user/`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            console.log("getUserDetails success");
            successMethod(response);
        }).catch(function (error) {
            console.log("getUserDetails error");
            errorMethod(error);
        });
    }

    saveUserToLocalStorage() {
        localStorage.setItem("logedInUser", JSON.stringify(this));
    }



    validateOtp(otpCode, successMethod, errorMethod) {
        console.log(`user.validateOtp: ${this.token}, ${otpCode}`);
        if (otpCode == "" || otpCode == null || otpCode == undefined) {
            errorMethod();
        }

        axios({
            method: 'post',
            url: `${window.API_URL}/registration/otp-validation`,
            headers: this.getHeaders(this.token),
            data: {
                otpCode: otpCode,
            }
        }).then(function (response) {
            console.log("validateOtp success");
            successMethod(response);
        }).catch(function (error) {
            console.log("validateOtp error");
            errorMethod(error);
        });
    }

    resendSms(successMethod, errorMethod) {
        axios({
            method: 'post',
            url: `${window.API_URL}/registration/otp-resend`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            console.log("savePhoneNumberAndSendSms success");
            successMethod(response);
        }).catch(function (error) {
            console.log("savePhoneNumberAndSendSms error");
            errorMethod(error);
        });
    }

    checkIfLogedIn(successMethod, errorMethod) {
        console.log("checkIfLogedIn");
        axios({
            method: 'post',
            url: `${window.API_URL}/registration/is-loged-in`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            console.log("checkIfLogedIn success");
            successMethod(response);
        }).catch(function (error) {
            console.log("checkIfLogedIn error");
            errorMethod(error);
        });
    }

    getUserFiles(successMethod, errorMethod) {
        const sortingPrefs = SortingPreferences.loadFromLoalStorage();
        let ajaxUrl = `${window.API_URL}/files`;
        if (Validate.isNotEmpty(sortingPrefs.orderBy) && Validate.isNotEmpty(sortingPrefs.orderWay)) {
            ajaxUrl += `/${sortingPrefs.orderBy}/${sortingPrefs.orderWay}`;
        }
        if (Validate.isNotEmpty(sortingPrefs.searchQuery)) {
            ajaxUrl += `?searchQuery=${sortingPrefs.searchQuery}`;
        }
        if (Validate.isNotEmpty(sortingPrefs.onlyFavorites) && sortingPrefs.onlyFavorites) {
            ajaxUrl += `${ajaxUrl.includes("?") ? "&" : "?"}onlyFavorites=true`;
        }
        axios({
            method: 'get',
            url: ajaxUrl,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static clearTokenFromLocalStorage() {
        const user = User.loadUserFromLocalStorage();
        user.token = null;
        user.saveUserToLocalStorage();
    }

    logout(successMethod, errorMethod) {
        axios({
            method: 'post',
            url: `${window.API_URL}/logout`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            User.clearTokenFromLocalStorage();
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }
}