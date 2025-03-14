import axios from "axios";

export default {
    /**
     * Adds a new day or retrieves existing day data
     * @param {Object} newDay - Object containing userId, date, and type
     * @returns {Promise} - Promise with the day data
     */
    addNewDay(newDay) {
        return axios.post('/day', newDay);
    },

    /**
     * Fetches day information by dayId
     * @param {Number} dayId - The day ID to fetch
     * @returns {Promise} - Promise with the day information
     */
    getDayInfo(dayId) {
        return axios.get('/day', {
            params: {dayId: dayId}
        });
    },

    /**
     * Updates the focus for a specific day
     * @param {Object} updateFocusDay - Object containing id and focus
     * @returns {Promise} - Promise with the update result
     */
    updateDayFocus(updateFocusDay) {

        const requestData = {
            id: updateFocusDay.dayId,
            focus: updateFocusDay.focus
        }
        return axios.patch('/day-focus', requestData);
    },

    /**
     * Updates the thoughts for a specific day
     * @param {Object} updateThoughtDay - Object containing id and thoughts
     * @returns {Promise} - Promise with the update result
     */
    updateDayThought(updateThoughtDay) {
        const requestData = {
            id: updateThoughtDay.dayId,
            thoughts: updateThoughtDay.thoughts
        };
        return axios.patch('/day-thought', requestData);
    }
}