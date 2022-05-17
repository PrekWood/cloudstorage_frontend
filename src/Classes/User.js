import axios from "axios";
import Validate from "./Validate";
import Model from "./Model";
import SortingPreferences from "./SortingPreferences";
import Folder from "./Folder";
import LayoutContext from "./LayoutContext";

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
        this.id = null;
        this.imagePath = null;
    }

    static castToUser(user) {
        const userObj = new User();
        userObj.id = user.id;
        userObj.idUser = user.idUser;
        userObj.email = user.email;
        userObj.token = user.token;
        userObj.password = user.password;
        userObj.phoneNumber = user.phoneNumber;
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.countryCodeId = user.countryCodeId;
        userObj.imagePath = user.imagePath;
        return userObj;
    }


    login(successMethod, errorMethod, registerResponse = null) {
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
        const thisUser = this;

        // First Register
        axios({
            method: 'post',
            url: `${window.API_URL}/user`,
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
        let loggedInUser = localStorage.getItem("loggedInUser");
        if (loggedInUser == null || loggedInUser == "" || loggedInUser == undefined) {
            return new User();
        }

        let loggedInUserJson = null;
        try {
            loggedInUserJson = JSON.parse(loggedInUser);
        } catch (e) {
            return new User();
        }

        if (loggedInUserJson == null) {
            return new User();
        }

        const userToReturn = new User();
        for (const property in loggedInUserJson) {
            userToReturn[property] = loggedInUserJson[property];
        }
        return userToReturn;
    }

    getUserDetails(successMethod, errorMethod) {
        axios({
            method: 'get',
            url: `${window.API_URL}/user/`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static getUserDetailsByEmail(email, successMethod, errorMethod) {
        const loggedInUser = User.loadUserFromLocalStorage();
        const authToken = loggedInUser.token;
        axios({
            method: 'get',
            url: `${window.API_URL}/user?email=${email}`,
            headers: Model.getHeaders(authToken),
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    saveUserToLocalStorage() {
        localStorage.setItem("loggedInUser", JSON.stringify(this));
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

    getFiles(contextName, successMethod, errorMethod, isRecent = false) {
        const context = LayoutContext.getContext(contextName);
        const sortingPrefs = context.sortingPreferences;
        const currentFolder = context.currentFolder;

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
        if (!isRecent) {
            if (Validate.isNotEmpty(currentFolder) && Validate.isNotEmpty(currentFolder.id)) {
                ajaxUrl += `${ajaxUrl.includes("?") ? "&" : "?"}folderId=${currentFolder.id}`;
            } else {
                ajaxUrl += `${ajaxUrl.includes("?") ? "&" : "?"}folderId=-1`;
            }
        } else {
            ajaxUrl += `${ajaxUrl.includes("?") ? "&" : "?"}allFiles=true&folderId=-1`;
        }

        axios({
            method: 'get',
            url: ajaxUrl,
            headers: this.getHeaders(this.token),
            data: {}
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    static clearDataFromLocalStorage() {
        localStorage.setItem("allFilesContext", null);
        localStorage.setItem("currentFolder", null);
        localStorage.setItem("loggedInUser", null);
        localStorage.setItem("recentFilesContext", null);
        localStorage.setItem("sharedFilesContext", null);
        localStorage.setItem("sortingPreferences", null);
    }

    logout(successMethod, errorMethod) {
        axios({
            method: 'post',
            url: `${window.API_URL}/logout`,
            headers: this.getHeaders(this.token),
        }).then(function (response) {
            User.clearDataFromLocalStorage();
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }

    updateImage(fileToUpload, successMethod, errorMethod) {
        const formData = new FormData()
        formData.append("file", fileToUpload);

        axios.put(
            `${window.API_URL}/user/image`,
            formData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': `multipart/form-data`,
                }
            }
        ).then((response) => {
            successMethod(response);
        }).catch((error) => {
            errorMethod(error);
        });
    }

    update(successMethod, errorMethod) {
        axios({
            method: 'put',
            url: `${window.API_URL}/user`,
            headers: this.getHeaders(this.token),
            data:{
                firstName:this.firstName,
                lastName:this.lastName,
                phoneNumber:this.phoneNumber,
            }
        }).then(function (response) {
            successMethod(response);
        }).catch(function (error) {
            errorMethod(error);
        });
    }


}