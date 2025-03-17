import axios from "axios";

export default {

    addNewDay(newDay) {
        return axios.post('/day', newDay);
    },

    getDayInfo(dayId) {
        return axios.get('/day', {
            params: {dayId: dayId}
        });
    },

    updateDayFocus(updateFocusDay) {
        const requestData = {
            id: updateFocusDay.dayId,
            focus: updateFocusDay.focus
        }
        return axios.patch('/day-focus', requestData);
    },

    updateDayThought(updateThoughtDay) {
        const requestData = {
            id: updateThoughtDay.dayId,
            thoughts: updateThoughtDay.thoughts
        };
        return axios.patch('/day-thought', requestData);
    }
}