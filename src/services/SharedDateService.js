
export default {
    selectedDate: null,


    formatDateString(date) {
        if (!date) return null;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    parseFromString(dateString) {
        if (!dateString) return new Date();
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    },

    saveDate(date) {
        this.selectedDate = this.formatDateString(date);
        sessionStorage.setItem('activeDate', this.selectedDate);
    },

    getDate() {
        if (!this.selectedDate) {
            this.selectedDate = sessionStorage.getItem('activeDate');
        }
        return this.selectedDate ? this.parseFromString(this.selectedDate) : new Date();
    },

    clearDate() {
        this.selectedDate = null;
        sessionStorage.removeItem('activeDate');
    }
};