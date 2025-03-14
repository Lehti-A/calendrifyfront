<template>
  <div
      class="modal"
      v-if="modalIsOpen"
      tabindex="-1"
      style="display: block; background-color: rgba(0,0,0,0.5);"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Navigate to
            <span v-if="selectedDate">
              {{ formatDate(selectedDate) }}
            </span>
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <p>Select which view you would like to see for this date:</p>
          <div class="mt-4 d-flex justify-content-center gap-3">
            <button type="button" class="btn btn-primary" @click="navigateToView('work')">
              Work Day View
            </button>
            <button type="button" class="btn btn-primary" @click="navigateToView('personal')">
              Personal Day View
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationServices from "@/services/NavigationServices";

export default {
  name: 'CalendarNavigationModal',
  props: {
    modalIsOpen: {
      type: Boolean,
      required: true
    },
    selectedDate: {
      type: Date,
      default: null
    }
  },

  methods: {

    closeModal() {
      this.$emit('event-close-modal');
    },

    formatDate(date) {
      if (!date) return '';

      const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      return date.toLocaleDateString(undefined, options);
    },

    navigateToView(viewType) {
      // Store the selected date in sessionStorage to access it in the target view
      const dateKey = this.formatDateKey(this.selectedDate);
      sessionStorage.setItem('selectedCalendarDate', dateKey);

      // Navigate to the appropriate view
      if (viewType === 'personal') {
        NavigationServices.navigateToPersonalDayView();
      } else if (viewType === 'work') {
        NavigationServices.navigateToWorkDayView();
      }

      // Close the modal
      this.closeModal();
    },

    formatDateKey(date) {
      if (!date) return '';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }
};
</script>

<style src="@/assets/css/calendarnavigationmodal.css" scoped></style>