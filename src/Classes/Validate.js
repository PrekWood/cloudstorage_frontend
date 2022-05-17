export default class Validate {

    static isEmail(text) {
        const regex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(String(text).toLowerCase())
    }

    static isNotEmpty(text) {
        return !(text === "" || text === null || text === undefined || text === "null");
    }

    static isEmpty(text) {
        return text === "" || text === null || text === undefined || text === "null";
    }

    static isArrayEmpty(arr) {
        return arr === null || arr === undefined || arr.length === 0;
    }

    static hasAtLeast3Chars(text) {
        return text.length > 3;
    }

    static hasAtLeast8Chars(text) {
        return text.length > 8;
    }

    static containsNumber(text) {
        var hasNumber = /\d/;
        return hasNumber.test(text);
    }

    static containsOnlyLetters(text) {
        var containsOnlyLettersRegex = /^[A-Za-zα-ωΑ-Ω]+$/;
        return containsOnlyLettersRegex.test(text);
    }

    static containsOnlyNumbers(text) {
        var containsOnlyNumbersRegex = /^[0-9]+$/;
        return containsOnlyNumbersRegex.test(text);
    }

    static has10Characters(text) {
        return text.length == 10;
    }

    static has1Character(text) {
        return text.length == 1;
    }

}