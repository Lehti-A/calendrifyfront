// src/services/ActivityService.js
import axios from "axios";

export default {

    getActivities(dayId) {
        return axios.get('/activity', {
            params: {dayId}
        });
    },

    addActivity(newActivity) {
        return axios.post('/activity', newActivity);
    },

    updateActivityStatus(activityId, isDone) {
        return axios.patch('/activity', null, {
            params: {activityId, isDone}
        });
    },

    deleteActivity(activityId) {
        return axios.delete('/activity', {
            params: {activityId}
        });
    }
}