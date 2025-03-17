import axios from "axios";

export default {

    uploadImage(dayId, imageData) {
        return axios.post('/image', {
            dayId: dayId,
            data: imageData
        });
    },

    getImage(dayId) {
        return axios.get('/image', {
            params: {dayId: dayId}
        });
    },

    deleteImage(imageId) {
        return axios.delete('/image', {
            params: {imageId: imageId}
        });
    },

    fileToByteArray(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const byteArray = new Uint8Array(arrayBuffer);
                resolve(byteArray);
            };
            reader.onerror = error => reject(error);
            reader.readAsArrayBuffer(file);
        });
    },

    byteArrayToDataUrl(byteArray) {
        if (typeof byteArray === 'string') {
            if (byteArray.startsWith('data:')) {
                return byteArray;
            }

            try {
                if (byteArray.startsWith('UklGR') || byteArray.startsWith('RIFF')) {
                    return `data:image/webp;base64,${byteArray}`;
                }

                return `data:image/jpeg;base64,${byteArray}`;
            } catch (e) {
                return null;
            }
        }

        if (!byteArray || (Array.isArray(byteArray) && byteArray.length === 0)) {
            return null;
        }

        const bytes = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(byteArray);

        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = window.btoa(binary);

        let mimeType = 'image/jpeg';
        if (bytes.length > 8 &&
            bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 &&
            bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
            mimeType = 'image/png';
        }

        return `data:${mimeType};base64,${base64}`;
    }
}