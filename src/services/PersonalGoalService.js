import axios from 'axios';

class PersonalGoalService {

    getPersonalGoals(dayId) {
        return axios.get('/personal-goal', {
            params: {dayId}
        });
    }

    addPersonalGoal(newGoal, dayId) {
        return axios.post('/personal-goal', newGoal, {
            params: {dayId}
        });
    }

    updatePersonalGoalStatus(personalGoalId, isDone) {
        return axios.patch('/personal-goal', null, {
            params: {personalGoalId, isDone}
        });
    }

    deletePersonalGoal(personalGoalId) {
        return axios.delete('/personal-goal', {
            params: {personalGoalId}
        });
    }

    getPersonalGoalTemplates(userId) {
        return axios.get('/settings-personal-goal', {
            params: {userId}
        });
    }

    addPersonalGoalTemplate(topic, userId) {
        return axios.post('/settings-personal-goal', {topic}, {
            params: {userId}
        });
    }

    deletePersonalGoalTemplate(personalGoalTemplateId) {
        return axios.delete('/settings-personal-goal', {
            params: {personalGoalTemplateId}
        });
    }

    createGoalsFromTemplates(templates, dayId) {
        const promises = templates.map(template => {
            return this.addPersonalGoal({topic: template.topic}, dayId);
        });

        return Promise.all(promises);
    }
}

export default new PersonalGoalService();