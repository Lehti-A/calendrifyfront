import axios from "axios";

export default {
    /**
     * Get meetings for a specific day
     * @param {Number} dayId - The day ID to fetch meetings for
     * @returns {Promise} - Promise with the meetings data
     */
    getMeetings(dayId) {
        return axios.get('/meeting', {
            params: {dayId}
        });
    },

    /**
     * Add a new meeting
     * @param {Object} newMeeting - Object containing time, subject, and dayId
     * @returns {Promise} - Promise with the created meeting
     */
    addMeeting(newMeeting) {
        // Ensure properties match exactly what backend expects
        const requestData = {
            time: newMeeting.time,
            subject: newMeeting.subject,
            dayId: newMeeting.dayId
        };

        return axios.post('/meeting', requestData);
    },

    /**
     * Delete a meeting
     * @param {Number} meetingId - ID of the meeting to delete
     * @returns {Promise} - Promise with the deletion result
     */
    deleteMeeting(meetingId) {
        return axios.delete('/meeting', {
            params: {meetingId}
        });
    }
}