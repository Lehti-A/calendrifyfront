// src/services/ActivityService.js
import axios from "axios";

export default {
    /**
     * Get activities for a specific day
     * @param {Number} dayId - The day ID to fetch activities for
     * @returns {Promise} - Promise with the activities data
     */
    getActivities(dayId) {
        return axios.get('/activity', {
            params: { dayId }
        });
    },

    /**
     * Add a new activity
     * @param {Object} newActivity - Object containing topic and dayId
     * @returns {Promise} - Promise with the created activity
     */
    addActivity(newActivity) {
        return axios.post('/activity', newActivity);
    },

    /**
     * Update activity status (mark as done/not done)
     * @param {Number} activityId - ID of the activity to update
     * @param {Boolean} isDone - New completion status
     * @returns {Promise} - Promise with the update result
     */
    updateActivityStatus(activityId, isDone) {
        return axios.patch('/activity', null, {
            params: { activityId, isDone }
        });
    },

    /**
     * Delete an activity
     * @param {Number} activityId - ID of the activity to delete
     * @returns {Promise} - Promise with the deletion result
     */
    deleteActivity(activityId) {
        return axios.delete('/activity', {
            params: { activityId }
        });
    }
}