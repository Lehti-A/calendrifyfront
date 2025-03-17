import axios from "axios";

export default {

    getMeetings(dayId) {
        return axios.get('/meeting', {
            params: {dayId}
        });
    },

    addMeeting(newMeeting) {
        const requestData = {
            time: newMeeting.time,
            subject: newMeeting.subject,
            dayId: newMeeting.dayId
        };

        return axios.post('/meeting', requestData);
    },

    deleteMeeting(meetingId) {
        return axios.delete('/meeting', {
            params: {meetingId}
        });
    }
}