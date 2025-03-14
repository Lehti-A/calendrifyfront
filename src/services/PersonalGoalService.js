import axios from 'axios';

class PersonalGoalService {
    // ===== Personal Goals (Day-specific) =====

    // Get all personal goals for a specific day
    getPersonalGoals(dayId) {
        return axios.get('/personal-goal', {
            params: { dayId }
        });
    }

    // Add a new personal goal for a specific day
    addPersonalGoal(newGoal, dayId) {
        return axios.post('/personal-goal', newGoal, {
            params: { dayId }
        });
    }

    // Update personal goal's completion status
    updatePersonalGoalStatus(personalGoalId, isDone) {
        return axios.patch('/personal-goal', null, {
            params: { personalGoalId, isDone }
        });
    }

    // Delete a personal goal
    deletePersonalGoal(personalGoalId) {
        return axios.delete('/personal-goal', {
            params: { personalGoalId }
        });
    }

    // ===== Personal Goal Templates (Settings) =====

    // Get all personal goal templates for a user
    getPersonalGoalTemplates(userId) {
        return axios.get('/settings-personal-goal', {
            params: { userId }
        });
    }

    // Add a new personal goal template
    addPersonalGoalTemplate(topic, userId) {
        return axios.post('/settings-personal-goal', { topic }, {
            params: { userId }
        });
    }

    // Delete a personal goal template
    deletePersonalGoalTemplate(personalGoalTemplateId) {
        return axios.delete('/settings-personal-goal', {
            params: { personalGoalTemplateId }
        });
    }

    // Create personal goals for a day based on templates
    createGoalsFromTemplates(templates, dayId) {
        const promises = templates.map(template => {
            return this.addPersonalGoal({ topic: template.topic }, dayId);
        });

        return Promise.all(promises);
    }
}

export default new PersonalGoalService();