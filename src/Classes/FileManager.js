export default class FileManager {

    //https://stackoverflow.com/questions/35038884/download-file-from-bytes-in-javascript
    static base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }
    //https://dev.to/nombrekeff/download-file-from-blob-21ho
    static downloadBlob(blob, name = 'file.txt') {
        if (
            window.navigator &&
            window.navigator.msSaveOrOpenBlob
        ) return window.navigator.msSaveOrOpenBlob(blob);

        // For other browsers:
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = data;
        link.download = name;

        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
        }, 100);
    }

    static createBlobFromFileBytes(fileBytes) {
        const fileBuffer = FileManager.base64ToArrayBuffer(fileBytes);
        return new Blob([fileBuffer])
    }

    static base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }
}