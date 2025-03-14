import axios from "axios";

export default {
    /**
     * Uploads a new image for a specific day
     * @param {Number} dayId - The day ID to associate the image with
     * @param {Uint8Array} imageData - The image data as byte array
     * @returns {Promise} - Promise with the upload result
     */
    uploadImage(dayId, imageData) {
        return axios.post('/image', {
            dayId: dayId,
            data: imageData
        });
    },

    /**
     * Fetches image for a specific day
     * @param {Number} dayId - The day ID to fetch the image for
     * @returns {Promise} - Promise with the image data
     */
    getImage(dayId) {
        return axios.get('/image', {
            params: {dayId: dayId}
        });
    },

    /**
     * Deletes an image by its ID
     * @param {Number} imageId - The image ID to delete
     * @returns {Promise} - Promise with the deletion result
     */
    deleteImage(imageId) {
        return axios.delete('/image', {
            params: {imageId: imageId}
        });
    },

    /**
     * Convert a File object to a byte array
     * @param {File} file - The file to convert
     * @returns {Promise<Uint8Array>} - Promise with the byte array
     */
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

    /**
     * Convert a byte array to a base64 data URL for display
     * @param {Uint8Array|String} byteArray - The byte array or base64 string to convert
     * @returns {string} - Base64 data URL
     */
    byteArrayToDataUrl(byteArray) {
        // If the input is already a string (likely base64), check if it's a valid data URL
        if (typeof byteArray === 'string') {
            // If it already looks like a data URL, return it
            if (byteArray.startsWith('data:')) {
                return byteArray;
            }

            // It might be a base64 string without the data: prefix
            try {
                // Let's check if it's a valid base64 string with a WebP header
                if (byteArray.startsWith('UklGR') || byteArray.startsWith('RIFF')) {
                    return `data:image/webp;base64,${byteArray}`;
                }

                // For other image formats, default to JPEG
                return `data:image/jpeg;base64,${byteArray}`;
            } catch (e) {
                return null;
            }
        }

        // If the input is an empty array or null
        if (!byteArray || (Array.isArray(byteArray) && byteArray.length === 0)) {
            return null;
        }

        // Handle byte array conversion
        const bytes = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(byteArray);

        // Convert byte array to base64
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const base64 = window.btoa(binary);

        // Guess the MIME type
        let mimeType = 'image/jpeg';
        if (bytes.length > 8 &&
            bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 &&
            bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) {
            mimeType = 'image/png';
        }

        return `data:${mimeType};base64,${base64}`;
    }
}