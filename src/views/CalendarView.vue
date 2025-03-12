<template>
  <div class="container-fluid px-4 pb-4 calendar-container">
    <!-- Header Row - Matching other views -->
    <div class="row mb-5 align-items-center header-row">
      <div class="col text-center">
        <h1 class="mb-1 fw-bold simple-header">
          CALENDAR
        </h1>
      </div>
    </div>

    <!-- Calendar Navigation Modal -->
    <CalendarNavigationModal
        :modal-is-open="navigationModalIsOpen"
        :selected-date="selectedDate"
        @event-close-modal="closeNavigationModal"
    />

    <!-- Main Two-Column Layout -->
    <div class="row">
      <!-- Left Column (Selected Day Details, Events) -->
      <div class="col-md-4 left-column">
        <!-- Selected Day Card -->
        <div class="card semi-transparent-card mb-3 selected-day-card" style="min-height: 124.8px;">
          <div class="card-header bg-transparent py-2">
            <strong>Today's date</strong>
          </div>
          <div class="card-body text-center p-0" v-if="selectedDate">
            <div class="calendar-card-selected">
              <div class="calendar-month">
                {{ getMonthName(selectedDate.getMonth()) }}
              </div>
              <div class="calendar-day">
                {{ selectedDate.getDate() }}
              </div>
              <div class="calendar-weekday">
                {{ getDayName(selectedDate.getDay()) }}
              </div>
            </div>
          </div>
          <div class="card-body text-center py-2" v-else>
            <p class="my-1">Select a date to view details</p>
          </div>
        </div>

        <!-- Personal Focus Card -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <strong>{{ currentMonthName }} {{ currentYear }} Personal Focus</strong>
            </div>
          </div>
          <div class="content-container personal-focuses" style="max-height: 300px;">
            <ul class="list-group list-group-flush" v-if="selectedDate && getPersonalFocuses().length > 0">
              <li v-for="focus in getPersonalFocuses()" :key="focus.id"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.isSelected }">{{ focus.topic }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.isSelected"
                      @change="toggleFocusCompletion(focus)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus(focus)"
                      title="Remove focus"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1" v-if="selectedDate">No personal focuses for this month</p>
              <p class="text-muted my-1" v-else>Select a date to view focuses</p>
            </div>
          </div>
          <!-- Add focus input field -->
          <div class="card-footer bg-transparent" v-if="selectedDate">
            <div class="input-group">
              <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Add new personal focus..."
                  v-model="newPersonalFocus"
                  @keyup.enter="addPersonalFocus"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addPersonalFocus">Add</button>
            </div>
          </div>
        </div>

        <!-- Work Focus Card -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <strong>{{ currentMonthName }} {{ currentYear }} Work Focus</strong>
            </div>
          </div>
          <div class="content-container work-focuses" style="max-height: 210px;">
            <ul class="list-group list-group-flush" v-if="selectedDate && getWorkFocuses().length > 0">
              <li v-for="focus in getWorkFocuses()" :key="focus.id"
                  class="list-group-item py-2 d-flex justify-content-between align-items-center">
                <span :class="{ 'completed-focus': focus.isSelected }">{{ focus.topic }}</span>
                <div class="focus-actions">
                  <input
                      type="checkbox"
                      class="form-check-input ms-2"
                      :checked="focus.isSelected"
                      @change="toggleFocusCompletion(focus)"
                  >
                  <button
                      class="btn btn-sm btn-link text-danger p-0"
                      @click="removeFocus(focus)"
                      title="Remove focus"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </li>
            </ul>
            <div v-else class="card-body text-center py-2">
              <p class="text-muted my-1" v-if="selectedDate">No work focuses for this month</p>
              <p class="text-muted my-1" v-else>Select a date to view focuses</p>
            </div>
          </div>
          <!-- Add focus input field -->
          <div class="card-footer bg-transparent" v-if="selectedDate">
            <div class="input-group">
              <input
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Add new work focus..."
                  v-model="newWorkFocus"
                  @keyup.enter="addWorkFocus"
              >
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="addWorkFocus">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Calendar + Quote) -->
      <div class="col-md-8 right-column">
        <!-- Daily Quote Card -->
        <div class="card semi-transparent-card mb-3 quote-card" style="min-height: 130px;">
          <div class="card-header bg-transparent py-2">
            <strong>Daily Inspiration</strong>
          </div>
          <div class="card-body py-2 d-flex flex-column" style="height: 117px;">
            <div class="quote-container mb-">
              <p class="quote-text">{{ quote }}</p>
            </div>
            <div class="mt-auto">
              <button class="btn btn-sm btn-outline-secondary" @click="fetchQuote">
                New Quote
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Month Navigation -->
        <div class="card semi-transparent-card mb-3">
          <div class="card-header bg-transparent py-2 d-flex justify-content-between align-items-center">
            <button class="btn btn-sm btn-outline-secondary" @click="previousMonth">
              <span>&laquo; Previous</span>
            </button>
            <h3 class="m-0" style="font-size: 1.25rem;">{{ currentMonthName }} {{ currentYear }}</h3>
            <button class="btn btn-sm btn-outline-secondary" @click="nextMonth">
              <span>Next &raquo;</span>
            </button>
          </div>
          <div class="card-body">
            <!-- Days of Week Headers -->
            <div class="calendar-week-header">
              <div v-for="day in daysOfWeek" :key="day" class="calendar-day-name">
                {{ day }}
              </div>
            </div>

            <!-- Calendar Grid - Modified to remove focus indicators -->
            <div class="calendar-grid">
              <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="calendar-day-cell"
                  :class="{
                  'other-month': !day.isCurrentMonth,
                  'current-day': day.isToday
                }"
                  @click="selectDate(day)"
                  @dblclick="handleDayDoubleClick(day)"
              >
                <div class="day-number">{{ day.dayNumber }}</div>
                <!-- Removed focus indicator dots -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CalendarNavigationModal from "@/components/modal/CalendarNavigationModal.vue";
import navigationServices from "@/services/NavigationServices";

export default {
  name: "CalendarView",
  components: {
    CalendarNavigationModal
  },
  created() {
    // Set today as the selected date initially
    this.selectedDate = new Date();

    // Fetch a quote when component is created
    this.fetchQuote();

    // Get user ID from session storage
    this.userId = Number(sessionStorage.getItem('userId'));

    // Load month focuses for the current month
    this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
  },

  data() {
    return {
      // API base URL
      apiBaseUrl: "",

      // User ID from session storage
      userId: Number(sessionStorage.getItem('userId')),

      // Current view month and year
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),

      // Selected date
      selectedDate: null,

      // Modal state
      navigationModalIsOpen: false,

      // New input fields for focus addition
      newPersonalFocus: '',
      newWorkFocus: '',

      // Quote text
      quote: "The way to get started is to quit talking and begin doing. - Walt Disney",

      // Focuses storage
      personalFocuses: [],    // Personal focuses for the current month
      workFocuses: [],        // Work focuses for the current month

      // Days of week for calendar header
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

      // Loading state
      isLoading: false
    };
  },

  computed: {
    // Get month name
    currentMonthName() {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[this.currentMonth];
    },

    // Generate calendar days for the current month view
    calendarDays() {
      const days = [];

      // Get first day of month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const startingDayOfWeek = firstDay.getDay();

      // Get number of days in current month
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Get today's date info for highlighting the current day
      const today = new Date();
      const isCurrentMonth = today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear;
      const todayDate = today.getDate();

      // Previous month's days to display
      const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      const prevMonthYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
      const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

      // Add previous month's days
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        days.push({
          dayNumber: day,
          isCurrentMonth: false,
          isToday: false,
          date: new Date(prevMonthYear, prevMonth, day)
        });
      }

      // Add current month's days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          dayNumber: day,
          isCurrentMonth: true,
          isToday: isCurrentMonth && day === todayDate,
          date: new Date(this.currentYear, this.currentMonth, day)
        });
      }

      // Next month's days to fill the calendar grid (to make 6 rows)
      const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
      const nextMonthYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
      const totalDays = 42; // 6 rows of 7 days

      const remainingDays = totalDays - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        days.push({
          dayNumber: day,
          isCurrentMonth: false,
          isToday: false,
          date: new Date(nextMonthYear, nextMonth, day)
        });
      }

      return days;
    }
  },

  methods: {
    // Load focuses for the current month
    async loadMonthFocuses(month, year) {
      this.isLoading = true;

      // Reset focuses arrays
      this.personalFocuses = [];
      this.workFocuses = [];

      try {
        // Load personal focuses for the month
        const personalResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            type: 'P'
          }
        });

        // Store personal focuses
        this.personalFocuses = personalResponse.data;

        // Load work focuses for the month
        const workResponse = await axios.get(`${this.apiBaseUrl}/focuses`, {
          params: {
            userId: this.userId,
            monthNumber: month,
            year: year,
            type: 'W'
          }
        });

        // Store work focuses
        this.workFocuses = workResponse.data;

      } catch (error) {
        console.error("Error loading month focuses:", error);
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Create a new focus
    async createFocus(topic, type) {
      if (!topic.trim()) return;

      try {
        // Create the focus on the server
        await axios.post(`${this.apiBaseUrl}/focus`, {
          userId: this.userId,
          topic: topic,
          monthNumber: this.selectedDate.getMonth() + 1,
          year: this.selectedDate.getFullYear(),
          type: type
        });

        // Reload focuses for the current month
        await this.loadMonthFocuses(
            this.selectedDate.getMonth() + 1,
            this.selectedDate.getFullYear()
        );
      } catch (error) {
        console.error("Error creating focus:", error);
        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Update a focus's selection status
    async updateFocusSelection(focus) {
      try {
        // Store original state in case we need to revert
        const originalIsSelected = focus.isSelected;

        // Optimistically update the UI
        focus.isSelected = !focus.isSelected;

        // Call the API
        await axios.patch(`${this.apiBaseUrl}/focus`, null, {
          params: {
            focusId: focus.id,
            isSelected: focus.isSelected
          }
        });
      } catch (error) {
        console.error("Error updating focus:", error);

        // Revert changes on failure
        focus.isSelected = !focus.isSelected;

        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        }
      }
    },

    // Delete a focus
    async deleteFocus(focus) {
      try {
        // Delete on the server
        await axios.delete(`${this.apiBaseUrl}/focus`, {
          params: { focusId: focus.id }
        });

        // Reload focuses for the current month
        await this.loadMonthFocuses(
            this.selectedDate.getMonth() + 1,
            this.selectedDate.getFullYear()
        );
      } catch (error) {
        console.error("Error deleting focus:", error);

        if (error.response && error.response.status === 403) {
          navigationServices.navigateToErrorView();
        } else {
          // Reload focuses again to ensure UI is in sync
          await this.loadMonthFocuses(
              this.selectedDate.getMonth() + 1,
              this.selectedDate.getFullYear()
          );
        }
      }
    },

    // Navigation methods
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }

      // Load focuses for the new month
      this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }

      // Load focuses for the new month
      this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
    },

    // Date selection
    selectDate(day) {
      // Update the selected date
      this.selectedDate = new Date(day.date);

      // If the month changed, load focuses for the new month
      if (day.date.getMonth() !== this.currentMonth ||
          day.date.getFullYear() !== this.currentYear) {
        this.currentMonth = day.date.getMonth();
        this.currentYear = day.date.getFullYear();
        this.loadMonthFocuses(this.currentMonth + 1, this.currentYear);
      }
    },

    // Get month name by index
    getMonthName(monthIndex) {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return months[monthIndex];
    },

    // Get day name by index
    getDayName(dayIndex) {
      const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
      ];
      return days[dayIndex];
    },

    // Navigation modal methods
    openNavigationModal() {
      this.navigationModalIsOpen = true;
    },

    closeNavigationModal() {
      this.navigationModalIsOpen = false;
    },

    handleDayDoubleClick(day) {
      this.selectDate(day);
      this.openNavigationModal();
    },

    // Focus addition methods
    async addPersonalFocus() {
      if (!this.newPersonalFocus.trim()) return;

      await this.createFocus(this.newPersonalFocus, 'P');
      this.newPersonalFocus = '';
    },

    async addWorkFocus() {
      if (!this.newWorkFocus.trim()) return;

      await this.createFocus(this.newWorkFocus, 'W');
      this.newWorkFocus = '';
    },

    // Focus action methods - these are the public methods used in the template
    async toggleFocusCompletion(focus) {
      await this.updateFocusSelection(focus);
    },

    async removeFocus(focus) {
      await this.deleteFocus(focus);
    },

    // Focus filtering methods - these return focuses for the UI
    getPersonalFocuses() {
      return this.personalFocuses;
    },

    getWorkFocuses() {
      return this.workFocuses;
    },

    // Fetch quote from API
    async fetchQuote() {
      const API_KEY = "LEYV9brNOkL8XXrRckzhbQ==0eV9fA97U9SIpoyC";
      try {
        const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
          headers: {
            "X-Api-Key": API_KEY
          }
        });
        if (response.data && response.data.length > 0) {
          this.quote = response.data[0].quote;
          if (response.data[0].author) {
            this.quote += " - " + response.data[0].author;
          }
        } else {
          this.quote = "The best way to predict the future is to create it. - Abraham Lincoln";
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        this.quote = "The best way to predict the future is to create it. - Abraham Lincoln";
      }
    }
  },

  watch: {
    // Watch for changes to the selected date
    selectedDate(newDate) {
      if (newDate) {
        // If the month or year changed, load the focuses for the new month
        const newMonth = newDate.getMonth() + 1;
        const newYear = newDate.getFullYear();

        if (newMonth !== this.currentMonth + 1 || newYear !== this.currentYear) {
          this.currentMonth = newDate.getMonth();
          this.currentYear = newDate.getFullYear();
          this.loadMonthFocuses(newMonth, newYear);
        }
      }
    }
  }
};
</script>

<style src="@/assets/css/calendarview.css" scoped></style>